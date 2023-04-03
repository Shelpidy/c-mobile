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
import { Button, TextInput, useTheme } from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";

type Form4Props = {
   navigation: any;
   setActiveTab: (index: number) => void;
};

const { width, height } = Dimensions.get("window");

const Form4 = ({ navigation, setActiveTab }: Form4Props) => {
   let theme = useTheme();

   const submitForm4 = () => {
      console.log("Form 4 submitted");
      setActiveTab(4);
   };

   return (
      <View>
         <Image
            resizeMode="stretch"
            style={{
               width: width - 10,
               height: "40%",
               marginBottom: 0,
               paddingBottom: 0,
            }}
            source={require("../../../assets/Illustrators/signin.png")}></Image>
         <View style={styles.form}>
            <TextInput
               mode="outlined"
               style={styles.input}
               label="city"
               inputMode="text"></TextInput>
            <TextInput
               mode="outlined"
               style={styles.input}
               label="Permanent Adress"
               inputMode="text"></TextInput>
            <TextInput
               mode="outlined"
               style={styles.input}
               label="Current Address"
               inputMode="text"></TextInput>
            <Button
               mode="contained"
               onPress={submitForm4}
               style={{ marginTop: 15 }}>
               Continue{" "}
               <MaterialCommunityIcons
                  name="chevron-double-right"
                  color="white"></MaterialCommunityIcons>
            </Button>
         </View>
      </View>
   );
};

export default Form4;

const styles = StyleSheet.create({
   form: {
      paddingTop: 70,
   },
   input: {
      width: width - 60,
      marginBottom: 10,
      fontFamily: "Poppins_300Light",
   },
});
