import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import MainStack from './navigations/MainStack';
import HomeStack from './navigations/HomeStack';
import { useSelector} from 'react-redux';

const  App = () => {
   const loggedIn = useSelector((state)=> state.auth.isLoggedIn);
  return (
    <NavigationContainer>
      { loggedIn ?  <HomeStack/>: <MainStack/> }
    </NavigationContainer>
  );
}

export default App;


