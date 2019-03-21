"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _http = _interopRequireDefault(require("./http"));

var _sequelize = _interopRequireDefault(require("sequelize"));

var _moment = _interopRequireDefault(require("moment"));

var _jsdom = _interopRequireDefault(require("jsdom"));

var _iconvLite = _interopRequireDefault(require("iconv-lite"));

var _lodash = _interopRequireDefault(require("lodash"));

var _Info = _interopRequireDefault(require("./Info"));

var JSDOM = _jsdom.default.JSDOM;
var DATEBASE = _Info.default.DATEBASE,
    USER = _Info.default.USER,
    PASS = _Info.default.PASS,
    HOST = _Info.default.HOST,
    PORT = _Info.default.PORT;

function getSeq() {
  return _getSeq.apply(this, arguments);
}

function _getSeq() {
  _getSeq = (0, _asyncToGenerator2.default)(
  /*#__PURE__*/
  _regenerator.default.mark(function _callee3() {
    var sequelize, DollarExchangeRate, AliJudicialSell, t1, t2;
    return _regenerator.default.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            sequelize = new _sequelize.default(DATEBASE, USER, PASS, {
              host: HOST,
              port: PORT,
              dialect: 'mysql',
              timezone: '+08:00',
              logging: false,
              pool: {
                max: 50,
                min: 0,
                acquire: 30000,
                idle: 10000
              }
            }); // 美元汇率

            DollarExchangeRate = sequelize.define('DollarExchangeRate', {
              time: {
                type: _sequelize.default.DATE
              },
              rate: {
                type: _sequelize.default.DOUBLE
              }
            }); // 阿里司法拍卖

            AliJudicialSell = sequelize.define('AliJudicialSell', {
              all_all: {
                type: _sequelize.default.INTEGER
              },
              all_underway: {
                type: _sequelize.default.INTEGER
              },
              all_soon: {
                type: _sequelize.default.INTEGER
              },
              all_past: {
                type: _sequelize.default.INTEGER
              },
              all_termination: {
                type: _sequelize.default.INTEGER
              },
              all_withdraw: {
                type: _sequelize.default.INTEGER
              },
              beijing_all: {
                type: _sequelize.default.INTEGER
              },
              beijing_underway: {
                type: _sequelize.default.INTEGER
              },
              beijing_soon: {
                type: _sequelize.default.INTEGER
              },
              beijing_past: {
                type: _sequelize.default.INTEGER
              },
              beijing_termination: {
                type: _sequelize.default.INTEGER
              },
              beijing_withdraw: {
                type: _sequelize.default.INTEGER
              },
              tianjin_all: {
                type: _sequelize.default.INTEGER
              },
              tianjin_underway: {
                type: _sequelize.default.INTEGER
              },
              tianjin_soon: {
                type: _sequelize.default.INTEGER
              },
              tianjin_past: {
                type: _sequelize.default.INTEGER
              },
              tianjin_termination: {
                type: _sequelize.default.INTEGER
              },
              tianjin_withdraw: {
                type: _sequelize.default.INTEGER
              },
              shanghai_all: {
                type: _sequelize.default.INTEGER
              },
              shanghai_underway: {
                type: _sequelize.default.INTEGER
              },
              shanghai_soon: {
                type: _sequelize.default.INTEGER
              },
              shanghai_past: {
                type: _sequelize.default.INTEGER
              },
              shanghai_termination: {
                type: _sequelize.default.INTEGER
              },
              shanghai_withdraw: {
                type: _sequelize.default.INTEGER
              },
              hebei_all: {
                type: _sequelize.default.INTEGER
              },
              hebei_underway: {
                type: _sequelize.default.INTEGER
              },
              hebei_soon: {
                type: _sequelize.default.INTEGER
              },
              hebei_past: {
                type: _sequelize.default.INTEGER
              },
              hebei_termination: {
                type: _sequelize.default.INTEGER
              },
              hebei_withdraw: {
                type: _sequelize.default.INTEGER
              },
              shanxi_all: {
                type: _sequelize.default.INTEGER
              },
              shanxi_underway: {
                type: _sequelize.default.INTEGER
              },
              shanxi_soon: {
                type: _sequelize.default.INTEGER
              },
              shanxi_past: {
                type: _sequelize.default.INTEGER
              },
              shanxi_termination: {
                type: _sequelize.default.INTEGER
              },
              shanxi_withdraw: {
                type: _sequelize.default.INTEGER
              }
            });
            _context3.next = 5;
            return DollarExchangeRate.sync();

          case 5:
            _context3.next = 7;
            return AliJudicialSell.sync();

          case 7:
            _context3.prev = 7;
            _context3.next = 10;
            return sequelize.authenticate();

          case 10:
            setInterval(
            /*#__PURE__*/
            (0, _asyncToGenerator2.default)(
            /*#__PURE__*/
            _regenerator.default.mark(function _callee() {
              var res, d, time, t;
              return _regenerator.default.wrap(function _callee$(_context) {
                while (1) {
                  switch (_context.prev = _context.next) {
                    case 0:
                      _context.next = 2;
                      return _http.default.get("https://hq.sinajs.cn/rn=".concat(Date.now(), "list=fx_susdcny"));

                    case 2:
                      res = _context.sent;
                      // 数据，0为时间，2为汇率
                      d = res.data.split('="')[1].split(',');
                      time = (0, _moment.default)((0, _toConsumableArray2.default)(d).reverse()[0] + " ".concat(d[0]), 'YYYY-MM-DD HH:mm:ss')._d; // 判断时间是否已存在

                      _context.next = 7;
                      return DollarExchangeRate.findAll({
                        where: {
                          time: time
                        }
                      });

                    case 7:
                      t = _context.sent;

                      if (t1 !== res.data && t.length === 0) {
                        try {
                          DollarExchangeRate.create({
                            time: time,
                            rate: d[2]
                          });
                          t1 = res.data;
                          console.log("\u7F8E\u5143\u6C47\u7387\u4FE1\u606F - time: ".concat((0, _moment.default)(time).format('YYYY-MM-DD HH:mm:ss'), ", rate: ").concat(d[2]));
                        } catch (e) {
                          console.error(e.message);
                        }
                      }

                    case 9:
                    case "end":
                      return _context.stop();
                  }
                }
              }, _callee);
            })), 10000); // house

            setInterval(
            /*#__PURE__*/
            (0, _asyncToGenerator2.default)(
            /*#__PURE__*/
            _regenerator.default.mark(function _callee2() {
              var resHouseInfo, target;
              return _regenerator.default.wrap(function _callee2$(_context2) {
                while (1) {
                  switch (_context2.prev = _context2.next) {
                    case 0:
                      _context2.next = 2;
                      return Promise.all(_lodash.default.flatten(['', '%B1%B1%BE%A9', '%CC%EC%BD%F2', '%C9%CF%BA%A3', '%BA%D3%B1%B1', '%C9%BD%CE%F7'].map(function (o) {
                        var t = "https://sf.taobao.com/item_list.htm?category=50025969&city=&province=".concat(o, "&sorder=");
                        return [_http.default.get(t + -1), _http.default.get(t + 0), _http.default.get(t + 1), _http.default.get(t + 2), _http.default.get(t + 4), _http.default.get(t + 5)];
                      })));

                    case 2:
                      _context2.t0 = function (o) {
                        return new JSDOM(o.data).window.document.querySelector('h1').textContent.match(/\d+/g)[0];
                      };

                      resHouseInfo = _context2.sent.map(_context2.t0);

                      if (t2 !== resHouseInfo.join()) {
                        try {
                          resHouseInfo = _lodash.default.chunk(resHouseInfo, 6);
                          target = {};
                          resHouseInfo.forEach(function (o, i) {
                            var name;

                            switch (i) {
                              case 0:
                                name = 'all';
                                break;

                              case 1:
                                name = 'beijing';
                                break;

                              case 2:
                                name = 'tianjin';
                                break;

                              case 3:
                                name = 'shanghai';
                                break;

                              case 4:
                                name = 'hebei';
                                break;

                              case 5:
                                name = 'shanxi';
                                break;
                            }

                            o.forEach(function (ob, ind) {
                              var fun;

                              switch (ind) {
                                case 0:
                                  fun = '_all';
                                  break;

                                case 1:
                                  // 正在进行
                                  fun = '_underway';
                                  break;

                                case 2:
                                  // 即将开始
                                  fun = '_soon';
                                  break;

                                case 3:
                                  // 过去
                                  fun = '_past';
                                  break;

                                case 4:
                                  // 终止
                                  fun = '_termination';
                                  break;

                                case 5:
                                  // 撤回
                                  fun = '_withdraw';
                                  break;
                              }

                              target[name + fun] = ob;
                            });
                          });
                          AliJudicialSell.create(target);
                          t2 = resHouseInfo.join();
                          console.log("\u963F\u91CC\u53F8\u6CD5\u62CD\u5356 - ".concat(t2));
                        } catch (e) {
                          console.error(e.message);
                        }
                      }

                    case 5:
                    case "end":
                      return _context2.stop();
                  }
                }
              }, _callee2);
            })), 1000 * 6);
            _context3.next = 18;
            break;

          case 14:
            _context3.prev = 14;
            _context3.t0 = _context3["catch"](7);
            console.error(_context3.t0.message);
            setTimeout(getSeq, 1000 * 60 * 5);

          case 18:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3, null, [[7, 14]]);
  }));
  return _getSeq.apply(this, arguments);
}

getSeq();