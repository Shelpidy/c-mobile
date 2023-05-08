import {
   StyleSheet,
   Text,
   View,
   Modal,
   Dimensions,
   Image,
   Alert,
   Pressable,
} from "react-native";
import React, { useState, useEffect, useReducer } from "react";
import ImagesViewer from "../ImagesViewer";
import TextShortener from "../TextShortener";
import ProductComments from "./ProductComments";
// import { postProductComments, postLikes, users } from "../../data";
import { TextInput, useTheme, Button, IconButton } from "react-native-paper";
import { Ionicons, Feather, SimpleLineIcons } from "@expo/vector-icons";
import axios from "axios";
import { useCurrentUser } from "../../utils/CustomHooks";
import UpdateProductForm from "./UpdateProduct";

// type ProductComment = Omit<CommentProps, "posterId">;
const initialState: ProductComment = {};

const { width } = Dimensions.get("window");

const postCommentReducer = (
   state: ProductComment = initialState,
   action: Action
) => {
   switch (action.type) {
      case "PRODUCTID":
         return {
            ...state,
            posterId: action.payload,
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

const ProductComponent = (props: ProductComponentProps) => {
   const [postProductCommentstate, dispatchPostComment] = useReducer(
      postCommentReducer,
      initialState
   );
   const currentUser = useCurrentUser();
   const [openModal, setOpenModal] = useState<boolean>(false);
   const [productComments, setProductComments] = useState<ProductComment[]>([]);
   const [likes, setLikes] = useState<ProductLike[] | null>(null);
   const [poster, SetPoster] = useState<any>();
   const [liked, setLiked] = useState<boolean>(false);
   const [loading, setLoading] = useState<boolean>(false);
   const theme = useTheme();

   useEffect(
      function () {
         let fetchData = async () => {
            try {
               if (props) {
                  let { data } = await axios.get(
                     `http://192.168.0.107:5000/api/marketing/products/cl/${props?.id}`
                  );
                  if (data.status == "success") {
                     // console.log("Comments and Likes -----", data.data);
                     let ls: any[] = data.data.likes;
                     let cs = data.data.comments;
                     setProductComments(cs);
                     setLikes(ls);
                     if (
                        ls.map((like) => like.userId).includes(currentUser?.id)
                     ) {
                        setLiked(true);
                     }
                     // Alert.alert("Success",data.message)
                  } else {
                     Alert.alert("Failed", data.message);
                  }
               }

               setLoading(false);
            } catch (err) {
               Alert.alert("Failed", String(err));
               setLoading(false);
            }
         };
         fetchData();
      },
      [currentUser, props]
   );

   useEffect(
      function () {
         // console.log("Fetching user");s
         setLoading(true);
         let fetchData = async () => {
            // console.log("Fetching user")
            //  let activeUserId = 1
            try {
               if (props) {
                  let response = await fetch(
                     `http://192.168.0.107:5000/api/auth/users/${props?.userId}`,
                     { method: "GET" }
                  );

                  if (response.ok) {
                     let data = await response.json();
                     // console.log("Users-----", data.data);
                     SetPoster(data.data.personal);
                     // Alert.alert("Success",data.message)
                     setLoading(false);
                  } else {
                     let data = await response.json();
                     Alert.alert("Failed", data.message);
                  }
               }

               setLoading(false);
            } catch (err) {
               console.log(err);
               Alert.alert("Failed", String(err));
               setLoading(false);
            }
         };
         fetchData();
      },
      [props]
   );

   const handleLike = async (productId: number) => {
      console.log(productId);
      try {
         let activeUserId = currentUser?.id;
         let { data } = await axios.put(
            `http://192.168.0.107:5000/api/marketing/products/likes/`,
            { userId: activeUserId, productId: productId }
         );
         if (data.status == "success") {
            // console.log(data.data);
            if (liked) {
               if (likes) {
                  setLikes(likes.slice(0, likes.length - 1));
                  setLiked(!liked);
               }
            } else {
               if (likes) {
                  setLikes([...likes, data.data]);
                  setLiked(!liked);
               }
            }

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

   const gotoUserProfile = () => {
      if (currentUser?.id === poster.id) {
         props.navigation.navigate("ProfileScreen", { userId: poster.id });
      } else {
         props.navigation.navigate("UserProfileScreen", { userId: poster.id });
      }
   };

   if (!likes) {
      return (
         <View>
            <Text>Loading products</Text>
         </View>
      );
   }

   return (
      <View style={styles.postContainer}>
         
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
                  <UpdateProductForm {...props}/>
               </View>
            </View>
         </Modal>
         {poster && (
            <View
               style={{
                  flexDirection: "row",
                  alignItems: "center",
                  padding: 8,
               }}>
               <Pressable onPress={gotoUserProfile}>
                  <Image
                     style={styles.profileImage}
                     source={{ uri: poster.profileImage }}
                  />
               </Pressable>

               <Text style={{ fontFamily: "Poppins_600SemiBold", margin: 5 }}>
                  {poster.firstName} {poster.middleName} {poster.lastName}
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
                  {currentUser?.id == props?.userId && (
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
         <View>
            {props.images && <ImagesViewer images={props.images} />}
            {/* {props?.video && <VideoPlayer video={props?.video}/>} */}
         </View>
         <View
            style={{
               flexDirection: "row",
               marginVertical: 5,
               alignItems: "center",
            }}>
            <Text style={styles.productName}>{props?.productName}</Text>

            {props.initialPrice && (
               <Text
                  style={[
                     styles.productInitialPrice,
                     {
                        color: theme.colors.secondary,
                        textDecorationLine: "line-through",
                     },
                  ]}>
                  C{props?.initialPrice}
               </Text>
            )}
            <Text
               style={[styles.productPrice, { color: theme.colors.primary }]}>
               C{props?.price}
            </Text>
            {/* <Button  mode='contained'>Affiliate</Button> */}
         </View>

         {props?.description && (
            <TextShortener
               style={{ marginHorizontal: 8, fontFamily: "Poppins_300Light" }}
               text={props.description}
               onPressViewMore={() =>
                  props.navigation.navigate("ProductScreen", {
                     productId: props.id,
                     userId: props.userId,
                     affiliateId: props?.affiliateId && props.affiliateId[0],
                  })
               }
               showViewMore={true}
               textLength={100}></TextShortener>
         )}
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
                     onPress={() => handleLike(props.id)}>
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
                  <Text style={styles.commentAmountText}>{likes.length}</Text>
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
                     {productComments.length}
                  </Text>
               </View>
               <View style={{ flex: 1 }}>
                  <Button
                     // textColor={theme.colors.primary}
                     onPress={() =>
                        props.navigation.navigate("ProductScreen", {
                           productId: props.id,
                           userId: props.userId,
                           affiliateId:
                              props?.affiliateId && props.affiliateId[0],
                        })
                     }
                     mode="contained">
                     Preview
                  </Button>
               </View>
               {/* <Text style={styles.commentAmountText}><FontAwesome size={28} name='comments-o'/> {comments.length}</Text> */}
            </View>

            <View style={{ padding: 5 }}>
               <ProductComments
                  posterId={props.userId}
                  navigation={props?.navigation}
                  productComments={productComments}
               />
            </View>
         </View>
      </View>
   );
};

export default ProductComponent;

const styles = StyleSheet.create({
   postContainer: {
      backgroundColor: "#ffffff",
      // marginHorizontal:6,
      marginVertical: 3,
      borderRadius: 4,
      paddingVertical: 10,
      borderWidth: 1,
      borderColor: "#f3f3f3",
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
   commentInputField: {
      flex: 1,
      marginHorizontal: 5,
   },
   likeCommentAmountCon: {
      flexDirection: "row",
      // justifyContent: "space-between",
      gap: 13,
      paddingHorizontal: 10,
      paddingVertical: 6,
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
});
