import React from "react";
import UUIDWidget from "./components/UUIDWidget";

const App: React.FC = () => {
  return (
    <>
      <style>
        {`
          html, body, #root {
            height: 100%;
            margin: 0;
            padding: 0;
            overflow: hidden;
          }
          
          * {
            box-sizing: border-box;
          }
          
          .uuid-widget {
            height: 100%;
            min-height: 0;
          }
        `}
      </style>
      <div style={{ 
        fontFamily: 'Inter, sans-serif', 
        margin: 0,
        padding: 0,
        color: '#495057',
        width: '100%',
        height: '100%',
        background: 'white',
        overflow: 'hidden'
      }}>
        <UUIDWidget />
      </div>
    </>
  );
};

export default App;
