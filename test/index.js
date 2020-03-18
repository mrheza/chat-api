const rabbitConn = require('../lib/connection')

// create rabbitmq connection
rabbitConn(function(connection) {
  // create channel in rabbitmq
  connection.createChannel(function(error, channel) {
    if (error) {
      res.statusCode = 500
      return res.json({
        status : false,
        message: 'Connection lost'
      })
    }

    // consume message from queue
    const queue = 'messages'
    channel.consume(queue, function (msg) {
      console.log('.....');
      setTimeout(function(){
        console.log("Message:", msg.content.toString())
      },2000)
      },{ noAck: true }
    )

  })
})
