<template>
  <div class="app-container">
    <div class="filter-container">
      <!--<el-input v-model="listQuery.customer_name" placeholder="输入客户名称" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter"/>-->
      <el-select v-model="listQuery.customer_id" filterable placeholder="请选择客户" class="filter-item">
        <el-option
          v-for="item in customerList"
          :key="item.value"
          :label="item.label"
          :value="item.value"/>
      </el-select>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">{{ $t('table.search') }}</el-button>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleEmpty">清空</el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">{{ $t('table.add') }}</el-button>
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
      <el-table-column label="编号" prop="customer_id" sortable="custom" align="center" width="100px">
        <template slot-scope="scope">
          <span>{{ scope.row.customer_id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="客户名称" prop="customer_name" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.customer_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="公司名称" prop="customer_company" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.customer_company }}</span>
        </template>
      </el-table-column>
      <el-table-column label="电话" prop="customer_phone" align="center">
        <template slot-scope="scope">
          <span>{{ scope.row.customer_phone }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" prop="add_time" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.status == 0"><el-tag>{{ stopStatus[scope.row.status] }}</el-tag></span>
          <span v-else><el-tag type="danger">{{ stopStatus[scope.row.status] }}</el-tag></span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="150px" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handleUpdate(scope.row)">{{ $t('table.edit') }}</el-button>
          <el-button v-show="scope.row.status == 0" type="warning" size="mini" @click="handleDelete(scope.row)">停用</el-button>
          <el-button v-show="scope.row.status == 1" type="success" size="mini" @click="handleDelete(scope.row)">启用</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      :total="total"
      class="fy"
      background
      layout="prev, pager, next"
      @current-change="current_change"
    />

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="right" label-width="80px" style="width: 400px; margin-left:50px;">
        <el-form-item label="客户名称" prop="customer_name">
          <el-input v-model="temp.customer_name" />
        </el-form-item>
        <el-form-item label="客户号码" prop="customer_phone">
          <el-input v-model="temp.customer_phone" />
        </el-form-item>
        <el-form-item label="客户公司" prop="customer_company">
          <el-input v-model="temp.customer_company" />
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="temp.remark" :autosize="{ minRows: 2, maxRows: 4}" type="textarea" placeholder="" />
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
import { getCustomerList, createCustomer, updateCustomer, getCustomerStore, handleDelete } from '@/api/customer'
import waves from '@/directive/waves'
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
  inject: ['reload'],
  data() {
    return {
      isDisabled: false,
      // 每页的数据条数
      pagesize: 10,
      // 默认开始页面
      currentPage: 1,
      user: JSON.parse(localStorage.getItem('user')),
      // 表格默认键值
      tableKey: 0,
      // 数据列表
      list: [],
      customerList: [],
      // 默认数据总数
      total: 0,
      // 定时请求
      listLoading: true,
      // 搜索条件
      listQuery: {
        customer_name: '',
        customer_id: '',
        store_id: '',
        sort: 'desc'
      },
      // 弹窗显示
      dialogFormVisible: false,
      temp: {
        customer_name: '',
        customer_phone: '',
        customer_company: '',
        // add_time: parseTime(new Date()),
        remark: ''
      },
      dialogStatus: '',
      textMap: {
        update: '编辑客户',
        create: '添加客户'
      },
      stopStatus: { '0': '正常', '1': '停用' },
      // 验证
      rules: {
        customer_name: [{ required: true, message: '请输入客户名称', trigger: 'blur' }]
      }
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
      getCustomerList(this.listQuery).then(response => {
        this.list = response.data.list
        this.total = response.data.count
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
    // 排序条件 发生改变回调函数
    sortChange(data) {
      const { prop, order } = data
      if (prop === 'customer_id') {
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
        customer_name: '',
        customer_id: '',
        sort: 'desc'
      }
    },
    // 获取该商户客户信息
    getCustomerStore() {
      getCustomerStore(this.user.uid).then(response => {
        this.customerList = response.data.customerTwoList
      })
    },
    // 客户作废
    handleDelete(rew) {
      handleDelete(rew).then(response => {
        const data = response.data
        if (data.code === 1) {
          this.$message({
            message: data.msg,
            type: 'success'
          })
          this.getList()
        } else {
          this.$message.error(data.msg)
        }
      })
    },
    resetTemp() {
      this.temp = {
        customer_name: '',
        customer_phone: '',
        customer_company: '',
        // add_time: parseTime(new Date()),
        remark: ''
      }
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.isDisabled = true
          this.temp.store_id = this.user.uid
          createCustomer(this.temp).then(response => {
            // this.list.unshift(this.temp)
            const data = response.data
            if (data.code === 1) {
              this.$message({
                message: data.msg,
                type: 'success'
              })
              this.getList()
              setTimeout(() => {
                this.isDisabled = false
              }, 2000)
            } else {
              this.$message.error(data.msg)
            }
            this.dialogFormVisible = false
          })
        }
      })
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row)
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          updateCustomer(this.temp).then(response => {
            const data = response.data
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
          })
        }
      })
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

