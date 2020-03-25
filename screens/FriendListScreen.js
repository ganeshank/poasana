import React, {useState} from 'react';
import {View, Text, Image, FlatList, StyleSheet,TouchableOpacity} from 'react-native';
import {useSelector} from 'react-redux';



export default function FriendListScreen({navigation, route}) {
    const {itemContainerStyle, avatarImageStyle, avatarNameViewStyle} = styles;
    const usersOnline = useSelector(state => state.usersOnline);
    const nameUser = route.params.username;
    const [nouser, setNouser] = useState(true);

    return (
        <View style={{flex: 1}}>
            <FlatList 
                data={usersOnline}
                renderItem={({item}) => {
                    if(nameUser != item.username){
                        setNouser(false);
                        return (
                        
                            <TouchableOpacity onPress={() => {
                                navigation.navigate("Chat",
                                {name:item.username, userId: item.userId})
                            }}>
                            <View style={itemContainerStyle}>
                                <Image style={avatarImageStyle}
                                    source={{uri: item.avatar}}
                                />
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
                <View style={{justifyContent: 'center', alignItems: 'center', flex:1}}>
                {nouser ? (<Text>No other person is online currently!!</Text>): null }
                </View>
        </View>
        

    )
}

const styles= StyleSheet.create({
    itemContainerStyle: {flex:1, flexDirection: "row"},
    avatarImageStyle: {width:100, height: 100, borderRadius: 50},
    avatarNameViewStyle: {
        flex:1,
        justifyContent:"center",
        alignItems: "center"
    }
})