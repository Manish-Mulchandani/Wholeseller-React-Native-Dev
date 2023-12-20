import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  RefreshControl,
  useColorScheme,
  Alert,
} from 'react-native';
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
  const [refreshing, setRefreshing] = useState(false);
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';
  // const [refresh,setRefresh] = useState(false);

  const navigation = useNavigation();

  useEffect(() => {
    fetchData();
  }, [refreshing]);

  const fetchData = () => {
    const promise = databases.listDocuments(DATABASE_ID, COLLECTION_ID, [
      // Query.isNotNull('Phone_Number'),
      Query.equal('isDeleted', false),
      Query.limit(1000),
    ]);

    promise
      .then(
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
          Alert.alert('Error displaying orders', 'Check Internet connection and refresh the app')
        },
      )
      .finally(function () {
        setRefreshing(false);
      });
  };

  const onRefresh = () => {
    setRefreshing(true);
  };

  const getProductsByOrderId = orderId => {
    return data.documents.filter(item => item.Order_id === orderId);
  };

  const addingOrders = () => {
    navigation.navigate('AddOrders');
  };

  const handleProductPress = orderId => {
    const products = getProductsByOrderId(orderId);

    // console.log(products);
    navigation.navigate('OrderDetailsCheck', {products});
  };

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: isDarkMode ? '#121212' : '#f0f0f0' },
      ]}
    >
      <TouchableOpacity onPress={addingOrders} style={styles.addorderButton}>
        <Text style={[styles.addorderButtonText, { fontWeight: 'bold' }]}>
          Add Orders
        </Text>
      </TouchableOpacity>
      <Text style={[styles.header, { color: isDarkMode ? '#fff' : '#000' }]}>
        Select an Order:
      </Text>
      <FlatList
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#007BFF']} // Customize the loading indicator color
          />
        }
        data={orderIds}
        keyExtractor={orderId => orderId}
        renderItem={({ item }) => {
          const document = getProductsByOrderId(item)[0];
          const customerName = document
            ? document.Customer_name ||
              document.Phone_Number ||
              document.Order_id ||
              'Unknown'
            : 'Unknown';
          return (
            <TouchableOpacity
              onPress={() => handleProductPress(item)}
              style={styles.orderButton}
            >
              <Text style={[styles.orderButtonText, { color: '#fff' }]}>
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
  addorderButton: {
    backgroundColor: '#007BFF',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 0,
    marginBottom: 10
  },
  addorderButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
  },
});

export default OrderScreenCheck;
