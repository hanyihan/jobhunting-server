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


