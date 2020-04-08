import React from 'react';
import { View, Platform, KeyboardAvoidingView } from 'react-native';
import { GiftedChat } from 'react-native-gifted-chat';
import { useHeaderHeight } from '@react-navigation/stack';
import { useDispatch, useSelector } from 'react-redux';

export default function ChatScreen({route}) {
    const dispatch = useDispatch();
    const selfUser= useSelector(state => state.selfUser);
    const conversations = useSelector(state => state.conversations);
    const userId = route.params.userId;
    const username = route.params.name;
    const messages = route.params.chat;
    //const messages = conversations[userId].messages;
    
    return (
        <View style={{flex: 1}}>
            <GiftedChat
                renderUsernameOnMessage
                messages={messages}
                onSend={messages => {
                    dispatch(
                        {type: 'private_message', 
                            data: {
                                message: messages[0], 
                                conversationId: userId,
                                senderId: selfUser.userId
                            }
                        }
                    );

                    dispatch(
                        {type: 'server/private_message', 
                            data: {
                                message: messages[0], 
                                conversationId: userId,
                                conversationName: selfUser.userId
                            }
                        }
                    );
                    console.log("Message sent!!!");
                    fetch('https://poasana.000webhostapp.com/api/setchat.php', {
                        method: 'POST',
                        body: "message="+messages[0].text+"&sender="+selfUser.userId+"&receiver="+userId,
                        headers: new Headers({
                            'Content-Type': 'application/x-www-form-urlencoded', // <-- Specifying the Content-Type
                        })
                    })
                    .catch((error) => {
                        console.error("Error for save chat data-",error);
                    });

                }}
                user={{
                _id: selfUser.userId,
                }}
            /> 
            
            {Platform.OS === 'android' && <KeyboardAvoidingView 
            behavior="padding" keyboardVerticalOffset={useHeaderHeight()+20}/>}
        </View>
    );
}
