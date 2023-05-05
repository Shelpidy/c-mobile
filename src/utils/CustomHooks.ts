import { useEffect, useState } from 'react';
import * as Notifications from 'expo-notifications';
import { Alert } from 'react-native';
import jwtDecode from "jwt-decode";
import SensitiveInfo from 'react-native-sensitive-info';


export const useCurrentUser = (): CurrentUser | null => {
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
  useEffect(() => {
    async function getToken(){
      let loginToken = await SensitiveInfo.getItem("loginToken",{})
      const decodedToken = jwtDecode(loginToken) as CurrentUser;
      setCurrentUser(decodedToken);
    }
    getToken()
   
  }, []);

  return currentUser;
};


export const usePushNotificationToken = <T>():T=>{

  const [token, setToken] = useState<any>(null);
  useEffect(() => {
    const registerForPushNotificationsAsync = async () => {
      let { status } = await Notifications.getPermissionsAsync();
      if (status !== 'granted') {
        let { status } = await Notifications.requestPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert("Failed",'Failed to get push notification permissions');
          return;
        }
      }

      let expoPushToken = await Notifications.getExpoPushTokenAsync();
      setToken(expoPushToken.data);
    };

    registerForPushNotificationsAsync();
  }, []);

  return token || "expoToken";
};

