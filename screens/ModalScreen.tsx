import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Button from '../Button';

const ModalScreen = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Button
        title="Close"
        onPress={() => {
          navigation.goBack();
        }
      }/>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: 'lightgreen',
    justifyContent: 'center',
  },
});

export default ModalScreen;
