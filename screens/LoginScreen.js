import React, {useState} from 'react';
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

export default function TestScreen({ navigation }){
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
          //console.log("mmmm", userToken);
          if(userToken !== null && userToken !== undefined){
            dispatch({ type: 'assigntoken', data: userToken });
            dispatch({type: "server/user_login",data: userToken});
          }
        };
    
        bootstrapAsync();
      }, []);
    
      const facebookLogIn = async () => {
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
            setSpinnerEnabled(true);
            fetch(`https://graph.facebook.com/me?access_token=${token}&fields=id,name,email,picture.height(500)`)
              .then(response => response.json())
              .then(data => {
                setLoggedinStatus(true);
                setUserData(data);
                //console.log(data);
                const fbUsername = data.name;
                
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
                    storeToken(fbUsername, data.userId);
                    dispatch({type: "assigntoken",data: fbUsername});
                    
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
              .catch(e => {console.log(e);setSpinnerEnabled(false);})
          } else {
            // type === 'cancel'
          }
        } catch ({ message }) {
          alert(`Facebook Login Error: ${message}`);
        }
      }
    
      const logout = () => {
        setLoggedinStatus(false);
        setUserData(null);
        setImageLoadStatus(false);
      }    

    return (
        <View style={styles.mainContainer}>
            <Spinner
            visible={spinnerEnabled}
            textContent={'Loading...'}
            textStyle={{color: '#000'}}
            />
            <View style={styles.headerView} >
                <Image style={{width: 100, height: 100}} source={require("../assets/chat-icon-new.png")}/>
                <Text style={styles.headerText}>Login</Text>
            </View>
            <View style={styles.inputContainer}>
                <Image style={styles.inputImage} source={require("../assets/mail.png")}/>
                <TextInput style={styles.inputTxt}
                    placeholder="Username"
                    keyboardType="email-address"
                    value= {username}
                    underlineColorAndroid='transparent'
                    onChangeText={email => setUsername(email)}/>
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

            <TouchableHighlight style={styles.forgotContainer}>
                <Text style={styles.forgotText}>Forgot Password?</Text>
            </TouchableHighlight>
           
            
                <TouchableHighlight style={styles.buttonContainer}
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
                            
                            setSpinnerEnabled(false);
                            storeToken(responseJson.username, responseJson.userId);
                            dispatch({type: "assigntoken",data: responseJson.username});
                    
                            //getToken();
                            // navigation.navigate("Home", {username: responseJson.username});
                            //navigation.navigate("Dashboard");
                            
                        }else{
                            setSpinnerEnabled(false);
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
                    }}
                >
                    <Text style={{color: '#ffffff', fontSize: 15, fontWeight:'bold'}}>Login</Text>
                </TouchableHighlight>
               

                    <TouchableOpacity style={styles.loginBtn} onPress={facebookLogIn}>
                    
                    <Text style={{ color: "#fff" }}>Login with Facebook</Text>
                    </TouchableOpacity>

            <View style={styles.registerContainer}>
                <Text style={{color: 'gray', fontSize: 10, fontWeight:'bold'}}>Don't have an account? </Text>
                <TouchableHighlight onPress={() => navigation.navigate("Signup")}>
                    <Text style={{color: '#541a6b', fontSize: 12, fontWeight:'bold'}}>Register </Text>
                </TouchableHighlight>
            </View>
           
          </View>
    );

    async function storeToken(username, userId) {
        try {
            await AsyncStorage.setItem("userData", username);
            await AsyncStorage.setItem("userId", userId);
        } catch (error) {
            console.log("Something went wrong", error);
        }
    }
}

const styles= StyleSheet.create({
    mainContainer:{
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
    },
    headerView:{
        height: 200, width:300, 
        backgroundColor: '#541a6b', 
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
        color: '#541a6b', fontSize: 12, fontWeight:'bold'
    },
    buttonContainer:{
        borderBottomColor: '#541a6b',
        backgroundColor: '#541a6b',
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