import React from 'react';
import { View, Text, FlatList, StyleSheet, Image } from 'react-native';
// import OrderDetails from './OrderDetails';

const OrderDetailsCheck = ({route}) => {
    const { products } = route.params;
    console.log("hello")
    console.log(products)
  return (
    <View style={styles.container}>
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
  });

export default OrderDetailsCheck;
