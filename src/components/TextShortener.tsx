import { StyleSheet, Text, TextStyle, View } from "react-native";
import React, { useEffect, useState } from "react";

const TextShortener = ({
   text,
   textLength,
   style,
}: {
   text: string;
   textLength: number;
   style?: TextStyle;
}) => {
   const [shortenText, setShortenText] = useState<string>("");
   const [loading, setLoading] = useState<boolean>(true);
   const [_style, _setStyle] = useState<any>({});

   useEffect(() => {
      let txts = text.slice(0, textLength) + "...";
      if (text.length <= textLength) {
         setShortenText(text);
      } else {
         setShortenText(txts);
      }

      if (style) {
         _setStyle(style);
      }
      setLoading(false);
   }, [textLength, text, style]);

   if (loading) return <Text>......</Text>;
   return <Text style={_style}>{shortenText}</Text>;
};

export default TextShortener;

const styles = StyleSheet.create({});
