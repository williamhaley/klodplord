import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Button from '../Button';

const DetailsScreen = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Button
        title="Go Back"
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
    backgroundColor: 'yellow',
    justifyContent: 'center',
  },
});

export default DetailsScreen;
