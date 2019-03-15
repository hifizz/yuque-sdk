import Axios, { AxiosInstance, AxiosRequestConfig,AxiosResponse,AxiosError } from "axios";
import {mergeDeepRight} from "ramda";

export class Client {
  public client: AxiosInstance;
  private token: string;

  constructor(token: string, apiPrefix: string) {
    this.client = Axios.create({
      baseURL: apiPrefix,
    });

    this.token = token;

    /***
     * 添加默认的响应拦截器，把成功返回且code===0的结果直接返回data
     */
    this.client.interceptors.response.use(
      (response: AxiosResponse): any => {
        if (response.data && response.data.code === 0) {
          return response.data.data;
        } else if (response.data) {
          return response.data;
        } else {
          return response;
        }
      },
      (error: AxiosError): Promise<AxiosError> => {
        // return Promise.reject(error);
        return Promise.reject(error);
      }
    );
  }

  public get(url: string, options?: AxiosRequestConfig): any {
    return this.client.get(url, mergeDeepRight(
      { headers: {
        'X-Auth-Token': this.token,
      } },
      options || {}
    ));
  }

  public post(url: string, data: any, options?: AxiosRequestConfig): any {
    return this.client.post(url, data, mergeDeepRight(
      { headers: {
        'X-Auth-Token': this.token,
        "Content-Type": "application/x-www-form-urlencoded"
      } },
      options || {}
    ))
  }

  public put(url: string, data?: any, options?: AxiosRequestConfig): any {
    return this.client.put(url, data, mergeDeepRight(
      { headers: {
        'X-Auth-Token': this.token,
        "Content-Type": "application/x-www-form-urlencoded"
      } },
      options || {}
    ))
  }

  public delete(url: string, data?: any, options?: AxiosRequestConfig): any {
    return this.client.delete(url, mergeDeepRight(
      { headers: {
        'X-Auth-Token': this.token,
      } },
      options || {}
    ))
  }
}
