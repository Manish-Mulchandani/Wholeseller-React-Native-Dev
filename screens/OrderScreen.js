import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Client, Databases } from 'appwrite';

const DATABASE_ID = '6532eaf0a394c74aeb32'
const COLLECTION_ID = '6533aad5270260d0d839'
const PROJECT_ID = '652fa3f6300f32d17993'

const client = new Client();

client
  .setEndpoint('https://cloud.appwrite.io/v1') // Your API Endpoint
  .setProject(PROJECT_ID); // Your project ID

  const databases = new Databases(client);

  const promise = databases.listDocuments(DATABASE_ID, COLLECTION_ID);

promise.then(function (response) {
  const uniqueOrderIds = Array.from(new Set(response.documents.map((item) => item.Order_id)));
  console.log(uniqueOrderIds) 
  //console.log(response)// Success
}, function (error) {
    console.log(error); // Failure
});



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
    <View style={styles.container}>
      <FlatList
        data={orders}
        keyExtractor={(item) => item.order_id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.orderItem}
            onPress={() => handleCustomerNameClick(item.customer_name, item.products)}
          >
            <Text style={styles.customerName}>Customer Name: {item.customer_name}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  orderItem: {
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  customerName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default OrderScreen;