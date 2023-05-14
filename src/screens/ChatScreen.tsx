import React, { useState, useCallback, useEffect, useRef } from "react";
import {
   Bubble,
   GiftedChat,
  
} from "react-native-gifted-chat";
import { Button, Divider, IconButton, useTheme } from "react-native-paper";
import {
   View,
   Text,
   Platform,
   Alert,
   Image,
   Pressable,
   TextInput,
   TextInputState,
   StatusBar,
   TouchableOpacity,
} from "react-native";
import { Feather, FontAwesome, Ionicons, MaterialIcons } from "@expo/vector-icons";
import EmojiSelector, { Categories } from "react-native-emoji-selector";
import { io, Socket } from "socket.io-client";
import { StyleSheet,Modal } from "react-native";
import TextShortener from "../components/TextShortener";
import { useCurrentUser, useNetworkStatus } from "../utils/CustomHooks";
import moment from "moment";
import { useNavigation, useNavigationState } from "@react-navigation/native";
import { ImagePicker } from "expo-image-multiple-picker";
import config from ".././aws-config";
import AWS from "aws-sdk";

type ChatBoxProps = {
   onSend: () => void;
   onTextInput: (v: string) => void;
   getFocused: (v: boolean) => void;
   openMediaPicker: () => void;
   handleIsRecording:(v:boolean)=>void
   sent: boolean;
};

const s3 = new AWS.S3({
   accessKeyId: config.accessKeyId,
   secretAccessKey: config.secretAccessKey,
   region: config.region,
});


const ChatBox = ({ onSend, onTextInput, getFocused, sent,openMediaPicker,handleIsRecording }: ChatBoxProps) => {
   const [text, setText] = useState<any>();
   const textInputRef = useRef<TextInput>(null);
   const [isFocused,setIsFocused] = useState<boolean>(false)
   const [recording,setRecording] = useState<boolean>(false)

   useEffect(() => {
      // console.log("Running");
      if (sent) {
         setText("");
         textInputRef?.current?.clear();
         textInputRef?.current?.blur();
      }
   }, [sent]);

   const handleTextChange = (v: any) => {
      setText(v);
      onTextInput(v);
   };

   const handleSend = () => {
      textInputRef?.current?.clear();
      textInputRef?.current?.blur();
      onSend();
   };

   const handleFocus = (v: any) => {
      // console.log({ focus: v });
      setIsFocused(v)
      getFocused(v);
   };

   const theme = useTheme();
   return (
      <View
         style={{
            paddingHorizontal:10,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: 'center',
            gap:10,
            
         }}>
         
         <View  style={{
             flex:1,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: 'center',
         }}>
             <TouchableOpacity
              style={{
               paddingHorizontal: 20,
               height: 50,
               alignItems: "center",
               justifyContent: "center",
               borderTopLeftRadius: 20,
               borderBottomLeftRadius: 20,
               backgroundColor: "#f6f6f6",
            }}
              onPress={openMediaPicker} >
                 <Ionicons color={theme.colors.secondary} name="camera" size={23} />
            </TouchableOpacity>
              <TextInput
            multiline
            ref={textInputRef}
            onFocus={() => handleFocus(true)}
            onBlur={() => handleFocus(false)}
            value={text}
            placeholder="Type here..."
            onChangeText={handleTextChange}
            style={{
               flex:1,
               fontFamily: "Poppins_300Light",
               backgroundColor: "#f6f6f6",
               height: 50,
               paddingHorizontal: 25,
               fontSize: 16,
            }}
         />
         {
            isFocused && <TouchableOpacity
               onPress={handleSend}
           
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
         </TouchableOpacity>
         }
         {
            !isFocused && <TouchableOpacity
          onPress={()=>handleIsRecording(!recording)}
             style={{
               paddingHorizontal: 20,
               height: 50,
               alignItems: "center",
               justifyContent: "center",
               borderTopRightRadius: 20,
               borderBottomRightRadius: 20,
               backgroundColor: "#f6f6f6",
            }}>
               <Feather name='mic' color={recording?"red":theme.colors.secondary} size={23} />
          
         </TouchableOpacity>
         }

         </View>
       
            
      </View>
   );
};

const ChatScreen = ({ route }: any) => {
   const [messages, setMessages] = useState<IMessage[] | null>(null);
   const [showEmojiPicker, setShowEmojiPicker] = useState<boolean>(false);
   const theme = useTheme();
   const [fileUri, setFileUri] = useState<any>(null);
   const [textValue, setTextValue] = useState<string>("");
   const [inputFocus, setInputFocus] = useState<boolean>(false);
   const [loading, setLoading] = useState<boolean>(true);
   const currentUser = useCurrentUser();
   const [secondUser, setSecondUser] = useState<User>();
   const [socket, setSocket] = useState<Socket | null>(null);
   const isOnline = useNetworkStatus();
   const [lastSeen, setLastSeen] = useState<any>();
   const [typing, setTyping] = useState<boolean | null>(false);
   const [sent, setSent] = useState<boolean>(false);
   const [currentPage, setCurrentPage] = useState<number>(1);
   const [totalChats, setTotalChats] = useState<number>(0);
   const [numberOfChatsRecord, setNumberOfChatsRecord] = useState<number>(30);
   const navigationState = useNavigationState((state) => state);
   const navigation = useNavigation<any>();
   const [imageOpen, setImageOpen] = useState<boolean>(false);
   const [videoOpen, setVideoOpen] =  useState<boolean>(false);
   const [audioRecording, setAudioRecording] = useState<boolean>(false);

   const [resetLastSeen, setResetLastSeen] = useState<number>(0);

   const toggleEmojiPicker = () => {
      setShowEmojiPicker(!showEmojiPicker);
   };


   
   const chooseImage = (assets: any[]) => {
      let imageSrcs = assets.map((asset) => asset.uri);
      // console.log(imageSrcs);
      setImageOpen(false);
   };

   const cancelImage = () => {
      // console.log("No permission, canceling image picker");
      setImageOpen(false);
   };

   const chooseVideo = (assets: any[]) => {
      let videoSrc = assets[0]["uri"];
      // console.log(videoSrc);
      setVideoOpen(false);
   };

   const cancelVideo = () => {
      // console.log("No permission, canceling image picker");
      setImageOpen(false);
   };

   const generateRoomId = (secUserId: any, activeUserId: any) => {
      let maxId = Math.max(secUserId, activeUserId);
      let minId = Math.min(secUserId, activeUserId);
      return Number(`${maxId}${minId}`);
   };

   ///////////////////////////////// CONNECT TO SOCKETIO //////////////////////////////
   useEffect(() => {
      let secUser = route.params?.user.id;
      let activeUser = currentUser?.id;
      let roomId = generateRoomId(secUser, activeUser);
      let newSocket = io(
         `http://192.168.52.183:8080/?roomId=${roomId}&userId=${activeUser}`
      );
      setSocket(newSocket);
      // cleanup function to close the socket connection when the component unmounts
      return () => {
         newSocket.close();
      };
   }, [currentUser]);

   //////////////////////////////// GET SECOND USER STATUS ///////////////////////////

   useEffect(() => {
      if (route.params) {
         // console.log("Fetching status");
         let secUserId = route.params.user.id;

         let fetchData = async () => {
            try {
               let resp = await fetch(
                  `http://192.168.52.183:8080/userstatus/${secUserId}`,
                  { method: "GET" }
               );
               if (resp.ok) {
                  let data = await resp.json();
                  // console.log("Status", data);
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
               // console.log(err);
               Alert.alert("Failed", String(err));
               setLoading(false);
            }
         };
         fetchData();
      }
   }, [resetLastSeen]);

   ///// LISTEN FOR WHEN A USER LEAVES THE SCREEN //////////

   useEffect(() => {
      const unsubscribe = navigation.addListener("blur", () => {
         // console.log("User left the screen");
         // Perform actions when user leaves the screen
         if (socket && currentUser) {
            let activeUser = currentUser.id;
            socket.emit("chatScreen", {
               userId: activeUser,
               onChatScreen: false,
            });
         }
      });

      return unsubscribe;
   }, [navigation]);

   //////// UPDATE READ STATUS OF LAST MESSAGE(S) RECEIVED //////////

   // useEffect(()=>{
   //   async function updateReadMessageStatus(){
   //    if(currentUser){
   //        try{
   //       let secUser = route.params?.user.id;
   //       let activeUser = currentUser?.id;
   //       let roomId = generateRoomId(secUser, activeUser);
   //       let response =  await fetch(
   //             `http://192.168.52.183:8080/conversations/read/${roomId}/${activeUser}`,{ method: "PUT" }
   //          );
   //       if(response.status != 202){
   //          let responseBody = await response.json()
   //          Alert.alert("Update Failed","Failed to update read status")
            // console.log(responseBody)
   //       }
   //     }catch(err){
         //  console.log(err);
   //        Alert.alert("Failed", String(err));
   //     }
   //    }
   //   }
   //   updateReadMessageStatus()
   // },[])

   useEffect(() => {
      let secUser = route.params.user;
      // console.log(secUser);
      setSecondUser(secUser);
   }, []);

   useEffect(() => {
      //// Updating Online Status//////////
      if (socket) {
         if (isOnline && currentUser) {
            socket.emit("online", { userId: currentUser.id, online: isOnline });
         }
      }
   }, [socket, isOnline, currentUser]);

   useEffect(() => {
      //// Updating Typing Status //////////
      if (socket) {
         if (currentUser) {
            socket.emit("typing", {
               userId: currentUser.id,
               online: inputFocus,
            });
         }
      }
   }, [socket, inputFocus]);

   useEffect(() => {
      let secUserId = route.params.user.id;
      let activeUser = currentUser?.id;
      let roomId = generateRoomId(secUserId, activeUser);
      // console.log(roomId);
      // console.log("Socket connecting");

      if (socket) {
         socket.on("message", (msg: any) => {
            // console.log("Message from the server", msg);
         });

         //////////  Chat message listener ///////

         socket.on(String(roomId), (message: any) => {
            // console.log("From Server", message);
            setMessages((previousMessages) => {
               if (previousMessages) {
                  return GiftedChat.append(previousMessages, message);
               }
               return GiftedChat.append([], message);
            });
         });

         /////// Online Status listener ///////////

         socket.on("online", (data) => {
            // console.log("From Online", { online: data.online });
            if (data.userId == secondUser?.id) {
               setResetLastSeen(resetLastSeen + 1);
            }
         });

         //////// Check or listen for typing status //////////

         socket.on("typing", (data) => {
            // console.log("From Typing", { typing: data.typing });
            if (data.userId == secUserId) {
               setTyping(data.typing);
            }
         });
      }
   }, [socket, currentUser]);

   useEffect(() => {
      if (currentUser && currentPage) {
         // console.log("Fetching chats");
         let secUser = route.params.user.id;
         let activeUser = currentUser?.id;
         let roomId = generateRoomId(secUser, activeUser);

         let fetchData = async () => {
            try {
               let resp = await fetch(
                  `http://192.168.52.183:8080/chats/${roomId}/${currentPage}/${numberOfChatsRecord}`,
                  { method: "GET" }
               );
               let { chats: chatMessages, count } = await resp.json();
               console.log("Chats Messages", chatMessages);
               setTotalChats(count);
               if (messages && currentPage > 1) {
                  setMessages([...messages, ...chatMessages]);
               } else {
                  setMessages(chatMessages);
               }
            } catch (err) {
               // console.log(err);
               Alert.alert("Failed", String(err));
               setLoading(false);
            }
         };
         fetchData();
      }
   }, [currentUser, currentPage]);

   const onSend = useCallback(() => {
      // console.log("Onsend loading");
      let secUser = route.params.user.id;
      let activeUser = currentUser?.id;
      let roomId = generateRoomId(secUser, activeUser);
      let sendData = {
         senderId: currentUser?.id,
         receipientId: route.params.user.id,
         text: textValue,
         roomId: roomId,
      };
      // console.log(sendData, roomId);
      socket?.emit(String(roomId), sendData);
      setTextValue("");
      setSent(true);
   }, [textValue]);

   const handleEmojiSelect = (emoji: any) => {
      setTextValue(textValue + emoji);
   };

   const handleFocus = (val: boolean) => {
      // console.log({ Focused: val });
      if (socket && currentUser) {
         socket.emit("typing", { userId: currentUser.id, typing: val });
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
      <View style={{ flex: 1, marginBottom: 10,marginTop:StatusBar.currentHeight }}>
          <Modal visible={imageOpen}>
            <ImagePicker
               onSave={chooseImage}
               onCancel={cancelImage}
               multiple
               limit={8}
            />
         </Modal>
         <View>
            {secondUser && (
               <View
                  style={{
                     flexDirection: "row",
                     alignItems: "center",
                     paddingTop: 18,
                     paddingBottom:10,
                     paddingLeft: 15,
                     backgroundColor: theme.colors.primary,
                  }}>
             
                  <Ionicons onPress={()=> navigation.goBack()} style={{marginRight:5}} name="md-arrow-back" color={theme.colors.onPrimary} size={20} />
                
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
                           color: theme.colors.inverseOnSurface,
                        }}
                        text={secondUser.fullName}
                        textLength={15}
                     />
                  </View>
                  <View
                     style={{
                        flex: 1,
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginRight: 5,
                     }}>
                     <Text
                        style={{
                           fontFamily: "Poppins_300Light",
                           color: theme.colors.inversePrimary,
                           marginLeft: 10,
                        }}>
                        {typing ? "typing..." : ""}
                     </Text>
                     <Text
                        style={{
                           fontFamily: "Poppins_300Light",
                           color: theme.colors.inversePrimary,
                           marginRight: 5,
                        }}>
                        {lastSeen}
                     </Text>
                  </View>
               </View>
            )}
         </View>
         <Divider />
         <View style={{ flex: 1, marginBottom: 20 }}>
            <GiftedChat
               renderInputToolbar={() => (
                  <ChatBox
                    handleIsRecording={setAudioRecording}
                     openMediaPicker={()=> setImageOpen(true)}
                     sent={sent}
                     getFocused={handleFocus}
                     onSend={onSend}
                     onTextInput={(v) => setTextValue(v)}
                  />
               )}
               renderAvatar = {() => null }
               renderBubble={(props) => {
                  return (
                     <Bubble
                        {...props}
                        textStyle={{
                           right: {
                              color: "#f9f9f9",
                              fontFamily: "Poppins_300Light",
                           },
                           left: {
                              color: "#000",
                              fontFamily: "Poppins_300Light",
                           },
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
         </View>
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
