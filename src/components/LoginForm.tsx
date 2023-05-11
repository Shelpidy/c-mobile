import React, { useState } from "react";
import { Dimensions, StyleSheet, Text, View, Alert } from "react-native";
import { Button, TextInput, useTheme } from "react-native-paper";
import * as Device from "expo-device";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { usePushNotificationToken } from "../utils/CustomHooks";

type LoginFormProps = {
   navigation: any;
};

type LoginObject = {
   password: string;
   email: string;
   deviceId: any;
   deviceName: string | null;
   notificationToken: string;
};

const { width, height } = Dimensions.get("window");

const LoginForm = ({ navigation }: LoginFormProps) => {
   let theme = useTheme();
   const [showPassword, setShowPassword] = React.useState<boolean>(false);
   const [password, setPassword] = useState<string>("");
   const [email, setEmail] = useState<string>("");
   const notificationToken = usePushNotificationToken<string>();
   const [loading, setLoading] = useState<boolean>(false);

   const handleLogin = () => {
      let fetchData = async () => {
         try {
            setLoading(true);
            let loginObj: LoginObject = {
               password,
               email,
               deviceId: String(new Date().getMilliseconds()),
               deviceName: Device.deviceName,
               notificationToken,
            };

            let response = await fetch(
               `http://192.168.52.183:5000/api/auth/users/login/`,
               {
                  method: "POST",
                  body: JSON.stringify(loginObj),
                  headers: {
                     "Content-Type": "application/json",
                  },
               }
            );

            if (response.ok) {
               let data = await response.json();
               console.log("Login Token", data.token);
               try {
                  await AsyncStorage.setItem("loginToken", data.token);
                  console.log("Token set");
                  navigation.navigate("HomeStack", { screen: "HomeScreen" });
               } catch (err) {
                  console.log(err);
               }
            } else {
               // Handle non-success status codes
               let data = await response.json();
               console.log(data);
               if (response.status === 401) {
                  Alert.alert("Login Failed", data.message);
               } else {
                  Alert.alert("Login Failed", data.message);
               }
            }

            setLoading(false);
         } catch (err) {
            console.log(err);
            Alert.alert(
               "Login Failed",
               "Failed to login. Check your connection and try again."
            );
            setLoading(false);
         }
      };

      fetchData();
   };

   return (
      <View>
         <View style={styles.form}>
            <TextInput
               onChangeText={(v) => setEmail(v)}
               mode="outlined"
               style={styles.input}
               label="Email"
               // outlineColor="#f6f6f6"
               outlineStyle={{borderColor:"#f6f6f6"}}
              
               // inputMode="email"
               right={
                  <TextInput.Icon
                 
                     color={theme.colors.primary}
                     icon="email"></TextInput.Icon>
               }></TextInput>
            <TextInput
               outlineStyle={{borderColor:"#f6f6f6"}}
               onChangeText={(v) => setPassword(v)}
               mode="outlined"
               
               style={styles.input}
               label="Password"
               // inputMode="text"
               secureTextEntry={!showPassword}
               right={
                  <TextInput.Icon
                  color={theme.colors.secondary}
                     icon={showPassword ? "eye" : "eye-off"}
                     onPress={() =>
                        setShowPassword(!showPassword)
                     }></TextInput.Icon>
               }></TextInput>
            <Button
               loading={loading}
               disabled={loading}
               onPress={handleLogin}
               mode="contained"
               style={{ marginTop: 15 }}>
               LOGIN
            </Button>
         </View>
         <View style={styles.signinCon}>
            <Text style={{ fontFamily: "Poppins_300Light_Italic" }}>
               Don't have an account ?
            </Text>
            <Button
               onPress={() => navigation.navigate("RegistrationScreen")}
               mode="contained-tonal">
               Sign Up
            </Button>
         </View>
         <View style={styles.signinCon}>
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
      backgroundColor:"#f6f6f6"
   },
   signinCon: {
      flexDirection: "row",
      gap: 5,
      alignItems: "center",
      justifyContent: "center",
      marginTop: 15,
   },
});
