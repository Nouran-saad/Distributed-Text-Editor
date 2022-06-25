const mongoose = require("mongoose")
const Document = require("./Document")

mongoose.connect("mongodb://localhost/realTimeText", {
  useNewUrlParser: true,
  useUnifiedTopology: true
})

const INTERVAL_MS = 2000

const io=require("socket.io")(3001,{
    cors:
     {
         origin:"http://localhost:3000",
         methods: ["GET","POST"],
     },
})
io.on("connection", socket => {
    socket.on('get-document',async documentId =>{
        const document = await findOrCreateDocument(documentId)
        socket.join(documentId) //putting this socket in a room to handle documents separately
        socket.emit("load-document",document.data)

    
        socket.on ('send-delta',delta =>{
            socket.broadcast.emit ("get-delta",delta) 
        })
        
        socket.on("save-document", async data =>{
        await Document.findByIdAndUpdate(documentId, {data})
            })
    })  
})
async function findOrCreateDocument(id) {
    if (id == null) return
  
    const document = await Document.findById(id)
    if (document) return document
    return await Document.create({ _id: id, data: defaultValue }) //default is empty string
  }