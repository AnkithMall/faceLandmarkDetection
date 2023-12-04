// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
// import './App.css'await facemesh.load({

import { useState, useRef ,useEffect} from 'react'
import * as tf from "@tensorflow/tfjs"
import * as facemesh from "@tensorflow-models/facemesh"
import Webcam from "react-webcam"
import './App.css'
import { drawMesh } from './utility'


function App() {
  const webcamRef = useRef(null);
  const canvaRef = useRef(null);

  const detect = async (net) => {
    if (
      typeof webcamRef.current !== "undefined" &&
      webcamRef.current !== null &&
      webcamRef.current.video.readyState === 4
    ) {
      const video = webcamRef.current.video;
      const videoWidth = webcamRef.current.videoWidth;
      const videoHeight = webcamRef.current.videoHeight;

      webcamRef.current.video.width = videoWidth;
      webcamRef.current.video.height = videoHeight;

      canvaRef.current.width = videoWidth;
      canvaRef.current.height = videoHeight;

      const face = await net.estimateFaces(video);
      //console.log(face);
      const ctx = canvaRef.current.getContext("2d") ;
      console.log(ctx) ;
      drawMesh(face, ctx);
//      drawMesh(face,ctx);
    }
  };


  const runFaceMesh = async () => {
    const net = await facemesh.load({
      inputResolution: { width: 640, height: 480 },
      scale: 0.8
    });
    //console.log("starting detection");
    setInterval(() => {
      detect(net);
    }, 100);
  }


  useEffect(()=>{runFaceMesh()}, []);
  return (
    <div className='App'>
      <header className='App-header'>

      <Webcam
        ref={webcamRef}
        style={{
          position: 'absolute',
          marginLeft: "auto",
          marginRight: "auto",
          left: 0,
          right: 0,
          textAlign: "center",
          zIndex: 9,
          width: 640,
          height: 480
        }}
      />
      <canvas 
        ref={canvaRef}
        />
        </header>
    </div>
  )
}

export default App