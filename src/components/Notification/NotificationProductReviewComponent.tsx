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
import VideoPlayer from "../VideoPlayer";
import TextViewer from "../TextViewer";
// import ProductComments from "./ProductComments";
// import { postProductComments, postLikes, users } from "../../data";
import { TextInput, useTheme, Button, IconButton } from "react-native-paper";
import {
   AntDesign,
   Entypo,
   FontAwesome,
   MaterialCommunityIcons,
   Ionicons,
   Feather,
} from "@expo/vector-icons";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";
import { useCurrentUser } from "../../utils/CustomHooks";
// import UpdateProductForm from "./UpdateProduct";

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

type NotificationProductReviewComponentProps = {
    props: ProductComponentProps
    buyerId:number
}

const NotificationProductReviewComponent = ({props,buyerId}:NotificationProductReviewComponentProps) => {

   const currentUser = useCurrentUser()
   const [poster, SetPoster] = useState<any>();
   const [loading, setLoading] = useState<boolean>(false);
   const theme = useTheme();
   const navigation = useNavigation<any>()

 

   useEffect(function () {
      console.log("Fetching user");
      setLoading(true);
      let fetchData = async () => {
         // console.log("Fetching user")
         //  let activeUserId = 1
         try {
            let response = await fetch(
               `http://192.168.0.100:5000/api/auth/users/${props.userId}`,
               { method: "GET" }
            );
            let data = await response.json();
            if (data.status == "success") {
               // console.log("Users-----", data.data);
               SetPoster(data.data.personal);
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

   
 

   if (!poster) {
      return (
         <View>
            <Text>Loading products</Text>
         </View>
      );
   }

   return (
      <View style={styles.postContainer}>
         {poster && (
            <View
               style={{
                  flexDirection: "row",
                  alignItems: "center",
                  padding: 8,
               }}>
               <Image
                  style={styles.profileImage}
                  source={{ uri: poster.profileImage }}
               />
               <Text style={{ fontFamily: "Poppins_600SemiBold", margin: 5 }}>
                  {poster.firstName} {poster.middleName} {poster.lastName}
               </Text>

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

         {props?.description && <TextViewer text={props.description} />}
         <View>
            <View
               style={[
                  styles.likeCommentAmountCon,
                  { borderColor: theme.colors.secondary },
               ]}>
               <View style={{ flex: 1,flexDirection:"row"}}>
                  <Button
                     // textColor={theme.colors.primary}
                     style={{flex:1,borderColor:theme.colors.primary}}
                     onPress={() =>
                        navigation.navigate("ProductScreen", {
                           productId:props.id,userId:props.userId,affiliateId:props?.affiliateId && props.affiliateId[0]
                        })
                     }
                     mode='outlined'>
                     Preview
                  </Button>
                  <Button
                  style={{marginHorizontal:5,flex:1}}
                     // textColor={theme.colors.primary}
                     onPress={() =>
                        navigation.navigate("ChatScreen", {
                            userId:buyerId
                        })
                     }
                     mode='contained'>
                        <AntDesign name="message1" style={{marginRight:2}} /> Message
                  </Button>
               </View>
               {/* <Text style={styles.commentAmountText}><FontAwesome size={28} name='comments-o'/> {comments.length}</Text> */}
            </View>
         </View>
      </View>
   );
};

export default NotificationProductReviewComponent;

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
      gap: 25,
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
});
