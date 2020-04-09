# klodplord (A nonsense toy app for testing, demoing, experimenting)

# Discoveries

## Native bridging is required in order to write EXIF to images on iOS

See a note from the Expo forums. https://forums.expo.io/t/how-to-save-gps-data-in-image-on-ios/20383/2

Also check out this issue. https://github.com/react-native-community/react-native-camera/issues/2275

See the notes from RNCamera regarding how one can write a GPS location to an image. https://github.com/react-native-community/react-native-camera/blob/master/docs/RNCamera.md#takepictureasyncoptions-promise

These may seem coincidental, but I've confirmed this with a lot of testing. React Native has no ability to access EXIF GPS data on photos without bridging to native code.

See also the notes on the ImagePicker from Expo for iOS. https://docs.expo.io/versions/latest/sdk/imagepicker/

> On iOS the EXIF data does not include GPS tags in the camera case.

Whether by technical difficulty or security measures on the iOS side, location data is gone by the time it hits the React Native layer.

See also threads regarding Apple stripping out EXIF GPS data from the image picker. https://stackoverflow.com/a/21169901/1459103 and https://stackoverflow.com/a/12239286/1459103 and https://stackoverflow.com/questions/1238838/uiimagepickercontroller-and-extracting-exif-data-from-existing-photos.

It seems the only reliable way to extract GPS is to resolve the filesystem path and manually read it.

It seems the React Native Image Picker can do this, but again, this is a module that requires linking. I think it's only with native iOS functionality that this is achievable. https://github.com/react-native-community/react-native-image-picker/issues/178 and https://github.com/react-native-community/react-native-image-picker

I think this is a possible feat, but that it requires native app code in order to leverage the asset library to grab the data.

Oddly, if I use photos from my camera roll that I know have GPS data, I see none in React Native. However, if I load a file from a shared album, I *can* read the GPS metadata. If I copy the exact photo to a shared album the EXIF data for GPS is readable. So weird. I guess it's just the camera and camera roll specifically that limit this? I guess loading the file from other locations is fine? It's not true of all albums. Only shared albums it seems. This behavior seems repeatable and reliable. I can only assume something about shared albums is special than local non-shared albums.

I guess Apple makes choices on how and when they handle GPS data on photos. Maybe it has to do with whether or not it's in an asset library or some other construct.
