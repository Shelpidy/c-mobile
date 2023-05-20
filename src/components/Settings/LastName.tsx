import React, { useState } from "react";
import { View, StyleSheet, Alert } from "react-native";
import { TextInput, Button } from "react-native-paper";
import axios from "axios";
import { useCurrentUser } from "../../utils/CustomHooks";

const LastNameForm = () => {
   const [lastName, setLastName] = useState("");
   const [loading, setLoading] = useState(false);
   const currentUser = useCurrentUser();

   const handleUpdate = async () => {
      setLoading(true);

      try {
         const response = await axios.put(
            "http://192.168.232.183:5000/api/auth/users/personal/",
            {
               key: "lastName",
               value: lastName,
               userId: currentUser?.id, // Replace with the actual user ID
            }
         );

         if (response.status === 202) {
            Alert.alert("Success", "Last name changed successfully");
         } else {
            Alert.alert("Error", "Failed to change last name");
         }
      } catch (error) {
         console.log(error);
         Alert.alert("Error", "An error occurred while changing last name");
      }

      setLoading(false);
   };

   return (
      <View>
         <TextInput
            label="Last Name"
            outlineStyle={{ borderColor: "#f6f6f6" }}
            value={lastName}
            onChangeText={setLastName}
            mode="outlined"
            style={styles.input}
         />

         <Button
            mode="contained"
            onPress={handleUpdate}
            loading={loading}
            disabled={loading}>
            Save Last Name
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
      backgroundColor: "#f6f6f6",
   },
});

export default LastNameForm;
