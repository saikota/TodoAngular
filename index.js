// server.js (Express 4.0)
var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var _ = require('underscore');

app.use(express.static(__dirname + '/public'));
app.use(bodyParser());
var http = require('http').Server(app);
var router = express.Router();
var io = require('socket.io')(http);

var notes = [{
        id: 1,
        label: 'First Note',
        user: 'Kingsley',
        done: true
    }, {
        id: 2,
        label: 'Second Note',
        user: 'Mahmood',
        done: false
    }, {
        id: 3,
        label: 'Middle Note',
        user: 'Goode',
        done: true
    }, {
        id: 4,
        label: 'Last Note',
        user: 'John',
        done: true
    }, {
        id: 5,
        label: 'Really the last Note',
        user: 'George',
        done: false
    }

];
var lastId = 6;

router.get('/note', function(req, res) {
    res.send(notes);
});
//handles POST Request 
router.post('/note', function(req, res) {
    var note = req.body;
    note.id = lastId;
    lastId++;
    notes.push(note);
    //emits a note_add event to update all users with new note
    io.emit('note_add', note);
    res.send(note);
});

//handles PUT request for task completion request
router.put('/note/:id', function(req, res) {
    var noteId = req.params.id;
    _.each(notes, function(note) {
    
        if (note.id == noteId) {
            if (note.done) {
                note.done = false;
            } else {
                note.done = true;
            }

        }
    });
    io.emit('note_complete', noteId);
    res.send(noteId);
});

router.delete('/note/:id', function(req, res) {

    //TODO:handle failure condition
    notes = notes.filter(function(note) {
        return (note.id != req.params.id);
    });
    io.emit('note_remove', req.params.id);
    res.send('Got a DELETE request at /user', req.params.id);
});
app.use('/api', router);
http.listen(5000);
console.log('Open http://localhost:8000 to access the files now'); // shoutout to the user