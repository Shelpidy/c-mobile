import {
   StyleSheet,
   Text,
   View,
   Pressable,
   Dimensions,
   Alert,
} from "react-native";
import React, { useState, useEffect } from "react";
import { Skeleton } from "@rneui/base";
import { Badge, useTheme } from "react-native-paper";
import { Image } from "react-native";
import axios from "axios";
import moment from "moment";
import TextShortener from "./TextShortener";
import { useNavigation } from "@react-navigation/native";
import { io, Socket } from "socket.io-client";
import { useCurrentUser } from "../utils/CustomHooks";

type ConversationComponentProps = {
   conversation: Conversation;
};

const { width, height } = Dimensions.get("window");

const generateRoomId = (secUserId: any, activeUserId: any) => {
   let maxId = Math.max(secUserId, activeUserId);
   let minId = Math.min(secUserId, activeUserId);
   return Number(`${maxId}${minId}`);
};

const ConversationComponent = ({
   conversation,
}: ConversationComponentProps) => {
   const [secondUser, setSecondUser] = useState<User | null>(null);
   const [loading, setLoading] = useState<boolean>(false);
   const theme = useTheme();
   const navigation = useNavigation<any>();
   const [socket, setSocket] = useState<Socket | null>(null);
   const [lastSeen, setLastSeen] = useState<any>("");
   const [typing, setTyping] = useState<boolean | null>(false);
   const [recording, setRecording] = useState<boolean | null>(false);
   const [resetLastSeen, setResetLastSeen] = useState<number>(0);
   const currentUser = useCurrentUser();
   const [newConversation, setNewConversation] =
      useState<Conversation>(conversation);

   //////////////////  GET SECOND USER ///////////////
   useEffect(
      function () {
         if (currentUser) {
            console.log("Fetching user");
            let fetchData = async () => {
               // console.log("Fetching user")
               //  let activeUserId = 1
               let userIds = String(conversation.roomId).split("");
               let secondUserId = Number(
                  userIds.filter((id) => Number(id) != currentUser.id)[0]
               );
               try {
                  let response = await fetch(
                     `http://192.168.0.101:5000/api/auth/users/${secondUserId}`,
                     { method: "GET" }
                  );
                  let data = await response.json();
                  if (data.status == "success") {
                     console.log("User-----", data.data.personal);
                     setSecondUser(data.data.personal);
                     // Alert.alert("Success",data.message)
                  } else {
                     Alert.alert("Failed", data.message);
                  }
               } catch (err) {
                  console.log(err);
                  Alert.alert("Failed", String(err));
               }
            };
            fetchData();
         }
      },
      [currentUser]
   );

   ///////////////////////////////// CONNECT TO SOCKETIO //////////////////////////////
   useEffect(() => {
      if (secondUser && currentUser) {
         let activeUser = currentUser?.id;
         let roomId = generateRoomId(secondUser?.id, activeUser);
         let newSocket = io(
            `http://192.168.0.101:8080/?roomId=${roomId}&userId=${activeUser}&convId=true`
         );
         setSocket(newSocket);
         // cleanup function to close the socket connection when the component unmounts
         return () => {
            newSocket.close();
         };
      }
   }, [currentUser, secondUser]);

   //////////////////////////////// GET SECOND USER STATUS ///////////////////////////

   useEffect(() => {
      if (secondUser) {
         console.log("Fetching status");

         let fetchData = async () => {
            try {
               let resp = await fetch(
                  `http://192.168.0.101:8080/userstatus/${secondUser.id}`,
                  { method: "GET" }
               );
               if (resp.ok) {
                  let data = await resp.json();
                  console.log("Status", data);
                  if (data.data.online) {
                     setLastSeen("online");
                  } else {
                     let lastSeenDate = moment(
                        data.data.updatedAt,
                        "YYYYMMDD"
                     ).fromNow();
                     setLastSeen(lastSeenDate);
                  }
               } else {
                  let data = await resp.json();
                  Alert.alert("Failed", data.message);
               }
            } catch (err) {
               console.log(err);
               Alert.alert("Failed", String(err));
               setLoading(false);
            }
         };
         fetchData();
      }
   }, [secondUser, resetLastSeen]);

   useEffect(() => {
      if (socket && currentUser && secondUser) {
         let secUserId = secondUser.id;
         let activeUser = currentUser?.id;
         let roomId = generateRoomId(secUserId, activeUser);
         console.log(roomId);
         console.log("Socket connecting");
         socket.on("message", (msg: any) => {
            console.log("Message from the server", msg);
         });

         //////////  Chat message listener ///////

         /////// Online Status listener ///////////

         socket.on("online", (data) => {
            console.log("From Online", { online: data.online });
            if (data.userId == secondUser?.id) {
               setResetLastSeen(resetLastSeen + 1);
            }
         });

         //////// Check or listen for typing status //////////

         socket.on("typing", (data) => {
            console.log("From Typing", { typing: data.typing });
            if (data.userId == secUserId) {
               setTyping(data.typing);
            }
         });

         ///////// check or listen for recording ///////////////

         socket.on("recording", (data) => {
            console.log("From Recording", { recording: data.recording });
            if (data.userId == secUserId) {
               setRecording(data.recording);
            }
         });

         ////////////// check for conversation /////////////////

         socket.on("conversation", (data) => {
            console.log("From Conversation", { conversation: data });
            setNewConversation(data);
         });
      }
   }, [socket, currentUser, secondUser]);

   const gotoChatScreen = () => {
      navigation.navigate("ChatScreen", { user: secondUser });
   };
   if (!newConversation) {
      return (
         <View>
            <Text>No Text</Text>
         </View>
      );
   }

   if (!secondUser) {
      return (
         <View style={{ flexDirection: "row", margin: 2 }}>
            <Skeleton animation="wave" width={50} height={50} circle />
            <Skeleton
               animation="wave"
               style={{ borderRadius: 4, marginHorizontal: 2 }}
               width={300}
               height={50}
            />
         </View>
      );
   }
   return (
      <Pressable
         onPress={gotoChatScreen}
         style={styles.container}
         key={String(conversation.id)}>
         <View>
            <Image
               resizeMode="cover"
               source={{ uri: secondUser.profileImage }}
               style={{
                  width: 50,
                  height: 50,
                  borderRadius: 30,
                  marginRight: 3,
               }}
            />
         </View>
         <View>
            <View
               style={{
                  width: 300,
                  flexDirection: "row",
                  justifyContent: "space-between",
                  paddingRight: 5,
                  alignItems: "center",
                  paddingTop: 1,
               }}>
               <TextShortener
                  text={
                     secondUser.firstName +
                     " " +
                     secondUser.middleName +
                     " " +
                     secondUser.lastName
                  }
                  style={{
                     fontFamily:
                        currentUser?.id == newConversation.receipientId &&
                        !newConversation.receipientReadStatus
                           ? "Poppins_500Medium"
                           : "Poppins_300Light",
                     marginHorizontal: 3,
                  }}
                  textLength={15}
               />
               {!recording && (
                  <Text
                     style={{
                        fontFamily: "Poppins_300Light",
                        color: theme.colors.secondary,
                        marginLeft: 10,
                     }}>
                     {typing ? "typing..." : ""}
                  </Text>
               )}
               {!typing && (
                  <Text
                     style={{
                        fontFamily: "Poppins_300Light",
                        color: theme.colors.secondary,
                        marginLeft: 10,
                     }}>
                     {recording ? "recording..." : ""}
                  </Text>
               )}

               <Text>{lastSeen}</Text>
            </View>

            {newConversation.lastText && (
               <View
                  style={{
                     width: 300,
                     flexDirection: "row",
                     justifyContent: "flex-start",
                     paddingLeft: 5,
                     alignItems: "center",
                     paddingTop: 5,
                     height: "auto",
                  }}>
                  {currentUser?.id == newConversation.receipientId &&
                     newConversation.numberOfUnreadText && (
                        <Badge
                           style={{
                              backgroundColor: theme.colors.primary,
                              marginBottom: 5,
                           }}
                           size={18}>
                           {newConversation.numberOfUnreadText}
                        </Badge>
                     )}
                  <TextShortener
                     text={newConversation.lastText}
                     style={{
                        fontFamily:
                           currentUser?.id == newConversation.receipientId &&
                           !newConversation.receipientReadStatus
                              ? "Poppins_500Medium"
                              : "Poppins_300Light",
                        marginHorizontal: 3,
                     }}
                     textLength={38}
                  />
               </View>
            )}
         </View>
      </Pressable>
   );
};

export default ConversationComponent;

const styles = StyleSheet.create({
   container: {
      backgroundColor: "#ffffff",
      flexDirection: "row",
      padding: 5,
      height: "auto",
      marginVertical: 2,
   },

   notTitle: {
      fontFamily: "Poppins_500Medium",
   },
   notMessage: {
      fontFamily: "Poppins_300Light",
      paddingHorizontal: 2,
      flexWrap: "wrap",
   },
   notDate: {
      fontFamily: "Poppins_300Light_Italic",
      paddingHorizontal: 2,
      textAlign: "right",
      fontSize: 13,
   },
   notHeader: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
   },
});
