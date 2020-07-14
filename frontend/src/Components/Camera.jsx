import React from 'react'
import Webcam from "react-webcam";
import './Camera.css'

const videoConstraints = {
    width: 800,
    height: 600,
    video: { facingMode: { exact: "environment" } }
};

export default class Camera extends React.Component{
    constructor(props){
        super(props)
        this.webcamRef = React.createRef()
        this.state = {
            imgsrc: '',
            videoConstraints: {
                width: 800,
                height: 600,
                facingMode: "environment"
            }
        }
    }
    capture(){
        const imgsrc =  this.webcamRef.current.getScreenshot();
        this.setState({imgsrc: imgsrc})
        this.props.getImage(imgsrc, imgsrc)
    }
    render(){
        return(
            <>
                <button onClick={() => this.capture()} className='green-button capture-button'>Take a picture</button>
                <div className='webcam-wrapper'>
                    <div className='webcam'>
                        <Webcam
                            audio={false}
                            height={600}
                            ref={this.webcamRef}
                            screenshotFormat="image/jpeg"
                            width={800}
                            videoConstraints={this.state.videoConstraints}
                        />
                    </div>
                    <canvas className="webcam-canvas"
                        style={{
                            height: 500,
                            width: 700,
                            margin: 50,
                            border: "2px dotted #FF0000"
                        }}
                    >
                    </canvas>
                </div>
            </>
        )
    }
}