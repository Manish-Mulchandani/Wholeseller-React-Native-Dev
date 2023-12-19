import React, {useState} from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import OrdersScreen from '../screens/OrdersScreen';
import NewAddProduct from '../screens/NewAddProduct';
import AddOrders from '../screens/AddOrders';
import ProductNavigator from '../screens/ProductNavigator';
import CartPage from '../screens/CartPage';
import CreateCart from '../screens/CreateCart';

const Tab = createBottomTabNavigator();

const AppNavigator = () => {
  const [cart, setCart] = useState({});
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
      <Tab.Screen name="Create Cart" options={{headerShown: false}}>
        {() => <CreateCart cart={cart} setCart={setCart} />}
      </Tab.Screen>
      <Tab.Screen name="Place Order" options={{headerShown: false}}>
        {() => <CartPage cart={cart} setCart={setCart} />}
      </Tab.Screen>
    </Tab.Navigator>
  );
};

export default AppNavigator;
