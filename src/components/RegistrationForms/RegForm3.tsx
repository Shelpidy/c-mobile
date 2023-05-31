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
import {
   Button,
   Checkbox,
   IconButton,
   TextInput,
   useTheme,
} from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import DateTimePickerModal from "react-native-modal-datetime-picker";

type Form3Props = {
   navigation: any;
   setActiveTab: (index: number) => void;
};

const { width, height } = Dimensions.get("window");

const Form3 = ({ navigation, setActiveTab }: Form3Props) => {
   let theme = useTheme();
   const [isDatePickerVisible, setDatePickerVisibility] =
      React.useState<boolean>(false);

   const showDatePicker = () => {
      setDatePickerVisibility(true);
   };

   const hideDatePicker = () => {
      setDatePickerVisibility(false);
   };

   const handleConfirm = (date: any) => {
      // let dob = date.split('T')[0]
      console.log("A date  of birth has been picked: ", date);
      hideDatePicker();
   };

   const submitForm3 = (n: number) => {
      console.log("Form 1 submitted");
      setActiveTab(n);
   };

   return (
      <View>
         <Image
            resizeMode="stretch"
            style={{
               width: width - 10,
               height: "50%",
               marginBottom: 0,
               marginTop: 12,
               paddingBottom: 0,
            }}
            source={require("../../../assets/Illustrators/ani-signup.gif")}></Image>
         <View style={styles.form}>
            <View style={styles.checkBoxGroup}>
               <View style={styles.checkBoxGroupInner}>
                  <Text
                     style={{
                        fontFamily: "Poppins_500Medium",
                        color: theme.colors.primary,
                     }}>
                     Gender :
                  </Text>
               </View>

               <View style={styles.checkBoxGroupInner}>
                  <Text style={{ fontFamily: "Poppins_300Light" }}>Male</Text>
                  <Checkbox status="checked"></Checkbox>
               </View>
               <View style={styles.checkBoxGroupInner}>
                  <Text style={{ fontFamily: "Poppins_300Light" }}>Female</Text>
                  <Checkbox status="unchecked"></Checkbox>
               </View>
            </View>
            <View>
               <Button
                  labelStyle={{ fontFamily: "Poppins_300Light" }}
                  style={styles.dobButton}
                  mode="contained-tonal"
                  onPress={showDatePicker}>
                  <MaterialCommunityIcons
                     name="calendar-outline"
                     size={18}></MaterialCommunityIcons>{" "}
                  Choose Date of Birth{" "}
               </Button>
               <DateTimePickerModal
                  //  style={{backgroundColor:theme.colors.primary}}
                  isVisible={isDatePickerVisible}
                  mode="date"
                  onConfirm={handleConfirm}
                  onCancel={hideDatePicker}
               />
            </View>

            <TextInput
               outlineStyle={{ borderColor: "#f6f6f6" }}
               mode="outlined"
               style={styles.input}
               label="Email"
               inputMode="email"
               right={
                  <TextInput.Icon
                     color={theme.colors.primary}
                     icon="email"></TextInput.Icon>
               }></TextInput>
            <View style={styles.buttonGroup}>
               <Button
                  mode="contained"
                  onPress={() => submitForm3(1)}
                  style={styles.button}>
                  {/* <MaterialCommunityIcons
                     name="chevron-double-left"
                     color="white"></MaterialCommunityIcons>{" "} */}
                  BACK
               </Button>
               <Button
                  mode="contained"
                  onPress={() => submitForm3(3)}
                  style={styles.button}>
                  NEXT{" "}
                  {/* <MaterialCommunityIcons
                     name="chevron-double-right"
                     color="white"></MaterialCommunityIcons> */}
               </Button>
            </View>
         </View>
      </View>
   );
};

export default Form3;

const styles = StyleSheet.create({
   form: {
      paddingTop: 0,
      alignItems: "center",
   },
   input: {
      width: width - 60,
      marginBottom: 10,
      fontFamily: "Poppins_300Light",
      backgroundColor: "#f6f6f6",
   },
   button: {
      width: width / 3,
      marginTop: 10,
      fontFamily: "Poppins_300Light",
   },
   dobButton: {
      width: width - 60,
      marginTop: 10,
      fontFamily: "Poppins_300Light",
      marginVertical: 10,
      backgroundColor: "#f6f6f6",
   },

   buttonGroup: {
      flexDirection: "row",
      gap: 10,
   },
   checkBoxGroup: {
      flexDirection: "row",
      justifyContent: "flex-start",
      alignItems: "center",
      left: 0,
      gap: 20,
   },
   checkBoxGroupInner: {
      display: "flex",
      flexDirection: "row",
      justifyContent: "flex-start",
      alignItems: "center",
      gap: 0,
      margin: 10,
   },
});