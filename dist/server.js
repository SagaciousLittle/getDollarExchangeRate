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
              all: {
                type: _sequelize.default.INTEGER
              },
              beijing: {
                type: _sequelize.default.INTEGER
              },
              tianjin: {
                type: _sequelize.default.INTEGER
              },
              shanghai: {
                type: _sequelize.default.INTEGER
              },
              hebei: {
                type: _sequelize.default.INTEGER
              },
              shanxi: {
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
              var resHouseInfo;
              return _regenerator.default.wrap(function _callee2$(_context2) {
                while (1) {
                  switch (_context2.prev = _context2.next) {
                    case 0:
                      _context2.next = 2;
                      return Promise.all([_http.default.get('https://sf.taobao.com/item_list.htm?category=50025969'), _http.default.get('https://sf.taobao.com/item_list.htm?category=50025969&city=&province=%B1%B1%BE%A9'), _http.default.get('https://sf.taobao.com/item_list.htm?category=50025969&city=&province=%CC%EC%BD%F2'), _http.default.get('https://sf.taobao.com/item_list.htm?category=50025969&city=&province=%C9%CF%BA%A3'), _http.default.get('https://sf.taobao.com/item_list.htm?category=50025969&city=&province=%BA%D3%B1%B1'), _http.default.get('https://sf.taobao.com/item_list.htm?category=50025969&city=&province=%C9%BD%CE%F7')]);

                    case 2:
                      _context2.t0 = function (o) {
                        return new JSDOM(o.data).window.document.querySelector('h1').textContent.match(/\d+/g)[0];
                      };

                      resHouseInfo = _context2.sent.map(_context2.t0);

                      if (t2 !== resHouseInfo.join()) {
                        try {
                          AliJudicialSell.create({
                            all: resHouseInfo[0],
                            beijing: resHouseInfo[1],
                            tianjin: resHouseInfo[2],
                            shanghai: resHouseInfo[3],
                            hebei: resHouseInfo[4],
                            shanxi: resHouseInfo[5]
                          });
                          t2 = resHouseInfo.join();
                          console.log(t2);
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
            })), 1000 * 60);
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