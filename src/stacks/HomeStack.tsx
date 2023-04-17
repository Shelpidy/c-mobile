import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ProfileScreen from "../screens/ProfileScreen";
import HomeScreen from "../screens/HomeScreen";
import SettingsScreen from "../screens/SettingsScreen";
import FollowingsScreen from "../screens/FollowingsScreen";
import CustomHeader from "../components/CustomHeader";
import PostScreen from "../screens/PostScreen";
import FollowersScreen from "../screens/FollowersScreen";
import UserProfileScreen from "../screens/UserProfileScreen";
import TransferMoneyScreen from "../screens/TransferMoneyScreen";
import NotificationScreen from "../screens/NotificationScreen";
import TransfereesScreen from "../screens/TransfereesScreen";
import CommentsViewerScreen from "../screens/CommentsViewerScreen";
import FullPostComponent from "../screens/FullPostViewScreen";
import ProductCommentsViewerScreen from "../screens/ProductCommentsViewerScreen";
import MarketingScreen from "../screens/MarketingScreen";
import ProductScreen from "../screens/ProductScreen";
import UserProductScreen from "../screens/UserProductScreen";
import ProductRequestScreen from "../screens/ProductRequestScreen";
import UserRequestScreen from "../screens/UserRequestScreen";
const Stack = createNativeStackNavigator();
type HomeStackProps = {
   navigation: any;
};
const HomeStack = (props: HomeStackProps) => {
   return (
      <Stack.Navigator
         screenOptions={{ header: () => <CustomHeader {...props} /> }}>
         <Stack.Screen name="HomeScreen" component={HomeScreen}></Stack.Screen>
         <Stack.Screen
            name="ProfileScreen"
            component={ProfileScreen}></Stack.Screen>
         <Stack.Screen
            name="SettingsScreen"
            component={SettingsScreen}></Stack.Screen>
         <Stack.Screen name="PostScreen" component={PostScreen}></Stack.Screen>
         <Stack.Screen
            name="TransferMoneyScreen"
            component={TransferMoneyScreen}></Stack.Screen>
         <Stack.Screen
            name="NotificationScreen"
            component={NotificationScreen}></Stack.Screen>
         <Stack.Screen
            name="FollowersScreen"
            component={FollowersScreen}></Stack.Screen>
         <Stack.Screen
            name="TransfereesScreen"
            component={TransfereesScreen}></Stack.Screen>
         <Stack.Screen
            name="FollowingsScreen"
            component={FollowingsScreen}></Stack.Screen>
         <Stack.Screen
            name="UserProfileScreen"
            component={UserProfileScreen}></Stack.Screen>
         <Stack.Screen
            name="CommentsViewerScreen"
            component={CommentsViewerScreen}></Stack.Screen>
         <Stack.Screen
            name="FullPostViewScreen"
            component={FullPostComponent}></Stack.Screen>
         <Stack.Screen
            name="MarketingScreen"
            component={MarketingScreen}></Stack.Screen>
         <Stack.Screen
            name="ProductScreen"
            component={ProductScreen}></Stack.Screen>
         <Stack.Screen
            name="ProductCommentsViewerScreen"
            component={ProductCommentsViewerScreen}></Stack.Screen>
         <Stack.Screen
            name="UserProductScreen"
            component={UserProductScreen}></Stack.Screen>
          <Stack.Screen
            name="ProductRequestScreen"
            component={ProductRequestScreen}></Stack.Screen>
         <Stack.Screen
            name="UserRequestScreen"
            component={UserRequestScreen}></Stack.Screen>
      </Stack.Navigator>
   );
};

export default HomeStack;
