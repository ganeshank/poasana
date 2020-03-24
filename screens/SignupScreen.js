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

export default function SignupScreen({ navigation }){
  const dispatch = useDispatch();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");

  return (
    <View style={styles.container}>
        <Image style={{width: 150, height: 150}} source={require("../assets/chat-icon-new.png")}/>
        <View style={styles.inputContainer}>
          <Image style={styles.inputIcon} source={require("../assets/mail.png")}/>
          <TextInput style={styles.inputs}
              placeholder="Username"
              value= {username}
              underlineColorAndroid='transparent'
              onChangeText={username => setUsername(username)}/>
        </View>
        
        <View style={styles.inputContainer}>
          <Image style={styles.inputIcon} source={require("../assets/padlock.png")}/>
          <TextInput style={styles.inputs}
              placeholder="Email"
              keyboardType="email-address"
              value={email}
              underlineColorAndroid='transparent'
              onChangeText={email => setEmail(email)}/>
        </View>

        <View style={styles.inputContainer}>
          <Image style={styles.inputIcon} source={require("../assets/padlock.png")}/>
          <TextInput style={styles.inputs}
              placeholder="Mobile Number"
              keyboardType="phone-pad"
              value={mobile}
              underlineColorAndroid='transparent'
              onChangeText={mobile => setMobile(mobile)}/>
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
            fetch('https://poasana.000webhostapp.com/api/signup.php', {
              method: 'POST',
              body: "username="+username+"&email="+email+"&mobile="+mobile+"&password="+password,
              headers: new Headers({
                'Content-Type': 'application/x-www-form-urlencoded', // <-- Specifying the Content-Type
              })
            })
            .then((response) => response.json())
            .then((responseJson) => {
              console.log(responseJson);
              if(responseJson.result == "success"){
                showMessage({
                    message: "Success",
                    description: "Thank you! You are successfully signup!!",
                    type: "success",
                });
                navigation.navigate("Login");
              }else{
                showMessage({
                    message: "Errors",
                    description: responseJson.errors.toString(),
                    type: "danger",
                });
                console.log(responseJson.errors);
              }
            })
            .catch((error) => {
              console.error(error);
            });
          }}>
          <Text style={styles.loginText}>Signup</Text>
        </TouchableHighlight>

        <TouchableHighlight style={styles.buttonContainer} onPress={() => navigation.navigate("Login")}>
            <Text>Login</Text>
        </TouchableHighlight>
      </View>
  )
}

