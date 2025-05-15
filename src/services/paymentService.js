// PaymentService.js

import axios from 'axios';
import {
    paymentApiKeyAUH,
    paymentApiKeyDXB,
    paymentApiKeyALN,
    paymentApiKeyTest,
    abudhabiOutletReference,
    dubaiOutletReference,
    fujairahOutletReference,
    alainOutletReference,
    abudhabiTestOutletReference,
    dubaiTestOutletReference,
    fujairahTestOutletReference,
    alainTestOutletReference,
    paymentGatewayTokenApiUrl,
    paymentGatewayTokenApiUrlTest,
    paymentGatewayCreateOrderUrl,
    paymentGatewayCreateOrderUrlTest,
  } from '../services/api/data/data/constants.js';

  import {
    initiateCardPayment,
    initiateSamsungPay,
    initiateApplePay,

} from '@network-international/react-native-ngenius';

/**
 * Generate a unique trace ID
 */
export const generateTraceId = () => {
    const pattern = "xxxx-yxxx-4xxx-xxxxxxxxxxxx";
    let date = new Date().getTime();

    return pattern.replace(/[xy]/g, function (c) {
        const r = (date + Math.random() * 16) % 16 | 0;
        date = Math.floor(date / 16);
        return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
};

 // <-- import from your constants file
  
 
  export const getCompanyDetails = (companyCode, apiPath) => {
    const isTestEnv = apiPath.includes("cmaapiuat.sergas.com");
    switch (companyCode) {
      case "97":
      case "91":
      case "92":
        return {
          outletReference: abudhabiTestOutletReference,  // Test outlet
          apiKey: paymentApiKeyTest,
          tokenApiUrl: paymentGatewayTokenApiUrlTest,
          orderApiUrl: paymentGatewayCreateOrderUrlTest,
        };
      case "01": // Abu Dhabi
        return {
          outletReference: isTestEnv ? abudhabiTestOutletReference : abudhabiOutletReference,
          apiKey: isTestEnv ? paymentApiKeyTest : paymentApiKeyAUH,
          tokenApiUrl: isTestEnv ? paymentGatewayTokenApiUrlTest : paymentGatewayTokenApiUrl,
          orderApiUrl: isTestEnv ? paymentGatewayCreateOrderUrlTest : paymentGatewayCreateOrderUrl,
        };
      case "02": // Dubai
        return {
          outletReference: isTestEnv ? dubaiTestOutletReference : dubaiOutletReference,
          apiKey: isTestEnv ? paymentApiKeyTest : paymentApiKeyDXB,
          tokenApiUrl: isTestEnv ? paymentGatewayTokenApiUrlTest : paymentGatewayTokenApiUrl,
          orderApiUrl: isTestEnv ? paymentGatewayCreateOrderUrlTest : paymentGatewayCreateOrderUrl,
        };
      case "03": // Fujairah
        return {
          outletReference: isTestEnv ? fujairahTestOutletReference : fujairahOutletReference,
          apiKey: paymentApiKeyTest, // Same key always
          tokenApiUrl: isTestEnv ? paymentGatewayTokenApiUrlTest : paymentGatewayTokenApiUrl,
          orderApiUrl: isTestEnv ? paymentGatewayCreateOrderUrlTest : paymentGatewayCreateOrderUrl,
        };
      case "05": // Al Ain
        return {
          outletReference: isTestEnv ? alainTestOutletReference : alainOutletReference,
          apiKey: isTestEnv ? paymentApiKeyTest : paymentApiKeyALN,
          tokenApiUrl: isTestEnv ? paymentGatewayTokenApiUrlTest : paymentGatewayTokenApiUrl,
          orderApiUrl: isTestEnv ? paymentGatewayCreateOrderUrlTest : paymentGatewayCreateOrderUrl,
        };
      default:
        throw new Error(`Unsupported company code: ${companyCode}`);
    }
  };
  

/**
 * Get Access Token
 */
export const getPaymentGatewayAccessToken = async (apiKey, tokenApiUrl) => {
    
    const headers = {
        'Authorization': `Basic ${apiKey}`,
        'Content-Type': 'application/vnd.ni-identity.v1+json',
        'Accept': 'application/vnd.ni-identity.v1+json' // <<--- Important
    };

    try {
        const res = await axios.post(tokenApiUrl, {}, { headers });
        //console.log("Access Token Response:", res);
        return res?.access_token || null;
    } catch (error) {
        console.error("Error while getting Access Token:");
        if (error.response) {
            console.error("Status:", error.response.status);
            console.error("Data:", error.response.data);
        } else if (error.request) {
            console.error("No Response received:", error.request);
        } else {
            console.error("Error:", error.message);
        }
        return null;
    }
};

/**
 * Create Payment Order
 */
export const createPaymentOrder = async (orderApiUrl, outletReference, payload, token) => {
    const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/vnd.ni-payment.v2+json',
        'Accept': 'application/vnd.ni-payment.v2+json'
    };

    const url = `${orderApiUrl}${outletReference}/orders`;

    try {
        const response = await axios.post(url, payload, { headers });
        console.log("Create Order Full Response:", response);

        const orderData = response?.data || response;

        if (orderData && orderData.reference && orderData._links?.payment?.href) {
            console.log("Order created successfully:", orderData.reference);
            return orderData;
        } else {
            console.error("Unexpected create order response structure:", orderData);
            return null;
        }
    } catch (error) {
        console.error("Failed to create payment order");
        if (error.response) {
            console.error("Status:", error.response.status);
            console.error("Error Data:", error.response.data);
        } else if (error.request) {
            console.error("No Response received:", error.request);
        } else {
            console.error("Error:", error.message);
        }
        return null;
    }
};

export const fetchPaymentStatus = async (orderApiUrl, outletReference, orderReference, token) => {
    const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/vnd.ni-payment.v2+json',
        'Accept': 'application/vnd.ni-payment.v2+json'
    };

    const url = `${orderApiUrl}${outletReference}/orders/${orderReference}`;
    console.log("Fetching payment status from URL:", url);

    try {
        const response = await axios.get(url, { headers });
        return response;
    } catch (error) {
        console.error("Failed to fetch payment status");
        if (error.response) {
            console.error("Status:", error.response.status);
            console.error("Error Data:", error.response.data);
        } else if (error.request) {
            console.error("No Response received:", error.request);
        } else {
            console.error("Error:", error.message);
        }
        return null;
    }
};

/**
 * Fetch Order Status
 */
export const fetchOrderStatus = async (orderApiUrl, outletReference, orderReference, token) => {
    const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/vnd.ni-payment.v2+json',
        'Accept': 'application/vnd.ni-payment.v2+json'

    };

    try {
        const response = await axios.get(`${orderApiUrl}${outletReference}/orders/${orderReference}`, { headers });
        return response;
    } catch (error) {
        console.error("Failed to fetch order status", error);
        return null;
    }
};

/**
 * Get Payment Amount
 */
export const getPaymentAmount = (contract, otherAmount = null) => {
    if (otherAmount) {
        return parseFloat(otherAmount) * 100;
    }
    return Math.round(parseFloat(contract.OUTSTANDING_AMT) * 100);
};

/**
 * Build Create Order Request Body
 */
export const buildCreateOrderRequest = (contract, amount, traceId) => ({
    action: "SALE",
    amount: {
        currencyCode: "AED",
        value: amount
    },
    emailAddress: contract.EMAIL || "accounts@sergas.com",
    merchantDefinedData: {
        ContractId: contract.CONTRACT_NO,
        CustomerName: contract.PARTY_NAME
    },
    MerchantOrderReference: `${traceId.replace(/-/g, '').substring(0, 7).toUpperCase()}-MP`
});

/**
 * Get Company Label
 */
export const getCompanyLabel = (companyCode) => {
    switch (companyCode) {
        case "01": return "AUH";
        case "02": return "DXB";
        case "03": return "AJN";
        case "05": return "ALN";
        default: return "GEN";
    }
};

// paymentService.js

export const initiatePaymentFlow = async (paymentType, orderResponse, company) => {
    try {
        if (paymentType === "applepay") {
            return await initiateApplePay(orderResponse, {
                merchantIdentifier: company == "01" ? 'merchant.sergas.sergascustomerauh' :
                                    company == "02" ? 'merchant.sergas.sergascustomerdxb' :
                                    company == "05" ? 'merchant.sergas.sergascustomeralain' :
                                    'merchant.sergas.sergascustomer',
                countryCode: 'AE',
                merchantName: company == "01" ? 'SERGAS Customer AUH' :
                            company == "02" ? 'SERGAS Customer DXB' :
                            company == "05" ? 'SERGAS Customer ALN' :
                            'SERGAS Customer'
            });
        } else if (paymentType === "samsungpay") {
            return await initiateSamsungPay(orderResponse,
                company == "01" ? 'SERGAS Customer AUH' :
                company == "02" ? 'SERGAS Customer DXB' :
                company == "05" ? 'SERGAS Customer ALN' :
                'SERGAS Customer',
                company == "01" ? '7b41f6ef17874fc3bf4ccb' :
                company == "02" ? '44f457d4b8da4a8bbe2dfe' :
                company == "05" ? 'c084781e34924bf7b13927' :
                'aa1080513289421082caa1'
            );
        } else {
            return await initiateCardPayment(orderResponse);
        }
    } catch (error) {
        console.error("🚨 initiatePaymentFlow Error:", error);
        throw error;
    }
};
