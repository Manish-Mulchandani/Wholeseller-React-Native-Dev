import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import OrderScreen from './OrderScreen';
import OrderDetails from './OrderDetails';

const Stack = createStackNavigator();

const OrdersScreen = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="OrderScreen" component={OrderScreen} options={{headerShown: false}}/>
      <Stack.Screen name="OrderDetails" component={OrderDetails} />
      {/* Add more screens within the Order Details navigator if needed */}
    </Stack.Navigator>
  );
};

export default OrdersScreen;
