import { ClientConfig, DefaultConfiguration } from '../config';
import { ProcessResponse, RequestClient } from '../request';
import { generateRndString } from '../util';

export class HankookApiService {

    private client = new RequestClient(this.config.host);

    constructor(
        private config: ClientConfig
    ) {
    }

    static async create(config: Partial<ClientConfig> = {}) {
        return new HankookApiService(
            Object.assign({ ...DefaultConfiguration }, config)
        );
    }

    async getAgentVersion(): ProcessResponse<string> {
        const text = await this.client.requestText(
            'GET',
            '/api/proxy/getAgentVer',
            {},
            {}
        );

        return {
            success: true,
            status: 200,
            result: text
        }
    }

    async login(form: LoginData, force = false): ProcessResponse<LoginResponse> {
        const text = await this.client.requestText(
            'GET',
            '/api/proxy/login',
            {
                id: form.id,
                pwd: form.password,
                rnd: generateRndString(),
                PC_name: form.deviceName,
                ver: this.config.version,
                force
            },
            {}
        );

        const resArr = text.split('\n');

        if (resArr[0] === 'FALSE' || resArr[0] === 'DuplicateAccess') {
            return {
                success: false,
                status: 401
            }
        }

        return {
            success: true,
            status: 200,
            result: {
                id: form.id,
                remoteIp: resArr[1],
                token: resArr[2],
                startDate: new Date(resArr[3]),
                endDate: new Date(resArr[4]),
                point: parseInt(resArr[5])
            }
        }
    }

    async logout(loginRes: LoginResponse): ProcessResponse {
        const text = await this.client.requestText(
            'GET',
            '/api/proxy/logout',
            {
                id: loginRes.id,
                auth_flag: loginRes.token,
                remote_ip: loginRes.remoteIp,
                rnd: generateRndString()
            },
            {}
        );

        if (text.includes('FALSE')) {
            return {
                success: false,
                status: 401
            }
        }

        return {
            success: true,
            status: 200,
        }
    }

}

export interface LoginData {
    id: string;
    password: string;
    deviceName: string;
}

export interface LoginResponse {
    id: string;
    remoteIp: string;
    token: string;
    startDate: Date;
    endDate: Date;
    point: number;
}