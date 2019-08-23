<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.receipts_code" placeholder="输入单据号" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter"/>
      <el-select v-model="listQuery.customer_id" placeholder="客户筛选" clearable style="width: 120px" filterable class="filter-item">
        <el-option
          v-for="item in customerList"
          :key="item.value"
          :label="item.label"
          :value="item.value"/>
      </el-select>
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
      <el-table-column label="编号" prop="receipts_id" sortable="custom" align="center" width="65">
        <template slot-scope="scope">
          <span>{{ scope.row.receipts_id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="收款单号" prop="receipts_code" width="180px" align="center">
        <template slot-scope="scope">
          <span>S{{ scope.row.receipts_code }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" prop="receipts_money" width="100px" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.status == 1"><el-tag type="success">{{ statusOptions[scope.row.status] }}</el-tag></span>
          <span v-else><el-tag type="info">{{ statusOptions[scope.row.status] }}</el-tag></span>
        </template>
      </el-table-column>
      <el-table-column label="制单人" prop="receipts_code" width="150px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.billerName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="制单时间" prop="add_time" width="150px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.add_time | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="客户" prop="customer_id" width="210px" align="center">
        <template slot-scope="scope">
          <span><el-tag>{{ scope.row.customerName }}</el-tag></span>
        </template>
      </el-table-column>
      <el-table-column label="付款方式" prop="collect_type" width="150px" align="center">
        <template slot-scope="scope">
          <span>{{ collectTypeName[scope.row.collect_type] }}</span>
        </template>
      </el-table-column>
      <el-table-column label="实收金额" prop="receipts_money" width="120px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.receipts_money }}</span>
        </template>
      </el-table-column>
      <el-table-column label="备注" prop="memo" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.memo }}</span>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.actions')" align="center" width="180" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button v-show="scope.row.status == 1" type="primary" size="mini" @click="handleUpdate(scope.row)">{{ $t('table.edit') }}</el-button>
          <el-button v-show="scope.row.status == 1" type="primary" size="mini" @click="receiptDelete(scope.row)">作废</el-button>
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
        <el-form-item label="款类型" prop="type">
          <el-select v-model="temp.type" filterable placeholder="请选择类型" size="mini">
            <el-option
              v-for="item in moneyType"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="客户" prop="customer_id">
          <el-select v-model="temp.customer_id" filterable placeholder="请选择客户" size="mini">
            <el-option
              v-for="item in customerSubimt"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="收款方式" prop="customer_id">
          <el-select v-model="temp.collect_type" filterable placeholder="请选择收款方式" size="mini">
            <el-option
              v-for="item in collectList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="实收金额" prop="receipts_money">
          <el-input v-model="temp.receipts_money" placeholder="请输入金额" type="number"/>
        </el-form-item>
        <el-form-item label="备注">
          <el-input :autosize="{ minRows: 2, maxRows: 4}" v-model="temp.memo" type="textarea" placeholder="备注"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">{{ $t('table.cancel') }}</el-button>
        <el-button :disabled="isDisabled" type="primary" @click="dialogStatus==='create'?createData():updateData()">{{ $t('table.confirm') }}</el-button>
      </div>
    </el-dialog>

    <!--<el-dialog :visible.sync="dialogPvVisible" title="Reading statistics">-->
    <!--<el-table :data="pvData" border fit highlight-current-row style="width: 100%">-->
    <!--<el-table-column prop="key" label="Channel"/>-->
    <!--<el-table-column prop="pv" label="Pv"/>-->
    <!--</el-table>-->
    <!--<span slot="footer" class="dialog-footer">-->
    <!--<el-button type="primary" @click="dialogPvVisible = false">{{ $t('table.confirm') }}阿萨飒飒</el-button>-->
    <!--</span>-->
    <!--</el-dialog>-->

  </div>
</template>

<script>
import { addEditReceipts, fetchReceiptsList, receiptDelete } from '@/api/receipts'
import { getCustomerStore } from '@/api/customer'
import waves from '@/directive/waves' // Waves directive addWare
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination'

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
        receipts_code: '',
        customer_id: '',
        sort: 'desc'
      },
      // 下拉自定义条件
      importanceOptions: [1, 2, 3],
      customerList: [],
      customerSubimt: [],
      // 收款方式
      collectList: [{
        value: '1',
        label: '转账'
      }, {
        value: '2',
        label: '现金'
      }, {
        value: '3',
        label: '汇款'
      }, {
        value: '4',
        label: '减免'
      }, {
        value: '5',
        label: '其他'
      }],
      // 款类型
      moneyType: [{
        value: '2',
        label: '实收'
      }, {
        value: '4',
        label: '实付'
      }],
      // calendarTypeOptions,
      // 表格颜色状态标识 收款方式1、转账2、现金3、汇款4、减免5、其他
      statusOptions: { '1': '正常', '2': '作废' },
      collectTypeName: { '1': '转账', '2': '现金', '3': '汇款', '4': '减免', '5': '其他' },
      // 提交数据
      temp: {
        customer_id: '',
        collect_type: '',
        receipts_money: '',
        memo: '',
        type: ''
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
        customer_id: [{ required: true, message: '客户必选!', trigger: 'change' }],
        collect_type: [{ required: true, message: '付款方式必选!', trigger: 'change' }],
        receipts_money: [{ required: true, message: '金额必填!', trigger: 'blur' }],
        type: [{ required: true, message: '类型必选', trigger: 'change' }]
      },
      // 导出不能重复点两次
      downloadLoading: false
    }
  },
  created() {
    this.getList()
    this.getCustomerStore()
  },
  methods: {
    getList() {
      this.listLoading = true
      this.listQuery.store_id = this.user.uid
      fetchReceiptsList(this.listQuery).then(response => {
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
    // 获取该商户客户信息
    getCustomerStore() {
      getCustomerStore(this.user.uid).then(response => {
        this.customerSubimt = response.data.customerOneList
        this.customerList = response.data.customerTwoList
      })
    },
    // 排序条件 发生改变回调函数
    sortChange(data) {
      const { prop, order } = data
      if (prop === 'receipts_id') {
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
        customer_id: '',
        collect_type: '',
        receipts_money: '',
        memo: '',
        type: ''
      }
    },
    // 清空搜索条件
    handleEmpty() {
      this.listQuery = {
        receipts_code: '',
        customer_id: '',
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
      if (this.temp.receipts_money < 0) {
        this.$message.error('金额不能为负数!')
        return
      }
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.temp.receipts_id = 0
          this.isDisabled = true
          this.temp.types = 9
          this.temp.label = '09'
          this.temp.store_id = this.user.uid
          addEditReceipts(this.temp).then((res) => {
            const data = res.data
            if (data.code === 1) {
              this.$message({
                message: data.msg,
                type: 'success'
              })
              setTimeout(() => {
                this.isDisabled = false
              }, 2000)
              this.getList()
            } else {
              this.$message.error(data.msg)
            }
            this.dialogFormVisible = false
          })
        }
      })
    },
    // 修改弹框
    handleUpdate(row) {
      this.temp = row
      this.temp.customer_id = row.customer_id
      this.temp.collect_type = String(row.collect_type)
      this.temp.type = String(row.type)
      this.temp.inType = row.type
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    // 修改操作
    updateData() {
      if (this.temp.receipts_money < 0) {
        this.$message.error('金额不能为负数!')
        return
      }
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.isDisabled = true
          addEditReceipts(this.temp).then((res) => {
            const data = res.data
            if (data.code === 1) {
              this.$message({
                message: data.msg,
                type: 'success'
              })
              setTimeout(() => {
                this.isDisabled = false
              }, 2000)
              this.getList()
            } else {
              this.$message.error(data.msg)
            }
            this.dialogFormVisible = false
            // this.list.unshift(this.temp)
          })
        }
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
    // 单子作废、
    receiptDelete(row) {
      receiptDelete(row).then((res) => {
        const data = res.data
        if (data.code === 1) {
          this.$message({
            message: data.msg,
            type: 'success'
          })
          setTimeout(() => {
            this.isDisabled = false
          }, 2000)
          this.getList()
        } else {
          this.$message.error(data.msg)
        }
      })
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
