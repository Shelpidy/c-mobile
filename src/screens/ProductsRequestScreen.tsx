import { StyleSheet, Text, View, Alert, ScrollView } from "react-native";
import React, { useEffect, useState } from "react";
import SearchForm from "../components/SearchForm";
import PostProductFormNav from "../components/PostProductFormNav";
import ProductRequestComponent from "../components/Marketing/ProductRequestComponent";
import { ActivityIndicator } from "react-native-paper";
import { useCurrentUser } from "../utils/CustomHooks";

// import { Products as _fetchedPost } from "../../data";

type ProductsComponentProps = {
   navigation?: any;
};

const ProductsRequestScreen = ({ navigation }: ProductsComponentProps) => {
   const [products, setProducts] = useState<ProductComponentProps[]>([]);
   const [allProducts, setAllProducts] = useState<ProductComponentProps[]>([]);
   const [pageNumber, setPageNumber] = useState<number>(1);
   const [numberOfProductsPerPage, setNumberOfProductsPerPage] =
      useState<number>(20);
   const [numberOfPageLinks, setNumberOfPageLinks] = useState<number>(0);
   const [loading, setLoading] = useState<boolean>(false);
   const currentUser = useCurrentUser();
   const [refresh, setRefresh] = useState<number>(0);

   useEffect(
      function () {
         setLoading(true);
         let fetchData = async () => {
            let activeUserId = currentUser?.id;
            try {
               let response = await fetch(
                  `http://192.168.148.183:5000/api/marketing/products/request/${activeUserId}`
               );
               let data = await response.json();
               if (data.status == "success") {
                  console.log("REQUEST PRODUCTS", data.data);
                  // setProducts(data.data);
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
      [refresh, currentUser]
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
            <ActivityIndicator size={35} />
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
         {products.map((product) => {
            return (
               <ProductRequestComponent
                  key={String(product.id)}
                  props={product}
                  refreshRequest={() => setRefresh(refresh + 1)}
                  navigation={navigation}
               />
            );
         })}
      </ScrollView>
   );
};

export default ProductsRequestScreen;

const styles = StyleSheet.create({});
