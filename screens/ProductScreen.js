import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  Image,
  StyleSheet,
  RefreshControl,
  Modal,
  TouchableOpacity,
  useColorScheme,
  Alert,
} from 'react-native';
import {Client, Databases, Query} from 'appwrite';
import {useNavigation} from '@react-navigation/native';
import ImageViewer from 'react-native-image-zoom-viewer';

const DATABASE_ID = '6532eaf0a394c74aeb32';
const COLLECTION_ID = '6532eafc7e2ef6e5f9fb';
const PROJECT_ID = '652fa3f6300f32d17993';

const client = new Client();

client
  .setEndpoint('https://cloud.appwrite.io/v1') // Your API Endpoint
  .setProject(PROJECT_ID); // Your project ID

const databases = new Databases(client);

const ProductScreen = () => {
  const [searchText, setSearchText] = useState('');
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [fullScreenImage, setFullScreenImage] = useState(null);
  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';

  const navigation = useNavigation();

  useEffect(() => {
    // Make a request to fetch the products
    const fetchProducts = () => {
      const promise = databases.listDocuments(DATABASE_ID, COLLECTION_ID, [
        Query.limit(1000),
      ]);

      promise
        .then(function (response) {
          if (response && response.documents) {
            setProducts(response.documents.reverse());
          }
        })
        .catch(function (error) {
          console.log(error); // Handle the error appropriately
          Alert.alert('Products not Loaded. Check your internet connection and restart again')
        })
        .finally(function () {
          setRefreshing(false); // Stop refreshing when done
        });
    };
    fetchProducts();
  }, [refreshing]); // Empty dependency array to run the effect only once

  // Function to filter products based on the search text
  useEffect(() => {
    const filtered = products.filter(product =>
      product.Name.toLowerCase().includes(searchText.toLowerCase()),
    );
    setFilteredProducts(filtered);
  }, [searchText, products]);

  const handleUpdate = item => {
    navigation.navigate('UpdateProductScreen', {item});
  };

  const resetSearch = () => {
    setSearchText('');
    setRefreshing(true); // Start refreshing
  };

  const openFullScreenImage = (imageUri) => {
    setFullScreenImage([{ url: imageUri }]);
  };

  return (
    <View style={[
      styles.container,
      {backgroundColor: isDarkMode ? '#000' : '#fff'},
    ]}>
      <TextInput
        placeholder="Search products..."
        onChangeText={text => setSearchText(text)}
        style={[
          styles.searchInput,
          {
            borderColor: isDarkMode ? '#888' : 'gray',
            color: isDarkMode ? '#fff' : '#000',
          },
        ]}
      />
      <FlatList
        data={filteredProducts}
        keyExtractor={item => item.$id}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={resetSearch} />
        }
        renderItem={({item}) => (
          <View style={styles.productItem}>
            <TouchableOpacity onPress={() => openFullScreenImage(`${item.Image}&output=webp`)}>
            <Image
              source={{uri: `${item.Image}&output=webp`}}
              style={styles.productImage}
              resizeMode="contain"
            />
            </TouchableOpacity>
            <View style={styles.productInfo}>
              <Text style={[
                  styles.productTitle,
                  {color: isDarkMode ? '#fff' : '#000'},
                ]}>{item.Name}</Text>
              <Text style={[
                  styles.productQuantity,
                  {color: isDarkMode ? '#fff' : '#000'},
                ]}>Price: Rs.{item.Price}</Text>
              <Text
                style={[
                  styles.productAvailability,
                  {color: item.Available ? 'green' : 'red'},
                ]}>
                Available: {item.Available ? 'Yes' : 'No'}
              </Text>
              <Button title="Update" onPress={() => handleUpdate(item)} />
            </View>
          </View>
        )}
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
    fontWeight: 'bold',
  },
  productAvailability: {
    fontSize: 14,
    color: 'green',
  },
});

export default ProductScreen;
