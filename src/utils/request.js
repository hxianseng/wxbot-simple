import axios from 'axios';
import config from '../config.js';
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
}
