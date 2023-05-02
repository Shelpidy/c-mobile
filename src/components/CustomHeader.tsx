import { useNavigation } from "@react-navigation/native";
import React,{useState,useEffect} from "react";
import { StyleSheet, Text, View,Button,Alert } from "react-native";
import { Appbar, FAB, useTheme } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Drawer } from 'react-native-drawer-layout';
import { AntDesign, Feather } from "@expo/vector-icons";
import { Image } from "react-native";

type CustomHeaderProps = {
   navigation: any;
};

const CustomHeader = ({ navigation }: CustomHeaderProps) => {
   const [open, setOpen] = React.useState(false);
   const [loading, setLoading] = useState<boolean>(false);
   const [user, setUser] = useState<User>();
   const [currentUser, setCurrentUser] = useState<CurrentUser>({});
   const [activeTab,setActiveTab] = useState<number>(0)
   const theme = useTheme()

   let _navigation = useNavigation();

      useEffect(() => {
      // dispatchPostComment({ type: "", payload: "" });
      setCurrentUser({
         id: 1,
         email: "mexu.company@gmail.com",
         accountNumber: "1COM10000000000",
      });
   }, []);

     useEffect(function () {
      console.log("Fetching user");
      setLoading(true);
      let fetchData = async () => {
         // console.log("Fetching user")
          let activeUserId = 1
         try {
            let response = await fetch(
               `http://192.168.0.106:5000/api/auth/users/${activeUserId}`,
               { method: "GET" }
            );
            let data = await response.json();
            if (data.status == "success") {
               // console.log("Users-----", data.data);
              setUser(data.data.personal);
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
   }, []);

   const gotoNextScreen = (screenName:string,params?:any)=>{
      if(screenName === 'HomeScreen') {
         setActiveTab(0)
         if(params){
       navigation.push(screenName,params)
      }else{
          navigation.push(screenName)
      }
      }
      else if (screenName === 'NotificationScreen') {
         setActiveTab(1)
         if(params){
       navigation.push(screenName,params)
      }else{
          navigation.push(screenName)
      }
      }
      else if (screenName === 'MarketingScreen') {
         setActiveTab(2)
         if(params){
       navigation.push(screenName,params)
      }else{
          navigation.push(screenName)
      }
      }
      else if (screenName === 'ProductsRequestScreen') {
         setActiveTab(3)
         if(params){
       navigation.push(screenName,params)
      }else{
          navigation.push(screenName)
      }
      }
      else if (screenName === 'SearchScreen') {
         setActiveTab(4)
         if(params){
       navigation.push(screenName,params)
      }else{
          navigation.push(screenName)
      }
      }
      else if (screenName === 'ProfileScreen') {
         setActiveTab(5)
         if(params){
       navigation.push(screenName,params)
      }else{
          navigation.push(screenName)
      }
      }


      
     

   }


   return (
      <Appbar.Header style={{alignItems:"center"}}>
         {/* <Appbar.Content title="C" /> */}
         {_navigation.canGoBack() && (
            <Appbar.BackAction onPress={() => _navigation.goBack()} />
         )}
         <Appbar.Action
         
           style={{alignItems:"center",flexDirection:"row"}}
           icon={()=><Feather color={activeTab === 0?theme.colors.primary:theme.colors.secondary} size={20} name='home' />}
            onPress={() => navigation.push("HomeScreen")}
         />
         <Appbar.Action
          
         style={{alignItems:"center",flexDirection:"row"}}
           icon={()=><Feather color={activeTab === 1?theme.colors.primary:theme.colors.secondary} size={20} name='bell'/>}
            onPress={() => gotoNextScreen("NotificationScreen")}
         />
          <Appbar.Action
         
         style={{alignItems:"center",flexDirection:"row",justifyContent:"center"}}
           icon={()=><Feather color={activeTab === 2?theme.colors.primary:theme.colors.secondary} size={20} name='shopping-bag'/>}
            onPress={() => gotoNextScreen("MarketingScreen")}
         />
           <Appbar.Action icon={()=><Feather color={activeTab === 3?theme.colors.primary:theme.colors.secondary} size={20} name='shopping-cart'/>} onPress={() =>gotoNextScreen("ProductsRequestScreen")} />
           <Appbar.Action icon={()=><Feather color={activeTab === 4?theme.colors.primary:theme.colors.secondary} size={20} name='search'/>} onPress={() => gotoNextScreen("SearchScreen")} />
           {/* <Appbar.Action icon={()=><Feather size={20} name='users'/>} onPress={() =>setOpen(!open)} /> */}
         <Appbar.Action  onPress={()=>gotoNextScreen("ProfileScreen",{userId:currentUser.id})} icon={()=>
              <Image
                    resizeMode="cover"
                     style={styles.profileImage}
                     source={{ uri: user?.profileImage }}
                  />
         } />
       

      </Appbar.Header>
   );
};

export default CustomHeader;

const styles = StyleSheet.create({
      profileImage: {
      width: 28,
      height: 28,
      borderRadius: 20,
      justifyContent:"center",
      alignItems:"center"
   },
});
