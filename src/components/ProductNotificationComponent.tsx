import {
   StyleSheet,
   Text,
   View,
   Pressable,
   Dimensions,
   Alert,
} from "react-native";
import React, { useState, useEffect } from "react";
import { Skeleton } from "@rneui/base";
import { useTheme } from "react-native-paper";
import { Image } from "react-native";
import axios from "axios";
import moment from "moment";
import TextShortener from "./TextShortener";

type ProductNotificationComponentProps = {
   notification: CustomNotification;
   navigation: any;
};

const { width, height } = Dimensions.get("window");

const ProductNotificationComponent = ({
   notification,
   navigation,
}: ProductNotificationComponentProps) => {
   const [notFrom, setNotFrom] = useState<Product | null>(null);
   const [loading, setLoading] = useState<boolean>(false);
   const theme = useTheme();

   useEffect(
      function () {
         console.log("Fetching notification products");
         setLoading(true);
         let fetchData = async () => {
            // console.log("Fetching user")
            //  let activeUserId = 1
            try {
               let response = await fetch(
                  `http://192.168.1.93:5000/marketing/products/${notification?.notificationFrom}`,
                  { method: "GET" }
               );
               if (response.ok) {
                  let data = await response.json();
                  console.log("Products-----", data.data);
                  setNotFrom(data.data);
                  // Alert.alert("Success",data.message)
                  setLoading(false);
               } else {
                  let data = await response.json();
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
      [notification]
   );

   const handleNotification = async () => {
      let notId = notification.id;
      try {
         let { data } = await axios.put(
            `http://192.168.1.93:5000/notifications/read/${notId}`
         );
         if (data.status == "success") {
            navigation.navigate("ProductNotificationScreen", {
               productId: notification.notificationFrom,
            });
         } else {
            Alert.alert("Failed", data.message);
         }
      } catch (err) {
         console.log(err);
         Alert.alert("Failed", String(err));
      }
   };
   if (!notFrom) {
      return (
         <View style={{ flexDirection: "row", margin: 2 }}>
            <Skeleton animation="wave" width={50} height={50} circle />
            <Skeleton
               animation="wave"
               style={{ borderRadius: 2, marginHorizontal: 2 }}
               width={300}
               height={80}
            />
         </View>
      );
   }
   return (
      <Pressable
         onPress={handleNotification}
         style={[
            styles.notContainer,
            {
               backgroundColor: notification.readStatus
                  ? "white"
                  : theme.colors.primaryContainer,
            },
         ]}
         key={String(notification.id)}>
         <View>
            {notFrom.images && (
               <Image
                  resizeMode="cover"
                  source={{ uri: JSON.parse(String(notFrom.images))[0] }}
                  style={{
                     width: 50,
                     height: 50,
                     marginRight: 3,
                     borderRadius: 25,
                  }}
               />
            )}
         </View>
         <View>
            <View style={styles.notHeader}></View>
            <View>
               <View style={{ width: 300, paddingRight: 5 }}>
                  <TextShortener
                     style={styles.notMessage}
                     textLength={90}
                     text={notification?.message}
                  />
               </View>
               <Text
                  style={[styles.notDate, { color: theme.colors.secondary }]}>
                  {" "}
                  {moment(notification?.createdAt, "YYYYMMDD").fromNow()}
               </Text>
            </View>
         </View>
      </Pressable>
   );
};

export default ProductNotificationComponent;

const styles = StyleSheet.create({
   container: {
      backgroundColor: "#f5f5f5",
      padding: 10,
   },
   notContainer: {
      backgroundColor: "#ffffff",
      flexDirection: "row",
      padding: 5,
      marginVertical: 1,
      marginHorizontal: 2,
      borderRadius: 4,
   },

   notTitle: {
      fontFamily: "Poppins_500Medium",
   },
   notMessage: {
      fontFamily: "Poppins_300Light",
      paddingHorizontal: 2,
      flexWrap: "wrap",
   },
   notDate: {
      fontFamily: "Poppins_300Light_Italic",
      paddingHorizontal: 2,
      textAlign: "right",
      fontSize: 13,
   },
   notHeader: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
   },
});
