import { StyleSheet, Text, View, Alert, ScrollView } from "react-native";
import React, { useEffect, useState } from "react";
import axios from "axios";
import ProductComponent from "../components/Marketing/ProductComponent";
import SearchForm from "../components/SearchForm";
import PostProductFormNav from "../components/PostProductFormNav";
import { useCurrentUser } from "../utils/CustomHooks";

const UserProductScreen = ({ navigation, route }: any) => {
   const [products, setProducts] = useState<ProductComponentProps[]>([]);
   const [allProducts, setAllProducts] = useState<ProductComponentProps[]>([]);
   const [pageNumber, setPageNumber] = useState<number>(1);
   const [numberOfProductsPerPage, setNumberOfProductsPerPage] =
      useState<number>(20);
   const [numberOfPageLinks, setNumberOfPageLinks] = useState<number>(0);
   const [loading, setLoading] = useState<boolean>(false);
   const [owner, setOwner] = useState<User>();
   const currentUser = useCurrentUser();

   useEffect(
      function () {
         setLoading(true);
         let fetchData = async () => {
            let activeUserId = currentUser?.id;
            setOwner(route.params.user);
            console.log("Product userId", route.params.user.id);
            try {
               let response = await fetch(
                  `http://192.168.136.183:5000/api/marketing/products/user/${route.params.user.id}`
               );
               let data = await response.json();
               if (data.status == "success") {
                  console.log(data.data);
                  console.log("Products", data.data);
                  let fetchedPost: ProductComponentProps[] = data.data;
                  let numOfPageLinks = Math.ceil(
                     fetchedPost.length / numberOfProductsPerPage
                  );
                  // console.log(fetchedPost);
                  setAllProducts(fetchedPost);
                  setNumberOfPageLinks(numOfPageLinks);
                  const currentIndex =
                     numberOfProductsPerPage * (pageNumber - 1);
                  const lastIndex = currentIndex + numberOfProductsPerPage;
                  setProducts(data.data.slice(currentIndex, lastIndex));
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
      [currentUser]
   );

   useEffect(() => {
      const currentIndex = numberOfProductsPerPage * (pageNumber - 1);
      const lastIndex = currentIndex + numberOfProductsPerPage;
      setProducts(products.slice(currentIndex, lastIndex));
   }, [pageNumber]);

   if (products.length === 0 || loading) {
      return (
         <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
            <Text>Loading Products...</Text>
         </View>
      );
   }

   const searchProducts = (_token: string) => {
      console.log("From product", _token);
      let token = _token.toLowerCase();
      let newProducts = allProducts?.filter(
         (Product) =>
            Product?.description.toLowerCase().includes(token) ||
            Product?.productName?.toLowerCase().includes(token) ||
            Product?.price?.toLowerCase().includes(token)
      );
      setProducts(newProducts);
   };

   return (
      <ScrollView style={{ backgroundColor: "#f5f5f5", paddingTop: 5 }}>
         <SearchForm setSearchValue={searchProducts} />
         <PostProductFormNav navigation={navigation} page="product" />
         {/* <Text>ProductsComponent {Products.length}</Text> */}
         {products.map((product) => {
            return (
               <ProductComponent
                  key={String(product.id)}
                  {...product}
                  navigation={navigation}
               />
            );
         })}
      </ScrollView>
   );
};

export default UserProductScreen;

const styles = StyleSheet.create({});