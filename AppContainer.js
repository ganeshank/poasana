import React from 'react';
import {Button, Image, Text, View} from 'react-native';
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

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

export default function App(){
  return (
    <NavigationContainer>
      <Drawer.Navigator initialRouteName="Home">
          <Drawer.Screen name="Home" component={Root} />
          <Drawer.Screen name="Profile" component={ProfileScreen} />
        </Drawer.Navigator>
    </NavigationContainer>
  );
}

 function Root() {
    return (
          <Stack.Navigator initialRouteName="Login" 
            screenOptions={{
              gestureEnabled: true
            }}
          >
            
            <Stack.Screen name="Join" component={JoinScreen} />
            <Stack.Screen name="Home" component={FriendListScreen} 
            options={{
              headerTitle: props => <LogoTitle title="Friends" {...props} />,
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
                headerTitle: props => <LogoTitle title="Dashboard" {...props} />,
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
            options={({ route }) => ({ title: route.params.name, headerTitle: props => <LogoTitle title={route.params.name} {...props} />,
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
    return (
      <View style={{flex: 1, flexDirection: 'row'}}>
      <Image
        style={{ width: 30, height: 30 }}
        source={require('./assets/menubar.png')}
      />
      <Text style={{textAlignVertical: 'center', fontSize: 20, color: 'white', paddingLeft: 30}}>{props.title}</Text>
      </View>
    );
  }