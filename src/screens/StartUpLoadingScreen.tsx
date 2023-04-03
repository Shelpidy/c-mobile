import SVGAnimatedPath from "../components/SVGAnimatedPath";
import ExpoStatusBar from "expo-status-bar/build/ExpoStatusBar";
import { useEffect } from "react";
import { Dimensions, Text, View } from "react-native";
import { Easing, useSharedValue, withTiming } from "react-native-reanimated";
import { Svg } from "react-native-svg";
const StartUpLoadingScreen = () => {
   const progress = useSharedValue(0);
   const paths = [
      "M27.85 5.7H16.95V37H12.8V5.7H1.9V2H27.85V5.7Z",
      "M32.9844 2H52.0344V5.7H37.1344V17.15H50.7844V20.85H37.1344V33.3H52.2844V37H32.9844V2Z",
      "M66.091 14.1L63.391 9.05H63.191L63.691 14.1V37H59.791V1.45H61.991L78.741 24.8L81.341 29.6H81.591L81.041 24.8V2H84.941V37.55H82.741L66.091 14.1Z",
      "M99.9336 20.8H97.5836V37H93.4336V2H97.5836V18.3L99.8336 17.6L111.584 2H116.384L104.684 17.05L102.584 18.7L105.134 20.7L117.934 37H112.684L99.9336 20.8Z",
      "M124.901 2H129.051V37H124.901V2Z",
      "M138.502 2.35C139.769 2.05 141.135 1.85 142.602 1.75C144.069 1.65 145.519 1.6 146.952 1.6C148.485 1.6 150.035 1.75 151.602 2.05C153.202 2.35 154.652 2.9 155.952 3.7C157.252 4.5 158.302 5.6 159.102 7C159.935 8.4 160.352 10.1833 160.352 12.35C160.352 14.4833 159.969 16.2833 159.202 17.75C158.435 19.2167 157.419 20.4167 156.152 21.35C154.885 22.25 153.435 22.9 151.802 23.3C150.169 23.7 148.485 23.9 146.752 23.9C146.585 23.9 146.302 23.9 145.902 23.9C145.535 23.9 145.135 23.9 144.702 23.9C144.302 23.8667 143.902 23.8333 143.502 23.8C143.102 23.7667 142.819 23.7333 142.652 23.7V37H138.502V2.35ZM147.052 5.2C146.185 5.2 145.352 5.21666 144.552 5.25C143.752 5.28333 143.119 5.36666 142.652 5.5V20C142.819 20.0667 143.085 20.1167 143.452 20.15C143.819 20.15 144.202 20.1667 144.602 20.2C145.002 20.2 145.385 20.2 145.752 20.2C146.119 20.2 146.385 20.2 146.552 20.2C147.685 20.2 148.802 20.1 149.902 19.9C151.035 19.6667 152.052 19.2667 152.952 18.7C153.852 18.1333 154.569 17.3333 155.102 16.3C155.669 15.2667 155.952 13.95 155.952 12.35C155.952 10.9833 155.685 9.85 155.152 8.95C154.652 8.01666 153.969 7.28333 153.102 6.75C152.269 6.18333 151.319 5.78333 150.252 5.55C149.185 5.31666 148.119 5.2 147.052 5.2Z",
      "M179.908 27.3H167.008L163.508 37H159.408L172.658 1.45H174.558L187.858 37H183.508L179.908 27.3ZM168.358 23.7H178.658L174.758 13.05L173.508 7.75H173.458L172.208 13.15L168.358 23.7Z",
      "M196.788 23.1L185.238 2H190.088L198.288 17.3L199.138 20.35H199.188L200.088 17.2L207.938 2H212.388L200.938 23.05V37H196.788V23.1Z",
   ];

   useEffect(() => {
      progress.value = withTiming(1, { duration: 3000, easing: Easing.linear });
   }, [progress]);

   const { height } = Dimensions.get("window");
   return (
      <View
         style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            height: height,
         }}>
         <ExpoStatusBar backgroundColor="black" style="light"></ExpoStatusBar>
         <Svg width="215" height="39" viewBox="0 0 215 39" fill="none">
            {paths.map((path) => {
               return (
                  <SVGAnimatedPath key={path} progress={progress} d={path} />
               );
            })}
         </Svg>
         <Text style={{ opacity: 0.8, marginTop: 8 }}>LOADING...</Text>
      </View>
   );
};

export default StartUpLoadingScreen;
