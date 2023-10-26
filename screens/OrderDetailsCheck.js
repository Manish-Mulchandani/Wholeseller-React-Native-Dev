import React from 'react';
import { View, Text, FlatList, StyleSheet, Image, TouchableOpacity, Alert } from 'react-native';
// import OrderDetails from './OrderDetails';
import {Client, Databases, Query} from 'appwrite';
import { Button } from 'react-native-paper';

const DATABASE_ID = '6532eaf0a394c74aeb32';
const COLLECTION_ID = '6533aad5270260d0d839';
const PROJECT_ID = '652fa3f6300f32d17993';
const attributeName = 'isDeleted';

const client = new Client();

client
  .setEndpoint('https://cloud.appwrite.io/v1') // Your API Endpoint
  .setProject(PROJECT_ID); // Your project ID

const databases = new Databases(client);

const OrderDetailsCheck = ({route}) => {
    const { products } = route.params;
    console.log("hello")
    console.log(products)

    const handleRemoveOrder = async () => {
      const response = await databases.listDocuments(DATABASE_ID, COLLECTION_ID, [Query.equal("Order_id", products[0].Order_id), Query.equal("isDeleted", false)]);
      console.log("first")
      for (const document of response.documents) {

        console.log(document)
      
        await databases.updateDocument(DATABASE_ID,COLLECTION_ID,document.$id,{'isDeleted': true})
      }
      console.log("second")

    Alert.alert('Order Removed', 'Order Removed successfully');
    }


  return (
    <View style={styles.container}>
      <Text style={styles.productName}>{products[0].Customer_name}</Text>
      <FlatList
        data={products}
        keyExtractor={(item) => item.$id}
        renderItem={({ item }) => (
          <View style={styles.productItem}>
            <View style={styles.imageContainer}>
              <Image
                source={{ uri: item.Image }}
                style={styles.productImage}
                resizeMode="cover"
              />
            </View>
            <View style={styles.productDetails}>
              <Text style={styles.productName}>{item.Name}</Text>
              <Text style={styles.productPrice}>Price: ${item.Price}</Text>
              <Text style={styles.productQuantity}>Quantity: {item.Quantity}</Text>
            </View>
          </View>
        )}
      />
      <TouchableOpacity
            onPress={handleRemoveOrder}
            style={styles.orderButton}>
            <Text style={styles.orderButtonText}>
              Remove Order
            </Text>
          </TouchableOpacity>
    </View>
  );
};


const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      padding: 20,
    },
    productItem: {
      flexDirection: 'row',
      borderBottomWidth: 1,
      borderBottomColor: '#ccc',
      padding: 10,
    },
    imageContainer: {
      marginRight: 10,
      width: 80,
      height: 80,
    },
    productImage: {
      width: '100%',
      height: '100%',
      borderRadius: 5,
    },
    productDetails: {
      flex: 1,
      justifyContent: 'center',
    },
    productName: {
      fontSize: 18,
      fontWeight: 'bold',
    },
    productPrice: {
      fontSize: 16,
    },
    productQuantity: {
      fontSize: 16,
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

export default OrderDetailsCheck;
