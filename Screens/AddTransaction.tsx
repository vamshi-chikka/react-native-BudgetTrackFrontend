import Ionicons from 'react-native-vector-icons/Ionicons';
import React,{useState} from 'react';
import {StyleSheet,Text, View,TextInput, StatusBar,TouchableOpacity,Alert, ActivityIndicator} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';
import {TRANSACTION_ENDPOINTS} from '../Constants/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CALLAPI } from '../network/RNRestClient';

export default function AddTransaction(){
    const navigation = useNavigation();
    const [type, setType] = useState('Expense');
    const [amount, setAmount] = useState('');
    const [amountError, setAmountError] = useState('');
    const [title, setTitle] = useState('');
    const [titleError, setTitleError] = useState('');
    const [category, setCategory] = useState('Bills');
    const [isLoading, setIsLoading] = useState(false);
    
    const CATEGORIES = [
        { id: "food", name: "Food & Drinks", icon: "fast-food" },
        { id: "shopping", name: "Shopping", icon: "cart" },
        { id: "transportation", name: "Transportation", icon: "car" },
        { id: "entertainment", name: "Entertainment", icon: "film" },
        { id: "bills", name: "Bills", icon: "receipt" },
        { id: "income", name: "Income", icon: "cash" },
        { id: "other", name: "Other", icon: "ellipsis-horizontal" },
    ];

    const validateInputs = () => {
        let isValid = true;
        
        if (title.trim().length === 0) {
            setTitleError('Title is required');
            isValid = false;
        } else {
            setTitleError('');
        }

        if (amount.trim().length === 0) {
            setAmountError('Amount is required');
            isValid = false;
        } else if (isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
            setAmountError('Please enter a valid amount');
            isValid = false;
        } else {
            setAmountError('');
        }

        return isValid;
    }

    const handleSave = async () => {
        if (!validateInputs()) {
            return;
        }

        setIsLoading(true);
        try {
            const transactionData = {
                type: type,
                amount: type === 'Income' ? parseFloat(amount) : -parseFloat(amount),
                title: title.trim(),
                category: category
            };

            const token = await AsyncStorage.getItem('token');
            if (!token) {
                Alert.alert('Error', 'Authentication token not found. Please login again.');
                return;
            }

            const response = await CALLAPI.post<{status?: string; message?: string}>(TRANSACTION_ENDPOINTS.ADD_TRANSACTION, transactionData);

            if (response?.status === 'ok') {
                Alert.alert('Success', 'Transaction added successfully', [
                    {
                        text: 'OK',
                        onPress: () => {
                            setTitle('');
                            setAmount('');
                            setCategory('Bills');
                            setType('Expense');
                            navigation.goBack();
                        }
                    }
                ]);
            } else {
                Alert.alert('Error', response?.message || 'Failed to add transaction');
            }
        } catch (error: any) {
            const errorMessage = error?.message || 'Failed to add transaction. Please try again.';
            Alert.alert('Error', errorMessage);
            console.error('Add transaction error:', error);
        } finally {
            setIsLoading(false);
        }
    }

    return(
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle='dark-content'/>
            <View style={styles.header}>
                <TouchableOpacity onPress={()=>navigation.goBack()} disabled={isLoading}>
                    <Ionicons name="arrow-back" size={28} color={isLoading ? '#ccc' : 'black'}/>
                </TouchableOpacity>
                <Text style={styles.headertext}>New Transaction</Text>
                <TouchableOpacity onPress={handleSave} disabled={isLoading}>
                    {isLoading ? (
                        <ActivityIndicator size="small" color="#4A3428" />
                    ) : (
                        <Text style={{fontWeight:'500',fontSize:16,color:'#4A3428'}}>Save ✔</Text>
                    )}
                </TouchableOpacity>
            </View>
            <View style={[styles.expensecard, isLoading && {opacity: 0.6}]}>
                <View style={{flexDirection:'row',gap:10}}>
                    <TouchableOpacity 
                        style={[styles.button,{backgroundColor: (type ==='Expense'? '#4A3428':'#fff' )}]} 
                        onPress={()=>setType('Expense')}
                        disabled={isLoading}
                    >
                        <Ionicons name="arrow-down-circle" size={20} color={(type ==='Expense'? 'white':'red' )}/>
                        <Text style={[styles.buttontext,{color:(type ==='Expense'? 'white':'black' )}]}>Expense</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                        style={[styles.button,{backgroundColor: (type ==='Income'? '#4A3428':'#fff' )}]} 
                        onPress={()=>setType('Income')}
                        disabled={isLoading}
                    >
                        <Ionicons name="arrow-up-circle" size={20} color={(type ==='Income'? 'white':'green' )}/>
                        <Text style={{color:(type ==='Income'? 'white':'black')}}>Income</Text>
                    </TouchableOpacity>
                </View>
                
                <View style={{marginTop: 20}}>
                    <View style={{flexDirection:'row',borderBottomWidth:0.5,borderBottomColor:'grey',alignItems:'center'}}>
                        <Text style={styles.inputtext}>₹</Text>
                        <TextInput
                            placeholder="0.00"
                            placeholderTextColor={'grey'}
                            value={amount}
                            onChangeText={(text) => {
                                setAmount(text);
                                if (amountError) validateInputs();
                            }}
                            onBlur={() => validateInputs()}
                            style={[styles.inputtext,{flex:1}]}
                            keyboardType='number-pad'
                            editable={!isLoading}
                        />
                    </View>
                    {amountError ? <Text style={styles.errorText}>{amountError}</Text> : null}
                </View>

                <View style={{marginTop: 20}}>
                    <View style={{flexDirection:'row',alignItems:'center',justifyContent:'center',borderWidth:0.5,borderColor:'grey',padding:8,borderRadius:15,gap:10}}>
                        <Ionicons name="create-outline" size={22} color={'grey'}/>
                        <TextInput
                            placeholder="Transaction Title"
                            placeholderTextColor={'grey'}
                            value={title}
                            onChangeText={(text) => {
                                setTitle(text);
                                if (titleError) validateInputs();
                            }}
                            onBlur={() => validateInputs()}
                            style={{flex:1}}
                            editable={!isLoading}
                        />
                    </View>
                    {titleError ? <Text style={styles.errorText}>{titleError}</Text> : null}
                </View>

                <View style={{flexDirection:'row',alignItems:'center',marginTop:20}}>
                    <Ionicons name="pricetag-outline" size={18} color={'black'}/>
                    <Text style={{fontWeight:'bold',fontSize:16}}>Category</Text>
                </View>
                <View style={styles.categories}>
                {CATEGORIES.map((listData,index)=>{
                    return(
                    <TouchableOpacity 
                        key={listData.id} 
                        style={[styles.categoryitem,{backgroundColor:(category === listData.name ? '#4A3428':'#fff' )}]} 
                        onPress={()=>setCategory(listData.name)}
                        disabled={isLoading}
                    >
                        <Ionicons name={listData.icon} size={20} color={(category === listData.name ? '#fff': '#4A3428')}/>
                        <Text style={{color:(category === listData.name ? '#fff': '#4A3428')}}>{listData.name}</Text>
                    </TouchableOpacity>
                    )
                })}
                </View>
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:'#FFF8F3'
    },
    header:{
        marginHorizontal:20,
        flexDirection:'row',
        justifyContent:'space-between',
        alignItems:'center',
    },
    headertext:{
        fontSize:18,
        fontWeight:'500',
        paddingVertical:20
    },
    expensecard:{
        marginTop:20,
        marginHorizontal:20,
        backgroundColor:'#fff',
        borderRadius:12,
        shadowColor:'#000',
        shadowOffset:{width:0,height:4},
        shadowOpacity:0.1,
        shadowRadius:12,
        elevation:6,
        padding:20
    },
    button:{
        flexDirection:'row',
        height:50,
        gap:5,
        flex:1,
        borderWidth:0.5,
        justifyContent:'center',
        alignItems:'center',
        borderRadius:25,
        borderColor:'#4A3428'
    },
    buttontext:{
        fontSize:16,
    },
    inputtext:{color:'#4A3428',fontSize:28,fontWeight:'bold'},
    categories:{
        flexDirection:'row',
        flexWrap:'wrap',
        marginTop:10,
        gap:10
    },
    categoryitem:{
        flexDirection:'row',
        padding:10,
        borderWidth:0.5,
        borderRadius:15,
        gap:5
    },
    errorText:{
        color:'red',
        fontSize:12,
        marginTop:4
    }
})