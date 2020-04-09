import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createStackNavigator, TransitionPresets } from '@react-navigation/stack';
import { NavigationContainer, useNavigation, DrawerActions } from '@react-navigation/native';
import StackHomeScreen from './screens/StackHomeScreen';
import CameraScreen from './screens/CameraScreen';
import ModalScreen from './screens/ModalScreen';
import DetailsScreen from './screens/DetailsScreen';
import ImagePickerScreen from './screens/ImagePickerScreen';
import { SafeAreaView } from 'react-native';
import Button from './Button';

const RootStack = createStackNavigator();
const MainStack = createStackNavigator();
const Drawer = createDrawerNavigator();

/**
 * This root has no header. We set up modals in the root that we want to display
 * full screen. All it has are modals and then the sub-stack that defines are
 * "normal" content.
 */
const RootStackNavigator = () => {
  // If we wanted, this "root" stack could show the header, but then
  // anything nested would have the header too, which seems silly.
  const rootOptions = {
    cardOverlayEnabled: true,
    ...TransitionPresets.ModalPresentationIOS,
  };

  // This could be any other stack or individual screen.
  const MainComponent = DrawerStackScreen;

  // Note the mode for screens in this navigator is "modal".
  return (
    <RootStack.Navigator mode="modal" headerMode="none" screenOptions={() => rootOptions}>
      <RootStack.Screen name="Main" component={MainComponent} />
      <RootStack.Screen name="Modal" component={ModalScreen} />
      <RootStack.Screen name="ImagePicker" component={ImagePickerScreen} />
    </RootStack.Navigator>
  );
};

const DrawerStackScreen = () => {
  const navigation = useNavigation();

  // Note how we wrap the navigator in a view here so that we can add some
  // common navigation views around this entire stack.
  return (
    <SafeAreaView style={{flex: 1}}>
      <Button title="Show Drawer" onPress={() => { navigation.dispatch(DrawerActions.toggleDrawer()) }}/>
      <Drawer.Navigator initialRouteName="MainStackScreen">
        <Drawer.Screen name="MainStackScreen" component={MainStackNavigator} />
        <Drawer.Screen name="Details" component={DetailsScreen} />
      </Drawer.Navigator>
    </SafeAreaView>
  );
};

const MainStackNavigator = () => {
  return (
    <MainStack.Navigator>
      <MainStack.Screen name="StackHome" component={StackHomeScreen} />
      <MainStack.Screen name="Details" options={{ headerShown: false }} component={DetailsScreen} />
      <MainStack.Screen name="Camera" options={{ title: 'Custom Title' }} component={CameraScreen} />
    </MainStack.Navigator>
  );
};

export default function App() {
  return (
    <NavigationContainer>
      {RootStackNavigator()}
    </NavigationContainer>
  );
}
