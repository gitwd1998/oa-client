<template>
  <div class="scroll-wrap">
    <div class="search-wrap">
      <el-form ref="searchFormRef" :model="searchFormData" inline label-width="auto" label-suffix=":">
        <el-form-item label="用户标识" prop="userKey">
          <el-input v-model="searchFormData.userKey" clearable />
        </el-form-item>
        <el-form-item label="用户名称" prop="userName">
          <el-input v-model="searchFormData.userName" clearable />
        </el-form-item>
        <el-form-item label="启用状态" prop="userState">
          <el-select v-model="searchFormData.userState" clearable>
            <el-option v-for="option in dict.values.status" :key="option.value" :label="option.label" :value="option.value" />
          </el-select>
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
      <el-table ref="tableRef" :data="tableData" height="100%">
        <el-table-column label="用户标识" prop="userKey" />
        <el-table-column label="用户名称" prop="userName" />
        <el-table-column label="用户密码" prop="password" />
        <el-table-column label="启用状态" prop="userState" width="100" :formatter="(row) => dict.label.status[row.userState]" />
        <el-table-column label="操作" width="80">
          <template #default="{ row }">
            <el-button link type="warning" icon="Edit" @click.stop="editData(row)" />
            <el-button link type="danger" icon="Delete" @click.stop="deleteData(row)" />
          </template>
        </el-table-column>
        <template #empty>
          <el-empty />
        </template>
      </el-table>
    </div>
    <div class="pagination-wrap">
      <my-pagination
        v-if="pageData.total"
        v-model:current-page="pageData.pageNum"
        v-model:page-size="pageData.pageSize"
        :total="pageData.total"
        @change="queryTableData"
      />
    </div>
    <el-dialog v-model="dialogVisible" :title="dialogTitle">
      <el-form ref="addFormRef" :model="addFormData" :rules="addFormRules" label-width="auto" label-suffix=":">
        <el-form-item ref="userKey" label="用户标识" prop="userKey">
          <el-input v-model="addFormData.userKey" :disabled="!!addFormData.userId" clearable maxlength="100" show-word-limit />
        </el-form-item>
        <el-form-item ref="userName" label="用户名称" prop="userName">
          <el-input v-model="addFormData.userName" clearable maxlength="100" show-word-limit />
        </el-form-item>
        <el-form-item ref="password" label="用户密码" prop="password">
          <el-input v-model="addFormData.password" clearable maxlength="100" show-word-limit />
        </el-form-item>
        <el-form-item ref="userState" label="启用状态" prop="userState">
          <el-radio-group v-model="addFormData.userState">
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
import { userList, userSave, userDelete } from '@/apis/user'
export default {
  name: 'UserAdmin',
  dicts: ['visible', 'status', 'user_type'],
  data() {
    return {
      searchFormData: {
        userKey: '',
        userName: '',
        userState: ''
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
        userId: '',
        userKey: '',
        userName: '',
        password: '',
        userState: ''
      },
      addFormRules: {
        userKey: [
          { required: true, message: '请输入用户标识', trigger: 'none', transform: (val) => val.trim() }
        ],
        userName: [
          { required: true, message: '请输入用户名称', trigger: 'none', transform: (val) => val.trim() }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'none' }
        ],
        userState: [
          { required: true, message: '请选择用户状态', trigger: 'none' }
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
    },
    addFormDataFormat() {
      return {
        ...this.addFormData,
      }
    }
  },
  created() {
    this.queryTableData()
  },
  methods: {
    queryTableData() {
      const loading = this.$loading()
      userList(this.searchFormData, this.pageData).then((res) => {
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
    addData() {
      this.dialogTitle = '新增用户'
      this.addFormData = {
        userId: '',
        userKey: '',
        userState: '1'
      }
      this.dialogVisible = true
    },
    editData(row) {
      this.dialogTitle = '修改用户'
      this.addFormData = JSON.parse(JSON.stringify(row))
      // todo
      this.dialogVisible = true
    },
    confrimMenu() {
      this.$refs.addFormRef.validate((valid, fields) => {
        if (valid) {
          console.log(this.addFormDataFormat);
          userSave(this.addFormData).then((res) => {
            if (res.code === '000000') this.$message.success(res.message)
          }).catch((err) => {
            console.error(err)
          }).finally(() => {
            this.dialogVisible = false
            this.searchData()
          })
        } else {
          this.$refs.addFormRef.clearValidate()
          for (let field in fields) {
            this.$refs[field].validateState = 'error'
            this.$message.warning(fields[field][0].message)
            return
          }
        }
      })
    },
    deleteData(row) {
      this.$confirm('确定要删除这条内容吗？', '提示', {
        type: 'warning',
      }).then(() => {
        userDelete({ userId: row.userId }).then((res) => {
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