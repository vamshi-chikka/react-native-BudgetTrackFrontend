import React from 'react';
import { ActivityIndicator } from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';

export default function Loader(){
    return(
        <SafeAreaView style={{flex:1,backgroundColor:'#FFF8F3',justifyContent:'center',alignItems:'center'}}>
            <ActivityIndicator size="small"/>
        </SafeAreaView>
    )
}