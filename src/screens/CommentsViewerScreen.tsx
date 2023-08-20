import { StyleSheet, Text, View, ScrollView } from "react-native";
import React, { useState, useEffect } from "react";
import Comment from "../components/MediaPosts/CommentComponent";
import { Button } from "react-native-paper";
import { FontAwesome5 } from "@expo/vector-icons";

type CommentsViewerScreenProps = {
   navigation: any;
   route: any;
};

const CommentsViewerScreen = ({
   navigation,
   route,
}: CommentsViewerScreenProps) => {
   const [comments, setComments] = useState<CommentProps[]>([]);
   const [posterId, setPosterId] = useState<number>();
   const [pageNumber, setPageNumber] = useState<number>(1);
   const [numberOfCommentsPerPage, setNumberOfCommentsPerPage] =
      useState<number>(20);
   const [numberOfPageLinks, setNumberOfPageLinks] = useState<number>(0);

   useEffect(() => {
      let { comments: fetchedComments, posterId } = route.params;
      setComments(fetchedComments);
      setPosterId(posterId);
      // console.log(fetchedComments)
      let numOfPageLinks = Math.ceil(
         fetchedComments.length / numberOfCommentsPerPage
      );
      setNumberOfPageLinks(numOfPageLinks);
   }, [route.params]);

   //   useEffect(()=>{
   //      const currentIndex = numberOfCommentsPerPage * (pageNumber - 1)
   //      const lastIndex = currentIndex + numberOfCommentsPerPage
   //      setComments(comments.slice(currentIndex,lastIndex))
   //   },[pageNumber])

   return (
      <ScrollView style={styles.container}>
         <Text
            style={{
               fontFamily: "Poppins_400Regular",
               marginHorizontal: 20,
               fontSize: 16,
            }}>
            <FontAwesome5 size={25} name="comments" /> {comments.length}
         </Text>

         {comments?.map((comment) => {
            return (
               <Comment
                  key={String(comment.id)}
                  posterId={posterId}
                  {...comment}
               />
            );
         })}
      </ScrollView>
   );
};

export default CommentsViewerScreen;

const styles = StyleSheet.create({
   container: {
      backgroundColor: "#fff",
      paddingVertical: 10,
      paddingHorizontal: 15,
   },
});
