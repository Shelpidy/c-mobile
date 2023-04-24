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
import { Button, useTheme } from "react-native-paper";
import TextShortener from "./TextShortener";
import axios from "axios";

type UserComponentProps = {
   navigation: any;
   _user: User;
};

const UserComponent = ({ navigation, _user }: UserComponentProps) => {
   const [poster, SetPoster] = useState<any>(null);
   const [user, SetUser] = useState<User | null>(null);
   const [loading, setLoading] = useState<boolean>(false);
   const [currentUser, setCurrentUser] = useState<CurrentUser>({});
   const { width, height } = Dimensions.get("window");
   const [followed, setFollowed] = useState<boolean>(false);

   let theme = useTheme();

   useEffect(() => {
      let _currentUser: CurrentUser = {
         id: 1,
         email: "mexu.company@gmail.com",
         accountNumber: "1COM10000000000",
         followingIds: [1, 2, 3],
      };
      if (_currentUser.followingIds?.includes(_user.id)) {
         setFollowed(true);
      }
      // dispatchPostComment({ type: "", payload: "" });
      SetUser(_user);
      setCurrentUser(_currentUser);
   }, []);

   //     useEffect(function () {
   //       console.log("Fetching user");
   //       let user:CurrentUser = {
   //          id: 1,
   //          email: "mexu.company@gmail.com",
   //          accountNumber: "1COM10000000000",
   //       }

   //       setCurrentUser(user);

   //       setLoading(true);
   //       let fetchData = async () => {
   //          // console.log("Fetching user")
   //          //  let activeUserId = 1
   //          try {
   //             let response = await fetch(
   //                `http://192.168.120.183:5000/api/auth/users/${user.id}`,
   //                { method: "GET" }
   //             );
   //             let data = await response.json();
   //             if (data.status == "success") {
   //                console.log("Users-----", data.data);
   //                SetPoster(data.data.personal);
   //                // Alert.alert("Success",data.message)
   //                setLoading(false);
   //             } else {
   //                Alert.alert("Failed", data.message);
   //             }
   //             setLoading(false);
   //          } catch (err) {
   //             console.log(err);
   //             Alert.alert("Failed", String(err));
   //             setLoading(false);
   //          }
   //       };
   //       fetchData();
   //    }, []);

   const handleFollow = async () => {
      try {
         let { data } = await axios.put(
            `http://192.168.120.183:5000/api/media/follows/`,
            { followerId: currentUser.id, followingId: user?.id },
            { headers: { Accept: "application/json" } }
         );
         if (data.status == "success") {
            console.log(data.data);
            setFollowed(!followed);
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
      if (currentUser.id === poster.id) {
         navigation.navigate("ProfileScreen", { userId: poster.id });
      } else {
         navigation.navigate("UserProfileScreen", { userId: poster.id });
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
      <View style={{ backgroundColor: "#ffffff", margin: 2, borderRadius: 20 }}>
         {user && (
            <View
               style={{
                  flexDirection: "row",
                  alignItems: "center",
                  paddingHorizontal: 20,
                  paddingVertical: 5,
               }}>
               <Pressable onPress={gotoUserProfile}>
                  <Image
                     style={styles.profileImage}
                     source={{ uri: user.profileImage }}
                  />
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
                  <Button
                     onPress={handleFollow}
                     style={{ marginVertical: 5, alignSelf: "flex-end" }}
                     mode={followed ? "text" : "contained"}>
                     {followed ? "unfollow" : "follow"}
                  </Button>
               </View>
            </View>
         )}
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
