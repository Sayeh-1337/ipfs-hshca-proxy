//testing crypto stuff for the hscha mechanism 
const base32    = require('base32.js')
const multihashing = require('multihashes')
const { equals } = require('uint8arrays/equals')
const CID = require('cids')


let msg = "Muhammad ElSayeh";
const bytes = new TextEncoder().encode(msg)

const mh = multihashing.encode(bytes, 'sha2-256')
console.log(mh)

var encoder = new base32.Encoder({ type: "rfc4648" })
var multihashEn = encoder.write(mh).finalize()
console.log(multihashEn.toLowerCase())

var decoder = new base32.Decoder({ type: "rfc4648" })
var multihashDc= decoder.write(multihashEn).finalize()
console.log(multihashDc)
console.log(equals(mh, multihashDc));