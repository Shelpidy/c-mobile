import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { withTheme, Button, Theme } from "@rneui/themed";

type ProfileScreenProps = {
   theme?: Theme;
   navigation: any;
};

const ProfileScreen = ({ theme, navigation }: ProfileScreenProps) => {
   return (
      <View style={styles.container}>
         <Button
            onPress={() => navigation.navigate("HomeScreen")}
            title="Home"></Button>
         <Button
            onPress={() => navigation.navigate("SettingsScreen")}
            title="Settings"></Button>
         <Text>ProfileScreen</Text>
      </View>
   );
};

export default ProfileScreen;

const styles = StyleSheet.create({
   container: {
      flex: 1,
      backgroundColor: "#fff",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "Poppins_300Light",
   },
});
