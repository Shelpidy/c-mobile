import { StyleSheet, Text, TextStyle, View, ViewStyle } from "react-native";
import React, { useEffect, useState } from "react";
import { useTheme } from "react-native-paper";

const TextShortener = ({
   text,
   textLength,
   style,
   children,
   containerStyle,
   showViewMore,
   onPressViewMore,
}: {
   text: string;
   textLength: number;
   style?: TextStyle;
   containerStyle?: ViewStyle;
   children?: any;
   showViewMore?: boolean;
   onPressViewMore?: () => void;
}) => {
   const [shortenText, setShortenText] = useState<string>("");
   const [loading, setLoading] = useState<boolean>(true);
   const [_style, _setStyle] = useState<any>({});
   const theme = useTheme();

   useEffect(() => {
      let txts = text.slice(0, textLength);
      if (text.length <= textLength) {
         setShortenText(text);
      } else {
         setShortenText(txts + "...");
      }
      if (style) {
         _setStyle(style);
      }
      setLoading(false);
   }, [textLength, text, style]);

   if (loading) return <Text>......</Text>;
   return showViewMore ? (
      <View style={containerStyle}>
         <Text style={_style}>
            {shortenText}{" "}
            <Text
               onPress={onPressViewMore}
               style={{ color: theme.colors.primary }}>
               view more
            </Text>
         </Text>
         {children}
      </View>
   ) : (
      <View style={containerStyle}>
         <Text style={_style}>
            {shortenText}
            <Text></Text>
         </Text>
         {children}
      </View>
   );
};

export default TextShortener;

const styles = StyleSheet.create({});
