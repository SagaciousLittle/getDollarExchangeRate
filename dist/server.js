"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _http = _interopRequireDefault(require("./http"));

var _sequelize = _interopRequireDefault(require("sequelize"));

var _moment = _interopRequireDefault(require("moment"));

function getSeq() {
  return _getSeq.apply(this, arguments);
}

function _getSeq() {
  _getSeq = (0, _asyncToGenerator2.default)(
  /*#__PURE__*/
  _regenerator.default.mark(function _callee2() {
    var sequelize, DollarExchangeRate, r;
    return _regenerator.default.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            sequelize = new _sequelize.default('blog', 'root', 'Qq19940329', {
              host: '140.143.16.25',
              port: '13306',
              dialect: 'mysql',
              operatorsAliases: false,
              timezone: '+08:00',
              logging: false,
              pool: {
                max: 5,
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
            });
            _context2.next = 4;
            return DollarExchangeRate.sync();

          case 4:
            _context2.prev = 4;
            _context2.next = 7;
            return sequelize.authenticate();

          case 7:
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
                      time = (0, _moment.default)((0, _moment.default)().format('YYYY-MM-DD') + " ".concat(d[0]), 'YYYY-MM-DD HH:mm:ss')._d; // 判断时间是否已存在

                      _context.next = 7;
                      return DollarExchangeRate.findAll({
                        where: {
                          time: time
                        }
                      });

                    case 7:
                      t = _context.sent;

                      if (r !== res.data && t.length === 0) {
                        DollarExchangeRate.create({
                          time: time,
                          rate: d[2]
                        });
                        r = res.data;
                      }

                    case 9:
                    case "end":
                      return _context.stop();
                  }
                }
              }, _callee);
            })), 10000);
            _context2.next = 14;
            break;

          case 10:
            _context2.prev = 10;
            _context2.t0 = _context2["catch"](4);
            console.error(_context2.t0.message);
            setTimeout(getSeq, 1000 * 60 * 5);

          case 14:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, null, [[4, 10]]);
  }));
  return _getSeq.apply(this, arguments);
}

getSeq();