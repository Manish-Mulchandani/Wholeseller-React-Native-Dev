import React, { useState } from 'react';
import { View, Text, Button, Image, TextInput, TouchableOpacity } from 'react-native';
// import ImagePicker from 'react-native-image-picker';
import { RadioButton } from 'react-native-paper';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';

const AddProductScreen = () => {
  const [selectImage, setSelectImage] = useState('');
  const [image, setImage] = useState(null);
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [availability, setAvailability] = useState('yes');

  const ImagePicker = () => {

    let options = {
      storageOptions: {
        path: 'image',
      }
    }

    launchImageLibrary(options,response=>{
      setSelectImage(response.assets[0].uri)
      console.log(response.assets[0].uri)
    })
  }

  // const options = {
  //   title: 'Select Product Image',
  //   storageOptions: {
  //     skipBackup: true,
  //     path: 'images',
  //   },
  // };

  // const selectImage = () => {
  //   ImagePicker.showImagePicker(options, (response) => {
  //     if (response.didCancel) {
  //       console.log('Image picker canceled');
  //     } else if (response.error) {
  //       console.log('Image picker error:', response.error);
  //     } else {
  //       setImage({ uri: response.uri });
  //     }
  //   });
  // };

  const createProduct = () => {
    // Implement product creation logic, e.g., send data to an API
    console.log('Product Name:', name);
    console.log('Product Price:', price);
    console.log('Product Availability:', availability);
    console.log('Image URI:', image);
    // You can make an API request to create the product with this data
  };

  return (
    <View>
      <Text>Add Product</Text>
      <Image style={{height: 50, width:"100%"}} source={{uri:selectImage}}/>
      <Button title="Open Gallery" onPress={() => {ImagePicker()}}/>
      {/* <Button title="Select Image" onPress={selectImage} /> */}
      {image && <Image source={image} style={{ width: 100, height: 100 }} />}
      <TextInput
        placeholder="Product Name"
        value={name}
        onChangeText={(text) => setName(text)}
      />
      <TextInput
        placeholder="Product Price"
        value={price}
        onChangeText={(text) => setPrice(text)}
      />
      <Text>Availability:</Text>
      <RadioButton.Group onValueChange={(value) => setAvailability(value)} value={availability}>
        <View>
          <Text>Yes</Text>
          <RadioButton value="yes" />
        </View>
        <View>
          <Text>No</Text>
          <RadioButton value="no" />
        </View>
      </RadioButton.Group>
      <Button title="Create Product" onPress={createProduct} />
    </View>
  );
};

export default AddProductScreen;
