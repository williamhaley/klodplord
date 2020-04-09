import * as fs from 'fs';
import Exif from './index';

const fileName = '/home/will/Photographs/2019_07_21[Bike ride to Shedd, Adler, Lincoln Park, Bucktown]/2019-07-21 17.33.50.jpg';

fs.readFile(fileName, (error: Error, buffer: Buffer) => {
  if (error) {
    console.error(error);
    return;
  }

  const parser = Exif.create(buffer, undefined);
  try {
    const result = parser.parse();
    // console.log(result);
    console.log(result.tags.Make);
    console.log(result.tags.Model);
    console.log(result.tags.GPSLatitude, result.tags.GPSLongitude);
  } catch(err) {
    console.error(err);
  }
});
