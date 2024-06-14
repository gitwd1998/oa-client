import MyPagination from '@/components/MyPagination'
import IconSelect from '@/components/IconSelect'

export default (app) => {
  app.component(MyPagination.__name, MyPagination)
  app.component(IconSelect.__name, IconSelect)
}