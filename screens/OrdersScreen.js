import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import OrderScreenCheck from './OrderScreenCheck';
import OrderDetailsCheck from './OrderDetailsCheck';

const Stack = createStackNavigator();

const OrdersScreen = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="OrderScreenCheck" component={OrderScreenCheck} options={{headerShown: false}}/>
      <Stack.Screen name="OrderDetailsCheck" component={OrderDetailsCheck} />
      {/* Add more screens within the Order Details navigator if needed */}
    </Stack.Navigator>
  );
};

export default OrdersScreen;
