import React from 'react';
import { Pressable , StyleSheet, Alert } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useDispatch} from 'react-redux';
import {userLogout} from '../redux/userSlice';
import {logout} from '../redux/authSlice';
import {persistor} from '../redux/store';

export default function Logout(){
    const dispatch = useDispatch();
    const handleLogout = async() =>{
        try {
            await AsyncStorage.removeItem('token');
            dispatch(userLogout());
            dispatch(logout());
            await persistor.purge();
        } catch (error) {
            console.error('Logout error:', error);
            Alert.alert('Logout failed', 'Unable to clear the session. Please try again.');
        }
    }
    return(
        <Pressable 
            style={styles.exitbutton}
            onPress={()=>handleLogout()}
        >
            <Ionicons name="exit-outline" size={22} color={'black'}/>
        </Pressable>
    )
}
const styles = StyleSheet.create({
    exitbutton:{
        height:40,
        width:40,
        borderRadius:20,
        backgroundColor:'#fff',
        justifyContent:'center',
        alignItems:'center'
    }
})