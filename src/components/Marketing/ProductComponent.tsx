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
import {
   TextInput,
   useTheme,
   Button,
   IconButton,
   Avatar,
} from "react-native-paper";
import { Ionicons, Feather, SimpleLineIcons } from "@expo/vector-icons";
import axios from "axios";
import { useCurrentUser } from "../../utils/CustomHooks";
import UpdateProductForm from "./UpdateProduct";
import { LoadingProductComponent } from "../MediaPosts/LoadingComponents";

// type ProductComment = Omit<Commentproduct, "posterId">;
const initialState: Partial<ProductComment> = {};

const { width } = Dimensions.get("window");

const productCommentReducer = (
   state: Partial<ProductComment> = initialState,
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

type FetchedProductProps = {
   product:Product,
   likesCount:number,
   liked:boolean,
   previewed:boolean,
   previewsCount:number,
   user:User
}

const ProductComponent = ({product,...props}: FetchedProductProps) => {
   const [postProductCommentstate, dispatchPostComment] = useReducer(
      productCommentReducer,
      initialState
   );
   const currentUser = useCurrentUser();
   const [openModal, setOpenModal] = useState<boolean>(false);
   const [productComments, setProductComments] = useState<ProductComment[]>([]);
   const [likesCount, setLikesCount] = useState<number>(0);
   const [user, setUser] = useState<User|null>(null);
   const [liked, setLiked] = useState<boolean>(false);
   const [loading, setLoading] = useState<boolean>(false);
   const theme = useTheme();

   useEffect(
      function () {
         setUser(props.user)
         setLiked(props.liked)
         setLikesCount(props.likesCount)
      },
      []
   );



   const handleLike = async (productId: number) => {
      console.log(productId);
      try {
         let activeUserId = currentUser?.id;
         let { data,status } = await axios.put(
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

   const gotoUserProfile = () => {
      if (currentUser?.id === user?.id) {
         product.navigation.navigate("ProfileScreen", { userId: user?.id });
      } else {
         product.navigation.navigate("UserProfileScreen", { userId: user?.id });
      }
   };

   if (!user) {
      return <View></View>;
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
               <Pressable onPress={gotoUserProfile}>
                  <Avatar.Image
                     size={30}
                     source={{ uri: user.profileImage }}
                  />
                  {/* <Image
                     style={styles.profileImage}
                     source={{ uri: user.profileImage }}
                  /> */}
               </Pressable>

               <Text style={{ fontFamily: "Poppins_600SemiBold", margin: 5 }}>
                  {user.firstName} {user.middleName} {user.lastName}
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
         <View>
            {product.images && <ImagesViewer images={product.images} />}
            {/* {product?.video && <VideoPlayer video={product?.video}/>} */}
         </View>
         <View
            style={{
               flexDirection: "row",
               marginVertical: 5,
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
            {/* <Button  mode='contained'>Affiliate</Button> */}
         </View>

         {product?.description && (
            <TextShortener
               style={{ marginHorizontal: 8, fontFamily: "Poppins_300Light" }}
               text={product.description}
               onPressViewMore={() =>
                  product.navigation.navigate("ProductScreen", {
                     productId: product.id,
                     userId: product.userId,
                     affiliateId: product?.affiliateId && product.affiliateId[0],
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
                  <Text style={styles.commentAmountText}>{likesCount}</Text>
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
                        product.navigation.navigate("ProductScreen", {
                           productId: product.id,
                           userId: product.userId,
                           affiliateId:
                              product?.affiliateId && product.affiliateId[0],
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
                  posterId={product.userId}
                  navigation={product?.navigation}
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
