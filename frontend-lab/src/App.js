import React, { Component } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Route } from 'react-router';
import './App.css';
import io from 'socket.io-client';
import Login from './login';
import Chat from './chat';

const socket = io('http://ec2-13-53-66-202.eu-north-1.compute.amazonaws.com:3000');

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoggedIn: false, 
      username: '',
    };
    this.onLogin = this.onLogin.bind(this);
    this.onLogout = this.onLogout.bind(this);
  }

  onLogin(event) {
    this.setState({ isLoggedIn: true, username: event.username });  
  }

  onLogout() {
    this.setState({ isLoggedIn: false });
  }

  render() {
    return (
      <Router>
        <div className="App">
          <Route exact path='/' component={Login} />
          <Route path='/rooms/:name' component={Chat} />
          {/*{this.state.isLoggedIn ? <Chat onLogout={this.onLogout} username={this.state.username} /> : <Login onLogin={this.onLogin} username={this.state.username} />}*/}
        </div>
      </Router>
    );
  }
}

export default App;
