import { Dimensions, StyleSheet, Text, View } from "react-native";
import React from "react";
import { Entypo, MaterialCommunityIcons } from "@expo/vector-icons";
import { Button } from "react-native-paper";


const { width } = Dimensions.get("window");

const ProfileNavComponent = ({ navigation,user }:any) => {
   return (
      <View style={styles.navs}>
         <View style={styles.navLink}>
            <MaterialCommunityIcons name="cog" />
            <Text style={{ fontFamily: "Poppins_500Medium" }}>Settings</Text>
            <Button>
               <Entypo name="chevron-thin-right" />
            </Button>
         </View>
         <View style={styles.navLink}>
            <MaterialCommunityIcons name="cog" />
            <Text style={{ fontFamily: "Poppins_500Medium" }}>Posts</Text>
            <Button>
               <Entypo name="chevron-thin-right" />
            </Button>
         </View>
          <View style={styles.navLink}>
            <MaterialCommunityIcons name="cog" />
            <Text style={{ fontFamily: "Poppins_500Medium" }}>Products</Text>
               <Button onPress={() => navigation.navigate("UserProductScreen",{user})}>
               <Entypo name="chevron-thin-right" />
            </Button>
         </View>
         <View style={styles.navLink}>
            <MaterialCommunityIcons name="cog" />
            <Text style={{ fontFamily: "Poppins_500Medium" }}>Send Money</Text>
            <Button onPress={() => navigation.navigate("TransferMoneyScreen")}>
               <Entypo name="chevron-thin-right" />
            </Button>
         </View>
         <View style={styles.navLink}>
            <MaterialCommunityIcons name="cog" />
            <Text style={{ fontFamily: "Poppins_500Medium" }}>Transferees</Text>
            <Button>
               <Entypo name="chevron-thin-right" />
            </Button>
         </View>
         <View style={styles.navLink}>
            <MaterialCommunityIcons name="cog" />
            <Text style={{ fontFamily: "Poppins_500Medium" }}>Logout</Text>
            <Button>
               <Entypo name="chevron-thin-right" />
            </Button>
         </View>
      </View>
   );
};

export default ProfileNavComponent;

const styles = StyleSheet.create({
   navs: {
      backgroundColor: "#fff",
      // flex:1,
      width: width - 40,
      borderRadius: 45,
      // marginBottom:120,
      padding: 20,
      // alignItems:'center'
   },
   navLink: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginVertical: 1,
      // backgroundColor:"#f9f9f9",
      paddingVertical: 1,
      paddingHorizontal: 25,
      borderRadius: 20,
   },
});
