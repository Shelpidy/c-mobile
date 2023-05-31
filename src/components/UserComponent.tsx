import {
   StyleSheet,
   Text,
   View,
   Alert,
   Pressable,
   Image,
   TextInput,
   Dimensions,
} from "react-native";
import React, { useEffect, useState } from "react";
import { EvilIcons, Fontisto } from "@expo/vector-icons";
import { Skeleton } from "@rneui/base";
import { Avatar, Button, useTheme } from "react-native-paper";
import TextShortener from "./TextShortener";
import axios from "axios";
import { useCurrentUser } from "../utils/CustomHooks";

type UserComponentProps = {
   navigation: any;
   _user: User;
};
const { width } = Dimensions.get("window");
const UserComponent = ({ navigation, _user }: UserComponentProps) => {
   const [user, SetUser] = useState<User | null>(null);
   const [loading, setLoading] = useState<boolean>(false);
   const currentUser = useCurrentUser();
   const { width, height } = Dimensions.get("window");
   const [followed, setFollowed] = useState<boolean>(false);

   let theme = useTheme();

   useEffect(() => {
      console.log("USER COMPONENT");
      console.log(_user.id);
      console.log(currentUser?.followingIds);
      if (currentUser?.followingIds?.includes(_user.id)) {
         console.log(_user.id, currentUser?.followingIds);
         setFollowed(true);
      }
      // dispatchPostComment({ type: "", payload: "" });
      SetUser(_user);
   }, [currentUser, _user]);

   const handleFollow = async () => {
      try {
         let { data } = await axios.put(
            `http://192.168.136.183:5000/api/media/follows/`,
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

   const gotoUserProfile = () => {
      if (currentUser?.id === user?.id) {
         navigation.navigate("ProfileScreen", { userId: user?.id });
      } else {
         navigation.navigate("UserProfileScreen", { userId: user?.id });
      }
   };

   if (!user) {
      return (
         <View>
            <Skeleton
               circle
               height={50}
               style={{ marginRight: 5 }}
               animation="wave"
               width={50}
            />
            <Skeleton height={50} animation="wave" width={width - 10} />
         </View>
      );
   }
   return (
      <View
         style={{
            backgroundColor: "#ffffff",
            margin: 0,
            width: width,
         }}>
         <View
            style={{
               flexDirection: "row",
               alignItems: "center",
               paddingHorizontal: 20,
               paddingVertical: 5,
            }}>
            <Pressable onPress={gotoUserProfile}>
               <Avatar.Image size={40} source={{ uri: user.profileImage }} />
               {/* <Image
                     style={styles.profileImage}
                     source={{ uri: user.profileImage }}
                  /> */}
            </Pressable>
            <View
               style={{
                  flex: 1,
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  margin: 4,
                  paddingHorizontal: 2,
               }}>
               {/* <View><Text style={{fontFamily:"Poppins_400Regular"}}>{user?.firstName} {user?.lastName}</Text> </View> */}
               <View>
                  <TextShortener
                     text={
                        user?.firstName +
                        " " +
                        user?.middleName +
                        " " +
                        user?.lastName
                     }
                     style={{
                        fontFamily: "Poppins_400Regular",
                        marginHorizontal: 3,
                     }}
                     textLength={16}
                  />
               </View>
               {/* <Pressable style={{marginHorizontal:5}}><Text><EvilIcons name='external-link' size={26} /></Text></Pressable> */}
               {user.id !== currentUser?.id && (
                  <Button
                     onPress={handleFollow}
                     style={{ marginVertical: 5, alignSelf: "flex-end" }}
                     mode={followed ? "text" : "contained"}>
                     {followed ? "unfollow" : "follow"}
                  </Button>
               )}

               {user.id === currentUser?.id && (
                  <Button
                     onPress={gotoUserProfile}
                     style={{ marginVertical: 5, alignSelf: "flex-end" }}
                     mode="text">
                     profile
                  </Button>
               )}
            </View>
         </View>
      </View>
   );
};

export default UserComponent;

const styles = StyleSheet.create({
   profileImage: {
      width: 40,
      height: 40,
      borderRadius: 20,
   },
});