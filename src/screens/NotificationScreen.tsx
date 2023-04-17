import {
   Dimensions,
   StyleSheet,
   Text,
   View,
   ScrollView,
   Alert,
} from "react-native";
import React, { useEffect, useState } from "react";
import { Skeleton } from "@rneui/themed";
import { Button } from "react-native-paper";
import { AntDesign } from "@expo/vector-icons";

const { width, height } = Dimensions.get("screen");

const NotificationScreen = () => {
   const [notifications, setNotifications] = useState<any[] | null>(null);
   const [loading, setLoading] = useState<boolean>(false);
   const [currentUser, setCurrentUser] = useState<CurrentUser>({});

   useEffect(function () {
      console.log("Fetching user");
      setLoading(true);
      let fetchData = async () => {
         // console.log("Fetching user")
         let activeUserId = 1;
         try {
            let response = await fetch(
               `http://192.168.0.104:5000/api/notifications/${activeUserId}`,
               { method: "GET" }
            );
            let data = await response.json();
            if (data.status == "success") {
               console.log("User Notifications-----", data.data);
               setNotifications(data.data.sort(() => -1));
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
   }, []);

   if (!notifications) {
      return (
         <ScrollView style={styles.container}>
            <Skeleton animation="wave" style={styles.skeletonHeader} />
            <Skeleton animation="wave" style={styles.skeletonBody} />
            <Skeleton animation="wave" style={styles.skeletonBody} />
            <Skeleton animation="wave" style={styles.skeletonBody} />
            <Skeleton animation="wave" style={styles.skeletonBody} />
         </ScrollView>
      );
   }
   return (
      <ScrollView style={styles.container}>
         {notifications.map((notification) => {
            return (
               <View style={styles.notContainer} key={String(notification.id)}>
                  <View style={styles.notHeader}>
                     <Text style={styles.notTitle}>{notification.title}</Text>
                     <Button mode="text">
                        <AntDesign name="delete" size={19} />
                     </Button>
                  </View>
                  <Text style={styles.notMessage}>{notification.message}</Text>
                  <Text style={styles.notMessage}>
                     {notification.createdAt}
                  </Text>
               </View>
            );
         })}
      </ScrollView>
   );
};

export default NotificationScreen;

const styles = StyleSheet.create({
   container: {
      backgroundColor: "#f9f9f9",
      padding: 10,
   },
   notContainer: {
      backgroundColor: "#ffffff",
      padding: 10,
      marginVertical: 5,
   },
   skeletonBody: {
      width: "100%",
      height: height / 3,
      margin: 5,
   },
   skeletonHeader: {
      width: "100%",
      height: 50,
      margin: 5,
   },
   notTitle: {
      fontFamily: "Poppins_500Medium",
   },
   notMessage: {
      fontFamily: "Poppins_300Light",
   },
   notHeader: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
   },
});
