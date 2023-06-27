import { StyleSheet, Text, View, Alert } from "react-native";
import React, { useEffect, useState } from "react";
import Comment from "./Comment";
import { Button, Divider } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import { useCurrentUser } from "../../utils/CustomHooks";
import Reply from "./Reply";

type RepliesProps = {
   commentId: number;
   userId?: number;
};

type FetchReply = {
   reply: CommentReply;
   likesCount: number;
   liked: boolean;
   user: User;
};

const Replies = ({ commentId, userId }: RepliesProps) => {
   const [replies, setReplies] = useState<FetchReply[] | null>(null);
   const navigation = useNavigation<any>();
   const currentUser = useCurrentUser();

   useEffect(
      function () {
         let fetchData = async () => {
            try {
               let response = await fetch(
                  `http://192.168.0.114:5000/api/media/posts/conmments/${commentId}/replies/${currentUser?.id}`
               );
               let { data } = await response.json();
               if (response.ok) {
                  setReplies(data);
                  console.log("replies=>", data);
               } else {
                  Alert.alert("Failed", data.message);
               }
            } catch (err) {
               Alert.alert("Failed", String(err));
            }
         };
         fetchData();
      },
      [currentUser, commentId]
   );

   if (!replies) {
      return (
         <View>
            <Text>Loading... replies</Text>
         </View>
      );
   }

   return (
      <View>
         {replies?.map((reply) => {
            return (
               <Reply
                  key={String(reply.reply.id)}
                  posterId={userId}
                  reply={reply.reply}
                  user={reply.user}
                  likesCount={reply.likesCount}
                  liked={reply.liked}
               />
            );
         })}
         {replies.length > 1 && (
            <Button
               onPress={() =>
                  navigation.navigate("CommentsViewerScreen", {
                     replies,
                     userId,
                  })
               }>
               Show more comments...
            </Button>
         )}
      </View>
   );
};

export default Replies;

const styles = StyleSheet.create({});
