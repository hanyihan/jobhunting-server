// 启动socket.io 服务的函数

module.exports = function(server) {
    // 引入chats 集合数据的model
    const ChatModel = require('../db/models').ChatModel;
    // 得到操作服务器端socketIO的io对象
    const io = require('socket.io')(server);

    // 绑定监听回调：客户端链接上服务器
    io.on('connection',function(socket){
        console.log('有客户端连接上了服务器');
        // 绑定sendMsg监听，接受客户端发送的消息
        socket.on('sendMessage',function({from,to,content}){
            console.log('服务器接收到数据',{from,to,content});

            const chat_id = [from,to].sort().join('_');
            const create_time = Date.now();
            const chatModel = new ChatModel({chat_id,from,to,create_time,content})
            chatModel.save(function(err,chatMsg){
                // 保存完成后，向所连接的客户端发送消息
                io.emit('receiveMessage',chatMsg);
                console.log('想所有连接的客户端发送消息',chatMsg);
            })
        })
    })
}