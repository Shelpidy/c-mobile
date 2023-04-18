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
   TextInput
} from "react-native";
import { ActivityIndicator, Button,useTheme } from "react-native-paper";
import PostComponent from "../components/MediaPosts/PostComponent";
import ProfileNavComponent from "../components/ProfileNavComponent";
import { EvilIcons, MaterialCommunityIcons } from "@expo/vector-icons";
import SearchForm from "../components/SearchForm";



const { width, height } = Dimensions.get("window");

const ProfileScreen = ({ navigation,route }:any) => {
   const theme = useTheme();
   const [posts, setPosts] = useState<PostComponentProps[] | null>(null);
   const [allPosts, setAllPosts] = useState<PostComponentProps[]>([]);
   const [user,setUser] = useState<any>(null)
   const [pageNumber, setPageNumber] = useState<number>(1);
   const [numberOfPostsPerPage, setNumberOfPostsPerPage] = useState<number>(20);
   const [numberOfPageLinks, setNumberOfPageLinks] = useState<number>(0);
   const [loading, setLoading] = useState<boolean>(false);

   const searchPosts = (_token:string)=>{
      console.log("From profile",_token)
      let token = _token.toLowerCase()
      let newPosts = allPosts?.filter(post => post?.text?.toLowerCase().includes(token) || post?.title?.toLowerCase().includes(token))
      setPosts(newPosts)
   }

   useEffect(function () {
      console.log("Fetching user");
      setLoading(true);
      let fetchData = async () => {
         // console.log("Fetching user")
         //  let activeUserId = 1
         try {
            let response = await fetch(
               `http://192.168.0.106:5000/api/auth/users/${route.params.userId}`,
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
      setLoading(true);
      let fetchData = async () => {
         let userId = route.params.userId;
         try {
            let response = await fetch(
               `http://192.168.0.106:5000/api/media/posts/user/${userId}`
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
   }, []);

   useEffect(() => {
      const currentIndex = numberOfPostsPerPage * (pageNumber - 1);
      const lastIndex = currentIndex + numberOfPostsPerPage;
      setPosts(allPosts?.slice(currentIndex, lastIndex));
   }, [pageNumber]);

   return (
      <ScrollView style={{ flex: 1, backgroundColor: "#f9f9f9" }}>
         {!user && <View>
               <ActivityIndicator/>
            </View>}
         {user && <>
          <View style={{ justifyContent: "center", alignItems: "center" }}>
            <Image
               source={{
                  uri: user?.personal?.profileImage,
               }}
               style={[
                  styles.profileImage,
                  { borderColor: theme.colors.primary},
               ]}></Image>
            <Text
               style={{
                  textAlign: "center",
                  marginVertical: 10,
                  fontFamily: "Poppins_600SemiBold",
               }}>
               {user?.personal?.fullName}
            </Text>
         </View>
         <ScrollView horizontal style={styles.mediaContainer}>
            <View style={{ alignItems: "center",margin:4}}>
               <Text
                  style={{
                     textAlign: "center",
                     fontFamily: "Poppins_500Medium",
                  }}>
                  {user?.followers?.count}
               </Text>
               <Button onPress={()=> navigation.navigate("FollowersScreen",{user:user?.personal})} mode="contained-tonal">
                  <Text
                     style={{
                        fontWeight: "bold",
                        textAlign: "center",
                        fontFamily: "Poppins_500Medium",
                     }}>
                     Followers
                  </Text>
               </Button>
            </View>

            <View style={{ alignItems: "center",margin:4}}>
               <Text
                  style={{
                     textAlign: "center",
                     fontFamily: "Poppins_500Medium",
                  }}>
                  {user?.followings?.count}
               </Text>
               <Button onPress={()=> navigation.navigate("FollowingsScreen",{user:user?.personal})} mode="contained-tonal">
                  <Text
                     style={{
                        fontWeight: "bold",
                        textAlign: "center",
                        fontFamily: "Poppins_300Light",
                     }}>
                     Following
                  </Text>
               </Button>
            </View>
            {/* <View style={{ alignItems: "center",margin:4}}>
               <Text
                  style={{
                     textAlign: "center",
                     fontFamily: "Poppins_500Medium",
                  }}>
                  200
               </Text>
               <Button mode="contained-tonal">
                  <Text
                     style={{
                        fontWeight: "bold",
                        textAlign: "center",
                        fontFamily: "Poppins_300Light",
                     }}>
                     Posts
                  </Text>
               </Button>
               
            </View> */}
             <View style={{ alignItems: "center",margin:4}}>
               <Text
                  style={{
                     textAlign: "center",
                     fontFamily: "Poppins_500Medium",
                  }}>
                  {user?.sales?.count}
               </Text>
               <Button mode="contained-tonal">
                  <Text
                     style={{
                        fontWeight: "bold",
                        textAlign: "center",
                        fontFamily: "Poppins_300Light",
                     }}>
                     Sales
                  </Text>
               </Button>
               
            </View>
             <View style={{ alignItems: "center",margin:4}}>
               <Text
                  style={{
                     textAlign: "center",
                     fontFamily: "Poppins_500Medium",
                  }}>
                 {user?.affiliates?.count}
               </Text>
               <Button mode="contained-tonal">
                  <Text
                     style={{
                        fontWeight: "bold",
                        textAlign: "center",
                        fontFamily: "Poppins_300Light",
                     }}>
                     Affiliate Product
                  </Text>
               </Button>
            </View>
         </ScrollView>

         </> }
        
         <View style={{ alignItems: "center", marginBottom: 5 }}>
            <ProfileNavComponent navigation={navigation} user={user?.personal} />
         </View>
         <SearchForm setSearchValue={(v)=>searchPosts(v)}/>
         {!posts && <View>
                <ActivityIndicator/>
            </View>}
         {posts && posts.map((post) => {
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
      backgroundColor: "#F9F9F9",
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
