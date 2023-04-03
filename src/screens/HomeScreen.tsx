import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { Button } from "react-native-paper";
// import { withTheme,Button,Theme } from "@rneui/themed";
// import { Theme, Button } from "@rneui/base";

type HomeScreenProps = {
   theme?: any;
   navigation: any;
};

const HomeScreen = ({ theme, navigation }: HomeScreenProps) => {
   return (
      <View style={styles.container}>
         <Button onPress={() => navigation.navigate("ProfileScreen")}>
            Profile
         </Button>
         <Button onPress={() => navigation.navigate("SettingsScreen")}>
            Settings
         </Button>
         <Text>HomeScreen</Text>
      </View>
   );
};

export default HomeScreen;

const styles = StyleSheet.create({
   container: {
      flex: 1,
      backgroundColor: "#fff",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "Poppins_300Light",
   },
});
