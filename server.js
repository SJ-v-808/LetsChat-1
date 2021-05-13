//libs
const app = require("express")()
const server = require("http").Server(app)
const io = require("socket.io")(server)

//server_address
const host = "localhost"
const port = "3000"
const weblink = "http://" + host + ":" + port

//global variables
activeUsers = 0
var usrs = {}

//functions
app.get("/",(req, res) => {
    res.sendFile(__dirname + "/public/" + "index.html")
 })

app.get("/log_in",(req,res) => {
    res.sendFile(__dirname + "/public/" + "log_in.html")
})

io.on("connection",(socket) => {
    const usr_id = socket.id
    console.log(usr_id)
    activeUsers++
    console.log("|(active user): " + activeUsers + "|")

    socket.on("sending_usr_info",(data) => {
        usrs[usr_id] = data
        console.log(usrs)
        io.sockets.emit("online_users",usrs)

    })
    
    socket.on("send_msg_server",(data) => {
        console.log(data)
        socket.broadcast.emit("all_msg",data)
    })

    socket.on("disconnect",() => {
        console.log(usr_id)
        activeUsers--
        console.log("|(active user): " + activeUsers + "|")
        delete usrs[usr_id]
        console.log(usrs)
        io.sockets.emit("online_users",usrs)
    })
})
//run
server.listen(port,host,() => {
    console.log("[Let's-chat]--->(listening on)--| " + weblink + " |")
})
    
    
   