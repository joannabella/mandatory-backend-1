import React, { Component } from 'react';
import { username$, removeUsername } from './userStore';
import { Redirect } from 'react-router-dom';
import ScrollToBottom from 'react-scroll-to-bottom';
import Message from './message';
import Sidebar from './Sidebar';
import axios from 'axios';
const io = require('socket.io-client');

function getTime(timestamp) {
  return new Date(timestamp).toLocaleString('sv-SE');
}

class Chat extends Component {
  constructor(props) {
    super(props);  
    this.state = {
      username: username$.value,
      isLoggedIn: true,
      message: '',
      infoMessage: '',
      messages: [
    
      ],
      users: [

      ],
    }
    this.onChange = this.onChange.bind(this);
    this.onSend = this.onSend.bind(this);
    this.onLogout = this.onLogout.bind(this);
  }

  componentDidMount() {
    this.socket = io('http://localhost:8000');
    this.socket.on('connection', function(){
    });

    this.socket.on('messages', (messageArray) => {
      this.setState({ messages: messageArray });
    }); 

    this.socket.on('new_message', message => {
      if (!this.state.users.includes(message.username)) {
        this.setState({ users: [...this.state.users, message.username] });
      }
      this.setState({ messages: [...this.state.messages, message] });
    });
    
    this.loadMessages(this.props.match.params.name);
  }

  componentWillUnmount() {
    this.socket.disconnect();
    this.socket = null;
  }

  componentWillReceiveProps(nextProps) {
    this.loadMessages(nextProps.match.params.name);
  }

  loadMessages(roomName) {
    this.setState({ messages: [] });
    axios.get(`http://localhost:8000/rooms/${roomName}/messages`)
      .then((response) => {
        let users = [];
        let messages = response.data;
        for (let message of messages) {
          if (!users.includes(message.username)) {
            users.push(message.username);
          }
        }
        this.setState({ users: users, messages: response.data });
      });  
  }

  onChange(event) {
    this.setState({ message: event.target.value, infoMessage: '' });
  }

  onSend = (event) => {
    event.preventDefault();
    if (this.state.message.length > 200) {
      this.setState({ infoMessage: 'Your message can only be between 1-200 characters long' })
      return;
    }
    else if (this.state.message.length === 0) {
      this.setState({ infoMessage: 'Field is empty :-)' });
      return;
    } 
    else if (this.state.message.length > 0) {
      this.setState({ message: '' });
    }

    this.socket.emit('send_message', {
      room: this.props.match.params.name,
      username: this.state.username,
      content: this.state.message,  
    }, (response) => {
      this.setState({ messages: [...this.state.messages, response.data.newMessage] });
    });
  }

  onLogout(event) {
    this.setState({ isLoggedIn: false });
    removeUsername();
  }

   render() {
     if (!username$.value) {
       return <Redirect to='/' />
     }
    return (
      <div className='container'>
      <Sidebar />
        <div className='chat-window'>
          <header className='chat-header'>
            <h1 className='chat-header-title'>Talkative</h1>
          </header>
          <button className='logout-button' onClick={this.onLogout}>Logout</button>
          <ScrollToBottom className='chat-scrollBottom'>
            <ul className='chat-list'>
              {this.state.messages.map(message => {
                return <Message myUsername={this.state.username} username={message.username} timestamp={getTime(message.timestamp)} content={message.content} key={message.timestamp} tail={message.tail} /> 
              })}
            </ul>
          </ScrollToBottom>
          <form onSubmit={this.onSend}>
            <p className='info-message' style={{ color: this.state.color }}>{this.state.infoMessage}</p>
            <input className='inputfield' name='sendmessage' onChange={this.onChange} value={this.state.message} placeholder='Enter your message here' spellCheck='false'></input>
            <label className='sendinput' htmlFor='sendmessage'></label>  
            <button className='send-button' type='submit'>Send</button> 
          </form>
          <div className='users-container'>
            <h3 className='users-title'><i className="users-icon fas fa-user"></i>Members</h3>  
            <ul className='users-list'>
              {this.state.users.map(user => {
                return <li className='user-list-item' key={user}>{user}</li>
              })}
            </ul>      
          </div>
        </div>
      </div>
     );
   }
 }


export default Chat;