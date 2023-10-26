import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import ProductScreen from './ProductScreen';
import UpdateProductScreen from './UpdateProductScreen';

const Stack = createStackNavigator();

const ProductNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="ProductScreen" component={ProductScreen} options={{headerShown: false}}/>
      <Stack.Screen name="UpdateProductScreen" component={UpdateProductScreen} />
      {/* Add more screens within the Order Details navigator if needed */}
    </Stack.Navigator>
  );
};

export default ProductNavigator;
