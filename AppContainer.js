import React, {useEffect} from 'react';
import {Button, Image, Text, View, AsyncStorage, TouchableOpacity, Alert} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import ChatScreen from './screens/ChatScreen';
import JoinScreen from './screens/JoinScreen';
import FriendListScreen from './screens/FriendListScreen';
import LoginScreen from './screens/LoginScreen';
import SignupScreen from './screens/SignupScreen';
import DashboardScreen from './screens/DashboardScreen';
import ProfileScreen from './screens/ProfileScreen';
import { useSelector, useDispatch } from 'react-redux';
import PublicChatScreen from './screens/PublicChatScreen';
import PublicRoomScreen from './screens/PublicRoomScreen';
import TestScreen from './screens/TestScreen';
import DesignScreen from './screens/DesignScreen';

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

export default function App({navigation}){
  const isSignedIn = useSelector(state => state.isSignedIn);
  
  return (
    
    <NavigationContainer>
      {isSignedIn==null?(
        <Stack.Navigator initialRouteName="Design" screenOptions={{headerShown: false}}>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Signup" component={SignupScreen} />
          <Stack.Screen name="Design" component={DesignScreen} />
        </Stack.Navigator>
      ):(
        <Drawer.Navigator initialRouteName="Home" >
          <Drawer.Screen name="Home" component={Root} />
          <Drawer.Screen name="Profile" component={ProfileScreen} />
        </Drawer.Navigator>
      )}
      
    </NavigationContainer>
  );
}

 function Root({navigation}) {
   const dispatch = useDispatch();
    return (
          <Stack.Navigator initialRouteName="Dashboard" 
            screenOptions={{
              gestureEnabled: true,
              
            }}
          >
            
            <Stack.Screen name="public" component={PublicChatScreen} 
              options={{
                headerTitle: "Public Chat Screen",
                headerStyle: {
                  backgroundColor: '#541a6b',
                },
                headerTintColor: '#fff',
                headerTitleStyle: {
                  fontWeight: 'bold',
                },
                headerRight: props =><LogoTitle {...props} />
              }}/>
            <Stack.Screen name="publicroom" component={PublicRoomScreen} 
              options={{
                headerTitle: "Public Chat Room",
                headerStyle: {
                  backgroundColor: '#541a6b',
                },
                headerTintColor: '#fff',
                headerTitleStyle: {
                  fontWeight: 'bold',
                },
                headerRight: props =><LogoTitle {...props} />
              }}/>
            <Stack.Screen name="Home" component={FriendListScreen} 
            options={{
              headerTitle: "Friends",
              headerStyle: {
                backgroundColor: '#541a6b',
              },
              headerTintColor: '#fff',
              headerTitleStyle: {
                fontWeight: 'bold',
              },
              headerRight: props =><LogoTitle {...props} />
            }}/>
            <Stack.Screen name="Profile" component={ProfileScreen} />
            <Stack.Screen name="Dashboard" component={DashboardScreen} 
              options={{
                headerTitle: "Dashboard",
                headerStyle: {
                  backgroundColor: '#541a6b',
                },
                headerTintColor: '#fff',
                headerTitleStyle: {
                  fontWeight: 'bold',
                },
                headerRight: props =><LogoTitle {...props} />,
              }}/>
            <Stack.Screen name="Chat" component={ChatScreen} 
            options={({ route }) => ({ 
              headerTitle: route.params.name,
              headerStyle: {
                backgroundColor: '#541a6b',
              },
              headerRight: props =><LogoTitle {...props} />,
              headerTintColor: '#fff',
              headerTitleStyle: {
                fontWeight: 'bold',
              } })}/>
          </Stack.Navigator>
    );
  }

  function LogoTitle(props) {
    const dispatch = useDispatch();
    return (
      <TouchableOpacity onPress={async ()=>
              {
                const getSearchList = async () => {
                  Alert.alert(
                    'Log out',
                    'Do you want to logout?',
                    [
                      {text: 'Cancel', onPress: () => {return null}},
                      {text: 'Confirm', onPress: async () => {
                        await AsyncStorage.clear();
                        dispatch({type: 'assigntoken', data: null });
                        dispatch({type: 'login_flag', data: true });
                        dispatch({type: 'server/logout', data: "" });
                      }},
                    ],
                    { cancelable: false }
                  )
                };
                getSearchList();
              }
            }>
              <Text style={{margin: 10,fontWeight: 'bold',color: '#fff'}}>Logout</Text>
            </TouchableOpacity>


    );
  }