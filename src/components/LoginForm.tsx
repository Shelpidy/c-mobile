import React from "react";
import {
   Dimensions,
   StyleSheet,
   Text,
   View
} from "react-native";
import { Button, TextInput, useTheme } from "react-native-paper";

type LoginFormProps = {
   navigation: any;
};

const { width, height } = Dimensions.get("window");

const LoginForm = ({ navigation }: LoginFormProps) => {
   let theme = useTheme();
   const [showPassword, setShowPassword] = React.useState<boolean>(false);

   const handleLogin =()=>{
      navigation.navigate("HomeStack",{screen:"HomeScreen"})
   }

   return (
      <View>
         <View style={styles.form}>
            <TextInput
               mode="outlined"
               style={styles.input}
               label="Email"
               inputMode="email"
               right={
                  <TextInput.Icon
                     color={theme.colors.primary}
                     icon="email"></TextInput.Icon>
               }></TextInput>
            <TextInput
               mode="outlined"
               style={styles.input}
               label="Password"
               inputMode="text"
               secureTextEntry={!showPassword}
               right={
                  <TextInput.Icon
                     icon={showPassword ? "eye" : "eye-off"}
                     onPress={() =>
                        setShowPassword(!showPassword)
                     }></TextInput.Icon>
               }></TextInput>
            <Button onPress={handleLogin} mode="contained" style={{ marginTop: 15 }}>
               LOGIN
            </Button>
         </View>
         <View
            style={{
               flexDirection: "row",
               marginTop: 15,
               gap: 5,
               alignItems: "center",
               justifyContent: "center",
            }}>
            <Text style={{ fontFamily: "Poppins_300Light_Italic" }}>
               Don't have an account ?
            </Text>
            <Button
               onPress={() => navigation.navigate("RegistrationScreen")}
               mode="contained-tonal">
               Sign Up
            </Button>
         </View>
         <View
            style={{
               flexDirection: "row",
               marginTop: 15,
               gap: 5,
               alignItems: "center",
               justifyContent: "center",
            }}>
            <Text style={{ fontFamily: "Poppins_300Light_Italic" }}>
               Forget Password ?
            </Text>
            <Button
               labelStyle={{ fontFamily: "Poppins_300Light" }}
               onPress={() => navigation.navigate("RegistrationScreen")}
               mode="text">
               Reset Password
            </Button>
         </View>
      </View>
   );
};

export default LoginForm;

const styles = StyleSheet.create({
   form: {
      padding: 0,
   },
   input: {
      width: width - 60,
      marginBottom: 10,
      fontFamily: "Poppins_300Light",
   },
});
