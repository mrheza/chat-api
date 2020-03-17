const express = require('express')
const bodyParser = require('body-parser')
const rabbitConn = require('../lib/connection')
const app = express()

app.use(bodyParser.urlencoded({ extended: true }))

let messageHistory = []

// api for send message to rabbitmq
app.post('/send-message', function (req, res) {
  const message = req.body.message.trim()
  if (message === undefined || message === '') {
    res.statusCode = 400
    return res.json({
      status : false,
      message: 'Invalid message'
    })
  }

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

      const exchange = 'messages_ex'
      const queue    = 'messages'

      // / This makes sure the exchange is declared
      channel.assertExchange(exchange, 'fanout', {durable: false})

      // publish the message only to the named exchange
      channel.publish(exchange, '', new Buffer.from(message), {persistent: false})

      // This makes sure the queue is declared before attempting to consume from it
      channel.assertQueue(queue, {durable: true})

      // send message to specific queue in rabbitmq
      channel.sendToQueue(queue, new Buffer.from(message), {persistent: true})
      channel.close(function() {connection.close()})

      // save message to messageHistory
      messageHistory.push({time: new Date(), message: message})

      res.statusCode = 200
      return res.json({
        status : true,
        message: 'Message sent'
      })
    })
  })
})

app.get('/get-message-all', function (req, res) {
  res.statusCode = 200
  if (messageHistory.length === 0) {
    return res.json({
      status : true,
      message: 'No message found',
      result : []
    })
  }
  return res.json({
    status : true,
    message: 'Message found',
    result : messageHistory
  })
})

/* // api for get all message from rabbitmq
app.get('/get-message-all', function (req, res) {
  rabbitConn(function(connection){
    // create channel in rabbitmq
    connection.createChannel(function(error, channel) {
      if (error) {
        res.statusCode = 500
        return res.json({
          status : false,
          message: 'Connection lost'
        })
      }

      const queue = 'messages'

      // This makes sure the queue is declared before attempting to consume from it
      channel.assertQueue(queue, {durable: true}, function(error, status) {
        if (error) {
          res.statusCode = 500
          return res.json({
            status : false,
            message: 'Connection lost'
          })
        } else if (status.messageCount === 0) {
          res.statusCode = 200
          return res.json({
            status : true,
            message: 'No message found',
            result : []
          })
        } else {
          let numChunks  = 0
          let messageArr = []

          // get all message, get all previously sent messages
          channel.consume(queue, function(message) {
            let resChunk = message.content.toString()
            messageArr.push(resChunk)
            numChunks += 1
            if (numChunks === status.messageCount) {
              channel.close(function() {connection.close()})
              res.statusCode = 200
              return res.json({
                status : true,
                message: 'Message found',
                result : messageArr
              })
            }
          })
        }
      })
    }, {noAck: true})
  })
}) */

 app.listen(3000, '0.0.0.0',
  function() {
    console.log('Chat at localhost:3000')
  }
)
