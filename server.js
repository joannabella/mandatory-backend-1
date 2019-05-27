const app = require('express')();
var cors = require('cors')
const http = require('http').Server(app)
const io = require('socket.io')(http);

app.use(cors())

app.get('/', function(req, res) {
    res.send('<p>Hello world</p>');
});

app.get('/rooms', function(req, res) {
    res.json([
        {
            name: 'general',
        },
        {
            name: 'random',
        }
    ])
});

io.on('connection', function(socket) {
    socket.on('chat message', function(message) {
        console.log('message: ' + message);
    });
});

http.listen(8000, function() {
    console.log('Listening on *:8000');
});