import * as glMatrix from 'gl-matrix'
import { NRRD_TYPES_TO_TYPEDARRAY, BUFFER_READ_METHODS } from './constants'

const NRRD_HEADER_BYTE_SIZE_MAX = 600
const NEW_LINE_CHAR = '\n'

/**
 * This is to stream **NRRD** files from client side in Javascript, aka. picking
 * a values given some [x, y, z] coordinates without having to fetch/download the
 * entire file.
 * Note that the [x, y, z] coordinates are natively in world space coordinates.
 *
 *  example:
 * ```javascript
 *  let filepath = 'http://127.0.0.1:8080/annotation_25_uncomp.nrrd'
 *  let ns = new nrrdstreamerclient(filepath)
 *
 *  ns.getNrrdHeader(function(nrrdHeader){
 *     ns.streamNrrdValue([2000, 4000, 4000],
 *     function(payload){
 *       console.log(payload)
 *       // The payload object is of form:
 *       // {
 *       //    error: null,
 *       //    position: [2000, 4000, 4000],
 *       //    value: 400
 *       // }
 *     })
 *  })
 * ```
 *
 * As the header of the NRRD file must be fetched before streaming any actual value,
 * the method is automatically called if necessary, so that the previous block of code
 * could be:
 * ```javascript
 *  let filepath = 'http://127.0.0.1:8080/annotation_25_uncomp.nrrd'
 *  let ns = new nrrdstreamerclient(filepath)
 *
 *  ns.streamNrrdValue([2000, 4000, 4000],
 *  function(payload){
 *    console.log(payload)
 *    // The payload object is of form:
 *    // {
 *    //    error: null,
 *    //    position: [2000, 4000, 4000],
 *    //    value: 400
 *    // }
 *  })
 * ```
 *
 * **IMPORTANT**: The NRRD file to be streamed must be uncompressed (`encoding: raw`)
 *
 * **TODO**
 * - Add convenience method to bet volume boundaries in world space and voxel space
 * - make it compatible with multiband volume (ie. quaternion or vector NRRD) or time series (ie. fMRI)
 *
 *
 */
class NrrdStreamer {

  /**
   * @constructor
   */
  constructor(url, httpHeaders = {}){
    this._url = url
    this._httpHeaders = httpHeaders
    this._nrrdHeader = null
    this._dataByteOffset = null
    this._nrrdVersion = null
  }


  /**
   * Set the HTTP header for future GET requests
   * @param {Object} httpHeaders - OPTIONAL the entries for HTTP headers
   */
  setHttpHeader(httpHeaders){
    this._httpHeaders = httpHeaders
  }


  /**
   * Fetch the header of the NRRD file and parses it. As this methods is asynchronous,
   * The NRRD header object is not returned but passed as the argument of the callback function
   * @param {Function} cb - callback function called when the header is parsed
   */
  getNrrdHeader(cb){
    let that = this
    // make a copy of the header
    let getHeaders = JSON.parse(JSON.stringify(this._httpHeaders))
    getHeaders['range'] = `bytes=0-${NRRD_HEADER_BYTE_SIZE_MAX}`

    fetch(this._url,{
      headers: getHeaders
    })
    .then(function(response) {
      return response.text()
    })
    .then(function(headerText) {
      that._findDataOffset(headerText)
      that._parseNrrdHeader(headerText, cb)
    });
  }


  /**
   * @private
   * Look at the raw text buffer from the NRRD header and verify at what byte
   * offset the actual data starts.
   * @param {string} nrrdTextHeader - the text buffer that contains the header but that is most likely a bit larger
   */
  _findDataOffset(nrrdTextHeader){
    for(let i=1; i<nrrdTextHeader.length; i++){
      if(nrrdTextHeader[i] === NEW_LINE_CHAR && nrrdTextHeader[i-1] === NEW_LINE_CHAR){
        this._dataByteOffset = i + 1
        break
      }
    }
  }


  /**
   * @private
   * @param {string} nrrdTextHeader - the text buffer that contains the header but that is most likely a bit larger
   * @param {Function} cb - callback function called to be called when the header is parsed
   */
  _parseNrrdHeader(nrrdTextHeader, cb){
    let trimmedHeader = nrrdTextHeader.slice(0, this._dataByteOffset).trim()

    let lines = trimmedHeader.split(NEW_LINE_CHAR)
    let magicNumber = lines[0].trim()

    let preMap = lines.slice(1)
    .filter( s => { // removing empty lines
      return s.length > 0
    })
    .filter( s => { // removing comments
      return (s[0] !== '#')
    })
    .map( s => {
      let keyVal = s.split(':')
      return {
        key: keyVal[0].trim(),
        val: keyVal[1].trim()
      }
    })

    let nrrdHeader = {}
    preMap.forEach( field => {
      nrrdHeader[field.key] = field.val
    })


    // parsing each fields of the header
    if(nrrdHeader['sizes']){
      nrrdHeader['sizes'] = nrrdHeader.sizes.split(' ').map( n => parseInt(n))
    }

    if(nrrdHeader['space directions']){
      nrrdHeader['space directions'] = nrrdHeader['space directions'].split(' ')
          .map(triple => {
            return triple.slice(1, triple.length-1).split(',').map(n => parseFloat(n))
          })
    }

    if(nrrdHeader['dimension']){
      nrrdHeader['dimension'] = parseInt(nrrdHeader['dimension'])
    }

    if(nrrdHeader['space origin']){
      nrrdHeader['space origin'] = nrrdHeader['space origin']
          .slice(1, nrrdHeader['space origin'].length-1)
          .split(',')
          .map(n => parseFloat(n))
    }

    if(nrrdHeader['kinds']){
      nrrdHeader['kinds'] = nrrdHeader['kinds'].split(' ')
    }

    if(nrrdHeader['space dimension']){
      nrrdHeader['space dimension'] = parseInt(nrrdHeader['space dimension'])
    }

    this._nrrdHeader = nrrdHeader
    cb(nrrdHeader)
  }


  /**
   * Get the value from the volume at a specific position
   * @param {Array} position - array as [x, y, z] in worls space coordinates
   * @param {Function} cb - callback function called when the streaming is done
   */
  streamNrrdValue(position, cb){
    let that = this
    if(this._nrrdHeader){
      this._streamValue(position, cb)
    } else {
      this.getNrrdHeader(function(nrrdHeader){
        that._streamValue(position, cb)
      })
    }
  }


  /**
   * @private
   * Private equivalent of streamNrrdValue, but assumes the NRRD header is already parsed.
   * @param {Array} position - array as [x, y, z] in worls space coordinates
   * @param {Function} cb - callback function called when the streaming is done
   */
  _streamValue(position, cb){
    let resultPayload = {
      error: null,
      position: position,
      value: null
    }

    if(this._nrrdHeader.encoding !== 'raw'){
      resultPayload.error = new Error(`To stream content, the encoding of the NRRD file must be 'raw' (aka. uncompressed). Found: '${this._nrrdHeader.encoding}'`)
      return cb(resultPayload)
    }

    let xsize = this._nrrdHeader['sizes'][0]
    let ysize = this._nrrdHeader['sizes'][1]
    let zsize = this._nrrdHeader['sizes'][2]

    let dataType = NRRD_TYPES_TO_TYPEDARRAY[this._nrrdHeader.type]
    let byteSizePerVoxel = dataType.BYTES_PER_ELEMENT

    let voxPos = this._getPositionWorldToVoxel(position)
    let voxelIndexFlat = xsize * ysize * voxPos[2] + xsize * voxPos[1] + voxPos[0]
    let byteIndexFlat = voxelIndexFlat * byteSizePerVoxel + this._dataByteOffset



    if(voxPos[0]<0 || voxPos[0]>this._nrrdHeader.sizes[0] ||
       voxPos[1]<0 || voxPos[1]>this._nrrdHeader.sizes[1] ||
       voxPos[2]<0 || voxPos[2]>this._nrrdHeader.sizes[2])
    {
      resultPayload.error = new Error(`The position is outside the volume.`)
      return cb(resultPayload)
    }

    let getHeaders = JSON.parse(JSON.stringify(this._httpHeaders))
    getHeaders['range'] = `bytes=${byteIndexFlat}-${byteIndexFlat + byteSizePerVoxel - 1}`

    fetch(this._url,{
      headers: getHeaders
    })
    .then(function(response) {
      return response.blob()
    })
    .then(function(responseBlob) {
      let fileReader = new FileReader()
      fileReader.onload  = function(event) {
        let arrayBuffer = event.target.result
        resultPayload.value = new dataType(arrayBuffer)[0]
        cb(resultPayload)
      }
      fileReader.readAsArrayBuffer(responseBlob)
    })
  }


  /**
   * @private
   * Converts world space coordinates to voxel space so that we can query the volume
   * using its buffer representation.
   * @param {Array} worldCoordinates - position as [x, y, z]
   * @reuturn {Array} as [x, y, z] in voxel space. Those are rounded.
   */
  _getPositionWorldToVoxel(worldCoordinates){
    let of = this._nrrdHeader['space origin'] // offset
    let sc = this._nrrdHeader['space directions'] // scale
    let v2w = glMatrix.mat4.fromValues(sc[0][0], sc[0][1], sc[0][2], 0,
                                       sc[1][0], sc[1][1], sc[1][2], 0,
                                       sc[2][0], sc[2][1], sc[2][2], 0,
                                       of[0], of[1], of[2], 1)
    let w2v = glMatrix.mat4.create()
    glMatrix.mat4.invert(w2v, v2w)
    let worldPos = glMatrix.vec3.fromValues(worldCoordinates[0], worldCoordinates[1], worldCoordinates[2])
    let voxelPos = glMatrix.vec3.create()
    glMatrix.vec3.transformMat4(voxelPos, worldPos, w2v)
    return voxelPos.map(n => Math.round(n))
  }

}

export default NrrdStreamer
