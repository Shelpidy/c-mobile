import { StyleSheet, Text, View, Alert, Modal } from "react-native";
import React, { useState, useEffect, useReducer, useMemo } from "react";
import { Button, TextInput, useTheme } from "react-native-paper";
import { AntDesign, MaterialIcons } from "@expo/vector-icons";
// import {
//    RichTextEditor,
//    RichTextViewer,
//    ActionMap,
//    ActionKey,
// } from "@siposdani87/expo-rich-text-editor";
import axios from "axios";
import { ImagePicker } from "expo-image-multiple-picker";
import { useCurrentUser } from "../../utils/CustomHooks";
import config from "../.././aws-config";
import AWS from "aws-sdk";

const s3 = new AWS.S3({
   accessKeyId: config.accessKeyId,
   secretAccessKey: config.secretAccessKey,
   region: config.region,
});

type NewProduct = Partial<Product>;

const initialState = {};

const productReducer = (state: NewProduct = initialState, action: Action) => {
   switch (action.type) {
      case "NAME":
         return { ...state, productName: action.payload };
      case "DESCRIPTION":
         return {
            ...state,
            description: action.payload,
         };
      case "CATEGORY":
         return { ...state, category: action.payload };
      case "SIZES":
         return { ...state, sizes: action.payload };
      case "NUMBERAVAILABLE":
         return { ...state, numberAvailable: action.payload };
      case "PRICE":
         return { ...state, price: action.payload };
      case "IMAGES":
         return { ...state, images: action.payload };
      case "USERID":
         return { ...state, userId: action.payload };
      default:
         return state;
   }
};

const ProductForm = () => {
   const [loading, setLoading] = useState<boolean>(false);
   const [productState, productDispatch] = useReducer(
      productReducer,
      initialState
   );
   const [imageOpen, setImageOpen] = useState(false);
   const currentUser = useCurrentUser();
   // const [album, setAlbum] = useState<Album | undefined>()
   // const [assets, setAssets] = useState<Asset[]>([])
   const theme = useTheme();

   const handleProduct = async () => {
      setLoading(true);
      let activeUserId = currentUser?.id;
      let productObj = { ...productState, userId: activeUserId };

      // Upload images to S3
      // const uploadedImageURLs = [];
      // for (const imageUri of productObj.images) {
      //    const imageName = imageUri.substring(imageUri.lastIndexOf("/") + 1);
      //    const imageKey = `${Date.now()}-${imageName}`;
      //    const imageParams = {
      //       Bucket: config.bucketName,
      //       Key: imageKey,
      //       Body: { uri: imageUri },
      //    };

      //    try {
      //       const uploadResponse = await s3.upload(imageParams).promise();
      //       uploadedImageURLs.push(uploadResponse.Location);
      //    } catch (error) {
      //       console.log("Image upload error:", error);
      //       setLoading(false);
      //       Alert.alert("Failed", "Image upload failed");
      //       return;
      //    }
      // }

      // Update product with uploaded image URLs
      // productObj.images = uploadedImageURLs;

      try {
         let response = await axios.post(
            "http://192.168.0.107:5000/api/marketing/poroducts/",
            productObj
         );
         if (response.status === 201) {
            console.log(response.data);
            setLoading(false);
            Alert.alert("Successful", "Uploaded product successfully");
         } else {
            setLoading(false);
            Alert.alert("Failed", "Upload Failed");
         }
      } catch (err) {
         setLoading(false);
         console.log(err);
      }
   };

   // const handleProduct = async () => {
   //    setLoading(true);
   //    let activeUserId = currentUser?.id;
   //    let productObj = { ...productState, userId: activeUserId };
   //    try {
   //       let response = await axios.post(
   //          "http://192.168.0.107:5000/api/marketing/poroducts/",
   //          productObj
   //       );
   //       if (response.status === 201) {
   //          console.log(response.data);
   //          setLoading(false);
   //          Alert.alert("Successful", "Uploaded product successfully");
   //       } else {
   //          setLoading(false);
   //          Alert.alert("Failed", "Upload Failed");
   //       }
   //    } catch (err) {
   //       setLoading(false);
   //       console.log(err);
   //    }

   //    // console.log(postState);
   // };

   const chooseImage = (assets: any[]) => {
      let imageSrcs = assets.map((asset) => asset.uri);
      console.log(imageSrcs);
      productDispatch({ type: "IMAGES", payload: imageSrcs });
      setImageOpen(false);
   };

   const cancelImage = () => {
      // Alert.alert("No permission","canceling image picker")
      console.log("No permission, canceling image picker");
      setImageOpen(false);
   };

   return (
      <View
         style={{
            borderWidth: 2,
            borderRadius: 5,
            margin: 8,
            borderColor: "#f5f5f5",
         }}>
         <Modal visible={imageOpen}>
            <ImagePicker
               onSave={chooseImage}
               onCancel={cancelImage}
               multiple
               limit={8}
            />
         </Modal>
         <View style={styles.formContainer}>
            <TextInput
               onChangeText={(v) =>
                  productDispatch({ type: "NAME", payload: v })
               }
               mode="outlined"
               label="Product Name"
            />

            <TextInput
               onChangeText={(v) =>
                  productDispatch({ type: "DESCRIPTION", payload: v })
               }
               mode="outlined"
               label="Description"
               multiline
               numberOfLines={5}
            />
            <TextInput
               onChangeText={(v) =>
                  productDispatch({ type: "CATEGORY", payload: v })
               }
               mode="outlined"
               label="Category"
            />
            <TextInput
               onChangeText={(v) =>
                  productDispatch({ type: "SIZES", payload: v })
               }
               mode="outlined"
               label="Sizes"
            />
            <TextInput
               onChangeText={(v) =>
                  productDispatch({ type: "PRICE", payload: v })
               }
               mode="outlined"
               label="Price"
            />
            <TextInput
               onChangeText={(v) =>
                  productDispatch({ type: "NUMBERAVAILABLE", payload: v })
               }
               mode="outlined"
               label="Number Available"
            />
            <Text
               style={{
                  textAlign: "center",
                  marginTop: 10,
                  fontFamily: "Poppins_300Light",
               }}>
               Choose Images
            </Text>
            <View style={styles.buttonGroup}>
               <Button
                  style={styles.button}
                  mode="contained-tonal"
                  onPress={() => setImageOpen(true)}>
                  <AntDesign size={20} name="picture" />
               </Button>
            </View>

            <Button
               mode="contained"
               onPress={handleProduct}
               disabled={loading}
               loading={loading}>
               Upload <AntDesign size={20} name="upload" />
            </Button>
         </View>
      </View>
   );
};

export default ProductForm;

const styles = StyleSheet.create({
   formContainer: {
      padding: 15,
      gap: 5,
   },
   buttonGroup: {
      flexDirection: "row",
      justifyContent: "space-evenly",
      marginVertical: 10,
   },
   button: {
      flex: 1,
      marginHorizontal: 3,
   },
});
