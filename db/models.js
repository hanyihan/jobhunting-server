/**
 * mongoose 操作步骤
 * 
 * 1.引入 mongoose
 * 2.连接mongoDB数据库
 * 3.创建Schema
 * 4.构造model
 * 5.添加文档，或暴露出model 等待调用
 */

//引入mongoose
const mongoose = require('mongoose');

//链接数据库，默认端口即可不带端口号
mongoose.connect("mongodb://127.0.0.1/jobhunting");
//监听数据库连接状态
mongoose.connection.on('connected',function(){
    console.log("数据库连接成功");
})

// 创建 Schema
const userSchema = mongoose.Schema({
    username:{type:String,required: true},
    password:{type: String,required: true},
    type: {type: String, required: true},
    header:{type:String},
    post:{type:String},
    info:{type:String},
    company:{type:String},
    salary:{type:String}
})
// 创建model
const UserModel = mongoose.model('user',userSchema);

exports.UserModel = UserModel;





// 定义chats 集合的文档结构
const chatSchema = mongoose.Schema({
    from: {type: String,required:true},//发送用户的id
    to: {type: String,required:true},//接收用户的id
    chat_id: {type: String,required:true},//from 和 to 组成的字符串
    content: {type: String,required:true},//内容
    read: {type: Boolean,default:false},//标识是否已读
    create_time: {type: Number}//创建时间
})
// 创建model
const ChatModel = mongoose.model('chat',chatSchema);
exports.ChatModel = ChatModel;














