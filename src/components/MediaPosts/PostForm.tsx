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

type Post = Partial<Omit<PostComponentProps, "id" | "updatedAt" | "createdAt">>;

const initialState = {};

const postReducer = (state: Post = initialState, action: Action) => {
   switch (action.type) {
      case "TEXT":
         return { ...state, text: action.payload };
      case "TITLE":
         return {
            ...state,
            title: action.payload,
         };
      case "VIDEO":
         return { ...state, video: action.payload };
      case "IMAGES":
         return { ...state, images: action.payload };
      case "USERID":
         return { ...state, userId: action.payload };
      default:
         return state;
   }
};

const PostForm = () => {
   const [loading, setLoading] = useState<boolean>(false);
   const [postState, postDispatch] = useReducer(postReducer, initialState);
   const [imageOpen, setImageOpen] = useState(false);
   const [videoOpen, setVideoOpen] = useState(false);
   const currentUser = useCurrentUser();
   const theme = useTheme();

   const handlePost = async () => {
      setLoading(true);
      let activeUserId = currentUser?.id;
      let postObj = { ...postState, userId: activeUserId };
      // Upload images to S3
      // const uploadedImageURLs = [];
      // for (const imageUri of postObj.images) {
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
      // postObj.images = uploadedImageURLs;
      try {
         let response = await axios.post(
            "http://192.168.0.107:5000/api/media/posts/",
            postObj
         );
         if (response.status === 201) {
            console.log(response.data);
            setLoading(false);
            Alert.alert("Successful", "Post successfully");
         } else {
            setLoading(false);
            Alert.alert("Failed", "Post Failed");
         }
      } catch (err) {
         setLoading(false);
         console.log(err);
      }

      // console.log(postState);
   };

   const chooseImage = (assets: any[]) => {
      let imageSrcs = assets.map((asset) => asset.uri);
      console.log(imageSrcs);
      postDispatch({ type: "IMAGES", payload: imageSrcs });
      setImageOpen(false);
   };

   const cancelImage = () => {
      console.log("No permission, canceling image picker");
      setImageOpen(false);
   };

   const chooseVideo = (assets: any[]) => {
      let videoSrc = assets[0]["uri"];
      postDispatch({ type: "VIDEO", payload: videoSrc });
      console.log(videoSrc);
      setVideoOpen(false);
   };

   const cancelVideo = () => {
      console.log("No permission, canceling image picker");
      setImageOpen(false);
   };

   const onValueChangeContent = (v: string): void => {
      console.log("onValueChange", v);
      postDispatch({ type: "TEXT", payload: v });
   };

   const onValueChangeTitle = (v: string): void => {
      console.log("onValueChange", v);
      postDispatch({ type: "TITLE", payload: v });
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
         <Modal visible={videoOpen}>
            <ImagePicker
               onSave={chooseVideo}
               onCancel={cancelVideo}
               video
               timeSlider
               image={false}
            />
         </Modal>
         <View style={styles.formContainer}>
            <TextInput
               outlineStyle={{borderColor:"#f0f0f0"}}
               onChangeText={onValueChangeTitle}
               mode="outlined"
               label="Title"
            />

            <TextInput
               outlineStyle={{borderColor:"#f0f0f0"}}
               onChangeText={onValueChangeContent}
               mode="outlined"
               label="Content"
               multiline
               numberOfLines={5}
            />
            <Text
               style={{
                  textAlign: "center",
                  marginTop: 10,
                  fontFamily: "Poppins_300Light",
               }}>
               Choose Image or Video
            </Text>
            <View style={styles.buttonGroup}>
               <Button
                  style={styles.button}
                  mode="contained-tonal"
                  onPress={() => setImageOpen(true)}>
                  <AntDesign size={20} name="picture" />
               </Button>
               <Button
                  style={styles.button}
                  mode="contained-tonal"
                  onPress={() => setVideoOpen(true)}>
                  <AntDesign size={20} name="videocamera" />
               </Button>
            </View>

            <Button
               mode="contained"
               onPress={handlePost}
               disabled={loading}
               loading={loading}>
               Upload <AntDesign size={20} name="upload" />
            </Button>
         </View>
      </View>
   );
};

export default PostForm;

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
