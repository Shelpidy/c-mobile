import { Modal, StyleSheet, Text, View,Image } from 'react-native'
import React,{useEffect,useState} from 'react'
import { users } from '../data'
import { Feather, SimpleLineIcons } from '@expo/vector-icons'
import { Button } from 'react-native-paper'
const Comment = (props:CommentProps) => {

  const [currentUser,setCurrentUser] = useState<CurrentUser>({})
  const [openModal,setOpenModal] = useState<boolean>(false)
  const [commentor,setCommentor] = useState<any>(null)

  useEffect(()=>{
    setCommentor(users.find(user => user.id === props.userId))
    // console.log(commentor)
    setCurrentUser({id:props?.id,email:"mexu.company@gmail.com",accountNumber:"1COM30000000000"})
  },[users])

  return (
    <View  style={styles.container}>
        <Modal visible={openModal}>
            <View>
                <Text>Comment Editor</Text>
            </View>
        </Modal>
        {
            commentor && 
            <View >
               
              <View style={styles.commentorMedia}>
                <Image style={styles.profileImage} source={{uri:commentor.profileImage}}/>
                <View style={{backgroundColor:"#f9f9f9",flex:1,borderRadius:5,paddingHorizontal:4,paddingVertical:6}}>
                    <Text style={styles.userFullName}>{commentor.firstName} {commentor.middleName} {commentor.lastName}</Text>
                      <Text style={{fontFamily:"Poppins_300Light"}}>{props.text}</Text>
                     {/* <Text>Comment Likes</Text>  */}
                     <View style={{justifyContent:"flex-end",alignItems:"flex-end",marginTop:2,paddingHorizontal:5,borderRadius:3}}>
                       {currentUser.id == props?.userId || currentUser.id == props?.posterId &&  <View><Button mode='contained-tonal'><Feather name='edit'/>Edit</Button></View>}
                </View>
                </View>
                </View>
                 
                
            </View>
      }
    </View>
  )
}

export default Comment

const styles = StyleSheet.create({
    container:{
        backgroundColor:"#ffffff",
        marginVertical:6
    },
    profileImage:{
        width:28,
        height:28,
        borderRadius:15,
      
    },
    commentorMedia:{
        flexDirection:"row",
        gap:8
    },
    userFullName:{
        fontFamily:"Poppins_600SemiBold"
    }
})