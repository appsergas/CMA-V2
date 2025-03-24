// Test config
const paymentGatewayTokenApiUrlTest = "https://api-gateway.sandbox.ngenius-payments.com/identity/auth/access-token"
const paymentGatewayCreateOrderUrlTest = "https://api-gateway.sandbox.ngenius-payments.com/transactions/outlets/"
const paymentApiKeyTest = "OTNlZjg1YzUtOTNjNS00MzQ2LWFjODEtMGY1NGU2NGQ4ZmMzOjg0MmI3YmE2LWYzYzgtNDA4ZS1hNTI3LWY5MTRjNjJjMjJkMA=="
const abudhabiTestOutletReference = "22e67da9-5546-4921-bf9d-c383bc965cd6"
const dubaiTestOutletReference = "22e67da9-5546-4921-bf9d-c383bc965cd6"
const fujairahTestOutletReference = "22e67da9-5546-4921-bf9d-c383bc965cd6"
const alainTestOutletReference = "22e67da9-5546-4921-bf9d-c383bc965cd6"

// Live config
const paymentGatewayTokenApiUrl = "https://api-gateway.ngenius-payments.com/identity/auth/access-token"
const paymentGatewayCreateOrderUrl = "https://api-gateway.ngenius-payments.com/transactions/outlets/"
// alain
const paymentApiKeyALN = "YmEwMzkwMzYtY2NhZS00OTVlLWFkNjMtNzAzOGZjN2NhMTc4OmYzNDQ3YjhlLTUzMTYtNDBlYi05NGY3LWE5NTBiN2UyYjYzYQ=="
const alainOutletReference = "b48004ba-586d-41c2-b4ad-739f1db30b85"
// dxb
const paymentApiKeyDXB = "ZjhiNGIzNGEtMzQ2MS00MTUwLTlhZTYtZTliN2RiODUxZWIwOmJkOTE2MmYxLWMwMzUtNDY4Ny04OTk2LTRkODE2NDYwY2U3MA=="
const dubaiOutletReference = "76797446-028b-48ce-ae31-0260d1a46a73"
// auh
const paymentApiKeyAUH = "M2ZkODFiMGQtMzM0Yy00MTMyLTg5MWEtZWYxNWNlYzNlZGY3OjY0YzAzZjYwLThjODItNDQyMi04NWY4LWZiNmViZDQzODkwNA=="
const abudhabiOutletReference = "b3fa2f0d-af90-4fde-813a-8fb41f2fc068"
// fuj
const fujairahOutletReference = "22e67da9-5546-4921-bf9d-c383bc965cd6"


const HTTP = {
  request_timeout: 5000000
}


module.exports = {
  paymentApiKeyAUH,
  paymentApiKeyDXB,
  paymentApiKeyALN,
  abudhabiOutletReference,
  dubaiOutletReference,
  fujairahOutletReference,
  alainOutletReference,
  abudhabiTestOutletReference,
  dubaiTestOutletReference,
  fujairahTestOutletReference,
  alainTestOutletReference,
  HTTP,
  paymentGatewayTokenApiUrl,
  paymentGatewayCreateOrderUrl,
  paymentGatewayTokenApiUrlTest,
  paymentGatewayCreateOrderUrlTest,
  paymentApiKeyTest
};
