import {
   Dimensions,
   StyleSheet,
   Text,
   View,
   ScrollView,
   Alert,
   TouchableHighlight,
   Pressable,
} from "react-native";
import React, { useEffect, useState } from "react";
import { Skeleton, ThemeConsumer } from "@rneui/themed";
import { Button, useTheme, ActivityIndicator } from "react-native-paper";
import { AntDesign } from "@expo/vector-icons";
import NotificationComponent from "../components/TransactionNotificationComponent";
import ProductNotificationComponent from "../components/ProductNotificationComponent";
import TransactionNotificationComponent from "../components/TransactionNotificationComponent";
import { useCurrentUser } from "../utils/CustomHooks";

const { width, height } = Dimensions.get("screen");

const NotificationScreen = ({ navigation }: any) => {
   const [notifications, setNotifications] = useState<
      CustomNotification[] | null
   >(null);
   const [loading, setLoading] = useState<boolean>(false);
   const currentUser = useCurrentUser();
   const theme = useTheme();

   useEffect(
      function () {
         console.log("Fetching user");
         setLoading(true);
         let fetchData = async () => {
            let activeUserId = currentUser?.id;
            try {
               let response = await fetch(
                  `http://192.168.161.183:5000/api/notifications/${activeUserId}`,
                  { method: "GET" }
               );
               let data = await response.json();
               if (data.status == "success") {
                  // console.log("User Notifications-----", data.data);
                  setNotifications(data.data);
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
      },
      [currentUser]
   );

   if (!notifications) {
      return (
         <View style={styles.notContainer}>
            <ActivityIndicator></ActivityIndicator>
         </View>
      );
   }
   return (
      <ScrollView style={styles.container}>
         {notifications.map((notification) => {
            if (notification.title === "Buy Transaction") {
               return (
                  <ProductNotificationComponent
                     key={String(notification.id)}
                     notification={notification}
                     navigation={navigation}
                  />
               );
            } else if (notification.title === "Money Transaction") {
               return (
                  <TransactionNotificationComponent
                     key={String(notification.id)}
                     notification={notification}
                     navigation={navigation}
                  />
               );
            } else {
               return (
                  <View>
                     <Text>No other notification</Text>
                  </View>
               );
            }
         })}
      </ScrollView>
   );
};

export default NotificationScreen;

const styles = StyleSheet.create({
   container: {
      backgroundColor: "#f5f5f5",
   },
   notContainer: {
      backgroundColor: "#ffffff",
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
   },
});
