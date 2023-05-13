import { StyleSheet, Text, View,Alert } from 'react-native'
import React, { useState,useEffect } from 'react'
import { ActivityIndicator } from 'react-native-paper'
import { useCurrentUser } from '../utils/CustomHooks'

const generateRoomId = (secUserId: any, activeUserId: any) => {
      let maxId = Math.max(secUserId, activeUserId);
      let minId = Math.min(secUserId, activeUserId);
      return Number(`${maxId}${minId}`);
   };

const ConversationsScreen = ({navigation}:any) => {
  const [conversations,setConversations] = useState<Conversation[] | null>(null)
  const [currentPage,setCurrentPage] = useState<number>(1)
  const [totalConversations,setTotalConversations] = useState<number>(0)
  const [numberOfConversationsRecord,setNumberOfConversationsRecord] = useState<number>(30)
  const currentUser = useCurrentUser()

     useEffect(() => {
      if(currentUser && currentPage){
          console.log("Fetching conversations");
         let userId = currentUser?.id;
      
         let fetchData = async () => {
            try {
               let resp = await fetch(
                  `http://192.168.52.183:8080/conversations/${userId}/${currentPage}/${numberOfConversationsRecord}`,
                  { method: "GET" }
               );
               let {conversations:newConversations,count}= await resp.json();
               // console.log("conversations Messages", chatMessages);
               setTotalConversations(count)
               if(conversations && currentPage > 1){
                 setConversations([...conversations,...newConversations])
               }else{
                   setConversations([...newConversations])
               }
            
            } catch (err) {
               console.log(err);
               Alert.alert("Failed", String(err));
              
            }
         };
      fetchData();

      }
     
   }, [currentUser,currentPage]);

  if(!conversations){
    return (
      <View style={{flex:1,justifyContent:"center",alignItems:"center"}}><ActivityIndicator/></View>
    )
  }

  return (
    <View>
      <Text>All Chats</Text>
      {conversations.map(conversation =>{
        return <View key = {String(conversation.id)}><Text>{conversation.lastText}</Text></View>
      })}
      
    </View>
  )
}

export default ConversationsScreen

const styles = StyleSheet.create({})