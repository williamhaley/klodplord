import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';

interface Props {
  title: string;
  onPress: () => void;
}

const Button = (props: Props) => {
  const { title, onPress } = props;

  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <Text>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    height: 60,
    padding: 20,
    borderRadius: 15,
    backgroundColor: 'white',
    alignSelf: 'center', // This prevents it from filling the width
  }
});

export default Button;
