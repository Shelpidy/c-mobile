import { StyleSheet, Text, View,TextInput,Pressable} from 'react-native'
import React, { useState } from 'react'
import { EvilIcons } from '@expo/vector-icons'
type SearchProps = {
    setSearchValue:(value:string)=>void
}

const SearchForm = ({setSearchValue}:SearchProps) => {
    const [searchValue,_setSearchValue] = useState('')
     const handleSearch = ()=>{
        setSearchValue(searchValue)
        console.log(searchValue)
     }
  return (
     <View style={{paddingHorizontal:15,flexDirection:"row",alignItems:"center",justifyContent:"center"}}>
        <TextInput onChangeText={(v)=> _setSearchValue(v)} style={{flex:1,backgroundColor:"#FFFFFF",borderTopLeftRadius:20,borderBottomLeftRadius:20,height:50,paddingHorizontal:25}}/>
        <Pressable onPress={handleSearch} style={{paddingHorizontal:15,height:50,alignItems:"center",justifyContent:"center",borderTopRightRadius:20,borderBottomRightRadius:20,backgroundColor:"#ffffff"}}><EvilIcons name='search' size={30} /></Pressable>
    </View>
  )
}

export default SearchForm

const styles = StyleSheet.create({})