import React from 'react';
import { View, Platform, KeyboardAvoidingView } from 'react-native';
import { GiftedChat } from 'react-native-gifted-chat';
import { useHeaderHeight } from '@react-navigation/stack';
import { useDispatch, useSelector } from 'react-redux';

export default function PublicChatScreen({route}) {
    const dispatch = useDispatch();
   // const selfUser= useSelector(state => state.selfUser);
    const conversations = useSelector(state => state.publicConversations);
    const userId = route.params.id;
    //const username = route.params.name;
    //const messages = route.params.chat;
    let messages = conversations.messages;
    
    
    return (
        <View style={{flex: 1}}>
            <GiftedChat
                renderUsernameOnMessage
                messages={messages}
                onSend={messages => {
                    console.log("message-", messages[0]);
                    dispatch(
                        {type: 'public_message', 
                            data: {
                                message: messages[0], 
                               // conversationId: userId,
                                senderId: userId
                            }
                        }
                    );

                    dispatch(
                        {type: 'server/public_message', 
                            data: {
                                message: messages[0], 
                               // conversationId: userId,
                                conversationId: userId
                            }
                        }
                    );
                    // console.log("Message sent!!!");
                    // fetch('https://poasana.000webhostapp.com/api/setchat.php', {
                    //     method: 'POST',
                    //     body: "message="+messages[0].text+"&sender="+selfUser.userId+"&receiver="+userId,
                    //     headers: new Headers({
                    //         'Content-Type': 'application/x-www-form-urlencoded', // <-- Specifying the Content-Type
                    //     })
                    // })
                    // .catch((error) => {
                    //     console.error("Error for save chat data-",error);
                    // });

                }}
                user={{
                _id: '15',
                name: "Ganeshan"
                }}
            /> 
            
            {Platform.OS === 'android' && <KeyboardAvoidingView 
            behavior="padding" keyboardVerticalOffset={useHeaderHeight()+20}/>}
        </View>
    );
}
