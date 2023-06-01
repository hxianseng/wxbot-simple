import { log } from "wechaty";
import { Request } from "../utils/request.js";
import { bot } from "./main.js";
import { util } from "./util.js";
import config from "../config.js";
export class Message {
    static async msg(data) {
        const room = data.room();
        const msgSelf = data.self();
        if (msgSelf)
            return;
        if (new Date().getTime() - data.date().getTime() > 216 * 1000)
            return;
        const type = data.type();
        const contact = data.talker();
        let content = data.text().trim();
        const name = contact.name();
        const remarks = await contact.alias();
        const isOfficial = contact.type() === bot.Contact.Type.Official;
        const id = contact.id;
        log.info(`好友类型:${isOfficial ? '公众号' : '普通'} 昵称:${name} 备注:${remarks} 内容:${content} id:${id}`);
        if (room) {
        }
        else if (!isOfficial) {
            if (/菜单/.test(content)) {
            }
            else {
                let index = config.parm_arr.findIndex(x => x.id == id);
                let conversation_id, parent_message_id;
                if (index == -1) {
                    conversation_id = '';
                    parent_message_id = '';
                }
                else {
                    conversation_id = config.parm_arr[index].conversation_id;
                    parent_message_id = config.parm_arr[index].parent_message_id;
                }
                const d = {
                    text: content,
                    conversation_id: conversation_id,
                    parent_message_id: parent_message_id
                };
                let res = await Request.send_message(d);
                if (res) {
                    await util.say(contact, res.text);
                    const d = {
                        id: id,
                        conversation_id: res.conversationId,
                        parent_message_id: res.id
                    };
                    if (index == -1) {
                        config.parm_arr.push(d);
                    }
                    else {
                        config.parm_arr[index] = d;
                    }
                }
            }
        }
    }
}
