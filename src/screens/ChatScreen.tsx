import React, { useState, useCallback, useEffect, useRef } from "react";
import { Bubble, GiftedChat } from "react-native-gifted-chat";
import {
   Button,
   Divider,
   IconButton,
   ProgressBar,
   useTheme,
} from "react-native-paper";
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
import {
   Feather,
   FontAwesome,
   Ionicons,
   MaterialIcons,
} from "@expo/vector-icons";
import EmojiSelector, { Categories } from "react-native-emoji-selector";
import { io, Socket } from "socket.io-client";
import { StyleSheet, Modal } from "react-native";
import TextShortener from "../components/TextShortener";
import { useCurrentUser, useNetworkStatus } from "../utils/CustomHooks";
import moment from "moment";
import { useNavigation, useNavigationState } from "@react-navigation/native";
// import { ImagePicker } from "expo-image-multiple-picker";
import * as ImagePicker from "expo-image-picker";
import config from ".././aws-config";
import AWS from "aws-sdk";
import { Camera } from "expo-camera";
import { Video, Audio, ResizeMode, AVPlaybackStatus } from "expo-av";
import * as FileSystem from "expo-file-system";

type ChatBoxProps = {
   onSend: () => void;
   onTextInput: (v: string) => void;
   getFocused: (v: boolean) => void;
   openMediaPicker: () => void;
   openVideoPicker: () => void;
   handleIsRecording: (v: boolean) => void;
   sent: boolean;
};

const s3 = new AWS.S3({
   accessKeyId: config.accessKeyId,
   secretAccessKey: config.secretAccessKey,
   region: config.region,
});

const ChatBox = ({
   onSend,
   onTextInput,
   getFocused,
   sent,
   openMediaPicker,
   handleIsRecording,
   openVideoPicker,
}: ChatBoxProps) => {
   const [text, setText] = useState<any>();
   const textInputRef = useRef<TextInput>(null);
   const [isFocused, setIsFocused] = useState<boolean>(false);
   const [recording, setRecording] = useState<boolean>(false);

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
      setIsFocused(v);
      getFocused(v);
   };

   const handleRecording = () => {
      setRecording(!recording);
      handleIsRecording(!recording);
   };

   const theme = useTheme();
   return (
      <View
         style={{
            paddingHorizontal: 10,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            gap: 10,
         }}>
         <View
            style={{
               flex: 1,
               flexDirection: "row",
               alignItems: "center",
               justifyContent: "center",
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
               onPress={openMediaPicker}>
               <Ionicons
                  color={theme.colors.secondary}
                  name="camera"
                  size={23}
               />
            </TouchableOpacity>
            <TouchableOpacity
               style={{
                  paddingHorizontal: 4,
                  height: 50,
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: "#f6f6f6",
               }}
               onPress={openVideoPicker}>
               <Ionicons
                  color={theme.colors.secondary}
                  name="videocam-outline"
                  size={23}
               />
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
                  flex: 1,
                  fontFamily: "Poppins_300Light",
                  backgroundColor: "#f6f6f6",
                  height: 50,
                  paddingHorizontal: 25,
                  fontSize: 16,
               }}
            />
            {isFocused && (
               <TouchableOpacity
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
                  <FontAwesome
                     color={theme.colors.primary}
                     name="send-o"
                     size={23}
                  />
               </TouchableOpacity>
            )}
            {!isFocused && (
               <TouchableOpacity
                  onPress={handleRecording}
                  style={{
                     paddingHorizontal: 20,
                     height: 50,
                     alignItems: "center",
                     justifyContent: "center",
                     borderTopRightRadius: 20,
                     borderBottomRightRadius: 20,
                     backgroundColor: "#f6f6f6",
                  }}>
                  <Feather
                     name="mic"
                     color={recording ? "red" : theme.colors.secondary}
                     size={23}
                  />
               </TouchableOpacity>
            )}
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
   const [recording, setRecording] = useState<Audio.Recording | null>(null);
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
   const [videoOpen, setVideoOpen] = useState<boolean>(false);
   const [image, setImage] = useState<string | null>(null);
   const [audioRecording, setAudioRecording] = useState<boolean>(false);
   const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
   const [audio, setAudio] = useState<string | null>(null);
   const [downloadVideoProgress, setVideoDownloadProgress] = useState<
      number | null
   >(null);
   const [downloadImageProgress, setImageDownloadProgress] = useState<
      number | null
   >(null);
   const [downloadId, setDownloadId] = useState<number | string | null>(null);
   const [resetLastSeen, setResetLastSeen] = useState<number>(0);
   const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);
    const [audioDuration, setAudioDuration] = useState<number | null>(null);

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
         `http://192.168.99.44:8080/?roomId=${roomId}&userId=${activeUser}`
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
                  `http://192.168.99.44:8080/userstatus/${secUserId}`,
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

         ////////////////////  Chat message listener ///////////////

         socket.on(String(roomId), (message: any) => {
            // console.log("From Server", message);
            setMessages((previousMessages) => {
               if (previousMessages) {
                  return GiftedChat.append(previousMessages, message);
               }
               return GiftedChat.append([], message);
            });
         });

         ///////////// Online Status listener ///////////

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
                  `http://192.168.99.44:8080/chats/${roomId}/${currentPage}/${numberOfChatsRecord}`,
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

   /////////////// Pick Image ////////////////////////////
   const openImagePickerAsync = async () => {
      const permissionResult =
         await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (permissionResult.granted === false) {
         Alert.alert(
            "Permission required",
            "Permission to access the media library is required."
         );
         return;
      }

      const pickerResult = await ImagePicker.launchImageLibraryAsync();

      if (pickerResult.canceled === true) {
         return;
      }

      setImage(pickerResult.assets[0].uri);
      console.log("Image", pickerResult.assets[0]);
      onSend();
   };

   ////////////// Take picture /////////////////////////

   // const takePictureWithPermission = async () => {
   //    const { status } = await Camera.requestMicrophonePermissionsAsync();

   //    if (status !== "granted") {
   //       console.log("Camera permission not granted");
   //       return;
   //    }

   //    const camera = await Camera.getAvailableCameraTypesAsync();
   //    const uri = await camera[0];
   //    //  setImage(uri)
   //    console.log(uri);
   //    // Do something with the captured photo
   // };

   ////////// Choose a video /////////////////////////

   const openVideoPickerAsync = async () => {
      const permissionResult =
         await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (permissionResult.granted === false) {
         console.log("Permission to access the media library is required.");
         return;
      }
      const pickerResult = await ImagePicker.launchImageLibraryAsync({
         mediaTypes: ImagePicker.MediaTypeOptions.Videos,
      });
      if (!pickerResult.canceled) {
         setSelectedVideo(pickerResult.assets[0].uri);
         console.log(pickerResult.assets[0].uri);
         onSend();
      }
   };

   ///////////////////// start recording ///////////////////////////

   async function startRecording() {
      try {
         console.log("Requesting permissions..");
         await Audio.requestPermissionsAsync();
         await Audio.setAudioModeAsync({
            allowsRecordingIOS: true,
            playsInSilentModeIOS: true,
         });

         console.log("Starting recording..");
         const { recording } = await Audio.Recording.createAsync(
            Audio.RecordingOptionsPresets.HIGH_QUALITY
         );
         setRecording(recording);
         console.log("Recording started");
      } catch (err) {
         console.error("Failed to start recording", err);
      }
   }

   ////////////////////////// stop recording //////////////////////////////////

   async function stopRecording() {
      console.log("Stopping recording..");
      if (recording) {
         setRecording(null);
         await recording.stopAndUnloadAsync();
         await Audio.setAudioModeAsync({
            allowsRecordingIOS: false,
         });
         const uri = recording.getURI();
         setAudio(uri);
         console.log("Recording stopped and stored at", uri);
         onSend();
      }
   }

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
         image,
         video: selectedVideo,
         audio,
      };
      // console.log(sendData, roomId);
      socket?.emit(String(roomId), sendData);
      setTextValue("");
      setSent(true);
   }, [textValue, image, selectedVideo, audio]);

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
      <View
         style={{
            flex: 1,
            marginBottom: 10,
            marginTop: StatusBar.currentHeight,
         }}>
         <View>
            {secondUser && (
               <View
                  style={{
                     flexDirection: "row",
                     alignItems: "center",
                     paddingTop: 18,
                     paddingBottom: 10,
                     paddingLeft: 15,
                     backgroundColor: theme.colors.primary,
                  }}>
                  <Ionicons
                     onPress={() => navigation.goBack()}
                     style={{ marginRight: 5 }}
                     name="md-arrow-back"
                     color={theme.colors.onPrimary}
                     size={20}
                  />
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
                     openVideoPicker={async () => await openVideoPickerAsync()}
                     handleIsRecording={async (val: boolean) =>
                        val ? await startRecording() : await stopRecording()
                     }
                     openMediaPicker={async () => await openImagePickerAsync()}
                     sent={sent}
                     getFocused={handleFocus}
                     onSend={onSend}
                     onTextInput={(v) => setTextValue(v)}
                  />
               )}
               // renderAvatar = {() => null }
               renderBubble={(props) => {
                  ///////// Audion Playing ///////////////////////
                
                  const handleAudioPress = async (audioUri:any) => {
                     
                     const { sound, status} = await Audio.Sound.createAsync({
                        uri: audioUri,
                     });

                     if(isPlayingAudio){
                        setIsPlayingAudio(false)
                     }
                     if (status.isLoaded) {
                        await sound.playAsync();
                        setIsPlayingAudio(true)
                     }
                    
                  };

                  const handleDownload = async (name: string) => {
                     if (props.currentMessage) {
                        const { video, image, _id } = props.currentMessage;

                        if (video && name === "video") {
                           try {
                              const downloadResumable =
                                 FileSystem.createDownloadResumable(
                                    video,
                                    `${FileSystem.cacheDirectory}${
                                       video.split("/")[-1]
                                    }`,
                                    {},
                                    (downloadProgress) => {
                                       const progress =
                                          downloadProgress.totalBytesWritten /
                                          downloadProgress.totalBytesExpectedToWrite;
                                       setVideoDownloadProgress(progress);
                                       console.log(
                                          "New Video Progress",
                                          progress
                                       );
                                    }
                                 );

                              const downloadResult =
                                 await downloadResumable.downloadAsync();

                              console.log("Video downloaded:", downloadResult);
                              // Do something with the downloaded video file
                           } catch (error) {
                              console.log("Video download error:", error);
                           }
                        } else if (image && name === "image") {
                           try {
                              const downloadResumable =
                                 FileSystem.createDownloadResumable(
                                    image,
                                    `${FileSystem.cacheDirectory}${
                                       image.split("/")[-1]
                                    }`,
                                    {},
                                    (downloadProgress) => {
                                       const progress =
                                          downloadProgress.totalBytesWritten /
                                          downloadProgress.totalBytesExpectedToWrite;
                                       console.log(
                                          "New Image Progress",
                                          progress
                                       );
                                       setVideoDownloadProgress(progress);
                                    }
                                 );

                              const imgDownloadResult =
                                 await downloadResumable.downloadAsync();

                              console.log(
                                 "Image downloaded:",
                                 imgDownloadResult
                              );
                              // Do something with the downloaded image file
                           } catch (error) {
                              console.log("Image download error:", error);
                           }
                        }
                     }
                  };
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
                        renderMessageAudio={({currentMessage})=> currentMessage && currentMessage?.audio ? (
                            <TouchableOpacity onPress={async() => await handleAudioPress(currentMessage.audio)}>
                                <IconButton icon="play-circle" size={30} />
                           </TouchableOpacity>
                        ):null

                        }
                        renderMessageImage={({ currentMessage }) => (
                           <View>
                              <View style={{ paddingHorizontal: 5 }}>
                                 {!downloadImageProgress && (
                                    <Button
                                       onPress={async () =>
                                          await handleDownload("image")
                                       }
                                       mode="text">
                                       Download{" "}
                                       <Feather name="download" size={23} />
                                    </Button>
                                 )}
                                 {downloadImageProgress &&
                                    downloadImageProgress < 1 && (
                                       <View>
                                          <Text
                                             style={{
                                                textAlign: "center",
                                                color: theme.colors.secondary,
                                                fontFamily: "Poppins_300Light",
                                                marginVertical: 3,
                                             }}>
                                             Downloading...
                                          </Text>
                                          <ProgressBar
                                             style={{
                                                height: 12,
                                                borderRadius: 8,
                                             }}
                                             progress={downloadImageProgress}
                                          />
                                       </View>
                                    )}
                              </View>
                              <Image
                                 source={{ uri: currentMessage?.image }}
                                 style={{ width: 200, height: 200 }}
                              />
                           </View>
                        )}
                        renderMessageVideo={({ currentMessage }) =>
                           currentMessage && currentMessage?.video ? (
                              <View>
                                 {!downloadVideoProgress && (
                                    <Button
                                       onPress={async () =>
                                          await handleDownload("video")
                                       }
                                       mode="text">
                                       Download{" "}
                                       <Feather name="download" size={23} />
                                    </Button>
                                 )}
                                 {downloadVideoProgress &&
                                    downloadVideoProgress < 1 && (
                                       <View>
                                          <Text
                                             style={{
                                                textAlign: "center",
                                                color: theme.colors.secondary,
                                                fontFamily: "Poppins_300Light",
                                                marginVertical: 3,
                                             }}>
                                             Downloading...
                                          </Text>
                                          <ProgressBar
                                             style={{
                                                height: 12,
                                                borderRadius: 8,
                                             }}
                                             progress={downloadVideoProgress}
                                          />
                                       </View>
                                    )}

                                 <Video
                                    useNativeControls
                                    resizeMode={ResizeMode.CONTAIN}
                                    isLooping
                                    source={{ uri: currentMessage?.video }}
                                    style={{
                                       width: 270,
                                       height: 200,
                                       margin: 0,
                                    }}
                                 />
                              </View>
                           ) : null
                        }
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
