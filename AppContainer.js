import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import ChatScreen from './screens/ChatScreen';
import JoinScreen from './screens/JoinScreen';
import FriendListScreen from './screens/FriendListScreen';
import LoginScreen from './screens/LoginScreen';
import SignupScreen from './screens/SignupScreen';

const Stack = createStackNavigator();

export default function App() {
    return (
        <NavigationContainer>
          <Stack.Navigator initialRouteName="Login" 
            screenOptions={{
              gestureEnabled: true
            }}
          >
            <Stack.Screen name="Join" component={JoinScreen} />
            <Stack.Screen name="Home" component={FriendListScreen} />
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Signup" component={SignupScreen} />
            <Stack.Screen name="Chat" component={ChatScreen} 
            options={({ route }) => ({ title: route.params.name })}/>
          </Stack.Navigator>
        </NavigationContainer>
    );
  }