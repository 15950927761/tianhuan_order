<template>
  <div class="app-container">
    <div class="filter-container">
      <!--<el-select v-model="listQuery.importance" :placeholder="$t('table.importance')" clearable style="width: 90px" class="filter-item">-->
      <!--<el-option v-for="item in importanceOptions" :key="item" :label="item" :value="item"/>-->
      <!--</el-select>-->
      <!--<el-button v-waves v-show="billInfo.status !== 3" class="filter-item" type="primary" >打印</el-button>-->
      <!--<el-button v-waves :loading="downloadLoading" class="filter-item" style="margin-left: 10px;" type="primary" @click="handleDownload">导出</el-button>-->
      <el-popover
        v-model="deleteVisible"
        placement="top"
        width="160"
      >
        <p>你确定要作废吗？</p>
        <div style="text-align: right; margin: 0">
          <el-button size="mini" type="text" @click="deleteVisible = false">取消</el-button>
          <el-button type="primary" size="mini" @click="deleteInbount()">确定</el-button>
        </div>
        <el-button v-show="billInfo.status == 1 && billInfo.printing_status == 1" slot="reference" class="filter-item" style="margin-left: 10px;" type="danger">作废</el-button>
      </el-popover>
      <el-button v-show="billInfo.review_status == 2 && billInfo.status == 1" class="filter-item" style="margin-left: 10px;" type="primary" @click="againReview()">提交审核</el-button>
      <!--<el-button v-show="billInfo.status == 1" class="filter-item" style="margin-left: 10px;" type="primary" @click="warehousingEject()">入库</el-button>-->
      <!--:data="list"<el-button v-waves :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-download" @click="handleDownload">{{ $t('table.export') }}</el-button>-->
    </div>
    <div class="filter-container" style="padding: 15px 0;border:1px dashed #eee;">
      <el-form ref="form" :model="sizeForm" :rules="rules" label-width="80px" size="mini">
        <el-row>
          <el-col :span="8">
            <div class="grid-content bg-purple">
              <el-form-item label="订单号:">
                <div>
                  <div><span>R{{ billInfo.inbound_code }}</span></div>
                </div>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="grid-content bg-purple">
              <el-form-item label="单据状态:">
                <div>
                  <div>
                    <span v-if="billInfo.status === 1"><el-tag>{{ importanceOptions[billInfo.status] }}</el-tag></span>
                    <span v-else-if="billInfo.status === 2"><el-tag type="success">{{ importanceOptions[billInfo.status] }}</el-tag></span>
                    <span v-else><el-tag type="danger">{{ importanceOptions[billInfo.status] }}</el-tag></span>
                  </div>
                </div>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="grid-content bg-purple">
              <el-form-item label="审核状态:">
                <div>
                  <div>
                    <span v-if="billInfo.review_status === 0"><el-tag>{{ reviewStatus[billInfo.review_status] }}</el-tag></span>
                    <span v-else-if="billInfo.review_status === 1"><el-tag type="success">{{ reviewStatus[billInfo.review_status] }}</el-tag></span>
                    <span v-else><el-tag type="danger">{{ reviewStatus[billInfo.review_status] }}</el-tag></span>
                  </div>
                </div>
              </el-form-item>
            </div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <div class="grid-content bg-purple">
              <el-form-item label="制单时间:">
                <div>
                  <div><span>{{ billInfo.add_time | parseTime('{y}-{m}-{d} {h}:{i}') }}</span></div>
                </div>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="15">
            <div class="grid-content bg-purple">
              <el-form-item label="单据类型:" prop="order_type">
                <div>
                  <template>
                    <el-select v-model="sizeForm.order_type" filterable placeholder="请选择类型">
                      <el-option
                        v-for="item in orderTypeList"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"/>
                    </el-select>
                    <el-select v-model="sizeForm.customer_id" filterable placeholder="请选择客户">
                      <el-option
                        v-for="item in customerSubimt"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"/>
                    </el-select>
                  </template>
                </div>
              </el-form-item>
            </div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-input
              v-model="sizeForm.memo"
              :rows="2"
              type="textarea"
              placeholder="原因备注"
            />
            <el-button v-show="billInfo.printing_status == 1 && billInfo.review_status !== 2" class="filter-item" style="margin-top: 10px;" type="primary" @click="setSubmitMemo()">提交</el-button>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div style="margin: 15px 0">
      <template>
        <el-table
          :data="billTiemList"
          :summary-method="getSummaries"
          style="width: 100%"
          show-summary
          border
        >
          <el-table-column
            type="index"
            label="序号"
            width="60" />
          <el-table-column
            prop="item_name"
            label="物料名"
            width="200" />
          <el-table-column
            prop="item_class"
            label="规格"
            width="100" />
          <el-table-column
            prop="unit_name"
            label="单位"
            width="100" />
          <el-table-column
            prop="batch_time"
            label="批次"
            width="120"/>
          <el-table-column
            prop="weight"
            label="单重kg"
            width="100"/>
          <el-table-column
            prop="retention_number"
            label="预约数量"
            width="100"/>
          <el-table-column
            prop="accepting_number"
            label="验收数量"
            width="100"
          />
          <!--<el-table-column
            prop="price"
            label="单价"
            width="100"
          />-->
          <el-table-column
            prop="count1"
            label="重量"
            width="100"
          />
          <el-table-column :label="$t('table.actions')" align="center" width="180" class-name="small-padding fixed-width">
            <template slot-scope="scope">
              <el-button v-show="billInfo.status == 1 && billInfo.printing_status == 1" type="primary" size="mini" @click="editItem(scope.row)">修改</el-button>
              <el-button v-show="billInfo.status == 1 && billInfo.printing_status == 1" type="danger" size="mini" @click="deleteItem(scope.row)">删除</el-button>
              <!--<el-button size="mini" type="success" @click="handleModifyStatus(scope.row,'tickertape')">{{ $t('table.tickertape') }}-->
              <!--</el-button>-->
              <!--<el-button size="mini" type="danger" @click="handleModifyStatus(scope.row,'deleted')">{{ $t('table.delete') }}-->
              <!--</el-button>-->
            </template>
          </el-table-column>
        </el-table>
        <el-dialog :visible.sync="dialogFormVisible" title="修改">
          <el-form :model="form">
            <el-form-item :label-width="formLabelWidth" label="物料名称：">
              <!--<span>{{ itemInterim.item_name }}</span>-->
              <el-select v-model="form.item_id" filterable placeholder="请选择物料" size="mini">
                <el-option
                  v-for="item in itemArr"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"/>
              </el-select>
            </el-form-item>
            <el-form-item :label-width="formLabelWidth" label="预约数量：">
              <el-input v-model="form.retention_number" style="width:40%" size="mini"/>
            </el-form-item>
            <!--<el-form-item :label-width="formLabelWidth" label="单价：">
              <el-input v-model="form.price" style="width:40%" size="mini"/>
            </el-form-item>-->
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisible = false">取 消</el-button>
            <el-button type="primary" @click="editConfirm">确 定</el-button>
          </div>
        </el-dialog>
        <!--入库弹出开始-->
        <el-dialog :visible.sync="warehFormVisible" title="入库操作">
          <el-form v-for="item in billTiemList" :key="item.id" style="padding:15px 0;border-top:1px solid #eee;border-bottom:1px solid #eee;margin-bottom: 10px;">
            <el-form-item :label-width="formLabelWidth" label="物料名称">
              <span><el-tag>{{ item.item_name }}</el-tag></span>
            </el-form-item>
            <el-form-item :label-width="formLabelWidth" label="预约数量">
              <span><el-tag>{{ item.retention_number }}</el-tag></span>
            </el-form-item>
            <el-form-item :label-width="formLabelWidth" label="验收数量">
              <el-input v-model="item.accepting_number" style="width:40%" />
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="warehFormVisible = false">取 消</el-button>
            <el-button type="primary" @click="sublitItem()">确 定</el-button>
          </div>
        </el-dialog>
        <!--弹出入库结束-->
      </template>
    </div>
  </div>
</template>

<script>
import waves from '@/directive/waves' // Waves directive addWare editItemFind warehFormVisible = false
// import { parseTime } from '@/utils'
import { getItemList } from '@/api/item'
import { getCustomerStore } from '@/api/customer'
import { getTypeItemList, getBillInfo, editItemFind, addWarehousing, deleteInbound, setAgainReview, deleteInboudItem } from '@/api/inbound'

export default {
  name: 'ComplexTable',
  directives: { waves },
  inject: ['reload'],
  data() {
    return {
      // 单条数据提交
      form: {
        retention_number: '',
        item_id: '',
        price: ''
      },
      formLabelWidth: '120px',
      // 自定义
      importanceOptions: { '1': '待验收', '2': '已入库', '3': '已作废' },
      reviewStatus: { '0': '待审核', '1': '审核通过', '2': '审核失败' },
      coolieList: [], // 获取所有卸货工
      wareList: [], // 根据商户id获取所有仓库库号
      billTiemList: [],
      billInfo: [], // 获取单号基本信息
      dialogFormVisible: false, // 弹窗单条修改
      warehFormVisible: false, // 入库弹出
      itemInterim: [], // 临时装载物料数据
      disabled: false,
      deleteVisible: false,
      user: JSON.parse(localStorage.getItem('user')),
      itemArr: [],
      customerSubimt: [], // 商户客户
      orderTypeList: [{
        value: '1',
        label: '采购'
      }, {
        value: '2',
        label: '退货'
      }],
      // 提交数据
      sizeForm: {
        area_id: '',
        coolie_id: [],
        memo: '',
        order_type: '1',
        customer_id: ''
      },
      // 验证coolie_id
      rules: {
        area_id: [{ required: true, message: '仓库区号必选', trigger: 'change' }],
        coolie_id: [{ required: true, message: '卸货人必选', trigger: 'change' }]
      },
      sublitRules: '1',
      // 导出不能重复点两次
      downloadLoading: false
    }
  },
  created() {
    this.getList()
    this.getBillInfo()
    this.getStoreItemList()
    this.getCustomerStore()
  },
  methods: {
    // 通过inboundId获取单号数据
    getList() {
      const inbound_id = this.$route.query.inbound_id
      getTypeItemList(inbound_id).then(response => {
        response.data.forEach((e) => {
          e.count1 = (e.accepting_number * e.weight).toFixed(2)
        })
        this.billTiemList = response.data
      })
    },
    // 获取单号数据
    getBillInfo() {
      const inbound_id = this.$route.query.inbound_id
      if (inbound_id) {
        getBillInfo(inbound_id).then(response => {
          this.billInfo = response.data
          this.sizeForm.memo = this.billInfo.memo
          if (this.billInfo.customer_id) {
            this.sizeForm.customer_id = this.billInfo.customer_id
          }
          if (this.billInfo.order_type) {
            this.sizeForm.order_type = String(this.billInfo.order_type)
          }
        })
      }
    },
    // 获取当前商户物料 editItemList
    getStoreItemList() {
      getItemList(this.user.uid).then(response => {
        this.itemArr = response.data
      })
    },
    // 获取该商户客户信息
    getCustomerStore() {
      getCustomerStore(this.user.uid).then(response => {
        this.customerSubimt = response.data.customerOneList
      })
    },
    // 单条修改弹出
    editItem(rew) {
      this.itemInterim = rew
      this.form.retention_number = rew.retention_number
      this.form.item_id = rew.item_id
      this.form.price = rew.price
      this.dialogFormVisible = true
    },
    editConfirm() {
      this.form.id = this.itemInterim.id
      this.form.inbound_id = this.itemInterim.inbound_id
      editItemFind(this.form).then(response => {
        const data = response.data
        if (data.code === 1) {
          this.$message({
            message: data.message,
            type: 'success'
          })
          this.getList()
        } else {
          this.$message.error(data.message)
        }
      })
      this.dialogFormVisible = false
    },
    // 再次审核
    againReview() {
      setAgainReview(this.$route.query.inbound_id, this.sizeForm.memo).then(response => {
        const data = response.data
        if (data.code === 1) {
          this.$message({
            message: data.msg,
            type: 'success'
          })
          this.reload()
        } else {
          this.$message.error(data.msg)
        }
      })
    },
    // 用户提交备注
    setSubmitMemo() {
      if (!this.sizeForm.customer_id || !this.sizeForm.order_type) {
        this.$message.error('请选择单据类型或客户')
        return
      }
      if (this.sizeForm.order_type === '2' && !this.sizeForm.memo) {
        this.$message.error('请填写备注信息！')
        return
      }
      const type = 2
      setAgainReview(this.$route.query.inbound_id, this.sizeForm, type).then(response => {
        const data = response.data
        if (data.code === 1) {
          this.$message({
            message: data.msg,
            type: 'success'
          })
          this.reload()
        } else {
          this.$message.error(data.msg)
        }
      })
    },
    // 统计表
    getSummaries(param) {
      const { columns, data } = param
      const sums = []
      // const retentionNumber = 0
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = '合计'
          return
        }
        if (index >= 5 && index <= 8) {
          const values = data.map(item => Number(item[column.property]))
          if (!values.every(value => isNaN(value))) {
            sums[index] = values.reduce((prev, curr) => {
              const value = Number(curr)
              if (!isNaN(value)) {
                return prev + curr
              }
            }, 0)
          }
        }
        // sums[5] = parseFloat(sums[5]).toFixed(2)
        // sums[8] = '总和' + (sums[7] * sums[5]).toFixed(2)
        sums[5] = ''
      })
      return sums
    },
    // 入库操作弹窗
    warehousingEject() {
      if (!this.sizeForm.area_id || this.sizeForm.coolie_id.length === 0) {
        this.$message.error('请核对仓库库号或装卸员是否选择！')
        return false
      }
      this.warehFormVisible = true
    },
    // 入库提交
    sublitItem() {
      this.sublitRules = '1'
      if (!this.sizeForm.area_id || this.sizeForm.coolie_id.length === 0) {
        this.$message.error('请核对仓库库号或装卸员是否选择！')
        return false
      }
      this.billTiemList.forEach((e) => {
        if (e.accepting_number === null || e.accepting_number === '') {
          this.sublitRules = '0'
          return
        }
      })
      if (this.sublitRules === '0') {
        this.$message.error('请核对验收量已填完！')
        return false
      }
      this.sizeForm.id = this.$route.query.inbound_id
      addWarehousing(this.billTiemList, this.sizeForm).then(response => {
        const data = response.data
        if (data.code === 1) {
          this.$message({
            message: data.msg,
            type: 'success'
          })
          this.$router.push('/private/inbound')
        } else {
          this.$message.error('数据添加失败')
        }
      })
      this.warehFormVisible = false
    },
    // 待验收状态删除单据包裹下的物料
    deleteInbount() {
      deleteInbound(this.$route.query.inbound_id).then(response => {
        const data = response.data
        if (data.code === 1) {
          this.$message({
            message: data.msg,
            type: 'success'
          })
          this.$router.push('/private/inbound')
        } else {
          this.$message.error(data.msg)
          this.reload()
        }
      })
      this.deleteVisible = false
    },
    // 删除未验收物料列表某一商品
    deleteItem(rew) {
      deleteInboudItem(rew.inbound_id, rew.id, this.billTiemList.length).then(response => {
        const data = response.data
        if (data.code === 1) {
          this.$message({
            message: data.msg,
            type: 'success'
          })
          this.reload()
        } else {
          this.$message.error(data.msg)
        }
      })
    },
    // 导出
    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['物料名', '规格', '单位', '重量kg', '批次时间', '预约数量', '验收数量']
        const filterVal = ['item_name', 'item_class', 'unit_name', 'weight', 'batch_time', 'retention_number', 'accepting_number']
        const data = this.formatJson(filterVal, this.billTiemList)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: '入库单据R' + this.billInfo.inbound_code
        })
        this.downloadLoading = false
      })
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => {
        // if (j === 'batch_time') {
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
