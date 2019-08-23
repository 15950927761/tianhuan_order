<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.item_name" placeholder="输入关键词" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter"/>
      <el-input v-model="listQuery.item_class" placeholder="输入规格" style="width: 200px;" class="filter-item"/>
      <el-input v-model="listQuery.weight" placeholder="输入重量" style="width: 200px;" class="filter-item"/>
      <!--<el-select v-model="listQuery.type" filterable placeholder="请选择私库" class="filter-item">
        <el-option label="私库" value="1" />
        <el-option label="公库" value="2" />
      </el-select>-->
      <el-select v-model="listQuery.store_id" filterable placeholder="请选择商户" class="filter-item">
        <el-option
          v-for="item in storeList"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">{{ $t('table.search') }}</el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-delete" @click="handleEmpty">清空</el-button>
      <!--导入-->
      <el-upload
        v-show="false"
        :action="importUrl"
        :name ="name"
        :headers="importHeaders"
        :on-preview="handlePreview"
        :on-remove="handleRemove"
        :before-upload="beforeUpload"
        :on-error="uploadFail"
        :on-success="uploadSuccess"
        :file-list="fileList"
        :with-credentials="withCredentials"
        :show-file-list="false"
        class="upload-demo filter-item"
        style="margin-left: 10px;">
        <!-- 是否支持发送cookie信息 -->
        <el-button v-show="user.uid == 1" :disabled="processing" size="medium" type="primary">{{ uploadTip }}</el-button>
      </el-upload>
      <el-button v-waves :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-download" style="margin-left: 10px;" @click="handleDownload">{{ $t('table.export') }}</el-button>
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
      @expand-change="showClick">
      <el-table-column type="expand">
        <!--单据号下的物料表格开始-->
        <template slot-scope="props">
          <el-form label-position="left" inline class="demo-table-expand">
            <el-table
              :data="billTiemList[props.row.stock_id]"
              border
              style="width: 100%;">
              <el-table-column
                label=" "
                width="47"/>
              <el-table-column
                prop="item_name"
                label="物料名"
                width="300"
              />
              <el-table-column
                prop="item_class"
                label="规格"
                width="130" />
              <el-table-column
                prop="weight"
                label="重量kg"
                width="100"/>
              <el-table-column
                prop="unit_name"
                label="单位"
                width="90"/>
              <el-table-column
                prop="batch_time"
                label="批次时间"
                width="110"/>
              <el-table-column
                prop="inventory"
                label="库存量"
                width="90"/>
              <el-table-column
                prop="stay_outstock"
                label="待出量"
                width="90"/>
              <el-table-column
                prop="available_stock"
                label="可出量"
                width="90"/>
            </el-table>
          </el-form>
        </template>
        <!--单据号下的物料表格结束-->
      </el-table-column>
      <el-table-column label="编号" prop="stock_id" sortable="custom" align="center" width="65">
        <template slot-scope="scope">
          <span>{{ scope.row.stock_id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="物料名称" prop="ware_name" width="210px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.item_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="规格" prop="address" width="90px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.item_class }}</span>
        </template>
      </el-table-column>
      <el-table-column label="重量kg" prop="weight" width="90px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.weight }}</span>
        </template>
      </el-table-column>
      <el-table-column label="类型" prop="item_type_name" width="90px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.item_type_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="商户名" prop="store_name" width="200px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.store_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="仓库" prop="ware_name" width="140px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.ware_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="库存量" prop="inv_total" width="80px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.inv_total }}</span>
        </template>
      </el-table-column>
      <el-table-column label="待出库" prop="stay_total" width="80px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.stay_total }}</span>
        </template>
      </el-table-column>
      <el-table-column label="可出库" prop="ava_total" width="80px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.ava_total }}</span>
        </template>
      </el-table-column>
      <el-table-column label="批次时间" prop="batch_time" width="110px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.batch_time }}</span>
        </template>
      </el-table-column>
      <el-table-column label="备注" prop="memo" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.memo }}</span>
          <!--<el-popover trigger="hover" placement="top">
            <p>{{ scope.row.memo }}</p>
            <div slot="reference" class="name-wrapper">
              <el-tag>内容</el-tag>
            </div>
          </el-popover>-->
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
import { getToken } from '@/utils/auth'
import { fetchStckList, getStockList } from '@/api/stock'
import { getStoreSelectBinding } from '@/api/store'
import waves from '@/directive/waves' // Waves directive addWare
// import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // Secondary package based on el-pagination
const baseUrl = process.env.BASE_API

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
      storeList: [], // 所有的商户
      billTiemList: {}, // 获取库存下细库存数据
      billTiemLength: 0,
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
      listLoading: true,
      // 搜索条件
      listQuery: {
        type: '',
        item_name: '',
        store_id: '',
        sort: 'desc',
        item_class: '',
        weight: ''
      },
      // 下拉自定义条件
      // 表格颜色状态标识
      statusOptions: ['published', 'draft', 'deleted'],
      // 弹窗显示
      dialogFormVisible: false,
      // 验证
      rules: {
      },
      // 导出不能重复点两次
      downloadLoading: false,
      // 导入
      multipleSelection: [],
      importUrl: baseUrl + 'admin/Stock/stockImportExcel', // 后台接口config.admin_url+'rest/schedule/import/'
      importHeaders: {
        'X-Auth-Token': getToken()
      },
      name: 'import',
      fileList: [],
      withCredentials: false, // 注意：true严格控制地址一对一 false 多个网站访问后台
      processing: false,
      uploadTip: '导入',
      importFlag: 1,
      dialogImportVisible: false,
      errorResults: []
    }
  },
  created() {
    this.getList()
    this.getStoreSelectBinding()
  },
  methods: {
    getList() {
      this.listLoading = true
      this.listQuery.uid = this.user.uid
      fetchStckList(this.listQuery).then(response => {
        const resultData = {}
        response.data.list.forEach((e) => {
          resultData[e.stock_id] = []
        })
        this.billTiemList = resultData
        this.list = response.data.list
        this.total = response.data.count
        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false
        }, 0)
      })
    },
    // 根单据号id获取下面的物料
    showClick(row, event, column) {
      if (row.type === 2) {
        getStockList(row).then(response => {
          this.billTiemList[row.stock_id] = response.data
        })
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
      if (prop === 'stock_id') {
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
        type: '',
        item_name: '',
        store_id: '',
        sort: 'desc',
        item_class: '',
        weight: ''
      }
    },
    // 导出
    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['物料名', '规格', '重量kg', '类型', '商户名', '仓库库号', '库存量', '待出量', '可用量', '批次时间', '备注']
        const filterVal = ['item_name', 'item_class', 'weight', 'item_type_name', 'store_name', 'ware_name', 'inv_total', 'stay_total', 'ava_total', 'batch_time', 'memo']
        const data = this.formatJson(filterVal, this.list)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: '库存列表'
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
    },
    // 导入
    importData() {
      this.importFlag = 1
      this.fileList = []
      this.uploadTip = '点击上传'
      this.processing = false
      this.dialogImportVisible = true
    },
    handlePreview(file) {
      // 可以通过 file.response 拿到服务端返回数据
    },
    handleRemove(file, fileList) {
      // 文件移除
    },
    beforeUpload(file) {
      // 上传前配置
      // this.importHeaders.cityCode = '上海' // 可以配置请求头
      const excelfileExtend = '.xls,.xlsx' // 设置文件格式
      const fileExtend = file.name.substring(file.name.lastIndexOf('.')).toLowerCase()
      if (excelfileExtend.indexOf(fileExtend) <= -1) {
        this.$message.error('文件格式错误')
        return false
      }
      this.uploadTip = '正在处理中...'
      this.processing = true
    },
    // 上传错误
    uploadFail(err, file, fileList) {
      this.uploadTip = '导入'
      this.processing = false
      this.$message.error(err)
    },
    // 上传成功
    uploadSuccess(response, file, fileList) {
      this.uploadTip = '导入'
      this.processing = false
      if (response.status === 1) {
        this.importFlag = 3
        this.dialogImportVisible = false
        this.$message({
          message: '导入成功',
          type: 'success'
        })
        // this.doSearch()
      } else {
        this.errorResults = response.data
        if (this.errorResults) {
          this.importFlag = 2
        } else {
          this.dialogImportVisible = false
          this.$message.error('导入失败')
        }
      }
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
