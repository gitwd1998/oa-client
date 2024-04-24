import { ElDialog, ElDrawer, ElForm, ElInput, ElPagination, ElSelect, ElTable } from 'element-plus';

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
ElForm.props['show-message'] = {
  type: Boolean,
  default: false
}


// ElTable
ElTable.props['border'] = {
  type: Boolean,
  default: true
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