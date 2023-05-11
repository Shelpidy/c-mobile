import { Theme } from "@rneui/themed";
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

type Form7Props = {
   navigation: any;
   setActiveTab: (index: number) => void;
};

const { width, height } = Dimensions.get("window");

const Form7 = ({ navigation, setActiveTab }: Form7Props) => {
   let theme = useTheme();

   const submitForm7 = (n: number) => {
      console.log("Form 1 submitted");
      setActiveTab(n);
   };

   return (
      <View>
         <Image
            resizeMode="stretch"
            style={{
               width: width - 10,
               height: "40%",
               marginBottom: 0,
               marginTop: 12,
               paddingBottom: 0,
            }}
            source={require("../../../assets/Illustrators/ani-signup.gif")}></Image>
         <View style={styles.form}>
            <TextInput
              outlineStyle={{borderColor:"#f6f6f6"}}
               mode="outlined"
               style={styles.input}
               label="FirstName"
               inputMode="text"></TextInput>
          <TextInput
              outlineStyle={{borderColor:"#f6f6f6"}}
               mode="outlined"
               style={styles.input}
               label="MiddleName"
               inputMode="text"></TextInput>
            <TextInput
              outlineStyle={{borderColor:"#f6f6f6"}}
               mode="outlined"
               style={styles.input}
               label="LastName"
               inputMode="text"></TextInput>
            <View style={styles.buttonGroup}>
               <Button
                  mode="contained"
                  onPress={() => submitForm7(5)}
                  style={styles.button}>
                  <MaterialCommunityIcons
                     name="chevron-double-left"
                     color="white"></MaterialCommunityIcons>{" "}
                  BACK
               </Button>
               <Button
                  mode="contained"
                  onPress={() => submitForm7(7)}
                  style={styles.button}>
                  NEXT
                  <MaterialCommunityIcons
                     name="chevron-double-right"
                     color="white"></MaterialCommunityIcons>
               </Button>
            </View>
            <View
               style={{
                  flexDirection: "row",
                  gap: 5,
                  alignItems: "center",
                  justifyContent: "center",
                  marginTop: 20,
               }}></View>
         </View>
      </View>
   );
};

export default Form7;

const styles = StyleSheet.create({
   form: {
      paddingTop: 40,
      alignItems: "center",
   },
   input: {
      width: width - 60,
      marginBottom: 10,
      fontFamily: "Poppins_300Light",
   },
   button: {
      width: width / 2.5,
      marginTop: 10,
      fontFamily: "Poppins_300Light",
      backgroundColor:"#f9f9f9"
   },
   buttonGroup: {
      flexDirection: "row",
      gap: 10,
   },
});
