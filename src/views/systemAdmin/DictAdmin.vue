<template>
  <div class="scroll-wrap" v-loading="loading">
    <div class="search-wrap">
      <el-form :ref="el => refMap.searchFormRef = el" :model="searchFormData" inline>
        <el-form-item label="字典标识" prop="dictKey">
          <el-input v-model="searchFormData.dictKey" clearable />
        </el-form-item>
        <el-form-item label="字典名称" prop="dictName">
          <el-input v-model="searchFormData.dictName" clearable />
        </el-form-item>
        <el-form-item label="字典标签" prop="dictTag">
          <el-input v-model="searchFormData.dictTag" clearable />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="searchData">搜索</el-button>
          <el-button @click="refMap.searchFormRef.resetFields()">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="operate-wrap">
      <el-button type="primary" @click="addDict">新增</el-button>
    </div>
    <div class="table-wrap">
      <el-table :data="dictTableData" height="100%" @filter-change="filterMethod" @row-click="rowClick">
        <el-table-column label="字典标识" prop="dictKey" />
        <el-table-column label="字典名称" prop="dictName" />
        <el-table-column label="标签" prop="dictTag">
          <template #default="{ row }">
            <el-tag v-if="row.dictTag">{{ row.dictTag }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          label="启用状态"
          prop="dictState"
          width="100"
          :formatter="(row) => dict.label.status[row.dictState]"
          column-key="dictState"
          :filters="dict.values.status.map(item => ({ text: item.label, value: item.value }))"
        />
        <el-table-column label="操作" width="80">
          <template #default="{ row }">
            <el-button link type="warning" icon="Edit" @click.stop="editDict(row)" />
            <el-button link type="danger" icon="Delete" @click.stop="deleteDict(row)" />
          </template>
        </el-table-column>
        <template #empty>
          <el-empty />
        </template>
      </el-table>
    </div>
    <div class="pagination-wrap">
      <my-pagination
        v-if="dictPageData.total"
        v-model:current-page="dictPageData.pageNum"
        v-model:page-size="dictPageData.pageSize"
        :total="dictPageData.total"
        @change="queryDictList"
      />
    </div>
  </div>
  <el-dialog v-model="dialogVisible" :title="dialogTitle">
    <el-form :ref="el => refMap.addDictFormRef = el" :model="addFormData" :rules="addFormRules">
      <el-form-item label="字典标识" prop="dictKey">
        <el-input v-model="addFormData.dictKey" :disabled="!!addFormData.dictId" clearable maxlength="100" show-word-limit />
      </el-form-item>
      <el-form-item label="字典名称" prop="dictName">
        <el-input v-model="addFormData.dictName" clearable maxlength="100" show-word-limit />
      </el-form-item>
      <el-form-item label="字典标签" prop="dictTag">
        <el-input v-model="addFormData.dictTag" clearable maxlength="100" show-word-limit />
      </el-form-item>
      <el-form-item label="启用状态" prop="dictState">
        <el-radio-group v-model="addFormData.dictState">
          <el-radio v-for="option in dict.values.status" :key="option.value" :label="option.value">{{ option.label }}</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="dialogVisible = false">取消</el-button>
      <el-button type="primary" @click="confrimDict">确定</el-button>
    </template>
  </el-dialog>
  <el-drawer v-model="drawerVisible" :title="drawerTitle" @open="queryDictOptionList">
    <el-form :ref="el => refMap.addDictOptionFormRef = el" :model="dictOptionFormData" inline-message>
      <el-form-item prop="dictOptionTableData" :rules="[{ required: true, message: '请添加字典选项', trigger: 'none' }]">
        <el-table class="draggable" :data="dictOptionTableDataFilter" row-key="dictOptionId">
          <el-table-column width="50" align="center">
            <template #header>
              <el-button link type="primary" icon="Plus" @click="addDictOption" />
            </template>
            <el-button class="draggable-handle" link icon="Sort" />
          </el-table-column>
          <el-table-column label="键" prop="dictOptionValue">
            <template #default="{ row, column, $index }">
              <el-form-item :prop="`dictOptionTableData.${indexFormat($index) - 1}.${column.property}`" :rules="[{ required: true, message: '请输入键', trigger: 'none' }]">
                <el-input v-model="row.dictOptionValue" clearable show-word-limit maxlength="100" />
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column label="值" prop="dictOptionLabel">
            <template #default="{ row, column, $index }">
              <el-form-item :prop="`dictOptionTableData.${indexFormat($index) - 1}.${column.property}`" :rules="[{ required: true, message: '请输入键', trigger: 'none' }]">
                <el-input v-model="row.dictOptionLabel" clearable show-word-limit maxlength="100" />
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column label="启用状态" prop="dictOptionState" width="100">
            <template #default="{ row, column, $index }">
              <el-form-item :prop="`dictOptionTableData.${indexFormat($index) - 1}.${column.property}`">
                <el-switch v-model="row.dictOptionState" inline-prompt active-value="1" inactive-value="0" active-text="启用" inactive-text="禁用" />
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="60">
            <template #default="{ row, $index }">
              <el-button link type="danger" icon="Delete" @click.stop="deleteDictOption(row, (dictOptionPageData.pageNum - 1) * dictOptionPageData.pageSize + $index)" />
            </template>
          </el-table-column>
          <template #empty>
            <el-empty />
          </template>
        </el-table>
      </el-form-item>
    </el-form>
    <template #footer>
      <div style="display: flex; justify-content: space-between;">
        <div>
          <my-pagination
            v-if="dictOptionFormData.dictOptionTableData.length"
            v-model:current-page="dictOptionPageData.pageNum"
            v-model:page-size="dictOptionPageData.pageSize"
            :total="dictOptionFormData.dictOptionTableData.length"
          />
        </div>
        <div>
          <el-button @click="drawerVisible = false">取消</el-button>
          <el-button type="primary" @click="confirmDictOption">确定</el-button>
        </div>
      </div>
    </template>
  </el-drawer>
</template>

<script>
export default {
  dicts: ["status"]
}
</script>

<script setup>
  import { dictList, dictSave, dictDelete, dictOptionList, dictOptionBatch } from "@/apis/dict";
  import { ElLoading, ElMessage, ElMessageBox } from "element-plus";
  import { computed, onMounted, reactive, ref } from "vue";
  import Sortable from "sortablejs";

  
  const refMap = reactive({});
  const loading = ref(false);
  const dialogVisible = ref(false);
  const dialogTitle = ref("");
  const drawerVisible = ref(false);
  const drawerTitle = ref("");
  const drawerKey = ref("");
  const searchFormData = reactive({
    dictKey: "",
    dictName: "",
    dictTag: "",
    dictState: "",
  });
  const addFormData = reactive({
    dictId: "",
    dictKey: "",
    dictName: "",
    dictTag: "",
    dictState: "1",
  });
  const addFormRules = reactive({
    dictKey: [
      { required: true, message: "请输入字典标识", trigger: "none", transform: (val) => val.trim() }
    ],
    dictName: [
      { required: true, message: "请输入字典名称", trigger: "none", transform: (val) => val.trim() }
    ]
  });
  const dictPageData = reactive({
    pageNum: 1,
    pageSize: 20,
    total: 0
  });
  const dictTableData = ref([]);
  const dictOptionFormData = reactive({
    dictOptionTableData: []
  });
  const dictOptionTableDataNeedDelete = ref([]);
  const dictOptionTableDataFilter = computed(() => dictOptionFormData.dictOptionTableData.slice((dictOptionPageData.pageNum - 1) * dictOptionPageData.pageSize, dictOptionPageData.pageNum * dictOptionPageData.pageSize));
  const dictOptionPageData = reactive({
    pageNum: 1,
    pageSize: 20
  });

  const queryDictList = () => {
    loading.value = true;
    dictList(searchFormData, dictPageData).then((res) => {
      if (res.code === "000000") {
        dictTableData.value = res.data?.list || [];
        dictPageData.pageNum = res.data?.pageNum
        dictPageData.pageSize = res.data?.pageSize
        dictPageData.total = res.data?.total
      }
    }).catch((err) => {
      console.error(err);
    }).finally(() => {
      loading.value = false;
    });
  }
  const searchData = () => {
    dictPageData.pageNum = 1;
    dictPageData.pageSize = 20;
    dictPageData.total = 0;
    queryDictList();
  }
  const filterMethod = (value) => {
    searchFormData.dictState = value.dictState.length === 1 ? value.dictState[0] : ''
    searchData()
  }
  const addDict = () => {
    dialogTitle.value = "新增字典"
    addFormData.dictId = "";
    addFormData.dictKey = "";
    addFormData.dictName = "";
    addFormData.dictTag = "";
    dialogVisible.value = true;
  }
  const editDict = (row) => {
    dialogTitle.value = "修改字典"
    addFormData.dictId = row.dictId
    addFormData.dictKey = row.dictKey;
    addFormData.dictName = row.dictName;
    addFormData.dictTag = row.dictTag;
    addFormData.dictState = row.dictState;
    dialogVisible.value = true;
  }
  const confrimDict = () => {
    refMap.addDictFormRef.validate((valid, fields) => {
      if (valid) {
        dictSave(addFormData).then((res) => {
          if (res.code === "000000") ElMessage.success(res.message);
        }).catch((err) => {
          console.error(err);
        }).finally(() => {
          dialogVisible.value = false;
          searchData();
        });
      }
    });
  }
  const deleteDict = (row) => {
    ElMessageBox.confirm("确定要删除这条内容吗？", "提示", {
      type: "warning",
    }).then(() => {
      dictDelete({ dictId: row.dictId }).then((res) => {
        if (res.code === "000000") ElMessage.success(res.message);
      }).catch((err) => {
        console.error(err);
      }).finally(() => {
        searchData();
      });
    }).catch(() => {
      // empty
    });
  }
  const rowClick = (row) => {
    drawerTitle.value = row.dictName;
    drawerKey.value = row.dictKey;
    drawerVisible.value = true;
  }
  const queryDictOptionList = () => {
    dictOptionFormData.dictOptionTableData = [];
    dictOptionPageData.pageNum = 1;
    dictOptionPageData.pageSize = 20;
    const loading = ElLoading.service({
      target: ".el-drawer"
    });
    dictOptionList({ dictKey: drawerKey.value }).then((res) => {
      if (res.code === "000000") {
        dictOptionFormData.dictOptionTableData = res.data || []
        // 让dictOptionFormData.dictOptionTableData按照dictOptionTableData的顺序排
        // dictOptionFormData.dictOptionTableData.sort((prev, next) => {
        //   let prevIndex = dictOptionTableData.value.findIndex((row) => row.dictOptionId === prev.dictOptionId)
        //   let nextIndex = dictOptionTableData.value.findIndex((row) => row.dictOptionId === next.dictOptionId)
        //   if (prevIndex === -1 || nextIndex === -1) return 0;
        //   return prevIndex - nextIndex;
        // });
        rowDrop(); // 支持拖拽
      }
    }).catch((err) => {
      console.error(err);
    }).finally(() => {
      loading.close();
    });
  }
  const indexFormat = (index) => {
    return index + (dictOptionPageData.pageNum - 1) * dictOptionPageData.pageSize + 1
  }
  const addDictOption = () => {
    refMap.addDictOptionFormRef.clearValidate();
    let item = {
      dictKey: drawerKey.value,
      dictOptionValue: "",
      dictOptionLabel: "",
      dictOptionState: "1",
      dictOptionSort: dictOptionFormData.dictOptionTableData.length
    }
    dictOptionFormData.dictOptionTableData.push(item);
    dictOptionPageData.pageNum = Math.ceil(dictOptionFormData.dictOptionTableData.length / dictOptionPageData.pageSize);
  }
  const deleteDictOption = (row, index) => {
    dictOptionFormData.dictOptionTableData.splice(index, 1);
    row.dictOptionId && dictOptionTableDataNeedDelete.value.push({
      ...row,
      needDelete: true
    });
    dictOptionFormData.dictOptionTableData.slice(index).forEach((row) => {
      row.dictOptionSort--;
    });
  }
  const confirmDictOption = () => {
    refMap.addDictOptionFormRef.validate((valid) => {
      if (valid) {
        const insert = [];
        const update = [];
        for (let index = 0; index < dictOptionFormData.dictOptionTableData.length; index++) {
          const row = dictOptionFormData.dictOptionTableData[index];
          if (dictOptionFormData.dictOptionTableData.findIndex(temp => temp.dictOptionValue === row.dictOptionValue) !== index) return ElMessage.warning(`第${index + 1}行 ${row.dictOptionValue} 重复`);
          if (row.dictOptionId) update.push(row);
          else insert.push(row);
        }
        dictOptionBatch([insert, update, dictOptionTableDataNeedDelete.value]).then((res) => {
          if (res.code === "000000") ElMessage.success(res.message);
        }).catch((err) => {
          console.error(err);
        }).finally(() => {
          drawerVisible.value = false;
        });
      }
    });
  }
  const rowDrop = () => {
    Sortable.create(document.querySelector(".draggable .el-table__body-wrapper tbody"), {
      handle: ".draggable .draggable-handle",
      draggable: ".draggable .el-table__row",
      animation: 200,
      onEnd({ oldIndex, newIndex }) {
        if (oldIndex === newIndex) return;
        dictOptionFormData.dictOptionTableData.splice(newIndex, 0, dictOptionFormData.dictOptionTableData.splice(oldIndex, 1)[0]);
        let range = [oldIndex, newIndex].sort((prev, next) => prev - next);
        range[1]++;
        dictOptionFormData.dictOptionTableData.slice(...range).forEach((row, index) => {
          row.dictOptionSort = (dictOptionPageData.pageNum - 1) * dictOptionPageData.pageSize + range[0] + index;
        })
      }
    });
  }

  onMounted(() => {
    queryDictList();
  });
</script>