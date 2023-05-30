"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
exports.Request = void 0;
var axios_1 = __importDefault(require("axios"));
var config_1 = __importDefault(require("../config"));
var headers;
axios_1["default"].interceptors.request.use(function (config) {
    return config;
}, function (err) {
    console.log(err);
    return Promise.resolve(err);
});
axios_1["default"].interceptors.response.use(function (data) {
    return data;
}, function (err) {
    console.log(err);
    return null;
});
var Request = (function () {
    function Request() {
    }
    Request.sendTextGPT = function (data) {
        return (0, axios_1["default"])({
            url: "".concat(config_1["default"].url_gpt),
            method: 'POST',
            headers: headers,
            data: data
        });
    };
    return Request;
}());
exports.Request = Request;
