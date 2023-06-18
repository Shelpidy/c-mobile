import {
   StyleSheet,
   Text,
   View,
   Alert,
   ScrollView,
   FlatList,
} from "react-native";
import React, { useEffect, useState } from "react";
import ProductComponent from "../components/Marketing/ProductComponent";
import SearchForm from "../components/SearchForm";
import PostProductFormNav from "../components/PostProductFormNav";
import { useCurrentUser } from "../utils/CustomHooks";
import { ActivityIndicator } from "react-native-paper";
import { LoadingPostComponent, LoadingProductComponent } from "../components/MediaPosts/LoadingComponents";
import { Skeleton } from "@rneui/themed";

// import { Products as _fetchedPost } from "../../data";

type ProductsComponentProps = {
   navigation?: any;
};

const MarketingScreen = ({ navigation }: ProductsComponentProps) => {
   const [products, setProducts] = useState<ProductComponentProps[]|null|[]>(null);
   const [allProducts, setAllProducts] = useState<ProductComponentProps[]>([]);
   const [pageNumber, setPageNumber] = useState<number>(1);
   const [numberOfProductsPerPage, setNumberOfProductsPerPage] =
      useState<number>(20);
   const [numberOfPageLinks, setNumberOfPageLinks] = useState<number>(0);
   const [loading, setLoading] = useState<boolean>(false);

   useEffect(function () {
      setLoading(true);
      let fetchData = async () => {
         try {
            let response = await fetch(
               "http://192.168.144.183:5000/api/marketing/products"
            );
            let data = await response.json();
            if (data.status == "success") {
               // console.log('Products',data.data);
               // setProducts(data.data);
               let fetchedPost: ProductComponentProps[] = data.data;
               let numOfPageLinks = Math.ceil(
                  fetchedPost.length / numberOfProductsPerPage
               );
               // console.log(fetchedPost);
               setAllProducts(fetchedPost);
               setNumberOfPageLinks(numOfPageLinks);
               const currentIndex = numberOfProductsPerPage * (pageNumber - 1);
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
   }, []);

   useEffect(() => {
      const currentIndex = numberOfProductsPerPage * (pageNumber - 1);
      const lastIndex = currentIndex + numberOfProductsPerPage;
      setProducts(products?.slice(currentIndex, lastIndex)??[]);
   }, [pageNumber]);

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

    if(!products)
      return (
         <ScrollView>
            <PostProductFormNav page="product" navigation={navigation} />
            <View style={{justifyContent:"center",alignItems:"center"}}><Skeleton width={345} height={50} style={{borderRadius:25,margin:1}} /></View>
            <FlatList
            data={["1","2","3","4"]}
            keyExtractor={(item) => item}
            indicatorStyle="white"
            renderItem={({ item, index, separators }) => (
               <LoadingProductComponent key={item} />
            )}
         />
         </ScrollView>
      )
   
   return (
      <ScrollView style={{ backgroundColor: "#f6f6f6" }}>
         <PostProductFormNav page="product" navigation={navigation} />
         <SearchForm setSearchValue={searchProducts}/>
          <FlatList
            data={products}
            keyExtractor={(item) => String(item.id)}
            indicatorStyle="white"
            renderItem={({ item, index, separators }) => (
               <ProductComponent
                  key={String(item.id)}
                  {...item}
                  navigation={navigation}
               />)}/>
         
      </ScrollView>
   );
};

export default MarketingScreen;

const styles = StyleSheet.create({});
