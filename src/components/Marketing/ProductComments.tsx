import { StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import ProductComment from "./ProductComment";
import { Button, Divider } from "react-native-paper";

type ProductCommentsProps = {
   productComments: CommentProps[];
   posterId?: number;
   navigation?: any;
};

const ProductComments = ({ productComments, posterId, navigation }: ProductCommentsProps) => {
   const [productCommentsToShow, setProductCommentsToShow] = useState<typeof productComments>([]);

   useEffect(() => {
      setProductCommentsToShow(productComments.slice(0, 1));
      console.log(productComments)

   }, []);

   return (
      <View>
         <Divider style={{ marginTop: 10 }} />
         {/* <Text>ProductComments</Text> */}

         {productCommentsToShow?.map((comment) => {
            return (
               <ProductComment
                  key={String(comment.id)}
                  posterId={posterId}
                  {...comment}
               />
            );
         })}
         {
            productComments.length > 1 &&
            <Button
            onPress={() =>
               navigation.navigate("ProductCommentsViewerScreen", {
                  ProductComments,
                  posterId,
               })
            }>
            Show more ProductComments...
         </Button>
         }
         
      </View>
   );
};

export default ProductComments;

const styles = StyleSheet.create({});
