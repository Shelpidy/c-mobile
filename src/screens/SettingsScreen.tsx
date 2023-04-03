import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { withTheme, Button, Theme } from "@rneui/themed";

type SettingsScreenProps = {
   theme?: Theme;
   navigation: any;
};

const SettingsScreen = ({ theme, navigation }: SettingsScreenProps) => {
   return (
      <View style={styles.container}>
         <Button
            onPress={() => navigation.navigate("HomeScreen")}
            title="Home"></Button>
         <Button
            onPress={() => navigation.navigate("ProfileScreen")}
            title="Profile"></Button>
         <Text>SettingsScreen</Text>
      </View>
   );
};

export default SettingsScreen;

const styles = StyleSheet.create({
   container: {
      flex: 1,
      backgroundColor: "#fff",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "Poppins_300Light",
   },
});
