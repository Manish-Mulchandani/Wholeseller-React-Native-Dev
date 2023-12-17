import React, { useState } from 'react';
import { View, TextInput, Button, Alert, StyleSheet } from 'react-native';
import { Client, Databases, Query } from 'appwrite';

const DATABASE_ID = '6532eaf0a394c74aeb32';
const COLLECTION_ID = '6533aad5270260d0d839';
const PROJECT_ID = '652fa3f6300f32d17993';

const client = new Client();

client
  .setEndpoint('https://cloud.appwrite.io/v1') // Your API Endpoint
  .setProject(PROJECT_ID); // Your project ID

const databases = new Databases(client);

const UpdateCustomerNameScreen = ({ route, navigation }) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [customerName, setCustomerName] = useState('');

  const handleUpdate = () => {
    databases
      .listDocuments(DATABASE_ID, COLLECTION_ID, [
        Query.equal('Phone_Number', phoneNumber),
        Query.equal('isDeleted', false),
      ])
      .then(
        async response => {
          const documents = response.documents;
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
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Customer Phone Number"
        onChangeText={setPhoneNumber}
        value={phoneNumber}
      />
      <TextInput
        style={styles.input}
        placeholder="Customer Name"
        onChangeText={setCustomerName}
        value={customerName}
      />
      <Button title="Update Customer Name" onPress={handleUpdate} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    padding: 10,
    width: '100%',
  },
});

export default UpdateCustomerNameScreen;
