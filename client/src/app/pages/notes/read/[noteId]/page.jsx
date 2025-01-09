import React from "react";
import "react-quill-new/dist/quill.snow.css";

const data = `  <p>normal text</p><p><br></p><h1>heading text</h1><ol><li data-list="ordered"><span class="ql-ui" contenteditable="false"></span>order bullet f</li><li data-list="ordered"><span class="ql-ui" contenteditable="false"></span>a</li><li data-list="ordered"><span class="ql-ui" contenteditable="false"></span>t</li><li data-list="ordered"><span class="ql-ui" contenteditable="false"></span>f</li></ol><p><br></p><div class="ql-code-block-container" spellcheck="false"><div class="ql-code-block">my coce asd</div></div><p>a</p><p><a href="www.google.com" rel="noopener noreferrer" target="_blank">my link</a></p><p><br></p><blockquote>ASasASas</blockquote><p><u>underline</u></p><p><br></p><p><em>italic</em></p><p><br></p><p>bold</p> `;

export default function Page() {
  return (
    <div className="rich-text-container">
      {/* Render the rich text content */}

      {/* {data} */}

      <div dangerouslySetInnerHTML={{ __html: data }} />
    </div>
  );
}
