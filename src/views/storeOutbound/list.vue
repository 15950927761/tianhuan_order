<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.outbound_code" placeholder="输入单据号" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter"/>
      <el-select v-model="listQuery.status" placeholder="单据状态" clearable style="width: 120px" class="filter-item">
        <el-option label="待打印" value="1"/>
        <el-option label="待出库" value="2"/>
        <el-option label="已出库" value="3"/>
        <el-option label="已作废" value="4"/>
      </el-select>
      <el-select v-model="listQuery.customer_id" placeholder="客户筛选" clearable style="width: 120px" class="filter-item">
        <el-option
          v-for="item in customerList"
          :key="item.value"
          :label="item.label"
          :value="item.value"/>
      </el-select>
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">{{ $t('table.search') }}</el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-delete" @click="handleEmpty">清空</el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">添加</el-button>
    </div>

    <el-table
      v-loading="listLoading"
      :key="tableKey"
      :data="list.slice((currentPage-1)*pagesize,currentPage*pagesize)"
      :expand-row-keys="expands"
      row-key="outbound_id"
      border
      fit
      highlight-current-row
      style="width: 100%;"
      @sort-change="sortChange"
      @expand-change="showClick"
    >
      <el-table-column type="expand">
        <!--单据号下的物料表格开始-->
        <template slot-scope="props">
          <el-form label-position="left" inline class="demo-table-expand">
            <el-table
              :data="billItemList[props.row.outbound_id]"
              border
              style="width: 100%;">
              <el-table-column
                label=" "
                width="47"/>
              <el-table-column
                prop="item_name"
                label="物料名"
                width="350"/>
              <el-table-column
                prop="item_class"
                label="规格"
                width="90" />
              <el-table-column
                prop="weight"
                label="重量kg"
                width="100"/>
              <el-table-column
                prop="unit_name"
                label="单位"
                width="90"/>
              <!--<el-table-column
                prop="batch_time"
                label="批次时间"
                width="110"/>-->
              <el-table-column
                prop="retention_number"
                label="预约数量"
                width="90"/>
              <el-table-column
                prop="accepting_number"
                label="验收数量"
                width="90"/>
              <el-table-column
                prop="price"
                label="单价"
                width="100"/>
              <el-table-column
                prop="total"
                label="合计"
                width="100"/>
            </el-table>
          </el-form>
        </template>
        <!--单据号下的物料表格结束-->
      </el-table-column>

      <!--订单列表开始-->
      <el-table-column label="编号" prop="outbound_id" sortable="custom" align="center" width="65">
        <template slot-scope="scope">
          <span>{{ scope.row.outbound_id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="订单号" prop="outbound_code" width="180px" align="center">
        <template slot-scope="scope">
          <span>C{{ scope.row.outbound_code }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" prop="statusName" align="center" width="100">
        <template slot-scope="scope">
          <span v-if="scope.row.status === 1"><el-tag>{{ scope.row.statusName }}</el-tag></span>
          <span v-else-if="scope.row.status === 2"><el-tag type="warning">{{ scope.row.statusName }}</el-tag></span>
          <span v-else-if="scope.row.status === 3"><el-tag type="success">{{ scope.row.statusName }}</el-tag></span>
          <span v-else><el-tag type="info">{{ scope.row.statusName }}</el-tag></span>
        </template>
      </el-table-column>
      <el-table-column label="客户" prop="customer_name" align="center" width="120">
        <template slot-scope="scope">
          <span>{{ scope.row.customer_name }}</span>
        </template>
      </el-table-column>
      <!--<el-table-column label="仓库库号" prop="ware_name" align="center" width="120">
        <template slot-scope="scope">
          <span>{{ scope.row.ware_name }}</span>
        </template>
      </el-table-column>-->
      <el-table-column label="制单时间" prop="add_time" align="center" width="150">
        <template slot-scope="scope">
          <span>{{ scope.row.add_time | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="备注" prop="memo" width="150px" align="center">
        <template slot-scope="scope">
          <el-popover trigger="hover" placement="top">
            <p>{{ scope.row.memo }}</p>
            <div slot="reference" class="name-wrapper">
              <el-tag>内容</el-tag>
            </div>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column :label="$t('table.actions')" align="center" width="230" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handleInfo(scope.row)">查看</el-button>
        </template>
      </el-table-column>
      <!--订单列表结束-->
    </el-table>

    <!--<pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />-->
    <el-pagination
      :total="total"
      class="fy"
      background
      layout="prev, pager, next"
      @current-change="current_change"
    />

    <el-dialog :visible.sync="dialogTableVisible" title="选择物料" width="70%">
      <!--行内物料搜索表单开始-->
      <el-form :inline="true" :model="formInline" class="demo-form-inline">
        <el-form-item label="">
          <el-select v-model="itemSearch.item_type_id" filterable placeholder="请选择类型" size="mini">
            <el-option
              v-for="item in itemType"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
          <el-input v-model="itemSearch.item_name" placeholder="输入关键词" size="mini" style="width: 200px;" class="filter-item"/>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="mini" @click="onItemSearch">查询</el-button>
          <el-button type="primary" size="mini" @click="initSearch">清空</el-button>
        </el-form-item>
      </el-form>
      <!--行内物料搜索表单结束-->
      <!--物料选择表格开始-->
      <el-table
        ref="multipleTable"
        :data="itemArr"
        :row-key="getRowKeys"
        tooltip-effect="dark"
        style="width: 100%"
        @selection-change="handleSelectionChange">
        <el-table-column
          :reserve-selection="true"
          type="selection"
          width="55" />
        <el-table-column
          prop="item_name"
          label="物料名"/>
        <el-table-column
          prop="weight"
          label="物料重量"
          show-overflow-tooltip
          width="120" />
        <el-table-column
          prop="item_class"
          label="物料规格"
          show-overflow-tooltip
          width="120" />
      </el-table>
      <el-pagination
        :current-page="currentPageStock"
        :page-sizes="[10]"
        :page-size="pagesizeStock"
        :total="totalCount"
        style="margin-top:15px"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
      <!--物料选择表格结束-->
    </el-dialog>
    <!--提交物料弹出框开始-->
    <el-dialog :visible.sync="dialogFormVisible" width="70%" @close="Refresh()">
      <el-button type="primary" style="margin: 0 30px 10px 0" @click="openIten()" >添加出库信息</el-button>
      <el-table
        :data="multipleSelection"
        tooltip-effect="dark"
        style="width: 100%">
        <el-table-column
          prop="item_name"
          label="物料名"/>
        <el-table-column
          prop="weight"
          label="重量"
          width="100"/>
        <el-table-column
          prop="item_class"
          label="规格"
          width="100"/>
        <!--<el-table-column
          label="日期"
          width="190">
          <template slot-scope="scope">
            <el-date-picker
              v-model="scope.row.batch_time"
              style="width: 160px"
              prop="batch_time"
              type="date"
              placeholder="选择日期"
              format="yyyy - MM - dd"
              value-format="yyyy-MM-dd"/>
          </template>
        </el-table-column>-->
        <el-table-column
          width="130"
          prop="retention_number"
          label="出库数量"
          show-overflow-tooltip>
          <template slot-scope="scope">
            <el-input v-model="scope.row.retention_number" type="number" placeholder="请输入数量" />
          </template>
        </el-table-column>
        <el-table-column
          width="110"
          prop="price"
          label="单价"
          show-overflow-tooltip>
          <template slot-scope="scope">
            <el-input v-model="scope.row.price" type="number" placeholder="请输入单价" />
          </template>
        </el-table-column>
        <el-table-column
          width="90"
          prop="address"
          show-overflow-tooltip>
          <template slot-scope="scope">
            <el-button type="danger" @click.native.prevent="deleteItem(scope.$index, multipleSelection)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">{{ $t('table.cancel') }}</el-button>
        <el-button :disabled="isDisabled" type="primary" @click="createData()">提交</el-button>
      </div>
    </el-dialog>
    <!--提交物料弹出框结束-->
  </div>
</template>

<script>
import { getItemTypeList } from '@/api/itemtype'
import { getItemSelect } from '@/api/item'
// import { Pagination } from '@/components/Pagination'
import { addOutbound, fetchOutboundList, getTypeItemList } from '@/api/storeoutbound'
import { getStoreSelectList } from '@/api/store'
import { getCustomerStore } from '@/api/customer'

export default {
  name: 'ComplexTable',
  // components: { Pagination },
  filters: {

  },
  inject: ['reload'],
  data() {
    return {
      // 自定义
      billSubmit: {
        // outbound_code: '',
        store_id: ''
      },
      changeStore: 0,
      store_id: '', // 商户id
      storeList: [], // 商户信息
      customerList: [], // 商户客户信息
      billItemList: {}, // 获取单据下的物料
      itemArr: [], // 物料数据
      itemType: [], // 物料类型数据
      dialogTableVisible: false, // 弹出物料列表
      multipleSelection: [], // 选择的物料id
      // 出库单分页自定义
      pagesize: 10, // 每页的数据条数
      currentPage: 1, // 默认开始页面
      total: 0, // 默认数据总数
      getRowKeys(row) {
        return row.item_id
      },
      // 选择物料分页自定义
      currentPageStock: 1,
      pagesizeStock: 10,
      totalCount: 0,

      isDisabled: false,
      user: JSON.parse(localStorage.getItem('user')),
      expands: [],
      // 表格默认键值
      tableKey: 0,
      // 数据列表
      list: [],
      // 定时请求
      listLoading: true,
      // 搜索条件
      itemSearch: {
        item_type_id: '',
        item_name: '',
        sort: 'desc'
      },
      listQuery: {
        outbound_code: '',
        type: 1,
        store_id: '',
        status: '',
        sort: 'desc',
        customer_id: ''
      },
      // 下拉自定义条件
      importanceOptions: { '1': '待打印', '2': '待出库', '3': '已出库', '4': '已作废' },
      // 提交数据
      temp: {
        item_type_name: '',
        memo: ''
      },
      // 验证状态
      itemRules: 1,
      msg: '',
      // 弹窗显示
      dialogFormVisible: false,
      // 创建 修改 弹出不同的框 状态
      dialogStatus: '',
      rules: {
        item_type_name: [{ required: true, message: '物料类型不能为空', trigger: 'blur' }]
      },
      // 导出不能重复点两次
      downloadLoading: false,
      // 行内物料搜索表单
      formInline: {
        user: '',
        region: ''
      }
    }
  },
  created() {
    this.getList()
    this.getItemTypeList()
    this.getStoreSelectList()
    this.getCustomerStore()
  },
  methods: {
    Refresh() {
      this.reload()
    },
    // 获取开单号数据
    getList() {
      this.listLoading = true
      this.listQuery.store_id = this.user.uid
      fetchOutboundList(this.listQuery).then(response => {
        const resultData = {}
        response.data.arr.forEach((e) => {
          e.statusName = this.importanceOptions[e.status]
          resultData[e.outbound_id] = []
        })
        this.billItemList = resultData
        this.list = response.data.arr
        this.total = response.data.count
        setTimeout(() => {
          this.listLoading = false
        }, 0)
      })
    },
    // 页码变更
    handleCurrentChange: function(val) {
      this.currentPageStock = val
      this.getItemSelect()
    },
    // 每页显示数据量变更
    handleSizeChange: function(val) {
      this.pagesizeStock = val
      this.getItemSelect()
    },
    // 获取所有商户
    getStoreSelectList() {
      getStoreSelectList().then(response => {
        this.storeList = response.data
      })
    },
    // 获取该商户客户信息
    getCustomerStore() {
      getCustomerStore(this.user.uid).then(response => {
        this.customerList = response.data.customerTwoList
      })
    },
    // 获取物料类型数据
    getItemTypeList() {
      getItemTypeList().then(response => {
        this.itemType = response.data
      })
    },
    // 获取物料数据
    getItemSelect() {
      this.itemSearch.store_id = this.user.uid
      this.itemSearch.currentPageStock = this.currentPageStock
      getItemSelect(this.itemSearch).then(response => {
        //  获取库存时清除所有勾掉并将候选状态改为0
        this.$nextTick(() => {
          if (this.changeStore === 1) {
            this.$refs.multipleTable.clearSelection()
            this.changeStore = 0
          }
        })
        this.itemArr = response.data.itemArr
        this.totalCount = response.data.count
      })
    },
    // 根单据号id获取下面的物料
    showClick(row, event, column) {
      getTypeItemList(row.outbound_id).then(response => {
        // this.billItemList = []
        this.billItemList[row.outbound_id] = response.data
      })
    },
    openIten() {
      this.getItemSelect()
      this.dialogTableVisible = true
    },
    // 选择物料赋值
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    // 物料查询onSubmit
    onItemSearch() {
      this.currentPageStock = 1
      this.getItemSelect()
    },
    saveItem() {
      if (this.multipleSelection.length === 0) {
        this.$message.error('请选择物料')
        return false
      }
      this.dialogTableVisible = false
    },
    storeChange() {
      this.changeStore = 1
      this.currentPageStock = 1
      this.multipleSelection = []
    },
    // 删除提交物料
    deleteItem(index, rows) {
      rows.splice(index, 1)
    },
    // 分页
    current_change: function(currentPage) {
      this.currentPage = currentPage
    },
    handleFilter() {
      this.currentPage = 1
      this.getList()
    },
    // 排序条件 发生改变回调函数
    sortChange(data) {
      const { prop, order } = data
      if (prop === 'outbound_id') {
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
        outbound_code: '',
        type: 1,
        store_id: '',
        status: '',
        sort: 'desc',
        customer_id: ''
      }
    },
    initSearch() {
      this.itemSearch = {
        item_type_id: '',
        item_name: '',
        sort: 'desc'
      }
    },
    handleCreate() {
      this.multipleSelection = []
      this.billSubmit.store_id = ''
      this.resetTemp() // 清空添加信息
      this.dialogStatus = 'create' // 赋值添加弹框打开
      this.dialogFormVisible = true
    },
    // 添加操作
    createData() {
      this.itemRules = 1
      this.isDisabled = true
      if (this.multipleSelection.length !== 0) {
        this.multipleSelection.forEach((e) => {
          if (e.retention_number === '' || e.retention_number <= 0) {
            this.itemRules = 0
            this.msg = '出库量不能为空或小于等于0'
            return
          }
          if (e.price === '' || e.price <= 0) {
            this.itemRules = 0
            this.msg = '单价不能为空或小于等于0'
            return
          }
        })
        if (!this.itemRules) {
          this.$message.error(this.msg)
          this.isDisabled = false
          return false
        }
        this.billSubmit.biller_id = this.user.uid
        this.billSubmit.store_id = this.user.uid
        this.billSubmit.status = 1
        this.billSubmit.type = 1
        this.billSubmit.label = '00'
        this.billSubmit.itemArr = this.multipleSelection
        addOutbound(this.billSubmit).then((res) => {
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
      } else {
        this.$message.error('请添加数据！')
      }
      this.isDisabled = false
    },
    // 修改弹框
    handleInfo(row) {
      this.$router.push({ path: '/private/store_outbound_info', query: { outbound_id: row.outbound_id }})
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
    }
  }
}
</script>
<style>
  .fy{
    text-align:center;
    margin-top:30px;
  }
  .el-table--enable-row-transition .el-table__body td{
    padding:10px 0;
  }
</style>
