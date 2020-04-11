import React, {useState} from 'react';
import {View, Text, Image, FlatList, StyleSheet,TouchableOpacity} from 'react-native';
import {useSelector} from 'react-redux';



export default function PublicRoomScreen({navigation, route}) {
    const {itemContainerStyle, avatarImageStyle, avatarNameViewStyle} = styles;
    const usersOnline = [{"group":"Room1"}];
    const userId = route.params.id;
    const username = route.params.name;
   // const nameUser = route.params.username;
   // const chatconversations = route.params.chatconversations;
   // const [nouser, setNouser] = useState(true);

    return (
        <View style={{flex: 1}}>
            <FlatList 
                data={usersOnline}
                renderItem={({item}) => {
                        return (
                        
                            <TouchableOpacity onPress={() => {
                                // let chatData = [];
                                // console.log("1111133--", chatconversations.hasOwnProperty(item.userId));
                                // if(chatconversations.hasOwnProperty(item.userId)){
                                //     chatData = chatconversations[item.userId].messages;
                                // }
                                navigation.navigate("public",{id: userId, name: username})
                            }}>
                            <View style={itemContainerStyle}>
                                <Text style={{fontSize: 30, textAlign: 'center', textAlignVertical: 'center'
                                }}>{item.group}</Text>
                            </View>
                            </TouchableOpacity>
                        ) 
                    }
                    
                }
                keyExtractor={item => item.group}
                />
        </View>
        

    )
}

const styles= StyleSheet.create({
    itemContainerStyle: {flex:1, flexDirection: "row", backgroundColor: "#E8E8E8",
    borderWidth: 1, height: 100, textAlign: 'center'},
    avatarImageStyle: {width:100, height: 100, borderRadius: 50},
    avatarNameViewStyle: {
        flex:1,
        justifyContent:"center",
        alignItems: "center"
    }
})