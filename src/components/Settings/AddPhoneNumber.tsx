import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { TextInput, Button, Divider } from 'react-native-paper';
import axios from 'axios';
import { useCurrentUser } from '../../utils/CustomHooks';


const PhoneNumberForm = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const currentUser = useCurrentUser()


  const handleAddPhoneNumber = async () => {
    setLoading(true);

    try {
      const response = await axios.put('http://192.168.0.107:5000/api/auth/users/contact/', {
        key: 'phoneNumbers',
        value: phoneNumber,
        userId: currentUser?.id, // Replace with the actual user ID
      });

      if (response.status === 202) {
        Alert.alert('Success', 'Phone number added successfully');
      } else {
        Alert.alert('Error', 'Failed to add phone number');
      }
    } catch (error) {
      console.log(error);
      Alert.alert('Error', 'An error occurred while adding phone number');
    }

    setLoading(false);
  };

  return (
    <View style={styles.container}>
      <TextInput
       outlineStyle={{borderColor:"#f6f6f6"}}
        label="Phone Number"
        value={phoneNumber}
        onChangeText={setPhoneNumber}
        mode="outlined"
        style={styles.input}
      />

      <Button mode="contained" onPress={handleAddPhoneNumber} loading={loading} disabled={loading}>
        Add Phone Number
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 5,
  },
  input: {
    marginBottom: 10,
    backgroundColor:"#f6f6f6"
  },
});

export default PhoneNumberForm;
