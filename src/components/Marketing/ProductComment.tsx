import { Modal, StyleSheet, Text, View, Image, Alert } from "react-native";
import React, { useEffect, useState } from "react";
import { users } from "../../data";
import { Feather, SimpleLineIcons } from "@expo/vector-icons";
import { Button } from "react-native-paper";
import { useCurrentUser } from "../../utils/CustomHooks";

const Comment = (props: ProductCommentProps) => {
   const currentUser = useCurrentUser();
   const [openModal, setOpenModal] = useState<boolean>(false);
   const [commentor, setCommentor] = useState<any>(null);
   const [loading, setLoading] = useState<any>(false);

   useEffect(
      function () {
         console.log("Fetching user");
         setLoading(true);
         let fetchData = async () => {
            // console.log("Fetching user")
            //  let activeUserId = 1
            try {
               if (props) {
                  let response = await fetch(
                     `http://192.168.175.183:5000/api/auth/users/${props?.userId}`,
                     { method: "GET" }
                  );

                  if (response.ok) {
                     let data = await response.json();
                     // console.log("Users-----",data.data)
                     setCommentor(data.data.personal);
                     // Alert.alert("Success",data.message)
                  } else {
                     let data = await response.json();
                     Alert.alert("Failed", data.message);
                  }
               }

               setLoading(false);
            } catch (err) {
               console.log(err);
               Alert.alert("Failed", String(err));
               setLoading(false);
            }
         };
         fetchData();
      },
      [props]
   );

   const handleEditComment = () => {};

   if (!commentor) {
      return (
         <View>
            <Text>Loading...</Text>
         </View>
      );
   }
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
                  <Image
                     style={styles.profileImage}
                     source={{ uri: commentor.profileImage }}
                  />
                  <View
                     style={{
                        backgroundColor: "#f5f5f5",
                        flex: 1,
                        borderRadius: 30,
                        paddingHorizontal: 15,
                        paddingVertical: 8,
                     }}>
                     <View
                        style={{
                           flex: 1,
                           flexDirection: "row",
                           alignItems: "center",
                           justifyContent: "space-between",
                        }}>
                        <Text style={styles.userFullName}>
                           {commentor.firstName} {commentor.middleName}{" "}
                           {commentor.lastName}
                        </Text>
                        {(currentUser?.id == props?.userId ||
                           currentUser?.id == props?.posterId) && (
                           <View style={{ flexDirection: "row" }}>
                              <Button
                                 style={{ backgroundColor: "#fff" }}
                                 onPress={() => setOpenModal(true)}>
                                 <SimpleLineIcons name="options-vertical" />
                              </Button>
                           </View>
                        )}
                     </View>
                     <Text
                        style={{
                           fontFamily: "Poppins_300Light",
                           paddingHorizontal: 5,
                        }}>
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
                        }}></View>
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
      marginVertical: 2,
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
