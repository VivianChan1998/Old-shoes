import React from 'react'
import NavBar from '../Components/Nav'
import { DefaultButton } from 'office-ui-fabric-react';
import {Link} from 'react-router-dom'
import './Home.css'

export default class Home extends React.Component{
    render(){
        return(
            <div>
                <NavBar/>
                <div id='Home-banner-wrapper'>
                    <div id='Home-banner-bg'></div>
                    <h1>Old-Shoes</h1>
                    <p>Sell your old-shoes by simply taking a picture of them :)</p>
                    <Link to='/upload' >
                        <DefaultButton text='try it out' />
                    </Link>
                </div>
            </div>
        )
    }
}