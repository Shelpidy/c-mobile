import React, { useEffect, useState } from "react";
import { Dimensions, StyleSheet, Text, View, Alert } from "react-native";
import { Button, TextInput, useTheme } from "react-native-paper";
import axios from "axios";

type TransferMoneyFormProps = {
   navigation: any;
};

const { width, height } = Dimensions.get("window");

const TransferMoneyForm = ({ navigation }: TransferMoneyFormProps) => {
   let theme = useTheme();
   const [showPassword, setShowPassword] = React.useState<boolean>(false);
   const [transfereeAccountNumber, setTransfereeAccountNumber] =
      useState<string>("");
   const [currentUser, setCurrentUser] = useState<CurrentUser>({});
   const [amount, setAmount] = useState<string>("");
   const [loading, setLoading] = useState<boolean>(false);

   useEffect(() => {
      setCurrentUser({
         id: 1,
         accountNumber: "1COM1000000000",
         email: "teax@gmail.com",
      });
   }, []);

   const handleTransferMoney = async () => {
      setLoading(true);

      let postObj = {
         transfereeAccountNumber,
         transferorAccontNumber: currentUser.accountNumber,
         amount,
      };
      try {
         let response = await axios.post(
            "http://192.168.0.104:5000/api/transactions/sendcommodity",
            postObj
         );
         if (response.status === 201) {
            console.log(response.data);
            setLoading(false);
            Alert.alert("Successful", response.data.data.message);
         } else {
            setLoading(false);
            Alert.alert("Failed", response.data.data.message);
         }
      } catch (err) {
         setLoading(false);
         console.log(err);
         Alert.alert("Failed", String(err));
      }

      // console.log(postState);
   };

   return (
      <View>
         <View style={styles.form}>
            <TextInput
               mode="outlined"
               style={styles.input}
               label="To"
               value={transfereeAccountNumber}
               onChangeText={(value) => setTransfereeAccountNumber(value)}
               // inputMode="email"
               right={
                  <TextInput.Icon
                     color={theme.colors.primary}
                     icon="card"></TextInput.Icon>
               }></TextInput>
            <TextInput
               mode="outlined"
               value={amount}
               style={styles.input}
               onChangeText={(value) => setAmount(value)}
               label="Amount"
               //    inputMode='none'
               right={
                  <TextInput.Icon
                     color={theme.colors.primary}
                     icon="pay"></TextInput.Icon>
               }></TextInput>
            <TextInput
               mode="outlined"
               style={styles.input}
               label="Password"
               // inputMode="text"
               secureTextEntry={!showPassword}
               right={
                  <TextInput.Icon
                     icon={showPassword ? "eye" : "eye-off"}
                     onPress={() =>
                        setShowPassword(!showPassword)
                     }></TextInput.Icon>
               }></TextInput>
            <Button
               loading={loading}
               disabled={loading}
               onPress={handleTransferMoney}
               mode="contained"
               style={{ marginTop: 15 }}>
               TransferMoney
            </Button>
         </View>
      </View>
   );
};

export default TransferMoneyForm;

const styles = StyleSheet.create({
   form: {
      padding: 0,
   },
   input: {
      width: width - 60,
      marginBottom: 10,
      fontFamily: "Poppins_300Light",
   },
});
