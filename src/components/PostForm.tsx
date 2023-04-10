import { StyleSheet, Text, View,Alert } from "react-native";
import React, { useState, useEffect, useReducer, useMemo } from "react";
import { Button, TextInput, useTheme } from "react-native-paper";
import { MaterialIcons } from "@expo/vector-icons";
// import {
//    RichTextEditor,
//    RichTextViewer,
//    ActionMap,
//    ActionKey,
// } from "@siposdani87/expo-rich-text-editor";
import axios from "axios";
import { ImagePicker } from "expo-image-multiple-picker";

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
   const theme = useTheme();

   const handlePost = async () => {
      setLoading(true);
      let postObj = postState
      try{
        let response = await axios.post("http://192.168.242.183:5000/api/media/posts/",postObj)
        if(response.status === 201){
               console.log(response.data)
               setLoading(false)
               Alert.alert("Successful","Post successfully")
        }else{
            setLoading(false)
             Alert.alert("Failed","Post Faile")
        }
      }catch(err){
        setLoading(false)
        console.log(err)
      }
     

      console.log(postState);
   };

   const chooseImage = () => {};

   const onValueChangeContent = (v: string): void => {
      console.log("onValueChange", v);
      postDispatch({ type: "TEXT", payload: v });
   };

   const onValueChangeTitle = (v: string): void => {
      console.log("onValueChange", v);
      postDispatch({ type: "TITLE", payload: v });
   };

   return (
      <View>
         <TextInput
            onChangeText={onValueChangeTitle}
            mode="outlined"
            label="Title"
         />

          <TextInput
            onChangeText={onValueChangeContent}
            mode="outlined"
            label="Title"
         />
         {/* <TextInput mode='outlined' label='body'/> */}
         {/* <RichTextEditor
            minHeight={150}
            value={postState.text}
            selectionColor="green"
            // actionMap={getActionMap}
            onValueChange={onValueChangeConent}
            toolbarStyle={styles.toolbar}
            editorStyle={styles.editor}
         />
         <RichTextViewer
            value={postState.text}
            viewerStyle={styles.viewer}
            linkStyle={styles.link}
         /> */}
         <ImagePicker
            onSave={(assets) => console.log(assets)}
            onCancel={() => console.log("no permissions or user go back")}
            video
            timeSlider
            image={false}
         />

         <ImagePicker
            onSave={(assets) => console.log(assets)}
            onCancel={() => console.log("no permissions or user go back")}
            noAlbums
            limit={8}
            timeSlider
         />
         <Button onPress={chooseImage}>photo/video</Button>
         <Button onPress={handlePost} loading={loading}>
            Done
         </Button>
      </View>
   );
};

export default PostForm;

const styles = StyleSheet.create({
   viewer: {
      borderColor: "green",
      borderWidth: 1,
      padding: 5,
      // fontFamily: 'Oswald_400Regular',
   },
   editor: {
      borderColor: "blue",
      borderWidth: 1,
      padding: 5,
      // fontFamily: 'Inter_500Medium',
      fontSize: 18,
   },
   toolbar: {
      borderColor: "red",
      borderWidth: 1,
   },
   link: {
      color: "green",
   },
});
