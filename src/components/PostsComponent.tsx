import { StyleSheet, Text, View } from 'react-native'
import React,{useEffect, useState} from 'react'
import PostComponent from './PostComponent'

type PostsComponentProps = {
    navigation?:any
}

const PostsComponent = ({navigation}:PostsComponentProps) => {
    
  const [posts,setPosts] = useState<PostComponentProps[]>([])
  const [pageNumber,setPageNumber] = useState<number>(1)
  const [numberOfPostsPerPage,setNumberOfPostsPerPage] = useState<number>(20)
  const [numberOfPageLinks,setNumberOfPageLinks] = useState<number>(0)

  useEffect(()=>{
    let fetchedPost:PostComponentProps[] = []
    let numOfPageLinks = Math.ceil(fetchedPost.length/numberOfPostsPerPage)
    setNumberOfPageLinks(numOfPageLinks)
  },[])

  useEffect(()=>{
     const currentIndex = numberOfPostsPerPage * (pageNumber - 1)
     const lastIndex = currentIndex + numberOfPostsPerPage
     setPosts(posts.slice(currentIndex,lastIndex))
  },[pageNumber])

  return (
    <View>
      <Text>PostsComponent</Text>
      {posts.map(post=>{
        return(<PostComponent key={post.id} navigation={navigation}/>)
      })}
   </View>
  )
    }

export default PostsComponent

const styles = StyleSheet.create({})