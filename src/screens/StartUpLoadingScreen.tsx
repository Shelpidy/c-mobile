import SVGAnimatedPath from "../components/SVGAnimatedPath";
import ExpoStatusBar from "expo-status-bar/build/ExpoStatusBar";
import { useEffect } from "react";
import { Dimensions, Text, View } from "react-native";
import { useTheme } from "react-native-paper";
import { Easing, useSharedValue, withTiming } from "react-native-reanimated";
import { Svg } from "react-native-svg";

const StartUpLoadingScreen = () => {
   const theme = useTheme();
   const progress = useSharedValue(0);
   const paths = [
      "M1.27979 15.84C1.27979 13.0667 1.85312 10.6 2.99979 8.43999C4.17312 6.25332 5.82645 4.55999 7.95979 3.35999C10.0931 2.13332 12.5465 1.51999 15.3198 1.51999C18.8398 1.51999 21.7998 2.46665 24.1998 4.35999C26.5998 6.22665 28.1465 8.77332 28.8398 12H20.3998C19.8931 10.9333 19.1865 10.12 18.2798 9.55998C17.3998 8.99999 16.3731 8.71999 15.1998 8.71999C13.3865 8.71999 11.9331 9.37332 10.8398 10.68C9.77312 11.96 9.23978 13.68 9.23978 15.84C9.23978 18.0267 9.77312 19.7733 10.8398 21.08C11.9331 22.36 13.3865 23 15.1998 23C16.3731 23 17.3998 22.72 18.2798 22.16C19.1865 21.6 19.8931 20.7867 20.3998 19.72H28.8398C28.1465 22.9467 26.5998 25.5067 24.1998 27.4C21.7998 29.2667 18.8398 30.2 15.3198 30.2C12.5465 30.2 10.0931 29.6 7.95979 28.4C5.82645 27.1733 4.17312 25.48 2.99979 23.32C1.85312 21.1333 1.27979 18.64 1.27979 15.84Z",
      "M46.0723 30.28C43.4323 30.28 41.0056 29.6667 38.7923 28.44C36.579 27.1867 34.819 25.4667 33.5123 23.28C32.2323 21.0667 31.5923 18.5733 31.5923 15.8C31.5923 13.0267 32.2323 10.5467 33.5123 8.35999C34.819 6.14665 36.579 4.42665 38.7923 3.19999C41.0056 1.97332 43.4323 1.35999 46.0723 1.35999C48.739 1.35999 51.1656 1.97332 53.3523 3.19999C55.5656 4.42665 57.3123 6.14665 58.5923 8.35999C59.8723 10.5467 60.5123 13.0267 60.5123 15.8C60.5123 18.5733 59.8723 21.0667 58.5923 23.28C57.3123 25.4667 55.5656 27.1867 53.3523 28.44C51.139 29.6667 48.7123 30.28 46.0723 30.28ZM46.0723 23C48.0723 23 49.6456 22.3467 50.7923 21.04C51.9656 19.7333 52.5523 17.9867 52.5523 15.8C52.5523 13.56 51.9656 11.8 50.7923 10.52C49.6456 9.21332 48.0723 8.55999 46.0723 8.55999C44.0456 8.55999 42.459 9.21332 41.3123 10.52C40.1656 11.8 39.5923 13.56 39.5923 15.8C39.5923 18.0133 40.1656 19.7733 41.3123 21.08C42.459 22.36 44.0456 23 46.0723 23Z",
      "M96.9567 1.79999V30H89.1167V14.44L83.7967 30H77.2367L71.8767 14.32V30H64.0367V1.79999H73.5167L80.5967 20.12L87.5167 1.79999H96.9567Z",
      "M134.339 1.79999V30H126.499V14.44L121.179 30H114.619L109.259 14.32V30H101.419V1.79999H110.899L117.979 20.12L124.899 1.79999H134.339Z",
      "M152.322 30.28C149.682 30.28 147.256 29.6667 145.042 28.44C142.829 27.1867 141.069 25.4667 139.762 23.28C138.482 21.0667 137.842 18.5733 137.842 15.8C137.842 13.0267 138.482 10.5467 139.762 8.35999C141.069 6.14665 142.829 4.42665 145.042 3.19999C147.256 1.97332 149.682 1.35999 152.322 1.35999C154.989 1.35999 157.416 1.97332 159.602 3.19999C161.816 4.42665 163.562 6.14665 164.842 8.35999C166.122 10.5467 166.762 13.0267 166.762 15.8C166.762 18.5733 166.122 21.0667 164.842 23.28C163.562 25.4667 161.816 27.1867 159.602 28.44C157.389 29.6667 154.962 30.28 152.322 30.28ZM152.322 23C154.322 23 155.896 22.3467 157.042 21.04C158.216 19.7333 158.802 17.9867 158.802 15.8C158.802 13.56 158.216 11.8 157.042 10.52C155.896 9.21332 154.322 8.55999 152.322 8.55999C150.296 8.55999 148.709 9.21332 147.562 10.52C146.416 11.8 145.842 13.56 145.842 15.8C145.842 18.0133 146.416 19.7733 147.562 21.08C148.709 22.36 150.296 23 152.322 23Z",
      "M181.447 1.79999C184.407 1.79999 186.993 2.39998 189.207 3.59999C191.447 4.77332 193.167 6.42665 194.367 8.55999C195.567 10.6933 196.167 13.1333 196.167 15.88C196.167 18.6 195.553 21.0267 194.327 23.16C193.127 25.2933 191.407 26.9733 189.167 28.2C186.953 29.4 184.38 30 181.447 30H170.287V1.79999H181.447ZM180.847 23.08C183.14 23.08 184.94 22.4533 186.247 21.2C187.553 19.9467 188.207 18.1733 188.207 15.88C188.207 13.56 187.553 11.7733 186.247 10.52C184.94 9.23998 183.14 8.59999 180.847 8.59999H178.127V23.08H180.847Z",
      "M207.541 1.79999V30H199.701V1.79999H207.541Z",
      "M233.245 1.79999V8.03999H225.725V30H217.885V8.03999H210.445V1.79999H233.245Z",
      "M261.786 1.79999L251.866 21.04V30H243.986V21.04L234.066 1.79999H243.026L247.986 12.68L252.946 1.79999H261.786Z",
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
         <ExpoStatusBar
            backgroundColor={theme.colors.primary}
            style="light"></ExpoStatusBar>
         <Svg width="264" height="32" viewBox="0 0 264 32" fill="none">
            {paths.map((path) => {
               return (
                  <SVGAnimatedPath key={path} progress={progress} d={path} />
               );
            })}
         </Svg>
         <Text
            style={{
               opacity: 0.8,
               marginTop: 8,
               color: theme.colors.secondary,
            }}>
            LOADING...
         </Text>
      </View>
   );
};

export default StartUpLoadingScreen;
