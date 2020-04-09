import jpeg from './jpeg';
import simplify from './simplify';
import tagNames from './exif-tags';
import exif from './exif';

class ExifResult {
  startMarker: any;
  tags: any;
  imageSize: any;
  thumbnailOffset: any;
  thumbnailLength: any;
  thumbnailType: any;
  app1Offset: any;

  constructor(startMarker: any, tags: any, imageSize: any, thumbnailOffset: any, thumbnailLength: any, thumbnailType: any, app1Offset: any) {
    this.startMarker = startMarker;
    this.tags = tags;
    this.imageSize = imageSize;
    this.thumbnailOffset = thumbnailOffset;
    this.thumbnailLength = thumbnailLength;
    this.thumbnailType = thumbnailType;
    this.app1Offset = app1Offset;
  }

  hasThumbnail(mime: any) {
    if(!this.thumbnailOffset || !this.thumbnailLength) {
      return false;
    }
    if(typeof mime !== 'string') {
      return true;
    }
    if(mime.toLowerCase().trim() === 'image/jpeg') {
      return this.thumbnailType === 6;
    }
    if(mime.toLowerCase().trim() === 'image/tiff') {
      return this.thumbnailType === 1;
    }
    return false;
  }

  getThumbnailOffset() {
    return this.app1Offset + 6 + this.thumbnailOffset;
  }

  getThumbnailLength() {
    return this.thumbnailLength;
  }

  getThumbnailBuffer() {
    return this._getThumbnailStream().nextBuffer(this.thumbnailLength);
  }

  _getThumbnailStream() {
    return this.startMarker.openWithOffset(this.getThumbnailOffset());
  }

  getImageSize() {
    return this.imageSize;
  }

  getThumbnailSize() {
    var stream = this._getThumbnailStream(), size;
    jpeg.parseSections(stream, function(sectionType: any, sectionStream: any) {
      if(jpeg.getSectionName(sectionType).name === 'SOF') {
        size = jpeg.getSizeFromSOFSection(sectionStream);
      }
    });
    return size;
  }
}

class Parser {
  stream: any;
  flags: {
    readBinaryTags: boolean;
    hidePointers: boolean;
    resolveTagNames: boolean;
    imageSize: any;
    returnTags: any;
    simplifyValues: any;
  };


  constructor (stream: any) {
    this.stream = stream;
    this.flags = {
      readBinaryTags: false,
      resolveTagNames: true,
      simplifyValues: true,
      imageSize: true,
      hidePointers: true,
      returnTags: true
    };
  }

  enableBinaryFields(enable: any) {
    this.flags.readBinaryTags = !!enable;
    return this;
  }

  enablePointers(enable: any) {
    this.flags.hidePointers = !enable;
    return this;
  }

  enableTagNames(enable: any) {
    this.flags.resolveTagNames = !!enable;
    return this;
  }

  enableImageSize(enable: any) {
    this.flags.imageSize = !!enable;
    return this;
  }

  enableReturnTags(enable: any) {
    this.flags.returnTags = !!enable;
    return this;
  }

  enableSimpleValues(enable: any) {
    this.flags.simplifyValues = !!enable;
    return this;
  }

  parse() {
    let tags: any;

    var start = this.stream.mark(),
      stream = start.openWithOffset(0),
      flags = this.flags,
      imageSize,
      thumbnailOffset,
      thumbnailLength,
      thumbnailType,
      app1Offset,
      getTagValue, setTagValue;

    if(flags.resolveTagNames) {
      tags = {};
      getTagValue = function(t: any) {
        return tags[t.name];
      };
      setTagValue = function(t: any, value: any) {
        tags[t.name] = value;
      };
    } else {
      tags = [];
      getTagValue = function(t: any) {
        var i;
        for(i = 0; i < tags.length; ++i) {
          if(tags[i].type === t.type && tags[i].section === t.section) {
            return tags.value;
          }
        }
      };
      setTagValue = function(t: any, value: any) {
        var i;
        for(i = 0; i < tags.length; ++i) {
          if(tags[i].type === t.type && tags[i].section === t.section) {
            tags.value = value;
            return;
          }
        }
      };
    }

    jpeg.parseSections(stream, function(sectionType: any, sectionStream: any) {
      var validExifHeaders, sectionOffset = sectionStream.offsetFrom(start);
      if(sectionType === 0xE1) {
        validExifHeaders = exif.parseTags(sectionStream, function(ifdSection: any, tagType: any, value: any, format: any) {
          //ignore binary fields if disabled
          if(!flags.readBinaryTags && format === 7) {
            return;
          }

          if(tagType === 0x0201) {
            thumbnailOffset = value[0];
            if(flags.hidePointers) {return;}
          } else if(tagType === 0x0202) {
            thumbnailLength = value[0];
            if(flags.hidePointers) {return;}
          } else if(tagType === 0x0103) {
            thumbnailType = value[0];
            if(flags.hidePointers) {return;}
          }
          //if flag is set to not store tags, return here after storing pointers
          if(!flags.returnTags) {
            return;
          }

          if(flags.simplifyValues) {
            value = simplify.simplifyValue(value, format);
          }
          if(flags.resolveTagNames) {
            var sectionTagNames = ifdSection === exif.GPSIFD ? tagNames.gps : tagNames.exif;
            var name = sectionTagNames[tagType];
            if(!name) {
              name = tagNames.exif[tagType];
            }
            if (!tags.hasOwnProperty(name)) {
              tags[name] = value;
            }
          } else {
            tags.push({
              section: ifdSection,
              type: tagType,
              value: value
            });
          }
        });
        if(validExifHeaders) {
          app1Offset = sectionOffset;
        }
      }
      else if(flags.imageSize && jpeg.getSectionName(sectionType).name === 'SOF') {
        imageSize = jpeg.getSizeFromSOFSection(sectionStream);
      }
    });

    if(flags.simplifyValues) {
      simplify.castDegreeValues(getTagValue, setTagValue);
      simplify.castDateValues(getTagValue, setTagValue);
    }

    return new ExifResult(start, tags, imageSize, thumbnailOffset, thumbnailLength, thumbnailType, app1Offset);
  }
};

export default Parser;
