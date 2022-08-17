/* hsca mechanism -- hsca is a mechanism for creating and managing ipfs.
get multihash of the content - encoded with base32 use it as follwoing:
in url: base32Encded.ipfs.domain name"
decode the base32 to get the multihash of the content then
get the CID from the multihash and use it as the url
locally http://127.0.0.1:8080/ipfs/CID
*/

const httpProxy = require('http-proxy')
const http      = require('http')
const base32    = require('base32.js')
const base58    = require('base58-native')
const proxy     = httpProxy.createProxyServer()
const multihashing = require('multihashes')
const { equals } = require('uint8arrays/equals')
const CID = require('cids')
const security_default = require('./security-config.json5');

proxy.on('error', function(e) {
  console.log('proxy error: '+e)
})

// sudo iptables -t nat -A PREROUTING -p tcp --dport 80 -j REDIRECT --to-port 31337

http.createServer(function(req, res) {
  let hshcaRegexFailure = false
  
  for(let i = 0; i < security_default.security.length; i++) {
    res.setHeader(
        security_default.security[i].name,
        security_default.security[i].value
    );
    }     

  try {
    var hshca = req.headers.host.match(/^(.+)\.ipfs\.domain\.net$/i)[1]
  } catch(e) {
    console.log(e)
    hshcaRegexFailure = true
  }

  if(hshcaRegexFailure) {
    res.writeHead(404, {'Content-Type': 'text/plain'});
    res.end('Invalid HSHCA hash for archive lookup\n')
  } else {
    let decoder = new base32.Decoder({ type: "rfc4648" })
    let multihash = decoder.write(hshca.toUpperCase()).finalize()
    //var ipfsHash = base58.encode(multihash)
    let cid = new CID(0, 'dag-pb', multihash)
    let ipfsHash = cid.toString()
    console.log(ipfsHash)

    proxy.web(req, res, { target: 'http://127.0.0.1:8080/ipfs/'+ipfsHash })
  }
}).listen(31337, '0.0.0.0')

console.log('Server running')