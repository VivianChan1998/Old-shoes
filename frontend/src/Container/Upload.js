import React, { createRef } from 'react'
import ImgInput from '../Components/ImgInput'
import NavBar from '../Components/Nav'


export default class Upload extends React.Component{
    constructor(){
        super()
    }
    render(){
        return(
            <div>
                <NavBar />
                <ImgInput />
            </div>
        )
    }
}