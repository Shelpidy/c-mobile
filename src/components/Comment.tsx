import { Modal, StyleSheet, Text, View } from 'react-native'
import React,{useEffect,useState} from 'react'

const Comment = (props:CommentProps) => {

  const [currentUser,setCurrentUser] = useState<CurrentUser>({})
  const [openModal,setOpenModal] = useState<boolean>(false)

  useEffect(()=>{
    setCurrentUser({id:props?.id,email:"mexu.company@gmail.com",accountNumber:"1COM30000000000"})
  },[])


  return (
    <View>
        <Modal visible={openModal}>
            <View>
                <Text>Comment Editor</Text>
            </View>
        </Modal>
       {currentUser.id == props?.userId || currentUser.id == props?.posterId &&  <View><Text>Can edit the comment</Text></View>}
      <Text>Comment</Text>
      <Text>Comment Likes</Text>
    </View>
  )
}

export default Comment

const styles = StyleSheet.create({})