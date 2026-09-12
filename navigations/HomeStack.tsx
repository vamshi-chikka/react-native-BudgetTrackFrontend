import {createStackNavigator} from '@react-navigation/stack';
import Transaction from '../Screens/Transaction';
import AddTransaction from '../Screens/AddTransaction';


export default function HomeStack(){
    const Stack = createStackNavigator();
    return(
        <Stack.Navigator screenOptions={{headerShown:false}}>
            <Stack.Screen name="Transaction" component={Transaction}/>
            <Stack.Screen name="AddTransaction" component={AddTransaction}/>
        </Stack.Navigator>
    )
}