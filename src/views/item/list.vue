<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.item_name" placeholder="输入关键词" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter"/>
      <!--<el-select v-model="listQuery.importance" :placeholder="$t('table.importance')" clearable style="width: 90px" class="filter-item">-->
      <!--<el-option v-for="item in importanceOptions" :key="item" :label="item" :value="item"/>-->
      <!--</el-select>-->
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">{{ $t('table.search') }}</el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-delete" @click="handleEmpty">清空</el-button>
      <!--<el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">{{ $t('table.add') }}</el-button>-->
      <!--<el-upload
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
        &lt;!&ndash; 是否支持发送cookie信息 &ndash;&gt;
        <el-button :disabled="processing" size="medium" type="primary">{{ uploadTip }}</el-button>
      </el-upload>-->
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
      <el-table-column label="编号" type="index" sortable="custom" align="center" width="65">
        <!--<template slot-scope="scope">
          <span>{{ scope.row.item_id }}</span>
        </template>-->
      </el-table-column>
      <el-table-column label="生产日期" prop="produce_time" width="100px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.produce_time }}</span>
        </template>
      </el-table-column>
      <el-table-column label="物料名称" prop="item_name" width="200px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.item_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="物料规格" prop="item_class" width="100px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.item_class }}</span>
        </template>
      </el-table-column>
      <el-table-column label="重量kg" prop="weight" width="100px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.weight }}</span>
        </template>
      </el-table-column>
      <el-table-column label="物料类型" prop="typeName" width="90px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.typeName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="计量单位" prop="unitName" width="100px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.unitName }}</span>
        </template>
      </el-table-column>
      <!--<el-table-column label="所属商户" prop="storeName" width="100px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.storeName }}</span>
        </template>
      </el-table-column>-->
      <el-table-column label="条形码" prop="item_bar_code" width="150px" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.item_bar_code }}</span>
        </template>
      </el-table-column>
      <el-table-column label="备注" prop="memo" width="100px" align="center">
        <template slot-scope="scope">
          <el-popover trigger="hover" placement="top">
            <p>{{ scope.row.memo }}</p>
            <div slot="reference" class="name-wrapper">
              <el-tag>内容</el-tag>
            </div>
          </el-popover>
        </template>
      </el-table-column>
      <!--<el-table-column :label="$t('table.actions')" align="center" width="120" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handleUpdate(scope.row)">{{ $t('table.edit') }}</el-button>
          <el-button size="mini" type="success" @click="handleModifyStatus(scope.row,'tickertape')">{{ $t('table.tickertape') }}
          </el-button>
          <el-button size="mini" type="danger" @click="handleModifyStatus(scope.row,'deleted')">{{ $t('table.delete') }}
          </el-button>
        </template>
      </el-table-column>-->
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
        <el-form-item label="生产日期" prop="produce_time">
          <div class="block">
            <el-date-picker
              v-model="temp.produce_time"
              type="date"
              placeholder="选择日期"
              format="yyyy 年 MM 月 dd 日"
              value-format="yyyy-MM-dd" />
          </div>
        </el-form-item>
        <!--<el-form-item label="所属商户" prop="store_id">
          <el-select v-model="temp.store_id" placeholder="请选择商户">
            <el-option
              v-for="item in storeList"
              :key="item.value"
              :label="item.label"
              :value="item.value"/>
          </el-select>
        </el-form-item>-->
        <el-form-item label="物料类型" prop="item_type_id">
          <el-select v-model="temp.item_type_id" placeholder="请选择物料类型">
            <el-option
              v-for="item in itemType"
              :key="item.value"
              :label="item.label"
              :value="item.value"/>
          </el-select>
        </el-form-item>
        <el-form-item label="物料名称" prop="item_name">
          <el-input v-model="temp.item_name" placeholder="请输入物料名称"/>
        </el-form-item>
        <el-form-item label="规格型号" prop="item_class">
          <el-input v-model="temp.item_class" placeholder="请输入规格型号"/>
        </el-form-item>
        <el-form-item label="重量kg" prop="weight">
          <el-input v-model="temp.weight" placeholder="请输入重量"/>
        </el-form-item>
        <el-form-item label="条形编码" prop="item_class">
          <el-input v-model="temp.item_bar_code" placeholder="请输入规格型号"/>
        </el-form-item>
        <el-form-item label="计量单位" prop="unit_id">
          <el-select v-model="temp.unit_id" placeholder="请选择计量单位">
            <el-option
              v-for="item in unitList"
              :key="item.value"
              :label="item.label"
              :value="item.value"/>
          </el-select>
        </el-form-item>
        <el-form-item label="物料备注">
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
import { getToken } from '@/utils/auth'
import { getItemTypeList } from '@/api/itemtype'
import { getStoreSelectList } from '@/api/store'
import { addEditItem, fetchItemList } from '@/api/item'
import { getUnitList } from '@/api/unit'
import waves from '@/directive/waves' // Waves directive addWare
import { parseTime } from '@/utils'
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
  data() {
    return {
      storeList: [], // 商户信息
      unitList: [], // 计量单位
      itemType: [], // 物料类型
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
        item_name: '',
        sort: 'desc'
      },
      // 下拉自定义条件
      importanceOptions: [1, 2, 3],
      // calendarTypeOptions,
      // 表格颜色状态标识
      statusOptions: ['published', 'draft', 'deleted'],
      // 提交数据
      temp: {
        produce_time: '',
        item_type_id: '',
        store_id: '',
        unit_id: '',
        item_name: '',
        item_class: '',
        weight: '',
        item_bar_code: '',
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
      // 自定义验证
      rules: {
        item_type_id: [{ required: true, message: '物料类型必选', trigger: 'change' }],
        item_name: [{ required: true, message: '物料名称不能为空', trigger: 'blur' }],
        unit_id: [{ required: true, message: '计量单位', trigger: 'change' }],
        // store_id: [{ required: true, message: '请选择商户', trigger: 'change' }],
        weight: [{ required: true, message: '重量单位必填', trigger: 'blur' }]
      },
      // 导出不能重复点两次
      downloadLoading: false,
      // 导入
      multipleSelection: [],
      importUrl: baseUrl + 'admin/item/itemImportExcel', // 后台接口config.admin_url+'rest/schedule/import/'
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
    this.getItemTypeList()
    this.getUnitList()
    this.getStoreSelectList()
  },
  methods: {
    getList() {
      this.listLoading = true
      this.listQuery.store_id = this.user.uid
      fetchItemList(this.listQuery).then(response => {
        this.list = response.data.arr
        this.total = response.data.count
        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false
        }, 0)
      })
    },
    // 获取物料类型数据
    getItemTypeList() {
      getItemTypeList().then(response => {
        this.itemType = response.data
      })
    },
    // 获取所有商户
    getStoreSelectList() {
      getStoreSelectList().then(response => {
        this.storeList = response.data
      })
    },
    getUnitList() {
      getUnitList().then(response => {
        this.unitList = response.data
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
      if (prop === 'item_id') {
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
        produce_time: '',
        item_type_id: '',
        store_id: '',
        unit_id: 2,
        item_name: '',
        item_class: '',
        weight: '',
        item_bar_code: '',
        memo: ''
      }
    },
    // 清空搜索条件
    handleEmpty() {
      this.listQuery = {
        item_name: '',
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
          this.temp.item_id = 0
          this.temp.store_id = this.user.uid
          addEditItem(this.temp).then((res) => {
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
          addEditItem(this.temp).then((res) => {
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
