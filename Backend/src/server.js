const app = require("./app")
const http = require("http")
const { Server } = require("socket.io")

const server = http.createServer(app)

const io = new Server(server,{
    cors:{origin:"*"}
})

server.listen(3000,()=>{
    console.log("Servidor corriendo en puerto 3000")
})