import { Modal, StyleSheet, Text, View,Image } from 'react-native'
import React,{useEffect,useState} from 'react'
import { users } from '../data'

const Comment = (props:CommentProps) => {

  const [currentUser,setCurrentUser] = useState<CurrentUser>({})
  const [openModal,setOpenModal] = useState<boolean>(false)
  const [commentor,setCommentor] = useState<any>(null)

  useEffect(()=>{
    setCommentor(users.find(user => user.id === props.userId))
    console.log(commentor)
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
            <View style={styles.commentorMedia}>
                 {currentUser.id == props?.userId || currentUser.id == props?.posterId &&  <View><Text>Can edit the comment</Text></View>}
                <Image style={styles.profileImage} source={{uri:commentor.profileImage}}/>
                <View>
                      <Text>{props.text}</Text>
                     <Text>Comment Likes</Text> 
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
        marginVertical:8
    },
    profileImage:{
        width:28,
        height:28,
        borderRadius:15,
      
    },
    commentorMedia:{
        flexDirection:"row",
        gap:8
    }
})