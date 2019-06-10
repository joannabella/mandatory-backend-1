const express = require('express');
const app = express();
const cors = require('cors')
const fs = require('fs');
const del = require('del');
const http = require('http').Server(app)
const io = require('socket.io')(http);

app.use(cors());
app.use(express.json()); 

const STORAGE_ROOT = __dirname + '/rooms';

const SOCKET_EVENT = {
    SEND_MESSAGE: 'send_message',
    NEW_MESSAGE: 'new_message',
};

function createRoom(name) {
    try {
        fs.mkdirSync(STORAGE_ROOT + '/' + name);
        //fs.writeFil
    }
    catch(error) {

    }
}

function createMessage(room, username, content) {
    const timestamp = (+ new Date());
    const message = {'username': username, 'timestamp': timestamp, 'content': content};
    const fileContent = JSON.stringify(message);
    fs.writeFileSync(STORAGE_ROOT + '/' + room + '/' + timestamp + '.json', fileContent);
    io.emit(SOCKET_EVENT.NEW_MESSAGE, message);
    console.log(message.username);
}

app.get('/', function(req, res) {
    res.send('<p>Hello world</p>');
});

app.get('/rooms', function(req, res) {
    const files = fs.readdirSync(STORAGE_ROOT);
    const rooms = files.map(file => {
      return { name: file };  
    });
    res.json(rooms);
});

app.get('/rooms/:name/messages', function(req, res) {
    const files = fs.readdirSync(STORAGE_ROOT + '/' + req.params.name);
    const messages = files.map(file => {
        const fileContent = fs.readFileSync(STORAGE_ROOT + '/' + req.params.name + '/' + file, 'utf8');
        return JSON.parse(fileContent);
    });
    res.json(messages);
    res.status(200).end();
});

app.post('/rooms', function(req, res) {
    if (!req.body.name) {
        res.status(400).end();
        return;
    }
    createRoom(req.body.name);
    res.json(req.body);
});

app.post('/rooms/:name/message', function(req, res) {
    if (!req.body.username || !req.body.content) {
        res.status(400).end();
        return;
    }
    createMessage(req.params.name, req.body.username, req.body.content);
    res.status(200).end();
});

app.delete('/rooms/:name', function(req, res) {
    let name = req.params.name;
    del.sync(STORAGE_ROOT + '/' + name);
    res.status(200).end();
});

io.on('connection', function(socket) {
    socket.on(SOCKET_EVENT.SEND_MESSAGE, function(message) {
        console.log(message);
        createMessage(message.room, message.username, message.content);
    });
    
});

try {
    fs.mkdirSync(STORAGE_ROOT);
}
catch(error) {

}

createRoom('general');
createRoom('random');


http.listen(8000, function() {  
    console.log('Listening on *:8000');
});