import {
   StyleSheet,
   Text,
   View,
   Modal,
   Dimensions,
   Image,
   Alert,
   ScrollView,
   Pressable,
   TextInput,
} from "react-native";
import React, { useState, useEffect, useReducer } from "react";
import ImagesViewer from "../components/ImagesViewer";
import VideoPlayer from "../components/VideoPlayer";
import TextViewer from "../components/TextViewer";
// import Comments from "../components/marketingproducts/Comments";
// import { productComments, productLikes, users } from "../data";
import {
   useTheme,
   Button,
   IconButton,
   Divider,
   Avatar,
} from "react-native-paper";
import {
   AntDesign,
   Entypo,
   SimpleLineIcons,
   Ionicons,
   MaterialIcons,
   FontAwesome,
   Feather,
} from "@expo/vector-icons";
import axios from "axios";
import ProductComments from "../components/Marketing/ProductComments";
import { useCurrentUser } from "../utils/CustomHooks";
import UpdateProductForm from "../components/Marketing/UpdateProduct";
import { LoadingPostComponent, LoadingProductComponent } from "../components/MediaPosts/LoadingComponents";

const { width } = Dimensions.get("window");


type FetchedProductProps = {
   product: Product;
   likesCount: number;
   liked: boolean;
   previewed: boolean;
   previewsCount: number;
   user: User;
   isNew:boolean;
   affiliated:boolean}


const ProductScreen = ({ navigation, route }: any) => {

   const currentUser = useCurrentUser();
   const [product, setproduct] = useState<Product | null>(null);
   const [openModal, setOpenModal] = useState<boolean>(false);
   const [comments, setComments] = useState<ProductComment[]>([]);
   const [previewsCount, setPreviewsCount] = useState<number>(0);
   const [likesCount, setLikesCount] = useState<number>(0);
   const [user, setUser] = useState<User|null>(null);
   const [liked, setLiked] = useState<boolean>(false);
   const [isNew, setIsNew] = useState<boolean>(false);
   const [previewed, setPreviewed] = useState<boolean>(false);
   const [loading, setLoading] = useState<boolean>(false);
   const [loading1, setLoading1] = useState<boolean>(false);
   const [loading2, setLoading2] = useState<boolean>(false);
   const [affiliateId, setAffiliateId] = useState<number | string |null>(null);
   const [affiliated, setAffiliated] = useState<boolean>(false);
   const theme = useTheme();

   useEffect(() => {
      setAffiliateId(route.params.affiliateId);
      console.log("AffiliateId", route.params.affiliateId);
   }, []);

   useEffect(
      function () {
         let fetchData = async () => {
            let productId = route.params.productId;
            let userId = currentUser?.id;
            try {
               let { data,status } = await axios.get(
                  `http://192.168.148.183:5000/api/marketing/products/product/${productId}/${userId}`
               );
               if (status === 200) {
                  // console.log("Product", data.data);
                  let{product,isNew,likesCount,previewsCount,user,liked,previewed,affiliated}:FetchedProductProps = data
                  setproduct(product);
                  setLikesCount(likesCount);
                  setLiked(liked);
                  setUser(user);
                  setPreviewed(previewed);
                  setPreviewsCount(previewsCount);
                  setAffiliated(affiliated);
                  setIsNew(isNew);
               } else {
                  Alert.alert("Failed", data.message);
               }
               setLoading(false);
            } catch (err) {
               Alert.alert("Failed", String(err));
               setLoading(false);
            }
         };
         if(currentUser){
            fetchData();
         }
      },
      [currentUser]
   );

 
   const handleProductRequest = async () => {
      if (affiliateId) {
         Alert.alert(
            "",
            "Affiliated product cannot be added to shopping cart."
         );
         return;
      }
      setLoading(true);
      let requestObj = {
         userId: route.params.userId,
         productId: route.params.productId,
      };
      try {
         let { data } = await axios.post(
            `http://192.168.148.183:5000/api/marketing/products/request/`,
            requestObj
         );
         if (data.status == "success") {
            Alert.alert(
               "Success",
               "You have successfully added a product to Shopping-Cart"
            );
            setLoading(false);
         } else {
            Alert.alert("Failed", data.message);
            setLoading(false);
         }
      } catch (err) {
         Alert.alert("Failed", String(err));
         setLoading(false);
      }
   };

   const handleProductAffiliate = async () => {
      setLoading1(true);
      let requestObj = {
         userId: route.params.userId,
         productId: route.params.productId,
         affiliateId: currentUser?.id,
      };
      console.log(requestObj);
      try {
         let { data } = await axios.post(
            `http://192.168.148.183:5000/api/marketing/affiliates/`,
            requestObj
         );
         if (data.status == "success") {
            setAffiliated(true)
            // if (currentUser) {
            //    product?.affiliateId?.push(currentUser.id);

               Alert.alert("Success", data.message);
            // }

            setLoading1(false);
         } else {
            Alert.alert("Failed", data.message);
            setLoading1(false);
         }
      } catch (err) {
         Alert.alert("Failed", String(err));
         setLoading1(false);
      }
   };

   // const handleComment = async () => {
   //    setLoading(true);
   //    let activeUserId = currentUser?.id;
   //    let commentObj = {
   //       ...productCommentState,
   //       productId: product?.id,
   //       userId: activeUserId,
   //    };
   //    console.log(commentObj);
   //    try {
   //       let { data } = await axios.post(
   //          `http://192.168.148.183:5000/api/marketing/products/comments/`,
   //          commentObj
   //       );
   //       if (data.status == "success") {
   //          console.log(data.data);
   //          setComments([...comments, data.data]);
   //          // dispatchproductComment({ type: "TEXT", payload: "" });
   //          // Alert.alert("Success",data.message)
   //       } else {
   //          Alert.alert("Failed", data.message);
   //       }
   //       setLoading(false);
   //    } catch (err) {
   //       Alert.alert("Failed", String(err));
   //       setLoading(false);
   //    }
   // };

   const handleBuy = async () => {
      try {
         setLoading2(true);

         let buyObj: MakePurchaseParams = {
            affiliateId,
            productId: product?.id,
            userId: product?.userId,
            buyerId: currentUser?.id,
         };
         console.log(buyObj);
         let { data } = await axios.post(
            `http://192.168.148.183:5000/api/marketing/buy`,
            buyObj
         );
         if (data.status == "success") {
            console.log(data.data);
            // setComments([...comments, data.data]);
            // dispatchproductComment({ type: "TEXT", payload: "" });
            Alert.alert("Success", data.message);
         } else {
            Alert.alert("Failed", data.message);
         }
         setLoading2(false);
      } catch (err) {
         Alert.alert("Failed", String(err));
         setLoading2(false);
      }
   };

   const handleLike = async (productId: number) => {
      console.log(productId);
      try {
         let activeUserId = currentUser?.id;
         let { data, status } = await axios.put(
            `http://192.168.148.183:5000/api/marketing/products/likes/`,
            { userId: activeUserId, productId: productId }
         );
         if (data.status == "success") {
            // console.log(data.data);

            Alert.alert("Success", data.message);
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

   if (!product) {
      return (
         <ScrollView>
             <LoadingProductComponent/>
         </ScrollView>
  
      );
   }

   return (
      <ScrollView style={styles.productContainer}>
         <Modal visible={openModal}>
            <View
               style={{
                  flex: 1,
                  backgroundColor: "#00000068",
                  justifyContent: "center",
                  alignItems: "center",
                  paddingVertical: 4,
               }}>
               <View style={{ backgroundColor: "#ffffff", paddingTop: 10 }}>
                  {/* <IconButton name='plus'/> */}
                  <Button mode="text" onPress={() => setOpenModal(false)}>
                     <Feather size={26} name="x" />
                  </Button>
                  <UpdateProductForm {...product} />
               </View>
            </View>
         </Modal>
         {user && (
            <View
               style={{
                  flexDirection: "row",
                  alignItems: "center",
                  padding: 8,
               }}>
               <Avatar.Image
                  size={30}
                  source={{ uri: user.profileImage }}
               />
               {/* <Image
                  style={styles.profileImage}
                  source={{ uri: user.profileImage }}
               /> */}
               <Text style={{ fontFamily: "Poppins_600SemiBold", margin: 5 }}>
                  {user.firstName} {user.middleName}{" "}
                  {user.lastName}
               </Text>
               <View
                  style={{
                     flex: 1,
                     justifyContent: "flex-end",
                     alignItems: "flex-end",
                     marginBottom: 2,
                     paddingHorizontal: 1,
                     borderRadius: 3,
                  }}>
                  {currentUser?.id == product?.userId && (
                     <View>
                        <Button
                           style={{ backgroundColor: "#f9f9f9" }}
                           onPress={() => setOpenModal(true)}>
                           <SimpleLineIcons name="options-vertical" />
                        </Button>
                     </View>
                  )}
               </View>
            </View>
         )}
         {product.images && (
            <View>
               <ImagesViewer images={product?.images} />
               {/* {product?.video && <VideoPlayer video={product?.video}/>} */}
            </View>
         )}
         <View
            style={{
               flexDirection: "column",
               marginVertical: 0,
               justifyContent: "space-evenly",
               //    alignItems: "center",
            }}>
            <Text style={styles.productName}>{product?.productName}</Text>
            <View style={{ flexDirection: "row" }}>
               {product.initialPrice && (
                  <Text
                     style={[
                        styles.productInitialPrice,
                        {
                           color: theme.colors.secondary,
                           textDecorationLine: "line-through",
                        },
                     ]}>
                     C{product?.initialPrice}
                  </Text>
               )}

               <Text
                  style={[
                     styles.productPrice,
                     { color: theme.colors.primary, fontSize: 20 },
                  ]}>
                  C{product?.price}
               </Text>
            </View>
         </View>
         {product?.description && <TextViewer text={product.description} />}
         <View>
            <View>
               <View
                  style={[
                     styles.likeCommentAmountCon,
                     { borderColor: theme.colors.secondary },
                  ]}>
                  <View
                     style={{
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "flex-start",
                     }}>
                     <Pressable
                        disabled={loading}
                        onPress={() => handleLike(product.id)}>
                        <Ionicons
                           size={30}
                           color={theme.colors.secondary}
                           name={liked ? "heart-sharp" : "heart-outline"}
                        />
                     </Pressable>
                     {/* <IconButton
                     disabled={loading}
                     onPress={() => handleLike(post.id)}
                     mode="outlined"
                     size={20}
                     icon={liked ? "heart" : "heart-outline"}
                  /> */}
                     <Text style={styles.commentAmountText}>
                        {likesCount}
                     </Text>
                  </View>
                  <View
                     style={{
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "flex-start",
                     }}>
                     <Pressable>
                        <Ionicons
                           size={30}
                           color={theme.colors.secondary}
                           name="chatbox-outline"
                        />
                     </Pressable>

                     <Text style={styles.commentAmountText}>
                        {comments.length}
                     </Text>
                  </View>
               </View>
               <View
                  style={{
                     flexDirection: "row",
                     gap: 8,
                     paddingHorizontal: 10,
                  }}>
                  <Button
                     style={{ flex: 1 }}
                     loading={loading}
                     disabled={loading}
                     onPress={handleProductRequest}
                     mode="contained">
                     <MaterialIcons size={23} name="add-shopping-cart" />
                  </Button>
                  <Button
                     style={{ flex: 1 }}
                     loading={loading2}
                     disabled={loading2}
                     onPress={handleBuy}
                     mode="contained">
                     Buy
                  </Button>

                  {currentUser &&
                     product.userId !== currentUser.id &&
                     !affiliateId && (
                        <Button
                           loading={loading1}
                           disabled={loading1}
                           onPress={handleProductAffiliate}
                           textColor={theme.colors.primary}
                           style={{ marginHorizontal: 3, flex: 1 }}
                           mode="contained-tonal">
                           Affiliate
                        </Button>
                     )}
               </View>

               {/* <View style={{ padding: 5 }}>
                  <ProductComments
                     posterId={product.userId}
                     navigation={navigation}
                     productComments={comments}
                  />
               </View> */}

               {/* <Text style={styles.commentAmountText}><FontAwesome size={28} name='comments-o'/> {comments.length}</Text> */}
            </View>
            <View style={styles.productContents}>
               <Divider />
               <View style={{ flex: 1, flexDirection: "row", padding: 5 }}>
                  {product && product?.sizes && (
                     <View
                        style={{ flexDirection: "row", alignItems: "center" }}>
                        <View style={{ marginRight: 20 }}>
                           <Text style={{ fontFamily: "Poppins_500Medium" }}>
                              SIZES
                           </Text>
                        </View>

                        {JSON.parse(String(product.sizes)).map((size: any) => {
                           return (
                              <View
                                 key={size}
                                 style={{
                                    borderWidth: 1,
                                    paddingHorizontal: 10,
                                    paddingVertical: 5,
                                    borderRadius: 2,
                                    borderColor: theme.colors.secondary,
                                    marginHorizontal: 1,
                                    justifyContent: "center",
                                    alignItems: "center",
                                 }}>
                                 <Text>{size}</Text>
                              </View>
                           );
                        })}
                     </View>
                  )}
               </View>
               <Divider />
               <View style={{ flex: 1, flexDirection: "row", padding: 5 }}>
                  {product && product?.numberAvailable && (
                     <View
                        style={{ flexDirection: "row", alignItems: "center" }}>
                        <View style={{ marginRight: 20 }}>
                           <Text style={{ fontFamily: "Poppins_500Medium" }}>
                              NUMBER AVAILABLE
                           </Text>
                        </View>
                        <View
                           style={{
                              borderWidth: 1,
                              paddingHorizontal: 10,
                              paddingVertical: 5,
                              borderRadius: 2,
                              borderColor: theme.colors.secondary,
                              marginHorizontal: 1,
                              justifyContent: "center",
                              alignItems: "center",
                           }}>
                           <Text>{product.numberAvailable}</Text>
                        </View>
                     </View>
                  )}
               </View>
            </View>
            {/* <View
               style={{
                  paddingHorizontal: 15,
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
               }}>
               <TextInput
                  value={productCommentState.text}
                  placeholder="Comment here..."
                  onChangeText={(v) =>
                     dispatchproductComment({ type: "TEXT", payload: v })
                  }
                  style={{
                     flex: 1,
                     backgroundColor: "#f6f6f6",
                     borderTopLeftRadius: 20,
                     borderBottomLeftRadius: 20,
                     height: 50,
                     paddingHorizontal: 25,
                  }}
               />
               <Pressable
                  onPress={handleComment}
                  style={{
                     paddingHorizontal: 20,
                     height: 50,
                     alignItems: "center",
                     justifyContent: "center",
                     borderTopRightRadius: 20,
                     borderBottomRightRadius: 20,
                     backgroundColor: "#f6f6f6",
                  }}>
                  <FontAwesome
                     color={theme.colors.primary}
                     name="comment-o"
                     size={23}
                  />
               </Pressable>
            </View> */}
            {/* <View style={styles.commentBox}>
               <TextInput
          
                  value={productCommentState.text}
                  onChangeText={(v) =>
                     dispatchproductComment({ type: "TEXT", payload: v })
                  }
                  style={[
                     styles.commentInputField,
                     { color: theme.colors.primary },
                  ]}
                  right={
                     <TextInput.Icon
                        disabled={loading}
                        onPress={handleComment}
                        icon="send"
                     />
                  }
                
                  multiline
               />
               <Entypo size={26} name="emoji-neutral" />
            </View> */}

            <View style={{ padding: 5, marginBottom: 10 }}>
               <ProductComments
                  posterId={product?.userId}
                  navigation={navigation}
                  productComments={comments}
               />
            </View>
         </View>
      </ScrollView>
   );
};

export default ProductScreen;

const styles = StyleSheet.create({
   productContainer: {
      backgroundColor: "#ffffff",
      // marginHorizontal:6,
      marginTop: 3,
      borderRadius: 4,
      paddingTop: 10,
      borderWidth: 1,

      // paddingBottom:20,
      // marginBottom:30
   },
   commentBox: {
      flex: 1,
      flexDirection: "row",
      alignItems: "center",
      gap: 5,
      paddingHorizontal: 15,
      borderWidth: 0,

      borderRadius: 20,
   },
   title: {
      fontFamily: "Poppins_700Bold",
      fontSize: 16,
      marginHorizontal: 10,
      marginTop: 6,
   },
   commentInputField: {
      flex: 1,
      backgroundColor: "#f4f4f4",
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      borderBottomRightRadius: 20,
      borderBottomLeftRadius: 20,
      height: 50,
      paddingHorizontal: 25,
      borderColor: "#ffffff",
   },
   likeCommentAmountCon: {
      flexDirection: "row",
      // justifyContent: "space-between",
      gap: 15,
      padding: 10,
      // borderWidth:1,
      marginLeft: 10,
      borderRadius: 20,
      // justifyContent:'center',
   },
   commentAmountText: {
      fontFamily: "Poppins_200ExtraLight",
      fontSize: 16,
   },
   profileImage: {
      width: 35,
      height: 35,
      borderRadius: 20,
   },
   productName: {
      fontFamily: "Poppins_400Regular",
      fontSize: 16,
      marginHorizontal: 10,
      marginTop: 6,
   },
   productPrice: {
      fontFamily: "Poppins_400Regular",
      fontSize: 16,
      marginHorizontal: 10,
      textAlignVertical: "center",
      marginTop: 6,
   },
   productInitialPrice: {
      fontFamily: "Poppins_300Light",
      fontSize: 16,
      marginHorizontal: 10,
      textAlignVertical: "center",
      marginTop: 6,
   },
   productContents: {
      borderRadius: 2,
      //   backgroundColor: "#f9f9ff",
      margin: 5,
      padding: 10,
      //   height: 60,
   },
});
