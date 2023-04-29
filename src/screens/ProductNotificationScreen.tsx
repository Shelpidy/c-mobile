import { StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'

const ProductNotificationScreen = ({notification}:any) => {

  const [affiliate,setAffiliate] = useState<User | null>(null)
  const [owner,setOwner] = useState<User | null>(null)
  const [product,setProduct] = useState<Product | null>(null)
  
  return (
    <View>
      <Text>ProductNotificationScreen</Text>
    </View>
  )
}

export default ProductNotificationScreen

const styles = StyleSheet.create({})