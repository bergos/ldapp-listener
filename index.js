var fs = require('fs')
var http = require('http')
var https = require('https')

function initHttpListener (config) {
  return new Promise(function (resolve) {
    var hostname = config.listener.hostname || 'localhost'
    var port = config.listener.port || 80

    http.createServer(config.app)
      .listen(port, hostname, function () {
        console.log('listen on: http://' + hostname + ':' + port)

        resolve()
      })
  })
}

function initHttpsListener (config) {
  return new Promise(function (resolve) {
    var hostname = config.listener.hostname || 'localhost'
    var port = config.listener.port || 80
    var pemKey = fs.readFileSync(config.listener.tls.keyFile).toString()
    var pemCert = fs.readFileSync(config.listener.tls.certFile).toString()

    https.createServer({key: pemKey, cert: pemCert, requestCert: config.listener.tls.requestCert}, config.app)
      .listen(port, hostname, function () {
        console.log('listen on: https://' + hostname + ':' + port)

        resolve()
      })
  })
}

module.exports = function () {
  var config = this

  if (config.listener.tls) {
    return initHttpsListener(config)
  } else {
    return initHttpListener(config)
  }
}
