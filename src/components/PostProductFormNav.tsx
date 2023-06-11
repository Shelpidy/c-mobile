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
import { Fontisto } from "@expo/vector-icons";
import { Skeleton } from "@rneui/base";
import { useCurrentUser } from "../utils/CustomHooks";
import { Avatar } from "react-native-paper";

type PostProductFormNavProps = {
   navigation: any;
   page: "product" | "post";
};

const PostProductFormNav = ({ navigation, page }: PostProductFormNavProps) => {
   const [poster, SetPoster] = useState<any>(null);
   const [loading, setLoading] = useState<boolean>(false);
   const currentUser = useCurrentUser();
   const { width, height } = Dimensions.get("window");

   useEffect(
      function () {
         console.log("Fetching a user");
         let user = currentUser;
         setLoading(true);
         let fetchData = async () => {
            // console.log("Fetching user")
            //  let activeUserId = 1
            try {
               if (currentUser) {
                  let response = await fetch(
                     `http://192.168.144.183:5000/api/auth/users/${user?.id}`,
                     { method: "GET" }
                  );

                  if (response.ok) {
                     let data = await response.json();
                     // console.log("Users-----", data.data);
                     SetPoster(data.data.personal);
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

   const gotoUploadScreen = () => {
      if (page === "product") {
         navigation.navigate("ProductPostScreen", {
            openImagePicker: true,
         });
      } else {
         navigation.navigate("PostScreen", {
            openImagePicker: true,
         });
      }
   };

   const gotoUserProfile = () => {
      if (currentUser?.id === poster.id) {
         navigation.navigate("ProfileScreen", { userId: poster.id });
      } else {
         navigation.navigate("UserProfileScreen", { userId: poster.id });
      }
   };

   if (!poster) {
      return (
         <View
            style={{
               justifyContent: "center",
               flexDirection: "row",
               marginVertical: 5,
            }}>
            <Skeleton height={50} animation="wave" circle width={50} />
            <Skeleton
               height={50}
               style={{ borderRadius: 20, marginLeft: 4 }}
               animation="wave"
               width={300}
            />
         </View>
      );
   }
   return (
      <View>
         {poster && (
            <View
               style={{
                  flexDirection: "row",
                  alignItems: "center",
                  paddingHorizontal: 20,
                  paddingVertical: 5,
               }}>
               <Pressable onPress={gotoUserProfile}>
                  <Avatar.Image
                     source={{ uri: poster.profileImage }}
                     size={40}
                  />
               </Pressable>
               <View
                  style={{
                     paddingRight: 20,
                     flexDirection: "row",
                     alignItems: "center",
                     justifyContent: "center",
                     marginRight: 10,
                     marginLeft: 3,
                  }}>
                  <TextInput
                     placeholder={
                        page === "product"
                           ? "Upload Your Product..."
                           : "Upload Your Post..."
                     }
                     style={{
                        flex: 1,
                        backgroundColor: "#FFFFFF",
                        borderTopLeftRadius: 20,
                        borderBottomLeftRadius: 20,
                        height: 50,
                        paddingHorizontal: 25,
                     }}
                  />
                  <Pressable
                     onPress={gotoUploadScreen}
                     style={{
                        paddingHorizontal: 15,
                        height: 50,
                        alignItems: "center",
                        justifyContent: "center",
                        borderTopRightRadius: 20,
                        borderBottomRightRadius: 20,
                        backgroundColor: "#ffffff",
                     }}>
                     <Fontisto size={20} name="photograph" />
                  </Pressable>
               </View>
            </View>
         )}
      </View>
   );
};

export default PostProductFormNav;

const styles = StyleSheet.create({
   profileImage: {
      width: 35,
      height: 35,
      borderRadius: 20,
   },
});
