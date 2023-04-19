import { ScrollView, StyleSheet, Text, View, Alert } from "react-native";
import React, { useEffect, useState } from "react";
import { users as commodityUsers } from "../data";
import { AntDesign, Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import axios from "axios";
import { ActivityIndicator } from "react-native-paper";
import UserComponent from "../components/UserComponent";
import SearchForm from "../components/SearchForm";

const FollowingsScreen = ({ navigation, route }: any) => {
   const [users, setUsers] = useState<User[]>();
   const [loading, setLoading] = useState<boolean>(false);

   useEffect(function () {
      console.log("Fetching user");
      setLoading(true);
      let fetchData = async () => {
         // console.log("Fetching user")
         let userId = route.params.user.id;
         try {
            let response = await fetch(
               `http://192.168.0.108:5000/api/media/following/${userId}`,
               { method: "GET" }
            );
            let data = await response.json();
            if (data.status == "success") {
               console.log("Users-----", data.data);
               setUsers(data.data?.sort(() => 0.5 - Math.random()));
               // Alert.alert("Success",data.message)
               setLoading(false);
            } else {
               Alert.alert("Failed", data.message);
            }
            setLoading(false);
         } catch (err) {
            console.log(err);
            Alert.alert("Failed", String(err));
            setLoading(false);
         }
      };
      fetchData();
   }, []);

   if (loading)
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
      <View>
         <Text>Followings</Text>
         <SearchForm setSearchValue={(v) => console.log(v)} />
         {/* <Text
            style={{ fontFamily: "Poppins_600SemiBold", marginHorizontal: 15 }}>
            <Feather size={20} name="users" /> Users
         </Text> */}
         <ScrollView style={styles.container}>
            {users?.map((user) => {
               return (
                  <UserComponent
                     key={String(user.id)}
                     navigation={navigation}
                     _user={user}
                  />
               );
            })}
         </ScrollView>
      </View>
   );
};

export default FollowingsScreen;

const styles = StyleSheet.create({
   container: {
      backgroundColor: "#f5f5f5",
      padding: 5,
   },
});
