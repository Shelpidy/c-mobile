import { Modal, StyleSheet, Text, View, Image, Alert,Pressable } from "react-native";
import React, { useEffect, useState } from "react";
import { users } from "../../data";
import { Feather, SimpleLineIcons } from "@expo/vector-icons";
import { Button } from "react-native-paper";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";
import { useCurrentUser } from "../../utils/CustomHooks";

const Comment = (props: CommentProps) => {
   const currentUser = useCurrentUser();
   const [openModal, setOpenModal] = useState<boolean>(false);
   const [commentor, setCommentor] = useState<any>(null);
   const [loading, setLoading] = useState<any>(false);

   const navigation = useNavigation<any>()

   useEffect(function () {
      console.log("Fetching user");
      setLoading(true);
      let fetchData = async () => {
         // console.log("Fetching user")
         //  let activeUserId = 1
         try {
            let response = await fetch(
               `http://192.168.0.100:5000/api/auth/users/${props.userId}`,
               { method: "GET" }
            );
            let data = await response.json();
            if (data.status == "success") {
               // console.log("Users-----",data.data)
               setCommentor(data.data.personal);
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

   const handleEditComment = () => {};

    const gotoUserProfile = () => {
      if (currentUser?.id === commentor.id) {
         navigation.navigate("ProfileScreen", { userId: commentor.id });
      } else {
         navigation.navigate("UserProfileScreen", { userId: commentor.id });
      }
   };


   return (
      <View style={styles.container}>
         <Modal visible={openModal}>
            <View
               style={{
                  flex: 1,
                  backgroundColor: "#00000099",
                  justifyContent: "center",
                  alignItems: "center",
               }}>
               <View
                  style={{
                     backgroundColor: "#ffffff",
                     padding: 5,
                     borderRadius: 4,
                  }}>
                  <Button onPress={() => setOpenModal(false)}>Back</Button>
                  <Text>Comment Editor</Text>
               </View>
            </View>
         </Modal>
         {commentor && (
            <View>
               <View style={styles.commentorMedia}>
                  <Pressable onPress={gotoUserProfile} >
                      <Image
                     style={styles.profileImage}
                     source={{ uri: commentor.profileImage }}
                  />

                  </Pressable>
                 
                  <View
                     style={{
                        backgroundColor: "#f5f5f5",
                        flex: 1,
                        borderRadius: 5,
                        paddingHorizontal: 4,
                        paddingVertical: 6,
                     }}>
                     <Text style={styles.userFullName}>
                        {commentor.firstName} {commentor.middleName}{" "}
                        {commentor.lastName}
                     </Text>
                     <Text style={{ fontFamily: "Poppins_300Light",paddingHorizontal:5 }}>
                        {props.text}
                     </Text>
                     {/* <Text>Comment Likes</Text>  */}
                     <View
                        style={{
                           justifyContent: "flex-end",
                           alignItems: "flex-end",
                           marginTop: 2,
                           paddingHorizontal: 5,
                           borderRadius: 3,
                        }}>
                        {(currentUser?.id == props?.userId ||
                           currentUser?.id == props?.posterId) && (
                           <View style={{ flexDirection: "row" }}>
                               <Button onPress={() => setOpenModal(true)}>
                                  <SimpleLineIcons name="options-vertical" />
                              </Button>
                           </View>
                        )}
                     </View>
                  </View>
               </View>
            </View>
         )}
      </View>
   );
};

export default Comment;

const styles = StyleSheet.create({
   container: {
      backgroundColor: "#ffffff",
      marginVertical: 6,
   },
   profileImage: {
      width: 28,
      height: 28,
      borderRadius: 15,
   },
   commentorMedia: {
      flexDirection: "row",
      gap: 8,
   },
   userFullName: {
      fontFamily: "Poppins_600SemiBold",
   },
});
