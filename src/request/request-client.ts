import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { CookieJar } from 'tough-cookie';
import { wrapper } from 'axios-cookiejar-support';

export class RequestClient {

    private client: AxiosInstance;

    constructor(
        private host: string,
        private cookieJar: CookieJar = new CookieJar()
    ) {
        this.client = wrapper(axios.create({ jar: cookieJar }));
    }

    async request(
        method: string,
        path: string,
        data: Record<string, unknown>,
        headers: Record<string, string>
    ): Promise<AxiosResponse> {
        const body = await this.build(method, path, data, headers);
        return await this.client.request(body);
    }

    async requestText(
        method: string,
        path: string,
        data: Record<string, unknown>,
        headers: Record<string, string>
    ): Promise<string> {
        const response = await this.request(method, path, data, headers);
        return response.data;
    }

    private async build(
        method: string,
        path: string,
        data: Record<string, unknown>,
        headers: Record<string, string>
    ): Promise<AxiosRequestConfig> {
        const finalHeaders = {
            Host: this.host,
            ...headers
        };

        const baseData: AxiosRequestConfig = {
            method,
            url: `http://${this.host}${path}`,
            headers: finalHeaders,
            transformResponse: (data) => data,
            responseType: 'text'
        }

        if (method === 'GET') {
            return {
                ...baseData,
                params: data
            }
        } else {
            return {
                ...baseData,
                data
            }
        }
    }

}