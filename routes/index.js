var express = require('express');
var router = express.Router();
// md5 加密函数库
const md5 = require('blueimp-md5');
// 引入 UserModel
const UserModel = require('../db/jobhunting').UserModel;
const filter = {password: 0};
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




module.exports = router;
