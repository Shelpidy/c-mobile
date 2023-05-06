import React, { useState, useCallback, useEffect } from "react";
import {
   Bubble,
   GiftedChat,
   Send,
   MessageText,
   InputToolbar,
   Composer,
   Actions,
} from "react-native-gifted-chat";
import { Button, Divider, IconButton, useTheme } from "react-native-paper";
import {
   View,
   Text,
   KeyboardAvoidingView,
   Platform,
   Alert,
   Image,
   Pressable,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import EmojiSelector, { Categories } from "react-native-emoji-selector";
import { io, Socket } from "socket.io-client";
import { StyleSheet } from "react-native";
import TextShortener from "../components/TextShortener";
import { useCurrentUser } from "../utils/CustomHooks";

const ChatScreen = ({ navigation, route }: any) => {
   const [messages, setMessages] = useState<IMessage[]>([]);
   const [showEmojiPicker, setShowEmojiPicker] = useState<boolean>(false);
   const theme = useTheme();
   const [fileUri, setFileUri] = useState<any>(null);
   const [textValue, setTextValue] = useState<string>("");
   const [loading, setLoading] = useState<boolean>(true);
   const currentUser = useCurrentUser();
   const [secondUser, setSecondUser] = useState<User>();
   const [socket, setSocket] = useState<Socket | null>(null);

   const toggleEmojiPicker = () => {
      setShowEmojiPicker(!showEmojiPicker);
   };

   const generateRoomId = (secUserId: any, activeUserId: any) => {
      let maxId = Math.max(secUserId, activeUserId);
      let minId = Math.min(secUserId, activeUserId);
      return Number(`${maxId}${minId}`);
   };

   useEffect(() => {
      let secUser = route.params.user;
      console.log(secUser);
      setSecondUser(secUser);
   }, []);

   useEffect(() => {
      let secUser = route.params?.user.id;
      let activeUser = currentUser?.id;
      let roomId = generateRoomId(secUser, activeUser);
      let newSocket = io(`http://192.168.175.183:8080/?roomId=${roomId}`);
      setSocket(newSocket);

      // cleanup function to close the socket connection when the component unmounts
      return () => {
         newSocket.close();
      };
   }, [currentUser]);

   useEffect(() => {
      let secUser = route.params.user.id;

      let activeUser = currentUser?.id;
      let roomId = generateRoomId(secUser, activeUser);
      console.log(roomId);
      console.log("Socket connecting");

      if (socket) {
         socket.on("message", (msg: any) => {
            console.log("Message from the server", msg);
         });

         socket.on(String(roomId), (message: any) => {
            console.log("From Server", message);
            setMessages((previousMessages) =>
               GiftedChat.append(previousMessages, message)
            );
         });
      }
   }, [socket,currentUser]);

   useEffect(() => {
      console.log("Fetching chats");
      let secUser = route.params.user.id;
      let activeUser = currentUser?.id;
      let roomId = generateRoomId(secUser, activeUser);

      let fetchData = async () => {
         try {
            let resp = await fetch(
               `http://192.168.175.183:8080/chats/${roomId}`,
               { method: "GET" }
            );
            let chatMessages = await resp.json();
            console.log("Chats Messages", chatMessages);
            setMessages(chatMessages.reverse());
         } catch (err) {
            console.log(err);
            Alert.alert("Failed", String(err));
            setLoading(false);
         }
      };
      fetchData();
   }, [currentUser]);

   const onSend = useCallback(
      (message: IMessage) => {
         let secUser = route.params.user.id;
         let activeUser = currentUser?.id;
         let roomId = generateRoomId(secUser, activeUser);
         let sendData = {
            senderId: route.params.user.id,
            receipientId: message.user._id,
            text: message.text,
            roomId: roomId,
         };
         console.log(sendData, roomId);

         socket?.emit(String(roomId), sendData);
      },
      [socket]
   );

   const handleEmojiSelect = (emoji: any) => {
      setTextValue(textValue + emoji);
   };

   const handleChatInput = (val: string) => {
      setTextValue(val);
   };

   const gotoUserProfile = () => {
      if (currentUser?.id === secondUser?.id) {
         navigation.navigate("ProfileScreen", { userId: secondUser?.id });
      } else {
         navigation.navigate("UserProfileScreen", { userId: secondUser?.id });
      }
   };

   if (!currentUser) {
      return (
         <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
            <Text>Loading...</Text>
         </View>
      );
   }
   return (
      <View style={{ flex: 1, marginBottom: 10 }}>
         <View>
            {secondUser && (
               <View
                  style={{
                     flexDirection: "row",
                     alignItems: "center",
                     paddingVertical: 10,
                     paddingLeft: 15,
                  }}>
                  <Pressable onPress={gotoUserProfile}>
                     <Image
                        style={styles.profileImage}
                        source={{ uri: secondUser.profileImage }}
                     />
                  </Pressable>
                  <View>
                     <TextShortener
                        style={{
                           fontFamily: "Poppins_500Medium",
                           marginHorizontal: 5,
                        }}
                        text={secondUser.fullName}
                        textLength={18}
                     />
                  </View>
               </View>
            )}
         </View>
         <Divider />
         <KeyboardAvoidingView style={{ flex: 1, marginBottom: 20 }}>
            <GiftedChat
               // renderActions={(props) => {
               //    return (
               //       <Actions {...props}>
               //          <Button>F</Button>
               //         <View>  <Button onPress={toggleEmojiPicker} mode='contained'>E</Button></View>

               //       </Actions>
               //    );
               // }}

               renderChatFooter={() => {
                  if (showEmojiPicker)
                     return (
                        <EmojiSelector
                           onEmojiSelected={handleEmojiSelect}
                           showHistory={true}
                           showSearchBar={false}
                           showTabs={false}
                           showSectionTitles={false}
                           category={Categories.all}
                           columns={8}
                        />
                     );
               }}
               renderComposer={(props) => {
                  return (
                     <Composer
                        {...props}
                        textInputStyle={{
                           backgroundColor: theme.colors.inverseOnSurface, // set your desired background color here
                           borderRadius: 20,
                           paddingLeft: 20,
                           paddingRight: 10,
                           alignItems: "center",
                           justifyContent: "center",
                           marginTop: 8,
                           paddingBottom: 5,
                           marginRight: 5,
                        }}
                        placeholder="Type a message..."
                     />
                  );
               }}
               renderBubble={(props) => {
                  return (
                     <Bubble
                        {...props}
                        textStyle={{
                           right: { color: "#f9f9f9" },
                           left: { color: "#000" },
                        }}
                        wrapperStyle={{
                           left: {
                              backgroundColor: theme.colors.secondaryContainer, // set your desired background color here
                           },
                           right: {
                              backgroundColor: theme.colors.primary, // set your desired background color here
                           },
                        }}
                     />
                  );
               }}
               inverted
               renderSend={(props) => (
                  <Send
                     {...props}
                     containerStyle={{
                        alignItems: "center",
                        justifyContent: "center",
                        paddingRight: 15,
                     }}>
                     <FontAwesome
                        color={theme.colors.primary}
                        name="send-o"
                        size={23}
                     />
                  </Send>
               )}
               messages={messages}
               onInputTextChanged={handleChatInput}
               text={textValue}
               onSend={(messages) => onSend(messages[0])}
               user={{
                  _id: 3,
               }}
            />
         </KeyboardAvoidingView>
      </View>
   );
};

export default ChatScreen;

const styles = StyleSheet.create({
   profileImage: {
      width: 30,
      height: 30,
      borderRadius: 15,
   },
});
