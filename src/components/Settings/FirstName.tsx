import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import axios from 'axios';
import { useCurrentUser } from '../../utils/CustomHooks';

const FirstNameForm = () => {
  const [firstName, setFirstName] = useState('');
  const [loading, setLoading] = useState(false);
  const currentUser = useCurrentUser()

  const handleUpdate = async () => {
    setLoading(true);

    try {
      const response = await axios.put('http://192.168.175.183:5000/api/auth/users/personal/', {
        key: 'firstName',
        value: firstName,
        userId: currentUser?.id, // Replace with the actual user ID
      });

      if (response.status === 202) {
        Alert.alert('Success', 'First name changed successfully');
      } else {
        Alert.alert('Error', 'Failed to change first name');
      }
    } catch (error) {
      console.log(error);
      Alert.alert('Error', 'An error occurred while changing first name');
    }

    setLoading(false);
  };

  return (
    <View>
      <TextInput
        label="First Name"
        value={firstName}
        onChangeText={setFirstName}
        mode="outlined"
        style={styles.input}
      />

      <Button mode="contained" onPress={handleUpdate} loading={loading} disabled={loading}>
        Save First Name
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({

  input: {
    marginBottom: 10,
  },
});

export default FirstNameForm;
