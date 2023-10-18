// // import {appwrite} from '../App'; // Import your initialized Appwrite instance

// import { Appwrite } from 'appwrite';

// export const appwrite = new Appwrite();
// appwrite
//   .setEndpoint('https://cloud.appwrite.io/v1') // Replace with your Appwrite API endpoint
//   .setProject('652fa3f6300f32d17993'); // Replace with your Appwrite project ID


// // Function to upload an image and get its URL
// export const uploadImage = async (file) => {
//   try {
//     const storage = new appwrite.Storage(appwrite);
//     const response = await storage.createFile(file);

//     // The image URL is in the response
//     return response.$id;
//   } catch (error) {
//     console.error('Error uploading image:', error);
//     throw error;
//   }
// };
import { Client, Storage, ID } from "appwrite";

const client = new Client();

const storage = new Storage(client);

client
    .setEndpoint('https://cloud.appwrite.io/v1') // Your API Endpoint
    .setProject('652fa3f6300f32d17993') // Your project ID
;

// const promise = storage.createFile('652ffbcacdbb0f80832b', ID.unique(), file);

// promise.then(function (response) {
//     console.log(response); // Success
// }, function (error) {
//     console.log(error); // Failure
// });

export const uploadImageToAppwrite = (file) => {
    const promise = storage.createFile('652ffbcacdbb0f80832b', ID.unique(), file);
  
    promise.then(
      function (response) {
        // The image has been successfully uploaded, and you can get the URL from response.$id
        const imageURL = response.$id;
        console.log('Image URL:', imageURL);
      },
      function (error) {
        console.log('Error uploading image:', error);
      }
    );
  };
  