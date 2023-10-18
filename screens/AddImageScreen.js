// import React from 'react';
// import { View, Button, Image } from 'react-native';
// import ImagePicker from 'react-native-image-picker'; // You may use any other image picker library
// import { Client, Storage } from 'appwrite';

// const AddImageScreen = () => {
//   const appwrite = new Client();

//   appwrite
//     .setEndpoint('https://your-appwrite-endpoint/v1')
//     .setProject('your-appwrite-project-id')
//     .setKey('your-secret-api-key');

//   const storage = new Storage(appwrite);

//   const handleImagePick = () => {
//     const options = {
//       title: 'Select an Image',
//       storageOptions: {
//         skipBackup: true,
//         path: 'images',
//       },
//     };

//     ImagePicker.showImagePicker(options, response => {
//       if (response.didCancel) {
//         console.log('Image picker was canceled');
//       } else if (response.error) {
//         console.log('Image picker error: ', response.error);
//       } else {
//         // Convert the selected image to a Blob
//         const uri = response.uri;
//         const path = uri.replace('file://', ''); // Get the file path

//         // Upload the image to Appwrite
//         uploadImageToAppwrite(path);
//       }
//     });
//   };

//   const uploadImageToAppwrite = async (filePath) => {
//     try {
//       const response = await storage.createFile('<YOUR_BUCKET_ID>', filePath);
//       const fileId = response.$id;
//       console.log('File uploaded to Appwrite with ID:', fileId);
//       // Now you have the file URL available
//     } catch (error) {
//       console.error('Error uploading image to Appwrite:', error);
//     }
//   };

//   return (
//     <View>
//       <Button title="Pick an Image" onPress={handleImagePick} />
//     </View>
//   );
// };

// export default AddImageScreen;




import React, {useState} from 'react';
import {View, Text, Button, Image} from 'react-native';
import {launchImageLibrary} from 'react-native-image-picker';
import {uploadImageToAppwrite} from '../functions/appwriteServic'; // Import your Appwrite service

const ImageUploadComponent = () => {
  const [imageURL, setImageURL] = useState('');
  
  const handleImageUpload = async () => {
    const options = {
      mediaType: 'photo',
      includeBase64: true
    };

    launchImageLibrary(options, async response => {
      if (response.didCancel) {
        console.log('Image picker canceled');
      } else if (response.error) {
        console.log('Image picker error:', response.error);
      } else {
        const file = response;
        try {
            console.log(file);
            const uri = file.assets[0].uri;
            const base64 = file.assets[0].base64
            // console.log(uri)
            // console.log("base64:-", base64);
        fetch(uri).then(response => response.blob()).then(blob => {
            // console.log("blob is:-", blob);
        // const b = Buffer.from(base64);
        console.log(typeof blob);
        console.log(typeof base64);
        uploadImageToAppwrite(blob);
        })
        // const im = await uploadImageToAppwrite(base64);
        // console.log(im);
        setImageURL(uri);
        //console.log(uri)

        
        } catch (error) {
          console.error('Error uploading image:', error);
        }
      }
    });
  };

  return (
    <View>
      <Button title="Upload Image" onPress={handleImageUpload} />
      {imageURL && (
        <View>
          <Text>Image URL: {imageURL}</Text>
          <Image source={{uri: imageURL}} style={{width: 100, height: 100}} />
        </View>
      )}
    </View>
  );
};

export default ImageUploadComponent;
