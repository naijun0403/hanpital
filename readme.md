# hanpital
한국아이피 api wrapper

## example
### login
```typescript
const api = await HankookApiService.create();

const res = await api.login({
    id: 'id',
    password: 'password',
    deviceName: 'deviceName'
}, true);

if (!res.success) throw new Error(`[+] 로그인에 실패하였습니다. ${res.status}`);

console.log('[+] 로그인에 성공하였습니다.', res.result);
```

### get ip list
```typescript
const client = await HankookClient.create(res.result);

const ipList = await client.getIpList();

if (!ipList.success) throw new Error(`[+] IP 목록을 가져오는데 실패하였습니다. ${ipList.status}`);

console.log('[+] IP 목록을 가져왔습니다.', ipList.result);
```