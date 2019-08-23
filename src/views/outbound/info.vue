<template>
  <div class="app-container">
    <div v-show="billInfo.status !== 7" class="filter-container">
      <!--<el-select v-model="listQuery.importance" :placeholder="$t('table.importance')" clearable style="width: 90px" class="filter-item">-->
      <!--<el-option v-for="item in importanceOptions" :key="item" :label="item" :value="item"/>-->
      <!--</el-select>-->
      <el-button v-waves class="filter-item" type="primary" @click="printContent()">打印</el-button>
      <el-button v-waves :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-download" @click="handleDownload">{{ $t('table.export') }}</el-button>
      <el-popover
        v-show="billInfo.status == 1 || billInfo.abnormal_status == 1"
        v-model="deleteVisible"
        placement="top"
        width="160"
      >
        <p>你确定要作废吗？</p>
        <div style="text-align: right; margin: 0">
          <el-button size="mini" type="text" @click="deleteVisible = false">取消</el-button>
          <el-button type="primary" size="mini" @click="deleteOutbount()">确定</el-button>
        </div>
        <el-button v-show="billInfo.status == 1" slot="reference" class="filter-item" style="margin-left: 10px;" type="danger">作废</el-button>
      </el-popover>
    </div>
    <!--出库弹出开始-->
    <el-dialog :visible.sync="warehFormVisible" title="出库操作">
      <el-form v-for="item in billTiemList" :key="item.id" style="padding:15px 0;border-top:1px solid #eee;border-bottom:1px solid #eee;margin-bottom: 10px;">
        <el-form-item :label-width="formLabelWidth" label="物料名称">
          <span><el-tag>{{ item.item_name }}</el-tag></span>
        </el-form-item>
        <el-form-item :label-width="formLabelWidth" label="预约数量">
          <span><el-tag>{{ item.retention_number }}</el-tag></span>
        </el-form-item>
        <el-form-item :label-width="formLabelWidth" label="可用数量">
          <span><el-tag>{{ item.available_stock }}</el-tag></span>
        </el-form-item>
        <el-form-item :label-width="formLabelWidth" label="验出数量">
          <el-input v-model="item.accepting_number" style="width:40%" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="warehFormVisible = false">取 消</el-button>
        <el-button :disabled="isDisabled" type="primary" @click="outboundOk()">确 定</el-button>
      </div>
    </el-dialog>
    <!--弹出出库结束-->
    <!--添加客户开始-->
    <el-dialog :visible.sync="kehuFormVisible">
      <el-form ref="tempKehu" :rules="rules" :model="tempKehu" label-position="right" label-width="120px" style="width: 500px; margin-left:50px;">
        <el-form-item label="客户名称" prop="customer_name">
          <el-input v-model="tempKehu.customer_name" placeholder="请输入客户"/>
        </el-form-item>
        <el-form-item label="客户电话" prop="customer_phone">
          <el-input v-model="tempKehu.customer_phone" placeholder="请输入电话"/>
        </el-form-item>
        <el-form-item label="公司名称" prop="customer_company">
          <el-input v-model="tempKehu.customer_company" placeholder="请输入公司"/>
        </el-form-item>
        <el-form-item label="备注">
          <el-input :autosize="{ minRows: 2, maxRows: 4}" v-model="tempKehu.remark" type="textarea" placeholder="备注"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="kehuFormVisible = false">{{ $t('table.cancel') }}</el-button>
        <el-button :disabled="isDisabled" type="primary" @click="customerOk()">{{ $t('table.confirm') }}</el-button>
      </div>
    </el-dialog>
    <!--添加客户结束-->
    <div class="filter-container" style="padding: 15px 0;border:1px dashed #eee;">
      <el-form ref="form" :model="sizeForm" label-width="80px" size="mini">
        <el-row>
          <el-col :span="8">
            <div class="grid-content bg-purple">
              <el-form-item label="单据号:">
                <div>
                  <div><span>O{{ billInfo.outbound_code }}</span></div>
                </div>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="grid-content bg-purple-light">
              <el-col :span="8">
                <div class="grid-content bg-purple">
                  <el-form-item label="制单人:">
                    <div>
                      <div><span>{{ billInfo.billerName }}</span></div>
                    </div>
                  </el-form-item>
                </div>
              </el-col>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="grid-content bg-purple">
              <el-form-item label="制单时间:">
                <div>
                  <div><span>{{ billInfo.add_time | parseTime('{y}-{m}-{d} {h}:{i}') }}</span></div>
                </div>
              </el-form-item>
            </div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <div class="grid-content bg-purple-light">
              <el-col :span="18">
                <div class="grid-content bg-purple">
                  <el-form-item label="拣货员:" prop="picker_id">
                    <div>
                      <template>
                        <el-select :disabled="true" v-model="sizeForm.picker_id" multiple filterable placeholder="请选择" style="width:100%">
                          <el-option
                            v-for="item in picking"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"/>
                        </el-select>
                      </template>
                    </div>
                  </el-form-item>
                </div>
              </el-col>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="grid-content bg-purple-light">
              <el-col :span="18">
                <div class="grid-content bg-purple">
                  <el-form-item label="配送员:" prop="delivery_id">
                    <div>
                      <template>
                        <el-select :disabled="true" v-model="sizeForm.delivery_id" multiple filterable placeholder="请选择" style="width:100%">
                          <el-option
                            v-for="item in delivery"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"/>
                        </el-select>
                      </template>
                    </div>
                  </el-form-item>
                </div>
              </el-col>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="grid-content bg-purple-light">
              <el-col :span="12">
                <div class="grid-content bg-purple">
                  <el-form-item label="单据状态:" prop="delivery_id">
                    <div>
                      <span><el-tag>{{ statusName[billInfo.status] }}</el-tag></span>
                    </div>
                  </el-form-item>
                </div>
              </el-col>
            </div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <div class="grid-content bg-purple-light">
              <el-col :span="18">
                <div class="grid-content bg-purple">
                  <el-form-item label="客户:" prop="customer">
                    <div>
                      <el-select v-if="(!billInfo.customer_id && !billInfo.customer) || billInfo.customer_id" :disabled="billInfo.status !== 1" v-model="sizeForm.customer_id" placeholder="请选择客户" filterable clearable style="width: 83%" class="filter-item">
                        <el-option
                          v-for="item in customerList"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value"/>
                      </el-select>
                      <span v-else-if="billInfo.customer" class="filter-item"><el-tag>{{ billInfo.customer }}</el-tag></span>
                      <el-button v-show="billInfo.status == 1" type="primary" icon="el-icon-edit" circle class="filter-item" @click="addCustomer()"/>
                    </div>
                  </el-form-item>
                </div>
              </el-col>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="grid-content bg-purple-light">
              <el-col :span="18">
                <div class="grid-content bg-purple">
                  <el-form-item label="车牌号:" prop="plate_number">
                    <div>
                      <el-input :disabled="billInfo.status !== 1" v-model="sizeForm.plate_number" placeholder="请输入车牌号"/>
                    </div>
                  </el-form-item>
                </div>
              </el-col>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="grid-content bg-purple-light">
              <el-col :span="18">
                <div class="grid-content bg-purple">
                  <el-form-item label="地址:" prop="wagon_number">
                    <div>
                      <el-input :disabled="billInfo.status !== 1" v-model="sizeForm.wagon_number" placeholder="请输入车号"/>
                    </div>
                  </el-form-item>
                </div>
              </el-col>
            </div>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24" style="padding: 0 15px">
            <div class="grid-content bg-purple-dark">
              <el-input
                :disabled="disabledTwo"
                :rows="2"
                v-model="sizeForm.memo"
                :placeholder="placeholder"
                type="textarea"
              />
            </div>
            <el-button v-waves v-show="billInfo.status == 1" class="filter-item" type="primary" style="margin-top: 15px" @click="setMemoText()">提交</el-button>
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
          border
          show-summary
        >
          <el-table-column
            type="index"
            label="序号"
            width="60" />
          <el-table-column
            prop="ware_name"
            label="仓库编号"
            width="130" />
          <el-table-column
            prop="item_name"
            label="物料名"
            width="250" />
          <el-table-column
            prop="item_class"
            label="规格"
            width="100" />
          <el-table-column
            prop="unit_name"
            label="单位"
            width="70" />
          <el-table-column
            prop="weight"
            label="单重kg"
            width="100"/>
          <!--<el-table-column-->
          <!--prop="batch_time"-->
          <!--label="批次"-->
          <!--width="120"/>-->
          <el-table-column
            prop="retention_number"
            label="预约数量"
            width="100"/>
          <el-table-column
            prop="accepting_number"
            label="实出库量"
            width="100"
          />
          <el-table-column
            prop="count1"
            label="重量"
            width="100"
          />
          <el-table-column
            prop="price"
            label="单价"
            width="100"
          />
          <el-table-column
            prop="total"
            label="合计"
            width="100"
          />
          <el-table-column :label="$t('table.actions')" align="center" width="180" class-name="small-padding fixed-width">
            <template slot-scope="scope">
              <el-button v-show="billInfo.status == 1 " type="primary" size="mini" @click="editItem(scope.row)">修改</el-button>
              <el-button v-show="billInfo.status == 1" type="danger" size="mini" @click="deleteStock1(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-dialog :visible.sync="dialogFormVisible" title="修改">
          <el-form :model="form">
            <el-form-item :label-width="formLabelWidth" label="物料名称：">
              <span><el-tag>{{ itemInterim.item_name }}</el-tag></span>
            </el-form-item>
            <el-form-item :label-width="formLabelWidth" label="可用库存：">
              <span><el-tag>{{ itemInterim.available_stock }}</el-tag></span>
            </el-form-item>
            <el-form-item :label-width="formLabelWidth" label="预约数量：">
              <el-input v-model="form.retention_number" style="width:40%" size="mini"/>
            </el-form-item>
            <el-form-item :label-width="formLabelWidth" label="单价：">
              <el-input v-model="form.price" style="width:40%" size="mini" type="number"/>
            </el-form-item>
            <!--<el-form-item :label-width="formLabelWidth" label="预约数量：">
              <span><el-tag>{{ itemInterim.retention_number }}</el-tag></span>
            </el-form-item>
            <el-form-item :label-width="formLabelWidth" label="待出库量：">
              <el-input v-model="form.accepting_number" style="width:40%" size="mini"/>
            </el-form-item>-->
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisible = false">取 消</el-button>
            <el-button type="primary" @click="editConfirm">确 定</el-button>
          </div>
        </el-dialog>
      </template>
    </div>
    <div v-show="false" id="subOutputRank-print" style="width: 96%;padding: 0 2%">
      <div style="width: 100%;"><h3 style="text-align: center"><span>苏州天环冷链商户 销售单</span></h3></div>
      <div id="ssss" style="width: 100%;">
        <div class="outbound">
          <p style="margin-top: 8px;margin-bottom: 5px">
            <span>单据号：{{ billInfo.outbound_code }}</span>
            <span style="margin-left:50px">客户名称：{{ billInfo.customerName }}</span>
            <span style="margin-left:50px">录单时间:{{ billInfo.add_time | parseTime('{y}-{m}-{d} {h}:{i} ') }}</span>
          </p>
          <p style="margin-bottom: 0;margin-top: 0">
            <span>{{ billInfo.describe }}</span>
          </p>
        </div>
        <div v-show="false" style="clear: both">1</div>
        <div style="width: 94%;float: left">
          <table border="1" style="width:100%;align:center;bordercolor:#DEDEDE;cellspacing:0;border-collapse:collapse">
            <thead >
              <tr style="text-align:center;color: #000000;font-size: 14px;height: 30px">
                <th>编号</th>
                <th>仓库号</th>
                <th>商品全名</th>
                <th>规格/柜号</th>
                <th>单位</th>
                <th>单重kg</th>
                <th>数量</th>
                <th>单价</th>
                <th>金额</th>
              </tr>
            </thead>
            <tbody style="text-align:center;font-size: 14px;color: #000000;">
              <tr v-for="(item, index) in billTiemList" :key="item.id" style="height: 30px">
                <td style="width: 80px">{{ index + 1 }}</td>
                <td style="width: 120px">{{ item.ware_name }}</td>
                <td style="width: 240px">{{ item.item_name }}</td>
                <td style="width: 110px">{{ item.item_class }}</td>
                <td style="width: 80px">{{ item.unit_name }}</td>
                <td style="width: 120px">{{ item.weight }}</td>
                <td style="width: 80px">{{ item.retention_number }}</td>
                <td style="width: 80px">{{ item.price }}</td>
                <td style="width: 80px">{{ item.price*item.retention_number }}</td>
              </tr>
              <tr align="center" style="height: 30px">
                <td>总计金额</td>
                <td colspan="5">{{ priceText }}</td>
                <td>{{ itemNumber }}</td>
                <td colspan="2">{{ itemPrice }}</td>
              </tr>
              <tr align="center" style="height: 50px">
                <td>备注</td>
                <td colspan="8">{{ billInfo.memo }}</td>
              </tr>
              <tr align="center" style="height: 30px;">
                <td>地址</td>
                <td colspan="8">{{ billInfo.address }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div style="width: 40px;height:205px;float: right;writing-mode:vertical-lr;color: #3A3A3A;font-size: 12px">
          <div style="float:left;width:20px; text-align:center;">第一联 (白) 财务联  第二联 (红) 客户联</div>
          <div style="float:right;width:20px;text-align:center;">第三联 (黄) 存档联</div>
        </div>
        <!--<div style="clear: both"/>-->
      </div>
    </div>
  </div>
</template>

<script>
import waves from '@/directive/waves' // Waves directive addWare editItemFind
// import { parseTime } from '@/utils'
import { getCoolieTypeOne } from '@/api/coolie'
import { getStockList, getBillInfo, editItemFind, setPickingStatus, setDeliveryStatus, deleteOutboundStock, deleteOutbount, outboundOk, abnormalOutbound, setMemoText } from '@/api/outbound'
import { getCustomerStore, createCustomer } from '@/api/customer'
import { getLodop } from '@/assets/LodopFuncs'

export default {
  name: 'ComplexTable',
  directives: { waves },
  inject: ['reload'],
  data() {
    return {
      // 单条数据提交
      form: {
        // accepting_number: ''
        retention_number: ''
      },
      formLabelWidth: '120px',
      // 自定义
      placeholder: '备注信息',
      abnormalStatus: { '0': '正常', '1': '异常' },
      statusName: { '1': '待打印', '2': '待拣货', '3': '待配送', '4': '配送中', '5': '已出库', '6': '已作废' },
      delivery: [], // 获取配送员数据
      picking: [], // 获取拣货员数据
      billTiemList: [],
      billInfo: [], // 获取单号基本信息
      dialogFormVisible: false, // 弹窗单条修改
      warehFormVisible: false, // 入库弹出
      itemInterim: [], // 临时装载物料数据
      customerList: [], // 客户列表
      deleteStock: false,
      disabled: false,
      disabledOne: false,
      disabledTwo: false,
      deleteVisible: false,
      isDisabled: false, // 防止点击两次提交
      kehuFormVisible: false, // 添加客户弹框
      outVisible: 0, // 出库批量验证,
      planCount: 0, // 计划量统计
      qrcode: '', // 二维码地址,
      itemNumber: 0, // 总预约量
      itemPrice: 0, // 合计金额
      priceText: '',
      // 提交数据
      sizeForm: {
        picker_id: [],
        delivery_id: [],
        memo: '',
        plate_number: '',
        customer: '',
        wagon_number: '',
        customer_id: ''
      },
      tempKehu: {
        customer_name: '',
        customer_phone: '',
        customer_company: '',
        remark: ''
      },
      // 验证coolie_id
      rules: {
        // picker_id: [{ required: true, message: '拣货员必选', trigger: 'change' }],
        // delivery_id: [{ required: true, message: '配送员必选', trigger: 'change' }]
        customer_name: [{ required: true, message: '客户名称必填！', trigger: 'blur' }]
      },
      sublitRules: '1',
      // 导出不能重复点两次
      downloadLoading: false,
      user: JSON.parse(localStorage.getItem('user'))
    }
  },
  created() {
    this.getCoolieType()
    this.getList()
    this.getBillInfo()
    this.getCustomerStore()
  },
  methods: {
    // 通过outboundId获取单号数据
    getList() {
      const outbound_id = this.$route.query.outbound_id
      getStockList(outbound_id).then(response => {
        response.data.forEach((e) => {
          e.count1 = (e.accepting_number * e.weight).toFixed(2)
          this.itemNumber += e.accepting_number
          this.itemPrice += e.accepting_number * e.price
        })
        // console.log(response.data)
        this.billTiemList = response.data
        this.priceText = this.changePrice(this.itemPrice)
      })
    },
    // 获取单号数据
    getBillInfo() {
      const outbound_id = this.$route.query.outbound_id
      if (outbound_id) {
        getBillInfo(outbound_id).then(response => {
          this.billInfo = response.data
          // 赋值
          this.sizeForm.customer_id = this.billInfo.customer_id
          this.sizeForm.plate_number = this.billInfo.plate_number
          this.sizeForm.wagon_number = this.billInfo.wagon_number
          this.sizeForm.memo = this.billInfo.memo
          this.qrcode = 'data:image/png;base64,' + this.billInfo.qrcode
          if (this.billInfo.status === 2) {
            this.disabledOne = true
          }
          if (this.billInfo.picker_ids) {
            this.disabled = true
            this.sizeForm.picker_id = this.billInfo.picker_ids
          }
          if (this.billInfo.delivery_ids) {
            this.disabledOne = true
            this.sizeForm.delivery_id = this.billInfo.delivery_ids
          }
          if (this.billInfo.memo) {
            this.sizeForm.memo = this.billInfo.memo
          }
        })
      }
    },
    // 初始化客户弹框
    initTempKehu() {
      this.tempKehu = {
        customer_name: '',
        customer_phone: '',
        customer_company: '',
        remark: ''
      }
    },
    // 获取员工数据数据
    getCoolieType() {
      const outbound_id = this.$route.query.outbound_id
      if (outbound_id) {
        getCoolieTypeOne().then(response => {
          this.picking = response.data.picking
          this.delivery = response.data.delivery
        })
      }
    },
    // 获取该商户客户信息
    getCustomerStore(callback) {
      getCustomerStore(this.user.uid).then(response => {
        this.customerList = response.data.customerOneList
        if (callback) {
          callback()
        }
      })
    },
    // 添加客户信息
    addCustomer() {
      this.kehuFormVisible = true
      this.initTempKehu()
    },
    customerOk() {
      this.$refs['tempKehu'].validate((valid) => {
        if (valid) {
          this.tempKehu.store_id = this.user.uid
          this.isDisabled = true
          createCustomer(this.tempKehu).then(response => {
            const data = response.data
            if (data.code === 1) {
              this.$message({
                message: data.msg,
                type: 'success'
              })
              this.getCustomerStore(() => {
                setTimeout(() => {
                  this.sizeForm.customer_id = Number(data.customer_id)
                  this.isDisabled = false
                }, 0)
              })
            } else {
              this.$message.error(data.msg)
            }
            this.kehuFormVisible = false
          })
        }
      })
    },
    // 单条修改弹出
    editItem(rew) {
      this.itemInterim = rew
      // this.form.accepting_number = rew.accepting_number
      this.form.price = rew.price
      this.form.retention_number = rew.retention_number
      this.dialogFormVisible = true
    },
    // 提交备注信息
    setMemoText() {
      if (!this.sizeForm.customer_id) {
        this.$message.error('请选择客户!')
        return
      }
      this.sizeForm.outbound_id = this.$route.query.outbound_id
      setMemoText(this.sizeForm).then(response => {
        const data = response.data
        if (data.code === 1) {
          this.$message({
            message: data.msg,
            type: 'success'
          })
          this.getBillInfo()
        } else {
          this.$message.error(data.msg)
          this.reload()
        }
      })
    },
    editConfirm() {
      this.form.id = this.itemInterim.id
      this.form.outbound_id = this.itemInterim.outbound_id
      this.form.accepting_number = this.itemInterim.accepting_number
      if (this.form.retention_number > (this.itemInterim.available_stock + this.itemInterim.retention_number) || this.form.retention_number === '') {
        this.$message.error('预约量不能大于可用数+之前预定量或不能为空！')
        return
      }
      if (this.form.price < 0) {
        this.$message.error('单价不能小于0')
        return
      }
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
          this.reload()
        }
      })
      this.dialogFormVisible = false
    },
    // 单条数据删除
    deleteStock1(rew) {
      rew.outboundStockLength = this.billTiemList.length
      deleteOutboundStock(rew).then(response => {
        const data = response.data
        if (data.code === 1) {
          this.$message({
            message: data.message,
            type: 'success'
          })
          this.reload()
        } else {
          this.$message.error(data.message)
          this.reload()
        }
      })
      this.deleteStock = false
    },
    getSummaries(param) {
      // console.log(param)
      const { columns, data } = param
      const sums = []
      // const retentionNumber = 0
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = '统计'
          return
        }
        if (index >= 5 && (index <= 10 && index !== 9)) {
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
      sums[10] = '￥' + sums[10]
      sums[8] = sums[8] + 'kg'
      return sums
    },
    // 拣货操作
    pickingClick() {
      if (this.sizeForm.picker_id.length === 0) {
        this.$message.error('拣货员必填！')
        return
      }
      setPickingStatus(this.$route.query.outbound_id, this.sizeForm.picker_id, this.sizeForm.memo).then(response => {
        // console.log(response)
        const data = response.data
        if (data.code === 1) {
          this.$message({
            message: data.msg,
            type: 'success'
          })
          this.reload()
          // this.$router.push('/basics/inbound')
        } else {
          this.$message.error(data.msg)
        }
      })
    },
    // 配送操作
    deliveryClick() {
      if (this.sizeForm.delivery_id.length === 0) {
        this.$message.error('配送员必填！')
        return
      }
      setDeliveryStatus(this.$route.query.outbound_id, this.sizeForm.delivery_id, this.sizeForm.memo).then(response => {
        const data = response.data
        if (data.code === 1) {
          this.$message({
            message: data.msg,
            type: 'success'
          })
          this.reload()
          // this.$router.push('/basics/inbound')
        } else {
          this.$message.error(data.msg)
        }
      })
    },
    warehousingEject() {
      if (this.sizeForm.picker_id.length === 0) {
        this.$message.error('拣货员必填！')
        return
      }
      if (this.sizeForm.delivery_id.length === 0) {
        this.$message.error('配送员必填！')
        return
      }
      this.warehFormVisible = true
    },
    // 出库操作
    outboundOk() {
      this.outVisible = 0
      this.billTiemList.forEach((e) => {
        if (e.accepting_number > e.retention_number || e.accepting_number === '') {
          this.outVisible = 1
        }
      })
      if (this.outVisible === 1) {
        this.$message.error('实际出库量不能大于预定数或不能为空！')
        return
      }
      this.isDisabled = true
      outboundOk(this.billTiemList, this.sizeForm).then(response => {
        const data = response.data
        if (data.code === 1) {
          this.$message({
            message: data.msg,
            type: 'success'
          })
          setTimeout(() => {
            this.isDisabled = false
          }, 2000)
          this.$router.push('/private/outbound')
        } else {
          this.$message.error(data.msg)
        }
      })
    },
    // 异常操作
    abnormalClick() {
      this.sizeForm.outbound_id = this.$route.query.outbound_id
      abnormalOutbound(this.sizeForm).then(response => {
        const data = response.data
        if (data.code === 1) {
          this.$message({
            message: data.msg,
            type: 'success'
          })
          // this.getList()
          this.$router.push('/private/outbound')
        } else {
          this.$message.error(data.msg)
        }
      })
      this.disabledTwo = false
    },
    // 打印状态删除单据包裹下的物料
    deleteOutbount() {
      if (!this.sizeForm.memo) {
        this.$message.error('请输入备注作废原因！')
        return
      }
      deleteOutbount(this.billTiemList, this.sizeForm.memo, this.$route.query.outbound_id).then(response => {
        const data = response.data
        if (data.code === 1) {
          this.$message({
            message: data.msg,
            type: 'success'
          })
          this.$router.push('/private/outbound')
        } else {
          this.$message.error(data.msg)
          this.reload()
        }
      })
      this.deleteVisible = false
    },
    // 删除未验收物料列表某一商品
    deleteItem(rew) {
      console.log(rew)
    },
    // 导出
    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['仓库库号', '物料名', '规格', '单位', '重量kg', '预约数量', '待出库量']
        const filterVal = ['ware_name', 'item_name', 'item_class', 'unit_name', 'weight', 'retention_number', 'accepting_number']
        const data = this.formatJson(filterVal, this.billTiemList)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: '出库单O' + this.billInfo.outbound_code
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
    // 打印
    printContent() {
      // 打印后改变状态
      const LODOP = getLodop()
      LODOP.PRINT_INIT('订货单')
      LODOP.SET_PRINT_STYLE('FontSize', 18)
      LODOP.SET_PRINT_STYLE('Bold', 1)
      LODOP.SET_PRINT_PAGESIZE(1, '215mm', '147mm', 'LodopCustomPage')// 设定纸张大小
      LODOP.ADD_PRINT_TEXT(50, 231, 260, 39)
      LODOP.ADD_PRINT_HTM(0, 0, '100%', '14cm', document.getElementById('subOutputRank-print').innerHTML)
      LODOP.PRINT()
      // LODOP.PREVIEW()
    },
    changePrice(n) {
      const fraction = ['角', '分']
      const digit = ['零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖']
      const unit = [['元', '万', '亿'], ['', '拾', '佰', '仟']]
      const head = n < 0 ? '欠' : ''
      n = Math.abs(n)
      var s = ''
      for (var i = 0; i < fraction.length; i++) {
        s += (digit[Math.floor(n * 10 * Math.pow(10, i)) % 10] + fraction[i]).replace(/零./, '')
      }
      s = s || '整'
      n = Math.floor(n)

      for (let i = 0; i < unit[0].length && n > 0; i++) {
        var p = ''
        for (var j = 0; j < unit[1].length && n > 0; j++) {
          p = digit[n % 10] + unit[1][j] + p
          n = Math.floor(n / 10)
        }
        s = p.replace(/(零.)*零$/, '').replace(/^$/, '零') + unit[0][i] + s
      }
      return head + s.replace(/(零.)*零元/, '元').replace(/(零.)+/g, '零').replace(/^整$/, '零元整')
    }
  }
}
</script>
<style>
  .fy{
    text-align:center;
    margin-top:30px;
  }
  #ssss:after{content:"";display:block;clear:both;}
</style>
