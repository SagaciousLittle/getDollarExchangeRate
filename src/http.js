import Axios from 'axios'
import iconv from 'iconv-lite'

// 初始化
const axios = Axios.create({
  responseType: 'arraybuffer'
})

axios.interceptors.response.use(res => {
  res.data = iconv.decode(res.data, 'GBK')
  return res
})

export default axios