import React from 'react';
import { View, Text, FlatList } from 'react-native';

const OrderDetails = ({ route }) => {
  const { customerName, products } = route.params;

  return (
    <View>
      <Text>Customer Name: {customerName}</Text>
      <FlatList
        data={products}
        keyExtractor={(product) => product.product_id.toString()}
        renderItem={({ item }) => (
          <View>
            <Text>Name: {item.product_name}</Text>
            <Text>Price: {item.product_price}</Text>
            <Text>Quantity: {item.quantity}</Text>
            <Text>Available: {item.product_available ? 'Yes' : 'No'}</Text>
          </View>
        )}
      />
    </View>
  );
};

export default OrderDetails;
