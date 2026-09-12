import React,{useState,useContext} from 'react';
import {View, Text, StyleSheet,Image, Pressable, TextInput, TouchableOpacity,ScrollView, StatusBar, KeyboardAvoidingView,Platform, Alert, ActivityIndicator} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {AUTH_ENDPOINTS} from '../../Constants/api';
import {useDispatch} from 'react-redux';
import {userLogin} from '../../redux/userSlice';
import { NetworkContext } from '../../context/NetworkProvider';
import OfflineBanner from '../../components/OfflineBanner';
import { login } from '../../redux/authSlice';
import { CALLAPI } from '../../network/RNRestClient';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function LoginScreen(){
    const [email,setEmail] = useState('');
    const [emailError, setEmailError] = useState('');
    const [password, setPassword] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const navigation = useNavigation();
    const dispatch = useDispatch();
    const {isConnected} = useContext(NetworkContext);

    if(!isConnected){
        return <OfflineBanner/>
    }

    const validateEmail = (email: string) => {
        if (!email.trim()) {
            setEmailError('Email is required');
            return false;
        }
        if (!EMAIL_REGEX.test(email)) {
            setEmailError('Please enter a valid email');
            return false;
        }
        setEmailError('');
        return true;
    }

    const validatePassword = (password: string) => {
        if (!password.trim()) {
            setPasswordError('Password is required');
            return false;
        }
        if (password.length < 6) {
            setPasswordError('Password must be at least 6 characters');
            return false;
        }
        setPasswordError('');
        return true;
    }

    const handleLogin = async () => {
        if (!validateEmail(email) || !validatePassword(password)) {
            return;
        }

        setIsLoading(true);
        try {
            const userData = {
                email: email.trim(),
                password: password.trim()
            };

            const response = await CALLAPI.post<{status?: string; data?: { token: string; oldUser: any } }>(AUTH_ENDPOINTS.LOGIN, userData);

            if (response?.status === 'ok' && response?.data) {
                const token = response.data.token;
                const user = response.data.oldUser;

                await AsyncStorage.setItem('token', token);
                dispatch(userLogin({
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    mobile: user.mobile,
                    createdAt: user.createdAt
                }));
                dispatch(login());
            } else {
                Alert.alert('Login Failed', 'Invalid credentials. Please try again.');
            }
        } catch (error: any) {
            const errorMessage = error?.message || 'Failed to login. Please check your credentials and try again.';
            Alert.alert('Error', errorMessage);
            console.error('Login error:', error);
        } finally {
            setIsLoading(false);
        }
    }

    return(
        <KeyboardAvoidingView
            style={styles.container}
            behavior ={Platform.OS ==='ios' ?'padding': 'height'}
        >
        <ScrollView 
            keyboardShouldPersistTaps='handled'
            contentContainerStyle={{paddingBottom:30}}
            showsVerticalScrollIndicator={false}   
        >
            <StatusBar barStyle='dark-content'/>
            <View style={styles.imagecontainer}>
                <Image source={require('../../assets/images/revenue-i4.png')}
                    style={{width:'100%',height:300,resizeMode:'contain'}}
                />
            </View>
            <View style={styles.inputcontainer}>
                <Text style={styles.titletext}>Welcome Back</Text>
                <View style={{gap:15,marginVertical:15,}}>
                    <View>
                        <TextInput
                            placeholder="Enter email"
                            placeholderTextColor={'grey'}
                            value={email}
                            onChangeText={(text) => {
                                setEmail(text);
                                if (emailError) validateEmail(text);
                            }}
                            onBlur={() => validateEmail(email)}
                            style={[styles.textinput, emailError ? {borderColor: 'red'} : {}]}
                            editable={!isLoading}
                            keyboardType="email-address"
                            autoCapitalize="none"
                        />
                        {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}
                    </View>

                    <View>
                        <View 
                        style={[styles.passwordContainer, passwordError ? {borderColor: 'red'} : {}]}>
                        <TextInput
                            placeholder="Enter password"
                            placeholderTextColor={'grey'}
                            value={password}
                            onChangeText={(text) => {
                                setPassword(text);
                                if (passwordError) validatePassword(text);
                            }}
                            onBlur={() => validatePassword(password)}
                            style={{flex:1,fontSize:16,color:'black'}}
                            secureTextEntry={!showPassword}
                            editable={!isLoading}
                        />
                        <TouchableOpacity onPress={()=>setShowPassword(!showPassword)} disabled={isLoading}>
                            {password.length > 0 && (
                                <Ionicons name={showPassword ? "eye-outline" : "eye-off-outline"} size={24} color={'grey'}/>
                            )}
                        </TouchableOpacity>
                        </View>
                        {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}
                    </View>
                </View>

                <TouchableOpacity 
                    style={[styles.button, isLoading && {opacity: 0.6}]} 
                    onPress={handleLogin}
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <ActivityIndicator size="small" color="#fff" />
                    ) : (
                        <Text style={styles.buttontext}>Sign in</Text>
                    )}
                </TouchableOpacity>

                <View style={{flexDirection:'row',marginVertical:15,justifyContent:'center',gap:5}}>
                    <Text style={styles.bottomtext}>Don't have an account?</Text>
                    <Pressable onPress={()=>navigation.navigate('RegisterScreen' as any)} disabled={isLoading}>
                        <Text style={[styles.bottomtext,{color:'#4A3428',fontWeight:'500'}]}>Sign up</Text>
                    </Pressable>
                </View>
            </View>
        </ScrollView>
        </KeyboardAvoidingView>
    )
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:'#FFF8F3'
    },
    imagecontainer:{
        marginHorizontal:20,
        marginTop:80,
        marginBottom:10
    },
    inputcontainer:{
        marginHorizontal:20,
        marginTop:20
    },
    titletext:{
        fontWeight:'bold',
        textAlign:'center',
        fontSize:26,
        color:'#4A3428',
    },
    button:{
        backgroundColor:'#4A3428',
        padding:12,
        borderRadius:8,
        marginTop:20,
        minHeight: 50,
        justifyContent: 'center'
    },
    buttontext:{
        color:'white',
        fontSize:18,
        fontWeight:'500',
        textAlign:'center',   
    },
    bottomtext:{
        fontSize:15,
        color:'grey',
    },
    textinput:{
        borderWidth:0.2,
        padding:12,
        fontSize:16,
        borderRadius:8,
        backgroundColor:'#fff'
    },
    passwordContainer:{
        flexDirection:'row',
        borderWidth:0.2,
        paddingHorizontal:5,
        paddingVertical:2,
        borderRadius:8,
        backgroundColor:'#fff',
        alignItems:'center'
    },
    errorText:{
        color:'red',
        fontSize:12,
        marginTop:4
    }
})