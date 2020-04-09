import React, { useState, useEffect } from 'react';
import { StyleSheet, View, SafeAreaView } from 'react-native';
import { Camera as ExpoCamera } from 'expo-camera';
import Exif from '../exif/index';
import { Buffer } from 'buffer';
import Button from '../Button';
import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';
import * as FileSystem from 'expo-file-system';

const CameraScreen = () => {
  const [hasPermission, setHasPermission] = useState<boolean>(false);
  const [location, setLocation] = useState<Location.LocationData>();
  const [type, setType] = useState(ExpoCamera.Constants.Type.back);
  let camera: ExpoCamera;

  useEffect(() => {
    (async () => {
      const { status } = await ExpoCamera.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  useEffect(() => {
    (async () => {
      let { status } = await Permissions.askAsync(Permissions.LOCATION);
      if (status !== 'granted') {
        console.error('Permission to access location was denied');
      }

      let newLocation = await Location.getCurrentPositionAsync({});
      setLocation(newLocation);
    })();
  }, []);

  useEffect(() => {
    (async () => {
      const { status } = await Permissions.getAsync(Permissions.CAMERA);
    })();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <ExpoCamera style={styles.camera} ref={(ref) => {
          if (ref) {
            camera = ref;
          }
        }} type={type}>
        <View style={styles.controls}>
          <Button
            title="Flip"
            onPress={() => {
              setType(
                type === ExpoCamera.Constants.Type.back
                  ? ExpoCamera.Constants.Type.front
                  : ExpoCamera.Constants.Type.back
              );
            }}
          />

          <Button
            title="Snap!"
            onPress={async () => {
              // TODO WFH Expo camera does not allow writing GPS to the image.
              // RNCamera can do it, but that requires linking so we can get
              // access to native bridged code. The React Native layer cannot
              // easily do this out-of-the-box.
              console.log(location?.coords.latitude, ', ', location?.coords.longitude);

              const photo = await camera.takePictureAsync({ exif: true });
              console.log('original exif:', photo);

              const { width, height, uri } = photo;

              const base64 = await FileSystem.readAsStringAsync(uri, { encoding: FileSystem.EncodingType.Base64 });
              if (base64) {
                try {
                  console.log('ok...trying it');
                  const buf = Buffer.from(base64, 'base64')
                  const parser = Exif.create(buf, undefined);
                  const result = parser.parse();
                  console.log(result);
                } catch(err) {
                  console.log('oh no...error');
                  console.error(err);
                }
              }

              console.log(width, height, uri);
            }}
          />
        </View>
      </ExpoCamera>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'purple',
    alignItems: 'center',
    justifyContent: 'center',
  },
  camera: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  controls: {
    flex: 1,
    paddingLeft: 20,
    paddingRight: 20,
    paddingBottom: 80,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

export default CameraScreen;
