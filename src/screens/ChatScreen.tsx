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
import { Button, IconButton, useTheme } from "react-native-paper";
import { View, Text, KeyboardAvoidingView, Platform } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import EmojiSelector, { Categories } from "react-native-emoji-selector";

const ChatScreen = ({ navigation, route }: any) => {
   const [messages, setMessages] = useState<IMessage[]>([]);
   const [showEmojiPicker, setShowEmojiPicker] = useState<boolean>(true);
   const theme = useTheme();
   const [fileUri, setFileUri] = useState<any>(null);
   const [textValue,setTextValue] = useState<any>("")

   const toggleEmojiPicker = () => {
      setShowEmojiPicker(!showEmojiPicker);
   };

   useEffect(() => {
      setMessages([
         {
            _id: 1,
            text: "How are you",
            createdAt: new Date(),
            user: {
               _id: 2,
               name: "React Native",
               avatar: "https://placeimg.com/140/140/any",
            },
         },
         {
            _id: 2,
            text: "I saw you post the last time and it is amazing",
            createdAt: new Date(),
            user: {
               _id: 2,
               name: "React Native",
               avatar: "https://placeimg.com/140/140/any",
            },
         },
      ]);
   }, []);

   const onSend = useCallback((messages: IMessage[] = []) => {
      setMessages((previousMessages) =>
         GiftedChat.append(previousMessages, messages)
      );
   }, []);

   return (
      <View style={{ flex: 1, marginBottom: 10 }}>
         <View>
            <Text>Header</Text>
         </View>
         <KeyboardAvoidingView style={{ flex: 1, marginBottom: 20 }}>
            <GiftedChat
               renderActions={(props) => {
                  return (
                     <Actions {...props}>
                        <Button >F</Button>
                       <View>  <Button onPress={toggleEmojiPicker} mode='contained'>E</Button></View>
                      
                     </Actions>
                  );
               }}
            
               renderChatFooter={() => {
                  if (showEmojiPicker)
                     return (
                        <EmojiSelector
                             onEmojiSelected={(emoji) => {
                              const text = emoji ? emoji : '';
                              let msg :IMessage[] = [{
                                _id:3,
                                text: text,
                                createdAt: new Date(),
                                user: {
                                  _id: 1,
                                  name: 'User',
                                  avatar: 'https://placeimg.com/140/140/any',
                                },
                              }]
                              GiftedChat.append(messages,msg);
                            }}
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
                           paddingLeft: 10,
                           paddingRight: 10,
                           alignItems: "center",
                           justifyContent: "center",
                           marginTop: 8,
                           paddingBottom: 5,
                           marginRight: 5,
                        }}
                        placeholder="Type for me a message..."
                        
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
                     }}>
                     <Button mode="contained">
                        <FontAwesome name="send-o" />
                     </Button>
                  </Send>
               )}

               messages={messages}
               onSend={(messages) => onSend(messages)}
               user={{
                  _id: 1,
               }}
            />
         </KeyboardAvoidingView>
      </View>
   );
};

export default ChatScreen;
