const express = require('express');
const cors = require('cors');
const app = express();
const ExpressPeerServer = require('peer').ExpressPeerServer;

const options = { debug: true, allow_discovery: true };

const server = require('http').createServer(app);
const ep = ExpressPeerServer(server, options);
var connections;

app.use(cors());
app.use('/', ep);

app.get('/test', (req, res) => {
    res.json({ 'Success': 'Working' });
})

connections = {};
ep.on('connection', function (conn) {
    connections[conn.id] = conn;
});

ep.on('disconnect', (conn) => {
    delete connections[conn.id];
});

app.get('/connection', (req, res) => {
    let _connections;
    const roomID = req.query.roomID;
    if (roomID) {
        _connections = Object.keys(connections).filter(conn => `${roomID}-` === conn.slice(0, roomID.length + 1));
        return res.status(200).json({ connections: _connections });
    } else return res.status(422);
});

server.listen(process.env.PORT ?? 5000, '0.0.0.0', () => {
    console.log(`Listening on ${process.env.PORT ?? 5000}`);
});