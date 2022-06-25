import React from 'react'
import { useCallback } from 'react'
import Quill from "quill"
import "quill/dist/quill.snow.css"

export default function TextEdtior() {
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

        new Quill(editor,{theme: "snow",
        modules: {
            toolbar: toolbarOptions
            }
        })
    } ,[])

    return (
        <>
            <div className="text container" ref={wrapperRef}></div>
        </>
    )
}
