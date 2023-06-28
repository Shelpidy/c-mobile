import React, { useEffect, useState } from "react";
import {
   Alert,
   Dimensions,
   FlatList,
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

type PostComponent = {
   post: Post;
   commentsCount: number;
   likesCount: number;
   sharesCount: number;
   user: User;
   liked: boolean;
   secondUser: User;
};

const UserProfileScreen = ({ navigation, route }: any) => {
   const theme = useTheme();
   const [posts, setPosts] = useState<PostComponent[] | null>(null);
   const [allPosts, setAllPosts] = useState<PostComponent[]>([]);
   const [user, setUser] = useState<any>(null);
   const page = React.useRef<number>(1);
   const [numberOfPostsPerPage, setNumberOfPostsPerPage] = useState<number>(20);
   const [loading, setLoading] = useState<boolean>(false);
   const currentUser = useCurrentUser();
   const [followed, setFollowed] = useState<boolean>(false);
   const [roomId, setRoomId] = useState<number | null>(null);
   const [hasMore, setHasMore] = useState(true);
   const [loadingFetch, setLoadingFetch] = useState<boolean>(false);

   //////////////////// GET ROOM ID /////////////////

   useEffect(
      function () {
         let fetchData = async () => {
            // console.log("Fetching user")
            //  let activeUserId = 1
            try {
               let response = await fetch(
                  `http://192.168.148.183:8080/api/room/${route.params?.userId}/${currentUser?.id}`,
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
         console.log("Fetching user profile details");
         console.log(route.params.userId);
         let fetchData = async () => {
            // console.log("Fetching user")
            //  let activeUserId = 1
            try {
               let response = await fetch(
                  `http://192.168.148.183:5000/api/auth/users/${route.params?.userId}`,
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

   let fetchPostsData = async (pageNum?: number) => {
      let pageNumber = pageNum ?? page.current;
      if (!hasMore) return;
      try {
         if (currentUser) {
            setLoadingFetch(true);
            let activeUserId = currentUser?.id;
            let response = await fetch(
               `http://192.168.148.183:5000/api/media/posts/session/${activeUserId}/${pageNumber}/${numberOfPostsPerPage}`
            );
            let data = await response.json();
            if (data.status == "success") {
               console.log(data.data);
               // setPosts(data.data);
               let fetchedPost: PostComponent[] = data.data;

               setAllPosts((prev) =>
                  prev ? [...prev, ...fetchedPost] : fetchedPost
               );
               setPosts((prev) =>
                  prev ? [...prev, ...fetchedPost] : fetchedPost
               );

               if (fetchedPost.length > 0) page.current++;
               if (data.length < numberOfPostsPerPage) {
                  setHasMore(false);
               }
               setLoadingFetch(false);
               // Alert.alert("Success",data.message)
            } else {
               Alert.alert("Failed", data.message);
               setLoadingFetch(false);
            }
         }
      } catch (err) {
         Alert.alert("Failed", String(err));
         setLoadingFetch(false);
      }
   };

   useEffect(function () {
      fetchPostsData(1);
   }, []);

   const handleFollow = async () => {
      setLoading(true);
      try {
         let { data } = await axios.put(
            `http://192.168.148.183:5000/api/media/follows/`,
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

   const handleLoadMore = () => {
      console.log("Posts Reached end");
      if (loadingFetch) return;
      fetchPostsData();
   };

   const renderFooter = () => {
      if (!loading) return null;
      return (
         <View
            style={{
               flexDirection: "row",
               padding: 10,
               justifyContent: "center",
               alignItems: "center",
               backgroundColor: "white",
            }}>
            <ActivityIndicator color="#cecece" size="small" />
            <Text style={{ color: "#cecece", marginLeft: 5 }}>
               Loading more posts
            </Text>
         </View>
      );
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
            <FlatList
               keyExtractor={(item) => String(item.post.id)}
               data={posts}
               renderItem={({ item, index, separators }) => {
                  if (item.post?.fromId) {
                     return (
                        <SharedPostComponent
                           key={String(item.post.id)}
                           {...item}
                        />
                     );
                  } else {
                     return (
                        <PostComponent key={String(item.post.id)} {...item} />
                     );
                  }
               }}
               onEndReached={handleLoadMore}
               onEndReachedThreshold={0.3}
               ListFooterComponent={renderFooter}
            />
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
