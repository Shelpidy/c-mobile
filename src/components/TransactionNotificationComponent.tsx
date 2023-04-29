import { StyleSheet, Text, View,Pressable, Dimensions,Alert} from 'react-native'
import React, { useState,useEffect } from 'react'
import { Skeleton } from '@rneui/base'
import { useTheme } from 'react-native-paper'
import { Image } from 'react-native'

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
               `http://192.168.2.183:5000/api/auth/users/${notification.notificationFrom}`,
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

    const handleNotification =()=>{
      if(notification.title === 'Money Transaction'){
         navigation.navigate("UserProfileScreen",{userId:notification.notificationFrom})
      }
      else if(notification.title === 'Buy Transaction'){
          navigation.navigate("ProductNotificationScreen",{userId:notification.notificationFrom})
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
            {/* <Button mode="text">
            <AntDesign name="delete" size={19} />
            </Button> */}
        </View>
        <Text style={styles.notMessage}>{notification?.message}</Text>
        <Text style={styles.notMessage}>
            {notification?.createdAt}
        </Text>

        </View>
       
    </Pressable>
  )
}

export default TransactionNotificationComponent


const styles = StyleSheet.create({

   notContainer: {
      backgroundColor: "#ffffff",
      flexDirection:"row",
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
      paddingHorizontal:2
   },
   notHeader: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
   },
});