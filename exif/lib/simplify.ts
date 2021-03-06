import exif from './exif';
import date from './date';

var degreeTags = [{
  section: exif.GPSIFD,
  type: 0x0002,
  name: 'GPSLatitude',
  refType: 0x0001,
  refName: 'GPSLatitudeRef',
  posVal: 'N'
},
{
  section: exif.GPSIFD,
  type: 0x0004,
  name: 'GPSLongitude',
  refType: 0x0003,
  refName: 'GPSLongitudeRef',
  posVal: 'E'
}];
var dateTags = [{
  section: exif.SubIFD,
  type: 0x0132,
  name: 'ModifyDate'
},
{
  section: exif.SubIFD,
  type: 0x9003,
  name: 'DateTimeOriginal'
},
{
  section: exif.SubIFD,
  type: 0x9004,
  name: 'CreateDate'
},
{
  section: exif.SubIFD,
  type: 0x0132,
  name : 'ModifyDate',
}];

export default {
  castDegreeValues: function(getTagValue: any, setTagValue: any) {
    degreeTags.forEach(function(t) {
      var degreeVal = getTagValue(t);
      if(degreeVal) {
        var degreeRef = getTagValue({section: t.section, type: t.refType, name: t.refName});
        var degreeNumRef = degreeRef === t.posVal ? 1 : -1;
        var degree = (degreeVal[0] + (degreeVal[1] / 60) + (degreeVal[2] / 3600)) * degreeNumRef;
        setTagValue(t, degree);
      }
    });
  },
  castDateValues: function(getTagValue: any, setTagValue: any) {
    dateTags.forEach(function(t) {
      var dateStrVal = getTagValue(t);
      if(dateStrVal) {
        //some easy checks to determine two common date formats
        var timestamp = date.parseExifDate(dateStrVal);
        if(typeof timestamp !== 'undefined') {
          setTagValue(t, timestamp);
        }
      }
    });
  },
  simplifyValue: function(values: any, format: any) {
    if(Array.isArray(values)) {
      values = values.map(function(value) {
        if(format === 10 || format === 5) {
          return value[0] / value[1];
        }
        return value;
      });
      if(values.length === 1) {
        values = values[0];
      }
    }
    return values;
  }
};
