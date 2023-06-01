import express from "express";
import config from "../config.js";
import { bot, main } from "../bot/main.js";
const router = express.Router();
router.use(function (req, res, next) {
    const url = req.url;
    if (/qrcodeImage$/.test(url)) {
        next();
    }
    else {
        if (req.body.token != config.token || config.token == '') {
            res.json({
                status: 500,
                message: 'token validation failed'
            });
        }
        else {
            next();
        }
    }
});
router.get('/qrcodeImage', async (req, res, next) => {
    try {
        if (config.islogin) {
            res.send('<img src="' + main.qrcodeUrl + '" />');
        }
        else {
            res.json({
                status: 500,
                message: `重复登陆！`
            });
            return;
        }
    }
    catch (error) {
        next(error);
    }
});
router.post('/send', async (req, res, next) => {
    try {
        const data = req.body;
        data['url'] = '/send';
        const contact = await bot.Contact.find({ alias: new RegExp(data.name) });
        if (contact == null) {
            console.log(`没有匹配到:${req.body.name}`);
            res.json({
                status: 500,
                message: `没有匹配到:${req.body.name}`
            });
            return;
        }
        contact?.say('\n-----------------------\n' + data.content + '\n-----------------------\n');
        res.json({
            status: 200,
            message: `SUCCESS`
        });
    }
    catch (error) {
        next(error);
    }
});
router.post('/send_sms', async (req, res, next) => {
    try {
        const data = req.body;
        data['url'] = '/send_sms';
        console.log(data);
        const contact = await bot.Contact.find({ name: new RegExp(data.name) });
        if (contact == null) {
            console.log(`没有匹配到:${req.body.name}`);
            res.json({
                status: 500,
                message: `没有匹配到:${req.body.name}`
            });
            return;
        }
        await contact?.say(data.content + '\n-----------------------\n本通知 By:https://github.com/hxianseng/wxbot.git');
        res.json({
            status: 200,
            message: `SUCCESS`
        });
    }
    catch (error) {
        next(error);
    }
});
export { router };
