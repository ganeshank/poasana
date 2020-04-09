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
  Alert,
  AsyncStorage,
  TouchableOpacity
} from 'react-native';
import {useDispatch} from 'react-redux';
import { showMessage, hideMessage } from "react-native-flash-message";
import * as Facebook from 'expo-facebook';
import Spinner from 'react-native-loading-spinner-overlay';



export default function LoginScreen({ navigation }){
  const dispatch = useDispatch();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoggedin, setLoggedinStatus] = useState(false);
  const [userData, setUserData] = useState(null);
  const [isImageLoading, setImageLoadStatus] = useState(false);
  const [spinnerEnabled, setSpinnerEnabled] = useState(false);

  React.useEffect(() => {
    // Fetch the token from storage then navigate to our appropriate place
    const bootstrapAsync = async () => {
      let userToken;

      try {
        userToken = await AsyncStorage.getItem('userData');
      } catch (e) {
        // Restoring token failed
      }

      // After restoring token, we may need to validate it in production apps

      // This will switch to the App screen or Auth screen and this loading
      // screen will be unmounted and thrown away.
      console.log("mmmm", userToken);
      dispatch({ type: 'assigntoken', data: userToken });
      if(userToken !== null && userToken !== undefined){
        dispatch({type: "server/user_login",data: userToken});
      }
    };

    bootstrapAsync();
  }, []);

  facebookLogIn = async () => {
    await Facebook.initializeAsync('651749515391220');
    try {
      const {
        type,
        token,
        expires,
        permissions,
        declinedPermissions,
      } = await Facebook.logInWithReadPermissionsAsync({
        permissions: ['public_profile'],
      });
      if (type === 'success') {
        // Get the user's name using Facebook's Graph API
        fetch(`https://graph.facebook.com/me?access_token=${token}&fields=id,name,email,picture.height(500)`)
          .then(response => response.json())
          .then(data => {
            setLoggedinStatus(true);
            setUserData(data);
            console.log(data);
            const fbUsername = data.name;
            setSpinnerEnabled(true);
            fetch('https://poasana.000webhostapp.com/api/facebooklogin.php', {
                method: 'POST',
                body: "name="+data.name+"&id="+data.id,
                headers: new Headers({
                  'Content-Type': 'application/x-www-form-urlencoded', // <-- Specifying the Content-Type
                })
              })
              .then(response => response.json())
              .then(data => {
                setSpinnerEnabled(false);
                dispatch({type: "assigntoken",data: fbUsername});
                dispatch({type: "server/user_login",data: fbUsername});
                storeToken(fbUsername, data.userId);
                //setTimeout(() => {navigation.navigate("Dashboard");}, 3000)
                
              })
              .catch(e => {
                console.log(e);
                setSpinnerEnabled(false);
                dispatch({type: "server/user_login",data: fbUsername});
                storeToken(fbUsername, '');
                navigation.navigate("Dashboard");
              })

          })
          .catch(e => console.log(e))
      } else {
        // type === 'cancel'
      }
    } catch ({ message }) {
      alert(`Facebook Login Error: ${message}`);
    }
  }

  logout = () => {
    setLoggedinStatus(false);
    setUserData(null);
    setImageLoadStatus(false);
  }


  return (
    <View style={styles.container}>
        <Spinner
          visible={spinnerEnabled}
          textContent={'Loading...'}
          textStyle={{color: '#000'}}
        />
        <Image style={{width: 150, height: 150}} source={require("../assets/chat-icon-new.png")}/>
        <View style={styles.inputContainer}>
          <Image style={styles.inputIcon} source={require("../assets/mail.png")}/>
          <TextInput style={styles.inputs}
              placeholder="Username"
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
            setSpinnerEnabled(true);
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
                dispatch({type: "assigntoken",data: responseJson.username});
                dispatch({type: "server/user_login",data: responseJson.username});
                storeToken(responseJson.username, responseJson.userId);
                //getToken();
                // navigation.navigate("Home", {username: responseJson.username});
                //navigation.navigate("Dashboard");
                
              }else{
                showMessage({
                  message: "Failed",
                  description: "Wrong credentials",
                  type: "danger",
              });
              }
              setSpinnerEnabled(false);
            })
            .catch((error) => {
              console.error(error);
            });
          }}>
          <Text style={styles.loginText}>Login</Text>
        </TouchableHighlight>

        <TouchableOpacity style={styles.loginBtn} onPress={facebookLogIn}>
          <Text style={{ color: "#fff" }}>Login with Facebook</Text>
        </TouchableOpacity>

        <TouchableHighlight style={styles.buttonContainer} onPress={() => this.onClickListener('restore_password')}>
            <Text>Forgot your password?</Text>
        </TouchableHighlight>

        <TouchableHighlight style={styles.buttonContainer} onPress={() => navigation.navigate("Signup")}>
            <Text>Register</Text>
        </TouchableHighlight>
      </View>
  )
 
  async function storeToken(username, userId) {
    try {
       await AsyncStorage.setItem("userData", username);
       await AsyncStorage.setItem("userId", userId);
    } catch (error) {
      console.log("Something went wrong", error);
    }
  }
  
}