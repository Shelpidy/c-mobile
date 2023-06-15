import { Skeleton } from '@rneui/themed';
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
 
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent:"center",
        alignItems:"center",
        marginVertical:8
    }
});
 
const LoadingPostComponent = () => {
    return (
        <View style={styles.container}>
            <View style={{flex:1,flexDirection:"row",justifyContent:"flex-start",gap:4,marginVertical:3}}>
                <Skeleton animation='wave' circle width={45} height={45} />
                <Skeleton style={{borderRadius:1}} animation='wave' width={110} height={15} />
                <View style={{width:190}}></View>
            </View>
            <View style={{justifyContent:"center",alignItems:"center"}}>
            <Skeleton animation='wave' style={{borderRadius:1}} width={340} height={250} />
            <Skeleton animation='wave' style={{borderRadius:1,marginVertical:4}} width={340} height={200} />
            </View>
            <View style={{flex:1,flexDirection:"row",justifyContent:"flex-start",gap:8,marginVertical:2}}>
                <Skeleton style={{borderRadius:15}} animation='wave' width={110} height={35} />
                <Skeleton style={{borderRadius:15}} animation='wave' width={110} height={35} />
                <Skeleton style={{borderRadius:15}} animation='wave' width={110} height={35} />
                
            </View>
        </View>
    );
}

 
export default LoadingPostComponent;