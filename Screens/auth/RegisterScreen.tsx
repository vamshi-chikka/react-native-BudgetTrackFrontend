import React,{useState} from 'react';
import {View, Text, StyleSheet,Image, Pressable, Alert,TextInput, TouchableOpacity,ScrollView, StatusBar, KeyboardAvoidingView,Platform, ActivityIndicator} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import axios from 'axios';
import * as Yup from 'yup';
import {Formik} from 'formik';
import { API_TIMEOUT, API_URL, AUTH_ENDPOINTS } from '../../Constants/api';

export default function RegisterScreen(){
    const navigation = useNavigation();
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    
    const RegisterSchema = Yup.object().shape({
        name:Yup.string().min(2,'Name must be at least 2 characters long').required('Name is required'),
        email:Yup.string().email('Invalid email format').required('Email is required'),
        mobile:Yup.string().matches(/^[6-9]\d{9}$/, 'Phone number must be valid').required('Mobile number is required'),
        password : Yup.string().min(6,'Password must be at least 6 characters').required('Password is required')
    })

    const handleRegister = async (values) => {
        setIsLoading(true);
        try {
            const registrationData = {
                name: values.name.trim(),
                email: values.email.trim().toLowerCase(),
                mobile: values.mobile.trim(),
                password: values.password,
            };
            console.log('Registration data:', registrationData);
            const response = await axios.post(`${API_URL}${AUTH_ENDPOINTS.REGISTER}`, registrationData, {
                timeout: API_TIMEOUT
            });
            console.log('Registration response:', response.data);
            if (response.status >= 200 && response.status < 300) {
                Alert.alert('Success', 'Registration successful! Please verify your email.', [
                    {
                        text: 'OK',
                        onPress: () => navigation.navigate('VerifyScreen', {email: registrationData.email})
                    }
                ]);
            } else {
                Alert.alert(
                    'Registration Failed',
                    response.data?.message ||
                    response.data?.data ||
                    response.data?.error ||
                    `Request failed (${response.status})`
                );
            }
        } catch (error: any) {
            const errorMessage = error?.response?.data?.message || 
                                error?.response?.data?.data ||
                                error?.response?.data?.error ||
                                (error?.response?.status ? `Request failed (${error.response.status})` : null) ||
                                (error?.code === 'ECONNABORTED' ? 'The server took too long to respond. Please try again.' : null) ||
                                error?.message || 
                                'Failed to register. Please try again.';
            Alert.alert('Error', errorMessage);
            console.error('Registration error:', error);
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
                <Image source={require('../../assets/images/revenue-i2.png')}
                    style={{width:'100%',height:300,resizeMode:'contain'}}
                />
            </View>
            <Formik
            initialValues={{
                name: '',
                email: '',
                mobile: '',
                password: '',
            }}
            validationSchema={RegisterSchema}
            onSubmit={(values)=>handleRegister(values)}
            >
            {({
                handleChange,
                handleBlur,
                handleSubmit,
                values,
                errors,
                touched,
            }) => (
                <>
                <View style={styles.inputcontainer}>
                    <Text style={styles.titletext}>Create Account</Text>

                    <View style={{ gap: 15, marginVertical: 15 }}>
                    {/* Name */}
                    <View>
                        <TextInput
                            placeholder="Enter name"
                            placeholderTextColor="grey"
                            value={values.name}
                            onChangeText={handleChange('name')}
                            onBlur={handleBlur('name')}
                            style={[styles.textinput, touched.name && errors.name ? {borderColor: 'red'} : {}]}
                            editable={!isLoading}
                        />
                        {touched.name && errors.name && (
                            <Text style={styles.errorText}>{errors.name}</Text>
                        )}
                    </View>

                    {/* Email */}
                    <View>
                        <TextInput
                            placeholder="Enter email"
                            placeholderTextColor="grey"
                            value={values.email}
                            onChangeText={handleChange('email')}
                            onBlur={handleBlur('email')}
                            style={[styles.textinput, touched.email && errors.email ? {borderColor: 'red'} : {}]}
                            keyboardType="email-address"
                            autoCapitalize="none"
                            editable={!isLoading}
                        />
                        {touched.email && errors.email && (
                            <Text style={styles.errorText}>{errors.email}</Text>
                        )}
                    </View>

                    {/* Mobile */}
                    <View>
                        <TextInput
                            placeholder="Enter mobile"
                            placeholderTextColor="grey"
                            value={values.mobile}
                            onChangeText={handleChange('mobile')}
                            onBlur={handleBlur('mobile')}
                            style={[styles.textinput, touched.mobile && errors.mobile ? {borderColor: 'red'} : {}]}
                            keyboardType="number-pad"
                            editable={!isLoading}
                        />
                        {touched.mobile && errors.mobile && (
                            <Text style={styles.errorText}>{errors.mobile}</Text>
                        )}
                    </View>

                    {/* Password */}
                    <View>
                        <View 
                        style={[styles.passwordContainer, touched.password && errors.password ? {borderColor: 'red'} : {}]}>
                        <TextInput
                            placeholder="Enter password"
                            placeholderTextColor="grey"
                            value={values.password}
                            onChangeText={handleChange('password')}
                            onBlur={handleBlur('password')}
                            style={{flex:1,fontSize:16,color:'black',}}
                            secureTextEntry={!showPassword}
                            editable={!isLoading}
                        />
                        <TouchableOpacity onPress={() => setShowPassword(!showPassword)} disabled={isLoading}>
                            {values.password.length > 0 && (
                                <Ionicons name={showPassword ? "eye-outline" : "eye-off-outline"} size={24} color={'grey'}/>
                            )}
                        </TouchableOpacity>
                        </View>
                        {touched.password && errors.password && (
                            <Text style={styles.errorText}>{errors.password}</Text>
                        )}
                    </View>
                    </View>

                    <TouchableOpacity 
                        style={[styles.button, isLoading && {opacity: 0.6}]} 
                        onPress={() => handleSubmit()}
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <ActivityIndicator size="small" color="#fff" />
                        ) : (
                            <Text style={styles.buttontext}>Sign Up</Text>
                        )}
                    </TouchableOpacity>
                </View>
                </>
            )}
            </Formik>
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
        marginHorizontal:20
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
        color:'black',
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