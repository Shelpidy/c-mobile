import { StyleSheet, Text, View, Alert } from "react-native";
import React, { useEffect, useState } from "react";
import { useCurrentUser } from "../utils/CustomHooks";
import axios from "axios";
import { Avatar } from "react-native-paper";
import TextShortener from "./TextShortener";

type LikesComponentProps = {
   postId: number;
   numberOfLikes: number;
};

const LikesComponent = ({ postId, numberOfLikes }: LikesComponentProps) => {
   const [users, setUsers] = useState<Partial<User>[] | null>(null);
   const currentUser = useCurrentUser();
   useEffect(
      function () {
         let fetchData = async () => {
            try {
               if (currentUser) {
                  let { data, status } = await axios.get(
                     `http://192.168.148.183:5000/api/media/posts/likes/${postId}/${currentUser.id}`
                  );
                  if (status == 200) {
                     setUsers(data.data.sessionUsers);
                     console.log("Liked Users", data.data.sessionUsers);

                     // console.log(data.data);
                  } else {
                     Alert.alert("Failed", data.message);
                  }
               }
            } catch (err) {
               Alert.alert("Failed", String(err));
            }
         };
         fetchData();
      },
      [currentUser]
   );

   if (!users) {
      return <View></View>;
   }

   if (users.length < 1) {
      return <View></View>;
   }
   return (
      <View
         style={{
            flex: 1,
            flexDirection: "row",
            alignItems: "center",
            marginVertical: 8,
         }}>
         <View style={{ marginRight: 4 }}>
            {users.map((user) => (
               <Avatar.Image
                  key={user.id}
                  source={{ uri: user.profileImage }}
                  size={24}
                  style={{ marginRight: -8 }}
               />
            ))}
         </View>
         <Text style={{ marginLeft: 5, paddingLeft: 2 }}>
            <Text>
               <TextShortener text={"Liked by"} textLength={50} />
            </Text>
            <Text>
               <TextShortener
                  style={{
                     fontWeight: "bold",
                     marginHorizontal: 2,
                     fontFamily: "Poppins_400Regular",
                  }}
                  text={
                     users[0]?.firstName +
                     " " +
                     users[0]?.middleName +
                     " " +
                     users[0]?.lastName
                  }
                  textLength={10}
               />
            </Text>
            <Text>
               <TextShortener
                  text={
                     "and" + " " + String(numberOfLikes - 1) + " " + "others"
                  }
                  textLength={50}
               />
            </Text>
         </Text>
      </View>
   );
};

export default LikesComponent;

const styles = StyleSheet.create({});
