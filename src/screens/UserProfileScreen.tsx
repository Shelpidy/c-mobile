import React, { useEffect, useState } from "react";
import {
   Alert,
   Dimensions,
   Image,
   ScrollView,
   StyleSheet,
   Text,
   View,
} from "react-native";
import {
   ActivityIndicator,
   Avatar,
   Button,
   useTheme,
} from "react-native-paper";
import PostComponent from "../components/MediaPosts/PostComponent";
import ProfileNavComponent from "../components/ProfileNavComponent";
import axios from "axios";
import { AntDesign } from "@expo/vector-icons";
import { useCurrentUser } from "../utils/CustomHooks";
import {
   LoadingPostComponent,
   LoadingProfileComponent,
} from "../components/MediaPosts/LoadingComponents";
import SharedPostComponent from "../components/MediaPosts/SharedPostComponent";

const { width, height } = Dimensions.get("window");

const UserProfileScreen = ({ navigation, route }: any) => {
   const theme = useTheme();
   const [posts, setPosts] = useState<PostComponentProps[] | null>(null);
   const [allPosts, setAllPosts] = useState<PostComponentProps[]>([]);
   const [user, setUser] = useState<any>(null);
   const [pageNumber, setPageNumber] = useState<number>(1);
   const [numberOfPostsPerPage, setNumberOfPostsPerPage] = useState<number>(20);
   const [numberOfPageLinks, setNumberOfPageLinks] = useState<number>(0);
   const [loading, setLoading] = useState<boolean>(false);
   const currentUser = useCurrentUser();
   const [followed, setFollowed] = useState<boolean>(false);
   const [roomId, setRoomId] = useState<number | null>(null);

   //////////////////// GET ROOM ID /////////////////

   useEffect(
      function () {
         let fetchData = async () => {
            // console.log("Fetching user")
            //  let activeUserId = 1
            try {
               let response = await fetch(
                  `http://192.168.0.114:8080/api/room/${route.params?.userId}/${currentUser?.id}`,
                  { method: "GET" }
               );
               let data = await response.json();
               if (data.status == "success") {
                  console.log("RoomId", data.data.roomId);
                  setRoomId(data.data.roomId);
               }
            } catch (err) {
               console.log(err);
               Alert.alert("Failed", String(err));
            }
         };
         if (currentUser) {
            fetchData();
         }
      },
      [currentUser, route.params]
   );

   useEffect(
      function () {
         console.log("Fetching user");
         console.log(route.params.userId);
         let fetchData = async () => {
            // console.log("Fetching user")
            //  let activeUserId = 1
            try {
               let response = await fetch(
                  `http://192.168.0.114:5000/api/auth/users/${route.params?.userId}`,
                  { method: "GET" }
               );
               let data = await response.json();
               if (data.status == "success") {
                  // console.log("Users-----", data.data);
                  setUser(data.data);
                  console.log(currentUser?.followingIds);

                  if (
                     currentUser?.followingIds?.includes(
                        data.data?.personal?.id
                     )
                  ) {
                     setFollowed(true);
                  }
               } else {
                  Alert.alert("Failed", data.message);
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
      [currentUser, route.params, followed]
   );

   useEffect(
      function () {
         let fetchData = async () => {
            let userId = route.params?.userId;
            try {
               let response = await fetch(
                  `http://192.168.0.114:5000/api/media/posts/user/${userId}`
               );
               let data = await response.json();
               if (data.status == "success") {
                  // console.log(data.data);
                  // setPosts(data.data);
                  let numOfPageLinks = 1;
                  let fetchedPost: PostComponentProps[] = data.data;
                  if (fetchedPost.length > numberOfPostsPerPage) {
                     numOfPageLinks = Math.ceil(
                        fetchedPost.length / numberOfPostsPerPage
                     );
                  }

                  // console.log(fetchedPost);
                  setAllPosts(fetchedPost);
                  setNumberOfPageLinks(numOfPageLinks);
                  const currentIndex = numberOfPostsPerPage * (pageNumber - 1);
                  const lastIndex = currentIndex + numberOfPostsPerPage;
                  setPosts(data.data.slice(currentIndex, lastIndex));
                  // Alert.alert("Success",data.message)
               } else {
                  Alert.alert("Failed", data.message);
               }
               setLoading(false);
            } catch (err) {
               Alert.alert("Failed", String(err));
               setLoading(false);
            }
         };
         fetchData();
      },
      [route]
   );

   useEffect(() => {
      const currentIndex = numberOfPostsPerPage * (pageNumber - 1);
      const lastIndex = currentIndex + numberOfPostsPerPage;
      setPosts(allPosts?.slice(currentIndex, lastIndex));
   }, [pageNumber]);

   const handleFollow = async () => {
      setLoading(true);
      try {
         let { data } = await axios.put(
            `http://192.168.0.114:5000/api/media/follows/`,
            { followerId: currentUser?.id, followingId: user?.personal.id },
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

   if (!user) {
      return <LoadingProfileComponent />;
   }

   return (
      <ScrollView
         style={{ flex: 1, backgroundColor: "#ffffff", paddingTop: 5 }}>
         <View style={{ justifyContent: "center", alignItems: "center" }}>
            <Avatar.Image
               style={{ borderColor: theme.colors.primary }}
               size={120}
               source={{ uri: user?.personal?.profileImage }}
            />

            <Text
               style={{
                  textAlign: "center",
                  marginTop: 10,
                  fontFamily: "Poppins_600SemiBold",
               }}>
               {user?.personal?.fullName}
            </Text>
         </View>
         <ScrollView horizontal style={styles.mediaContainer}>
            <View style={{ alignItems: "center", margin: 4 }}>
               <Text
                  style={{
                     textAlign: "center",
                     fontFamily: "Poppins_400Regular",
                     color: theme.colors.secondary,
                     fontSize: 16,
                  }}>
                  {user?.followers?.count}
               </Text>
               <Button
                  style={{ backgroundColor: "#f6f6f6" }}
                  onPress={() =>
                     navigation.navigate("FollowersScreen", {
                        user: user?.personal,
                     })
                  }>
                  <Text
                     style={{
                        // fontWeight: "bold",
                        textAlign: "center",
                        fontFamily: "Poppins_400Regular",
                        color: theme.colors.secondary,
                        fontSize: 15,
                     }}>
                     Followers
                  </Text>
               </Button>
            </View>

            <View style={{ alignItems: "center", margin: 4 }}>
               <Text
                  style={{
                     textAlign: "center",
                     fontFamily: "Poppins_400Regular",
                     // color:theme.colors.secondary,
                     fontSize: 16,
                  }}>
                  {user?.followings?.count}
               </Text>
               <Button
                  style={{ backgroundColor: "#f6f6f6" }}
                  onPress={() =>
                     navigation.navigate("FollowingsScreen", {
                        user: user?.personal,
                     })
                  }>
                  <Text
                     style={{
                        textAlign: "center",
                        fontFamily: "Poppins_400Regular",
                        color: theme.colors.secondary,
                        //  color:theme.colors.secondary,
                        fontSize: 15,
                     }}>
                     Following
                  </Text>
               </Button>
            </View>

            <View style={{ alignItems: "center", margin: 4 }}>
               <Text
                  style={{
                     textAlign: "center",
                     fontFamily: "Poppins_400Regular",
                     //  color:theme.colors.secondary,
                     fontSize: 15,
                  }}>
                  {user?.sales?.count}
               </Text>
               <Button style={{ backgroundColor: "#f6f6f6" }}>
                  <Text
                     style={{
                        // fontWeight: "bold",
                        textAlign: "center",
                        fontFamily: "Poppins_400Regular",
                        color: theme.colors.secondary,
                        fontSize: 15,
                     }}>
                     Sales
                  </Text>
               </Button>
            </View>
            <View style={{ alignItems: "center", margin: 4 }}>
               <Text
                  style={{
                     textAlign: "center",
                     fontFamily: "Poppins_400Regular",
                     // color:theme.colors.secondary,
                     fontSize: 15,
                  }}>
                  {user?.affiliates?.count}
               </Text>
               <Button style={{ backgroundColor: "#f6f6f6" }}>
                  <Text
                     style={{
                        // fontWeight: "bold",
                        textAlign: "center",
                        fontFamily: "Poppins_400Regular",
                        color: theme.colors.secondary,
                     }}>
                     Affiliate Product
                  </Text>
               </Button>
            </View>
         </ScrollView>
         <View
            style={{
               flex: 1,
               flexDirection: "row",
               justifyContent: "center",
               paddingHorizontal: 3,
               gap: 2,
               marginBottom: 10,
            }}>
            <Button
               loading={loading}
               disabled={loading}
               labelStyle={{ color: theme.colors.primary }}
               onPress={handleFollow}
               style={{ flex: 1, borderColor: theme.colors.primary }}
               mode={followed ? "outlined" : "contained-tonal"}>
               {followed ? "unfollow" : "follow"}
            </Button>
            <Button
               mode="contained"
               style={{ flex: 2 }}
               onPress={() =>
                  navigation.navigate("ChatScreen", {
                     user: user?.personal,
                     roomId,
                  })
               }>
               <AntDesign name="message1" /> message
            </Button>
         </View>
         <View style={{ alignItems: "center", marginBottom: 5 }}>
            <ProfileNavComponent
               navigation={navigation}
               user={user?.personal}
            />
         </View>
         {!posts && (
            <ScrollView>
               <LoadingPostComponent />
               <LoadingPostComponent />
               <LoadingPostComponent />
            </ScrollView>
         )}
         {posts && (
            <View>
               <View
                  style={{
                     backgroundColor: "#ffffff",
                     borderRadius: 10,
                     width: 200,
                     paddingHorizontal: 8,
                  }}>
                  <Text
                     style={{
                        fontFamily: "Poppins_500Medium",
                     }}>
                     Posts {posts.length}
                  </Text>
               </View>
               {posts.map((post) => {
                  if (post.fromId) {
                     return (
                        <SharedPostComponent
                           key={String(post.id)}
                           {...post}
                           navigation={navigation}
                        />
                     );
                  }
                  return (
                     <PostComponent
                        key={String(post.id)}
                        {...post}
                        navigation={navigation}
                     />
                  );
               })}
            </View>
         )}
      </ScrollView>
   );
};

export default UserProfileScreen;

const styles = StyleSheet.create({
   container: {
      paddingTop: 20,
      flex: 1,
      backgroundColor: "#f5f5f5",
      alignItems: "center",
      // justifyContent: "center",
      fontFamily: "Poppins_300Light",
   },
   mediaContainer: {
      // display: "flex",
      // flexDirection: "row",
      // justifyContent: "center",
      gap: 10,
      marginTop: 0,
      marginBottom: 15,
   },
   profileImage: {
      width: 100,
      height: 100,
      borderRadius: 100,
      borderWidth: 4,
   },
});
