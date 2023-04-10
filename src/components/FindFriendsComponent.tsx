import { ScrollView, StyleSheet, Text, View,Alert } from "react-native";
import React, { useEffect, useState } from "react";
import { users as commodityUsers } from "../data";
import FindFriendComponent from "./FindFriendComponent";
import { AntDesign, Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import axios from "axios";
import { ActivityIndicator } from "react-native-paper";

const FindFriendsComponent = () => {
   const [users, setUsers] = useState<User[]>();
   const [loading,setLoading] = useState<boolean>(false)

   useEffect(function(){
      console.log("Fetching user")
      setLoading(true)
      let fetchData = async ()=>{
               // console.log("Fetching user")
          let activeUserId = 1
            try{
               let response = await fetch(`http://192.168.242.183:5000/api/media/unfollowing/${activeUserId}`,{method:"GET"})
               let data = await response.json()
               if(data.status == 'success'){
                  console.log("Users-----",data.data)
                  setUsers(data.data?.sort(() => 0.5 - Math.random()));
                  Alert.alert("Success",data.message)
                  setLoading(false)
               }else{
                  Alert.alert("Failed",data.message)
                  
               }
               setLoading(false)

            }catch(err){
               console.log(err)
               Alert.alert("Failed",String(err))
               setLoading(false)
            }
             }
         fetchData()
         }, []);

   if(loading) return (
      <View style={{flex:1,justifyContent:"center",alignItems:"center",padding:15}}>
         <Text><ActivityIndicator/></Text>
      </View>)
   return (
      <View>
         <Text
            style={{ fontFamily: "Poppins_600SemiBold", marginHorizontal: 15 }}>
            <Feather size={20} name="users" /> Users
         </Text>
         <ScrollView horizontal style={styles.container}>
            {users?.map((user) => {
               return <FindFriendComponent key={String(user.id)} {...user} />;
            })}
         </ScrollView>
      </View>
   );
};

export default FindFriendsComponent;

const styles = StyleSheet.create({
   container: {
      backgroundColor: "#f9f9f9",
      padding: 5,
   },
});
