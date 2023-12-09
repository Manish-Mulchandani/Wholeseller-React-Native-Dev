import React, {useEffect, useState} from 'react';
import {View, Text, FlatList, TouchableOpacity, StyleSheet, ScrollView, RefreshControl} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {Client, Databases, Query} from 'appwrite';

const DATABASE_ID = '6532eaf0a394c74aeb32';
const COLLECTION_ID = '6533aad5270260d0d839';
const PROJECT_ID = '652fa3f6300f32d17993';

const client = new Client();

client
  .setEndpoint('https://cloud.appwrite.io/v1') // Your API Endpoint
  .setProject(PROJECT_ID); // Your project ID

const databases = new Databases(client);


const OrderScreenCheck = () => {
  const [orderIds, setOrderIds] = useState([]);
  //const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [data, setData] = useState(null);
  const [refreshing, setRefreshing] = useState(false)
  // const [refresh,setRefresh] = useState(false);

  const navigation = useNavigation();

  useEffect(() => {
    fetchData()
  },[refreshing])

  const fetchData = () => {
    const promise = databases.listDocuments(DATABASE_ID, COLLECTION_ID, [
      Query.isNotNull('Customer_name'),
      Query.equal('isDeleted', false),
    ]);

    promise.then(
      function (response) {
        setData(response);
        const uniqueOrderIds = Array.from(
          new Set(response.documents.map(item => item.Order_id)),
        );
        setOrderIds(uniqueOrderIds);
        //console.log(response)// Success
      },
      function (error) {
        console.log(error); // Failure
      })
      .finally(function () {
        setRefreshing(false)
      })
  }

  const onRefresh = () => {
    setRefreshing(true)
  }

  

  const getProductsByOrderId = orderId => {
    return data.documents.filter(item => item.Order_id === orderId);
  };

  // const renderOrderIds = () => {
  //   return (
  //     <FlatList
  //       data={orderIds}
  //       keyExtractor={orderId => orderId}
  //       renderItem={({item}) => (
  //         <TouchableOpacity
  //           onPress={() => handleProductPress(item)}
  //           style={styles.orderButton}>
  //           <Text style={styles.orderButtonText}>
  //             {getProductsByOrderId(item)[0].Customer_name}
  //           </Text>
  //         </TouchableOpacity>
  //       )}
  //     />
  //   );
  // };

  

  const handleProductPress = orderId => {
    const products = getProductsByOrderId(orderId);

    // console.log(products);
    navigation.navigate('OrderDetailsCheck', {products});
  };

  return (
    
      <View style={styles.container}>
        <Text style={styles.header}>Select an Order ID:</Text>
        <FlatList
        refreshControl={ // Add a refresh control to the FlatList
          <RefreshControl
            refreshing={refreshing} // Set the refreshing state
            onRefresh={onRefresh} // Handle refresh action
          />
        }
        data={orderIds}
        keyExtractor={orderId => orderId}
        renderItem={({ item }) => {
          const document = getProductsByOrderId(item)[0];
          const customerName = document ? document.Customer_name : 'Unknown';
          return (
            <TouchableOpacity
              onPress={() => handleProductPress(item)}
              style={styles.orderButton}
            >
              <Text style={styles.orderButtonText}>
                {customerName}
              </Text>
            </TouchableOpacity>
          );
        }}
      />
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

export default OrderScreenCheck;