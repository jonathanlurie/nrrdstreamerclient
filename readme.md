<!-- Generated by documentation.js. Update this documentation by updating the source code. -->

### Table of Contents

-   [NrrdStreamer][1]
    -   [Parameters][2]
    -   [setHttpHeader][3]
        -   [Parameters][4]
    -   [getNrrdHeader][5]
        -   [Parameters][6]
    -   [streamNrrdValue][7]
        -   [Parameters][8]

## NrrdStreamer

This is to stream **NRRD** files from client side in Javascript, aka. picking
a values given some [x, y, z] coordinates without having to fetch/download the
entire file.
Note that the [x, y, z] coordinates are natively in world space coordinates.

 example:

```javascript
 let filepath = 'http://127.0.0.1:8080/annotation_25_uncomp.nrrd'
 let ns = new nrrdstreamerclient(filepath)

 ns.getNrrdHeader(function(nrrdHeader){
    ns.streamNrrdValue([2000, 4000, 4000],
    function(payload){
      console.log(payload)
      // The payload object is of form:
      // {
      //    error: null,
      //    position: [2000, 4000, 4000],
      //    value: 400
      // }
    })
 })
```

As the header of the NRRD file must be fetched before streaming any actual value,
the method is automatically called if necessary, so that the previous block of code
could be:

```javascript
 let filepath = 'http://127.0.0.1:8080/annotation_25_uncomp.nrrd'
 let ns = new nrrdstreamerclient(filepath)

 ns.streamNrrdValue([2000, 4000, 4000],
 function(payload){
   console.log(payload)
   // The payload object is of form:
   // {
   //    error: null,
   //    position: [2000, 4000, 4000],
   //    value: 400
   // }
 })
```

**IMPORTANT**: The NRRD file to be streamed must be uncompressed (`encoding: raw`)

**TODO**

-   Add convenience method to bet volume boundaries in world space and voxel space
-   make it compatible with multiband volume (ie. quaternion or vector NRRD) or time series (ie. fMRI)

### Parameters

-   `url`  
-   `httpHeaders`   (optional, default `{}`)

### setHttpHeader

Set the HTTP header for future GET requests

#### Parameters

-   `httpHeaders` **[Object][9]** OPTIONAL the entries for HTTP headers

### getNrrdHeader

Fetch the header of the NRRD file and parses it. As this methods is asynchronous,
The NRRD header object is not returned but passed as the argument of the callback function

#### Parameters

-   `cb` **[Function][10]** callback function called when the header is parsed

### streamNrrdValue

Get the value from the volume at a specific position

#### Parameters

-   `position` **[Array][11]** array as [x, y, z] in worls space coordinates
-   `cb` **[Function][10]** callback function called when the streaming is done

[1]: #nrrdstreamer

[2]: #parameters

[3]: #sethttpheader

[4]: #parameters-1

[5]: #getnrrdheader

[6]: #parameters-2

[7]: #streamnrrdvalue

[8]: #parameters-3

[9]: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object

[10]: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Statements/function

[11]: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array