/* hsca mechanism -- hsca is a mechanism for creating and managing ipfs.
get multihash of the content - encoded with base32 use it as follwoing:
in url: base32Encded.ipfs.domain name"
decode the base32 to get the multihash of the content then
get the CID from the multihash and use it as the url
locally http://127.0.0.1:8080/ipfs/CID
*/
const http = require('http');
const base32    = require('base32.js')
const multihashing = require('multihashes')
const CID = require('cids')
const assert =  require('assert')
const chai = require('chai');
const chaiHttp = require('chai-http');
const should = chai.should();
require('dotenv').config()

let domain = process.env.DOMAIN 
let proxy = process.env.PROXY
let CID_V = process.env.CID_V

// Test Hashing 
describe('Testing Hashing', function() {
    it('should hash a message', function() {
        mh = multihashing.fromB58String(CID_V);
        var encoder = new base32.Encoder({ type: "rfc4648" })
        var multihashEn = encoder.write(mh).finalize()
        console.log(multihashEn.toLowerCase())
        var decoder = new base32.Decoder({ type: "rfc4648" })
        var multihashDc= decoder.write(multihashEn).finalize()
        console.log(multihashDc)
        //console.log(equals(mh, multihashDc));
        let cid = new CID(0, 'dag-pb', multihashDc)
        let ipfsHash = cid.toString()
        assert.equal(ipfsHash, CID_V)
    });
});

chai.use(chaiHttp);
chai.request.Request = chai.request.Test;
require('superagent-proxy')(chai.request);

//Testing Proxy Request
describe('Testing Proxy Request', function() {
    it('should proxy a request', function() {
        //Arange
        mh = multihashing.fromB58String(CID_V);
        var encoder = new base32.Encoder({ type: "rfc4648" })
        var multihashEn = encoder.write(mh).finalize()
        console.log(multihashEn.toLowerCase())
        const params = {
            method: 'GET',
            url: "http://"+multihashEn.toLowerCase()+domain,
            proxy: proxy
          }
        //Act
        chai.request(params.url)
            .get('/')
            .proxy(params.proxy)
            .end((err, res) => {
                //Assert
                  res.should.have.status(200);
                  //res.body.should.be.a('array');
                  //res.body.length.should.be.eql(0);
              done();
            });
    });        

});


