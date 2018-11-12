var express = require('express');
var router = express.Router();
// md5 加密函数库
const md5 = require('blueimp-md5');
// 引入 UserModel
const models = require('../db/models');
const UserModel = models.UserModel;
const ChatModel = models.ChatModel;
const filter = {password: 0, __v: 0};
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

// 注册一个路由，完成用户注册功能
router.post('/register',function(req,res) {
  
  const {username,password,type} = req.body;
  UserModel.findOne({username},function(err,user){
    if(user) {
      res.send({code:1,msg:'此用户已存在'});
    }
    else {
      new UserModel({username,password:md5(password),type}).save(function(err,user){
        res.cookie('userid',user._id,{maxAge:1000*60*60*24*7});
        res.send({code:0,data:{_id: user._id,username,type}});
      })
    }
  })
})

// 登录路由
router.post('/login',function(req,res){
  const {username,password} = req.body;
  UserModel.findOne({username,password:md5(password)},filter,function(err,user){
    if(user) {
      res.cookie('userid',user._id,{maxAge: 1000*60*60*24*7});
      res.send({code:0,data:user});
      
    }
    else {
      res.send({code:1,msg:'用户名或密码错误'});
    }
  })
})

// 更新用户信息路由
router.post('/update',function(req,res){
  const userId = req.cookies.userid;

  // 如果不存在userid,结束并返回信息
  if(!userId) {
    return res.send({code:1,msg:"请登录！"});
  }

  // 根据userid 更新对应用户信息
  UserModel.findByIdAndUpdate({_id:userId},req.body,function(err,user){//user 是原来的user
    const {_id,username,type} = user;

    // assign(obj1,obj2,obj3,...) 对象合并
    const data = Object.assign(req.body,{_id,username,type});
    res.send({code:0 ,data});
  })
})

// 获取用户信息

router.get('/user',function(req,res){
  // 获取cookie 中的userid
  const userid = req.cookies.userid;
  if(!userid) {
    return res.send({code:1,msg:"请先登录！"})
  }

  UserModel.findOne({_id: userid},filter,function(err,user){
    return res.send({code:0,data:user});
  })
})


// 获取用户列表

router.get('/list',function(req,res){
  const {type} = req.query;
  UserModel.find({type},function(err,users){
    return res.json({code:0,data:users})
  })
})

// 获取当前用户消息列表

router.get('/msglist',function(req,res) {
  // 获取cookie 中的userid
  const userid = req.cookies.userid;
  // 查询得到所有user文档数组
  UserModel.find(function(err,userDocs){
    // 用对象存储所有user信息：key为user的_id,val 为name和header 组成的user对象
    const users = {};
    userDocs.forEach(doc => {
      users[doc._id] = {username: doc.username,header: doc.header};
    })
    ChatModel.find({'$or':[{from:userid},{to:userid}]},filter,function(err,chatMsgs){
      // 返回包含所有用户和当前用户相关的所有聊天消息的数据
      res.send({code:0,data:{users,chatMsgs}});
    })
  })
})

/*
修改指定消息为已读
 */
router.post('/readmsg', function (req, res) {
  // 得到请求中的from和to
  const from = req.body.from
  const to = req.cookies.userid
  /*
  更新数据库中的chat数据
  参数1: 查询条件
  参数2: 更新为指定的数据对象
  参数3: 是否1次更新多条, 默认只更新一条
  参数4: 更新完成的回调函数
   */
  ChatModel.update({from, to, read: false}, {read: true}, {multi: true}, function (err, doc) {
    console.log('/readmsg', doc)
    res.send({code: 0, data: doc.nModified}) // 更新的数量
  })
})


module.exports = router;
