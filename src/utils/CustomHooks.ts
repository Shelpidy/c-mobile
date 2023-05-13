import React, { useEffect, useState } from "react";
import * as Notifications from "expo-notifications";
import { Alert } from "react-native";
import jwtDecode from "jwt-decode";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import NetInfo from "@react-native-community/netinfo";
import { io, Socket } from "socket.io-client";
import moment from "moment";

const generateRoomId = (secondUserId: any, activeUserId: any) => {
   let maxId = Math.max(secondUserId, activeUserId);
   let minId = Math.min(secondUserId, activeUserId);
   return Number(`${maxId}${minId}`);
};

export const useNetworkStatus = () => {
   const [isOnline, setIsOnline] = useState<boolean | null>(true);

   useEffect(() => {
      const checkOnlineStatus = async () => {
         try {
            const netInfoState = await NetInfo.fetch();
            setIsOnline(
               netInfoState.isConnected && netInfoState.isInternetReachable
            );
         } catch (error) {
            console.error("Error checking online status:", error);
         }
      };

      checkOnlineStatus();

      const unsubscribe = NetInfo.addEventListener(checkOnlineStatus);

      return () => {
         unsubscribe();
      };
   }, []);

   return isOnline;
};

export const useLastSeenOrOnlineStatus = (secondUserId: any) => {
   const [lastSeen, setLastSeen] = useState<string | null>(null);
   const [isConnected, setIsConnected] = useState<boolean | null>(true);
   const [socket, setSocket] = useState<Socket | null>(null);
   const currentUser = useCurrentUser();

   useEffect(() => {
      if (currentUser && secondUserId) {
         let secUser = secondUserId;
         let activeUser = currentUser?.id;
         let roomId = generateRoomId(secUser, activeUser);
         let newSocket = io(`http://192.168.52.183:8080/?userId=${activeUser}`);
         setSocket(newSocket);
         // cleanup function to close the socket connection when the component unmounts
         return () => {
            newSocket.close();
         };
      }
   }, [currentUser, secondUserId]);

   useEffect(() => {
      //// Updating Online Status//////////
      if (socket && secondUserId) {
         socket.on("online", (data) => {
            console.log("From Online", data);
            if (data.userId == secondUserId) {
               if (data.online) {
                  setLastSeen("online");
               } else {
                  let lastSeenDate = moment(
                     data.createdAt,
                     "YYYYMMDD"
                  ).fromNow();
                  setLastSeen(lastSeenDate);
               }
            }
         });
      }
   }, [socket, secondUserId]);

   return lastSeen;
};

export const useCurrentUser = () => {
   const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
   const navigation = useNavigation();
   useEffect(() => {
      async function getToken() {
         try {
            let loginToken = await AsyncStorage.getItem("loginToken");
            if (loginToken) {
               const decodedToken = jwtDecode(loginToken) as CurrentUser;
               setCurrentUser(decodedToken);
            }
         } catch (err) {
            console.log(err);
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
         try {
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
         } catch (err) {
            console.log(err);
         }
      };

      registerForPushNotificationsAsync();
   }, []);

   return token || "expoToken";
};
