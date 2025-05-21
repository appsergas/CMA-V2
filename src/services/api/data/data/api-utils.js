import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios'
import { HTTP } from './constants'
// import i18n from '../../../translate/i18n'

// export const API_PATH = 'https://192.168.5.230:443'
// export const API_PATH = 'http://192.168.5.182:80'
// export const API_PATH = 'http://devtestapi.sergas.com:81'
 //export const API_PATH = 'https://devtestapi.sergas.com'
export const API_PATH = 'https://serpapitest.sergas.com' 
// export const API_PATH = 'https://cmaapiuat.sergas.com'

const language = 'en'

// const https = require('https');

export const HttpMethod = {
  DELETE: 'delete',
  GET: 'get',
  POST: 'post',
  PUT: 'put'
}

export default class ApiUtils {
  static executeSession (options) {
    axios.interceptors.response.use(
      response => {
        if (response.data) {
          return response.data
        }
        return response
      },
      error => {
        // if (options.url.includes(healthApi)) {
        //     return { error: { isError: true, message: error }}
        // }
        return error
      }
    )
    return axios(options).then(res => {
      // console.log("url >>> ",options.url, "\n req data: ", options.data, "\n response: ",res);
      return res
    })
  }

  static async getTraceId () {
    const loginId = await AsyncStorage.getItem('login_id')
    var appendingPattern = (await AsyncStorage.getItem('TraceIdPattern') == null) ? "-xxxx-4xxx-yxxx-xxxxxxxxxxxx"
      : await AsyncStorage.getItem('TraceIdPattern')
    if (loginId == null) {
      var pattern = 'ANONYMOUS'+appendingPattern
    } else {
      var pattern = loginId+appendingPattern
    }
    var date = new Date().getTime();
    
    var uuid = pattern.replace(/[xy]/g, function(c) {
        var r = (date + Math.random()*16)%16 | 0;
        date = Math.floor(date/16);
        return (c=='x' ? r :(r&0x3|0x8)).toString(16);
    });
    return uuid.toString()  
  }

  static getApiPath (moduleName, urlExt, params) {
    let apiUrl = `${API_PATH}/${moduleName}/${urlExt}`
    apiUrl = params ? `${apiUrl}/${params}` : apiUrl
    return apiUrl
  }

  static async get (moduleName, url, authenticate, data, params) {
    let options
    let apiUrl = ApiUtils.getApiPath(moduleName, url, params)
    if (authenticate) {
      const access_token = await AsyncStorage.getItem('sergas_customer_access_token')
      options = {
        headers: { Authorization: `Bearer ${access_token}`, language: language, transactionId: await this.getTraceId(), Accept: 'application/json', rejectUnauthorized: false },
        method: HttpMethod.GET,
        params: data,
        url: apiUrl,
        timeout: HTTP.request_timeout
      }
    } else {
      options = {
        // headers: { language: language, transactionId: await this.getTraceId() },
        headers: {Accept: 'application/json', rejectUnauthorized: false },

        method: HttpMethod.GET,
        params: data,
        url: apiUrl,
        timeout: HTTP.request_timeout,
      }
    }
    return ApiUtils.executeSession(options)
  }

  static async post (moduleName, url, authenticate, data, params) {
    let options
    const apiUrl = ApiUtils.getApiPath(moduleName, url, params)
    if (authenticate) {
      const access_token = await AsyncStorage.getItem('sergas_customer_access_token')
      options = {
        headers: { Authorization: `Bearer ${access_token}`, language: language, transactionId: await this.getTraceId() },
        data: data,
        method: HttpMethod.POST,
        url: apiUrl,
        timeout: HTTP.request_timeout
      }
    } else {
      options = {
        headers: { language: language, transactionId: await this.getTraceId() },
        data: data,
        method: HttpMethod.POST,
        url: apiUrl,
        timeout: HTTP.request_timeout
      }
    }

    return ApiUtils.executeSession(options)
  }

  static async mediapost (moduleName, url, authenticate, data, params) {
    let options
    const apiUrl = ApiUtils.getApiPath(moduleName, url, params)
    if (authenticate) {
      const access_token = await AsyncStorage.getItem('sergas_customer_access_token')
      options = {
        headers: {
          Authorization: `Bearer ${access_token}`,
          'Content-Type': 'multipart/form-data',
          Accept: '*/*', 
          language: language,
          transactionId: await this.getTraceId()
        },
        data: data,
        method: HttpMethod.POST,
        url: apiUrl,
        timeout: HTTP.request_timeout
      }
    } else {
      options = {
        headers: {
          'Content-Type': 'multipart/form-data',
          Accept: '*/*', 
          language: language,
          transactionId: await this.getTraceId()
        },
        data: data,
        method: HttpMethod.POST,
        url: apiUrl,
        timeout: HTTP.request_timeout
      }
    }

    return ApiUtils.executeSession(options)
  }

  static async put (moduleName, url, authenticate, data, params) {
    let options
    const apiUrl = ApiUtils.getApiPath(moduleName, url, params)
    if (authenticate) {
      const access_token = await AsyncStorage.getItem('sergas_customer_access_token')
      options = {
        headers: { Authorization: `Bearer ${access_token}`, language: language, transactionId: await this.getTraceId() },
        data: data,
        method: HttpMethod.PUT,
        url: apiUrl,
        timeout: HTTP.request_timeout
      }
    } else {
      options = {
        headers: { language: language, transactionId: await this.getTraceId() },
        data: data,
        method: HttpMethod.PUT,
        url: apiUrl,
        timeout: HTTP.request_timeout
      }
    }

    return ApiUtils.executeSession(options)
  }

  static async multipartPut (moduleName, url, authenticate, data, params) {
    let options
    const apiUrl = ApiUtils.getApiPath(moduleName, url, params)
    if (authenticate) {
      const access_token = await AsyncStorage.getItem('sergas_customer_access_token')
      options = {
        headers: {
          Authorization: `Bearer ${access_token}`,
          'Content-Type': 'multipart/form-data',
          Accept: '*/*', 
          language: language,
          transactionId: await this.getTraceId()
        },
        data: data,
        method: HttpMethod.PUT,
        url: apiUrl,
        timeout: HTTP.request_timeout
      }
    } else {
      options = {
        headers: {
          'Content-Type': 'multipart/form-data',
          Accept: '*/*', 
          language: language,
          transactionId: await this.getTraceId()
        },
        data: data,
        method: HttpMethod.PUT,
        url: apiUrl,
        timeout: HTTP.request_timeout
      }
    }

    return ApiUtils.executeSession(options) 
  }

  static async delete (moduleName, url, authenticate, data, params) {
    let options
    const apiUrl = ApiUtils.getApiPath(moduleName, url, params)
    if (authenticate) {
      const access_token = await AsyncStorage.getItem('sergas_customer_access_token')
      options = {
        headers: { Authorization: `Bearer ${access_token}`, language: language, transactionId: await this.getTraceId()},
        params: data,
        method: HttpMethod.DELETE,
        url: apiUrl,
        timeout: HTTP.request_timeout
      }
    } else {
      options = {
        headers: { language: language, transactionId: await this.getTraceId()},
        params: data,
        method: HttpMethod.DELETE,
        url: apiUrl,
        timeout: HTTP.request_timeout
      }
    }

    return ApiUtils.executeSession(options)
  }
}
