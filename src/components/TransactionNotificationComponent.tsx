import { StyleSheet, Text, View,Pressable, Dimensions,Alert} from 'react-native'
import React, { useState,useEffect } from 'react'
import { Skeleton } from '@rneui/base'
import { useTheme } from 'react-native-paper'
import { Image } from 'react-native'
import axios from 'axios'
import moment from "moment"
import TextShortener from './TextShortener'

type TransactionNotificationComponentProps = {
    notification:CustomNotification
    navigation:any
}

const {width,height} = Dimensions.get("window")

const TransactionNotificationComponent = ({notification,navigation}:TransactionNotificationComponentProps) => {
   
    const [notFrom,setNotFrom] = useState<User|null>(null)
    const [loading,setLoading] = useState<boolean>(false)
    const theme = useTheme()

      useEffect(function () {
      console.log("Fetching user");
      setLoading(true);
      let fetchData = async () => {
         // console.log("Fetching user")
         //  let activeUserId = 1
         try {
            let response = await fetch(
               `http://192.168.0.100:5000/api/auth/users/${notification.notificationFrom}`,
               { method: "GET" }
            );
            let data = await response.json();
            if (data.status == "success") {
               // console.log("Users-----", data.data);
               setNotFrom(data.data.personal);
               // Alert.alert("Success",data.message)
               setLoading(false);
            } else {
               Alert.alert("Failed", data.message);
            }
            setLoading(false);
         } catch (err) {
            console.log(err);
            Alert.alert("Failed", String(err));
            setLoading(false);
         }
      };
      fetchData();
   }, [])

      const handleNotification = async()=>{
            let notId = notification.id
            try{
               let {data} = await axios.get(`http://192.168.0.100:5000/api/notifications/read/${notId}`)
               if(data.status == 'success'){
                     navigation.navigate("UserProfileScreen",{userId:notification.notificationFrom})
                  Alert.alert("Failed",data.message)
               }
            }catch(err){
               Alert.alert("Failed","Connection failed.")
            }

   }


  if(!notFrom){
      return(<View style={{flexDirection:'row',margin:2}}>
        <Skeleton animation="wave" width={50} height={50} circle />
        <Skeleton animation="wave" style={{borderRadius:2,marginHorizontal:2}} width={300} height={80} />
        </View>)
  }
  return (
    <Pressable onPress={handleNotification} style={[styles.notContainer,{backgroundColor:notification.readStatus?theme.colors.primaryContainer:"white"}]} key={String(notification.id)}>
        <View> 
           <Image resizeMode = 'cover' source={{uri:notFrom.profileImage}} style={{width:50,height:50,borderRadius:30,marginRight:3}}/>
        </View>
        <View>
             <View style={styles.notHeader}>
            <Text style={styles.notTitle}>{notification.title}</Text>
           
        </View>
        <View style={{width:300,paddingRight:5}}>
           <TextShortener style={styles.notMessage} textLength={90} text={notification?.message}/>
        </View>
        {/* <Text style={styles.notMessage}>{notification?.message}</Text> */}
        <Text style={[styles.notDate,{color:theme.colors.secondary,flex:1}]}>
            {moment(notification?.createdAt, "YYYYMMDD").fromNow()}
        </Text>
        </View>
    </Pressable>
  )
}

export default TransactionNotificationComponent


const styles = StyleSheet.create({

   notContainer: {
      backgroundColor: "#ffffff",
      flexDirection:'row',
      padding: 5,
      marginVertical: 1,
      marginHorizontal:2,
      borderRadius:4
   },

   notTitle: {
      fontFamily: "Poppins_500Medium",
   },
   notMessage: {
      fontFamily: "Poppins_300Light",
      paddingHorizontal:2,
      flexWrap:'wrap'
   },
   notDate: {
      fontFamily: "Poppins_300Light_Italic",
      paddingHorizontal:2,
      textAlign:'right',
      fontSize:13,
   },
   notHeader: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
   },
});