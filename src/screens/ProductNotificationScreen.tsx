import { StyleSheet, Text, View, Alert, ScrollView } from "react-native";
import React, { useState, useEffect } from "react";
import UserComponent from "../components/UserComponent";
import ProductComponent from "../components/Marketing/ProductComponent";
import NotificationProductReviewComponent from "../components/Notification/NotificationProductReviewComponent";

const ProductNotificationScreen = ({ navigation, route }: any) => {
   const [owner, setOwner] = useState<User | null>(null);
   const [product, setProduct] = useState<ProductComponentProps | null>(null);
   const [loading, setLoading] = useState<boolean>(false);

   useEffect(
      function () {
         console.log("Fetching user");
         setLoading(true);
         let fetchData = async () => {
            // console.log("Fetching user")
            //  let activeUserId = 1
            try {
               let response = await fetch(
                  `http://192.168.99.44:5000/api/notifications/product/${route.params.productId}`,
                  { method: "GET" }
               );
               let data = await response.json();
               if (data.status == "success") {
                  console.log("Data-----", data.data);
                  setOwner(data.data.owner);
                  setProduct(data.data.product);
                  // Alert.alert("Success",data.message)
                  setLoading(false);
               } else {
                  Alert.alert("Failed", data.message);
               }
               setLoading(false);
            } catch (err) {
               console.log(err);
               Alert.alert("Failed", String(err));
               setLoading(false);
            }
         };
         fetchData();
      },
      [route.params]
   );

   return (
      <ScrollView style={{ backgroundColor: "#f5f5f5" }}>
         <Text>ProductNotificationScreen</Text>
         {owner && (
            <View>
               <UserComponent _user={owner} navigation={navigation} />
               {product && (
                  <NotificationProductReviewComponent
                     buyerId={owner?.id}
                     props={product}
                  />
               )}
            </View>
         )}
      </ScrollView>
   );
};

export default ProductNotificationScreen;

const styles = StyleSheet.create({});
