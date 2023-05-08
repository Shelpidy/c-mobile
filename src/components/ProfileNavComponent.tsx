import { Alert, Dimensions, StyleSheet, Text, View } from "react-native";
import React, { useState, useEffect } from "react";
import {
   AntDesign,
   Entypo,
   Feather,
   MaterialCommunityIcons,
   MaterialIcons,
} from "@expo/vector-icons";
import { Button, useTheme } from "react-native-paper";
import { useCurrentUser } from "../utils/CustomHooks";

const { width } = Dimensions.get("window");

const ProfileNavComponent = ({ navigation, user }: any) => {
   const currentUser = useCurrentUser();
   const theme = useTheme();

   return (
      <View style={styles.navs}>
         {currentUser?.id === user?.id && (
            <View style={styles.navLink}>
               <AntDesign
                  name="setting"
                  size={20}
                  color={theme.colors.secondary}
               />
               <Text
                  style={{
                     fontFamily: "Poppins_500Medium",
                     color: theme.colors.secondary,
                  }}>
                  Settings
               </Text>
               <Button  onPress={() =>
                  navigation.navigate("SettingsScreen")
               }>
                  <Entypo name="chevron-thin-right" />
               </Button>
            </View>
         )}

         <View style={styles.navLink}>
            <Feather
               name="shopping-cart"
               size={20}
               color={theme.colors.secondary}
            />
            <Text
               style={{
                  fontFamily: "Poppins_500Medium",
                  color: theme.colors.secondary,
               }}>
               Products
            </Text>
            <Button
               onPress={() =>
                  navigation.navigate("UserProductScreen", { user })
               }>
               <Entypo name="chevron-thin-right" />
            </Button>
         </View>
         {currentUser?.id === user?.id && (
            <View style={styles.navLink}>
               <MaterialCommunityIcons
                  name="transfer"
                  size={20}
                  color={theme.colors.secondary}
               />
               <Text
                  style={{
                     fontFamily: "Poppins_500Medium",
                     color: theme.colors.secondary,
                  }}>
                  Send Money
               </Text>
               <Button
                  onPress={() => navigation.navigate("TransferMoneyScreen")}>
                  <Entypo name="chevron-thin-right" />
               </Button>
            </View>
         )}
         {currentUser?.id === user?.id && (
            <View style={styles.navLink}>
               <MaterialIcons
                  name="account-balance"
                  size={20}
                  color={theme.colors.secondary}
               />
               <Text
                  style={{
                     fontFamily: "Poppins_500Medium",
                     color: theme.colors.secondary,
                  }}>
                  Check Balance
               </Text>
               <Button
                  onPress={() =>
                     Alert.alert("", "Your Commodity blanace is C 20000.00")
                  }>
                  <Entypo name="chevron-thin-right" />
               </Button>
            </View>
         )}
         {currentUser?.id === user?.id && (
            <View style={styles.navLink}>
               <Feather name="users" size={20} color={theme.colors.secondary} />
               <Text
                  style={{
                     fontFamily: "Poppins_500Medium",
                     color: theme.colors.secondary,
                  }}>
                  Transferees
               </Text>
               <Button>
                  <Entypo name="chevron-thin-right" />
               </Button>
            </View>
         )}
         {currentUser?.id === user?.id && (
            <View style={styles.navLink}>
               <AntDesign
                  name="logout"
                  size={20}
                  color={theme.colors.secondary}
               />
               <Text
                  style={{
                     fontFamily: "Poppins_500Medium",
                     color: theme.colors.secondary,
                  }}>
                  Logout
               </Text>
               <Button>
                  <Entypo name="chevron-thin-right" />
               </Button>
            </View>
         )}
      </View>
   );
};

export default ProfileNavComponent;

const styles = StyleSheet.create({
   navs: {
      backgroundColor: "#fff",
      // flex:1,
      width: width - 40,
      borderRadius: 45,
      // marginBottom:120,
      paddingVertical: 15,
      paddingHorizontal: 10,
      // alignItems:'center'
   },
   navLink: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginVertical: 0,
      // backgroundColor:"#f5f5f5",
      paddingVertical: 1,
      paddingHorizontal: 25,
      borderRadius: 20,
   },
});
