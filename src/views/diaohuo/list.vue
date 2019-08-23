<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.diaohuo_code" placeholder="输入单据号" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter"/>
      <el-select v-model="listQuery.status" placeholder="单据状态" clearable style="width: 120px" class="filter-item">
        <el-option label="待打印" value="1"/>
        <el-option label="待拣货" value="2"/>
        <el-option label="待配送" value="3"/>
        <el-option label="配送中" value="4"/>
        <el-option label="已出库" value="5"/>
        <el-option label="已作废" value="6"/>
        <el-option label="挂异常" value="7"/>
      </el-select>
      <!--<el-select v-model="listQuery.store_id" placeholder="商户筛选" clearable style="width: 120px" class="filter-item">
        <el-option
          v-for="item in storeList"
          :key="item.value"
          :label="item.label"
          :value="item.value"/>
      </el-select>-->
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">{{ $t('table.search') }}</el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-delete" @click="handleEmpty">清空</el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">添加</el-button>
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
      @sort-change="sortChange"
      @expand-change="showClick"
    >
      <el-table-column type="expand">
        <!--单据号下的物料表格开始-->
        <template slot-scope="props">
          <el-form label-position="left" inline class="demo-table-expand">
            <el-table
              :data="stockList[props.row.diaohuo_id]"
              border
              style="width: 100%;">
              <el-table-column
                label=" "
                width="47"/>
              <el-table-column
                prop="item_name"
                label="物料名"
                width="350"
              />
              <el-table-column
                prop="item_class"
                label="规格"
                width="200" />
              <el-table-column
                prop="weight"
                label="重量kg"
                width="100"/>
              <el-table-column
                prop="unit_name"
                label="单位"
                width="100"/>
              <!--<el-table-column-->
              <!--prop="batch_time"-->
              <!--label="批次时间" />-->
              <el-table-column
                prop="retention_number"
                label="预约数量"
                width="100"/>
              <el-table-column
                prop="accepting_number"
                label="实际数量"
                width="100"/>
            </el-table>
          </el-form>
        </template>
        <!--单据号下的物料表格结束-->
      </el-table-column>
      <el-table-column label="编号" prop="diaohuo_id" sortable="custom" align="center" width="65">
        <template slot-scope="scope">
          <span>{{ scope.row.diaohuo_id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="单据号" prop="diaohuo_code" width="170px" align="center">
        <template slot-scope="scope">
          <span>O{{ scope.row.diaohuo_code }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" prop="statusName" align="center" width="100">
        <template slot-scope="scope">
          <span v-if="scope.row.status === 1"><el-tag>{{ scope.row.statusName }}</el-tag></span>
          <span v-else-if="scope.row.status === 2"><el-tag type="warning">{{ scope.row.statusName }}</el-tag></span>
          <span v-else-if="scope.row.status === 3"><el-tag type="warning">{{ scope.row.statusName }}</el-tag></span>
          <span v-else-if="scope.row.status === 4"><el-tag type="danger">{{ scope.row.statusName }}</el-tag></span>
          <span v-else-if="scope.row.status === 5"><el-tag type="success">{{ scope.row.statusName }}</el-tag></span>
          <span v-else><el-tag type="info">{{ scope.row.statusName }}</el-tag></span>
        </template>
      </el-table-column>
      <el-table-column label="商户" prop="store_name" align="center" width="120">
        <template slot-scope="scope">
          <span>{{ scope.row.store_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="制单人" prop="biller_name" align="center" width="120">
        <template slot-scope="scope">
          <span>{{ scope.row.biller_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="制单时间" prop="add_time" align="center" width="150">
        <template slot-scope="scope">
          <span>{{ scope.row.add_time | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="异常状态" prop="biller_id" align="center" width="100">
        <template slot-scope="scope">
          <span v-if="scope.row.abnormal_status === 0"><el-tag type="success">{{ abnormalStatus[scope.row.abnormal_status] }}</el-tag></span>
          <span v-else><el-tag type="danger">{{ abnormalStatus[scope.row.abnormal_status] }}</el-tag></span>
        </template>
      </el-table-column>
      <el-table-column label="备注" prop="memo" width="120px" align="center">
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
    <!--<el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" @close="Refresh1()">-->
    <el-dialog :visible.sync="dialogTableVisible" title="选择物料" >
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
          label="物料名"
        />
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
      <!--<div slot="footer" class="dialog-footer">-->
      <!--<el-button @click="dialogTableVisible = false">{{ $t('table.cancel') }}</el-button>-->
      <!--<el-button type="primary" @click="saveItem()">{{ $t('table.confirm') }}</el-button>-->
      <!--</div>-->
      <!--物料选择表格结束-->
    </el-dialog>
    <!--提交物料弹出框开始-->
    <el-dialog :visible.sync="dialogFormVisible" width="70%" @close="Refresh()">
      <el-select v-model="billSubmit.area_id" placeholder="请选择仓库">
        <el-option
          v-for="item in wareList"
          :key="item.value"
          :label="item.label"
          :value="item.value"/>
      </el-select>
      <el-button type="primary" style="margin: 0 30px 10px 0" @click="openIten()" >添加调货单信息</el-button>
      <!--<span>单据号: R{{ billSubmit.inbound_code }}</span>-->
      <el-table
        :data="multipleSelection"
        tooltip-effect="dark"
        style="width: 100%">
        <el-table-column
          prop="item_name"
          label="物料名"
        />
        <el-table-column
          prop="weight"
          label="重量"
          width="110"
        />
        <el-table-column
          prop="item_class"
          label="规格"
          width="110"
        />
        <el-table-column
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
              value-format="yyyy-MM-dd"
            />
          </template>
        </el-table-column>
        <el-table-column
          width="150"
          prop="retention_number"
          label="入库数量"
          show-overflow-tooltip>
          <template slot-scope="scope">
            <el-input v-model="scope.row.retention_number" type="number" placeholder="请输入数量" />
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
import waves from '@/directive/waves' // Waves directive addWare
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
// import { getBillNumber } from '@/api/inbound'
import { getItemSelect } from '@/api/item'
import { addOutbound, fetchOutboundList, getTypeItemList, getStoreWare } from '@/api/diaohuo'

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
      // 自定义
      billSubmit: {
        // diaohuo_code: '',
        store_id: '',
        area_id: ''
      },
      changeStore: 0,
      wareList: [], // 根据商户id获取所有仓库库号
      store_id: '', // 商户id
      storeList: [], // 商户信息
      stockList: {}, // 获取单据下的物料
      itemArr: [], // 物料数据
      itemType: [], // 物料类型数据
      dialogTableVisible: false, // 弹出物料列表
      multipleSelection: [], // 选择的物料id
      selectStock: {},
      getRowKeys(row) {
        return row.item_id
      },
      // 分页
      currentPageStock: 1,
      pagesizeStock: 10,
      totalCount: 0,

      pagesize: 10, // 每页的数据条数
      currentPage: 1, // 默认开始页面
      isDisabled: false,
      user: JSON.parse(localStorage.getItem('user')),
      itemRules: 1,
      // 表格默认键值
      tableKey: 0,
      // 数据列表
      list: [],
      // 默认数据总数
      total: 0,
      // 定时请求
      listLoading: true,
      // 搜索条件
      itemSearch: {
        item_type_id: '',
        sort: 'desc',
        type: 1,
        item_name: ''
      },
      listQuery: {
        store_id: '',
        diaohuo_code: '',
        type: 1,
        status: '',
        sort: 'desc'
      },
      // 自定义数组
      importanceOptions: { '1': '待打印', '2': '待拣货', '3': '待配送', '4': '配送中', '5': '已出库', '6': '已作废' },
      abnormalStatus: { '0': '正常', '1': '异常' },
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
    this.storeChange()
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
          resultData[e.diaohuo_id] = []
        })
        this.stockList = resultData
        this.list = response.data.arr
        this.total = response.data.count
        // Just to simulate the time of the request
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
    // 获取物料类型数据
    getItemTypeList() {
      getItemTypeList().then(response => {
        this.itemType = response.data
      })
    },
    // 可用数量为0限制勾选
    checkboxInit(row, index) {
      if (row.available_stock === 0) {
        return 0
      } else {
        return 1
      }
    },
    // // 根单据号id获取下面的物料
    // showClick(row, expandedRows) {
    //   getStockList(row.diaohuo_id).then(response => {
    //     this.stockList[row.diaohuo_id] = response.data.list
    //   })
    // },
    // 根单据号id获取下面的物料
    showClick(row, event, column) {
      getTypeItemList(row.diaohuo_id).then(response => {
        this.stockList[row.diaohuo_id] = response.data.list
      })
    },
    openIten() {
      // console.log(this.multipleSelection)
      if (!this.billSubmit.area_id) {
        this.$message.error('请选择仓库！')
        return false
      }
      this.getItemSelect()
      this.dialogTableVisible = true
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
    // 获取该商户仓库
    storeChange() {
      getStoreWare(this.user.uid).then(response => {
        this.wareList = response.data
      })
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
      if (prop === 'diaohuo_id') {
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
        store_id: '',
        diaohuo_code: '',
        type: 1,
        status: '',
        sort: 'desc'
      }
    },
    initSearch() {
      this.itemSearch = {
        item_type_id: '',
        sort: 'desc',
        type: 1,
        item_name: ''
      }
    },
    handleCreate() {
      this.multipleSelection = []
      this.resetTemp() // 清空添加信息
      this.dialogStatus = 'create' // 赋值添加弹框打开
      this.dialogFormVisible = true
    },
    // 添加操作
    createData() {
      this.itemRules = 1
      if (this.multipleSelection.length !== 0) {
        this.multipleSelection.forEach((e) => {
          if (e.retention_number > e.available_stock || e.retention_number <= 0 || e.retention_number === '') {
            this.itemRules = 0
            return
          }
        })
        if (!this.itemRules) {
          this.$message.error('出库量必须小于等于库存量或不能为空！')
          return false
        }
        this.billSubmit.biller_id = this.user.uid
        this.billSubmit.status = 1
        this.billSubmit.types = 8
        this.billSubmit.label = '08'
        this.billSubmit.itemArr = this.multipleSelection
        this.isDisabled = true
        this.billSubmit.store_id = this.user.uid
        addOutbound(this.billSubmit).then((res) => {
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
            this.$message.error('数据添加失败')
          }
          this.dialogFormVisible = false
        })
      } else {
        this.$message.error('请添加数据！')
      }
    },
    // 修改弹框
    handleInfo(row) {
      this.$router.push({ path: '/private/diaohuo_info', query: { diaohuo_id: row.diaohuo_id }})
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
  .el-table--enable-row-transition .el-table__body td{
    padding:10px 0;
  }
</style>
