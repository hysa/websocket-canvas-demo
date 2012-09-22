/**
 * Module dependencies.
 */
var express = require('express')
  , routes = require('./routes')
  , path = require('path')
  , jade = require('jade');

var app = express()
  , server = require('http').createServer(app)
  , io = require('socket.io').listen(server);

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

app.get('/', routes.index);

server.listen(app.get('port'));
console.log("Express server listening on port " + app.get('port'));

io.sockets.on('connection',  function (socket) {
  socket.on('draw', function(paint) {
    socket.broadcast.emit('draw', paint); // Emit to other clients.
  });
});

