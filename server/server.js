const mongoose = require("mongoose")
const Document = require("./Document")
const redis = require("redis")

const redisclient = redis.createClient({
  host:'redis-18043.c80.us-east-1-2.ec2.cloud.redislabs.com',
  port: '18043',
  password: 'BWJmwbwp8Zlrxdlo8tyXx1g3UCHr8iY3'
})

redisclient.on("connect", () => {
  console.log("Connected to our redis instance!");
});

mongoose.connect( "mongodb://text-editor:text-editor@cluster0-shard-00-00.cnxzw.mongodb.net:27017,cluster0-shard-00-01.cnxzw.mongodb.net:27017,cluster0-shard-00-02.cnxzw.mongodb.net:27017/myFirstDatabase?ssl=true&replicaSet=atlas-kn4fco-shard-0&authSource=admin&retryWrites=true&w=majority", {
  useNewUrlParser: true,
  useUnifiedTopology: true
})


const io=require("socket.io")(3001,{
    cors:
    {
        origin:"http://localhost:3000",
        methods: ["GET","POST"],
    },
})

const defaultValue=""
io.on("connection", socket => {
    socket.on("get-document", async documentId => {
      var returnnn
      redisclient.hgetall(documentId, async function(err, object) {
        if(!object){
          returnnn = await findOrCreateDocument(documentId)
          redisclient.hmset(documentId, {'data':JSON.stringify(returnnn[0].data) , 'user':returnnn[0].user})
        }else{
          var jdata=""
          if(object['data']==""){
          }else{
            jdata=JSON.parse(object['data'])
          }
          const documentt ={
          data : jdata,
          user : parseInt(object['user'])
        }
        var x = documentt['user']+1
        redisclient.hmset(documentId, {'user':x})
        returnnn= [documentt,true] 
      }
        const document = returnnn[0]
        var found= returnnn[1]
        if (found){
          document.user = document.user+1
        }
        socket.join(documentId) 
        socket.emit("load-document",document)
        socket.broadcast.to(documentId).emit ("users",document.user)
      }) 

    socket.on ('send-delta',delta =>{
        socket.broadcast.to(documentId).emit ("get-delta",delta)
    })

    socket.on("save-document", async data => {
      redisclient.hgetall(documentId, async function(err, object) {
        if(!object){
          await Document.findByIdAndUpdate(documentId, { 'data':data })
        }else{
          var userno
          if (object['user']){
            userno= parseInt(object['user'])
          }else{
            userno=1
                    }
          redisclient.hmset(documentId, {'data':JSON.stringify(data)})
        await Document.findByIdAndUpdate(documentId, { 'data':data ,'user':userno})
      }
      })
    });
    

  socket.on('disconnect', async function() {

    redisclient.hgetall(documentId, async function(err, object) {
      if(!object){
        var documentl = await Document.findById(documentId)
        var x= documentl.user-1
        await Document.findByIdAndUpdate(documentId, { user : x})
      }else{
        const documentt ={
        user : parseInt(object['user'])
      }
      if (documentt['user']==1){
        redisclient.del(documentId);
        await Document.findByIdAndUpdate(documentId, { user : 0})
      }else{
        var x=documentt['user']-1

      redisclient.hmset(documentId, {'user':x})
    }
  }
    socket.broadcast.to(documentId).emit ("users",x) 
  });
  })
});
})


async function findOrCreateDocument(id) {
    if (id == null) return

    const document = await Document.findById(id)
    if (document) {
    var x= document.user+1

    const document1 = await Document.findByIdAndUpdate(id, { user : x})
    
    return [document1 , true]
    }else{
      redisclient.hmset(id, {'data':'', 'user':'1'})
    return [await Document.create({ _id: id, data: defaultValue ,user:1}) , false]
  }
}
