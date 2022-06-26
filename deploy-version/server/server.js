const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const cors = require('cors');
let dns = require('dns')

const app = express();
const server = http.createServer(app);
const io = socketio (server, {
  cors: {
      origin: '*',
      methods: ["GET", "POST"],
      credentials: true
  }
});

app.use(cors());



/* we used socket.io to allow realtime connection between clients and servers 
 and it allows easy communication between different browsers*/
 //mongoose to interact with mongoDB
const mongoose = require("mongoose")
const Document = require("./Document") //allows us to store the info

//-----------------connecting to db------------------------------
// allow replication by replicaSet in mongo db so these are 3 copies of the db
mongoose.connect("mongodb://text-editor:text-editor@cluster0-shard-00-00.cnxzw.mongodb.net:27017/myFirstDatabase?ssl=true&replicaSet=atlas-kn4fco-shard-0&authSource=admin&retryWrites=true&w=majority", {
  useNewUrlParser: true,
  useUnifiedTopology: true
})


/* Creating server object to allow us to do connections : 
server is on port 3001 while client is on 3000 so we need to use cors to allow
requests between different urls*/

/* when our client connects this io connection is run and it takes a socket that 
we use to communicate back to the client */
const defaultValue=""
io.on("connection", socket => {
    socket.on("get-document", async documentId => {
/* The await keyword will ask the execution to wait until the defined task gets executed.*/

         returnnn = await findOrCreateDocument(documentId)
         const document = returnnn[0]
         found = returnnn[1]
        if (found){
          document.user = document.user+1
        }
        socket.join(documentId) 
        socket.emit("load-document",document)
        socket.broadcast.to(documentId).emit ("users",document.user)


// we take the changes and broadcast to everyone with that id --  syncing between users 
// receive-changes is the func on the client's side
    socket.on ('send-changes',delta =>{
        socket.broadcast.to(documentId).emit ("receive-changes",delta)
    }) 
//---------------saving documents (server side)------------------------------
    socket.on("save-document", async data => {
        await Document.findByIdAndUpdate(documentId, { data })
      })

      io.emit('message from server', 'message from server - it works!')

//  decrease number of users if the users are disconnected*/
  socket.on('disconnect', async function() {
    var documentl = await Document.findById(documentId)
    var x= documentl.user-1
    socket.broadcast.to(documentId).emit ("users",x)
    await Document.findByIdAndUpdate(documentId, { user : x})
  
  }); 
});

}) 
/* function that finds the document by id and if not creates a new one
 and increase number of users if many users access the same document*/
async function findOrCreateDocument(id) {
    if (id == null) return
  
    const document = await Document.findById(id)
    if (document) {

    var x= document.user+1

    const document1 = await Document.findByIdAndUpdate(id, { user : x})
    
    return [document1 , true]
    }
    return [await Document.create({ _id: id, data: defaultValue ,user:1}) , false] //default is empty string
  }

  server.listen(process.env.PORT || 9000, () => console.log(`Server has started.`));