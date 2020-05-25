import React, {useState} from 'react'
import {StyleSheet, View, TouchableHighlight, Text, ImageBackground, Image, Dimensions, TouchableOpacity,AsyncStorage} from 'react-native'
import { TextInput } from 'react-native-gesture-handler'
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {useDispatch} from 'react-redux';
import { showMessage, hideMessage } from "react-native-flash-message";
import * as Facebook from 'expo-facebook';
import Spinner from 'react-native-loading-spinner-overlay';

var width = Dimensions.get('window').width; 
export default function DesignScreen({ navigation }){
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

    return (
        <View>
            <Spinner
                visible={spinnerEnabled}
                textContent={'Processing...'}
                textStyle={{color: '#000'}} />
            <ImageBackground source={require('../assets/back.png')} style={{width: '100%', height: '100%'}}>
                <View style={{flex:1, alignItems: 'center', marginTop: 50}}>
                    <Image style={{width:120, height:130}}
                        source={require('../assets/app-icon_trans.png')}/>
                    <TextInput 
                        style={styles.inputTxt}
                        placeholder="Username"
                        placeholderTextColor='#c9bfbf'
                        value= {username}
                        keyboardType="email-address"
                        underlineColorAndroid='transparent'
                        onChangeText={username => setUsername(username)}/>
                    <TextInput 
                        style={{...styles.inputTxt, marginTop: 20}}
                        placeholder="Password"
                        placeholderTextColor='#c9bfbf'
                        value={password}
                        secureTextEntry={true}
                        onChangeText={password => setPassword(password)}
                        underlineColorAndroid='transparent'/>

                    <TouchableOpacity style={styles.loginBtn} 
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
                        
                        <Text style={styles.loginTxt}>Log In</Text>
                    </TouchableOpacity>
                    <View style={{flexDirection: 'row', marginTop: 20}}>
                        <Text style={styles.forgotTxt}>Forgot your password? </Text>
                        <Text style={styles.clickHelp}>Click for help</Text>
                    </View>

                    <TouchableOpacity onPress={facebookLogIn}>
                        <View style={{flexDirection: 'row', marginTop: 30}}>
                            <FontAwesome  name="facebook-square" size={30} color="#c9bfbf"/>
                            <Text style={styles.socialTxt}>Log in with Facebook</Text>
                        </View>
                    </TouchableOpacity>
                    <View style={{flexDirection: 'row', marginTop: 20}}>
                        <FontAwesome  name="instagram" size={30} color="#c9bfbf"/>
                        <Text style={styles.socialTxt}>Log in with Instagram</Text>
                    </View>
                </View>
                <View style={{flexDirection: 'row'}}>
                    <TouchableOpacity style={styles.signupBox} >
                        
                        <Text style={styles.forgotTxt}>Don't have an account? </Text>
                        <TouchableHighlight onPress={() => navigation.navigate("Signup")}>
                            <Text style={styles.clickHelp}>Signup</Text>
                        </TouchableHighlight>
                    </TouchableOpacity>
                </View>

            </ImageBackground>
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
    inputTxt:{ 
        borderWidth: 0, 
        width: width-60, 
        height: 60,
        backgroundColor: '#BF385B',
        padding: 20,
        shadowColor: '#9F2B65',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 1,
        shadowRadius: 1,
        elevation: 2,
        color: '#720c3a',
        fontSize: 15,
        borderRadius:5,
        fontFamily: 'serif'
    }, 
    loginBtn:{
        borderColor: '#AE3160',
        borderWidth: 3,
        backgroundColor: '#BF385B',
        borderRadius:5,
        borderBottomWidth: 1,
        width: width-60, 
        height: 60,
        marginTop:20,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems:'center'
    },
    loginTxt:{ color: "#720c3a", fontFamily: 'serif' },
    forgotTxt:{color: '#720c3a', fontFamily: 'serif'},
    clickHelp:{color: '#c9bfbf', fontFamily: 'serif', fontWeight: 'bold'},
    socialTxt:{color: '#c9bfbf', fontFamily: 'serif', fontWeight: 'bold', margin: 5},
    signupBox:{
        borderColor: '#AE3160',
        borderWidth: 1,
        backgroundColor: '#BF385B',
        borderBottomWidth: 1,
        width: width, 
        height: 60,
        marginTop:20,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems:'center'
    }

})