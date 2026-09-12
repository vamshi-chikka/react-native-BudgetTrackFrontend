import {View,Text, StatusBar,StyleSheet,Image, TouchableOpacity, Pressable, FlatList, Alert, BackHandler, ActivityIndicator} from 'react-native';
import React,{useState,useCallback,useContext} from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';

import ExpenseCard from '../components/ExpenseCard';
import {useFocusEffect} from '@react-navigation/native';
import {TRANSACTION_ENDPOINTS} from '../Constants/api'
import {NetworkContext} from '../context/NetworkProvider';
import OfflineBanner from '../components/OfflineBanner';
import Logout from '../components/Logout';
import {useSelector} from 'react-redux';
import TransactionCard from '../components/TransactionCard';
import { CALLAPI } from '../network/RNRestClient';
import { getSecurePreference } from '../network/userPreference';

export default function Transaction(){
    const {isConnected} = useContext(NetworkContext);
    const navigation = useNavigation();
    const [amountDetails, setAmountDetails] = useState({})
    const [tranDetails, setTranDetails] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [error, setError] = useState('');
    const user = useSelector((state)=>state.user.user);

    const fetchSummary = async(pageNumber = 1, forceRefresh = false) => {
        if (isLoadingMore) return;
        if (!forceRefresh && pageNumber === 1 && !hasMore) return;

        pageNumber === 1 ? setIsLoading(true) : setIsLoadingMore(true);
        try {
            const token = await getSecurePreference('token');
            if (!token) {
                Alert.alert('Error', 'Authentication token not found. Please login again.');
                return;
            }

            const response = await CALLAPI.get<{status?: string; data?: { allData: any[]; currentPage: number; totalPages: number } }>(`${TRANSACTION_ENDPOINTS.GET_SUMMARY}/?page=${pageNumber}&limit=5`);

            if (response?.status === 'ok' && response?.data) {
                const {allData, currentPage, totalPages} = response.data;
                setAmountDetails(response.data);
                setTotalPages(totalPages);
                setPage(currentPage);
                setError('');
                
                if (pageNumber === 1) {
                    setTranDetails(allData);
                    setHasMore(currentPage < totalPages);
                } else {
                    setTranDetails(prev => [...prev, ...allData]);
                    setHasMore(currentPage < totalPages);
                }
            } else {
                setError('Failed to fetch transactions');
            }
        } catch (error: any) {
            const errorMessage = error?.message || 'Error fetching transactions';
            setError(errorMessage);
            console.error('Fetch summary error:', error);
        } finally {
            setIsLoading(false);
            setIsLoadingMore(false);
        }
    }

    const deleteTransaction = async (Id: string) => {
        try {
            const token = await getSecurePreference('token');
            if (!token) {
                Alert.alert('Error', 'Authentication token not found.');
                return;
            }

            const response = await CALLAPI.delete<{status?: string; message?: string}>(`${TRANSACTION_ENDPOINTS.DELETE_TRANSACTION}/${Id}`);

            if (response?.status === 'ok') {
                Alert.alert('Success', 'Transaction deleted successfully', [
                    {
                        text: 'OK',
                        onPress: () => {
                            setPage(1);
                            setHasMore(true);
                            fetchSummary(1, true);
                        }
                    }
                ]);
            } else {
                Alert.alert('Error', response?.message || 'Failed to delete transaction');
            }
        } catch (error: any) {
            const errorMessage = error?.message || 'Error deleting transaction';
            Alert.alert('Error', errorMessage);
            console.error('Delete transaction error:', error);
        }
    }

    const handleBackPress = () => {
        Alert.alert("Exit App", "Are you sure you want to exit?", [
            {
                text: "Cancel",
                style: 'cancel',
                onPress: () => null,
            },
            {
                text: "Exit",
                onPress: () => BackHandler.exitApp(),
            }
        ]);
        return true;
    }

    const loadMore = () => {
        if (!isLoadingMore && page < totalPages) {
            const nextPage = page + 1;
            fetchSummary(nextPage);
        }
    }

    useFocusEffect(
        useCallback(() => {
            if (isConnected) {
                setPage(1);
                setHasMore(true);
                setError('');
                fetchSummary(1);
            }
            const back = BackHandler.addEventListener('hardwareBackPress', handleBackPress);
            return () => {
                back.remove();
            }
        }, [isConnected])
    )

    if (!isConnected) {
        return <OfflineBanner />
    }

    if (!user) {
        return (
            <SafeAreaView style={styles.container}>
                <Text style={{textAlign: 'center', marginTop: 50}}>Loading user data...</Text>
            </SafeAreaView>
        )
    }

    return(
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle='dark-content'/>
            <View style={styles.headercontainer}>
                <Image source={require('../assets/images/logo.png')} style={{width:65,height:70,resizeMode:'stretch'}}/>
                <View style={{flex:1}}>
                    <Text style={{color:'grey'}}>Welcome,</Text>
                    <Text style={{fontWeight:'bold',fontSize:16}}>{user?.name || 'User'}</Text>
                </View>
                <View style={{flexDirection:'row',alignItems:'center',justifyContent:'flex-end'}}>
                    <TouchableOpacity 
                        style={styles.addbutton} 
                        onPress={()=> navigation.navigate('AddTransaction')}
                        disabled={isLoading}
                    >
                        <Text style={{color:'white',fontSize:13,textAlign:'center'}}>+ Add</Text>
                    </TouchableOpacity>
                    <Logout/>
                </View>
            </View>
            
            <ExpenseCard amountDetails={amountDetails}/>
            
            {error && (
                <View style={styles.errorContainer}>
                    <Text style={styles.errorText}>{error}</Text>
                </View>
            )}

            <Text style={styles.text}>Recent Transactions</Text>
            
            {isLoading ? (
                <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                    <ActivityIndicator size="large" color="#4A3428" />
                </View>
            ) : (
                <FlatList
                    data={tranDetails}
                    keyExtractor={(item)=>item._id}
                    renderItem={({item})=>{
                        return(
                            <TransactionCard 
                                item={item}
                                onDelete={deleteTransaction}
                            />
                        )
                    }}
                    ListEmptyComponent={
                        <View style={{justifyContent:'center',alignItems:'center', marginTop: 50}}>
                            <Text style={{fontSize: 16, color: 'grey'}}>No transactions yet</Text>  
                        </View>
                    }
                    onEndReached={loadMore}
                    onEndReachedThreshold={0.4}
                    ListFooterComponent={
                        isLoadingMore ? <ActivityIndicator size="small" color="#4A3428" style={{marginVertical: 10}} /> : null
                    }
                />
            )}
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:'#FFF8F3'
    },
    headercontainer:{
        paddingTop:40,
        flexDirection:'row',
        alignItems:'center',
        marginHorizontal:20,
        marginBottom:35
    },
    addbutton:{
        backgroundColor:'#4A3428',
        paddingVertical:8,
        paddingHorizontal:12,
        borderRadius:15,
        marginRight:20
    },
    text:{
        fontSize:18,
        fontWeight:'500',
        color:'#4A3428',
        margin:20
    },
    errorContainer:{
        backgroundColor:'#FFE5E5',
        borderLeftWidth:4,
        borderLeftColor:'red',
        padding:12,
        marginHorizontal:20,
        borderRadius:8,
        marginBottom:10
    },
    errorText:{
        color:'red',
        fontSize:13
    }
})