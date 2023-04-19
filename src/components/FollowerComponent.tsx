import {
   Alert,
   Dimensions,
   Image,
   Pressable,
   StyleSheet,
   Text,
   View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { Button, IconButton, useTheme } from "react-native-paper";
import { SimpleLineIcons } from "@expo/vector-icons";
import axios from "axios";

const { width, height } = Dimensions.get("window");

type FollowerComponentProps = User & { route: any; navigation: any };

const FollowerComponent = ({
   route,
   navigation,
   ...user
}: FollowerComponentProps) => {
   const theme = useTheme();
   const [followed, setFollowed] = useState<boolean>(false);
   const [loading, setLoading] = useState<boolean>(false);
   const [currentUser, setCurrentUser] = useState<CurrentUser>({});

   useEffect(() => {
      let _currentUser: CurrentUser = {
         id: 1,
         email: "mexu.company@gmail.com",
         accountNumber: "1COM10000000000",
         followingIds: [3],
      };
      setCurrentUser(_currentUser);
      if (_currentUser.followingIds?.includes(user.id)) {
         setFollowed(true);
      }
   }, []);

   const handleFollow = async (userId: number) => {
      try {
         let { data } = await axios.put(
            `http://192.168.0.108:5000/api/media/follows/`,
            { followerId: 1, followingId: userId },
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
      if (currentUser.id === user.id) {
         navigation.navigate("ProfileScreen", { userId: user.id });
      } else {
         navigation.navigate("UserProfileScreen", { userId: user.id });
      }
   };

   return (
      <View style={styles.container}>
         <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Pressable onPress={gotoUserProfile}>
               <Image
                  resizeMode="cover"
                  style={styles.profileImage}
                  source={{ uri: user.profileImage }}
               />
            </Pressable>

            <Text style={styles.nameText}>{user.fullName}</Text>
         </View>

         {/* <Text style={styles.nameText}>{user.lastName}</Text> */}
         <View style={styles.followerContainer}>
            <Button
               loading={loading}
               disabled={loading}
               onPress={() => handleFollow(user.id)}
               mode={followed ? "contained-tonal" : "outlined"}
               style={{ borderColor: theme.colors.primary }}>
               <SimpleLineIcons
                  name={followed ? "user-following" : "user-follow"}
               />
               <Text
                  style={{
                     fontFamily: "Poppins_500Medium",
                  }}>
                  {followed ? " Unfollow" : " Follow"}
               </Text>
            </Button>
         </View>
      </View>
   );
};

export default FollowerComponent;

const styles = StyleSheet.create({
   profileImage: {
      width: 40,
      height: 40,
      borderRadius: 30,
   },
   container: {
      width: width / 1.5,
      borderRadius: 5,
      backgroundColor: "#fff",
      margin: 5,
   },
   followerContainer: {
      padding: 5,
   },
   nameText: {
      fontFamily: "Poppins_600SemiBold",
      margin: 5,
   },
});
