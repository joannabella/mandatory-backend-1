import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { updateUsername } from './userStore';

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      infoMessage: '',
      color: 'black',
      isLoggedIn: false,
    };
    this.onChange = this.onChange.bind(this);
    this.login = this.login.bind(this);
  }

  onChange(event) {
    this.setState({ username: event.target.value, infoMessage: '' });
  }

  login(event) {
    event.preventDefault();

    let regex = /^[\s\wÅÄÖåäö-]{1,12}$/;
    if (regex.test(this.state.username)) {
      updateUsername(this.state.username);
      this.setState({ isLoggedIn: true });
    }
    else if (this.state.username === '') {
      this.setState({ infoMessage: 'Please provide a username :-)', color: 'red' });
    }
    else {
      this.setState({ infoMessage: 'The username should be between 1-12 characters (or numbers) long and may contain "-" or "_"', color: 'red' });
    }
  }

   render() {
     if (this.state.isLoggedIn === true) {
       return <Redirect to='/rooms/general' />
     }
     return (
     <div className='login-window login-tail'>  
        <form className='login-form'>
          <h1 className='login-welcome'>Talkative</h1>
          <label className='login-title' htmlFor='pickusername'>Pick your username</label>  
          <p className='login-error' style={{ color: this.state.color }}>{this.state.infoMessage}</p>
          <input 
            className='userfield' 
            name='pickusername' 
            onChange={this.onChange} 
            value={this.state.username} 
            placeholder='Username' 
            spellCheck='false'></input>  

          <label className='userinput' htmlFor='pickusername'></label>  
          <button className='login-button' type='submit' onClick={this.login}>Login</button>
        </form>
     </div>
     )
   }
 }


export default Login;