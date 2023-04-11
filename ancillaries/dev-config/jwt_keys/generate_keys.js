const jsrsasign = require("jsrsasign");
const { KEYUTIL, KJUR } = jsrsasign;
const keypair = KEYUTIL.generateKeypair("EC", "secp256r1");
const prv = JSON.stringify(KEYUTIL.getJWKFromKey(keypair.prvKeyObj));
const pub = JSON.stringify(KEYUTIL.getJWKFromKey(keypair.pubKeyObj));
console.log(prv);
console.log(pub);
const prv1 = KEYUTIL.getKey(JSON.parse(prv));
const pub1 = KEYUTIL.getKey(JSON.parse(pub));

const jwt = KJUR.jws.JWS.sign(null, {
  alg: "ES256",
  cty: "JWT",
}, { fruit: "orange" }, prv1);

const valid = KJUR.jws.JWS.verify(jwt, pub1, ["ES256"]);
console.log(valid)
console.log(KJUR.jws.JWS.parse(jwt))