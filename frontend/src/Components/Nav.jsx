import React from 'react'
import {Link} from 'react-router-dom'
import { DefaultButton, PrimaryButton, Stack, Modal } from 'office-ui-fabric-react';
import { TextField } from 'office-ui-fabric-react/lib/TextField';
import './Nav.css'

const stackTokens = { childrenGap: 10 };

export default class NavBar extends React.Component{
    constructor(props){
        super(props)
        this.state={
            isLoginModalOpen: false
        }
    }
    handleLogin(e){
        console.log(e)
    }
    render(){
        return(
            <div className='Nav-wrapper'>
                <Stack horizontal tokens={stackTokens}>
                    <Link to='/'>
                        <h3>Old-shoes</h3>
                    </Link>
                    <DefaultButton text="Login" onClick={() =>　this.setState({isLoginModalOpen: true})} allowDisabledFocus />
                    <PrimaryButton text="Signup" onClick={() => console.log('signup')} allowDisabledFocus />
                </Stack>
                <Modal
                    titleAriaId='LoginModal'
                    isOpen={this.state.isLoginModalOpen}
                    onDismiss={() => this.setState({isLoginModalOpen: false})}
                    isBlocking={false}
                    containerClassName={''}
                >
                    <LoginForm onSubmit={e => this.handleLogin(e)} />
                </Modal>
            </div>
        )
    }
}


class LoginForm extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            email: '',
            pw: ''
        }
    }
   
    render(){
        return(
            <div>
                <TextField label="Email" onChange={e => this.setState({email: e.target.value})} />
                <TextField label="Password" onChange={e => this.setState({pw: e.target.value})} />
                <DefaultButton text='Login' onClick={() => this.props.onSubmit(this.state)} />
            </div>
        )
    }
}