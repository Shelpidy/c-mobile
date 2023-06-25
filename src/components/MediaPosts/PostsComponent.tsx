import {
   StyleSheet,
   Text,
   View,
   Alert,
   FlatList,
   Platform,
} from "react-native";
import React, { useEffect, useState } from "react";
import PostComponent from "./PostComponent";
import axios from "axios";
import { posts as _fetchedPost } from "../../data";
import { useCurrentUser } from "../../utils/CustomHooks";
import SharedPostComponent from "./SharedPostComponent";
import { ActivityIndicator, Divider } from "react-native-paper";
import { LoadingPostComponent } from "./LoadingComponents";
import { useNavigation } from "@react-navigation/native";
import { ThemeConsumer } from "@rneui/themed";

type PostComponentProps = {
   post: Post;
   user: User;
   secondUser: User;
   commentsCount: number;
   likesCount: number;
   sharesCount: number;
   liked: boolean;
};

const PostsComponent = () => {
   const [posts, setPosts] = useState<PostComponentProps[]|null>(null);
   const [allPosts, setAllPosts] = useState<PostComponentProps[]|null>(null);
   const [page, setPage] = useState<number>(0);
   const [numberOfPostsPerPage, setNumberOfPostsPerPage] = useState<number>(5);
   const [loading, setLoading] = useState<boolean>(false);
   const [refreshing, setRefreshing] = useState<boolean>(false);
   const currentUser = useCurrentUser();
   const navigation = useNavigation();
   const [hasMore, setHasMore] = useState(true);

   let fetchData = async (pageNum:number) => {
      let pageNumber = pageNum
      if(!hasMore) return;
      try {
         if (currentUser) {
            setLoading(true)
            let activeUserId = currentUser?.id;
            let response = await fetch(
               `http://192.168.182.183:5000/api/media/posts/session/${activeUserId}/${pageNumber}/${numberOfPostsPerPage}`
            );
            let data = await response.json();
            if (data.status == "success") {
               console.log(data.data)
               // setPosts(data.data);
               let fetchedPost: PostComponentProps[] = data.data;
                
               setAllPosts((prev)=> prev ? [...prev,...fetchedPost]:fetchedPost);
               setPosts((prev)=> prev ? [...prev,...fetchedPost]:fetchedPost);
               setLoading(false)
               if(fetchedPost.length > 0) setPage(pageNumber + 1)
               if(data.length < numberOfPostsPerPage){
                  setHasMore(false)
               }
              
               // Alert.alert("Success",data.message)
            } else {
               Alert.alert("Failed", data.message);
               setLoading(false)
            }
         }

      } catch (err) {
         Alert.alert("Failed", String(err));
         setLoading(false);
      }
   };

   const handleLoadMore = () => {
      console.log("Reached end")
      if(loading) return;
      fetchData(page);
   };

   const renderFooter = () => {
      if(!loading) return null
      return (
         <View style={{ flexDirection:"row",padding: 10,justifyContent:"center",alignItems:"center",backgroundColor:"white"}}>
            <ActivityIndicator color="#cecece" size="small" />
            <Text style={{color:"#cecece",marginLeft:5}}>Loading more posts</Text>
         </View>
      );
   };

   useEffect(
      function () {
         fetchData(1);
      },
      [currentUser]
   );


   if (!posts) {
      return (
         <View style={{ padding: 2 }}>
            <LoadingPostComponent />
            <Divider />
            <LoadingPostComponent />
            <Divider />
            <LoadingPostComponent />
         </View>
      );
   }

   return (
      <FlatList
         keyExtractor={(item) => String(item.post.id)}
         data={posts}
         renderItem={({ item, index, separators }) => {
            if (item.post?.fromId) {
               return (
                  <SharedPostComponent key={String(item.post.id)} {...item} />
               );
            } else {
               return <PostComponent key={String(item.post.id)} {...item} />;
            }
         }}
         onEndReached={handleLoadMore}
         onEndReachedThreshold={0.2}
         ListFooterComponent={renderFooter}
      />
   );
};

export default PostsComponent;

const styles = StyleSheet.create({});
