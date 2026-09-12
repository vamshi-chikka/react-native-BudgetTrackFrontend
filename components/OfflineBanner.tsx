import React,{useContext} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {NetworkContext} from '../context/NetworkProvider';
import {Text,StyleSheet} from 'react-native';

export default function OfflineBanner(){
    const {isConnected} = useContext(NetworkContext);
    if(isConnected === true) return null;
    return(
        <SafeAreaView style={styles.container}>
            <Text style={styles.text}>No Internet Connection</Text>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:'#FFF8F3',
        justifyContent:'center',
        alignItems:'center'
    },
    text:{
        color:'#4A3428',
        textAlign:'center',
        fontWeight:'bold'
    }
})