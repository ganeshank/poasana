import React, {useState} from 'react';
import styles from "../styles/loginstyle";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Button,
  TouchableHighlight,
  Image,
  Alert
} from 'react-native';
import {useDispatch} from 'react-redux';
import { showMessage, hideMessage } from "react-native-flash-message";


export default function LoginScreen({ navigation }){
  const dispatch = useDispatch();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  return (
    <View style={styles.container}>
        <Image style={{width: 150, height: 150}} source={require("../assets/chat-icon-new.png")}/>
        <View style={styles.inputContainer}>
          <Image style={styles.inputIcon} source={require("../assets/mail.png")}/>
          <TextInput style={styles.inputs}
              placeholder="Email"
              keyboardType="email-address"
              value= {username}
              underlineColorAndroid='transparent'
              onChangeText={email => setUsername(email)}/>
        </View>
        
        <View style={styles.inputContainer}>
          <Image style={styles.inputIcon} source={require("../assets/padlock.png")}/>
          <TextInput style={styles.inputs}
              placeholder="Password"
              secureTextEntry={true}
              value={password}
              underlineColorAndroid='transparent'
              onChangeText={password => setPassword(password)}/>
        </View>

        <TouchableHighlight style={[styles.buttonContainer, styles.loginButton]} 
          onPress={() => {
            fetch('https://poasana.000webhostapp.com/api/login.php', {
              method: 'POST',
              body: "username="+username+"&password="+password,
              headers: new Headers({
                'Content-Type': 'application/x-www-form-urlencoded', // <-- Specifying the Content-Type
              })
            })
            .then((response) => response.json())
            .then((responseJson) => {
              
              if(responseJson.msg == "success"){
                showMessage({
                    message: "Success",
                    description: "You will be redirecting to home page..",
                    type: "success",
                });
                dispatch({type: "server/join",data: responseJson.username});
                navigation.navigate("Home");
                
              }else{
                showMessage({
                  message: "Failed",
                  description: "Wrong credentials",
                  type: "danger",
              });
              }
            })
            .catch((error) => {
              console.error(error);
            });
          }}>
          <Text style={styles.loginText}>Login</Text>
        </TouchableHighlight>

        <TouchableHighlight style={styles.buttonContainer} onPress={() => this.onClickListener('restore_password')}>
            <Text>Forgot your password?</Text>
        </TouchableHighlight>

        <TouchableHighlight style={styles.buttonContainer} onPress={() => navigation.navigate("Signup")}>
            <Text>Register</Text>
        </TouchableHighlight>
      </View>
  )
}

