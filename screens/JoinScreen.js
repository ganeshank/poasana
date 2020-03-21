import React, {useState} from 'react';
import {View, TextInput, Image, Button, Platform, KeyboardAvoidingView} from 'react-native';
import {useDispatch} from 'react-redux';

export default function JoinScreen({ navigation }) {
    const dispatch = useDispatch();
    const [username, setUsername] = useState("");
    return (
        <View style={{flex: 1, alignItems: "center", justifyContent: "center"}}>
            <Image 
            style={{flex: 1}} 
            resizeMode="contain" 
            source={require("../assets/chat-icon.png")} 
            />
            <View style={{flex: 1,justifyContent: 'space-around'}}>
                <TextInput 
                    onChangeText={text => setUsername(text)}
                    value={username}
                    style={{fontSize: 30, textAlign: 'center'}} 
                    placeholder="Enter username" 
                />
                <Button 
                    title="Join Chat" 
                    onPress={() => {
                        dispatch({type: "server/join",data: username});
                        navigation.navigate("Home");
                    }}
                />
            </View>
             <KeyboardAvoidingView behavior="padding" />
            </View>
    )
}