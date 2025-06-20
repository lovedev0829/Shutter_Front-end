import axiosUtil from './axiosUtil';
import Qs from 'qs';
import { defaultConfig } from '../config';


async function callAPI(path, params, method, data = null, options = {}, headersObj = {}) {
    const API_ROOT = defaultConfig.baseAPIUrl;
  
    const url = API_ROOT + path;
    const headers = {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${await localStorage.getItem('accessToken')}`,
        ...headersObj,
    };

    return axiosUtil({
        method,
        url,
        params,
        paramsSerializer: { 
            serialize:function(params) {
             return Qs.stringify(params, { arrayFormat: 'brackets' })
           }
          },
        data,
        headers,
        ...options,
    });
}

function callAPIWithoutAuth(path, params, method, data = null, options = {}, headersObj = {}){
    const API_ROOT = defaultConfig.baseAPIUrl;
    const url = API_ROOT + path;
    const headers = {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        ...headersObj,
    };
    return axiosUtil({
        method,
        url,
        params,
        paramsSerializer: { 
            serialize:function(params) {
             return Qs.stringify(params, { arrayFormat: 'brackets' })
           }
          },
        data,
        headers,
        ...options,
    });
}

async function API(path, params, method, data = null, options = {}, headersObj = {}){
    const API_ROOT = defaultConfig.baseAPIUrl;
    const url = API_ROOT + path;
    const headers = {
        'Content-Type': 'multipart/form-data',
        Accept: 'application/json',
        Authorization: `Bearer ${await localStorage.getItem('accessToken')}`,
        ...headersObj,
    };

    return axiosUtil({
        method,
        url,
        params,
        paramsSerializer: { 
            serialize:function(params) {
             return Qs.stringify(params, { arrayFormat: 'brackets' })
           }
          },
        data,
        headers,
        ...options,
    });
}


export { callAPI, callAPIWithoutAuth,API};