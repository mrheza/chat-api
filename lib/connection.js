const amqp     = require('amqplib/callback_api')
const CONN_URL = 'amqp://ykehzqib:w2bn-j43V8EKl8-KO4tZ1ri8uHL9x8Bv@vulture.rmq.cloudamqp.com/ykehzqib';

module.exports = function(cb) {
  amqp.connect(CONN_URL, function(err, conn) {
    if (err) {
      throw new Error(err)
    }
    cb(conn)
  })
}
