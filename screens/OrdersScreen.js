import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import OrderScreenCheck from './OrderScreenCheck';
import OrderDetailsCheck from './OrderDetailsCheck';
import AddOrders from './AddOrders';

const Stack = createStackNavigator();

const OrdersScreen = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="OrderScreenCheck" component={OrderScreenCheck} options={{headerShown: false}}/>
      <Stack.Screen name="OrderDetailsCheck" component={OrderDetailsCheck} />
      <Stack.Screen name="AddOrders" component={AddOrders} />
      {/* Add more screens within the Order Details navigator if needed */}
    </Stack.Navigator>
  );
};

export default OrdersScreen;
