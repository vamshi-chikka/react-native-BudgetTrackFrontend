import React, {createContext,useEffect,useState} from 'react';
import NetInfo from '@react-native-community/netinfo';

export const NetworkContext = createContext();
export default function NetworkProvider({ children }){
    const [isConnected, setIsConnected]= useState(true);
    useEffect(()=>{
        const unsubscribe = NetInfo.addEventListener(state =>{
            setIsConnected(state.isConnected || false);
        });
        return () => unsubscribe();
    }, [])
    return(
        <NetworkContext.Provider value={{isConnected}}>
            {children}
        </NetworkContext.Provider>
    )
}