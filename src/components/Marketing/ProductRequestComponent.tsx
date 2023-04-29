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
import ProductComments from "./ProductComments";
// import { postProductComments, postLikes, users } from "../../data";
import { TextInput, useTheme, Button, IconButton, Divider } from "react-native-paper";
import {
   AntDesign,
   Entypo,
   FontAwesome,
   MaterialCommunityIcons,
   Ionicons,
   Feather,
} from "@expo/vector-icons";
import axios from "axios";
import TextShortener from "../TextShortener";
import { Skeleton } from "@rneui/base";


const initialState: Partial<MakePurchaseParams> = {};
const { width } = Dimensions.get("window");


const buyProductReducer = (
   state: Partial<MakePurchaseParams> = initialState,
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
      case "AFFILIATEID":
         return {
            ...state,
            affiliateId: action.payload,
         };
    case "BUYERID":
         return {
            ...state,
            buyerId: action.payload,
         };
      default:
         return state;
   }
};

const ProductRequestComponent = (props: ProductComponentProps) => {
   const [productParams, dispatchProductParams] = useReducer(
      buyProductReducer,
      initialState
   );
   const [currentUser, setCurrentUser] = useState<CurrentUser>({});
   const [likes, setLikes] = useState<ProductLike[] | null>(null);
   const [poster, SetPoster] = useState<any>();
   const [liked, setLiked] = useState<boolean>(false);
   const [loading, setLoading] = useState<boolean>(false);
   const [loading1, setLoading1] = useState<boolean>(false);
   const [loading2, setLoading2] = useState<boolean>(false);
   const theme = useTheme();

   useEffect(() => {
      // dispatchbuyProduct({ type: "", payload: "" });
      setCurrentUser({
         id: 1,
         email: "mexu.company@gmail.com",
         accountNumber: "1COM30000000000",
      });
   }, []);


   useEffect(function () {
      console.log("Fetching user");
      setLoading(true);
      let fetchData = async () => {
         try {
            let response = await fetch(
               `http://192.168.2.183:5000/api/auth/users/${props.userId}`,
               { method: "GET" }
            );
            let data = await response.json();
            if (data.status == "success") {
               console.log("Users-----", data.data);
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

    const handleDelete = async () => {
      setLoading1(true);
      let productId = props.id
      let userId = currentUser.id
      try {
         let { data } = await axios.delete(
            `http://192.168.2.183:5000/api/marketing/products/request/${productId}/${userId}`,
           
         );
         if (data.status == "success") {
            console.log(data.data);
            // setComments([...comments, data.data]);
            // dispatchproductComment({ type: "TEXT", payload: "" });
            Alert.alert("Success",data.message)
         } else {
            Alert.alert("Failed", data.message);
         }
         setLoading1(false);
      } catch (err) {
         Alert.alert("Failed", String(err));
         setLoading1(false);
      }
   };
   

    const handleBuy = async () => {
      setLoading2(true);
      let activeUserId = 1;
      let buyObj:MakePurchaseParams = {
         affiliateId:JSON.parse(String(props?.affiliateId))[0],
         productId: props?.id,
         userId: props?.userId,
         buyerId:currentUser.id
      };
      console.log(buyObj);
      try {
         let { data } = await axios.post(
            `http://192.168.2.183:5000/api/marketing/buy`,
            buyObj
         );
         if (data.status == "success") {
            console.log(data.data);
            // setComments([...comments, data.data]);
            // dispatchproductComment({ type: "TEXT", payload: "" });
            Alert.alert("Success",data.message)
         } else {
            Alert.alert("Failed", data.message);
         }
         setLoading2(false);
      } catch (err) {
         Alert.alert("Failed", String(err));
         setLoading2(false);
      }
   };

   if (!props.images) {
      return (
        <View style={{padding:4}}>
             <View style={{flexDirection:"row",marginVertical:4}}>
            <Skeleton animation='wave'  width={45} height={45} circle  />
            <Skeleton style={{borderRadius:5,paddingHorizontal:2}} animation='wave' width={305} height={45}/>
         </View>
          <View style={{flexDirection:"row",marginVertical:5}}>
            <Skeleton animation='wave'  width={60} height={60} circle  />
            <Skeleton style={{borderRadius:5,paddingHorizontal:2}} animation='wave' width={290} height={60}/>
         </View>

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
                  backgroundColor:"#f9f9f9"
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
        {/* <Divider/> */}
         <View
            style={{
               flexDirection: "row",
               marginVertical: 5,
               alignItems: "center",
               justifyContent:"space-around",
               
            }}>
                <Image
                style={styles.stockImage}
                source={{ uri: JSON.parse(String(props.images))[0]}}
               />
            <Text style={styles.productName}><TextShortener style={{textAlignVertical:"center",fontFamily:"Poppins_300Light"}} text={props.productName} textLength={10} /></Text>

            <Text
               style={[styles.productPrice, { color: theme.colors.primary }]}>
               C{props?.price}
            </Text>
            <Button onPress={handleBuy} mode='contained'>Buy</Button>
            <Button onPress={handleDelete} mode='text'><Feather name="x"/></Button>

         </View>
      </View>
   );
};

export default ProductRequestComponent;

const styles = StyleSheet.create({
   postContainer: {
      backgroundColor: "#ffffff",
      // marginHorizontal:6,
      marginVertical: 4,
      borderRadius: 4,
    //   paddingVertical: 10,
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
    stockImage: {
      width: 50,
      height: 50,
      borderRadius:25
   },
});
