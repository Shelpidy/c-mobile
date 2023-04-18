import { StyleSheet, Text, View,Alert,Pressable,Image,TextInput, Dimensions } from 'react-native'
import React,{useEffect,useState} from 'react'
import { Fontisto } from '@expo/vector-icons';
import { Skeleton } from '@rneui/base';

type UserComponentProps = {
   navigation:any,
   _user:User,
}

const UserComponent = ({navigation,_user}:UserComponentProps) => {

   const [poster, SetPoster] = useState<any>(null);
   const [user, SetUser] = useState<User | null>(null);
   const [loading, setLoading] = useState<boolean>(false);
   const [currentUser,setCurrentUser] = useState<CurrentUser>({})
   const {width,height} = Dimensions.get('window')

    useEffect(() => {
      // dispatchPostComment({ type: "", payload: "" });
      SetUser(_user)
      setCurrentUser({
         id: 1,
         email: "mexu.company@gmail.com",
         accountNumber: "1COM10000000000",
      });
   }, []);

//     useEffect(function () {
//       console.log("Fetching user");
//       let user:CurrentUser = {
//          id: 1,
//          email: "mexu.company@gmail.com",
//          accountNumber: "1COM10000000000",
//       }
      
//       setCurrentUser(user);

//       setLoading(true);
//       let fetchData = async () => {
//          // console.log("Fetching user")
//          //  let activeUserId = 1
//          try {
//             let response = await fetch(
//                `http://192.168.0.106:5000/api/auth/users/${user.id}`,
//                { method: "GET" }
//             );
//             let data = await response.json();
//             if (data.status == "success") {
//                console.log("Users-----", data.data);
//                SetPoster(data.data.personal);
//                // Alert.alert("Success",data.message)
//                setLoading(false);
//             } else {
//                Alert.alert("Failed", data.message);
//             }
//             setLoading(false);
//          } catch (err) {
//             console.log(err);
//             Alert.alert("Failed", String(err));
//             setLoading(false);
//          }
//       };
//       fetchData();
//    }, []);
   
   const gotoUserProfile = ()=>{
    if(currentUser.id === poster.id) {
       navigation.navigate("ProfileScreen",{userId:poster.id})
    }else{
        navigation.navigate("UserProfileScreen",{userId:poster.id})
     }
   }

  if(!user){
   return <View><Skeleton circle height={50} style={{marginRight:5}} animation='wave' width={50}/><Skeleton height={50} animation='wave' width={width - 10}/></View>
  }
  return (
    <View style={{backgroundColor:"#ffffff",margin:5, borderRadius:20}}>
     {user && (
            <View
               style={{
                  flexDirection: "row",
                  alignItems: "center",
                  paddingHorizontal: 20,
                  paddingVertical:5,
                 
               }}>
                  <Pressable onPress={gotoUserProfile}>
                       <Image
                        style={styles.profileImage}
                        source={{ uri: user.profileImage }}
                     />
                  </Pressable>
              <View style={{paddingRight:20,flexDirection:'column',alignItems:'flex-start',margin:10,paddingHorizontal:5}}>
                   <Text style={{fontFamily:"Poppins_400Regular"}}>{user?.firstName} {user?.middleName} {user?.lastName}</Text>
                   <View></View>
                    {/* <Pressable onPress={()=> navigation.navigate("PostScreen",{openImagePicker:true})} style={{paddingHorizontal:15,height:50,alignItems:"center",justifyContent:"center",borderTopRightRadius:20,borderBottomRightRadius:20,backgroundColor:"#ffffff"}}><Fontisto size={20} name='photograph'/></Pressable> */}
                </View>
            </View>
         )}
    </View>
  )
}

export default UserComponent

const styles = StyleSheet.create({
     profileImage: {
      width: 35,
      height: 35,
      borderRadius: 20,
   },
})