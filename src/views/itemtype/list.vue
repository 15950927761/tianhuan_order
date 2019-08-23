<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.item_type_name" placeholder="输入关键词" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter"/>
      <!--<el-select v-model="listQuery.importance" :placeholder="$t('table.importance')" clearable style="width: 90px" class="filter-item">-->
      <!--<el-option v-for="item in importanceOptions" :key="item" :label="item" :value="item"/>-->
      <!--</el-select>-->
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">{{ $t('table.search') }}</el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-delete" @click="handleEmpty">清空</el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">{{ $t('table.add') }}</el-button>
      <!--:data="list"<el-button v-waves :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-download" @click="handleDownload">{{ $t('table.export') }}</el-button>-->
    </div>

    <el-table
      v-loading="listLoading"
      :key="tableKey"
      :data="list.slice((currentPage-1)*pagesize,currentPage*pagesize)"
      border
      fit
      highlight-current-row
      style="width: 100%;"
      @sort-change="sortChange">
      <el-table-column label="编号" prop="item_type_id" sortable="custom" align="center" width="65">
        <template slot-scope="scope">
          <span>{{ scope.row.item_type_id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="物料类型" prop="item_type_name" width="150px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.item_type_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="备注" prop="memo" width="150px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.memo }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.actions')" align="center" width="230" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handleUpdate(scope.row)">{{ $t('table.edit') }}</el-button>
          <!--<el-button size="mini" type="success" @click="handleModifyStatus(scope.row,'tickertape')">{{ $t('table.tickertape') }}-->
          <!--</el-button>-->
          <!--<el-button size="mini" type="danger" @click="handleModifyStatus(scope.row,'deleted')">{{ $t('table.delete') }}-->
          <!--</el-button>-->
        </template>
      </el-table-column>
    </el-table>

    <!--<pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />-->
    <el-pagination
      :total="total"
      class="fy"
      background
      layout="prev, pager, next"
      @current-change="current_change"
    />
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="right" label-width="120px" style="width: 500px; margin-left:50px;">
        <el-form-item label="物料类型" prop="item_type_name">
          <el-input v-model="temp.item_type_name" placeholder="请输入类型名称"/>
        </el-form-item>
        <el-form-item label="类型备注">
          <el-input :autosize="{ minRows: 2, maxRows: 4}" v-model="temp.memo" type="textarea" placeholder="备注"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">{{ $t('table.cancel') }}</el-button>
        <el-button :disabled="isDisabled" type="primary" @click="dialogStatus==='create'?createData():updateData()">{{ $t('table.confirm') }}</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import { addEditItemType, fetchItemTypeList } from '@/api/itemtype'
import waves from '@/directive/waves' // Waves directive addWare
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination

export default {
  name: 'ComplexTable',
  components: { Pagination },
  directives: { waves },
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'info',
        deleted: 'danger'
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      pagesize: 10, // 每页的数据条数
      currentPage: 1, // 默认开始页面
      isDisabled: false,
      user: JSON.parse(localStorage.getItem('user')),
      // 表格默认键值
      tableKey: 0,
      // 数据列表
      list: [],
      // 默认数据总数
      total: 0,
      // 定时请求
      listLoading: true,
      // 搜索条件
      listQuery: {
        item_type_name: '',
        sort: 'desc'
      },
      // 下拉自定义条件
      importanceOptions: [1, 2, 3],
      // calendarTypeOptions,
      // 表格颜色状态标识
      statusOptions: ['published', 'draft', 'deleted'],
      // 提交数据
      temp: {
        item_type_name: '',
        memo: ''
      },
      // 弹窗显示
      dialogFormVisible: false,
      // 创建 修改 弹出不同的框 状态
      dialogStatus: '',
      textMap: {
        update: 'Edit',
        create: 'Create'
      },
      // dialogPvVisible: false,
      // pvData: [],
      rules: {
        item_type_name: [{ required: true, message: '物料类型不能为空', trigger: 'blur' }]
      },
      // 导出不能重复点两次
      downloadLoading: false
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      fetchItemTypeList(this.listQuery).then(response => {
        this.list = response.data.arr
        this.total = response.data.count
        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false
        }, 0)
      })
    },
    current_change: function(currentPage) {
      this.currentPage = currentPage
    },
    handleFilter() {
      this.currentPage = 1
      this.getList()
    },
    // 凭条
    handleModifyStatus(row, status) {
      this.$message({
        message: '操作成功',
        type: 'success'
      })
      row.status = status
    },
    // 排序条件 发生改变回调函数
    sortChange(data) {
      const { prop, order } = data
      if (prop === 'item_type_id') {
        this.sortByID(order)
      }
    },
    sortByID(order) {
      if (order === 'ascending') {
        this.listQuery.sort = 'asc'
      } else {
        this.listQuery.sort = 'desc'
      }
      this.handleFilter()
    },
    // 清空添加信息
    resetTemp() {
      this.temp = {
        item_type_name: '',
        memo: ''
      }
    },
    // 清空搜索条件
    handleEmpty() {
      this.listQuery = {
        item_type_name: '',
        sort: 'desc'
      }
    },
    handleCreate() {
      this.resetTemp() // 清空添加信息
      this.dialogStatus = 'create' // 赋值添加弹框打开
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    // 添加操作
    createData() {
      this.isDisabled = true
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.temp.item_type_id = 0
          addEditItemType(this.temp).then((res) => {
            const data = res.data
            if (data.code === 1) {
              this.$message({
                message: data.msg,
                type: 'success'
              })
              this.getList()
            } else {
              this.$message.error('数据添加失败')
            }
            this.dialogFormVisible = false
          })
        }
        this.isDisabled = false
      })
    },
    // 修改弹框
    handleUpdate(row) {
      this.temp = row
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    // 修改操作
    updateData() {
      this.isDisabled = true
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          addEditItemType(this.temp).then((res) => {
            const data = res.data
            if (data.code === 1) {
              this.$message({
                message: data.msg,
                type: 'success'
              })
              this.getList()
            } else {
              this.$message.error(data.msg)
            }
            this.dialogFormVisible = false
            // this.list.unshift(this.temp)
          })
        }
        this.isDisabled = false
      })
    },
    // 修改
    handleDelete(row) {
      this.$notify({
        title: '成功',
        message: '删除成功',
        type: 'success',
        duration: 2000
      })
      const index = this.list.indexOf(row)
      this.list.splice(index, 1)
    },

    // 导出
    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['timestamp', 'title', 'type', 'importance', 'status']
        const filterVal = ['timestamp', 'title', 'type', 'importance', 'status']
        const data = this.formatJson(filterVal, this.list)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: 'table-list'
        })
        this.downloadLoading = false
      })
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => {
        if (j === 'timestamp') {
          return parseTime(v[j])
        } else {
          return v[j]
        }
      }))
    }
  }
}
</script>
<style>
  .fy{
    text-align:center;
    margin-top:30px;
  }
</style>
