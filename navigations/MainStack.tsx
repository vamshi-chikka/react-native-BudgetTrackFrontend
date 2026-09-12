import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import LoginScreen from '../Screens/auth/LoginScreen';
import RegisterScreen from '../Screens/auth/RegisterScreen';
import VerifyScreen from '../Screens/auth/VerifyScreen';


export default function MainStack(){
    const Stack = createStackNavigator();
    return(
        <Stack.Navigator screenOptions={{headerShown:false}}>
            <Stack.Screen name="LoginScreen" component={LoginScreen}/>
            <Stack.Screen name="RegisterScreen" component={RegisterScreen}/>
            <Stack.Screen name="VerifyScreen" component={VerifyScreen}/>
        </Stack.Navigator>
    )
}