import {
   StyleSheet,
   Text,
   View,
   Alert,
   FlatList,
   Dimensions,
} from "react-native";
import React, { useEffect, useState } from "react";
import Comment from "./Comment";
import { Button, Divider, ActivityIndicator } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import { useCurrentUser } from "../../utils/CustomHooks";
import { Skeleton } from "@rneui/themed";

type CommentsProps = {
   postId: number;
   userId?: number;
   refetchId:number
};

type FetchComment = {
   comment: PostComment;
   repliesCount: number;
   likesCount: number;
   liked: boolean;
   user: User;
};

const { width, height } = Dimensions.get("window");

const Comments = ({ postId, userId,refetchId }: CommentsProps) => {
   const [comments, setComments] = useState<FetchComment[] | null>(null);
   const [loading, setLoading] = useState(false);
   const [page, setPage] = useState(0);
   const [hasMore, setHasMore] = useState(true);
   const navigation = useNavigation<any>();
   const currentUser = useCurrentUser();

   const fetchComments = async () => {
      let pageNumber = page + 1
      console.log("Page number",pageNumber)
      try {
         setLoading(true);
         if (currentUser && postId) {
            let response = await fetch(
               `http://192.168.182.183:5000/api/media/posts/${postId}/comments/${currentUser?.id}/${pageNumber}/5`
            );
            let { data } = await response.json();
            if (response.ok) {
               setComments((prevComments) =>
                  prevComments ? [...prevComments, ...data] : data
               );
               console.log("Comments=>", data);
               setLoading(false);
            } else {
               Alert.alert("Failed", data.message);
               setLoading(false);
            }
         }
         setLoading(false);
      } catch (err) {
         console.log("From Comments", String(err));
         Alert.alert("Failed", String(err));
         setLoading(false);
      }
     
   };

   useEffect(() => {
      fetchComments();
   }, [currentUser, postId,refetchId]);

   const handleLoadMore = () => {
      console.log("Comments reached end")
      fetchComments();
   };

   const renderFooter = () => {
      if (!loading) return null;
      return (
         <View style={{ padding: 10 }}>
            <ActivityIndicator size="small" />
         </View>
      );
   };

   const renderItem = ({ item }: any) => (
      <Comment
         key={String(item.comment.id)}
         posterId={userId}
         comment={item.comment}
         user={item.user}
         likesCount={item.likesCount}
         repliesCount={item.repliesCount}
         liked={item.liked}
      />
   );

   const renderSkeleton = () => (
      <View
         style={{
            flex: 1,
            flexDirection: "row",
            justifyContent: "flex-start",
            gap: 4,
            margin: 3,
         }}>
         <Skeleton animation="wave" circle width={50} height={50} />
         <Skeleton
            style={{ borderRadius: 5, marginTop: 4 }}
            animation="wave"
            width={width - 70}
            height={80}
         />
      </View>
   );

   return (
      <FlatList
         data={comments}
         renderItem={renderItem}
         keyExtractor={(item) => String(item?.comment?.id)}
         onEndReached={handleLoadMore}
         onEndReachedThreshold={0.5}
         ListFooterComponent={renderFooter}
         ListEmptyComponent={renderSkeleton}
      />
   );
};

export default Comments;

const styles = StyleSheet.create({});
