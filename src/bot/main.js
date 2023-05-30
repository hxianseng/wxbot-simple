"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
exports.bot = exports.main = void 0;
var wechaty_1 = require("wechaty");
var message_1 = require("./message");
var config_1 = __importDefault(require("../config"));
var bot = wechaty_1.WechatyBuilder.build({
    name: "wxbot-simple",
    puppet: "wechaty-puppet-wechat",
    puppetOptions: {
        uos: true
    }
});
exports.bot = bot;
var main = (function () {
    function main() {
    }
    main.onScan = function (qrcode, status) {
        wechaty_1.log.info('扫描下方二维码登录微信');
        require('qrcode-terminal').generate(qrcode, { small: true });
        main.qrcodeUrl = ['https://api.qrserver.com/v1/create-qr-code/?data=',
            encodeURIComponent(qrcode),
        ].join('');
    };
    main.onLogin = function (user) {
        return __awaiter(this, void 0, void 0, function () {
            var date;
            return __generator(this, function (_a) {
                wechaty_1.log.info("\u7528\u6237 ".concat(user, " \u5DF2\u767B\u5F55"));
                date = new Date();
                wechaty_1.log.info("\u5F53\u524D\u65F6\u95F4:".concat(date));
                config_1["default"].islogin = false;
                return [2];
            });
        });
    };
    main.qrcodeUrl = '';
    return main;
}());
exports.main = main;
bot
    .on("scan", main.onScan)
    .on("login", main.onLogin)
    .on('logout', function (user) {
    config_1["default"].islogin = true;
    wechaty_1.log.info("\u7528\u6237 ".concat(user, " \u5DF2\u9000\u51FA"));
})
    .on("message", message_1.Message.msg)
    .on('friendship', function (friendship) { return __awaiter(void 0, void 0, void 0, function () {
    var error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                if (!(friendship.type() === bot.Friendship.Type.Receive)) return [3, 2];
                return [4, friendship.accept()];
            case 1:
                _a.sent();
                _a.label = 2;
            case 2: return [3, 4];
            case 3:
                error_1 = _a.sent();
                return [3, 4];
            case 4: return [2];
        }
    });
}); });
bot
    .start()
    .then(function () { return wechaty_1.log.info("\u5FAE\u4FE1\u767B\u5F55\u4E8C\u7EF4\u7801\u751F\u6210\u4E2D..."); })["catch"](function (e) { return console.error(e); });
