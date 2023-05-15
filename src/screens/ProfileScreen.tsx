import React, { useEffect, useState } from "react";
import {
   Alert,
   Dimensions,
   Image,
   Pressable,
   ScrollView,
   StyleSheet,
   Text,
   View,
   TextInput,
} from "react-native";
import { ActivityIndicator, Button, useTheme } from "react-native-paper";
import PostComponent from "../components/MediaPosts/PostComponent";
import ProfileNavComponent from "../components/ProfileNavComponent";
import { EvilIcons, MaterialCommunityIcons } from "@expo/vector-icons";
import SearchForm from "../components/SearchForm";

const { width, height } = Dimensions.get("window");

const ProfileScreen = ({ navigation, route }: any) => {
   const theme = useTheme();
   const [posts, setPosts] = useState<PostComponentProps[] | null>(null);
   const [allPosts, setAllPosts] = useState<PostComponentProps[]>([]);
   const [user, setUser] = useState<any>(null);
   const [pageNumber, setPageNumber] = useState<number>(1);
   const [numberOfPostsPerPage, setNumberOfPostsPerPage] = useState<number>(20);
   const [numberOfPageLinks, setNumberOfPageLinks] = useState<number>(0);
   const [loading, setLoading] = useState<boolean>(false);

   const searchPosts = (_token: string) => {
      console.log("From profile", _token);
      let token = _token.toLowerCase();
      let newPosts = allPosts?.filter(
         (post) =>
            post?.text?.toLowerCase().includes(token) ||
            post?.title?.toLowerCase().includes(token)
      );
      setPosts(newPosts);
   };

   useEffect(function () {
      console.log("Fetching user");
      setLoading(true);
      let fetchData = async () => {
         // console.log("Fetching user")
         //  let activeUserId = 1
         try {
            let response = await fetch(
               `http://192.168.99.44:5000/api/auth/users/${route.params.userId}`,
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

   useEffect(
      function () {
         setLoading(true);
         let fetchData = async () => {
            let userId = route.params.userId;
            try {
               let response = await fetch(
                  `http://192.168.99.44:5000/api/media/posts/user/${userId}`
               );
               let data = await response.json();
               if (data.status == "success") {
                  // console.log(data.data)
                  // setPosts(data.data);
                  let fetchedPost: PostComponentProps[] = data.data;
                  let numOfPageLinks = Math.ceil(
                     fetchedPost.length / numberOfPostsPerPage
                  );
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

   return (
      <ScrollView
         style={{ flex: 1, backgroundColor: "#ffffff", paddingTop: 10 }}>
         {!user && (
            <View>
               <ActivityIndicator />
            </View>
         )}
         {user && (
            <>
               <View style={{ justifyContent: "center", alignItems: "center" }}>
                  <Image
                     source={{
                        uri: user?.personal?.profileImage,
                     }}
                     style={[
                        styles.profileImage,
                        { borderColor: theme.colors.primary },
                     ]}></Image>
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
                  {/* <View style={{ alignItems: "center",margin:4}}>
               <Text
                  style={{
                     textAlign: "center",
                     fontFamily: "Poppins_400Regular",
                  }}>
                  200
               </Text>
               <Button>
                  <Text
                     style={{
                        fontWeight: "bold",
                        textAlign: "center",
                        fontFamily: "Poppins_400Regular",
                     }}>
                     Posts
                  </Text>
               </Button>
               
            </View> */}
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
            </>
         )}

         <View style={{ alignItems: "center", marginBottom: 5 }}>
            <ProfileNavComponent
               navigation={navigation}
               user={user?.personal}
            />
         </View>

         {!posts && (
            <View>
               <ActivityIndicator />
            </View>
         )}
         {posts && posts.length > 1 && (
            <SearchForm setSearchValue={(v) => searchPosts(v)} />
         )}
         {posts &&
            posts.map((post) => {
               return (
                  <PostComponent
                     key={String(post.id)}
                     {...post}
                     navigation={navigation}
                  />
               );
            })}
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
