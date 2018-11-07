module.exports = function(server) {
    // 得到IO对象
    const io = require('socket.io')(server);

    // 监视链接（当有客户链接时执行回调函数）
    io.on('connection',function(socket){
        console.log('soketio connected');
        // 绑定sendMsg监听，接受客户端发送的消息
        socket.on('sendMsg', function(data){
            console.log('服务器接收到浏览器的消息',data);
            // 向客户端发送消息（名称，数据）
            io.emit('receiveMsg',data.name + '_' +data.date);
            console.log('服务器向浏览器发送消息',data);
        })
    })
}