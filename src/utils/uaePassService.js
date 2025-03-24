// uaePassService.js

import { UAEPassConfig } from '../utils/permissions';

import { Base64 } from 'js-base64';
import { API_PATH } from '../services/api/data/data/api-utils';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UAEPass } from 'react-native-uaepass';

const getAccessToken = async (accessCode) => {
  const client_id = 'sergas_mob_prod'; //Staging : sergas_mob_stage Production : sergas_mob_prod
  const client_secret = 'PmNqCr45fHTk65TE';// Staging Secret : PxsFBZcurCqzmXWT  Staging Secret : PmNqCr45fHTk65TE
  const redirect_uri = 'sergas://customer.app';
  const tokenEndpoint = 'https://id.uaepass.ae/idshub/token';

  const authString = `${client_id}:${client_secret}`;
  const headers = new Headers();
  headers.append('Content-Type', 'application/x-www-form-urlencoded');
  headers.append('Authorization', 'Basic ' + Base64.encode(authString));

  const body = new URLSearchParams({
    grant_type: 'authorization_code',
    code: accessCode,
    redirect_uri: redirect_uri,
    client_id: client_id,
    client_secret: client_secret
  });

  try {
    const response = await fetch(tokenEndpoint, {
      method: 'POST',
      headers: headers,
      body: body.toString()
    });

    if (!response.ok) {
      console.error('Response not ok:', response);
      throw new Error(`Failed to fetch access token, status: ${response.status}`);
    }

    const data = await response.json();
    //console.log(data);
    return getUserDetails(data.access_token);
  } catch (error) {
    console.error('Error fetching access token:', error);
    throw error;
  }
};

const getUserDetails = async (accessToken) => {
  const userInfoEndpoint = 'https://id.uaepass.ae/idshub/userinfo';

  const headers = new Headers();
  headers.append('Authorization', 'Bearer ' + accessToken);
  headers.append('Content-Type', 'application/json');

  try {
    const response = await fetch(userInfoEndpoint, {
      method: 'GET',
      headers: headers
    });

    if (!response.ok) {
      console.error('Response not ok:', response);
      throw new Error(`Failed to fetch user details, status: ${response.status}`);
    }

    const data = await response.json();
    console.log('User details:', data);
    postinsertupassuserinfo(data);
    return data;
  } catch (error) {
    console.error('Error fetching user details:', error);
    throw error;
  }
};

const checkMobileInDatabase = async (mobileNumber) => {
  const databaseResponse = await fetch('/api/check-mobile', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ mobileNumber })
  });
  const data = await databaseResponse.json();
  return data.exists;
};
const CheckUserbyuuid = async (uuid) => {
  const databaseResponse = await fetch(API_PATH + `/api/getuuidUserDetails?uuid=${uuid}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  });
  const data = await databaseResponse.json();
  return data;
};
const login = async () => {
  try {
    const configData = await UAEPassConfig();
    const response = await UAEPass.login(configData);
    if (response && response.accessCode) {
      const userDetails = await getAccessToken(response.accessCode);
      const mobileNumber = userDetails.mobile;
      const isMobileInDatabase = await checkMobileInDatabase(mobileNumber);

      if (isMobileInDatabase) {
        console.log('Mobile number exists in database, proceeding with direct login.');
      } else {
        console.log('Mobile number does not exist in database, asking for OTP.');
      }
    }
  } catch (e) {
    console.error('Error during login:', e);

  }
};
const postinsertupassuserinfo = async (uaepassDetails) => {

  const token = await AsyncStorage.getItem('sergas_customer_access_token')
  //console.log(token)
  try {
    const response = await fetch(API_PATH + '/api/Postuaepassuser', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(uaepassDetails)
    });

    if (!response.ok) {
      console.error('HTTP error', response.status, response.statusText);
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    return data.exists;
  } catch (error) {
    console.error('Fetch error:', error);
    throw error;
  }
};
const postLoginDeviceLog = async (deviceDetails) => {
  const token = await AsyncStorage.getItem('sergas_customer_access_token')
  const loginTime = Date.now();
  await AsyncStorage.setItem('login_time', loginTime.toString());
  //console.log(deviceDetails);
  //console.log('Browser ',deviceDetails.browser);
  await AsyncStorage.setItem('BrowseType', deviceDetails.browser)
  try {
    const response = await fetch(API_PATH + '/api/PostInsertLoginDevice', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(deviceDetails)
    });

    if (!response.ok) {
      console.error('HTTP error', response.status, response.statusText);
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    return data.exists;
  } catch (error) {
    console.error('Fetch error:', error);
    throw error;
  }
};

const postLogoutLog = async (deviceDetails) => {
  const token = await AsyncStorage.getItem('sergas_customer_access_token')
  try {
    const response = await fetch(API_PATH + '/api/PostUpdateLogoutDevice', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(deviceDetails)
    });

    if (!response.ok) {
      console.error('HTTP error', response.status, response.statusText);
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    return data.exists;
  } catch (error) {
    console.error('Fetch error:', error);
    throw error;
  }
};

const CheckLoginByMobile = async (mobile) => {
  const databaseResponse = await fetch(API_PATH + `/api/GetLoginLog?mobile=${mobile}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  });
  const data = await databaseResponse.json();
  return data;
};
const CheckUAEPASS = async () => {
  const databaseResponse = await fetch(API_PATH + `/api/PayMode`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  });
  
  const data = await databaseResponse.json();
  return data;
};
const register = async () => {
  try {
    const configData = await UAEPassConfig();
    const response = await UAEPass.register(configData);
    if (response && response.accessCode) {
      await getAccessToken(response.accessCode);
    }
  } catch (e) {
    console.error('Error during registration:', e);
    // Handle UI updates for error here if needed
  }
};

const logout = async (deviceDetails) => {
  try {
    await postLogoutLog(deviceDetails);
    const uuid = await AsyncStorage.getItem('sergas_customer_uuid');
      
    if (uuid && uuid.trim() !== '') {
      try {
        //console.log('A',timeDifference)
        await UAEPass.logout();
      }
      catch (e) {
        throw e;
      }
      await AsyncStorage.removeItem('sergas_customer_uuid');
    }

  } catch (e) {
    console.error('Error during logout:', e);
  }
};


export { login, register, logout, getAccessToken, getUserDetails, postLoginDeviceLog,CheckUserbyuuid, CheckLoginByMobile,CheckUAEPASS};