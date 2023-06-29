import React, { useEffect, useState } from "react";
import {
   Alert,
   Dimensions,
   ScrollView,
   StyleSheet,
   Text,
   View,
   FlatList,
} from "react-native";
import {
   ActivityIndicator,
   Avatar,
   Button,
   useTheme,
} from "react-native-paper";
import PostComponent from "../components/MediaPosts/PostComponent";
import ProfileNavComponent from "../components/ProfileNavComponent";
import { EvilIcons, MaterialCommunityIcons } from "@expo/vector-icons";
import SearchForm from "../components/SearchForm";
import SharedPostComponent from "../components/MediaPosts/SharedPostComponent";
import {
   LoadingPostComponent,
   LoadingProfileComponent,
} from "../components/MediaPosts/LoadingComponents";

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

const ProfileScreen = ({ navigation, route }: any) => {
   const theme = useTheme();
   const [posts, setPosts] = useState<PostComponent[] | null>(null);
   const [allPosts, setAllPosts] = useState<PostComponent[]>([]);
   const [user, setUser] = useState<any>(null);
   const page = React.useRef<number>(1);
   const [numberOfPostsPerPage, setNumberOfPostsPerPage] = useState<number>(5);
   const [loading, setLoading] = useState<boolean>(false);
   const [hasMore, setHasMore] = useState(true);
   const [loadingFetch, setLoadingFetch] = useState<boolean>(false);

   let fetchData = async (pageNum?: number) => {
      let pageNumber = pageNum ?? page.current;
      if (!hasMore) return;
      let userId = route.params.userId;
      try {
         let response = await fetch(
            `http://192.168.148.183:5000/api/media/posts/user/${userId}/${pageNumber}/${numberOfPostsPerPage}`
         );
         let data = await response.json();
         if (data.status == "success") {
            // console.log(data.data)
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
         } else {
            Alert.alert("Failed", data.message);
         }
         setLoadingFetch(false);
      } catch (err) {
         Alert.alert("Failed", String(err));
         setLoadingFetch(false);
      }
   };

   const searchPosts = (_token: string) => {
      console.log("From profile", _token);
      let token = _token.toLowerCase();
      let newPosts = allPosts?.filter(
         (post) =>
            post.post?.text?.toLowerCase().includes(token) ||
            post.post?.title?.toLowerCase().includes(token)
      );
      setPosts(newPosts);
   };

   const handleLoadMore = () => {
      console.log("Posts Reached end");
      if (loadingFetch) return;
      fetchData();
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

   useEffect(function () {
      console.log("Fetching user profile details");
      setLoading(true);
      let fetchData = async () => {
         // console.log("Fetching user")
         //  let activeUserId = 1
         try {
            let response = await fetch(
               `http://192.168.148.183:5000/api/auth/users/${route.params.userId}`,
               { method: "GET" }
            );
            let data = await response.json();
            if (data.status == "success") {
               console.log("Users-----", data.data);
               setUser(data.data);
               // Alert.alert("Success",data.message)
               setLoading(false);
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
   }, []);

   useEffect(function () {
      fetchData(1);
   }, []);

   if (!user) {
      return <LoadingProfileComponent />;
   }

   return (
      <ScrollView style={{ flex: 1, backgroundColor: "#fff", paddingTop: 10 }}>
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
                  fontFamily: "Poppins_500Medium",
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
                        fontSize: 13,
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
                        fontSize: 13,
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
                        fontSize: 13,
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
                     fontSize: 13,
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

         <View style={{ alignItems: "center", marginBottom: 5 }}>
            <ProfileNavComponent
               user={user?.personal}
            />
         </View>

         {!posts && (
            <ScrollView>
               <LoadingPostComponent />
               <LoadingPostComponent />
            </ScrollView>
         )}
         {posts && posts.length > 1 && (
            <SearchForm setSearchValue={(v) => searchPosts(v)} />
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

export default ProfileScreen;

const styles = StyleSheet.create({
   container: {
      paddingTop: 20,
      flex: 1,
      backgroundColor: "#f5f5f5",
      alignItems: "center",
      // justifyContent: "center",
      fontFamily: "Poppins_400Regular",
   },
   mediaContainer: {
      // display: "flex",
      // flexDirection: "row",
      // justifyContent: "center",
      gap: 10,
      marginTop: 0,
      marginBottom: 10,
   },
   profileImage: {
      width: 100,
      height: 100,
      borderRadius: 100,
      borderWidth: 4,
   },
});
