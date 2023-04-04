import { Dimensions, ScrollView, StyleSheet, Text, View } from "react-native";
import React from "react";
import { Avatar,useTheme,Button } from "react-native-paper";
import { Image } from "react-native";
import { Entypo, MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from 'expo-linear-gradient';

type ProfileScreenProps = {
   navigation: any;
};

const {width,height} = Dimensions.get("window")

const ProfileScreen = ({navigation }: ProfileScreenProps) => {
   const theme = useTheme()
   return (
      <ScrollView style={{flex:1}}>
              <LinearGradient style={[styles.container,{width:width,height:height}]} colors={["#ffffff",'#f9f9f9','#f3f3f3','#f3f3f3', '#f3f3f3']}>
              <View style={{justifyContent:"center",alignItems:"center"}}>
                   <Image source={require("../../assets/Illustrators/signin.png")} style={[styles.profileImage,{borderColor:theme.colors.primary}]}></Image>
                  <Text style={{textAlign:"center",marginVertical:10,fontFamily:"Poppins_600SemiBold"}}>Mohamed Shelpidy Kamara</Text>
               </View>
              <View style={styles.mediaContainer}>
                 <View style={{alignItems:"center"}}>
                  
                  <Text  style={{textAlign:'center',fontFamily:"Poppins_500Medium"}}>5.2k</Text>
                 <Button mode='contained-tonal'>
                       <Text style={{fontWeight:"bold",textAlign:"center",fontFamily:"Poppins_500Medium"}}>Followers</Text>
                  </Button>
                 </View>
                 <View style={{alignItems:"center"}}>
                  <Text style={{textAlign:'center',fontFamily:"Poppins_500Medium"}}>220</Text>
                 <Button mode='contained-tonal'>
                      <Text style={{fontWeight:"bold",textAlign:"center",fontFamily:"Poppins_300Light"}} >Follows</Text >
                  </Button>
                 </View>
                 <View style={{alignItems:"center"}}>
                  
                  <Text style={{textAlign:'center',fontFamily:"Poppins_500Medium"}}>200</Text>
                <Button mode="contained-tonal">
                      <Text style={{fontWeight:"bold",textAlign:"center",fontFamily:"Poppins_300Light"}}>Posts</Text>
                  </Button>
                 </View>
              </View>
         <View>
         </View>
         <View  style={styles.navs}>
            <View style={styles.navLink}><MaterialCommunityIcons name='cog'/><Text style={{fontFamily:"Poppins_500Medium"}}>Settings</Text><Button mode='contained-tonal'><Entypo name="chevron-thin-right"/></Button></View>
            <View style={styles.navLink}><MaterialCommunityIcons name='cog'/><Text style={{fontFamily:"Poppins_500Medium"}}>Posts</Text><Button mode='contained-tonal'><Entypo name="chevron-thin-right"/></Button></View>
            <View style={styles.navLink}><MaterialCommunityIcons name='cog'/><Text style={{fontFamily:"Poppins_500Medium"}}>Send Money</Text><Button mode='contained-tonal'><Entypo name="chevron-thin-right"/></Button></View>
            <View style={styles.navLink}><MaterialCommunityIcons name='cog'/><Text style={{fontFamily:"Poppins_500Medium"}}>Transferees</Text><Button mode='contained-tonal'><Entypo name="chevron-thin-right"/></Button></View>
            <View style={styles.navLink}><MaterialCommunityIcons name='cog'/><Text style={{fontFamily:"Poppins_500Medium"}}>Logout</Text><Button mode='contained-tonal'><Entypo name="chevron-thin-right"/></Button></View>

         </View>
            </LinearGradient>
      </ScrollView>
   );
};

export default ProfileScreen;

const styles = StyleSheet.create({
   container: {
      paddingTop:20,
      flex: 1,
      backgroundColor:"#F9F9F9",
      alignItems: "center",
      // justifyContent: "center",
      fontFamily: "Poppins_300Light",
   },
   mediaContainer:{
      display:"flex",
      flexDirection:'row',
      justifyContent:"center",
      gap:10,
      marginTop:0,
      marginBottom:8
   },
   profileImage:{
      width:100,
      height:100,
      borderRadius:100,
      borderWidth:4,
   },
   navs:{
      backgroundColor:"#fff",
      // flex:1,
      width:width - 40,
      borderRadius:45,
      // marginBottom:120,
      padding:20,
      // alignItems:'center'
   },
   navLink:{
      flexDirection:"row",
      alignItems:"center",
      justifyContent:"space-between",
      marginVertical:1,
      // backgroundColor:"#f9f9f9",
      paddingVertical:6,
      paddingHorizontal:25,
      borderRadius:20
   }
});
