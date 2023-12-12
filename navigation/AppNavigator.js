import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import OrdersScreen from '../screens/OrdersScreen';
import NewAddProduct from '../screens/NewAddProduct';
import AddOrders from '../screens/AddOrders';
import ProductNavigator from '../screens/ProductNavigator';

const Tab = createBottomTabNavigator();

const AppNavigator = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen
        name="Product"
        component={ProductNavigator}
        options={{headerShown: false}}
      />
      <Tab.Screen
        name="Add Product"
        component={NewAddProduct}
        options={{headerShown: false}}
      />
      <Tab.Screen
        name="Orders"
        component={OrdersScreen}
        options={{headerShown: false}}
      />
      <Tab.Screen
        name="Add Orders"
        component={AddOrders}
        options={{headerShown: false}}
      />
    </Tab.Navigator>
  );
};

export default AppNavigator;
