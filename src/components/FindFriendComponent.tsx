import { Dimensions, Image, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Button, IconButton, useTheme } from 'react-native-paper'
import { SimpleLineIcons } from '@expo/vector-icons'

const {width,height} = Dimensions.get('window')
const FindFriendComponent = (user:User) => {
const theme = useTheme()
  return (
    <View style={styles.container}>
        <Image resizeMode='stretch' style={styles.profileImage} source={{uri:user.profileImage}}/>
        <Text style={styles.nameText}>{user.fullName}</Text>
       <View style={styles.followerContainer}>
           <Button mode='outlined' style={{borderColor:theme.colors.primary}}><SimpleLineIcons name='user-follow'/> <Text style={{fontFamily:"Poppins_500Medium",marginHorizontal:4}}>Follow</Text></Button>
       </View>
    </View>
  )
}

export default FindFriendComponent

const styles = StyleSheet.create({
    profileImage:{
        width:"100%",
        height:180,
        borderRadius:10
    },
    container:{
        width:width/2,
        borderRadius:5,
        backgroundColor:"#fff",
        margin:5
    },
    followerContainer:{
        padding:5
    },
    nameText:{
        fontFamily:"Poppins_600SemiBold",
        margin:5
    }
})