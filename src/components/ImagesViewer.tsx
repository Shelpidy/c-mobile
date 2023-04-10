import { StyleSheet, Text, View, Image, ActivityIndicator } from "react-native";
import React, { useEffect, useState } from "react";

type ImageViewerProps = {
   images: any;
};

const ImagesViewer: any = ({ images }: ImageViewerProps) => {
   const [postImages,setPostImages] = useState<any>(null)

   useEffect(()=>{
       setPostImages(images)
       console.log(images)
   },[])

   if(!postImages){
      return (<View><ActivityIndicator/></View>)
   }
   return (
      <View>
         <Image
            resizeMode="stretch"
            style={styles.image}
            source={{ uri:JSON.parse(postImages)[0]}}
         />
      </View>
   );
};

export default ImagesViewer;

const styles = StyleSheet.create({
   image: {
      width: "100%",
      height:380,
      marginBottom: 5,
      borderRadius: 2,
   },
});
