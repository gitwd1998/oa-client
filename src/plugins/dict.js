import { dictOptionList } from '@/apis/dict'

export default {
  metas: {
    '*': {
      request({ type: dictKey }) {
        return new Promise((resolve) => {
          dictOptionList({ dictKey }).then((res) => {
            if (res.code === '000000') resolve(res.data || [])
            else resolve([])
          }).catch((err) => {
            console.error(err)
          })
        })
      },
      labelField: 'dictOptionLabel',
      valueField: 'dictOptionValue',
      lazy: false,
      lookup: false
    }
  }
}