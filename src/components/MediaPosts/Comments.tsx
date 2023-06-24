import { StyleSheet, Text, View, Alert } from "react-native";
import React, { useEffect, useState } from "react";
import Comment from "./Comment";
import { Button, Divider } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import { useCurrentUser } from "../../utils/CustomHooks";

type CommentsProps = {
   postId: number;
   userId?: number;
};

type FetchComment = {
   comment: PostComment;
   repliesCount: number;
   likesCount: number;
   liked: boolean;
   user: User;
};

const Comments = ({ postId, userId }: CommentsProps) => {
   const [comments, setComments] = useState<FetchComment[]|null>(null);
   const navigation = useNavigation<any>();
   const currentUser = useCurrentUser();

   useEffect(
      function () {
         let fetchData = async () => {
            try {
               if(currentUser && postId){
               let response = await fetch(
                  `http://192.168.182.183:5000/api/media/posts/${postId}/comments/${currentUser?.id}`
               );
               let { data } = await response.json();
               if (response.ok) {
                  setComments(data);
                  console.log("Comments=>", data);
               } else {
                  Alert.alert("Failed", data.message);
               }}
            } catch (err) {
               console.log("From Comments",String(err))
               Alert.alert("Failed", String(err));
            }
         };
         fetchData();
      },
      [currentUser, postId]
   );

   if(!comments){
      return(
         <View>
            <Text>Loading... comments</Text>
         </View>
      ) 
   }

   return (
      <View>
         {comments?.map((comment) => {
            return (
               <Comment
                  key={String(comment.comment.id)}
                  posterId={userId}
                  comment={comment.comment}
                  user={comment.user}
                  likesCount={comment.likesCount}
                  repliesCount={comment.repliesCount}
                  liked={comment.liked}
               />
            );
         })}
         {comments.length > 1 && (
            <Button
               onPress={() =>
                  navigation.navigate("CommentsViewerScreen", {
                     comments,
                     userId,
                  })
               }>
               Show more comments...
            </Button>
         )}
      </View>
   );
};

export default Comments;

const styles = StyleSheet.create({});
