import { StyleSheet, Text, View, ScrollView } from "react-native";
import React, { useEffect, useState } from "react";
import axios from "axios";
import PostComponent from "../components/MediaPosts/PostComponent";
import ProductComponent from "../components/Marketing/ProductComponent";
import FindFriendComponent from "../components/FindFriendComponent";
import SearchForm from "../components/SearchForm";

const SearchScreen = ({ navigation }: any) => {
   const [posts, setPosts] = useState<PostComponentProps[]>([]);
   const [products, setProducts] = useState<ProductComponentProps[]>([]);
   const [users, setUsers] = useState<User[]>([]);
   const [loading, setLoading] = useState<boolean>(false);
   const [searchValue, setSearchValue] = useState<string>("");

   async function handleSearch(searchData: any) {
      setLoading(true);
      try {
         let { data, status } = await axios.get(
            `http://192.168.144.183:5000/api/search/?searchValue=${searchData}`
         );
         if (status === 200) {
            setPosts(data.data.posts);
            setProducts(data.data.products);
            setUsers(data.data.users);
         } else {
            console.log(data.data);
         }
         setLoading(false);
      } catch (err) {
         console.log(err);
      }
   }
   if (loading) {
      return (
         <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
            <Text>Searching.....</Text>
         </View>
      );
   }

   return (
      <ScrollView style={{ backgroundColor: "#f6f6f6", paddingTop: 5 }}>
         <SearchForm setSearchValue={handleSearch} />
         <ScrollView horizontal>
            {users?.map((user) => {
               return (
                  <FindFriendComponent
                     key={String(user.id)}
                     user={user}
                     navigation={navigation}
                  />
               );
            })}
         </ScrollView>
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
            {products.length < 1 && (
               <View>
                  <Text>No Result Found For products</Text>
               </View>
            )}
            {products.length >= 1 &&
               products.map((product) => {
                  return (
                     <ProductComponent
                        key={String(product.id)}
                        {...product}
                        navigation={navigation}
                     />
                  );
               })}
         </ScrollView>
      </ScrollView>
   );
};

export default SearchScreen;

const styles = StyleSheet.create({});
