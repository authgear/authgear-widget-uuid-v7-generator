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
          
          /* Ensure proper scrolling in iframe contexts */
          .uuid-widget {
            height: 100% !important;
            min-height: 100% !important;
          }
          
          /* Ensure content area can scroll properly */
          .uuid-widget > div:last-child {
            height: 100% !important;
            min-height: 100% !important;
            overflow-y: auto !important;
            overflow-x: hidden !important;
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
