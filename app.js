const express = require('express');
const http = require('http');
const db = require('./src/db/db');
const userRoutes = require('./src/routes/authRoutes');
const cors = require("cors");
const socketCon = require('./socket');
const app = express();
const server = http.createServer(app);
const corsOptions = {
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    optionsSuccessStatus: 200
};
app.use(cors(corsOptions));
app.use(express.json());
app.use('/user', userRoutes);
const port = process.env.PORT || 4000;
server.listen(port, () => {
    console.log(`server is connected at port of ${port}`);
});
const io = require('socket.io')(server, {
    cors: {
        origin: '*', // or your frontend URL
        // origin: 'https://apnapandating.netlify.app',
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
        credentials: true,
        pingTimeout:600000,
        pingInerval:25000
        // pingTimeout: 120000, // Reduced to 2 minutes
        // pingInterval: 10000, // Reduced to 10 seconds
    }
});
app.locals.io = io;
socketCon.init(io);
io.on('connection', (socket) => {
    console.log('A new user connected with socket ID:', socket.id );
    socket.on('addWatchlist',(message)=>{
        io.emit('getWatchlist',message)
    })
    socket.on('deleteWatchlist',(message)=>{
        io.emit('getWatchlist',message)
    })
    socket.on('disconnect', (reason) => {
        console.log('A user disconnected with socket ID:', socket.id,'reason is',reason);
    });
});
module.exports = { io };