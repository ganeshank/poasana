import React, {useState} from 'react';
import {View, Text, StyleSheet, AsyncStorage} from 'react-native';
import { TouchableHighlight } from 'react-native-gesture-handler';
import {useDispatch, useSelector} from 'react-redux';
import Spinner from 'react-native-loading-spinner-overlay';


export default function DashboardScreen({navigation}){
    const dispatch = useDispatch();
    const [spinnerEnabled, setSpinnerEnabled] = useState(false);
    const socket= useSelector(state => state.socket);
    const fromLogin= useSelector(state => state.fromLogin);

    React.useEffect(()=> {
        const getAllRegUser = async () => {
            try {
                setSpinnerEnabled(true);
                let username = await AsyncStorage.getItem("userData");
                fetch('https://poasana.000webhostapp.com/api/getallusers.php?user='+username+'&socket='+socket)
                .then(response => response.json())
                .then(data => {
                    console.log("33333");
                    const users1 = Object.values(data);
                    dispatch({type: "server/join",data: {allUsers: data, username: username}});
                    // dispatch({type: 'users_online', data: users1 });
                    // dispatch({type: 'self_user', data: data[username] });
                    //dispatch({type: 'login_flag', data: false });
                    setSpinnerEnabled(false);
                })
                .catch(e => {
                    setSpinnerEnabled(false);
                    console.log("error", e);
                })
            }
            catch(ex){
                setSpinnerEnabled(false);
                console.log("error", ex);
            }
        };

        if(socket!=null && fromLogin){
            getAllRegUser();
        }
    }, [socket,fromLogin]);
    
    return (
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center', height: 100, backgroundColor: '#E8E8E8'}}>
            <Spinner
            visible={spinnerEnabled}
            textContent={'Loading...'}
            textStyle={{color: '#000'}}
            />
            <TouchableHighlight 
                onPress={()=>{
                    getToken();
                    async function getToken() {
                        try {
                          setSpinnerEnabled(true);
                          let userData = await AsyncStorage.getItem("userData");
                          let userId = await AsyncStorage.getItem("userId");
                          //console.log("userData---", userData);
                         // dispatch({type: "server/join",data: userData});

                          fetch('https://poasana.000webhostapp.com/api/getchat.php?id='+userId)
                            .then(response => response.json())
                            .then(data => {
                                console.log("33333");
                                dispatch({type: 'conversation', data: data });
                                navigation.navigate("Home", {username: userData, chatconversations: data});
                                setSpinnerEnabled(false);
                            })
                            .catch(e => {
                                setSpinnerEnabled(false);
                                navigation.navigate("Home", {username: userData, chatconversations: {}});
                            })

                        } catch (error) {
                            setSpinnerEnabled(false);
                          console.log("Something went wrong", error);
                        }
                    }
                    //
                }}>
                <Text style={{backgroundColor: 'skyblue', width: 200, height: 100, textAlign: 'center', textAlignVertical: 'center', margin: 5}}>
                    Private Chat
                </Text>
            </TouchableHighlight>
            <TouchableHighlight 
                onPress={()=>{
                    getToken();
                    async function getToken() {
                        setSpinnerEnabled(true);
                        const userId = await AsyncStorage.getItem("userId");
                        const usern = await AsyncStorage.getItem("userData");
                        
                        fetch('https://poasana.000webhostapp.com/api/getpublicchat.php')
                        .then(response => response.json())
                        .then(data => {
                            setSpinnerEnabled(false);
                            dispatch({type: 'public_conversation', data: data });
                            navigation.navigate("publicroom", {id: userId, name: usern});
                        })
                        .catch(e => {
                            setSpinnerEnabled(false);
                            navigation.navigate("publicroom", {id: userId, name: usern});
                        })
                        
                    }
                    
                }}>
                <Text style={{backgroundColor: 'skyblue', width: 200, height: 100, textAlign: 'center', textAlignVertical: 'center', margin: 5}}>
                Public Chat
                </Text>
            </TouchableHighlight>
            
        </View>
    )

    
    
}