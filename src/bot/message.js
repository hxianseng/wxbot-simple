import { log } from "wechaty";
import { Request } from "../utils/request.js";
import { bot } from "./main.js";
import { util } from "./util.js";
import config from "../conf/config.js";
import { wait } from "../utils/utils.js";
let farm_watering = true;
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
                let menu = '--------------------------\n' +
                    '农场浇水\n' +
                    '--------------------------';
                await util.say(contact, menu);
            }
            else if (/农场浇水/.test(content)) {
                if (!farm_watering) {
                    await util.say(contact, '正在为其他用户浇水，请稍后...');
                    return;
                }
                await util.say(contact, `请发送你的JDCookie(包含pt_pin、pt_key)`);
            }
            else if (/pt_pin=.+?;/.test(content) && /pt_key=.+?;/.test(content)) {
                if (!farm_watering) {
                    await util.say(contact, '正在为其他用户浇水，请稍后...');
                    return;
                }
                farm_watering = false;
                let pt_pin = content.match(/pt_pin=.+?;/) || '';
                let pt_key = content.match(/pt_key=.+?;/) || '';
                let cookie = pt_key[0] + pt_pin[0];
                let jdId = pt_pin[0].replace('pt_pin=', '').replace(';', '');
                await util.say(contact, `识别到cookie:\n${cookie}`);
                await util.say(contact, `开始------>浇水任务`);
                let res = await Request.initForFarm('initForFarm', { "babelChannel": "121", "sid": "3c52b5f17ab2a42398939a27887eaf8w", "version": 18, "channel": 1 }, cookie);
                let farmUserPro;
                if (res.status == 200) {
                    if (res.data.code == 0) {
                        farmUserPro = res.data.farmUserPro;
                    }
                    else {
                        await util.say(contact, `任务失败------>${JSON.stringify(res.data)}`);
                        await util.say(contact, `结束------>浇水任务`);
                        farm_watering = true;
                        return;
                    }
                }
                else {
                    await util.say(contact, `东东农场: API查询请求失败`);
                    await util.say(contact, `结束------>浇水任务`);
                    farm_watering = true;
                    return;
                }
                await util.say(contact, `【已兑换水果】${farmUserPro.winTimes}次`);
                if (farmUserPro.treeState === 2 || farmUserPro.treeState === 3) {
                    await util.say(contact, `水果已可领取`);
                    await util.say(contact, `结束------>浇水任务`);
                    farm_watering = true;
                    return;
                }
                else if (farmUserPro.treeState === 0) {
                    await util.say(contact, `你忘了种植新的水果`);
                    await util.say(contact, `结束------>浇水任务`);
                    farm_watering = true;
                    return;
                }
                let num = (farmUserPro.treeTotalEnergy - farmUserPro.treeEnergy) / 10;
                await util.say(contact, `预计需要浇${num}次`);
                await util.say(contact, `开始浇水`);
                for (let i = 0; i <= num; i++) {
                    console.log(`第${i + 1}次浇水`);
                    let waterResult;
                    res = await Request.initForFarm('waterGoodForFarm', {}, cookie);
                    try {
                        if (res.status == 200) {
                            if (res.data.code == 0) {
                                waterResult = res.data;
                            }
                            else {
                                await util.say(contact, `任务失败------>${JSON.stringify(res.data)}`);
                                await util.say(contact, `结束------>浇水任务`);
                                break;
                            }
                        }
                        else {
                            await util.say(contact, `东东农场: API查询请求失败`);
                            continue;
                        }
                        if (waterResult.finished) {
                            await util.say(contact, `水果已成熟`);
                            await util.say(contact, `结束------>浇水任务`);
                            break;
                        }
                        if (waterResult.totalEnergy < 10) {
                            await util.say(contact, `水滴不够，结束浇水`);
                            await util.say(contact, `结束------>浇水任务`);
                            break;
                        }
                    }
                    catch (err) {
                        console.log(err);
                    }
                    console.log(`等待10s浇下一次`);
                    await wait(10 * 1000);
                }
                farm_watering = true;
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
