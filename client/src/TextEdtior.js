import React from 'react'
import { useCallback, useEffect,useState } from 'react'
import Quill from "quill"
import "quill/dist/quill.snow.css"
import {io} from 'socket.io-client'


export default function TextEdtior() {

    const [socket,setSocket]=useState()
const [quill,setQuill]=useState()

    useEffect(() => {
        const s= io("http://localhost:3001")  
        setSocket(s)
        
         return () => {
          s.disconnect()  
         }
     },[])

     useEffect(()=> {
        if(socket== null || quill==null) return

        const handler = (delta,oldDelta,source)=>{
// we do this because we are only interested in the changes the user makes we do not want
// any changes done in the library (not by the user to be sent to the clients)
            if (source!== 'user') return
            socket.emit("send-delta",delta) // is just what changed in the document -- we send this to the server using socket.emit
        }
        quill.on('text-change',handler)  // text-change quill API, handler is called whenever text-change is on

        return () => {
            quill.off('text-change',handler)  // upon cleaning up 
        }
    },[socket,quill]) // this func depends on socket,quill
    
    
        //-------------------updating our document---------------------
        useEffect(()=> {
            if(socket== null || quill==null) return
    
            const handler = (delta)=>{
              
                quill.updateContents(delta)
            }
            socket.on('get-delta',handler)
    
            return () => {
                socket.off('get-delta',handler)
            }
        },[socket,quill])
    
    
    
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

       wrapper.append(editor) // put editor into wrapper 

      const q=  new Quill(editor,{theme: "snow",
        modules: {
            toolbar: toolbarOptions
            }
        })
         setQuill(q)
    } ,[])

    return (
        <>
            <div className="text container" ref={wrapperRef}></div>
        </>
    )
}
