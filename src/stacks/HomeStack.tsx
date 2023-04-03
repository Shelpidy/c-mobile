import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ProfileScreen from "../screens/ProfileScreen";
import HomeScreen from "../screens/HomeScreen";
import SettingsScreen from "../screens/SettingsScreen";
import LoginScreen from "../screens/LoginScreen";
import RegistrationScreen from "../screens/RegistrationScreen";
import RegistrationEmailVerificationScreen from "../screens/RegistrationEmailVerificationScreen";
import CustomHeader from "../components/CustomHeader";

const Stack = createNativeStackNavigator();

const HomeStack = () => {
   return (
      <Stack.Navigator screenOptions={{ header: () => <CustomHeader /> }}>
         <Stack.Screen name="HomeScreen" component={HomeScreen}></Stack.Screen>
         <Stack.Screen
            name="LoginScreen"
            component={LoginScreen}></Stack.Screen>
         <Stack.Screen
            name="RegistrationScreen"
            component={RegistrationScreen}></Stack.Screen>
         <Stack.Screen
            name="RegistrationEmailVerificationScreen"
            component={RegistrationEmailVerificationScreen}></Stack.Screen>
         <Stack.Screen
            name="ProfileScreen"
            component={ProfileScreen}></Stack.Screen>
         <Stack.Screen
            name="SettingsScreen"
            component={SettingsScreen}></Stack.Screen>
      </Stack.Navigator>
   );
};

export default HomeStack;
