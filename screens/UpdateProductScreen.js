import {View, Text, StyleSheet, Image, ScrollView, Alert, useColorScheme} from 'react-native';
import React, {useState} from 'react';
import {Button, RadioButton, TextInput} from 'react-native-paper';
import {Account, Client, Databases} from 'appwrite';
import {launchImageLibrary} from 'react-native-image-picker';
import 'react-native-get-random-values';
import {v4 as uuidv4} from 'uuid';

const API_URL = 'https://cloud.appwrite.io/v1';
const PROJECT_ID = '652fa3f6300f32d17993';
const BUCKET_ID = '652ffbcacdbb0f80832b';
const DATABASE_ID = '6532eaf0a394c74aeb32';
const COLLECTION_ID = '6532eafc7e2ef6e5f9fb';

const client = new Client();
const account = new Account(client);
const databases = new Databases(client);

client.setEndpoint(API_URL).setProject(PROJECT_ID); // Replace with your project ID

const UpdateProductScreen = ({route}) => {
  const data = route.params.item;
  // console.log(data)
  //data.Available=false
  const [name, setName] = useState(data.Name);
  const [price, setPrice] = useState(data.Price.toString());
  const [availability, setAvailability] = useState(data.Available);
  const [image, setImage] = useState(data.Image);

  const [uri, setUri] = useState(data.Image);

  const [imageName, setImageName] = useState(null);
  const [ftype, setFtype] = useState(null);
  const [succ, setSucc] = useState(false);


  const colorScheme = useColorScheme();
  const isDarkMode = colorScheme === 'dark';

  const uploadImage = async () => {
    const fileId = 'unique()';
    const type = ftype ? ftype : match ? `image/${match[1]}` : `image`;
    const formData = new FormData();
    formData.append('fileId', fileId);
    formData.append('file', {
      uri: uri,
      name: imageName,
      type,
    });
    try {
      const response = await fetch(
        `${API_URL}/storage/buckets/${BUCKET_ID}/files/`,
        {
          method: 'POST',
          headers: {
            'X-Appwrite-Project': PROJECT_ID,
            'x-sdk-version': 'appwrite:web:10.2.0',
          },
          body: formData,
          credentials: 'include',
        },
      );

      if (response.ok) {
        const data = await response.json();
        // console.log('File uploaded successfully:', data);
        // console.log(data.$id);
        setImage(
          `${API_URL}/storage/buckets/${BUCKET_ID}/files/${data.$id}/view?project=${PROJECT_ID}`,
        );
        //https://cloud.appwrite.io/v1/storage/buckets/652ffbcacdbb0f80832b/files/6532c63cea7b54cdeac6/view?project=652fa3f6300f32d17993
        //setImage(data.$id)
        setSucc(true);
        Alert.alert('Image Uploaded', 'Image Uploaded successfully');
      } else {
        // console.error('File upload failed. Status:', response.status);
        const errorData = await response.json();
        Alert.alert('Image not Uploaded', 'Image not uploaded successfully');
        // console.error('Error Details:', errorData);
      }
    } catch (error) {
      // console.error('An error occurred while uploading the file:', error);
      Alert.alert('Image not Uploaded', 'Image not uploaded successfully');
    }
  };

  const pickImage = () => {
    const options = {
      mediaType: 'photo',
      includeBase64: false,
      maxHeight: 2000,
      maxWidth: 2000,
    };

    launchImageLibrary(options, async response => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('Image picker error: ', response.error);
      } else {
        //console.log(response);
        try {
          // console.log(response.assets);
          setUri(response.assets[0].uri);
          setImageName(response.assets[0].fileName);
          setFtype(response.assets[0].type);
        } catch (error) {
          console.log(error);
        }
      }
    });
  };

  const updateProduct = () => {
    // Implement product creation logic, e.g., send data to an API
    // console.log('Product Name:', name);
    // console.log('Product Price:', price);
    // console.log('Product Availability:', availability);
    // console.log('Image URI:', image);
    
    // You can make an API request to create the product with this data
    const promise = databases.updateDocument(
      DATABASE_ID,
      COLLECTION_ID,
      data.$id,
      {
        Name: name,
        Price: price,
        Available: availability,
        Image: image,
      },
    );
    // console.log('second');

    promise.then(
      function (response) {
        Alert.alert('Product Updated', 'Producte Updated successfully');
        // console.log(response); // Success
      },
      function (error) {
        Alert.alert('Product Not Updated', 'Producte did not update');
        // console.log(error); // Failure
      },
    );

    setName(null);
    setPrice(null);
    setAvailability(true);

    setImage(null);
    setUri(null);
    setImageName(null);
    setFtype(null);
    setSucc(null);
  };

  return (
    <ScrollView
      style={[
        styles.container,
        { backgroundColor: isDarkMode ? '#121212' : '#fff' },
      ]}
    >
      <Button
        style={[
          styles.button,
          { borderColor: isDarkMode ? '#fff' : '#007BFF', color: '#007BFF' },
        ]}
        mode="outlined"
        onPress={pickImage}
      >
        Pick an image from camera roll
      </Button>

      {uri && (
        <Image
          source={{ uri: uri }}
          style={styles.image}
          resizeMode="contain"
        />
      )}

      <Button
        style={[
          styles.button,
          { backgroundColor: isDarkMode ? '#292929' : '#007BFF' },
        ]}
        mode="contained"
        onPress={uploadImage}
      >
        Upload Image
      </Button>

      {succ && (
        <Text style={[styles.successText, { color: isDarkMode ? '#fff' : '#000' }]}>
          UPLOADED
        </Text>
      )}

      <TextInput
        style={[styles.input, { color: isDarkMode ? '#fff' : '#000' }]}
        placeholder="Product Name"
        value={name}
        onChangeText={(text) => setName(text)}
      />

      <TextInput
        style={[styles.input, { color: isDarkMode ? '#fff' : '#000' }]}
        placeholder="Product Price"
        value={price}
        onChangeText={(text) => setPrice(text)}
        keyboardType="numeric"
      />

      <Text style={[styles.label, { color: isDarkMode ? '#fff' : '#000' }]}>
        Availability:
      </Text>

      <RadioButton.Group
        onValueChange={(value) => setAvailability(value)}
        value={availability}
      >
        <View style={styles.radioButtonContainer}>
          <Text style={{ color: isDarkMode ? '#fff' : '#000' }}>Yes</Text>
          <RadioButton value={true} />
        </View>
        <View style={styles.radioButtonContainer}>
          <Text style={{ color: isDarkMode ? '#fff' : '#000' }}>No</Text>
          <RadioButton value={false} />
        </View>
      </RadioButton.Group>

      <Button
        style={[
          styles.button,
          { backgroundColor: isDarkMode ? '#292929' : '#007BFF' },
        ]}
        mode="contained"
        onPress={updateProduct}
      >
        Update Product
      </Button>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    // justifyContent: 'center',
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  button: {
    marginBottom: 16,
  },
  image: {
    width: 200,
    height: 200,
    borderRadius: 8,
    marginBottom: 16,
  },
  successText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    color: 'green',
    textAlign: 'center',
  },
  failText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    color: 'red',
    textAlign: 'center',
  },
  input: {
    height: 40,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 8,
    padding: 10,
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
  },
  radioButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
});

export default UpdateProductScreen;
