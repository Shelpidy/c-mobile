// import { StyleSheet, Text, View,Alert,Modal} from "react-native";
// import React, { useState, useEffect, useReducer, useMemo } from "react";
// import { Button,TextInput, useTheme } from "react-native-paper";
// import { AntDesign, MaterialIcons } from "@expo/vector-icons";
// // import {
// //    RichTextEditor,
// //    RichTextViewer,
// //    ActionMap,
// //    ActionKey,
// // } from "@siposdani87/expo-rich-text-editor";
// import axios from "axios";
// import { ImagePicker } from "expo-image-multiple-picker";

// type ReducerProduct = Partial<Omit<Product, "id" | "updatedAt" | "createdAt">>;

// const initialState = {};

// const productReducer = (state: ReducerProduct = initialState, action: Action) => {
//    switch (action.type) {
//       case "TEXT":
//          return { ...state, text: action.payload };
//       case "TITLE":
//          return {
//             ...state,
//             title: action.payload,
//          };
//       case "VIDEO":
//          return { ...state, video: action.payload };
//       case "IMAGES":
//          return { ...state, images: action.payload };
//       case "ID":
//          return { ...state, id: action.payload };
//       case "USERID":
//          return { ...state, userId: action.payload };
//       default:
//          return state;
//    }
// };

// type ProductProps = Product & { navigation: any };

// const UpdateProductForm = (product:ProductProps) => {
//    const [loading, setLoading] = useState<boolean>(false);
//    const [productState, productDispatch] = useReducer(productReducer, initialState);
//    const [imageOpen, setImageOpen] = useState(false)
//    const [videoOpen, setVideoOpen] = useState(false)
//    // const [album, setAlbum] = useState<Album | undefined>()
//    // const [assets, setAssets] = useState<Asset[]>([])
//    const theme = useTheme();

//    useEffect(()=>{
//     // productDispatch({type:"TEXT",payload:product.text})
//     // productDispatch({type:"TITLE",payload:product.title})
//     // productDispatch({type:"TITLE",payload:product.title})
//     // productDispatch({type:"IMAGES",payload:product.images})
//     // productDispatch({type:"ID",payload:product.id})
//     // productDispatch({type:"USERID",payload:product.userId})
//    },[])

//    const handleUpdate = async () => {
//       setLoading(true);
//       let activeUserId = 1
//       let postObj = {...productState}
//       try{
//         let response = await axios.put("http://192.168.2.183:5000/api/media/posts/",postObj)
//         if(response.status === 202){
//                console.log(response.data)
//                setLoading(false)
//                Alert.alert("Successful","Update successfully.")
//         }else{
//             setLoading(false)
//              Alert.alert("Failed","Post Faile")
//         }
//       }catch(err){
//         setLoading(false)
//         console.log(err)
//       }

//       // console.log(postState);
//    };

//    const chooseImage = (assets:any[]) => {
//       let imageSrcs = assets.map(asset => asset.uri)
//       console.log(imageSrcs)
//       postDispatch({type:"IMAGES",payload:imageSrcs})
//       setImageOpen(false)
//    };

//    const cancelImage = () => {
//       console.log("No permission, canceling image picker")
//       setImageOpen(false)
//    };

//     const chooseVideo = (assets:any[]) => {
//       let videoSrc = assets[0]['uri']
//       postDispatch({type:"VIDEO",payload:videoSrc})
//       console.log(videoSrc)
//       setVideoOpen(false)
//    };

//    const cancelVideo = () => {
//       console.log("No permission, canceling image picker")
//       setImageOpen(false)
//    };

//    const onValueChangeContent = (v: string): void => {
//       console.log("onValueChange", v);
//       postDispatch({ type: "TEXT", payload: v });
//    };

//    const onValueChangeTitle = (v: string): void => {
//       console.log("onValueChange", v);
//       postDispatch({ type: "TITLE", payload: v });
//    };

//    return (
//       <View style={{borderRadius:3,margin:8,backgroundColor:"#ffffff"}}>
//          <Modal visible={imageOpen}>
//             <ImagePicker
//             onSave={chooseImage}
//             onCancel={cancelImage}
//             multiple
//             limit={8}
//          />

//          </Modal>
//           <Modal visible={videoOpen}>
//          <ImagePicker
//             onSave={chooseVideo}
//             onCancel={cancelVideo}
//             video
//             timeSlider
//             image={false}
//          />
//          </Modal>
//          <View style={styles.formContainer}>
//                  <Text style={{textAlign:"center",marginBottom:4,fontFamily:"Poppins_500Medium"}}>Update Post</Text>
//                 <TextInput
//             onChangeText={onValueChangeTitle}
//             mode="outlined"
//             label="Title"
//             value={postState.title}

//          />

//           <TextInput
//             onChangeText={onValueChangeContent}
//             mode="outlined"
//             label="Content"
//             multiline
//             numberOfLines={5}
//             value={postState.text}
//          />
//          <Text style={{textAlign:"center",marginTop:10,fontFamily:"Poppins_300Light"}}>Choose Image or Video</Text>
//          <View style={styles.buttonGroup}>

//            <Button style={styles.button} mode='contained-tonal' onPress={()=>setImageOpen(true)}><AntDesign size={20} name="picture" /></Button>
//            <Button style={styles.button} mode='contained-tonal' onPress={()=>setVideoOpen(true)}><AntDesign size={20} name='videocamera' /></Button>
//          </View>

//          <Button mode='contained' onPress={handleUpdate} disabled={loading} loading={loading}>
//             Update <AntDesign size={20} name="upload" />
//          </Button>
//          </View>

//       </View>
//    );
// };

// export default UpdateProductForm;

// const styles = StyleSheet.create({
//  formContainer:{
//    padding:15,
//    gap:5
//  },
//  buttonGroup:{
//    flexDirection:"row",
//    justifyContent:"space-evenly",
//    marginVertical:10
//  },
//  button:{
//    flex:1,
//    marginHorizontal:3
//  }
// });
