<template>
  <div class="scroll-wrap">
    <div class="search-wrap">
      <el-form ref="searchFormRef" :model="searchFormData" inline>
        <el-form-item label="菜单标识" prop="menuKey">
          <el-input v-model="searchFormData.menuKey" clearable />
        </el-form-item>
        <el-form-item label="菜单名称" prop="menuName">
          <el-input v-model="searchFormData.menuName" clearable />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="searchData">搜索</el-button>
          <el-button @click="$refs.searchFormRef.resetFields()">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="operate-wrap">
      <el-button type="primary" @click="addData">新增</el-button>
    </div>
    <div class="table-wrap">
      <el-table
        ref="tableRef"
        :data="tableData"
        height="100%"
        row-key="menuId"
        lazy
        :load="querySubTableData"
        :span-method="spanMethod"
        @expand-change="expandChange"
        @filter-change="filterMethod"
      >
        <el-table-column label="菜单名称" prop="menuName">
          <template #default="{ row }">
            <span v-if="row.isEmpty">暂无数据</span>
            <!-- <el-button v-else-if="row.loadMore" :loading="row.loading" type="text" @click="loadMore(row)">加载更多</el-button> -->
            <div v-else style="display: inline-flex; align-items: center;">
              <el-icon v-if="row.menuIcon" style="margin-right: 4px;">
                <component :is="row.menuIcon" />
              </el-icon>
              <span>{{ row.menuName }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="菜单标识" prop="menuKey" />
        <el-table-column label="菜单类型" prop="menuType" width="100" :formatter="(row) => dict.label.menu_type[row.menuType]" />
        <el-table-column label="菜单地址" prop="menuPath" />
        <el-table-column label="显示状态" prop="menuVisible" width="100" :formatter="(row) => dict.label.visible[row.menuVisible]" />
        <el-table-column
          label="启用状态"
          prop="menuState"
          width="100"
          column-key="menuState"
          :filters="dict.values.status.map(item => ({ text: item.label, value: item.value }))"
        >
          <template #default="{ row }">
            <el-tag :type="['danger', 'success'][row.menuState]">{{ dict.label.status[row.menuState] }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="120">
          <template #default="{ row }">
            <el-button link type="primary" icon="Plus" @click.stop="addSubData(row)" />
            <el-button link type="warning" icon="Edit" @click.stop="editData(row)" />
            <el-button link type="danger" icon="Delete" @click.stop="deleteData(row)" />
          </template>
        </el-table-column>
        <template #empty>
          <el-empty />
        </template>
      </el-table>
    </div>
    <div class="pagination-wrap" v-if="pageData.total">
      <my-pagination
        v-model:current-page="pageData.pageNum"
        v-model:page-size="pageData.pageSize"
        :total="pageData.total"
        @change="queryTableData"
      />
    </div>
    <el-dialog v-model="dialogVisible" :title="dialogTitle">
      <el-form ref="addFormRef" :model="addFormData" :rules="addFormRules">
        <el-form-item label="菜单标识" prop="menuKey">
          <el-input v-model="addFormData.menuKey" :disabled="!!addFormData.menuId" clearable maxlength="100" show-word-limit />
        </el-form-item>
        <el-form-item label="菜单名称" prop="menuName">
          <el-input v-model="addFormData.menuName" clearable maxlength="100" show-word-limit />
        </el-form-item>
        <el-form-item label="菜单图标" prop="menuIcon">
          <icon-select v-model="addFormData.menuIcon" clearable />
          <el-icon v-if="addFormData.menuIcon" style="margin: 0 10px;">
            <component :is="addFormData.menuIcon" />
          </el-icon>
        </el-form-item>
        <el-form-item label="菜单类型" prop="menuType">
          <el-radio-group v-model="addFormData.menuType">
            <el-radio v-for="option in dict.values.menu_type" :key="option.value" :label="option.value">{{ option.label }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="菜单地址" prop="menuPath">
          <el-input v-model="addFormData.menuPath" clearable maxlength="1000" show-word-limit />
        </el-form-item>
        <el-form-item label="可见状态" prop="menuVisible">
          <el-radio-group v-model="addFormData.menuVisible">
            <el-radio v-for="option in dict.values.visible" :key="option.value" :label="option.value">{{ option.label }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="启用状态" prop="menuState">
          <el-radio-group v-model="addFormData.menuState">
            <el-radio v-for="option in dict.values.status" :key="option.value" :label="option.value">{{ option.label }}</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="confrimMenu">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { menuList, menuSave, menuDelete } from '@/apis/menu'
export default {
  name: 'MenuAdmin',
  dicts: ['visible', 'status', 'menu_type'],
  data() {
    return {
      searchFormData: {
        menuParentId: 0,
        menuKey: '',
        menuName: '',
        menuState: ''
      },
      expandRowKeys: [],
      tableData: [],
      pageData: {
        pageNum: 1,
        pageSize: 20,
        total: 0
      },
      dialogVisible: false,
      dialogTitle: '',
      addFormData: {
        menuId: '',
        menuParentId: '',
        menuKey: '',
        menuName: '',
        menuIcon: '',
        menuType: '',
        menuPath: '',
        menuVisible: '',
        menuSort: '',
        menuState: '',
        loadParent: null,
        loadChild: null
      },
      addFormRules: {
        menuKey: [
          { required: true, message: "请输入菜单标识", trigger: "none", transform: (val) => val.trim() }
        ],
        menuName: [
          { required: true, message: "请输入菜单名称", trigger: "none", transform: (val) => val.trim() }
        ],
        menuType: [
          { required: true, message: "请选择菜单类型", trigger: "none" }
        ],
        menuPath: [
          { required: true, message: "请输入菜单地址", trigger: "none", transform: (val) => val.trim() }
        ]
      }
    }
  },
  computed: {
    tableStore() {
      return this.$refs.tableRef.store
    },
    lazyTreeNodeMap() {
      return this.store.states.lazyTreeNodeMap.value
    }
  },
  created() {
    this.queryTableData()
  },
  methods: {
    spanMethod({ row, columnIndex }) {
      if (row.isEmpty || row.loadMore) {
        if (columnIndex) {
          return [0, 0]
        } else {
          return [1, 7]
        }
      }
    },
    queryTableData() {
      const loading = this.$loading()
      menuList(this.searchFormData, this.pageData).then((res) => {
        if (res.code === '000000') {
          this.tableData = res.data?.list?.map((row) => ({
            ...row,
            children: [],
            hasChildren: true,
            loadParent: null,
            loadChild: null
          }))
          this.pageData.pageNum = res.data?.pageNum
          this.pageData.pageSize = res.data?.pageSize
          this.pageData.total = res.data?.total
        }
        console.log(this.$refs.tableRef);
      }).catch((err) => {
        console.error(err)
      }).finally(() => {
        loading.close()
      })
    },
    querySubTableData(row, treeNode, resolve) {
      row.loadChild = this.querySubTableData.bind(this, row, treeNode, resolve)
      menuList({ menuParentId: row.menuId }, { pageNum: 1, pageSize: 0 }).then((res) => {
        if (res.code === '000000') {
          let tableData = res.data.list.map((sub) => ({
            ...sub,
            children: [],
            hasChildren: true,
            loadParent: this.querySubTableData.bind(this, row, treeNode, resolve),
            loadChild: this.querySubTableData.bind(this, sub, treeNode, resolve)
          }))
          if (!res.data.isLastPage) {
            // tableData.push({ loadMore: this.querySubTableData.bind(this, row, treeNode, resolve, { pageNum: res.data.pageNum + 1, pageSize: 10 }), loading: false, data: tableData })
          }
          if (res.data?.list.length) {
            resolve(tableData)
          } else {
            resolve([{ isEmpty: true }])
          }
        }
      }).catch((err) => {
        console.error(err)
      })
    },
    loadMore(row) {
      row.loading = true
      console.log(row);
      row.loading = false
    },
    searchData() {
      this.pageData = {
        pageNum: 1,
        pageSize: 20,
        total: 0
      }
      this.queryTableData()
    },
    filterMethod(value) {
      this.searchFormData.menuState = value.menuState.length === 1 ? value.menuState[0] : ''
      this.searchData()
    },
    expandChange(row, expanded) {
      if (!expanded) {
        this.tableStore.states.treeData.value[row.menuId].loaded = false
        this.tableStore.states.lazyTreeNodeMap.value[row.menuId] = [{ isEmpty: true }]
      }
    },
    addData() {
      this.dialogTitle = '新增菜单'
      this.addFormData = {
        menuId: '',
        menuParentId: 0,
        menuKey: '',
        menuName: '',
        menuIcon: '',
        menuType: '',
        menuPath: '',
        menuVisible: '1',
        menuSort: this.pageData.total,
        menuState: '1',
        loadParent: null,
        loadChild: null
      }
      this.dialogVisible = true
    },
    addSubData(row) {
      console.log(row);
      this.dialogTitle = `新增${row.menuName}子菜单`
      this.addFormData = {
        menuId: '',
        menuParentId: row.menuId,
        menuKey: '',
        menuName: '',
        menuIcon: '',
        menuType: '',
        menuPath: '',
        menuVisible: '1',
        menuSort: 0,
        menuState: '1',
        loadParent: row.loadParent,
        loadChild: row.loadChild
      }
      this.dialogVisible = true
    },
    editData(row) {
      console.log(row);
      this.dialogTitle = '修改菜单'
      this.addFormData = {
        ...JSON.parse(JSON.stringify(row)),
        loadParent: row.loadParent,
        loadChild: row.loadChild
      }
      this.dialogVisible = true
    },
    confrimMenu() {
      console.log(this.addFormData, this.addFormData.menuId, this.addFormData.loadChild);
      this.$refs.addFormRef.validate((valid) => {
        if (valid) {
          menuSave(this.addFormData).then((res) => {
            if (res.code === '000000') this.$message.success(res.message)
          }).catch((err) => {
            console.error(err)
          }).finally(() => {
            this.dialogVisible = false
            if (this.addFormData.menuId) { // 编辑
              if (this.addFormData.loadParent) {
                this.addFormData.loadParent()
              } else {
                this.searchData()
              }
            } else { // 新增
              if (this.addFormData.loadChild) {
                this.addFormData.loadChild()
              } else {
                this.searchData()
              }
            }
          })
        }
      })
    },
    deleteData(row) {
      this.$confirm('确定要删除这条内容吗？', '提示', {
        type: 'warning',
      }).then(() => {
        menuDelete({ menuId: row.menuId }).then((res) => {
          if (res.code === '000000') this.$message.success(res.message)
        }).catch((err) => {
          console.error(err)
        }).finally(() => {
          if (row.loadParent) {
            row.loadParent()
          } else {
            this.searchData()
          }
        })
      }).catch(() => {
        // empty
      })
    },
  }
}
</script>
