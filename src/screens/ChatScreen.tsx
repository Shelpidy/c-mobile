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
   TextInput,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import EmojiSelector, { Categories } from "react-native-emoji-selector";
import { io, Socket } from "socket.io-client";
import { StyleSheet } from "react-native";
import TextShortener from "../components/TextShortener";
import { useCurrentUser, useNetworkStatus } from "../utils/CustomHooks";
import moment from "moment"

type ChatBoxProps = {
   onSend: () => void;
   onTextInput: (v: string) => void;
   getFocused: (v: boolean) => void;
   sent:boolean
};

const ChatBox = ({ onSend, onTextInput,getFocused,sent}: ChatBoxProps) => {

   const [text,setText] = useState<any>()

   useEffect(()=>{
      if(sent){
         setText("")
      }
   },[sent])
   
   const handleSend =(v:any)=>{
       setText(v)
       onTextInput(v)
   }

   const handleFocus =(v:any)=>{
          console.log({focus:v})
          getFocused(v)
   }
   const theme = useTheme();
   return (
      <KeyboardAvoidingView
         style={{
            paddingHorizontal: 15,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
         }}>
         <TextInput
           onFocus={()=>handleFocus(true)}
           onBlur={()=>handleFocus(false)}
            value={text}
            placeholder="Type here..."
            onChangeText={handleSend}
            style={{
               flex: 1,
               backgroundColor: "#f6f6f6",
               borderTopLeftRadius: 20,
               borderBottomLeftRadius: 20,
               height: 50,
               paddingHorizontal: 25,
            }}
         />
         <Pressable
            onPress={onSend}
            style={{
               paddingHorizontal: 20,
               height: 50,
               alignItems: "center",
               justifyContent: "center",
               borderTopRightRadius: 20,
               borderBottomRightRadius: 20,
               backgroundColor: "#f6f6f6",
            }}>
            <FontAwesome color={theme.colors.primary} name="send-o" size={23} />
         </Pressable>
      </KeyboardAvoidingView>
   );
};

const ChatScreen = ({ navigation, route }: any) => {
   const [messages, setMessages] = useState<IMessage[] | null>(null);
   const [showEmojiPicker, setShowEmojiPicker] = useState<boolean>(false);
   const theme = useTheme();
   const [fileUri, setFileUri] = useState<any>(null);
   const [textValue, setTextValue] = useState<string>("");
   const [inputFocus,setInputFocus] = useState<boolean>(false)
   const [loading, setLoading] = useState<boolean>(true);
   const currentUser = useCurrentUser();
   const [secondUser, setSecondUser] = useState<User>();
   const [socket, setSocket] = useState<Socket | null>(null);
   const isOnline = useNetworkStatus()
   const [lastSeen,setLastSeen] = useState<any>()
   const [typing,setTyping] = useState<boolean | null>(false)
   const [sent,setSent] = useState<boolean>(false)

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
      let newSocket = io(`http://192.168.52.183:8080/?roomId=${roomId}&userId=${activeUser}`);
      setSocket(newSocket);
      // cleanup function to close the socket connection when the component unmounts
      return () => {
         newSocket.close();
      };
   }, [currentUser]);

  
 useEffect(()=>{
       //// Updating Online Status//////////
      if(socket){
         if(isOnline && currentUser){
            socket.emit("online",{userId:currentUser.id,online:isOnline})
         }
      }
   },[socket,isOnline,currentUser])


    useEffect(()=>{
       //// Updating Typing Status //////////
      if(socket){
         if(currentUser){
            socket.emit("typing",{userId:currentUser.id,online:inputFocus})
         }
      }
   },[socket,inputFocus])
  

   useEffect(() => {
      let secUserId = route.params.user.id;
      let activeUser = currentUser?.id;
      let roomId = generateRoomId(secUserId, activeUser);
      console.log(roomId);
      console.log("Socket connecting");

      if (socket) {
         socket.on("message", (msg: any) => {
            console.log("Message from the server", msg);
         });

         //////////  Chat message listener ///////

         socket.on(String(roomId), (message: any) => {
            console.log("From Server", message);
            setMessages((previousMessages) => {
               if (previousMessages) {
                  return GiftedChat.append(previousMessages, message);
               }
               return GiftedChat.append([], message);
            });
         });



         /////// Online Status listener ///////////

         socket.on("online",(data)=>{
            console.log("From Online",{online:data.online})
            if(data.userId == secondUser?.id){
                  if(data.online){
                    setLastSeen("online")
                  }else{
                     let lastSeenDate = moment(data.createdAt, "YYYYMMDD").fromNow()
                     setLastSeen(lastSeenDate)
                  }
            } })


         //////// Check or listen for typing status //////////

           socket.on("typing",(data)=>{
            console.log("From Typing",{typing:data.typing})
            if(data.userId == secUserId){
                    setTyping(data.typing)
                 
            } })
      }
   }, [socket, currentUser]);


   useEffect(() => {
      console.log("Fetching chats");
      let secUser = route.params.user.id;
      let activeUser = currentUser?.id;
      let roomId = generateRoomId(secUser, activeUser);

      let fetchData = async () => {
         try {
            let resp = await fetch(
               `http://192.168.52.183:8080/chats/${roomId}`,
               { method: "GET" }
            );
            let chatMessages = await resp.json();
            // console.log("Chats Messages", chatMessages);
            setMessages(chatMessages.reverse());
         } catch (err) {
            console.log(err);
            Alert.alert("Failed", String(err));
            setLoading(false);
         }
      };
      fetchData();
   }, [currentUser]);

   const onSend = useCallback(() => {
      console.log("Onsend loading")
      let secUser = route.params.user.id;
      let activeUser = currentUser?.id;
      let roomId = generateRoomId(secUser, activeUser);
      let sendData = {
         senderId:currentUser?.id,
         receipientId: route.params.user.id,
         text: textValue,
         roomId: roomId,
      };
      console.log(sendData, roomId);
      socket?.emit(String(roomId), sendData);
      setTextValue("");
      setSent(true);
   },[textValue]);

   const handleEmojiSelect = (emoji: any) => {
      setTextValue(textValue + emoji);
   };

   const handleFocus = (val:boolean) => {
      console.log({Focused:val})
       if(socket && currentUser){
         socket.emit("typing",{userId:currentUser.id,typing:val})
       }
   };

   const gotoUserProfile = () => {
      if (currentUser?.id === secondUser?.id) {
         navigation.navigate("ProfileScreen", { userId: secondUser?.id });
      } else {
         navigation.navigate("UserProfileScreen", { userId: secondUser?.id });
      }
   };

   if (!messages || !currentUser) {
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
                     paddingBottom: 10,
                     paddingLeft: 15,
                     backgroundColor:"#ffffff"
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
                        textLength={15}
                     />
                  </View>
                  <View style={{flex:1,flexDirection:"row",justifyContent:'space-between',alignItems:"center",marginRight:5}}>
                      <Text style={{fontFamily:"Poppins_300Light",color:theme.colors.secondary,marginLeft:10}}>{typing?"typing...":""}</Text>
                      <Text style={{fontFamily:"Poppins_300Light",color:"darkgreen",marginRight:5}}>{lastSeen}</Text>
                  </View>
               </View>
            )}
         </View>
         <Divider />
         <KeyboardAvoidingView style={{ flex: 1, marginBottom: 20 }}>
            <GiftedChat
               renderInputToolbar={() => (
                  <ChatBox
                     sent = {sent}
                     getFocused={handleFocus}
                     onSend={onSend}
                     onTextInput={(v) => setTextValue(v)}
                  />
               )}
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
               messages={messages}
               user={{
                  _id: route.params.user.id,
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
