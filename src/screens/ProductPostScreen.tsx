import { ScrollView, StyleSheet, Text, View } from "react-native";
import React from "react";
import ProductForm from "../components/Marketing/ProductForm";

const ProductPostScreen = () => {
   return (
      <ScrollView style={styles.container}>
         {/* <Text>ProductPostScreen</Text> */}
         <ProductForm />
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
