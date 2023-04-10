import { StyleSheet, Text, View, Image } from "react-native";
import React from "react";

type ImageViewerProps = {
   images: any;
};

const ImagesViewer: any = ({ images }: ImageViewerProps) => {
   console.log(JSON.parse(images)[0])
   return (
      <View>
         <Image
            resizeMode="stretch"
            style={styles.image}
            source={{ uri: JSON.parse(images)[0] }}
         />
      </View>
   );
};

export default ImagesViewer;

const styles = StyleSheet.create({
   image: {
      width: "100%",
      height: 300,
      marginBottom: 5,
      borderRadius: 2,
   },
});
