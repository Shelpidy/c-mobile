import { useNavigation } from "@react-navigation/native";
import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, Button, Alert, ScrollView, Pressable } from "react-native";
import { Appbar, FAB, useTheme } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Drawer } from "react-native-drawer-layout";
import { AntDesign, Feather, Ionicons } from "@expo/vector-icons";
import { Image } from "react-native";
import { useCurrentUser } from "../utils/CustomHooks";

type CustomHeaderProps = {
   navigation?: any;
};

const CustomHeader = () => {
   const [loading, setLoading] = useState<boolean>(false);
   const [user, setUser] = useState<User>();
   const currentUser = useCurrentUser();
   const [activeTab, setActiveTab] = useState<number>(0);
   const theme = useTheme();
   const navigation = useNavigation<any>();

   useEffect(
      function () {
         console.log("Fetching user");
         setLoading(true);
         let fetchData = async () => {
            // console.log("Fetching user")
            try {
               if (currentUser) {
                  let response = await fetch(
                     `http://192.168.52.183:5000/api/auth/users/${currentUser?.id}`,
                     { method: "GET" }
                  );

                  if (response.ok) {
                     let data = await response.json();
                     // console.log("Users-----", data.data);
                     setUser(data.data.personal);
                     // Alert.alert("Success",data.message)
                     setLoading(false);
                  } else {
                     let data = await response.json();
                     Alert.alert("Failed", data.message);
                  }
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

   const gotoNextScreen = (screenName: string, params?: any) => {
      if (screenName === "HomeScreen") {
         setActiveTab(0);
         if (params) {
            navigation.navigate(screenName, params);
         } else {
            navigation.navigate(screenName);
         }
      } else if (screenName === "NotificationScreen") {
         setActiveTab(1);
         if (params) {
            navigation.navigate(screenName, params);
         } else {
            navigation.navigate(screenName);
         }
      } else if (screenName === "MarketingScreen") {
         setActiveTab(2);
         if (params) {
            navigation.navigate(screenName, params);
         } else {
            navigation.navigate(screenName);
         }
      } else if (screenName === "ProductsRequestScreen") {
         setActiveTab(3);
         if (params) {
            navigation.navigate(screenName, params);
         } else {
            navigation.navigate(screenName);
         }
      } else if (screenName === "SearchScreen") {
         setActiveTab(4);
         if (params) {
            navigation.navigate(screenName, params);
         } else {
            navigation.navigate(screenName);
         }
      } else if (screenName === "ProfileScreen") {
         setActiveTab(5);
         if (params) {
            navigation.navigate(screenName, params);
         } else {
            navigation.navigate(screenName);
         }
      }
      else if (screenName === "ConversationsScreen") {
         setActiveTab(6);
         if (params) {
            navigation.navigate(screenName, params);
         } else {
            navigation.navigate(screenName);
         }
      }
   };

   return (
      <Appbar.Header style={{ alignItems: "center",backgroundColor:"#fff"}}>
         <ScrollView horizontal>
         {/* <Appbar.Content title="C" /> */}
         {navigation.canGoBack() && (
            <Appbar.BackAction onPress={() => navigation.goBack()} />
         )}
         <Appbar.Action
            style={{ alignItems: "center", flexDirection: "row" }}
            icon={() => (
               <Feather
                  color={
                     activeTab === 0
                        ? theme.colors.primary
                        : theme.colors.secondary
                  }
                  size={20}
                  name="home"
               />
            )}
            onPress={() => gotoNextScreen("HomeScreen")}
         />
         <Appbar.Action
            style={{ alignItems: "center", flexDirection: "row" }}
            icon={() => (
               <Ionicons 
               color={
                     activeTab === 6
                        ? theme.colors.primary
                        : theme.colors.secondary
                  }
                   size={20}
                name='md-chatbubbles-outline' />
            )}
            onPress={() => gotoNextScreen("ConversationsScreen")}
         />
         <Appbar.Action
            style={{ alignItems: "center", flexDirection: "row" }}
            icon={() => (
               <Feather
                  color={
                     activeTab === 1
                        ? theme.colors.primary
                        : theme.colors.secondary
                  }
                  size={20}
                  name="bell"
               />
            )}
            onPress={() => gotoNextScreen("NotificationScreen")}
         />
         <Appbar.Action
            style={{
               alignItems: "center",
               flexDirection: "row",
               justifyContent: "center",
            }}
            icon={() => (
               <Feather
                  color={
                     activeTab === 2
                        ? theme.colors.primary
                        : theme.colors.secondary
                  }
                  size={20}
                  name="shopping-bag"
               />
            )}
            onPress={() => gotoNextScreen("MarketingScreen")}
         />
         <Appbar.Action
            icon={() => (
               <Feather
                  color={
                     activeTab === 3
                        ? theme.colors.primary
                        : theme.colors.secondary
                  }
                  size={20}
                  name="shopping-cart"
               />
            )}
            onPress={() => gotoNextScreen("ProductsRequestScreen")}
         />
         <Appbar.Action
            icon={() => (
               <Feather
                  color={
                     activeTab === 4
                        ? theme.colors.primary
                        : theme.colors.secondary
                  }
                  size={20}
                  name="search"
               />
            )}
            onPress={() => gotoNextScreen("SearchScreen")}
         />
         {/* <Appbar.Action icon={()=><Feather size={20} name='users'/>} onPress={() =>setOpen(!open)} /> */}
         <Pressable
            style={styles.profileImage}
            onPress={() =>
               gotoNextScreen("ProfileScreen", { userId: currentUser?.id })
            }
         ><Text  style={styles.profileImage}>
            <Image
                  resizeMode="cover"
                  style={styles.profileImage}
                  source={{ uri: user?.profileImage }}
               />
         </Text>
         </Pressable>
         </ScrollView>
      </Appbar.Header>
   );
};

export default CustomHeader;

const styles = StyleSheet.create({
   profileImage: {
      width: 28,
      height: 28,
      borderRadius: 20,
      justifyContent: "center",
      alignItems: "center",
   },
});
