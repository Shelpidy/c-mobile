import { StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import Comment from "./Comment";
import { Button, Divider } from "react-native-paper";

type CommentsProps = {
   comments: CommentProps[];
   posterId?: number;
   navigation?: any;
};

const Comments = ({ comments, posterId, navigation }: CommentsProps) => {
   const [commentsToShow, setCommentsToShow] = useState<typeof comments>([]);

   useEffect(() => {
      setCommentsToShow(comments.slice(0, 1));
   }, [comments]);

   return (
      <View>
         <Divider style={{ marginTop: 10 }} />
         {/* <Text>Comments</Text> */}

         {commentsToShow?.map((comment) => {
            return (
               <Comment
                  key={String(comment.id)}
                  posterId={posterId}
                  {...comment}
               />
            );
         })}
         <Button
            onPress={() =>
               navigation.navigate("CommentsViewerScreen", {
                  comments,
                  posterId,
               })
            }>
            Show more comments...
         </Button>
      </View>
   );
};

export default Comments;

const styles = StyleSheet.create({});
