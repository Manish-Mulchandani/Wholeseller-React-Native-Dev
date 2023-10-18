import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import AddProductScreen from '../screens/AddProductScreen';
import OrdersScreen from '../screens/OrdersScreen';
import ProductScreen from '../screens/ProductScreen';
import ImageUploadComponent from '../screens/AddImageScreen';
// import AddProductScreen from './screens/AddProductScreen'
// import ProductScreen from './screens/ProductScreen'
// import OrdersScreen from './screens/OrdersScreen'
// import ProductScreen from '../screens/ProductScreen';
// Import your screens (ProductScreen, AddProductScreen, OrdersScreen)

const Tab = createBottomTabNavigator();

const AppNavigator = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Product" component={ProductScreen} options={{headerShown: false}}/>
      <Tab.Screen name="Add Product" component={ImageUploadComponent} options={{headerShown: false}}/>
      <Tab.Screen name="Orders" component={OrdersScreen} options={{headerShown: false}}/>
    </Tab.Navigator>
  );
};

export default AppNavigator;
