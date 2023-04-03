import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { withTheme, Button, Theme } from "@rneui/themed";

type RegistrationEmailVerificationScreenProps = {
   theme?: Theme;
   navigation: any;
};

const RegistrationEmailVerificationScreen = ({
   theme,
   navigation,
}: RegistrationEmailVerificationScreenProps) => {
   return (
      <View style={styles.container}>
         <Button
            onPress={() => navigation.navigate("LoginScreen")}
            title="Login"></Button>
         <Button
            onPress={() => navigation.navigate("RegistrationScreen")}
            title="Register"></Button>
         <Button
            onPress={() =>
               navigation.navigate("HomeStack", { screen: "HomeScreen" })
            }
            title="Home"></Button>
         <Text>RegistrationEmailVerificationScreen</Text>
      </View>
   );
};

export default RegistrationEmailVerificationScreen;

const styles = StyleSheet.create({
   container: {
      flex: 1,
      backgroundColor: "#fff",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "Poppins_300Light",
   },
});
