import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';

const OrderDetails = ({ route }) => {
  const { customerName, products } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.customerName}>Customer Name: {customerName}</Text>
      <FlatList
        data={products}
        keyExtractor={(product) => product.product_id.toString()}
        renderItem={({ item }) => (
          <View style={styles.productItem}>
            <Text style={styles.productName}>Name: {item.product_name}</Text>
            <Text style={styles.productPrice}>Price: {item.product_price}</Text>
            <Text style={styles.productQuantity}>Quantity: {item.quantity}</Text>
            <Text style={styles.productAvailable}>
              Available: {item.product_available ? 'Yes' : 'No'}
            </Text>
          </View>
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
  customerName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  productItem: {
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
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
  productAvailable: {
    fontSize: 16,
  },
});

export default OrderDetails;
