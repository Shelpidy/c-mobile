import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from "react-native";
import React, { useEffect } from "react";
import { Button } from "react-native-paper";
import PostsComponent from "../components/MediaPosts/PostsComponent";
import FindFriendsComponent from "../components/FindFriendsComponent";
import PostProductFormNav from "../components/PostProductFormNav";
import { useCurrentUser } from "../utils/CustomHooks";
// import { withTheme,Button,Theme } from "@rneui/themed";
// import { Theme, Button } from "@rneui/base";

type HomeScreenProps = {
   theme?: any;
   navigation: any;
};

const HomeScreen = ({ navigation }: HomeScreenProps) => {
   const currentUser = useCurrentUser()

   if (!currentUser) {
      return <View><ActivityIndicator/></View>
   }

   return (
      <ScrollView style={styles.container}>
         <PostProductFormNav page="post" navigation={navigation} />
         <FindFriendsComponent navigation={navigation} />
         <PostsComponent navigation={navigation} />
      </ScrollView>
   );
};

export default HomeScreen;

const styles = StyleSheet.create({
   container: {
      backgroundColor: "#f5f5f5",
   },
});
