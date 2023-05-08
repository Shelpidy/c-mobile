import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { TextInput, Button, Divider } from 'react-native-paper';
import axios from 'axios';
import { useCurrentUser } from '../../utils/CustomHooks';


const PinCodeForm = () => {
  const [password, setPassword] = useState('');
  const [newPinCode, setNewPinCode] = useState('');
  const [confirmPinCode, setConfirmPinCode] = useState('');
  const [loading, setLoading] = useState(false);
  const currentUser = useCurrentUser()

  const handleCheckPassword = async () => {
    try {
      const response = await axios.post('http://192.168.175.183:5000/api/auth/users/checkpassword/', {
        password,
        userId: currentUser?.id, // Replace with the actual user ID
      });

      if (response.status === 202) {
        handleUpdate();
      } else {
        Alert.alert('Error', 'Invalid password');
      }
    } catch (error) {
      console.log(error);
      Alert.alert('Error', 'An error occurred while checking password');
    }
  };

  const handleUpdate = async () => {
    setLoading(true);

    try {
      const response = await axios.put('http://192.168.175.183:5000/api/auth/users/personal/', {
        key: 'pinCode',
        value: newPinCode,
        userId: currentUser?.id, // Replace with the actual user ID
      });

      if (response.status === 202) {
        Alert.alert('Success', 'Pin code changed successfully');
      } else {
        Alert.alert('Error', 'Failed to change pin code');
      }
    } catch (error) {
      console.log(error);
      Alert.alert('Error', 'An error occurred while changing pin code');
    }

    setLoading(false);
  };

  return (
    <View style={styles.container}>
      <TextInput
        label="Password"
        value={password}
        onChangeText={setPassword}
        mode="outlined"
        style={styles.input}
        secureTextEntry
      />

      <TextInput
        label="New Pin Code"
        value={newPinCode}
        onChangeText={setNewPinCode}
        mode="outlined"
        style={styles.input}
        secureTextEntry
      />

      <TextInput
        label="Confirm Pin Code"
        value={confirmPinCode}
        onChangeText={setConfirmPinCode}
        mode="outlined"
        style={styles.input}
        secureTextEntry
      />

      <Button mode="contained" onPress={handleCheckPassword} loading={loading} disabled={loading}>
        Change Pin Code
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
  },
  input: {
    marginBottom: 10,
  },
});

export default PinCodeForm;
