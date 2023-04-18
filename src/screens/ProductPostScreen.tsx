import { ScrollView, StyleSheet, Text, View } from "react-native";
import React from "react";
import PostForm from "../components/MediaPosts/PostForm";

const ProductPostScreen = () => {
   return (
      <ScrollView style={styles.container}>
         {/* <Text>ProductPostScreen</Text> */}
         <PostForm />
      </ScrollView>
   );
};

export default ProductPostScreen;

const styles = StyleSheet.create({
   container: {
      backgroundColor: "#ffffff",
      flex: 1,
   },
});
