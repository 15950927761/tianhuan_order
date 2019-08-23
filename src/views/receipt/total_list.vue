<template>
  <div class="app-container">
    <div class="filter-container">
      <el-select v-model="listQuery.customer_id" filterable placeholder="请选择客户">
        <el-option
          v-for="item in customerList"
          :key="item.value"
          :label="item.label"
          :value="item.value"/>
      </el-select>
      <el-date-picker
        :picker-options="pickerOptions2"
        v-model="listQuery.access_time"
        type="datetimerange"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        align="right"
        value-format="timestamp"/>
      <el-button v-waves type="primary" icon="el-icon-search" @click="handleFilter">{{ $t('table.search') }}</el-button>
      <el-button v-waves :loading="downloadLoading" type="primary" icon="el-icon-download" @click="handleDownload">{{ $t('table.export') }}</el-button>
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
      <el-table-column label="序号" type="index" prop="customer_id" sortable="custom" align="center" width="80">
        <!--<template slot-scope="scope">-->
        <!--<span>{{ scope.row.stock_id }}</span>-->
        <!--</template>-->
      </el-table-column>
      <el-table-column label="客户名称" prop="item_name" align="center" width="250px">
        <template slot-scope="scope">
          <span>{{ scope.row.customer_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="应收款(货款)" prop="receivable" width="120px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.receivable }}</span>
        </template>
      </el-table-column>
      <el-table-column label="实收款" prop="receipts" width="120px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.receipts }}</span>
        </template>
      </el-table-column>
      <el-table-column label="退货款" prop="refund" width="120px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.refund }}</span>
        </template>
      </el-table-column>
      <el-table-column label="应付款(采购)" prop="meet" width="120px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.meet }}</span>
        </template>
      </el-table-column>
      <el-table-column label="实付款" prop="payment" width="120px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.payment }}</span>
        </template>
      </el-table-column>
      <el-table-column label="欠收款" prop="arrears" width="120px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.arrears }}</span>
        </template>
      </el-table-column>
      <el-table-column label="备注" prop="memo" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.memo }}</span>
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

  </div>
</template>

<script>
import waves from '@/directive/waves' // Waves directive addWare
// import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
import { receiptsTotal } from '@/api/receipts'
import { getCustomerStore } from '@/api/customer'

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
  inject: ['reload'],
  data() {
    return {
      storeList: [],
      pagesize: 10, // 每页的数据条数
      currentPage: 1, // 默认开始页面
      user: JSON.parse(localStorage.getItem('user')),
      // 表格默认键值
      tableKey: 0,
      // 数据列表
      list: [],
      customerList: [],
      // 默认数据总数
      total: 0,
      // 定时请求
      listLoading: false,
      // 搜索条件,
      listQuery: {
        access_time: [],
        store_id: '',
        sort: 'desc',
        customer_id: ''
      },
      // 下拉自定义条件
      importanceOptions: [1, 2, 3],
      // calendarTypeOptions,
      // 表格颜色状态标识
      statusOptions: ['published', 'draft', 'deleted'],
      // 导出不能重复点两次
      downloadLoading: false,
      pickerOptions2: {
        shortcuts: [{
          text: '最近一周',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近一个月',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近三个月',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
            picker.$emit('pick', [start, end])
          }
        }]
      }
    }
  },
  created() {
    this.getCustomerStore()
  },
  methods: {
    getList() {
    },
    current_change: function(currentPage) {
      this.currentPage = currentPage
    },
    handleFilter() {
      if (!this.listQuery.customer_id) {
        this.$message.error('客户必选')
        return
      }
      this.currentPage = 1
      this.listQuery.store_id = this.user.uid
      receiptsTotal(this.listQuery).then(response => {
        this.list = response.data
        this.total = response.data.length
        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false
        }, 0)
      })
      // this.getList()
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
        this.customerList = response.data.customerTwoList
      })
    },
    // 排序条件 发生改变回调函数
    sortChange(data) {
      const { prop, order } = data
      if (prop === 'ware_id') {
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
    // 导出
    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['客户名称', '应收款(货款)', '实收款', '退货款', '应付款(采购)', '实付款', '欠收款', '备注']
        const filterVal = ['customer_name', 'receivable', 'receipts', 'refund', 'meet', 'payment', 'arrears', 'memo']
        const data = this.formatJson(filterVal, this.list)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: '款项统计'
        })
        this.downloadLoading = false
      })
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => {
        // if (j === 'timestamp') {
        //   return parseTime(v[j])
        // } else {
        return v[j]
        // }
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
