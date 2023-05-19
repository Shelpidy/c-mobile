import {
   ScrollView,
   StyleSheet,
   Text,
   View,
   Alert,
   FlatList,
} from "react-native";
import React, { useEffect, useState } from "react";
import { users as commodityUsers } from "../data";
import FindFriendComponent from "./FindFriendComponent";
import { AntDesign, Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import axios from "axios";
import { ActivityIndicator } from "react-native-paper";
import { useCurrentUser } from "../utils/CustomHooks";

const FindFriendsComponent = ({ navigation }: any) => {
   const [users, setUsers] = useState<User[] | null>(null);
   const [loading, setLoading] = useState<boolean>(false);
   const currentUser = useCurrentUser();

   useEffect(
      function () {
         console.log("Fetching ff user");
         setLoading(true);
         let fetchData = async () => {
            // console.log("Fetching user")

            try {
               if (currentUser) {
                  let activeUserId = currentUser?.id;
                  let response = await fetch(
                     `http://192.168.161.183:5000/api/media/unfollowing/${activeUserId}`,
                     { method: "GET" }
                  );
                  let data = await response.json();
                  if (data.status == "success") {
                     // console.log("Users-----", data.data);
                     setUsers(data.data?.sort(() => 0.5 - Math.random()));
                     // Alert.alert("Success",data.message)
                  } else {
                     Alert.alert("Failed", data.message);
                  }
               }
            } catch (err) {
               console.log(err);
               Alert.alert("Failed", String(err));
            }
         };
         fetchData();
      },
      [currentUser]
   );

   if (!users)
      return (
         <View
            style={{
               flex: 1,
               justifyContent: "center",
               alignItems: "center",
               padding: 15,
            }}>
            <Text>
               <ActivityIndicator />
            </Text>
         </View>
      );
   return (
      <FlatList
         data={users}
         horizontal
         keyExtractor={(item) => String(item.id)}
         indicatorStyle="white"
         renderItem={({ item, index, separators }) => (
            <FindFriendComponent
               key={String(item.id)}
               user={item}
               navigation={navigation}
            />
         )}
      />
   );
};

export default FindFriendsComponent;

const styles = StyleSheet.create({
   container: {
      backgroundColor: "#f5f5f5",
      paddingHorizontal: 5,
   },
});
