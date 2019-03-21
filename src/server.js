import axios from './http'
import Sequelize from 'sequelize'
import moment from 'moment'
import jsdom from 'jsdom'
import iconv from 'iconv-lite'
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
    all: {
      type: Sequelize.INTEGER
    },
    beijing: {
      type: Sequelize.INTEGER
    },
    tianjin: {
      type: Sequelize.INTEGER
    },
    shanghai: {
      type: Sequelize.INTEGER
    },
    hebei: {
      type: Sequelize.INTEGER
    },
    shanxi: {
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
      const resHouseInfo = (await Promise.all([
        axios.get('https://sf.taobao.com/item_list.htm?category=50025969'),
        axios.get('https://sf.taobao.com/item_list.htm?category=50025969&city=&province=%B1%B1%BE%A9'),
        axios.get('https://sf.taobao.com/item_list.htm?category=50025969&city=&province=%CC%EC%BD%F2'),
        axios.get('https://sf.taobao.com/item_list.htm?category=50025969&city=&province=%C9%CF%BA%A3'),
        axios.get('https://sf.taobao.com/item_list.htm?category=50025969&city=&province=%BA%D3%B1%B1'),
        axios.get('https://sf.taobao.com/item_list.htm?category=50025969&city=&province=%C9%BD%CE%F7'),
      ])).map(o => {
        return new JSDOM(o.data).window.document.querySelector('h1').textContent.match(/\d+/g)[0]
      })
      if (t2 !== resHouseInfo.join()) {
        try {
          AliJudicialSell.create({
            all: resHouseInfo[0],
            beijing: resHouseInfo[1],
            tianjin: resHouseInfo[2],
            shanghai: resHouseInfo[3],
            hebei: resHouseInfo[4],
            shanxi: resHouseInfo[5]
          })
          t2 = resHouseInfo.join()
          console.log(t2)
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