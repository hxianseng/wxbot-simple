import { WechatyBuilder, log } from "wechaty";
import qrcode_terminal from "qrcode-terminal";
import { Message } from "./message.js";
import config from "../config.js";
const bot = WechatyBuilder.build({
    name: "wxbot-simple",
    puppet: "wechaty-puppet-wechat",
    puppetOptions: {
        uos: true
    }
});
export class main {
    static qrcodeUrl = '';
    static onScan(qrcode, status) {
        log.info('扫描下方二维码登录微信');
        qrcode_terminal.generate(qrcode, { small: true });
        main.qrcodeUrl = ['https://api.qrserver.com/v1/create-qr-code/?data=',
            encodeURIComponent(qrcode),
        ].join('');
    }
    static async onLogin(user) {
        log.info(`用户 ${user} 已登录`);
        const date = new Date();
        log.info(`当前时间:${date}`);
        config.islogin = false;
    }
}
bot
    .on("scan", main.onScan)
    .on("login", main.onLogin)
    .on('logout', (user) => {
    config.islogin = true;
    log.info(`用户 ${user} 已退出`);
})
    .on("message", Message.msg)
    .on('friendship', async (friendship) => {
    try {
        if (friendship.type() === bot.Friendship.Type.Receive) {
            await friendship.accept();
        }
    }
    catch (error) {
    }
});
bot
    .start()
    .then(() => log.info(`微信登录二维码生成中...`))
    .catch((e) => console.error(e));
export { bot };
