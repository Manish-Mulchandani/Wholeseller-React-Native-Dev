import React, {useState} from 'react';
import {View, TextInput, Button, Alert} from 'react-native';
import {Client, Databases, Query} from 'appwrite';

const DATABASE_ID = '6532eaf0a394c74aeb32';
const COLLECTION_ID = '6533aad5270260d0d839';
const PROJECT_ID = '652fa3f6300f32d17993';

const client = new Client();

client
  .setEndpoint('https://cloud.appwrite.io/v1') // Your API Endpoint
  .setProject(PROJECT_ID); // Your project ID

const databases = new Databases(client);

const UpdateCustomerNameScreen = ({route, navigation}) => {
  const [orderId, setOrderId] = useState('');
  const [customerName, setCustomerName] = useState('');

  const handleUpdate = () => {
    const query = `{"Order_id":"${orderId}"}`;

    databases
      .listDocuments(DATABASE_ID, COLLECTION_ID, [
        Query.equal('Order_id', orderId),
      ])
      .then(
        async response => {
          const documents = response.documents;
          console.log(documents);
          // Step 2: Update each matching document with the provided Customer_name
          const updatePromises = documents.map(async document => {
            const updatedDocument = {
              Customer_name: customerName,
            };

            return databases.updateDocument(
              DATABASE_ID,
              COLLECTION_ID,
              document.$id,
              updatedDocument,
            );
          });

          // Step 3: Wait for all update promises to resolve
          await Promise.all(updatePromises);

          Alert.alert('Order Added', 'Order Added successfully');
          console.log('All matching documents updated successfully');
        },
        error => {
          console.error('Error listing documents:', error);
        },
      );
  };

  return (
    <View>
      <TextInput
        placeholder="Order ID"
        onChangeText={setOrderId}
        value={orderId}
      />
      <TextInput
        placeholder="Customer Name"
        onChangeText={setCustomerName}
        value={customerName}
      />
      <Button title="Update Customer Name" onPress={handleUpdate} />
    </View>
  );
};

export default UpdateCustomerNameScreen;
