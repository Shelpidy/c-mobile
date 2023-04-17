import { StyleSheet, Text, View, Alert } from "react-native";
import React, { useEffect, useState } from "react";
import PostComponent from "./PostComponent";
import axios from "axios";
import { posts as _fetchedPost } from "../../data";

type PostsComponentProps = {
   navigation?: any;
};

const PostsComponent = ({ navigation }: PostsComponentProps) => {
   const [posts, setPosts] = useState<PostComponentProps[]>([]);
   const [allPosts, setAllPosts] = useState<PostComponentProps[]>([]);
   const [pageNumber, setPageNumber] = useState<number>(1);
   const [numberOfPostsPerPage, setNumberOfPostsPerPage] = useState<number>(20);
   const [numberOfPageLinks, setNumberOfPageLinks] = useState<number>(0);
   const [loading, setLoading] = useState<boolean>(false);

   useEffect(function () {
      setLoading(true);
      let fetchData = async () => {
         let activeUserId = 1;
         try {
            let response = await fetch(
               `http://192.168.0.104:5000/api/media/posts/${activeUserId}`
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
      setPosts(posts.slice(currentIndex, lastIndex));
   }, [pageNumber]);

   if (posts.length === 0 || loading) {
      return (
         <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
            <Text>Loading Posts...</Text>
         </View>
      );
   }

   return (
      <View>
         {/* <Text>PostsComponent {posts.length}</Text> */}
         {posts.map((post) => {
            return (
               <PostComponent
                  key={String(post.id)}
                  {...post}
                  navigation={navigation}
               />
            );
         })}
      </View>
   );
};

export default PostsComponent;

const styles = StyleSheet.create({});
