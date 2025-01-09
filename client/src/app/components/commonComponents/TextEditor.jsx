"use client"

import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic'; // Import dynamic
import 'react-quill-new/dist/quill.snow.css';

// Dynamically import ReactQuill with SSR disabled
const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false });

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
    'link',
    'image',
    'align',
    'color',
    'code-block',
  ];

  const handleEditorChange = (newContent) => {
    setContent(newContent);
  };

  useEffect(() => {
    console.log("ok ", content);
  }, [content]);

  return (
    <div className="h-screen flex items-center w-full flex-col">
      <div className="h-full w-[100%]">
        <ReactQuill
          value={content}
          onChange={handleEditorChange}
          modules={quillModules}
          formats={quillFormats}
          className="w-full h-full bg-white text-[16px]"
        />
      </div>
    </div>
  );
}
