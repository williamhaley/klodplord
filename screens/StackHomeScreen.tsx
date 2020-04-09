import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Button from '../Button';

const StackHomeScreen = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Button
        title="Show Modal"
        onPress={() => {
          navigation.navigate('Modal');
        }
      }/>

      <Button
        title="Go To Details"
        onPress={() => {
          navigation.navigate('Details');
        }
      }/>

      <Button title="Show Camera" onPress={() => navigation.navigate('Camera')} />
      <Button title="Show Image Picker" onPress={() => navigation.navigate('ImagePicker')} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: 'pink',
    justifyContent: 'space-evenly',
  },
});

export default StackHomeScreen;
