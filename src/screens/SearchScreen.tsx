import { StyleSheet, Text, View, ScrollView } from "react-native";
import React, { useEffect, useState } from "react";
import axios from "axios";
import PostComponent from "../components/MediaPosts/PostComponent";

const SearchScreen = ({ navigation }: any) => {
   const [posts, setPosts] = useState<PostComponentProps[]>([]);
   const [products, setProducts] = useState<Partial<Product>[]>([]);
   const [users, setUsers] = useState<Partial<User>[]>([]);
   const [loading, setLoading] = useState<boolean>(false);
   const [searchValue, setSearchValue] = useState<string>("");

   useEffect(() => {
      async function fetchData() {
         try {
            let { data, status } = await axios.get(
               `http://192.168.0.101:5000/api/search/${searchValue}`
            );
            if (status === 200) {
               setPosts(data.data.posts);
               setProducts(data.data.products);
               setUsers(data.data.users);
            } else {
            }
         } catch (err) {}
      }

      fetchData();
   }, []);

   return (
      <ScrollView>
         <ScrollView>
            {posts.length < 1 && (
               <View>
                  <Text>No Result Found For Posts</Text>
               </View>
            )}
            {posts.length >= 1 &&
               posts.map((post) => {
                  return (
                     <PostComponent
                        key={String(post.id)}
                        navigation={navigation}
                        {...post}
                     />
                  );
               })}
         </ScrollView>
         <ScrollView>
            <Text>Products</Text>
         </ScrollView>
         <ScrollView>
            <Text>Posts</Text>
         </ScrollView>
      </ScrollView>
   );
};

export default SearchScreen;

const styles = StyleSheet.create({});
