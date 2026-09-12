import React from 'react';
import {View,Text,StyleSheet,TouchableOpacity, Alert} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

const formatDate = (dateString: string) => {
    try {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return 'Invalid date';
        return date.toLocaleDateString('en-IN', { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric' 
        });
    } catch {
        return 'N/A';
    }
}

export default function TransactionCard({item, onDelete}){
    const Category_Icons: Record<string, string> = {
        "Food & Drinks": "fast-food",
        "Shopping": "cart",
        "Transportation": "car",
        "Entertainment": "film",
        "Bills": "receipt",
        "Income": "cash",
        "Other": "ellipsis-horizontal"
    }
    
    const isIncome = item.type === 'Income' || parseFloat(item.amount) > 0;
    const iconName = Category_Icons[item.category] || "pricetag-outline";
    const displayAmount = Math.abs(parseFloat(item.amount));
    
    const handleDelete = (Id: string) => {
        Alert.alert(
            "Delete Transaction", 
            "Are you sure you want to delete this transaction?",
            [
                {text: 'Cancel', style: "cancel"},
                {text: 'Delete', style: "destructive", onPress: () => onDelete(Id)}
            ]
        );
    }

    return(
        <View style={styles.spentcard}>
            <View style={styles.icon}>
                <Ionicons name={iconName} size={22} color={isIncome ? 'green' : 'red'}/>
            </View>
            <View style={{flex:1,flexGrow:1}}>
                <Text style={styles.text2}>{item.title || 'Transaction'}</Text>
                <Text style={{color:'grey',fontSize:12}}>{item.category || 'Uncategorized'}</Text>
            </View>
            <View style={{paddingHorizontal:15}}>
                <Text style={[styles.text2,{color: isIncome ? 'green' : 'red'}]}>
                    {isIncome ? '+' : '-'}₹{displayAmount.toFixed(2)}
                </Text>
                <Text style={{color:'grey',fontSize:12}}>{formatDate(item.createdAt || item.date || '')}</Text>
            </View>
            <TouchableOpacity style={styles.delete} onPress={()=>handleDelete(item._id)}>
                <Ionicons name="trash-outline" size={22} color={'red'}/>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    spentcard:{
        marginTop:10,
        backgroundColor:'#fff',
        flexDirection:'row',
        alignItems:'center',
        marginHorizontal:20,
        borderRadius:8,
        shadowColor:'#000',
        shadowOffset:{width:0,height:1},
        shadowOpacity:0.1,
        shadowRadius:2,
        elevation:2
    },
    icon:{
        width:40,
        height:40,
        borderRadius:20,
        backgroundColor:'#FFF8F3',
        alignItems:'center',
        justifyContent:'center',
        margin:15
    },
    text2:{
        fontWeight:'500',
        fontSize:16,
    },
    delete:{
        padding:15,
        borderLeftWidth:0.2,
        borderLeftColor:'grey',
    }
})