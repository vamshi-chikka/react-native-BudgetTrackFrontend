import {View,Text,StyleSheet,TouchableOpacity,TextInput, Alert} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import React, {useState} from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useNavigation} from '@react-navigation/native';
import { AUTH_ENDPOINTS } from '../../Constants/api';
import { CALLAPI } from '../../network/RNRestClient';



export default function VerifyScreen({route}){
    const navigation = useNavigation();
    const {email} = route.params;
    const [error, setError] = useState("");
    const [otp, setOtp] = useState('');
    const onVerifyEmail = async () =>{
        const trimmedOtp = otp.trim();
        if (!trimmedOtp) {
            setError('Please enter the OTP');
            return;
        }

        try {
            const response = await CALLAPI.post<{status?: string; message?: string}>(AUTH_ENDPOINTS.VERIFY, {
                email: email.trim().toLowerCase(),
                otp: trimmedOtp,
            });

            if (response?.status === 'ok') {
                Alert.alert("Success", "Email verified successfully. You can now login to your account.");
                navigation.navigate("LoginScreen");
            } else {
                setError(response?.message || 'OTP verification failed');
            }
        } catch (requestError: any) {
            setError(requestError?.message || 'Unable to verify OTP');
        }
    }
    return(
        <SafeAreaView style={styles.verifycontainer}>
            <Text style={styles.titletext}>Verify your email</Text>
            {error ? (
                <View style={styles.errorcontainer}>
                    <Ionicons name="alert-circle" size={20} color={'red'}/>
                    <Text style={styles.errortext}>{error}</Text>
                    <TouchableOpacity onPress={()=>setError("")}>
                        <Ionicons name="close" size={20} color={'grey'}/>
                    </TouchableOpacity>
                </View>
            ): null}
            <TextInput
                placeholder="Enter your verification code"
                placeholderTextColor={'grey'}
                value={otp}
                onChangeText={setOtp}
                style={[styles.textinput,{marginHorizontal:20,marginVertical:20,width:'90%',textAlign:'center'}]}
                keyboardType='number-pad'
            />
            <TouchableOpacity style={styles.button} onPress={() =>onVerifyEmail()}>
                <Text style={styles.buttontext}>Verify Email</Text>
            </TouchableOpacity>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    verifycontainer:{
        flex:1,
        justifyContent:'center',
        backgroundColor:'#FFF8F3',
        alignItems:'center'
    },
        titletext:{
        fontWeight:'bold',
        textAlign:'center',
        fontSize:26,
        color:'#4A3428',   
    },
    errorcontainer:{
        backgroundColor:'#FFE5E5',
        flexDirection:'row',
        borderLeftWidth:4,
        borderLeftColor:'red',
        alignItems:'center',
        borderRadius:10,
        padding:12,
        marginHorizontal:20
    },
    errortext:{
        fontSize:14,
        marginLeft:9,
        color:'black',
        flex:1,
        flexGrow:1
    },
    textinput:{
        borderWidth:0.2,
        padding:12,
        fontSize:16,
        borderRadius:8,
        color:'black',
        backgroundColor:'#fff'
    },
    button:{
        backgroundColor:'#4A3428',
        padding:10,
        borderRadius:8,
    },
    buttontext:{
        color:'white',
        fontSize:18,
        fontWeight:'500',
        textAlign:'center',   
    },
})