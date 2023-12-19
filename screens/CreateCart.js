import React, {useEffect, useState} from 'react';
import {
  TextInput,
  View,
  Text,
  Button,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  Modal,
} from 'react-native';
import {Client, Databases, Query} from 'appwrite';
import ImageViewer from 'react-native-image-zoom-viewer';


const DATABASE_ID = '6532eaf0a394c74aeb32';
const COLLECTION_ID = '6532eafc7e2ef6e5f9fb';
const PROJECT_ID = '652fa3f6300f32d17993';

const client = new Client();
const databases = new Databases(client);

client
  .setEndpoint('https://cloud.appwrite.io/v1') // Your API Endpoint
  .setProject(PROJECT_ID); // Your project ID

const CreateCart = ({cart, setCart}) => {
  const [products, setProducts] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [zoomedUri, setZoomedUri] = useState(null);
  const [fullScreenImage, setFullScreenImage] = useState(null);


  useEffect(() => {
    // Make a request to fetch the products
    const promise = databases.listDocuments(DATABASE_ID, COLLECTION_ID, [
      Query.limit(1000),
    ]);

    promise
      .then(function (response) {
        if (response && response.documents) {
          setProducts(response.documents.reverse());
          // console.log(response.documents)
        }
      })
      .catch(function (error) {
        console.log(error); // Handle the error appropriately
      });
  }, []); // Empty dependency array to run the effect only once

  const handleIncrement = product => {
    setCart(prevCart => {
      const updatedCart = {...prevCart};
      if (updatedCart[product.$id]) {
        updatedCart[product.$id].quantity += 1;
      } else {
        updatedCart[product.$id] = {...product, quantity: 1};
      }
      return updatedCart;
    });
  };

  const handleDecrement = product => {
    setCart(prevCart => {
      const updatedCart = {...prevCart};
      if (updatedCart[product.$id] && updatedCart[product.$id].quantity > 1) {
        updatedCart[product.$id].quantity -= 1;
      } else {
        delete updatedCart[product.$id];
      }
      return updatedCart;
    });
  };

  const openFullScreenImage = (imageUri) => {
    setFullScreenImage([{ url: imageUri }]);
  };

  const filteredProducts = products.filter(product =>
    product.Name.toLowerCase().includes(searchText.toLowerCase()),
  );

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Search products..."
        onChangeText={text => setSearchText(text)}
        style={styles.searchInput}
      />
      <FlatList
        data={filteredProducts}
        keyExtractor={item => item.$id}
        renderItem={({item}) => (
          <View style={styles.cartItem}>
            <TouchableOpacity
              onPress={() => openFullScreenImage(`${item.Image}&output=webp`)}>
              <Image
                source={{uri: `${item.Image}&output=webp`}}
                style={styles.productImage}
                resizeMode="contain"
              />
            </TouchableOpacity>
            <View style={styles.itemDetails}>
              <Text style={styles.productTitle}>{item.Name}</Text>
              <Text style={styles.productPrice}>
                Rs.{item.Price.toFixed(2)}
              </Text>
              <Text
                style={[
                  styles.productAvailability,
                  {color: item.Available ? 'green' : 'red'},
                ]}>
                Available: {item.Available ? 'Yes' : 'No'}
              </Text>
              <View style={styles.quantityContainer}>
                <TouchableOpacity
                  onPress={() => handleDecrement(item)}
                  disabled={!item.Available}>
                  <View style={styles.roundButton}>
                    <Text style={styles.roundButtonText}>-</Text>
                  </View>
                </TouchableOpacity>
                <Text style={styles.quantityText}>
                  {cart[item.$id] ? cart[item.$id].quantity : 0}
                </Text>
                <TouchableOpacity
                  onPress={() => handleIncrement(item)}
                  disabled={!item.Available}>
                  <View style={styles.roundButton}>
                    <Text style={styles.roundButtonText}>+</Text>
                  </View>
                </TouchableOpacity>
              </View>
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
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  searchInput: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  cartItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 12,
    elevation: 2,
    shadowColor: 'rgba(0, 0, 0, 0.2)',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 1,
  },
  productImage: {
    width: 110,
    height: 110,
    marginRight: 16,
    borderRadius: 8,
  },
  itemDetails: {
    flex: 1,
  },
  productTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  productPrice: {
    fontSize: 16,
    color: '#555',
  },
  productAvailability: {
    fontSize: 14,
  },
  quantityContainer: {
    marginTop: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  roundButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'lightgray',
    justifyContent: 'center',
    alignItems: 'center',
  },
  roundButtonText: {
    fontSize: 20,
  },
  quantityText: {
    fontSize: 18,
    marginHorizontal: 20,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  closeButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    zIndex: 1,
  },
  closeButtonText: {
    fontSize: 18,
    color: 'white',
  },
  zoomedImage: {
    width: 300,
    height: 300,
    borderRadius: 16,
  },
});

export default CreateCart