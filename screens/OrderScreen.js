import React from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
//import OrderDetails from './OrderDetails';

const orders = [
  {
    order_id: 3,
    customer_name: "XYZ Name",
    mobile_no: "123-456-7890",
    products: [
      {
        product_id: 1,
        quantity: 2,
        product_name: "Product Name",
        product_price: 19.99,
        product_available: true,
        product_image: "product_image_url",
      },
      {
        product_id: 5,
        quantity: 5,
        product_name: "Product Name3",
        product_price: 19.96,
        product_available: true,
        product_image: "product_image_url.txt",
      },
    ],
  },
  {
    order_id: 2,
    customer_name: "John Name",
    mobile_no: "123-456-7890",
    products: [
      {
        product_id: 1,
        quantity: 2,
        product_name: "Product Name",
        product_price: 19.99,
        product_available: true,
        product_image: "product_image_url",
      },
      {
        product_id: 3,
        quantity: 1,
        product_name: "Product Name2",
        product_price: 19.98,
        product_available: true,
        product_image: "product_image_url.txt",
      },
    ],
  },
  {
    order_id: 1,
    customer_name: "John Doe",
    mobile_no: "123-456-7890",
    products: [
      {
        product_id: 1,
        quantity: 2,
        product_name: "Product Name",
        product_price: 19.99,
        product_available: true,
        product_image: "product_image_url",
      },
      {
        product_id: 3,
        quantity: 1,
        product_name: "Product Name2",
        product_price: 19.98,
        product_available: true,
        product_image: "product_image_url.txt",
      },
    ],
  },
];

const OrderScreen = () => {
  const navigation = useNavigation();

  const handleCustomerNameClick = (customerName, products) => {
    navigation.navigate('OrderDetails', { customerName, products });
  };

  return (
    <View>
      <FlatList
        data={orders}
        keyExtractor={(item) => item.order_id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => handleCustomerNameClick(item.customer_name, item.products)}
          >
            <Text>Customer Name: {item.customer_name}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

export default OrderScreen;
