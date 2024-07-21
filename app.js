const express = require('express');
const app = express();
const path = require('path');
const http = require('http');
const socketio = require('socket.io');

// Create HTTP server and set up Socket.IO
const server = http.createServer(app);
const io = socketio(server);

// Set the view engine to EJS
app.set("view engine", "ejs");

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, "public")));

// Socket.IO connection event
io.on("connection", function(socket) {
    console.log("A user connected");
    // Handle incoming location data
    socket.on("send-location", (data) => {
        io.emit("Received location:", {id: socket.id, ...data});
    });

    // Handle disconnection event
    socket.on("disconnect", () => {
        io.emit("user-disconnected", socket.id);
    });
});

// Render the index page on the root route
app.get("/", function(req, res) {
    res.render("index");
});

// Start the server on port 3000
server.listen(3000, () => {
    console.log("Server is running on http://localhost:3000");
});
