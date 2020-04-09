import React, { useEffect } from 'react';
import { StyleSheet, SafeAreaView } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import Exif from '../exif/index';
import { Buffer } from 'buffer';
import Button from '../Button';
import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';

const ImagePickerScreen = () => {
  useEffect(() => {
    (async () => {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      console.log(`image picker status: ${status}`);
    })();
  }, []);

  useEffect(() => {
    (async () => {
      const { status } = await ImagePicker.requestCameraRollPermissionsAsync();
      console.log(`image picker camera roll status: ${status}`);
    })();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <Button
        title="Select Photo"
        onPress={async () => {
          // Holy shit, this all actually works! This jives with the examples
          // I've seen on StackOverflow tonight. Tying back an Asset to its
          // metadata is simple, but (for whatever reason) images returned from
          // the ImagePicker get stripped of data in _most_ but not all cases.
          // The albums returned by MediaLibrary are sparse. They do not include
          // shared albums or "Recents" (Camera Roll). This is not a holistic
          // solution to the problem.
          const albums = await MediaLibrary.getAlbumsAsync();
          console.log(albums);
          const album = await MediaLibrary.getAlbumAsync('Test');
          const albumAssets = await MediaLibrary.getAssetsAsync({ album });
          const asset = albumAssets.assets[0];
          const info = await MediaLibrary.getAssetInfoAsync(asset);
          console.log(info.exif['{GPS}']);

          const { uri }: any = await ImagePicker.launchImageLibraryAsync({ exif: true });
          console.log(uri);

          // Even this does not work. The file is being read from the Camera
          // Roll and somewhere between that selection and here, the contents
          // have had GPS data stripped out. Insane! This works on the exact
          // same photo if it's in a shared album. It's like whatever process
          // presents the binary data from the Camera Roll says, "Wait one
          // moment, I just need to scrub GPS real quick...ok, here you go".
          // In both those cases, Camera Roll (or local album) vs Shared Album
          // the URLs show they're copied to my app's container. They're in the
          // same dir. It's whatever feeds them there that's doing this removal.
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
        }}
      />
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
});

export default ImagePickerScreen;
