import React, { useEffect, useState } from "react";
import * as Notifications from "expo-notifications";
import { Alert } from "react-native";
import jwtDecode from "jwt-decode";
import AsyncStorage from "@react-native-async-storage/async-storage"
import { useNavigation } from "@react-navigation/native";

export const useCurrentUser = () => {
   const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
   const navigation = useNavigation()
   useEffect(() => {
      async function getToken() {
         try{
             let loginToken = await AsyncStorage.getItem("loginToken");
               if(loginToken){
                  const decodedToken = jwtDecode(loginToken) as CurrentUser;
                  setCurrentUser(decodedToken);
               }

         }catch(err){
            
            console.log(err)
         }
        
       
      }
      getToken();
   }, []);

   return currentUser;
};

export const usePushNotificationToken = <T>(): T => {
   const [token, setToken] = useState<any>(null);
   useEffect(() => {
      const registerForPushNotificationsAsync = async () => {
         try{
             let { status } = await Notifications.getPermissionsAsync();
         if (status !== "granted") {
            let { status } = await Notifications.requestPermissionsAsync();
            if (status !== "granted") {
               Alert.alert(
                  "Failed",
                  "Failed to get push notification permissions"
               );
               return;
            }
         }
           let expoPushToken = await Notifications.getExpoPushTokenAsync();
         setToken(expoPushToken.data);

         }catch(err){
            console.log(err)
         }
       
      };

      registerForPushNotificationsAsync();
   }, []);

   return token || "expoToken";
};
