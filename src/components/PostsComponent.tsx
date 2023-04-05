import { StyleSheet, Text, View } from 'react-native'
import React,{useEffect, useState} from 'react'
import PostComponent from './PostComponent'
import {posts as _fetchedPost} from '../data'

type PostsComponentProps = {
    navigation?:any
}

const PostsComponent = ({navigation}:PostsComponentProps) => {

  const [posts,setPosts] = useState<PostComponentProps[]>(_fetchedPost)
  const [pageNumber,setPageNumber] = useState<number>(1)
  const [numberOfPostsPerPage,setNumberOfPostsPerPage] = useState<number>(20)
  const [numberOfPageLinks,setNumberOfPageLinks] = useState<number>(0)

  useEffect(()=>{
    let fetchedPost:PostComponentProps[] = _fetchedPost
    let numOfPageLinks = Math.ceil(fetchedPost.length/numberOfPostsPerPage)
    console.log(fetchedPost)
    setPosts(fetchedPost)
    setNumberOfPageLinks(numOfPageLinks)
  },[])

  useEffect(()=>{
     const currentIndex = numberOfPostsPerPage * (pageNumber - 1)
     const lastIndex = currentIndex + numberOfPostsPerPage
     setPosts(posts.slice(currentIndex,lastIndex))
  },[pageNumber])

  return (
    <View>
      {/* <Text>PostsComponent {posts.length}</Text> */}
      {posts.map(post=>{
        return(<PostComponent key={String(post.id)} {...post} navigation={navigation}/>)
      })}
   </View>
  )
    }

export default PostsComponent

const styles = StyleSheet.create({})