import { Skeleton } from '@rneui/themed';
import React from 'react';
import { View, Text, StyleSheet,Dimensions, ScrollView } from 'react-native';

const {width} = Dimensions.get("window")
 
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent:"center",
        alignItems:"center",
        marginVertical:8
    }
});
 
export const LoadingPostComponent = () => {
    return (
        <View style={styles.container}>
            <View style={{flex:1,flexDirection:"row",justifyContent:"flex-start",gap:4,margin:3}}>
                <Skeleton animation='wave' circle width={50} height={50} />
                <Skeleton style={{borderRadius:5,marginTop:4}} animation='wave' width={280} height={25} />
            </View>
            <View style={{justifyContent:"center",alignItems:"flex-start"}}>
            <Skeleton animation='wave' style={{borderRadius:5}} width={340} height={300} />
            <Skeleton animation='wave' style={{borderRadius:5,marginTop:4}} width={220} height={18} />
            <Skeleton animation='wave' style={{borderRadius:5,marginVertical:4}} width={340} height={200} />
            </View>
            <View style={{flex:1,flexDirection:"row",justifyContent:"flex-start",gap:8,marginVertical:2}}>
                <Skeleton style={{borderRadius:15}} animation='wave' width={105} height={36} />
                <Skeleton style={{borderRadius:15}} animation='wave' width={105} height={36} />
                <Skeleton style={{borderRadius:15}} animation='wave' width={105} height={36} />
                
            </View>
        </View>
    );
}


export const LoadingFindFriendComponent = () => {
    return (
        <View style={{margin:3}}>
            <View style={{justifyContent:"center",alignItems:"flex-start"}}>
            <Skeleton animation='wave' style={{borderRadius:5}} width={width/1.6} height={200} />
            <Skeleton animation='wave' style={{borderRadius:4,marginTop:4}} width={width/1.8} height={18} />
            <Skeleton animation='wave' style={{borderRadius:20,marginVertical:3,alignSelf:"center"}} width={width/1.6} height={35} />
            </View>
        </View>
    );
}


export const LoadingProductComponent = () => {
    return (
        <View style={styles.container}>
            <View style={{flex:1,flexDirection:"row",justifyContent:"flex-start",gap:4,marginVertical:3}}>
                <Skeleton animation='wave' circle width={45} height={45} />
                <Skeleton style={{borderRadius:1}} animation='wave' width={120} height={15} />
                <View style={{flex:1,flexDirection:"row",justifyContent:"flex-start",gap:8,marginVertical:2}}>
                    <Skeleton style={{borderRadius:5}} animation='wave' width={80} height={35} />
                    <Skeleton style={{borderRadius:5}} animation='wave' width={80} height={35} />
                    <Skeleton style={{borderRadius:5}} animation='wave' width={80} height={35} />
                    <Skeleton style={{borderRadius:5}} animation='wave' width={80} height={35} />
                </View>
                <View style={{flex:1,flexDirection:"row",justifyContent:"flex-start",gap:8,marginVertical:2}}>
                    <Skeleton style={{borderRadius:1}} animation='wave' width={100} height={35} />
                    <Skeleton style={{borderRadius:1}} animation='wave' width={120} height={35} />
                </View>
            </View>
        </View>
    );
}


export const LoadingProfileComponent = () => {
    return (
        <ScrollView>
            <View style={{flex:1,flexDirection:"column",justifyContent:"center",alignItems:"center",gap:4,marginVertical:3}}>
                <Skeleton animation='wave' circle width={100} height={100} />
                <Skeleton style={{borderRadius:5}} animation='wave' width={250} height={25} />
            </View>
            <View style={{flex:1,flexDirection:"row",justifyContent:"flex-start",gap:5,marginVertical:2}}>
                <Skeleton style={{borderRadius:15}} animation='wave' width={110} height={37} />
                <Skeleton style={{borderRadius:15}} animation='wave' width={110} height={37} />
                <Skeleton style={{borderRadius:15}} animation='wave' width={110} height={37} /> 
                <Skeleton style={{borderRadius:15}} animation='wave' width={110} height={37} /> 
            </View>
            <View style={{flex:1,flexDirection:"row",justifyContent:"center",gap:8,marginVertical:2}}>
                <Skeleton style={{borderRadius:5}} animation='wave' width={150} height={37} />
                <Skeleton style={{borderRadius:5}} animation='wave' width={180} height={37} />
            </View>
            <View style={{justifyContent:"center",alignItems:"center"}}>
            <Skeleton animation='wave' style={{borderRadius:5}} width={340} height={290} />
            </View>
            
            <LoadingPostComponent/>
            <LoadingPostComponent/>
        </ScrollView>
    );
}






 
