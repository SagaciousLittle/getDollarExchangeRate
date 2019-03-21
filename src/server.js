import axios from './http'
import Sequelize from 'sequelize'
import moment from 'moment'
import Info from './Info'

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
      max: 5,
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

  await DollarExchangeRate.sync()

  try {
    await sequelize.authenticate()
    let r
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
      if (r !== res.data && t.length === 0) {
        DollarExchangeRate.create({
          time,
          rate: d[2]
        })
        r = res.data
        console.log(`time: ${moment(time).format('YYYY-MM-DD HH:mm:ss')}, rate: ${d[2]}`)
      }
    }, 10000)
  } catch (e) {
    console.error(e.message)
    setTimeout(getSeq, 1000 * 60 * 5)
  }
}

getSeq()