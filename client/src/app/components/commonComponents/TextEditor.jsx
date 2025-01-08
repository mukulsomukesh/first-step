"use client"

"use client"

import React, { useEffect, useState } from 'react';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';




export default function TextEditor() {
  const [content, setContent] = useState('');


  const quillModules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      ['link', 'image'],
      [{ align: [] }],
      [{ color: [] }],
      ['code-block'],
      ['clean'],
    ],
  };


  const quillFormats = [
    'header',
    'bold',
    'italic',
    'underline',
    'strike',
    'blockquote',
    'list',
    'bullet',
    'link',
    'image',
    'align',
    'color',
    'code-block',
  ];


  const handleEditorChange = (newContent) => {
    setContent(newContent);
  };

  useEffect(()=>{
  console.log(" ok ", content)
  },[content])


  return (
      <div className="h-screen flex items-center w-full flex-col">
        <div className="h-full w-[90%] ">
          <ReactQuill
            value={content}
            onChange={handleEditorChange}
            modules={quillModules}
            formats={quillFormats}
            className="w-full h-[70%] mt-10 bg-white"
          />
        </div>
      </div>
  );
}