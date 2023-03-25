import { ProcessResponse, RequestClient } from '../request';
import { ClientConfig, DefaultConfiguration } from '../config';
import { LoginResponse } from '../api';
import { generateRndString } from '../util';

export class HankookClient {

    private client: RequestClient = new RequestClient(this.config.host);

    private constructor(
        private loginRes: LoginResponse,
        private config: ClientConfig
    ) {

    }

    static async create(
        loginRes: LoginResponse,
        config: Partial<ClientConfig> = {}
    ) {
        return new HankookClient(
            loginRes,
            Object.assign({ ...DefaultConfiguration }, config)
        );
    }

    async getIpList(): ProcessResponse<IpListResponse> {
        const text = await this.client.requestText(
            'GET',
            '/api/proxy/iplist',
            {
                id: this.loginRes.id,
                auth_flag: this.loginRes.token,
                remote_ip: this.loginRes.remoteIp,
                rnd: generateRndString()
            },
            {}
        );

        const resArr = text.split('\n');

        if (resArr[0] === 'FALSE') {
            return {
                success: false,
                status: 401
            }
        }

        return {
            success: true,
            status: 200,
            result: {
                count: parseInt(resArr[1].split(' : ')[1]),
                list: resArr.slice(2)
            }
        }
    }

}

export interface IpListResponse {
    count: number;
    list: string[];
}