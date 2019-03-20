"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _axios = _interopRequireDefault(require("axios"));

var _iconvLite = _interopRequireDefault(require("iconv-lite"));

// 初始化
var axios = _axios.default.create({
  responseType: 'arraybuffer'
});

axios.interceptors.response.use(function (res) {
  res.data = _iconvLite.default.decode(res.data, 'GBK');
  return res;
});
var _default = axios;
exports.default = _default;