console.ignoredYellowBox = ['Remote debugger'];
import { YellowBox } from 'react-native';
YellowBox.ignoreWarnings([
    'Unrecognized WebSocket connection option(s) `agent`, `perMessageDeflate`, `pfx`, `key`, `passphrase`, `cert`, `ca`, `ciphers`, `rejectUnauthorized`. Did you mean to put these under `headers`?'
]);

import React from 'react';
import {Provider} from 'react-redux';
import AppContainer from './AppContainer';
import {createStore, applyMiddleware} from 'redux';
import createSocketIoMiddleware from 'redux-socket.io';
import io from 'socket.io-client';
import FlashMessage from 'react-native-flash-message';

//const socket = io("http://18.216.129.200:3001");
const socket = io("http://192.168.43.58:3001");
const socketIoMiddleware = createSocketIoMiddleware(socket, "server/");

// Listener from socket server.
function reducer(state = {conversations: {}}, action){
  switch(action.type){
   
    case "users_online":
      const conversations = {...state.conversations};
      const usersOnline = action.data;
      console.log(usersOnline);
      for(let i = 0;i <usersOnline.length; i++){
        const userId = usersOnline[i].userId;
        if(conversations[userId] === undefined){
          conversations[userId] = {
            messages: [],
            username: usersOnline[i].username
          };
        }
      }
      return {...state, usersOnline, conversations};
    case "private_message":
      const conversationId = action.data.conversationId;
      console.log("data1 ", conversationId);
      return {
        ...state,
        conversations: {
          ...state.conversations,
          [conversationId] : {
            ...state.conversations[conversationId],
            messages: [
              action.data.message,
              ...state.conversations[conversationId].messages
            ]
          }
        }
      };
    case "self_user":
      return {...state, selfUser: action.data};

    case "conversation":
      const chatConversations = action.data;
      console.log("ssssss");
      return {...state, conversations:chatConversations};
    default:
      return state;
  }
}

const store = applyMiddleware(socketIoMiddleware)(createStore)(reducer);

//Whenever a state changes.
store.subscribe(() => {
  console.log("new state", store.getState());
})

export default function App() {
  return (
    <Provider store={store}>
      <AppContainer />
      <FlashMessage position="top" />
    </Provider>
    
  );
}
