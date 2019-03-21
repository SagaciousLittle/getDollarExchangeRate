import axios from './http'
import Sequelize from 'sequelize'
import moment from 'moment'
import jsdom from 'jsdom'
import iconv from 'iconv-lite'
import _ from 'lodash'
import Info from './Info'

const {
  JSDOM,
} = jsdom

const {
  DATEBASE,
  USER,
  PASS,
  HOST,
  PORT,
} = Info

async function getSeq () {
  const sequelize = new Sequelize(DATEBASE, USER, PASS, {
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
  })

  // 美元汇率
  const DollarExchangeRate = sequelize.define('DollarExchangeRate', {
    time: {
      type: Sequelize.DATE
    },
    rate: {
      type: Sequelize.DOUBLE
    }
  })

  // 阿里司法拍卖
  const AliJudicialSell = sequelize.define('AliJudicialSell', {
    all_all: {
      type: Sequelize.INTEGER
    },
    all_underway: {
      type: Sequelize.INTEGER
    },
    all_soon: {
      type: Sequelize.INTEGER
    },
    all_past: {
      type: Sequelize.INTEGER
    },
    all_termination: {
      type: Sequelize.INTEGER
    },
    all_withdraw: {
      type: Sequelize.INTEGER
    },
    beijing_all: {
      type: Sequelize.INTEGER
    },
    beijing_underway: {
      type: Sequelize.INTEGER
    },
    beijing_soon: {
      type: Sequelize.INTEGER
    },
    beijing_past: {
      type: Sequelize.INTEGER
    },
    beijing_termination: {
      type: Sequelize.INTEGER
    },
    beijing_withdraw: {
      type: Sequelize.INTEGER
    },
    tianjin_all: {
      type: Sequelize.INTEGER
    },
    tianjin_underway: {
      type: Sequelize.INTEGER
    },
    tianjin_soon: {
      type: Sequelize.INTEGER
    },
    tianjin_past: {
      type: Sequelize.INTEGER
    },
    tianjin_termination: {
      type: Sequelize.INTEGER
    },
    tianjin_withdraw: {
      type: Sequelize.INTEGER
    },
    shanghai_all: {
      type: Sequelize.INTEGER
    },
    shanghai_underway: {
      type: Sequelize.INTEGER
    },
    shanghai_soon: {
      type: Sequelize.INTEGER
    },
    shanghai_past: {
      type: Sequelize.INTEGER
    },
    shanghai_termination: {
      type: Sequelize.INTEGER
    },
    shanghai_withdraw: {
      type: Sequelize.INTEGER
    },
    hebei_all: {
      type: Sequelize.INTEGER
    },
    hebei_underway: {
      type: Sequelize.INTEGER
    },
    hebei_soon: {
      type: Sequelize.INTEGER
    },
    hebei_past: {
      type: Sequelize.INTEGER
    },
    hebei_termination: {
      type: Sequelize.INTEGER
    },
    hebei_withdraw: {
      type: Sequelize.INTEGER
    },
    shanxi_all: {
      type: Sequelize.INTEGER
    },
    shanxi_underway: {
      type: Sequelize.INTEGER
    },
    shanxi_soon: {
      type: Sequelize.INTEGER
    },
    shanxi_past: {
      type: Sequelize.INTEGER
    },
    shanxi_termination: {
      type: Sequelize.INTEGER
    },
    shanxi_withdraw: {
      type: Sequelize.INTEGER
    }
  })

  await DollarExchangeRate.sync()
  await AliJudicialSell.sync()

  try {
    await sequelize.authenticate()

    // dollar
    let t1
    setInterval(async function () {
      const res = await axios.get(`https://hq.sinajs.cn/rn=${Date.now()}list=fx_susdcny`)
      // 数据，0为时间，2为汇率
      const d = res.data.split('="')[1].split(',')
      const time = moment([...d].reverse()[0] + ` ${d[0]}`, 'YYYY-MM-DD HH:mm:ss')._d
      // 判断时间是否已存在
      const t = await DollarExchangeRate.findAll({
        where: {
          time
        }
      })
      if (t1 !== res.data && t.length === 0) {
        try {
          DollarExchangeRate.create({
            time,
            rate: d[2]
          })
          t1 = res.data
          console.log(`美元汇率信息 - time: ${moment(time).format('YYYY-MM-DD HH:mm:ss')}, rate: ${d[2]}`)
        } catch (e) {
          console.error(e.message)
        }
      }
    }, 10000)

    // house
    let t2
    setInterval(async () => {
      let resHouseInfo = (await Promise.all(_.flatten([
        '',
        '%B1%B1%BE%A9',
        '%CC%EC%BD%F2',
        '%C9%CF%BA%A3',
        '%BA%D3%B1%B1',
        '%C9%BD%CE%F7'
      ].map(o => {
        let t = `https://sf.taobao.com/item_list.htm?category=50025969&city=&province=${o}&sorder=`
        return [
          axios.get(t + -1),
          axios.get(t + 0),
          axios.get(t + 1),
          axios.get(t + 2),
          axios.get(t + 4),
          axios.get(t + 5)
        ]
      })))).map(o => {
        return new JSDOM(o.data).window.document.querySelector('h1').textContent.match(/\d+/g)[0]
      })
      if (t2 !== resHouseInfo.join()) {
        try {
          resHouseInfo = _.chunk(resHouseInfo, 6)
          let target = {}
          resHouseInfo.forEach((o, i) => {
            let name
            switch (i) {
              case 0:
                name = 'all'
                break
              case 1:
                name = 'beijing'
                break
              case 2:
                name = 'tianjin'
                break
              case 3:
                name = 'shanghai'
                break
              case 4:
                name = 'hebei'
                break
              case 5:
                name = 'shanxi'
                break
            }
            o.forEach((ob, ind) => {
              let fun
              switch (ind) {
                case 0:
                  fun = '_all'
                  break
                case 1:
                  // 正在进行
                  fun = '_underway'
                  break
                case 2:
                  // 即将开始
                  fun = '_soon'
                  break
                case 3:
                  // 过去
                  fun = '_past'
                  break
                case 4:
                  // 终止
                  fun = '_termination'
                  break
                case 5:
                  // 撤回
                  fun = '_withdraw'
                  break
              }
              target[name + fun] = ob
            })
          })
          AliJudicialSell.create(target)
          t2 = resHouseInfo.join()
          console.log(`阿里司法拍卖 - ${t2}`)
        } catch (e) {
          console.error(e.message)
        }
      }
    }, 1000 * 60)
  } catch (e) {
    console.error(e.message)
    setTimeout(getSeq, 1000 * 60 * 5)
  }
}

getSeq()