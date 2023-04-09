import { ScrollView, StyleSheet, Text, View,Alert } from "react-native";
import React, { useEffect, useState } from "react";
import { users as commodityUsers } from "../data";
import FindFriendComponent from "./FindFriendComponent";
import { AntDesign, Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import axios from "axios";

const FindFriendsComponent = () => {
   const [users, setUsers] = useState<User[]>();
   const [loading,setLoading] = useState<boolean>(false)

   useEffect(function(){
      let fetchData = async ()=>{
          let activeUserId = 1
            try{
               let {data} = await axios.get(`http://127.0.0.1:5000/api/media/unfollowing/${activeUserId}`)
               if(data.status == 'success'){
                  console.log(data.data)
                  setUsers(data.data?.sort(() => 0.5 - Math.random()));
                  Alert.alert("Success",data.message)
               }else{
                  Alert.alert("Failed",data.message)
               }
               setLoading(false)

            }catch(err){
               Alert.alert("Failed",String(err))
               setLoading(false)
            }
            fetchData() }
         }, []);

   if(loading) return (<View style={{flex:1,justifyContent:"center",alignItems:"center"}}>
                           <Text>Loading...</Text>
                       </View>)
   return (
      <View>
         <Text
            style={{ fontFamily: "Poppins_600SemiBold", marginHorizontal: 15 }}>
            <Feather size={20} name="users" /> Users
         </Text>
         <ScrollView horizontal style={styles.container}>
            {users?.map((user) => {
               return <FindFriendComponent {...user} />;
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
