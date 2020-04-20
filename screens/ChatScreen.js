import React, {useState} from 'react';
import { View, Platform, KeyboardAvoidingView, TouchableOpacity, Image, TextInput, Button } from 'react-native';
import { GiftedChat } from 'react-native-gifted-chat';
import { useHeaderHeight } from '@react-navigation/stack';
import { useDispatch, useSelector } from 'react-redux';
import * as ImagePicker from 'expo-image-picker';
import Constants from 'expo-constants';
import * as Permissions from 'expo-permissions';
import Spinner from 'react-native-loading-spinner-overlay';


export default function ChatScreen({route}) {
    const dispatch = useDispatch();
    const selfUser= useSelector(state => state.selfUser);
    const conversations = useSelector(state => state.conversations);
    const userId = route.params.userId;
    const username = route.params.name;
    const [msg, setMsg] = useState("");
    const [spinnerEnabled, setSpinnerEnabled] = useState(false);
    //const messages = route.params.chat;
    //console.log(conversations);
    let messages = [];
    if(conversations.hasOwnProperty(userId)){
        messages = conversations[userId].messages;
    }

    React.useEffect(()=> {
        getPermissionAsync();
    }, []);
    
    return (
        <View style={{flex: 1}}>
            <Spinner
            visible={spinnerEnabled}
            textContent={'Loading...'}
            textStyle={{color: '#000'}}
            />
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
                                senderId: selfUser.userId
                            }
                        }
                    );
                    //console.log("Message sent!!!");
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
                name: selfUser.username
                }}
                renderInputToolbar={()=>(
                    <View style={{ flexDirection:'row', borderColor: '#fff', borderWidth: 2 }}>
                    <TouchableOpacity onPress={_pickImage}>
                        <Image style={{width:45, height:45}} source={require("../assets/plus.png")}/>
                    </TouchableOpacity>
                    <TextInput 
                        style={{flex:1, borderColor:'gray'}}
                        placeholder="Write your message here...." 
                        onChangeText={msg => setMsg(msg)}
                        value={msg}/>
                    <Button title="Send" onPress={()=>{
                        setSpinnerEnabled(true);
                        const val = {
                            _id: uuidv4(),
                            text: msg,
                            createdAt: new Date(),
                            user: {
                              _id: selfUser.userId,
                              name: selfUser.username,
                            }
                          }
                        setMsg("");
                        //console.log("Message sent!!!");
                        fetch('https://poasana.000webhostapp.com/api/setchat.php', {
                            method: 'POST',
                            body: "message="+messages[0].text+"&sender="+selfUser.userId+"&receiver="+userId,
                            headers: new Headers({
                                'Content-Type': 'application/x-www-form-urlencoded', // <-- Specifying the Content-Type
                            })
                        })
                        .then((response) => response.json())
                        .then((responseJson) => {
                            
                            dispatch(
                                {type: 'private_message', 
                                    data: {
                                        message: val, 
                                        conversationId: userId,
                                        senderId: selfUser.userId
                                    }
                                }
                            );
        
                            dispatch(
                                {type: 'server/private_message', 
                                    data: {
                                        message: val, 
                                        conversationId: userId,
                                        senderId: selfUser.userId
                                    }
                                }
                            );
                            setSpinnerEnabled(false);
                        })
                        .catch((error) => {
                            setSpinnerEnabled(false);
                            console.error("Error for save chat data-",error);
                        });
                    }}></Button>
                </View>
                )}
            /> 
            
            {/* {Platform.OS === 'android' && <KeyboardAvoidingView 
            behavior="padding" keyboardVerticalOffset={useHeaderHeight()+20}/>} */}
        </View>
    );
    async function getPermissionAsync() {
        if (Constants.platform.ios) {
          const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
          if (status !== 'granted') {
            alert('Sorry, we need camera roll permissions to make this work!');
          }
        }
      }
    
      async function _pickImage() {
        let result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.All,
          allowsEditing: true,
          aspect: [4, 3],
          quality: 1
        });
    
        console.log(result);
        if (!result.cancelled) {
            setSpinnerEnabled(true);
            let localUri = result.uri;
            let filename = localUri.split('/').pop();
    
            // Infer the type of the image
            let match = /\.(\w+)$/.exec(filename);
            let type = match ? `image/${match[1]}` : `image`;
    
            // Upload the image using the fetch and FormData APIs
            let formData = new FormData();
            // Assume "photo" is the name of the form field the server expects
            formData.append('photo', { uri: localUri, name: filename, type: type });
            formData.append('sender', selfUser.userId);
            formData.append('receiver', userId);
    
            await fetch('https://poasana.000webhostapp.com/api/sendimage.php', {
                method: 'POST',
                body: formData,
                headers: {
                Accept: 'application/json',
                'content-type': 'multipart/form-data',
                },
            })
            .then((response) => response.json())
            .then((responseJson) => {
                console.log(responseJson);
                const val = {
                    _id: uuidv4(),
                    text: "",
                    createdAt: new Date(),
                    user: {
                      _id: selfUser.userId,
                      name: selfUser.username,
                    },
                    image: responseJson.fileName
                  }
                dispatch(
                    {type: 'private_message', 
                        data: {
                            message: val, 
                            conversationId: userId,
                            senderId: selfUser.userId
                        }
                    }
                );

                dispatch(
                    {type: 'server/private_message', 
                        data: {
                            message: val, 
                            conversationId: userId,
                            senderId: selfUser.userId
                        }
                    }
                );
                setSpinnerEnabled(false);
    
            })
            .catch((error) => {
                setSpinnerEnabled(false);
                console.error(error);
            });
    
        }
      };
}

function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

