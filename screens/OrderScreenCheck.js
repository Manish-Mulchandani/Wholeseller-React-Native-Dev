import React, {useEffect, useState} from 'react';
import {View, Text, FlatList, TouchableOpacity, StyleSheet} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {Client, Databases} from 'appwrite';

const DATABASE_ID = '6532eaf0a394c74aeb32';
const COLLECTION_ID = '6533aad5270260d0d839';
const PROJECT_ID = '652fa3f6300f32d17993';

const client = new Client();

client
  .setEndpoint('https://cloud.appwrite.io/v1') // Your API Endpoint
  .setProject(PROJECT_ID); // Your project ID

const databases = new Databases(client);

//import OrderDetails from './OrderDetails';

const orders = [
  {
    order_id: 3,
    customer_name: 'XYZ Name',
    mobile_no: '123-456-7890',
    products: [
      {
        product_id: 1,
        quantity: 2,
        product_name: 'Product Name',
        product_price: 19.99,
        product_available: true,
        product_image: 'product_image_url',
      },
      {
        product_id: 5,
        quantity: 5,
        product_name: 'Product Name3',
        product_price: 19.96,
        product_available: true,
        product_image: 'product_image_url.txt',
      },
    ],
  },
  {
    order_id: 2,
    customer_name: 'John Name',
    mobile_no: '123-456-7890',
    products: [
      {
        product_id: 1,
        quantity: 2,
        product_name: 'Product Name',
        product_price: 19.99,
        product_available: true,
        product_image: 'product_image_url',
      },
      {
        product_id: 3,
        quantity: 1,
        product_name: 'Product Name2',
        product_price: 19.98,
        product_available: true,
        product_image: 'product_image_url.txt',
      },
    ],
  },
  {
    order_id: 1,
    customer_name: 'John Doe',
    mobile_no: '123-456-7890',
    products: [
      {
        product_id: 1,
        quantity: 2,
        product_name: 'Product Name',
        product_price: 19.99,
        product_available: true,
        product_image: 'product_image_url',
      },
      {
        product_id: 3,
        quantity: 1,
        product_name: 'Product Name2',
        product_price: 19.98,
        product_available: true,
        product_image: 'product_image_url.txt',
      },
    ],
  },
];

const OrderScreenCheck = () => {
  const [orderIds, setOrderIds] = useState([]);
  //const [selectedOrderId, setSelectedOrderId] = useState(null);
    const [data,setData] = useState(null)

  const navigation = useNavigation();

  useEffect(() => {
    const promise = databases.listDocuments(DATABASE_ID, COLLECTION_ID);

    promise.then(
      function (response) {
        setData(response)
        const uniqueOrderIds = Array.from(
          new Set(response.documents.map(item => item.Order_id)),
        );
        setOrderIds(uniqueOrderIds)
        //console.log(response)// Success
      },
      function (error) {
        console.log(error); // Failure
      },
    );
  }, []);

  const getProductsByOrderId = (orderId) => {
    return data.documents.filter((item) => item.Order_id === orderId);
  };


  const renderOrderIds = () => {
    return (
      <FlatList
        data={orderIds}
        keyExtractor={(orderId) => orderId}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => handleProductPress(item)} style={styles.orderButton}>
            <Text style={styles.orderButtonText}>{item}</Text>
          </TouchableOpacity>
        )}
      />
    );
  };


//   const renderProducts = () => {
//     if (selectedOrderId) {
//       const products = getProductsByOrderId(selectedOrderId);
//       return (
//         <FlatList
//           data={products}
//           keyExtractor={(item) => item.$id}
//           renderItem={({ item }) => (
//             <View>
//               <Text>Name: {item.Name}</Text>
//               <Text>Price: {item.Price}</Text>
//               <Text>Quantity: {item.Quantity}</Text>
//             </View>
//           )}
//         />
//       );
//     }
//   };

  const handleProductPress = (orderId) => {
    const products = getProductsByOrderId(orderId)
    console.log(products)
    navigation.navigate('OrderDetailsCheck', {products});
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Select an Order ID:</Text>
      {renderOrderIds()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f0f0f0',
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  orderButton: {
    backgroundColor: '#007BFF',
    padding: 10,
    marginVertical: 5,
    borderRadius: 5,
  },
  orderButtonText: {
    color: 'white',
    fontSize: 16,
  },
});
// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 16,
//   },
//   orderItem: {
//     backgroundColor: '#f0f0f0',
//     borderRadius: 8,
//     padding: 16,
//     marginBottom: 16,
//   },
//   customerName: {
//     fontSize: 18,
//     fontWeight: 'bold',
//   },
// });

export default OrderScreenCheck;
