import React, { Component } from 'react'

const MessageContent = (props) => {
  let regex = /^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/
  let splittedWords = props.children.split(' ');

 function find(string) {
    if (regex.test(string)) {
      return <a href={`https://${string}`} key={Math.random().toString()}>{string}</a>
    }
    else {
      return string;
    }
 } 

 let allEmojis = {
   ':heart:': '❤️',
   ':joy:': '😂',
   ':hearteyes:': '😍', 
   ':fire:': '🔥',
   ':innocent:': '😇',
   ':sunglasses:': '😎',
   ':thinking_face:': '🤔',
   ':thumbsup:': '👍',
   ':(': '😞',
   ':)': '🙂',
   ':D': '😄',
   ':o': '😮',
 }

 function findEmoji(word) {
   for (let key in allEmojis) {
     if (key === word) {
       return allEmojis[key]; 
     }
   }
   return word;
 }

  return(
    <p className='message-content'>{splittedWords.map(string => findEmoji(find(string))).map(string => [string, ' '])}</p>
  );
};

class message extends Component {
  render() {
    let messageClass = '';
    let tailClass = '';

    if (this.props.myUsername === this.props.username) {
      messageClass = 'my-message';
      tailClass = "my-message-tail";
    }

    return (
      <li className={'singleMessage ' + messageClass}>
        <span className='message-username'>{this.props.username}</span>
        <span className='message-timestamp'>{this.props.timestamp}</span>
        <MessageContent>{this.props.content}</MessageContent>
        <span className={'tail ' + tailClass}>{this.props.tail}</span>
      </li>
    )
  }
}

export default message

