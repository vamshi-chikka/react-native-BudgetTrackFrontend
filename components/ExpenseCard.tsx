import {View,Text, StyleSheet,} from 'react-native';
import React from 'react';

export default function ExpenseCard({amountDetails}){
    return(
        <View style={styles.expensecard}>
            <Text style={{fontSize:16,color:'grey'}}>Total Balance</Text>
            <Text style={{fontSize:28,fontWeight:'bold',color:'#4A3428'}}>₹{amountDetails.balance}</Text>
            <View style={styles.detailcontainer}>
                <View style={{justifyContent:'flex-start',flex:1,flexGrow:1,}}>
                    <Text style={styles.text1}>Income</Text>
                    <Text style={[styles.text2,{color:'green'}]}>+₹{amountDetails.totalIncome}</Text>
                </View>
                <View style={styles.expensedetails}>
                    <Text style={styles.text1}>Expenses</Text>
                    <Text style={[styles.text2,{color:'red'}]}>₹{amountDetails.totalExpense}</Text>
                </View>
            </View>
        </View>       
    )
}

const styles = StyleSheet.create({
    expensecard:{
        marginHorizontal:20,
        padding:20,
        borderRadius:12,
        backgroundColor:'#fff',
        shadowColor:'#000',
        shadowOffset:{width:0,height:4},
        shadowOpacity:0.1,
        shadowRadius:12,
        elevation:6
    },
    detailcontainer:{
        flexDirection:'row',
        marginTop:20,
    },
    text1:{
        fontSize:14,
        color:'grey',
    },
    text2:{
        fontWeight:'500',
        fontSize:20
    },
    expensedetails:{
        justifyContent:'center',
        alignItems:'center',
        borderLeftWidth:0.2,
        borderLeftColor:'grey',
        paddingHorizontal:8
    }
})