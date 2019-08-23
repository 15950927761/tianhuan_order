<template>
  <div class="app-container">
    <div class="filter-container">
      <el-select v-model="listQuery.store_id" filterable placeholder="请选择商户" class="filter-item">
        <el-option
          v-for="item in storeList"
          :key="item.value"
          :label="item.label"
          :value="item.value"/>
      </el-select>
      <el-input v-model="listQuery.item_name" placeholder="输入关键词" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter"/>
      <el-input v-model="listQuery.item_class" placeholder="输入规格" style="width: 200px;" class="filter-item"/>
      <el-input v-model="listQuery.weight" placeholder="输入重量" style="width: 200px;" class="filter-item"/>
      <el-date-picker
        :picker-options="pickerOptions2"
        v-model="listQuery.access_time"
        type="datetimerange"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        align="right"
        value-format="timestamp"
        style="vertical-align:top;"
      />
      <el-button v-waves type="primary" icon="el-icon-search" @click="handleFilter">{{ $t('table.search') }}</el-button>
      <el-button v-waves type="primary" icon="el-icon-search" @click="handleEmpty">清空</el-button>
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
      <el-table-column label="序号" prop="stock_id" sortable="custom" align="center" width="80">
        <template slot-scope="scope">
          <span>{{ scope.row.stock_id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="物料名" prop="item_name" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.item_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="重量" prop="weight" width="100px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.weight }}</span>
        </template>
      </el-table-column>
      <el-table-column label="规格" prop="item_class" width="100px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.item_class }}</span>
        </template>
      </el-table-column>
      <el-table-column label="期初" prop="start_term" width="90px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.start_term }}</span>
        </template>
      </el-table-column>
      <el-table-column label="期入" prop="in_between" width="90px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.in_between }}</span>
        </template>
      </el-table-column>
      <el-table-column label="期出" prop="out_between" width="90px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.out_between }}</span>
        </template>
      </el-table-column>
      <el-table-column label="期末" prop="end_term" width="90px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.end_term }}</span>
        </template>
      </el-table-column>
      <el-table-column label="仓库" prop="ware_name" width="150px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.ware_name }}</span>
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
import { fetchStockTotalList } from '@/api/stocktotal'
import waves from '@/directive/waves' // Waves directive addWare
// import { parseTime } from '@/utils'
import { getStoreSelectBinding } from '@/api/store'
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
      // 默认数据总数
      total: 0,
      // 定时请求
      listLoading: false,
      // 搜索条件,
      listQuery: {
        access_time: '',
        store_id: '',
        sort: 'desc',
        item_name: '',
        item_class: '',
        weight: ''
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
    // this.getList()
    this.getStoreSelectBinding()
  },
  methods: {
    getList() {
    },
    // 获取商户关联账号
    getStoreSelectBinding() {
      getStoreSelectBinding(this.user.uid).then(response => {
        this.storeList = response.data
        if (this.storeList.length === 1) {
          this.listQuery.store_id = this.user.uid
        }
      })
    },
    current_change: function(currentPage) {
      this.currentPage = currentPage
    },
    handleFilter() {
      if (!this.listQuery.store_id || !this.listQuery.access_time) {
        this.$message.error('商户和时间必填！')
        return
      }
      this.currentPage = 1
      fetchStockTotalList(this.listQuery).then(response => {
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
    // 清空搜索条件
    handleEmpty() {
      this.listQuery = {
        access_time: '',
        store_id: '',
        sort: 'desc',
        item_name: '',
        item_class: '',
        weight: ''
      }
    },
    // 导出
    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['物料名', '规格', '重量kg', '期初', '期入', '期出', '期末', '仓库库号']
        const filterVal = ['item_name', 'item_class', 'weight', 'start_term', 'in_between', 'out_between', 'end_term', 'ware_name']
        const data = this.formatJson(filterVal, this.list)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: '库存统计'
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
