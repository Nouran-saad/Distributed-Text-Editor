/*The main reason we choose quill is the delta feature 
that allows multiple users to edit at the same time without overwriting any changes */
// here is all the code for our text editor component
// Q- Quill isn't a react component so we need to do some work
import React, { useEffect,useCallback,useState } from 'react'
import Quill from "quill"
import "quill/dist/quill.snow.css" // stylesheet
import { Offline } from "react-detect-offline";
import {io} from 'socket.io-client' // to allow connections 
import {useParams} from 'react-router-dom'  // route to different routes 
const editor2=document.createElement("div") 
const ENDPOINT = 'https://server-edtior.herokuapp.com/';

var q;


const SAVE_INTERVAL_MS = 2000 // every 2 seconds we are saving our document 
export default function TextEdtior() {

/* State allows us to manage changing data in an application. so we create 
a state for socket and a state for quill to access it from anywhere (in the code) 
so now we can sync between users (collaboration)
-- useState Hook allows us to track state in a function component*/

    const {id: documentId}=useParams()
    const [socket,setSocket]=useState()
    const [quill,setQuill]=useState()
    const [user,setUser]=useState(1)

// useEffect? you tell React that your component needs to do something after render(aka display)
//-------------------loading document----------------------
useEffect (()=>{
    if(socket== null || quill==null) return // we have to make sure they are defined because this func depends on them
// once automatically cleans up the event after 
    socket.once ("load-document",document =>{
        quill.setContents (document.data)
        quill.enable() //we enable only if we get document 
    })
  socket.emit ("get-document",documentId) // send to server document ID
  },[socket,quill,documentId])

// once we load the document we get the number of users of the document and display it
  useEffect (()=>{
    if(socket== null || quill==null) return
    socket.once ("load-document",document =>{
        quill.setContents (document.data)
        quill.enable()
        editor2.innerHTML="Number of Current Users "+document.user

    })
  },[socket,quill])

/* we want to establish the connection once([]) upon rendering so we use a 
useEffect to handle this connection*/
//-------------------handling connection-----------------------

    useEffect(() => {
       const s= io(ENDPOINT, {transports:['websocket']});  // url of server // this function returns a socket(state)
       setSocket(s)
        return () => {
         s.disconnect()  //cleaning up 
        }
    },[])

//------------------saving our document ----------------------
      useEffect(() => {
    if (socket == null || quill == null) return
/* interval creates a timer*/
    const interval = setInterval(() => {
      socket.emit("save-document", quill.getContents())
    }, SAVE_INTERVAL_MS) //save our contents every 2 seconds 

    return () => {
      clearInterval(interval) //cleaning up 
    }
  }, [socket, quill]) // this func depends on socket,quill


 //-------------------updating our document---------------------
    useEffect(()=> {
        if(socket== null || quill==null) return

        const handler = (delta)=>{
          
            quill.updateContents(delta)
        }
        socket.on('receive-changes',handler)


        return () => {
            quill.off('receive-changes',handler)
        }
    },[socket,quill]) // this func depends on socket,quill

// we listen on the number of users of the document and display it
    useEffect(()=> {
      if(socket== null) return
      socket.on('users',user => {
        setUser(user)
        editor2.innerHTML="Number of Current Users "+user

      })
  },[socket,user]) // this func depends on socket,user

    //------------------listening to changes -------------------
    useEffect(()=> {
        if(socket== null || quill==null) return

        const handler = (delta,oldDelta,source)=>{
// we do this because we are only interested in the changes the user makes we do not want
// any changes done in the library (not by the user to be sent to the clients)
            if (source!== 'user') return
            socket.emit("send-changes",delta) // is just what changed in the document -- we send this to the server using socket.emit
        }
        quill.on('text-change',handler)  // text-change quill API, handler is called whenever text-change is on

        return () => {
            quill.off('text-change',handler)  // upon cleaning up 
        }
    },[socket,quill]) // this func depends on socket,quill


// we have our useCallback function that is gonna be called once the wrapper is rendered on our page
// it takes the wrapper as parameter so wrapper is always defined before useCallback is called
const wrapperRef= useCallback((wrapper) => {

  var toolbarOptions = [
      ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
      ['blockquote', 'code-block'],
    
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'script': 'sub'}, { 'script': 'super' }],      // superscript/subscript
      [{ 'indent': '-1'}, { 'indent': '+1' }],          // outdent/indent
      [{ 'direction': 'rtl' }],                         // text direction
    
      [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
    
      [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
      [{ 'font': [] }],
      [{ 'align': [] }],
    
      ['clean']                                         // remove formatting button
    ];
    
 const editor=document.createElement("div") //create an object editor

 wrapper.append(editor2) // put editor into wrapper 

 wrapper.append(editor) // put editor into wrapper 

 editor2.innerHTML="Number of Current Users "
 const el = document.getElementById("status")
 setInterval(() => {
   if(el.textContent === "You are Offline, Please Check your Connection and Try Again!"){
     q.disable()
   }
   else{
     q.enable()
   }
 }, 1000);

 q=  new Quill(editor,{theme: "snow",
  modules: {
      toolbar: toolbarOptions
      }
  })
  q.disable()  // if no document then disbale 
  q.setText('Loading...') // if disabled display Loading...
  setQuill(q)
} ,[])

return (
  <>
<div>
<button onClick={()=>{
  var str = window.location.href;
  var loc = str.substring(str.indexOf('documents') + 10);
  navigator.clipboard.writeText(loc);
}}>Copy to Clipboard</button>
</div>
<div id="status">
    <Offline id = "offline">
        You are Offline, Please Check your Connection and Try Again!
    </Offline>



  </div>
<div className="text container" ref={wrapperRef}></div>
</>
)
}

/* we're creating an instance of the quill component once after rendering the page*/
/* we use ref to reference our container and then UseRef to allow access DOM elements directly, and persist data 
between renders without causing a component to re-render infinitely when changes occur (so we avoid)
rerendering the quill component or toolbar when page is refreshed or changes are made*/