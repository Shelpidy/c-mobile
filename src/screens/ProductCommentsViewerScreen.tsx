import { StyleSheet, Text, View, ScrollView } from "react-native";
import React, { useState, useEffect } from "react"
import { Button } from "react-native-paper";
import { FontAwesome5 } from "@expo/vector-icons";
import ProductComment from "../components/Marketing/ProductComment";



type CommentsViewerScreenProps = {
   navigation: any;
   route: any;
};

const ProductCommentsViewerScreen = ({
   navigation,
   route,
}: CommentsViewerScreenProps) => {
   const [comments, setComments] = useState<ProductCommentProps[]>([]);
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
               <ProductComment
                  key={String(comment.id)}
                  posterId={posterId}
                  {...comment}
               />
            );
         })}
      </ScrollView>
   );
};

export default ProductCommentsViewerScreen;

const styles = StyleSheet.create({
   container: {
      backgroundColor: "#fff",
      paddingVertical: 10,
      paddingHorizontal: 15,
   },
});
