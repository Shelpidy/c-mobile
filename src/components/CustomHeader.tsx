import { useNavigation } from "@react-navigation/native";
import { Button } from "@rneui/themed";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

const CustomHeader = () => {
   let navigation = useNavigation();
   return (
      <View>
         {navigation.canGoBack() && (
            <Button onPress={() => navigation.goBack()} title="Back"></Button>
         )}
         <Text>Custom Header</Text>
      </View>
   );
};

export default CustomHeader;

const styles = StyleSheet.create({});
