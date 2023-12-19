import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Image,
  TouchableOpacity,
  Alert,
  Modal,
  useColorScheme,
} from 'react-native';
// import OrderDetails from './OrderDetails';
import {Client, Databases, Query} from 'appwrite';
import {Button} from 'react-native-paper';
import ImageViewer from 'react-native-image-zoom-viewer';

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
  const {products} = route.params;
  const [fullScreenImage, setFullScreenImage] = useState(null);
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';
  // console.log("hello")
  // console.log(products)

  const checkRemoveOrder = () => {
    Alert.alert(
      'Confirm Order',
      'Are you sure you want to place this order?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {text: 'Delete Order', onPress: () => handleRemoveOrder()},
      ],
    );

  }

  const handleRemoveOrder = async () => {
    const response = await databases.listDocuments(DATABASE_ID, COLLECTION_ID, [
      Query.equal('Order_id', products[0].Order_id),
      Query.equal('isDeleted', false),
      Query.limit(1000),
    ]);
    // console.log("first")
    for (const document of response.documents) {
      // console.log(document)

      await databases.updateDocument(DATABASE_ID, COLLECTION_ID, document.$id, {
        isDeleted: true,
      });
    }
    // console.log("second")

    Alert.alert('Order Removed', 'Order Removed successfully');
  };

  const openFullScreenImage = (imageUri) => {
    setFullScreenImage([{ url: imageUri }]);
  };

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: isDarkMode ? '#121212' : '#fff' },
      ]}
    >
      <Text style={[styles.productName, { color: isDarkMode ? '#fff' : '#000' }]}>
        {products[0].Customer_name || products[0].Phone_Number}
      </Text>
      <FlatList
        data={products}
        keyExtractor={(item) => item.$id}
        renderItem={({ item }) => (
          <View style={styles.productItem}>
            <View style={styles.imageContainer}>
              <TouchableOpacity onPress={() => openFullScreenImage(`${item.Image}&output=webp`)}>
                <Image
                  source={{ uri: `${item.Image}&output=webp` }}
                  style={styles.productImage}
                  resizeMode="contain"
                />
              </TouchableOpacity>
            </View>
            <View style={styles.productDetails}>
              <Text style={[styles.productName, { color: isDarkMode ? '#fff' : '#000' }]}>
                {item.Name}
              </Text>
              <Text style={[styles.productPrice, { color: isDarkMode ? '#fff' : '#000' }]}>
                Price: Rs.{item.Price}
              </Text>
              <Text style={[styles.productQuantity, { color: isDarkMode ? '#fff' : '#000' }]}>
                Quantity: {item.Quantity}
              </Text>
              {item.Remark && (
                <Text style={[styles.productRemarks, { color: isDarkMode ? '#ccc' : '#888' }]}>
                  Remarks: {item.Remark}
                </Text>
              )}
            </View>
          </View>
        )}
      />
      <TouchableOpacity onPress={checkRemoveOrder} style={styles.orderButton}>
        <Text style={styles.orderButtonText}>Remove Order</Text>
      </TouchableOpacity>
      {fullScreenImage && (
        <Modal visible={true} transparent={true}>
          <ImageViewer
            imageUrls={fullScreenImage}
            enableSwipeDown
            onSwipeDown={() => setFullScreenImage(null)}
          />
        </Modal>
      )}
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
    fontWeight: 'bold',
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
  productRemarks: {
    fontSize: 16,
    color: '#888', // Set color for remarks
  },
});

export default OrderDetailsCheck;
