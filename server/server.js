const mongoose = require("mongoose")
const Document = require("./Document")

mongoose.connect( "mongodb://text-editor:text-editor@cluster0-shard-00-00.cnxzw.mongodb.net:27017,cluster0-shard-00-01.cnxzw.mongodb.net:27017,cluster0-shard-00-02.cnxzw.mongodb.net:27017/myFirstDatabase?ssl=true&replicaSet=atlas-kn4fco-shard-0&authSource=admin&retryWrites=true&w=majority", {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
const defaultValue=""

const io=require("socket.io")(3001,{
    cors:
     {
         origin:"http://localhost:3000",
         methods: ["GET","POST"],
     },
})
io.on("connection", socket => {
    socket.on('get-document',async documentId =>{
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

    
        socket.on ('send-delta',delta =>{
            socket.broadcast.to(documentId).emit ("get-delta",delta) 
        })
        
        socket.on("save-document", async data =>{
        await Document.findByIdAndUpdate(documentId, {data})
            })
    //  decrease number of users if the users are disconnected*/
    socket.on('disconnect', async function() {
        var documentl = await Document.findById(documentId)
        var x= documentl.user-1
        socket.broadcast.to(documentId).emit ("users",x)
        await Document.findByIdAndUpdate(documentId, { user : x})
    })  

    }); 
});


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