import { StyleSheet, Text, View, ScrollView } from "react-native";
import React from "react";
import PersonalInfoRegistrationForm from "../components/MediaPosts/RegistrationFormPersonal";
import { Button } from "react-native-paper";
import Form1 from "../components/RegistrationForms/RegForm1";
import PositionIndicator from "../components/PositionIndicator";
import Form2 from "../components/RegistrationForms/RegForm2";
import Form3 from "../components/RegistrationForms/RegForm3";
import Form4 from "../components/RegistrationForms/Regform4";
import Form7 from "../components/RegistrationForms/RegForm7";
import Form8 from "../components/RegistrationForms/RegForm8";
import PhoneNumberForm from "../components/RegistrationForms/PhoneNumberForm";

// import { ScrollView } from "react-native-gesture-handler";

type RegistrationScreenProps = {
   navigation: any;
};

const RegistrationScreen = (props: RegistrationScreenProps) => {
   const [activeFormPosition, setActiveFormPosition] = React.useState(0);
   return (
      <View style={styles.container}>
         <View>
            <PositionIndicator
               position={activeFormPosition}
               numberOfPosition={8}
            />
         </View>
         {activeFormPosition === 0 && (
            <Form1 setActiveTab={setActiveFormPosition} {...props} />
         )}
         {activeFormPosition === 1 && (
            <Form2 setActiveTab={setActiveFormPosition} {...props} />
         )}
         {activeFormPosition === 2 && (
            <Form3 setActiveTab={setActiveFormPosition} {...props} />
         )}
         {activeFormPosition === 3 && (
            <PhoneNumberForm
               formPosition={4}
               logo="../../../assets/Illustrators/siginin.png"
               setActiveTab={setActiveFormPosition}
               {...props}
            />
         )}
         {activeFormPosition === 4 && (
            <PhoneNumberForm
               formPosition={5}
               logo="siginin.png"
               setActiveTab={setActiveFormPosition}
               {...props}
            />
         )}
         {activeFormPosition === 5 && (
            <PhoneNumberForm
               formPosition={6}
               logo="siginin.png"
               setActiveTab={setActiveFormPosition}
               {...props}
            />
         )}
         {activeFormPosition === 6 && (
            <Form7 setActiveTab={setActiveFormPosition} {...props} />
         )}
         {activeFormPosition === 7 && (
            <Form8 setActiveTab={setActiveFormPosition} {...props} />
         )}
      </View>
   );
};

export default RegistrationScreen;

const styles = StyleSheet.create({
   container: {
      flex: 1,
      backgroundColor: "#fff",
      alignItems: "center",
      top: 70,
      //   justifyContent: "center",
      fontFamily: "Poppins_300Light",
   },
});
