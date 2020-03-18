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

      const queue    = 'messages'

      // This makes sure the queue is declared before attempting to consume from it
      channel.assertQueue(queue, {durable: true})

      // send message to specific queue in rabbitmq
      channel.sendToQueue(queue, new Buffer.from(message))
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

// get all previous chat
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

app.listen(3000, '0.0.0.0',
  function() {
    console.log('Chat at localhost:3000')
  }
)
