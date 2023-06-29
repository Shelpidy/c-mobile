import {
   StyleSheet,
   Text,
   View,
   Alert,
   ScrollView,
   FlatList,
} from "react-native";
import React, { useEffect, useState, useRef } from "react";
import ProductComponent from "../components/Marketing/ProductComponent";
import SearchForm from "../components/SearchForm";
import PostProductFormNav from "../components/PostProductFormNav";
import { useCurrentUser } from "../utils/CustomHooks";
import { ActivityIndicator } from "react-native-paper";
import {
   LoadingPostComponent,
   LoadingProductComponent,
} from "../components/MediaPosts/LoadingComponents";
import { Skeleton } from "@rneui/themed";

// import { Products as _fetchedPost } from "../../data";

type ProductsComponentProps = {
   navigation?: any;
};

type FetchedProduct = {
   product: Product;
   likesCount: number;
   liked: boolean;
   previewed: boolean;
   previewsCount: number;
   isNew:boolean;
   user: User;
   affiliateId:number|string|null
};

const MarketingScreen = ({ navigation }: ProductsComponentProps) => {
   const [products, setProducts] = useState<FetchedProduct[] | null>(null);
   const [allProducts, setAllProducts] = useState<FetchedProduct[]>([]);
   const page = React.useRef<number>(1);
   const [numberOfPostsPerPage, setNumberOfPostsPerPage] = useState<number>(5);
   const [loading, setLoading] = useState<boolean>(false);
   const [hasMore, setHasMore] = useState(true);
   const currentUser = useCurrentUser();

   let fetchProducts = async (pageNum?: number) => {
      let pageNumber = pageNum ?? page.current;
      console.log("Fetching products");

      if (!hasMore) return;
      if (!currentUser) return;
      try {
         console.log("UserId", currentUser?.id);
         setLoading(true);
         let response = await fetch(
            `http://192.168.148.183:5000/api/marketing/products/${currentUser?.id}/${pageNumber}/${numberOfPostsPerPage}`
         );

         if (response.status === 200) {
            let { data } = await response.json();

            setAllProducts((prev) => (prev ? [...prev, ...data] : data));
            setProducts((prev) => (prev ? [...prev, ...data] : data));
            if (data.length > 0) page.current++;
            if (data.length < numberOfPostsPerPage) {
               setHasMore(false);
            }
         } else {
            let { data } = await response.json();
            Alert.alert("Failed", data.message);
         }
         setLoading(false);
      } catch (err) {
         console.log(err);
         Alert.alert("Failed", String(err));
         setLoading(false);
      }
   };

   useEffect(
      function () {
         fetchProducts(1);
      },
      [currentUser]
   );

   const handleLoadMore = () => {
      console.log("Products Reached end");
      if (loading) return;
      fetchProducts();
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

   const searchProducts = (_token: string) => {
      console.log("From product", _token);
      let token = _token.toLowerCase();
      let newProducts = allProducts?.filter(
         (Product) =>
            Product.product?.description.toLowerCase().includes(token) ||
            Product.product?.productName?.toLowerCase().includes(token) ||
            Product.product?.price?.toLowerCase().includes(token)
      );
      setProducts(newProducts);
   };

   if (!products)
      return (
         <ScrollView>
            <PostProductFormNav page="product" navigation={navigation} />
            <View style={{ justifyContent: "center", alignItems: "center" }}>
               <Skeleton
                  width={345}
                  height={50}
                  style={{ borderRadius: 25, margin: 1 }}
               />
            </View>
            <FlatList
               data={["1", "2", "3", "4"]}
               keyExtractor={(item) => item}
               indicatorStyle="white"
               renderItem={({ item, index, separators }) => (
                  <LoadingProductComponent key={item} />
               )}
            />
         </ScrollView>
      );

   return (
      <ScrollView style={{ backgroundColor: "#f6f6f6" }}>
         <PostProductFormNav page="product" navigation={navigation} />
         <SearchForm setSearchValue={searchProducts} />
         <FlatList
            data={products}
            keyExtractor={(item) => String(item.product.id)}
            indicatorStyle="white"
            renderItem={({ item, index, separators }) => (
               <ProductComponent key={String(item.product.id)} {...item} />
            )}
            onEndReached={handleLoadMore}
            onEndReachedThreshold={0.3}
            ListFooterComponent={renderFooter}
         />
      </ScrollView>
   );
};

export default MarketingScreen;

const styles = StyleSheet.create({});
