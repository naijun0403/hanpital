import { HankookApiService, HankookClient } from 'hanpital';

(async () => {
    const api = await HankookApiService.create();

    const res = await api.login({
        id: 'id',
        password: 'password',
        deviceName: 'deviceName'
    }, true);

    if (!res.success) throw new Error(`[+] 로그인에 실패하였습니다. ${res.status}`);

    console.log('[+] 로그인에 성공하였습니다.', res.result);

    const client = await HankookClient.create(res.result);

    const ipList = await client.getIpList();

    if (!ipList.success) throw new Error(`[+] IP 목록을 가져오는데 실패하였습니다. ${ipList.status}`);

    console.log('[+] IP 목록을 가져왔습니다.', ipList.result);

    const logoutRes = await api.logout(res.result);

    if (!logoutRes.success) throw new Error(`[+] 로그아웃에 실패하였습니다. ${logoutRes.status}`);

    console.log('[+] 로그아웃에 성공하였습니다.');
})()