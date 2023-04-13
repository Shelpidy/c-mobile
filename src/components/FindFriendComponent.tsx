import { Alert, Dimensions, Image, StyleSheet, Text, View } from "react-native";
import React, { useState } from "react";
import { Button, IconButton, useTheme } from "react-native-paper";
import { SimpleLineIcons } from "@expo/vector-icons";
import axios from "axios";

const { width, height } = Dimensions.get("window");

const FindFriendComponent = (user: User) => {
   const theme = useTheme();
   const [followed,setFollowed] = useState<boolean>(false)
   const [loading,setLoading] = useState<boolean>(false)

   const handleFollow = async(userId:number)=>{
      try{
         let {data} = await axios.put(`http://192.168.193.183:5000/api/media/follows/`,{followerId:1,followingId:userId},{headers:{Accept: 'application/json'}})
         if(data.status == 'success'){
               console.log(data.data)
               setFollowed(!followed)
               Alert.alert("Success",data.message)
         }else{
            Alert.alert("Failed",data.message)
         }
         setLoading(false)

      }catch(err){
          Alert.alert("Failed",String(err))
         setLoading(false)
      }
      
   }
   return (
      <View style={styles.container}>
         <Image
            resizeMode="stretch"
            style={styles.profileImage}
            source={{ uri: user.profileImage }}
         />
         <Text style={styles.nameText}>{user.firstName} {user.lastName}</Text>
         {/* <Text style={styles.nameText}>{user.lastName}</Text> */}
         <View style={styles.followerContainer}>
            <Button
               loading={loading}
               disabled={loading}
               onPress={()=>handleFollow(user.id)}
               mode={followed?'contained-tonal':"outlined"}
               style={{ borderColor: theme.colors.primary }}>
               <SimpleLineIcons name={followed?"user-following":"user-follow"} />
               <Text
                  style={{
                     fontFamily: "Poppins_500Medium",
                  }}>
                  {followed ? ' Unfollow':" Follow"}
               </Text>
            </Button>
         </View>
      </View>
   );
};

export default FindFriendComponent;

const styles = StyleSheet.create({
   profileImage: {
      width: "100%",
      height: 250,
      borderRadius: 2,
   },
   container: {
      width: width / 1.5,
      borderRadius: 5,
      backgroundColor: "#fff",
      margin: 5,
   },
   followerContainer: {
      padding: 5,
   },
   nameText: {
      fontFamily: "Poppins_600SemiBold",
      margin: 5,
   },
});
