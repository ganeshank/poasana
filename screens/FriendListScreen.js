import React, {useState} from 'react';
import {View, Text, Image, FlatList, StyleSheet,TouchableOpacity} from 'react-native';
import {useSelector} from 'react-redux';



export default function FriendListScreen({navigation, route}) {
    const {itemContainerStyle, avatarImageStyle, avatarNameViewStyle} = styles;
    const usersOnline = useSelector(state => state.usersOnline);
    const nameUser = route.params.username;
    const chatconversations = route.params.chatconversations;
    const [nouser, setNouser] = useState(true);

    return (
        <View style={{flex: 1,backgroundColor: "#E8E8E8"}}>
            <FlatList 
                data={usersOnline}
                renderItem={({item}) => {
                     if(nameUser != item.username){
                        setNouser(false);
                        return (
                        
                            <TouchableOpacity onPress={() => {
                                // let chatData = [];
                                // console.log("1111133--", chatconversations.hasOwnProperty(item.userId));
                                // if(chatconversations.hasOwnProperty(item.userId)){
                                //     chatData = chatconversations[item.userId].messages;
                                // }
                                navigation.navigate("Chat",
                                {name:item.username, userId: item.userId})
                            }}>
                            <View style={itemContainerStyle}>
                                <Image style={avatarImageStyle}
                                    source={{uri: item.avatar}}
                                />
                                {item.isOnline == 1 ? 
                                <Image style={{width: 15, height: 15}}
                                    source={require("../assets/online.png")}
                                />
                                :<Image style={{width: 15, height: 15}}
                                source={require("../assets/offline.png")}
                                />}
                                <View style={avatarNameViewStyle}>
                                    <Text style={{fontSize: 20
                                    }}>{item.username}</Text>
                                </View>
                            </View>
                            </TouchableOpacity>
                        ) 
                    }
                    
                }} 
                keyExtractor={item => item.userId}
                />
        </View>
        

    )
}

const styles= StyleSheet.create({
    itemContainerStyle: {flex:1, flexDirection: "row", backgroundColor: "#E8E8E8",
    borderWidth: 0.4},
    avatarImageStyle: {width:60, height: 60, borderRadius: 10},
    avatarNameViewStyle: {
        flex:1,
        justifyContent:"center",
        alignItems: "center"
    }
})