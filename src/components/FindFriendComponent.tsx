import {
   Alert,
   Dimensions,
   Image,
   Pressable,
   StyleSheet,
   Text,
   View,
} from "react-native";
import React, { useState } from "react";
import { Avatar, Button, Card, IconButton, useTheme } from "react-native-paper";
import { SimpleLineIcons } from "@expo/vector-icons";
import axios from "axios";
import { useCurrentUser } from "../utils/CustomHooks";
import TextShortener from "./TextShortener";


const { width, height } = Dimensions.get("window");

type FindFriendProps = {
   user: User;
   navigation: any;
};

const FindFriendComponent = ({ user, navigation }: FindFriendProps) => {
   const theme = useTheme();
   const [followed, setFollowed] = useState<boolean>(false);
   const [loading, setLoading] = useState<boolean>(false);
   const currentUser = useCurrentUser();

   const gotoUserProfile = () => {
      console.log(user.id);
      navigation.navigate("UserProfileScreen", { userId: user.id });
   };

   const handleFollow = async () => {
      setLoading(true);
      try {
         let { data } = await axios.put(
            `http://192.168.0.114:5000/api/media/follows/`,
            { followerId: currentUser?.id, followingId: user?.id },
            { headers: { Accept: "application/json" } }
         );
         if (data.status == "success") {
            console.log(data.data);
            setFollowed(data.data.followed);
            Alert.alert("Success", data.message);
         } else {
            Alert.alert("Failed", data.message);
         }
         setLoading(false);
      } catch (err) {
         Alert.alert("Failed", String(err));
         setLoading(false);
      }
   };

   return (
      <Pressable onPress={gotoUserProfile}>
         <View style={styles.container}>
            <Avatar.Image
            size={150}
               source={{ uri: user.profileImage }}
            />
            <TextShortener
               style={styles.nameText}
               text={
                  user.firstName + " " + user.middleName + " " + user.lastName
               }
               textLength={15}
            />
            {/* <Text style={styles.nameText}>{user.lastName}</Text> */}
            <View style={styles.followerContainer}>
               <Button
                  loading={loading}
                  disabled={loading}
                  onPress={() => handleFollow()}
                  mode={followed ? "text" : "contained"}
                  style={{ borderColor: theme.colors.primary }}>
                  <SimpleLineIcons
                      size={13}
                     name={followed ? "user-following" : "user-follow"}
                  />
                  <Text
                     style={{
                        fontFamily: "Poppins_400Regular",
                        fontSize:11
                     }}>
                     {followed ? " Unfollow" : " Follow"}
                  </Text>
               </Button>
            </View>
         </View>
      </Pressable>
   );
};

export default FindFriendComponent;

const styles = StyleSheet.create({
   profileImage: {
      width: "100%",
      height: 200,
      borderRadius: 20,
   },
   container: {
      width: width / 2,
      borderRadius: 3,
      backgroundColor: "#fff",
      margin: 1,
      borderWidth:1,
      borderColor:"#ccc",
      alignItems:"center",
      paddingVertical:2
   },
   followerContainer: {
      padding: 3,
   },
   nameText: {
      fontFamily: "Poppins_400Regular",
      margin: 5,
      fontSize:11
   },
});
