import React from "react";
import {
   Dimensions,
   KeyboardAvoidingView,
   Image,
   StyleSheet,
   Text,
   View,
} from "react-native";
import { Button, IconButton, TextInput, useTheme } from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";

type Form2Props = {
   navigation: any;
   setActiveTab: (index: number) => void;
};

const { width, height } = Dimensions.get("window");

const Form2 = ({ navigation, setActiveTab }: Form2Props) => {
   let theme = useTheme();
   const [showPassword, setShowPassword] = React.useState<boolean>(false);
   const [showConPassword, setShowConPassword] = React.useState<boolean>(false);
   const [showPincode, setShowPincode] = React.useState<boolean>(false);
   const [showConPincode, setShowConPincode] = React.useState<boolean>(false);

   const submitForm2 = (n: number) => {
      console.log("Form 2 submitted");
      setActiveTab(n);
   };

   return (
      <KeyboardAvoidingView>
         <Image
            resizeMode="stretch"
            style={{
               width: width - 10,
               height: "44%",
               marginBottom: 0,
               marginTop: 12,
               paddingBottom: 0,
            }}
            source={require("../../../assets/Illustrators/ani-signup.gif")}></Image>
         <View style={styles.form}>
            <TextInput
               mode="outlined"
               style={styles.input}
               label="Password"
               // inputMode="text"
               secureTextEntry={!showPassword}
               right={
                  <TextInput.Icon
                     icon={showPassword ? "eye" : "eye-off"}
                     onPress={() =>
                        setShowPassword(!showPassword)
                     }></TextInput.Icon>
               }></TextInput>
            <TextInput
               mode="outlined"
               style={styles.input}
               label="Confirm Password"
               // inputMode="text"
               secureTextEntry={!showConPassword}
               right={
                  <TextInput.Icon
                     icon={showConPassword ? "eye" : "eye-off"}
                     onPress={() =>
                        setShowConPassword(!showConPassword)
                     }></TextInput.Icon>
               }></TextInput>
            <TextInput
               mode="outlined"
               style={styles.input}
               label="Pincode"
               // inputMode="text"
               secureTextEntry={!showPincode}
               right={
                  <TextInput.Icon
                     icon={showPincode ? "eye" : "eye-off"}
                     onPress={() =>
                        setShowPincode(!showPincode)
                     }></TextInput.Icon>
               }></TextInput>
            <TextInput
               mode="outlined"
               style={styles.input}
               label="Confirm Pincode"
               // inputMode="text"
               secureTextEntry={!showConPincode}
               right={
                  <TextInput.Icon
                     icon={showConPincode ? "eye" : "eye-off"}
                     onPress={() =>
                        setShowConPincode(!showConPincode)
                     }></TextInput.Icon>
               }></TextInput>
            <View style={styles.buttonGroup}>
               <Button
                  mode="contained"
                  onPress={() => submitForm2(0)}
                  style={styles.button}>
                  <MaterialCommunityIcons
                     name="chevron-double-left"
                     color="white"></MaterialCommunityIcons>{" "}
                  BACK
               </Button>
               <Button
                  mode="contained"
                  onPress={() => submitForm2(2)}
                  style={styles.button}>
                  NEXT{" "}
                  <MaterialCommunityIcons
                     name="chevron-double-right"
                     color="white"></MaterialCommunityIcons>
               </Button>
            </View>
         </View>
      </KeyboardAvoidingView>
   );
};

export default Form2;

const styles = StyleSheet.create({
   form: {
      paddingTop: 15,
      alignItems: "center",
   },
   input: {
      width: width - 60,
      marginBottom: 10,
      fontFamily: "Poppins_300Light",
   },
   button: {
      width: width / 3,
      marginTop: 10,
      fontFamily: "Poppins_300Light",
   },
   buttonGroup: {
      flexDirection: "row",
      gap: 10,
   },
});
