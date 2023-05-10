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
      case "ID":
         return { ...state, id: action.payload };
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

type NProductComponentProps = ProductComponentProps & { navigation?: any };

const UpdateProductForm = (product: NProductComponentProps) => {
   const [loading, setLoading] = useState<boolean>(false);
   const [productState, productDispatch] = useReducer(
      productReducer,
      initialState
   );
   const [imageOpen, setImageOpen] = useState(false);
   const currentUser = useCurrentUser();
   const theme = useTheme();

   useEffect(() => {
      productDispatch({ type: "NAME", payload: product.productName });
      productDispatch({ type: "DESCRIPTION", payload: product.description });
      productDispatch({ type: "CATEGORY", payload: product.category });
      productDispatch({ type: "IMAGES", payload: product.images });
      productDispatch({ type: "ID", payload: product.id });
      productDispatch({ type: "USERID", payload: product.userId });
      productDispatch({
         type: "NUMBERAVAILABLE",
         payload: product.numberAvailable,
      });
      productDispatch({ type: "SIZES", payload: product.sizes });
      productDispatch({ type: "PRICE", payload: product.sizes });
   }, []);

   const handleUpdate = async () => {
      setLoading(true);
      let productObj = { ...productState };

      // Upload images to S3
      const uploadedImageURLs = [];
      for (const imageUri of productObj.images) {
         const imageName = imageUri.substring(imageUri.lastIndexOf("/") + 1);
         const imageKey = `${Date.now()}-${imageName}`;
         const imageParams = {
            Bucket: config.bucketName,
            Key: imageKey,
            Body: { uri: imageUri },
         };

         try {
            const uploadResponse = await s3.upload(imageParams).promise();
            uploadedImageURLs.push(uploadResponse.Location);
         } catch (error) {
            console.log("Image upload error:", error);
            setLoading(false);
            Alert.alert("Failed", "Image upload failed");
            return;
         }
      }

      // Update product with uploaded image URLs
      productObj.images = uploadedImageURLs;

      try {
         let response = await axios.put(
            "http://192.168.175.183:5000/api/marketing/products/",
            productObj
         );
         if (response.status === 202) {
            console.log(response.data);
            setLoading(false);
            Alert.alert("Successful", "Update product successfully.");
         } else {
            setLoading(false);
            Alert.alert("Failed", "Product update failed");
         }
      } catch (err) {
         setLoading(false);
         console.log(err);
      }
   };

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
            margin: 8,
          
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
               outlineStyle={{borderColor:"#f6f6f6"}}
               style={{backgroundColor:"#f6f6f6"}}
               onChangeText={(v) =>
                  productDispatch({ type: "NAME", payload: v })
               }
               mode="outlined"
               label="Product Name"
               value={productState.productName}
            />
            <TextInput
               outlineStyle={{borderColor:"#f6f6f6"}}
               style={{backgroundColor:"#f6f6f6"}}
               onChangeText={(v) =>
                  productDispatch({ type: "DESCRIPTION", payload: v })
               }
               mode="outlined"
               label="Description"
               multiline
               numberOfLines={5}
               value={productState.description}
            />
            <TextInput
               outlineStyle={{borderColor:"#f6f6f6"}}
               style={{backgroundColor:"#f6f6f6"}}
               onChangeText={(v) =>
                  productDispatch({ type: "CATEGORY", payload: v })
               }
               mode="outlined"
               label="Category"
               value={productState.category}
            />
            <TextInput
               outlineStyle={{borderColor:"#f6f6f6"}}
               style={{backgroundColor:"#f6f6f6"}}
               onChangeText={(v) =>
                  productDispatch({ type: "SIZES", payload: v })
               }
               mode="outlined"
               label="Sizes"
               value={productState.sizes}
            />
            <TextInput
               outlineStyle={{borderColor:"#f6f6f6"}}
               style={{backgroundColor:"#f6f6f6"}}
               onChangeText={(v) =>
                  productDispatch({ type: "PRICE", payload: v })
               }
               mode="outlined"
               label="Price"
               value={productState.price}
            />
            <TextInput
               outlineStyle={{borderColor:"#f6f6f6"}}
               style={{backgroundColor:"#f6f6f6"}}
               onChangeText={(v) =>
                  productDispatch({ type: "NUMBERAVAILABLE", payload: v })
               }
               mode="outlined"
               label="Number Available"
               value={productState.numberAvailable}
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
               onPress={handleUpdate}
               disabled={loading}
               loading={loading}>
               Update <AntDesign size={20} name="upload" />
            </Button>
         </View>
      </View>
   );
};

export default UpdateProductForm;

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
