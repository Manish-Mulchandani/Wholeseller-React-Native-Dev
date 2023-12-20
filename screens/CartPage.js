import React, {useEffect, useState} from 'react';
import {
  Alert,
  View,
  Text,
  Button,
  FlatList,
  Image,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TextInput,
  useColorScheme,
} from 'react-native';
import {Client, Databases} from 'appwrite';
import 'react-native-get-random-values';
import {v4 as uuidv4} from 'uuid';
import ImageViewer from 'react-native-image-zoom-viewer';

const DATABASE_ID = '6532eaf0a394c74aeb32';
const COLLECTION_ID = '6533aad5270260d0d839';
const PROJECT_ID = '652fa3f6300f32d17993';

const client = new Client()
  .setEndpoint('https://cloud.appwrite.io/v1') // Your API Endpoint
  .setProject(PROJECT_ID); // Your project ID

const databases = new Databases(client);

const CartPage = ({cart, setCart}) => {
  const cartItems = Object.values(cart);
  const [idToCopy, setIdToCopy] = useState(
    'Place Order before Copying OrderId',
  );
  const [remarks, setRemarks] = useState({});
  const [fullScreenImage, setFullScreenImage] = useState(null);
  const [customerName, setCustomerName] = useState(null)
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';

  const handlePlaceOrder = () => {
    if (Object.keys(cart).length > 0 && customerName) {
      // Display a confirmation alert
      Alert.alert(
        'Confirm Order',
        'Are you sure you want to place this order?',
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {text: 'Place Order', onPress: () => confirmPlaceOrder()},
        ],
      );
    }
    else {
        Alert.alert('Order Not Placed', 'Either add Products or Add Customers Name')
    }
  };
  const confirmPlaceOrder = () => {
    if (Object.keys(cart).length > 0) {
      // Display a simple notification
      const ordersData = cart;

      let orderid = uuidv4();
      setIdToCopy(orderid);
      //setModalVisible(true)
      const addOrdersToAppwrite = () => {
        for (const orderID in ordersData) {
          const order = ordersData[orderID];
          const remark = remarks[orderID];
          console.log('first' + order);
          // Add each order to the orders collection
          const promise = databases.createDocument(
            DATABASE_ID,
            COLLECTION_ID,
            uuidv4(),
            {
              Order_id: orderid,
              Quantity: order.quantity,
              Name: order.Name,
              Image: order.Image,
              Price: order.Price,
              Remark: remark,
              Customer_name: customerName
            },
          );
          console.log('second');

          promise.then(
            function (response) {
              console.log(response); // Success
              Alert.alert('Order Placed', 'Your order has been placed successfully');
            },
            function (error) {
              console.log(error); // Failure
              Alert.alert('Order Not Placed', 'Retry placing your order and check internet connection');
            },
          );
        }
      };
      addOrdersToAppwrite();
      //console.log(cart)
      
      //setModalVisible(true)
    }
  };
  const handleRemoveFromCart = productId => {
    setCart(prevCart => {
      const updatedCart = {...prevCart};
      if (updatedCart[productId]) {
        delete updatedCart[productId]; // Remove the item from the cart
      }
      return updatedCart;
    });
  };

  const handleDecrement = productId => {
    setCart(prevCart => {
      const updatedCart = {...prevCart};
      if (updatedCart[productId]) {
        if (updatedCart[productId].quantity > 1) {
          updatedCart[productId].quantity -= 1;
        } else {
          delete updatedCart[productId];
        }
      }
      return updatedCart;
    });
  };

  const handleIncrement = productId => {
    setCart(prevCart => {
      const updatedCart = {...prevCart};
      if (updatedCart[productId]) {
        updatedCart[productId].quantity += 1;
      }
      return updatedCart;
    });
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
      <Text style={[styles.cartTitle, { color: isDarkMode ? '#fff' : '#000' }]}>
        Cart Items
      </Text>
      <FlatList
        data={cartItems}
        keyExtractor={(item) => item.$id}
        renderItem={({ item }) => (
          <View style={[styles.cartItem,{ backgroundColor: isDarkMode ? '#121212' : '#fff' },]}>
            <TouchableOpacity onPress={() => openFullScreenImage(`${item.Image}&output=webp`)}>
              <Image
                source={{ uri: `${item.Image}&output=webp` }}
                style={styles.productImage}
                resizeMode="contain"
              />
            </TouchableOpacity>
            <View style={styles.itemDetails}>
              <Text style={[styles.productTitle, { color: isDarkMode ? '#fff' : '#000' }]}>
                {item.Name}
              </Text>
              <Text style={[styles.productPrice, { color: isDarkMode ? '#fff' : '#000' }]}>
                Price: Rs.{item.Price}
              </Text>
              <TextInput
                placeholder="Add Remarks"
                onChangeText={(text) =>
                  setRemarks((prevRemarks) => ({
                    ...prevRemarks,
                    [item.$id]: text,
                  }))
                }
                style={[
                  styles.remarksInput,
                  { color: isDarkMode ? '#fff' : '#000' },
                ]}
              />
              <View style={styles.quantityAndRemoveContainer}>
                <View style={styles.quantityContainer}>
                  <Button
                    title="-"
                    onPress={() => handleDecrement(item.$id)}
                    style={styles.quantityButton}
                  />
                  <Text style={[styles.quantityText, { color: isDarkMode ? '#fff' : '#000' }]}>
                    {item.quantity}
                  </Text>
                  <Button
                    title="+"
                    onPress={() => handleIncrement(item.$id)}
                    style={styles.quantityButton}
                  />
                </View>
                <Button
                  title="Remove"
                  onPress={() => handleRemoveFromCart(item.$id)}
                  style={styles.removeFromCartButton}
                />
              </View>
            </View>
          </View>
        )}
      />
      <Text style={[styles.total, { color: isDarkMode ? '#fff' : '#000' }]}>
        Total: Rs.{calculateTotal(cartItems)}
      </Text>
      <TextInput
        placeholder="Enter Customer's Name"
        onChangeText={(text) => setCustomerName(text)}
        style={[
          styles.customerInput,
          { color: isDarkMode ? '#fff' : '#000' },
        ]}
      />
      <Button
        style={[
          styles.placeOrderButton,
          { backgroundColor: isDarkMode ? '#292929' : '#007BFF' },
        ]}
        title="Place Order"
        onPress={handlePlaceOrder}
      />
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

const calculateTotal = cartItems => {
  return cartItems
    .reduce((total, item) => total + item.Price * item.quantity, 0)
    .toFixed(2);
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#F5F5F5', // Set the background color
  },
  cartTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 2,
    color: '#333', // Dark text color
  },
  cartItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 8,
    shadowColor: 'rgba(0, 0, 0, 0.2)',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 1,
    elevation: 2, // Add a subtle shadow (for Android)
  },
  productImage: {
    width: 80,
    height: 80,
    marginRight: 16,
    borderRadius: 8, // Make the image round
  },
  itemDetails: {
    flex: 1,
  },
  productTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#222', // Slightly darker text color
  },
  productPrice: {
    fontSize: 16,
    color: '#555', // Dark gray text color
  },
  quantityAndRemoveContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'lightgray',
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityText: {
    fontSize: 18,
    marginHorizontal: 10,
  },
  removeFromCartButton: {
    backgroundColor: 'red',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8, // Make the button round
    color: 'white', // Text color
    fontWeight: 'bold',
  },
  total: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
    color: '#333',
  },
  placeOrderButton: {
    marginTop: 20,
    backgroundColor: '#007BFF',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8, // Make the button round
    color: 'white', // Text color
    fontWeight: 'bold',
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between', // Use 'space-between' to add space between the buttons
    marginTop: 10, // Adjust the margin as needed
  },
  remarksInput: {
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 8,
    padding: 4,
    marginTop: 4,
  },
  customerInput: {
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 8,
    padding: 4,
    marginTop: 4,
    marginBottom: 8,
  }
});

export default CartPage;
