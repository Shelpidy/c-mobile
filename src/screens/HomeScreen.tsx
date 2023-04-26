import { ScrollView, StyleSheet, Text, View } from "react-native";
import React from "react";
import { Button } from "react-native-paper";
import PostsComponent from "../components/MediaPosts/PostsComponent";
import FindFriendsComponent from "../components/FindFriendsComponent";
import PostProductFormNav from "../components/PostProductFormNav";
// import { withTheme,Button,Theme } from "@rneui/themed";
// import { Theme, Button } from "@rneui/base";

type HomeScreenProps = {
   theme?: any;
   navigation: any;
};

const HomeScreen = ({ theme, navigation }: HomeScreenProps) => {
   return (
      <ScrollView style={styles.container}>
         <PostProductFormNav page="post" navigation={navigation} />
         <FindFriendsComponent navigation={navigation} />
         <PostsComponent navigation={navigation} />
         {/* <Button onPress={() => navigation.navigate("ProfileScreen")}>
            Profile
         </Button>
         <Button onPress={() => navigation.navigate("PostScreen")}>
            Post Screen
         </Button>
         <Button onPress={() => navigation.navigate("SettingsScreen")}>
            Settings
         </Button>
         <Button onPress={() => navigation.navigate("MarketingScreen")}>
            Market
         </Button>
          <Button onPress={() => navigation.navigate("ProductsRequestScreen")}>
            Cart Products
         </Button>
         <Text>HomeScreen</Text> */}
      </ScrollView>
   );
};

export default HomeScreen;

const styles = StyleSheet.create({
   container: {
      backgroundColor: "#f5f5f5",
   },
});
