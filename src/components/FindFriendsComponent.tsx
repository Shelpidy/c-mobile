import { ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { users as commodityUsers } from '../data'
import FindFriendComponent from './FindFriendComponent'
import { AntDesign, Feather, MaterialCommunityIcons } from '@expo/vector-icons'

const FindFriendsComponent = () => {
    const [users,setUsers] = useState<User[]>()
    
    useEffect(()=>{
        setUsers(commodityUsers?.sort(()=> 0.5 - Math.random()))
    },[commodityUsers])


  return (
    <View>
        <Text style={{fontFamily:"Poppins_600SemiBold",marginHorizontal:15}}><Feather size={20} name='users'/> Users</Text>
    <ScrollView horizontal style={styles.container}>
      
      {
        users?.map(user =>{
            return(
                <FindFriendComponent {...user} />
            )
        })
      }
    </ScrollView>
    </View>
  )
}

export default FindFriendsComponent

const styles = StyleSheet.create({
    container:{
        backgroundColor:"#f9f9f9",
        padding:5
    }
})