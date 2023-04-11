# create wr-dev CA private key
openssl genpkey -algorithm EC -out wr-dev.secp256r1.ca.private -pkeyopt ec_paramgen_curve:prime256v1

# create wr-dev CA csr
openssl req -new -key wr-dev.secp256r1.ca.private -out wr-dev.secp256r1.ca.csr -config req.ca.config

# create wr-dev CA cert
openssl x509 -req -in wr-dev.secp256r1.ca.csr -signkey wr-dev.secp256r1.ca.private -out wr-dev.secp256r1.ca.crt

# create wr-dev private key
openssl genpkey -algorithm EC -out wr-dev.secp256r1.private -pkeyopt ec_paramgen_curve:prime256v1

# create wr-dev csr
openssl req -new -key wr-dev.secp256r1.private -out wr-dev.secp256r1.csr -config req.config

# create wr-dev cert
openssl x509 -req -in wr-dev.secp256r1.csr -CA wr-dev.secp256r1.ca.crt -CAkey wr-dev.secp256r1.ca.private -CAcreateserial -out wr-dev.secp256r1.crt -extfile req.config -extensions reqexts
