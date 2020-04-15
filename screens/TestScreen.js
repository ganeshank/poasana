import React, {useState} from 'react';
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
import Spinner from 'react-native-loading-spinner-overlay';

export default function TestScreen({ navigation }){
    const dispatch = useDispatch();
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [mobile, setMobile] = useState("");
    const [password, setPassword] = useState("");
    const [spinnerEnabled, setSpinnerEnabled] = useState(false);


    return (
        <View style={styles.mainContainer}>
            <Spinner
            visible={spinnerEnabled}
            textContent={'Loading...'}
            textStyle={{color: '#000'}}
            />
            <View style={styles.headerView} >
                <Image style={{width: 100, height: 100}} source={require("../assets/chat-icon-new.png")}/>
                <Text style={styles.headerText}>Signup</Text>
            </View>
            <View style={styles.inputContainer}>
                <Image style={styles.inputImage} source={require("../assets/mail.png")}/>
                <TextInput style={styles.inputTxt}
                    placeholder="Username"
                    value= {username}
                    underlineColorAndroid='transparent'
                    onChangeText={username => setUsername(username)}/>
            </View>

            <View style={styles.inputContainer}>
                <Image style={styles.inputImage} source={require("../assets/padlock.png")}/>
                <TextInput style={styles.inputTxt}
                    placeholder="Email"
                    keyboardType="email-address"
                    value={email}
                    underlineColorAndroid='transparent'
                    onChangeText={email => setEmail(email)}/>
            </View>

            <View style={styles.inputContainer}>
                <Image style={styles.inputImage} source={require("../assets/padlock.png")}/>
                <TextInput style={styles.inputTxt}
                    placeholder="Mobile Number"
                    keyboardType="phone-pad"
                    value={mobile}
                    underlineColorAndroid='transparent'
                    onChangeText={mobile => setMobile(mobile)}/>
            </View>

            <View style={styles.inputContainer}>
                <Image style={styles.inputImage} source={require("../assets/padlock.png")}/>
                <TextInput style={styles.inputTxt}
                    placeholder="Password"
                    secureTextEntry={true}
                    value={password}
                    underlineColorAndroid='transparent'
                    onChangeText={password => setPassword(password)}/>
            </View>
           
            
                <TouchableHighlight style={styles.buttonContainer}
                    onPress={() => {
                        setSpinnerEnabled(true);
                        fetch('https://poasana.000webhostapp.com/api/signup.php', {
                          method: 'POST',
                          body: "username="+username+"&email="+email+"&mobile="+mobile+"&password="+password,
                          headers: new Headers({
                            'Content-Type': 'application/x-www-form-urlencoded', // <-- Specifying the Content-Type
                          })
                        })
                        .then((response) => response.json())
                        .then((responseJson) => {
                          //console.log(responseJson);
                          if(responseJson.result == "success"){
                            showMessage({
                                message: "Success",
                                description: "Thank you! You are successfully signup!!",
                                type: "success",
                            });
                            dispatch({type: "server/user_signup",data: responseJson.result});
                            setSpinnerEnabled(false);
                            navigation.navigate("Login");
                          }else{
                            showMessage({
                                message: "Errors",
                                description: responseJson.errors.toString(),
                                type: "danger",
                            });
                            setSpinnerEnabled(false);
                            //console.log(responseJson.errors);
                          }
                        })
                        .catch((error) => {
                          console.error(error);
                          setSpinnerEnabled(false);
                        });
                      }}
                >
                    <Text style={{color: '#ffffff', fontSize: 16, fontWeight:'bold'}}>Signup</Text>
                </TouchableHighlight>

            <View style={styles.registerContainer}>
                <Text style={{color: 'gray', fontSize: 10, fontWeight:'bold'}}>have an account? </Text>
                <TouchableHighlight onPress={() => navigation.navigate("Login")}>
                    <Text style={{color: 'orange', fontSize: 12, fontWeight:'bold'}}>Login </Text>
                </TouchableHighlight>
            </View>
           
          </View>
    );
}

const styles= StyleSheet.create({
    mainContainer:{
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
    },
    headerView:{
        height: 200, width:300, 
        backgroundColor: 'orange', 
        borderBottomLeftRadius:50, 
        justifyContent: 'center', 
        alignItems: 'center'
    },
    headerText:{
        color: '#ffffff', 
        fontSize: 25, 
        fontWeight:'bold'
    },
    inputContainer:{
        borderBottomColor: '#F5FCFF',
        backgroundColor: '#FFFFFF',
        borderRadius:30,
        borderBottomWidth: 1,
        width:250,
        height:45,
        marginTop:30,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems:'center'
    },
    inputImage:{
        width:20,
        height:20,
        marginLeft:15,
        justifyContent: 'center'
    },
    inputTxt:{
        height:45,
        marginLeft:16,
        borderBottomColor: '#FFFFFF',
        flex:1,
    },
    forgotContainer:{
        width:250,
        height:20,
        marginTop:10,
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems:'flex-end'
    },
    forgotText:{
        color: 'orange', fontSize: 12, fontWeight:'bold'
    },
    buttonContainer:{
        borderBottomColor: 'orange',
        backgroundColor: 'orange',
        borderRadius:30,
        borderBottomWidth: 1,
        width:250,
        height:45,
        marginTop:40,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems:'center'
    },
    registerContainer:{
        width:250,
        height:20,
        marginTop:10,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems:'center'
    },
    loginBtn: {
        
        borderBottomColor: '#4267b2',
        backgroundColor: '#4267b2',
        borderRadius:30,
        borderBottomWidth: 1,
        width:250,
        height:45,
        marginTop:20,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems:'center'
      }
})