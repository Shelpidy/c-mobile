import { useNavigation } from "@react-navigation/native";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Appbar, FAB, useTheme } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type CustomHeaderProps = {
   navigation: any;
};

const CustomHeader = ({navigation}:CustomHeaderProps) => {
   let _navigation = useNavigation();
   return (
         <Appbar.Header>
         
         <Appbar.Content title="Commodity" />
         {
            _navigation.canGoBack() && <Appbar.BackAction onPress={() => _navigation.goBack()} />
         }
           <Appbar.Action  icon="bell" onPress={() => navigation.navigate("NotificationScreen")} />
         <Appbar.Action  icon="menu" onPress={() => {}} />
       
      </Appbar.Header>
   );
};

export default CustomHeader;

const styles = StyleSheet.create({});
