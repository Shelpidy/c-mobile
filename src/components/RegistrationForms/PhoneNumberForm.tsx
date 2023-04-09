import React from "react";
import { Dimensions, Image, Modal, StyleSheet, Text, View } from "react-native";
import { CountdownCircleTimer } from "react-native-countdown-circle-timer";
import { Button, useTheme } from "react-native-paper";
import PhoneInput from "react-native-phone-number-input";
import OTPTextInput from "../OTPTextInput";

type PhoneNumberFormProps = {
   navigation: any;
   logo: string;
   formPosition: number;
   setActiveTab: (index: number) => void;
};

const { width } = Dimensions.get("window");

const PhoneNumberForm = ({
   navigation,
   setActiveTab,
   logo,
   formPosition,
}: PhoneNumberFormProps) => {
   const [phoneNumber, setPhoneNumber] = React.useState<string>("");
   const [country, setCountry] = React.useState<any>("");
   const [modalVisibility, setModalVisibility] = React.useState<boolean>(false);
   const [resetTimer, setResetTimer] = React.useState<any>("0");
   const theme = useTheme();
   const submitPhoneNumber = (n: number) => {
      console.log("Phone number is=> ", phoneNumber);
      setActiveTab(n);
      if (n === formPosition + 1) {
         setActiveTab(formPosition);
      }
   };

   return (
      <View>
         <Modal visible={modalVisibility}>
            <View
               style={{
                  backgroundColor: "#00000088",
                  zIndex: 10,
                  flex: 1,
                  justifyContent: "center",
               }}>
               <View
                  style={{
                     backgroundColor: "white",
                     marginHorizontal: 10,
                     borderRadius: 5,
                     paddingVertical: 15,
                     paddingHorizontal: 5,
                     alignItems: "center",
                  }}>
                  <Text
                     style={{
                        fontFamily: "Poppins_300Light",
                        paddingHorizontal: 10,
                        color: theme.colors.secondary,
                     }}>
                     Lorem, ipsum dolor sit amet consectetur adipisicing elit.
                     Ipsa, tenetur! Voluptas fuga similique fugiat illo nobis ad
                     eveniet repellat, dignissimos aliquam deserunt, vero
                     dolorem voluptatum dolores, qui nulla neque voluptatem.
                  </Text>
                  <CountdownCircleTimer
                     isPlaying
                     duration={90}
                     size={50}
                     strokeWidth={5}
                     colors={["#2047AA", "#FF0023"]}
                     colorsTime={[60, 0]}>
                     {({ remainingTime }) => (
                        <Text style={{ fontFamily: "Poppins_300Light" }}>
                           {remainingTime}
                        </Text>
                     )}
                  </CountdownCircleTimer>
                  <OTPTextInput numberOfInput={5} size={45} />

                  <Button mode="text" style={{ marginVertical: 13 }}>
                     RESEND
                  </Button>

                  <View style={[styles.buttonGroup, { marginVertical: 10 }]}>
                     <Button
                        style={styles.mbutton}
                        mode="contained-tonal"
                        onPress={() => setModalVisibility(false)}>
                        cancel
                     </Button>
                     <Button
                        style={styles.mbutton}
                        mode="contained"
                        onPress={() => submitPhoneNumber(formPosition)}>
                        Continue
                     </Button>
                  </View>
               </View>
            </View>
         </Modal>
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
         <Text
            style={{
               fontFamily: "Poppins_300Light",
               textAlign: "auto",
               marginVertical: 0,
               marginHorizontal: 18,
               color: theme.colors.secondary,
            }}>
            If you are a Sierra Leonean, the three consecutive forms provided
            denote three tele-communication comapnies in Sierra leone - one for
            each. Each company's phone number will be used for that company's
            money transfer service- eg Orange Money, Africell Money, and Q
            Money.
         </Text>
         <View style={styles.form}>
            <PhoneInput
               containerStyle={styles.input}
               onChangeCountry={(country) => setCountry(country.name)}
               onChangeFormattedText={(text) => setPhoneNumber(text)}
               defaultCode="SL"
               textInputProps={{
                  placeholder: "Enter Phonenumber",
               }}></PhoneInput>

            <View style={styles.buttonGroup}>
               <Button
                  mode="contained"
                  onPress={() => submitPhoneNumber(formPosition - 2)}
                  style={styles.button}>
                  BACK
               </Button>
               {formPosition > 4 && (
                  <Button
                     mode="contained-tonal"
                     onPress={() => submitPhoneNumber(formPosition + 1)}
                     style={styles.button}>
                     SKIP
                  </Button>
               )}

               <Button
                  mode="contained"
                  onPress={() => setModalVisibility(true)}
                  style={styles.button}>
                  NEXT
               </Button>
            </View>
         </View>
      </View>
   );
};

export default PhoneNumberForm;

const styles = StyleSheet.create({
   form: {
      paddingTop: 10,
      alignItems: "center",
   },
   input: {
      width: width - 60,
      marginBottom: 10,
      fontFamily: "Poppins_300Light",
   },
   button: {
      width: width / 3.6,
      marginTop: 10,
      fontFamily: "Poppins_300Light",
   },
   mbutton: {
      width: width / 2.6,
      fontFamily: "Poppins_300Light",
   },
   buttonGroup: {
      flexDirection: "row",
      gap: 10,
   },
});
