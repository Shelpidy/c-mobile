import { ScrollView, StyleSheet, Text, View } from "react-native";
import React from "react";
import { Button } from "react-native-paper";
import PostsComponent from "../components/PostsComponent";
import FindFriendsComponent from "../components/FindFriendsComponent";
// import { withTheme,Button,Theme } from "@rneui/themed";
// import { Theme, Button } from "@rneui/base";

type HomeScreenProps = {
   theme?: any;
   navigation: any;
};

const HomeScreen = ({ theme, navigation }: HomeScreenProps) => {
   return (
      <ScrollView style={styles.container}>
         <FindFriendsComponent />
         <PostsComponent navigation={navigation} />
         <Button onPress={() => navigation.navigate("ProfileScreen")}>
            Profile
         </Button>
         <Button onPress={() => navigation.navigate("PostScreen")}>
            Post Screen
         </Button>
         <Button onPress={() => navigation.navigate("SettingsScreen")}>
            Settings
         </Button>
         <Text>HomeScreen</Text>
      </ScrollView>
   );
};

export default HomeScreen;

const styles = StyleSheet.create({
   container: {
      backgroundColor: "#f9f9f9",
   },
});
