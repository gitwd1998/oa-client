import ElementPlus, { ElDialog, ElDrawer, ElForm, ElInput, ElPagination, ElSelect, ElTable } from 'element-plus'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import 'element-plus/dist/index.css'

// ElInput
ElInput.props['placeholder'] = {
  type: String,
  default: '请输入'
}

// ElSelect
ElSelect.props['placeholder'] = {
  type: String,
  default: '请选择'
}

// ElForm
ElForm.props['label-width'] = {
  type: String,
  default: 'auto'
}
ElForm.props['label-suffix'] = {
  type: String,
  default: ':'
}
ElForm.props['scroll-to-error'] = {
  type: Boolean,
  default: true
}
ElForm.props['scroll-into-view-options'] = {
  type: Object,
  default: {
    behavior: 'smooth'
  }
}

// ElTable
ElTable.props['border'] = {
  type: Boolean,
  default: false
}

// ElPagination
ElPagination.props['background'] = {
  type: Boolean,
  default: true
}
ElPagination.props['layout'] = {
  type: String,
  default: 'total, prev, pager, next, sizes'
}
ElPagination.props['page-sizes'] = {
  type: Array,
  default: [10, 20, 50, 100]
}


// ElDialog
ElDialog.props['width'] = {
  type: Number,
  default: 640
}
ElDialog.props['append-to-body'] = {
  type: Boolean,
  default: true
}
ElDialog.props['destroy-on-close'] = {
  type: Boolean,
  default: true
}
ElDialog.props['close-on-click-modal'] = {
  type: Boolean,
  default: false
}
ElDialog.props['close-on-press-escape'] = {
  type: Boolean,
  default: false
}
ElDialog.props['append-to-body'] = {
  type: Boolean,
  default: true
}


// ElDrawer
ElDrawer.props['size'] = {
  type: Number,
  default: 640
}
ElDrawer.props['append-to-body'] = {
  type: Boolean,
  default: true
}
ElDrawer.props['destroy-on-close'] = {
  type: Boolean,
  default: true
}
ElDrawer.props['close-on-click-modal'] = {
  type: Boolean,
  default: false
}
ElDrawer.props['close-on-press-escape'] = {
  type: Boolean,
  default: false
}
ElDrawer.props['append-to-body'] = {
  type: Boolean,
  default: true
}

export default (app) => {
  app.use(ElementPlus)
  for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
  }
}