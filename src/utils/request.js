import axios from 'axios';
import config from '../conf/config.js';
import request from 'request';
import { UARAM } from './USER_AGENTS.js';
var headers;
axios.interceptors.request.use((config) => {
    return config;
}, (err) => {
    console.log(err);
    return Promise.resolve(err);
});
axios.interceptors.response.use((data) => {
    return data;
}, (err) => {
    console.log(err);
    return null;
});
export class Request {
    static sendTextGPT(data) {
        return axios({
            url: `${config.url_gpt}`,
            method: 'POST',
            headers: headers,
            data: data
        });
    }
    static async send_message(data) {
        const { ChatGPTUnofficialProxyAPI } = await import('chatgpt');
        const chatgpt = new ChatGPTUnofficialProxyAPI({
            accessToken: config.access_token,
            apiReverseProxyUrl: config.chatgpt_reverse_proxy,
            model: config.chatgpt_model,
        });
        const response = await chatgpt.sendMessage(data.text, {
            conversationId: data.conversation_id,
            parentMessageId: data.parent_message_id,
            timeoutMs: Number(0),
        });
        return response;
    }
    static async initForFarm(function_id, body = {}, cookie) {
        let user_agent = UARAM();
        return axios({
            url: `https://api.m.jd.com/client.action?functionId=${function_id}&body=${encodeURIComponent(JSON.stringify(body))}&appid=wh5`,
            method: 'GET',
            headers: {
                "Host": "api.m.jd.com",
                "Accept": "*/*",
                "Origin": "https://carry.m.jd.com",
                "Accept-Encoding": "gzip, deflate, br",
                "User-Agent": user_agent,
                "Accept-Language": "zh-CN,zh-Hans;q=0.9",
                "Referer": "https://carry.m.jd.com/",
                "Cookie": cookie
            }
        }).catch(error => {
            console.log(error);
        });
    }
    static waterGoodForFarm() {
    }
    static req(function_id, body = {}, cookie, timeout = 1000) {
        return new Promise(resolve => {
            setTimeout(() => {
                request.get(Request.taskUrl(function_id, body, cookie), (err, resp, data) => {
                    try {
                        if (err) {
                            console.log('\n东东农场: API查询请求失败 ‼️‼️');
                            console.log(JSON.stringify(err));
                            console.log(`function_id:${function_id}`);
                        }
                        else {
                            if (Request.safeGet(data)) {
                                data = JSON.parse(data);
                            }
                        }
                    }
                    catch (e) {
                    }
                    finally {
                        resolve(data);
                    }
                });
            }, timeout);
        });
    }
    static taskUrl(function_id, body = {}, cookie) {
        return {
            url: `https://api.m.jd.com/client.action?functionId=${function_id}&body=${encodeURIComponent(JSON.stringify(body))}&appid=wh5`,
            headers: {
                "Host": "api.m.jd.com",
                "Accept": "*/*",
                "Origin": "https://carry.m.jd.com",
                "Accept-Encoding": "gzip, deflate, br",
                "User-Agent": UARAM(),
                "Accept-Language": "zh-CN,zh-Hans;q=0.9",
                "Referer": "https://carry.m.jd.com/",
                "Cookie": cookie
            },
            timeout: 10000
        };
    }
    static safeGet(data) {
        try {
            if (typeof JSON.parse(data) == "object") {
                return true;
            }
        }
        catch (e) {
            console.log(e);
            console.log(`京东服务器访问数据为空，请检查自身设备网络情况`);
            return false;
        }
    }
}
