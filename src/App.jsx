import "./index.css";
import React, { Component } from 'react';
import * as tf from '@tensorflow/tfjs';

class App extends Component {

  constructor(props){
    super(props);
    this.state= {
      lastPosition:null,
      drawing:false,
      prediction:null,
    };
    this.canvasRef = React.createRef();
    this.clear = this.clear.bind(this);
    this.predict = this.predict.bind(this);
    this.moving = this.moving.bind(this);
    this.split = this.split.bind(this);
    this.rescaled = this.rescaled.bind(this);
  }

  handleEvent = (event) => {
    if (event.type === "mousedown")
      this.setState({ drawing: true});
    else
      this.setState({ drawing: false});
   }

  clear() {
    const canvas = this.canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#FFFF";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  split(n){
    const canvas = this.canvasRef.current;
    const ctx = canvas.getContext("2d");
    const width = canvas.width/n;
    const splits = [];

    const img = new Image();
    for(var i = 0; i < n; i++){
      ctx.drawImage(canvas, i*width, 0, (i+1)*width, canvas.height );
      img.src = canvas.toDataURL();
      splits.push(img);
    }
    console.log(splits);
    return splits; //returns an array of Elemets <img>
  }

  rescaled(arr){
    const rescaled = [];
    const img = new Image();
    const resizedCanvas = document.createElement("canvas");
    const resizedContext = resizedCanvas.getContext("2d");
    resizedCanvas.height = "32";
    resizedCanvas.width = "32";
    arr.forEach((image) => {
      console.log(image);
      resizedContext.drawImage(image, 0, 0, 32, 32);
      img.src = resizedCanvas.toDataURL();
      rescaled.push(img);
    });
    console.log(rescaled);
    return rescaled;
  }

  async predict(){
    const model = await tf.loadLayersModel('https://storage.googleapis.com/mathsolvermodel/model.json');
    const canvas = this.canvasRef.current;

    const split_images = this.split(1);
    const resized_images = this.rescaled(split_images);
    console.log(resized_images);

    //const resized_grayscale_Tensor = tf.browser.fromPixels(resizedCanvas).mean(2).toFloat().expandDims(0).expandDims(-1);
    //const prediction = model.predict(resized_grayscale_Tensor);
    //const value = prediction.dataSync()

    //console.log(value);
  }

  moving(e) {
    const canvas = this.canvasRef.current;
    const ctx = canvas.getContext('2d');
      var pos = {
        x: e.clientX - canvas.getBoundingClientRect().left,
        y: e.clientY - canvas.getBoundingClientRect().top
      };
    if (this.state.lastPosition !== null && this.state.drawing) {
      ctx.lineWidth = 10;
      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.fillStyle = "#000000";
      ctx.moveTo(this.state.lastPosition.x, this.state.lastPosition.y);
      ctx.lineTo(pos.x, pos.y);
      ctx.closePath();
      ctx.stroke();
    }
    this.setState({lastPosition: pos});
  }

  render(){
    return (
      <div>
        <h1>My Math Solver</h1>
        <canvas ref={this.canvasRef} width="600" height="400" onMouseMove={e => this.moving(e)} onMouseUp={this.handleEvent} onMouseDown={this.handleEvent}> </canvas>
        <button onClick={this.clear}>Clear</button>
        <button onClick={this.predict}>Predict</button>
        <h2>{this.state.prediction}</h2>
      </div>
    );
  }
}

export default App;
