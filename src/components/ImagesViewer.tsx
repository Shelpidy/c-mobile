import { StyleSheet, Text, View, Image } from "react-native";
import React from "react";

type ImageViewerProps = {
   images: string[];
};

const ImagesViewer: any = ({ images }: ImageViewerProps) => {
   return (
      <View>
         <Image
            resizeMode="stretch"
            style={styles.image}
            source={{ uri: images[0] }}
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
