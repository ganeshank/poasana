import React from 'react';
import {View, Text, StyleSheet, AsyncStorage} from 'react-native';
import { TouchableHighlight } from 'react-native-gesture-handler';
import {useDispatch} from 'react-redux';


export default function DashboardScreen({navigation}){
    const dispatch = useDispatch();
    
    return (
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center', height: 100, backgroundColor: 'powderblue'}}>
            <TouchableHighlight 
                onPress={()=>{
                    getToken();
                    async function getToken() {
                        try {
                          let userData = await AsyncStorage.getItem("userData");
                          //console.log("userData---", userData);
                          dispatch({type: "server/join",data: userData});
                          navigation.navigate("Home", {username: userData});
                        } catch (error) {
                          console.log("Something went wrong", error);
                        }
                    }
                    //
                }}>
                <Text style={{backgroundColor: 'skyblue', width: 200, height: 100, textAlign: 'center', textAlignVertical: 'center', margin: 5}}>
                    Private Chat
                </Text>
            </TouchableHighlight>
            <Text style={{backgroundColor: 'skyblue', width: 200, height: 100, textAlign: 'center', textAlignVertical: 'center', margin: 5}}>
               Public Chat
            </Text>
            
        </View>
    )

    
    
}