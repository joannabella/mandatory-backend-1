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

function createRoom(name, callback) {
    fs.mkdir(STORAGE_ROOT + '/' + name, callback);
}

function createMessage(room, username, content) {
    const timestamp = (+ new Date());
    const message = {'username': username, 'timestamp': timestamp, 'content': content};
    const fileContent = JSON.stringify(message);
    fs.writeFile(STORAGE_ROOT + '/' + room + '/' + timestamp + '.json', fileContent, () => {
        io.emit(SOCKET_EVENT.NEW_MESSAGE, message);
    });
}

function readJSONFile(path) {
    return new Promise((resolve, reject) => {
        fs.readFile(path, 'utf8', (error, fileContent) => {
            if (error) {
                return reject(error);
            }
            resolve(JSON.parse(fileContent));
        });
    }); 
}

app.get('/', function(req, res) {
    res.send('<p>Hello world</p>');
});

app.get('/rooms', function(req, res) {
    fs.readdir(STORAGE_ROOT, (error, files) => {
        const rooms = files.map(file => {
            return { name: file };  
          });
        res.status(200).json(rooms);
    });
});

app.get('/rooms/:name/messages', function(req, res) {
    fs.readdir(STORAGE_ROOT + '/' + req.params.name, (error, files) => {
        const promises = files.map(file => {
            return readJSONFile(STORAGE_ROOT + '/' + req.params.name + '/' + file, 'utf8');
        });
        Promise.all(promises).then(function(messages) {
            res.status(200).json(messages);
        }) 
    });
});

app.post('/rooms', function(req, res) {
    if (!req.body.name) {
        res.status(400).end();
        return;
    }
    createRoom(req.body.name, () => {
        res.status(201).json(req.body);
    });
});

app.post('/rooms/:name/message', function(req, res) {
    if (!req.body.username || !req.body.content) {
        res.status(400).end();
        return;
    }
    createMessage(req.params.name, req.body.username, req.body.content);
    res.status(201).end();
});

app.delete('/rooms/:name', function(req, res) {
    let name = req.params.name;
    del(STORAGE_ROOT + '/' + name).then(() => {
        res.status(200).end();
    });
});

io.on('connection', function(socket) {
    socket.on(SOCKET_EVENT.SEND_MESSAGE, function(message) {
        createMessage(message.room, message.username, message.content);
    });
});


// Using so that the server does not start before STORAGE_ROOT has been created
try {
    fs.mkdirSync(STORAGE_ROOT);
} 
catch(error) {

}

createRoom('general', () => {});
createRoom('random', () => {});


http.listen(8000, function() {  
    console.log('Listening on *:8000');
});