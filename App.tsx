import "react-native-gesture-handler";
import { StatusBar } from "expo-status-bar";
import { View, Text, LogBox } from "react-native";
import {
   NavigationContainer,
   // adaptNavigationTheme,
   DarkTheme as NavigationDarkTheme,
   DefaultTheme as NavigationDefaultTheme,
} from "@react-navigation/native";
import {
   MD3Colors,
   MD3DarkTheme,
   MD3LightTheme,
   adaptNavigationTheme,
   useTheme,
} from "react-native-paper";
import merge from "deepmerge";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import {
   Provider as PaperProvider,
   MD3LightTheme as DefaultTheme,
} from "react-native-paper";
import React from "react";
import {
   useFonts,
   Poppins_100Thin,
   Poppins_100Thin_Italic,
   Poppins_200ExtraLight,
   Poppins_200ExtraLight_Italic,
   Poppins_300Light,
   Poppins_300Light_Italic,
   Poppins_400Regular,
   Poppins_400Regular_Italic,
   Poppins_500Medium,
   Poppins_500Medium_Italic,
   Poppins_600SemiBold,
   Poppins_600SemiBold_Italic,
   Poppins_700Bold,
   Poppins_700Bold_Italic,
   Poppins_800ExtraBold,
   Poppins_800ExtraBold_Italic,
   Poppins_900Black,
   Poppins_900Black_Italic,
} from "@expo-google-fonts/poppins";
import HomeStack from "./src/stacks/HomeStack";
import AuthStack from "./src/stacks/AuthStack";
import StartUpLoadingScreen from "./src/screens/StartUpLoadingScreen";

// 192.168.0.102

const MainStack = createNativeStackNavigator();

const { LightTheme, DarkTheme } = adaptNavigationTheme({
   reactNavigationLight: NavigationDefaultTheme,
   reactNavigationDark: NavigationDarkTheme,
});

const CombinedDefaultTheme = merge(MD3LightTheme, LightTheme);
const CombinedDarkTheme = merge(MD3DarkTheme, DarkTheme);

const theme = {
   ...CombinedDefaultTheme,
   // ...CombinedDarkTheme,
};

function LayoutContainer() {
   let newTheme = useTheme();
   return (
      <NavigationContainer theme={theme}>
         <StatusBar
            backgroundColor={newTheme.colors.primary}
            style="light"></StatusBar>
         <MainStack.Navigator screenOptions={{ headerShown: false }}>
            <MainStack.Screen
               name="AuthStack"
               component={AuthStack}></MainStack.Screen>
            <MainStack.Screen
               name="HomeStack"
               component={HomeStack}></MainStack.Screen>
         </MainStack.Navigator>
      </NavigationContainer>
   );
}

//////////////////////////////// MAIN APP//////////////////////////

export default function App() {
   const [loading, setLoading] = React.useState(true);
   LogBox.ignoreAllLogs();
   let [fontsLoaded] = useFonts({
      Poppins_100Thin,
      Poppins_100Thin_Italic,
      Poppins_200ExtraLight,
      Poppins_200ExtraLight_Italic,
      Poppins_300Light,
      Poppins_300Light_Italic,
      Poppins_400Regular,
      Poppins_400Regular_Italic,
      Poppins_500Medium,
      Poppins_500Medium_Italic,
      Poppins_600SemiBold,
      Poppins_600SemiBold_Italic,
      Poppins_700Bold,
      Poppins_700Bold_Italic,
      Poppins_800ExtraBold,
      Poppins_800ExtraBold_Italic,
      Poppins_900Black,
      Poppins_900Black_Italic,
   });

   React.useEffect(() => {
      setTimeout(() => {
         setLoading(false);
      }, 4000);
   }, []);

   if (loading) {
      return <StartUpLoadingScreen />;
   }
   return (
      <PaperProvider theme={CombinedDefaultTheme}>
         <LayoutContainer />
      </PaperProvider>
   );
}
