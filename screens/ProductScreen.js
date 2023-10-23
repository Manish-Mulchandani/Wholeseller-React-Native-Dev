import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, FlatList, Image, StyleSheet } from 'react-native';
import axios from 'axios';
import { Client, Databases } from 'appwrite';

const DATABASE_ID = '6532eaf0a394c74aeb32'
const COLLECTION_ID = '6532eafc7e2ef6e5f9fb'
const PROJECT_ID = '652fa3f6300f32d17993'

const client = new Client();

client
  .setEndpoint('https://cloud.appwrite.io/v1') // Your API Endpoint
  .setProject(PROJECT_ID); // Your project ID

  const databases = new Databases(client);

const ProductScreen = () => {
  const [searchText, setSearchText] = useState('');
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);

  // useEffect(() => {
  //   const fetchProducts = async () => {
  //     try {
  //       const response = await axios.get('https://fakestoreapi.com/products');
  //       setProducts(response.data);
  //       setFilteredProducts(response.data); // Initialize with all products
  //     } catch (error) {
  //       console.error('Error fetching products:', error);
  //     }
  //   };

  //   fetchProducts();
  // }, []);

  useEffect(() => {
    // Make a request to fetch the products
    const promise = databases.listDocuments(DATABASE_ID, COLLECTION_ID);

    promise
      .then(function (response) {
        if (response && response.documents) {
          setProducts(response.documents);
        }
      })
      .catch(function (error) {
        console.log(error); // Handle the error appropriately
      });
  }, []); // Empty dependency array to run the effect only once

  // Function to filter products based on the search text
  useEffect(() => {
    const filtered = products.filter((product) =>
      product.Name.toLowerCase().includes(searchText.toLowerCase())
    );
    setFilteredProducts(filtered);
  }, [searchText, products]);

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Search products..."
        onChangeText={(text) => setSearchText(text)}
        style={styles.searchInput}
      />
      <FlatList
        data={filteredProducts}
        keyExtractor={(item) => item.$id}
        renderItem={({ item }) => (
          <View style={styles.productItem}>
            <Image source={{ uri: item.Image }} style={styles.productImage} />
            <View style={styles.productInfo}>
              <Text style={styles.productTitle}>{item.Name}</Text>
              <Text style={styles.productQuantity}>Price: Rs.{item.Price}</Text>
              <Text style={styles.productAvailability}>
              Available: {item.Available ? 'Yes' : 'No'}
            </Text>
              <Button title="Update" onPress={() => console.log("Update Products")} />
            </View>
          </View>
        )}
      />
    </View>
  );
};

// ... StyleSheet and export

// export default ProductScreen;


const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  searchInput: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    padding: 8,
  },
  productItem: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  productImage: {
    width: 100,
    height: 100,
    marginRight: 10,
  },
  productInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  productTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  productQuantity: {
    fontSize: 14,
    color: 'gray',
  },
  productAvailability: {
    fontSize: 14,
    color: 'green',
  },
});

export default ProductScreen;
