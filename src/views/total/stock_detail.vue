<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.item_name" placeholder="输入关键词" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter"/>
      <el-input v-model="listQuery.item_class" placeholder="输入规格" style="width: 200px;" class="filter-item"/>
      <el-input v-model="listQuery.weight" placeholder="输入重量" style="width: 200px;" class="filter-item"/>
      <!--<el-select v-model="listQuery.stockType" placeholder="仓库类型" clearable style="width: 120px" class="filter-item">
        <el-option
          label="私库"
          value="1"
        />
        <el-option
          label="公库"
          value="2"
        />
      </el-select>-->
      <!--<el-select v-model="listQuery.area_id" placeholder="请选择仓库" clearable style="width: 120px" class="filter-item" filterable>
        <el-option
          v-for="item in wareList"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>-->
      <el-select v-model="listQuery.store_id" filterable placeholder="请选择商户" class="filter-item">
        <el-option
          v-for="item in storeList"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
      <el-select v-model="listQuery.type" placeholder="出入类型" clearable style="width: 120px" class="filter-item">
        <el-option
          label="入库"
          value="1"
        />
        <el-option
          label="出库"
          value="2"
        />
      </el-select>
      <!--<el-select v-model="listQuery.store_id" placeholder="商户筛选" clearable style="width: 120px" filterable class="filter-item">
        <el-option
          v-for="item in storeList"
          :key="item.value"
          :label="item.label"
          :value="item.value"/>
      </el-select>-->
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">{{ $t('table.search') }}</el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-delete" @click="handleEmpty">清空</el-button>
      <el-button v-waves :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-download" @click="handleDownload">{{ $t('table.export') }}</el-button>
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
      <el-table-column label="编号" prop="id" sortable="custom" align="center" width="65">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="出入时间" prop="add_time" width="130px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.access_time | parseTime('{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="物料名称" prop="item_name" width="250px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.item_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="类型" prop="item_type_name" width="100px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.item_type_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="物料规格" prop="item_class" width="150px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.item_class }}</span>
        </template>
      </el-table-column>
      <el-table-column label="物料重量" prop="weight" width="100px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.weight }}</span>
        </template>
      </el-table-column>
      <el-table-column label="出入数量" prop="access_number" width="90px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.access_number }}</span>
        </template>
      </el-table-column>
      <el-table-column label="当前库存" prop="stock_total" width="90px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.stock_total }}</span>
        </template>
      </el-table-column>
      <el-table-column label="类型" prop="type_name" width="90px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.type_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="标签" prop="type_name" width="90px" align="center">
        <template slot-scope="scope">
          <span>{{ detailStatus[scope.row.transfer_status] }}</span>
        </template>
      </el-table-column>
      <el-table-column label="商户" prop="store_name" width="130px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.store_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="仓库类型" prop="stock_type_name" width="100px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.stock_type_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="仓库" prop="ware_name" width="150px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.ware_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="出入单号" prop="inbound_code" width="170px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.inbound_code }}</span>
        </template>
      </el-table-column>
      <el-table-column label="标签" prop="order_id" width="100px" align="center">
        <template slot-scope="scope">
          <span>{{ label[scope.row.label] }}</span>
        </template>
      </el-table-column>
      <!--<el-table-column :label="$t('table.actions')" align="center" width="230" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handleUpdate(scope.row)">{{ $t('table.edit') }}</el-button>
        </template>
      </el-table-column>-->
    </el-table>
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
import { fetchDetailList } from '@/api/stocktotal'
import waves from '@/directive/waves' // Waves directive addWare
import { parseTime } from '@/utils'
import { getStoreWareAreaList, getStoreSelectBinding } from '@/api/store'
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
      storeList: [], // 商户信息
      wareList: [], // 获取仓库信息筛选
      detailStatus: { '1': '正常', '2': '移库' },
      label: { '1': '入库', '2': '出库', '3': '移库', '4': '盘盈', '5': '盘亏', '6': '调货' },
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
        stockType: '',
        type: '',
        area_id: '',
        store_id: '',
        item_name: '',
        sort: 'desc',
        item_class: '',
        weight: ''
      },
      rules: {
      },
      // 导出不能重复点两次
      downloadLoading: false
    }
  },
  created() {
    this.getList()
    this.getWare()
    this.getStoreSelectBinding()
  },
  methods: {
    getList() {
      this.listLoading = true
      this.listQuery.uid = this.user.uid
      fetchDetailList(this.listQuery).then(response => {
        // console.log(response.data.arr)
        this.list = response.data.arr
        this.total = response.data.count
        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false
        }, 0)
      })
    },
    // 获取仓库
    getWare() {
      getStoreWareAreaList(this.user.uid).then(response => {
        this.wareList = response.data
      })
    },
    // 分页
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
      if (prop === 'id') {
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
        stockType: '',
        type: '',
        area_id: '',
        store_id: '',
        item_name: '',
        sort: 'desc',
        item_class: '',
        weight: ''
      }
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
    // 导出
    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['物料名', '类型', '规格', '重量kg', '出入量', '类型', ' 商户', '仓库类型', '仓库', '出入单号', '出入时间']
        const filterVal = ['item_name', 'item_type_name', 'item_class', 'weight', 'access_number', 'type_name', 'store_name', 'stock_type_name', 'ware_name', 'inbound_code', 'access_time']
        const data = this.formatJson(filterVal, this.list)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: '库存详情'
        })
        this.downloadLoading = false
      })
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => {
        if (j === 'access_time') {
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
