<template>
  <div class="scroll-wrap">
    <div class="search-wrap">
      <el-form ref="searchFormRef" :model="searchFormData" inline>
        <el-form-item label="角色标识" prop="roleKey">
          <el-input v-model="searchFormData.roleKey" clearable />
        </el-form-item>
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="searchFormData.roleName" clearable />
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
      <el-table ref="tableRef" :data="tableData" height="100%" @filter-change="filterMethod">
        <el-table-column label="角色标识" prop="roleKey" />
        <el-table-column label="角色名称" prop="roleName" />
        <el-table-column
          label="启用状态"
          prop="roleState"
          width="100"
          column-key="roleState"
          :filters="dict.values.status.map(item => ({ text: item.label, value: item.value }))"
        >
          <template #default="{ row }">
            <el-tag :type="['danger', 'success'][row.roleState]">{{ dict.label.status[row.roleState] }}</el-tag>
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
        <el-form-item label="角色标识" prop="roleKey">
          <el-input v-model="addFormData.roleKey" :disabled="!!addFormData.roleId" clearable maxlength="100" show-word-limit />
        </el-form-item>
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="addFormData.roleName" clearable maxlength="100" show-word-limit />
        </el-form-item>
        {{ addFormData.roleMenu }}
        <el-form-item label="角色菜单" prop="roleMenu">
          <el-tree-select
            ref="roleMenuRef"
            style="width: 100%"
            :data="menuList"
            v-model="addFormData.roleMenu"
            node-key="menuId"
            :render-after-expand="false"
            show-checkbox
            multiple
            :props="{
              label: 'menuName'
            }"
          />
        </el-form-item>
        <el-form-item label="启用状态" prop="roleState">
          <el-radio-group v-model="addFormData.roleState">
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
import { roleList, /* roleSave, */ roleDelete } from '@/apis/role'
import { menuList, menuTree } from "@/apis/menu";
export default {
  name: 'RoleAdmin',
  dicts: ['visible', 'status', 'role_type'],
  data() {
    return {
      searchFormData: {
        roleKey: '',
        roleName: '',
        roleState: ''
      },
      tableData: [],
      pageData: {
        pageNum: 1,
        pageSize: 20,
        total: 0
      },
      dialogVisible: false,
      dialogTitle: '',
      addFormData: {
        roleId: '',
        roleKey: '',
        roleName: '',
        roleMenu: [],
        roleState: ''
      },
      addFormRules: {
        roleKey: [
          { required: true, message: '请输入角色标识', trigger: 'none', transform: (val) => val.trim() }
        ],
        roleName: [
          { required: true, message: '请输入角色名称', trigger: 'none', transform: (val) => val.trim() }
        ],
        roleMenu: [
          { required: true, message: '请选择菜单', trigger: 'none' }
        ]
      },
      menuList: []
    }
  },
  computed: {
    tableStore() {
      return this.$refs.tableRef.store
    },
    lazyTreeNodeMap() {
      return this.store.states.lazyTreeNodeMap.value
    },
    addFormDataFormat() {
      console.log(this.$refs.roleMenuRef);
      return {
        ...this.addFormData,
        roleMenu: this.$refs.roleMenuRef.getCheckedNodes().map(menu => [menu.menuParentId, menu.menuId])
      }
    }
  },
  created() {
    this.queryMenuTree()
    this.queryTableData()
  },
  methods: {
    queryMenuTree() {
      menuTree().then((res) => {
        if (res.code === '000000') {
          this.menuList = res.data || []
        }
      }).catch((err) => {
        console.error(err)
      })
    },
    queryMenuList(node, resolve) {
      console.log(node);
      menuList({ menuParentId: node.level ? node.key : 0 }, { pageNum: 1, pageSize: 0 }).then((res) => {
        if (res.code === '000000') {
          resolve(res.data.list.map((menu) => ({
          ...menu,
          children: [],
          disabled: menu.menuState === '0',
          isLeaf: !!node.level
        })))
        }
      }).catch((err) => {
        console.error(err)
      })
    },
    queryTableData() {
      const loading = this.$loading()
      roleList(this.searchFormData, this.pageData).then((res) => {
        if (res.code === '000000') {
          this.tableData = res.data?.list || []
          this.pageData.pageNum = res.data?.pageNum
          this.pageData.pageSize = res.data?.pageSize
          this.pageData.total = res.data?.total
        }
      }).catch((err) => {
        console.error(err)
      }).finally(() => {
        loading.close()
      })
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
      this.searchFormData.roleState = value.roleState.length === 1 ? value.roleState[0] : ''
      this.searchData()
    },
    addData() {
      this.dialogTitle = '新增角色'
      this.addFormData = {
        roleId: '',
        roleKey: '',
        roleName: '',
        roleMenu: [],
        roleState: '1'
      }
      this.dialogVisible = true
    },
    editData(row) {
      this.dialogTitle = '修改角色'
      this.addFormData = JSON.parse(JSON.stringify(row))
      // todo
      this.dialogVisible = true
    },
    confrimMenu() {
      this.$refs.addFormRef.validate((valid) => {
        if (valid) {
          console.log(this.addFormDataFormat);
          // roleSave(this.addFormData).then((res) => {
          //   if (res.code === '000000') this.$message.success(res.message)
          // }).catch((err) => {
          //   console.error(err)
          // }).finally(() => {
          //   this.dialogVisible = false
          //   this.searchData()
          // })
        }
      })
    },
    deleteData(row) {
      this.$confirm('确定要删除这条内容吗？', '提示', {
        type: 'warning',
      }).then(() => {
        roleDelete({ roleId: row.roleId }).then((res) => {
          if (res.code === '000000') this.$message.success(res.message)
        }).catch((err) => {
          console.error(err)
        }).finally(() => {
          this.searchData()
        })
      }).catch(() => {
        // empty
      })
    },
  }
}
</script>

<style lang="scss" scoped>
v-deep .el-table__expand-icon {
  display: none !important;
}
</style>