import {
   StyleSheet,
   Text,
   View,
   Modal,
   Dimensions,
   Image,
   Alert,
   ScrollView,
} from "react-native";
import React, { useState, useEffect, useReducer } from "react";
import ImagesViewer from "../components/ImagesViewer";
import VideoPlayer from "../components/VideoPlayer";
import TextViewer from "../components/TextViewer";
// import Comments from "../components/marketingproducts/Comments";
// import { productComments, productLikes, users } from "../data";
import { TextInput, useTheme, Button, IconButton } from "react-native-paper";
import {
   AntDesign,
   Entypo,
   FontAwesome,
   MaterialCommunityIcons,
   Feather,
} from "@expo/vector-icons";
import axios from "axios";
import ProductComments from "../components/Marketing/ProductComments";

const initialState: ProductComment = {};

const { width } = Dimensions.get("window");

const productCommentReducer = (
   state: ProductComment = initialState,
   action: Action
) => {
   switch (action.type) {
      case "productID":
         return {
            ...state,
            producterId: action.payload,
         };
      case "USERID":
         return {
            ...state,
            userId: action.payload,
         };
      case "TEXT":
         return {
            ...state,
            text: action.payload,
         };
      default:
         return state;
   }
};

const ProductScreen = ({ navigation, route }: any) => {
   const [productCommentState, dispatchproductComment] = useReducer(
      productCommentReducer,
      initialState
   );
   const [currentUser, setCurrentUser] = useState<CurrentUser>({});
   const [product, setproduct] = useState<ProductComponentProps | null>(null);
   const [openModal, setOpenModal] = useState<boolean>(false);
   const [comments, setComments] = useState<ProductComment[]>([]);
   const [likes, setLikes] = useState<ProductLike[]>([]);
   const [producter, Setproducter] = useState<any>();
   const [liked, setLiked] = useState<boolean>(false);
   const [loading, setLoading] = useState<boolean>(false);
   const theme = useTheme();

   useEffect(() => {
      dispatchproductComment({ type: "", payload: "" });
      setCurrentUser({
         id: 1,
         email: "mexu.company@gmail.com",
         accountNumber: "1COM10000000000",
      });
   }, []);

   useEffect(() => {
      setproduct(route.params.product);
      console.log("product",route.params.product);
   }, []);

   useEffect(function () {
      let fetchData = async () => {
         let activeUserId = 1;
         let productId = route.params.product.id;
         try {
            let { data } = await axios.get(
               `http://192.168.0.106:5000/api/marketing/products/cl/${productId}`
            );
            if (data.status == "success") {
            //    console.log(data.data);
               let ls: any[] = data.data.likes;
               setComments(data.data.comments);
               setLikes(data.data.likes);
               if (ls.map((like) => like.userId).includes(activeUserId)) {
                  setLiked(true);
               }
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

   useEffect(function () {
      console.log("Fetching user");
      setLoading(true);
      let userId = route.params.product.userId;
      let fetchData = async () => {
         // console.log("Fetching user")
         //  let activeUserId = 1
         try {
            let response = await fetch(
               `http://192.168.0.106:5000/api/auth/users/${userId}`,
               { method: "GET" }
            );
            let data = await response.json();
            if (data.status == "success") {
               // console.log("Users-----",data.data)
               Setproducter(data.data.personal);
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

   // useEffect(() => {
   //    setLikes(productLikes.filter((like) => like.productId === product.id));
   //    setComments(
   //       productComments.filter((comment) => comment.productId === product.id)
   //    );

   //    // GET COMMENTS AND LIKES
   // }, [users, productComments, productLikes]);

   // useEffect(() => {
   //    Setproducter(users.find((user) => user.id === product.userId));
   // }, [users]);

   

   const handleComment = async () => {
      setLoading(true);
      let activeUserId = 1;
      let commentObj = {
         ...productCommentState,
         productId: product?.id,
         userId: activeUserId,
      };
      console.log(commentObj);
      try {
         let { data } = await axios.post(
            `http://192.168.0.106:5000/api/marketing/products/comments/`,
            commentObj
         );
         if (data.status == "success") {
            console.log(data.data);
            setComments([...comments, data.data]);
            dispatchproductComment({ type: "TEXT", payload: "" });
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

   const handleLike = async (productId: number) => {
      console.log(productId);
      try {
         let activeUserId = 1;
         let { data } = await axios.put(
            `http://192.168.0.106:5000/api/marketing/products/likes/`,
            { userId: activeUserId, productId: productId }
         );
         if (data.status == "success") {
            console.log(data.data);

            if (liked) {
               setLikes(likes.slice(0, likes.length - 1));
               setLiked(!liked);
            } else {
               setLikes([
                  ...likes,
                  {
                     id: likes.length,
                     productId: likes[0].productId,
                     userId: currentUser.id,
                     createdAt: new Date(),
                     updatedAt: new Date(),
                  },
               ]);
               setLiked(!liked);
            }

            Alert.alert("Success", data.message);
         } else {
            Alert.alert("Failed", data.message);
         }
         setLoading(false);
      } catch (err) {
         Alert.alert("Failed", String(err));
         setLoading(false);
      }
   };

   if (!product) {
      return (
         <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
            <Text>Loading...</Text>
         </View>
      );
   }

   return (
      <ScrollView style={styles.productContainer}>
         <Modal visible={openModal}>
            <View
               style={{
                  flex: 1,
                  backgroundColor: "#ffffff88",
                  justifyContent: "center",
                  alignItems: "center",
               }}>
               <View
                  style={{
                     backgroundColor: "#ffffff",
                     padding: 5,
                     borderRadius: 4,
                  }}>
                  <Button onPress={() => setOpenModal(false)}>Back</Button>
                  <Text>Comment Editor</Text>
               </View>
            </View>
         </Modal>
         {producter && (
            <View
               style={{
                  flexDirection: "row",
                  alignItems: "center",
                  padding: 8,
               }}>
               <Image
                  style={styles.profileImage}
                  source={{ uri: producter.profileImage }}
               />
               <Text style={{ fontFamily: "Poppins_600SemiBold", margin: 5 }}>
                  {producter.firstName} {producter.middleName}{" "}
                  {producter.lastName}
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
                  {currentUser.id == product?.userId && (
                     <View>
                        <Button onPress={() => setOpenModal(true)}>
                           <Feather name="edit" /> Edit product
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
               flexDirection: "row",
               marginVertical: 5,
               justifyContent:"space-evenly",
               alignItems: "center",
            }}>
            <Text style={styles.productName}>{product?.productName}</Text>

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
               style={[styles.productPrice, { color: theme.colors.primary }]}>
               C{product?.price}
            </Text>
            <Button  mode='outlined'>Affiliate</Button>
         </View>
         {product?.description && <TextViewer text={product.description} />}
         <View>
            <View style={styles.likeCommentAmountCon}>
               <View
                  style={{
                     flexDirection: "row",
                     alignItems: "center",
                     justifyContent: "flex-start",
                  }}>
                  <IconButton
                     disabled={loading}
                     onPress={() => handleLike(product!.id)}
                     mode="outlined"
                     size={18}
                     icon={liked ? "heart" : "heart-outline"}
                  />
                  <Text style={styles.commentAmountText}>{likes.length}</Text>
               </View>
               <View
                  style={{
                     flexDirection: "row",
                     alignItems: "center",
                     justifyContent: "flex-start",
                  }}>
                  <IconButton
                     mode="outlined"
                     size={18}
                     icon="comment-outline"
                  />
                  <Text style={styles.commentAmountText}>
                     {comments.length}
                  </Text>
               </View>
               <View>
                  <Button style={{backgroundColor:"#f9f9ff"}} mode='contained-tonal'>Request</Button>
               </View>
               {/* <Text style={styles.commentAmountText}><FontAwesome size={28} name='comments-o'/> {comments.length}</Text> */}
            </View>
             <View style={styles.productContents}>
                <View>
                    <View><Text>SIZES</Text></View>
                    {product.sizes !== undefined && product.sizes && 
                    <Text style={{borderWidth:2}}>{JSON.parse(product.sizes+'').map((size:any)=><Text>{size}</Text>)}</Text>}
                </View>
                <View><Text>Number Available</Text></View>
            </View>
            <View style={styles.commentBox}>
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
                  mode="outlined"
                  multiline
               />
               <Entypo size={26} name="emoji-neutral" />
            </View>
           
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
      borderColor: "#f3f3f3",
      // paddingBottom:20,
      // marginBottom:30
   },
   commentBox: {
      flex: 1,
      flexDirection: "row",
      alignItems: "center",
      gap: 5,
      paddingHorizontal: 15,
   },
   title: {
      fontFamily: "Poppins_700Bold",
      fontSize: 16,
      marginHorizontal: 10,
      marginTop: 6,
   },
   commentInputField: {
      flex: 1,
      marginHorizontal: 5,
   },
   likeCommentAmountCon: {
      flexDirection: "row",
      // justifyContent: "space-between",
      gap: 15,
      paddingHorizontal: 15,
      marginVertical: 5,
   },
   commentAmountText: {
      fontFamily: "Poppins_400Regular",
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
      fontFamily: "Poppins_600SemiBold",
      fontSize: 16,
      marginHorizontal: 10,
      marginTop: 6,
   },
   productInitialPrice: {
      fontFamily: "Poppins_300Light",
      fontSize: 16,
      marginHorizontal: 10,
      marginTop: 6,
   },
   productContents:{
     borderRadius:2,
     backgroundColor:"#f9f9ff",
     margin:5,
     padding:10,
     height:60
   }
});
