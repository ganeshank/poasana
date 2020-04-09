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

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

export default function App({navigation}){
  const isSignedIn = useSelector(state => state.isSignedIn);
  
  return (
    
    <NavigationContainer>
      {isSignedIn==null?(
        <Stack.Navigator initialRouteName="Login">
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Signup" component={SignupScreen} />
        </Stack.Navigator>
      ):(
        <Drawer.Navigator initialRouteName="Home">
          <Drawer.Screen name="Home" component={Root} />
          <Drawer.Screen name="Profile" component={ProfileScreen} />
        </Drawer.Navigator>
      )}
      
    </NavigationContainer>
  );
}

 function Root({navigation}) {
    return (
          <Stack.Navigator initialRouteName="Dashboard" 
            screenOptions={{
              gestureEnabled: true
            }}
          >
            
            <Stack.Screen name="public" component={PublicChatScreen} 
              options={{
                headerTitle: props => <LogoTitle title="Public Chat Room" {...props} navigation={navigation}/>,
                headerStyle: {
                  backgroundColor: '#007acc',
                },
                headerLeft: ()=> {
                  <Button
                    onPress={() => alert('This is a button!')}
                    title="Info"
                    color="#007acc"
                  />
                },
                headerTintColor: '#fff',
                headerTitleStyle: {
                  fontWeight: 'bold',
                },
              }}/>
            <Stack.Screen name="Home" component={FriendListScreen} 
            options={{
              headerTitle: props => <LogoTitle title="Friends" {...props} navigation={navigation}/>,
              headerStyle: {
                backgroundColor: '#007acc',
              },
              headerLeft: ()=> {
                <Button
                  onPress={() => alert('This is a button!')}
                  title="Info"
                  color="#007acc"
                />
              },
              headerTintColor: '#fff',
              headerTitleStyle: {
                fontWeight: 'bold',
              },
            }}/>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Signup" component={SignupScreen} />
            <Stack.Screen name="Profile" component={ProfileScreen} />
            <Stack.Screen name="Dashboard" component={DashboardScreen} 
              options={{
                headerTitle: props => <LogoTitle title="Dashboard" {...props} navigation={navigation}/>,
                headerStyle: {
                  backgroundColor: '#007acc',
                },
                headerLeft: ()=> {
                  <Button
                    onPress={() => alert('This is a button!')}
                    title="Info"
                    color="#007acc"
                  />
                },
                headerTintColor: '#fff',
                headerTitleStyle: {
                  fontWeight: 'bold',
                },
              }}/>
            <Stack.Screen name="Chat" component={ChatScreen} 
            options={({ route }) => ({ title: route.params.name, headerTitle: props => <LogoTitle title={route.params.name} {...props} navigation={navigation}/>,
              headerStyle: {
                backgroundColor: '#007acc',
              },
              headerLeft: ()=> {
                <Button
                  onPress={() => alert('This is a button!')}
                  title="Info"
                  color="#007acc"
                />
              },
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
      <View style={{flex: 1, flexDirection: 'row'}}>
      <Image
        style={{ width: 30, height: 30 }}
        source={require('./assets/menubar.png')}
      />
      <Text style={{textAlignVertical: 'center', fontSize: 20, color: 'white', paddingLeft: 30}}>{props.title}</Text>

      <TouchableOpacity onPress={()=>
              Alert.alert(
                'Log out',
                'Do you want to logout?',
                [
                  {text: 'Cancel', onPress: () => {return null}},
                  {text: 'Confirm', onPress: () => {
                    AsyncStorage.clear();
                    props.navigation.navigate('Login')
                  }},
                ],
                { cancelable: false }
              )  
            }>
              <Text style={{margin: 70,fontWeight: 'bold',color: '#fff'}}>Logout</Text>
            </TouchableOpacity>
      </View>
    );
  }