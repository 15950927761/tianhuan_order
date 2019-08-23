<template>
  <div class="app-container">
    <div v-show="billInfo.status !== 7" class="filter-container">
      <!--<el-select v-model="listQuery.importance" :placeholder="$t('table.importance')" clearable style="width: 90px" class="filter-item">-->
      <!--<el-option v-for="item in importanceOptions" :key="item" :label="item" :value="item"/>-->
      <!--</el-select>-->
      <el-button v-waves :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-download" @click="handleDownload">{{ $t('table.export') }}</el-button>
      <el-popover
        v-show="billInfo.status == 1"
        v-model="deleteVisible"
        placement="top"
        width="160"
      >
        <p>你确定要作废吗？</p>
        <div style="text-align: right; margin: 0">
          <el-button size="mini" type="text" @click="deleteVisible = false">取消</el-button>
          <el-button type="primary" size="mini" @click="deleteOutbount()">确定</el-button>
        </div>
        <el-button slot="reference" class="filter-item" style="margin-left: 10px;" type="danger">作废</el-button>
      </el-popover>
      <!--:data="list"<el-button v-waves :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-download" @click="handleDownload">{{ $t('table.export') }}</el-button>-->
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
    <div class="filter-container" style="padding: 15px 0;border:1px dashed #eee;">
      <el-form ref="form" :model="sizeForm" :rules="rules" label-width="80px" size="mini">
        <el-row>
          <el-col :span="8">
            <div class="grid-content bg-purple">
              <el-form-item label="单号:">
                <div>
                  <div><span>O{{ billInfo.diaohuo_code }}</span></div>
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
                  <el-form-item label="来源:" prop="source">
                    <div>
                      <template>
                        <div>
                          <el-input :disabled="billInfo.status !== 1" v-model="sizeForm.source" placeholder="请输入来源"/>
                        </div>
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
                      <el-input :disabled="billInfo.status !== 1" v-model="sizeForm.customer" placeholder="请输入客户"/>
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
            <el-button v-waves v-show="billInfo.status == 1" class="filter-item" style="margin-top: 10px" type="primary" @click="printContent()">提交</el-button>
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
            width="80" />
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
            width="100" />
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
            <!--<el-form-item :label-width="formLabelWidth" label="可用库存：">
              <span><el-tag>{{ itemInterim.available_stock }}</el-tag></span>
            </el-form-item>-->
            <el-form-item :label-width="formLabelWidth" label="预约数量：">
              <el-input v-model="form.retention_number" style="width:40%" size="mini"/>
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
    <div v-show="false" id="subOutputRank-print" style="width: 96%;padding: 2%">
      <div style="width: 100%;">
        <div style="width: 74%;float: left">
          <h3 style="text-align: right;margin-right: 50px"><span>苏州天环冷链物流有限公司调货通知单</span></h3>
          <div class="outbound">
            <p>
              <span>单据号：{{ billInfo.diaohuo_code }}</span>
              <span style="margin-left:15px">商户：{{ billInfo.storeName }}</span>
              <span v-if="billInfo.printing_time" style="margin-left:15px">打印日期：{{ billInfo.printing_time | parseTime('{h}:{i}:{s} {y}-{m}-{d}') }}</span>
              <span v-else style="margin-left:15px">打印日期：----------</span>
            </p>
            <p>
              <span>车牌：{{ billInfo.plate_number }}</span>
              <span style="margin-left:15px">地址：{{ billInfo.wagon_number }}</span>
              <span style="margin-left:15px">客户：{{ billInfo.customer }}</span>
            </p>
          </div>
          <div style="clear: both"/>
        </div>
        <div style="width: 24%;float: left;text-align: center">
          <img :src="qrcode" style="width: 70px;padding-top: 10px" alt="">
        </div>
      </div>
      <div style="width: 100%;">
        <div v-show="false" style="clear: both">1</div>
        <div style="width: 94%;float: left">
          <table border="1" style="width:100%;align:center;bordercolor:#DEDEDE;cellspacing:0;border-collapse:collapse">
            <thead >
              <tr style="text-align:center;color: #000000;font-size: 14px;height: 30px">
                <th>序号</th>
                <th>仓库号</th>
                <th>物料名</th>
                <th>规格/柜号</th>
                <th>批次</th>
                <th>单位</th>
                <th>重量kg(单重)</th>
                <th>计划量</th>
                <th>实际量</th>
              </tr>
            </thead>
            <tbody style="text-align:center;font-size: 14px;color: #000000;">
              <tr v-for="(item, index) in billTiemList" :key="item.id" style="height: 30px">
                <td style="width: 80px">{{ index + 1 }}</td>
                <td style="width: 120px">{{ item.ware_name }}</td>
                <td style="width: 240px">{{ item.item_name }}</td>
                <td style="width: 110px">{{ item.item_class }}</td>
                <td style="width: 150px">{{ item.batch_time }}</td>
                <td style="width: 80px">{{ item.unit_name }}</td>
                <td style="width: 120px">{{ item.weight }}</td>
                <td style="width: 80px">{{ item.retention_number }}</td>
                <!--<td style="width: 80px">{{ item.accepting_number }}</td>-->
                <td style="width: 80px" />
              </tr>
              <tr align="center" style="height: 30px">
                <td>合计</td>
                <td/>
                <td/>
                <td/>
                <td/>
                <td/>
                <td/>
                <td>{{ planCount }}</td>
                <td/>
              </tr>
              <tr align="center" style="height: 50px">
                <td>备注</td>
                <td colspan="8">{{ billInfo.memo }}</td>
              </tr>
              <tr align="center" style="height: 30px;">
                <td>库管员</td>
                <td colspan="2"/>
                <td>收货人</td>
                <td colspan="2"/>
                <td>制单人</td>
                <td colspan="2">{{ billInfo.billerName }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div style="width: 40px;height:205px;float: right;writing-mode:vertical-lr;color: #3A3A3A;font-size: 12px">
          <div style="float:left;width:20px; text-align:center;">第一联 (白) 财务联  第二联 (红) 客户联</div>
          <div style="float:right;width:20px;text-align:center;">第三联 (黄) 存档联</div>
        </div>
        <div style="clear: both"/>
      </div>
    </div>
  </div>
</template>

<script>
import waves from '@/directive/waves' // Waves directive addWare editItemFind
// import { parseTime } from '@/utils'
import { getCoolieTypeOne } from '@/api/coolie'
import { getStockList, getBillInfo, editItemFind, deleteOutboundStock, deleteOutbount, setPrivateLodopStatus } from '@/api/diaohuo'
import { getStoreWareList } from '@/api/inbound'
// import { getLodop } from '@/assets/LodopFuncs'

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
      wareList: [], // 根据商户id获取所有仓库库号
      billTiemList: [],
      billInfo: [], // 获取单号基本信息
      dialogFormVisible: false, // 弹窗单条修改
      warehFormVisible: false, // 入库弹出
      itemInterim: [], // 临时装载物料数据
      deleteStock: false,
      disabled: false,
      disabledOne: false,
      disabledTwo: false,
      deleteVisible: false,
      isDisabled: false, // 防止点击两次提交
      outVisible: 0, // 出库批量验证,
      planCount: 0, // 计划量统计
      qrcode: '', // 二维码地址
      // 提交数据
      sizeForm: {
        picker_id: [],
        delivery_id: [],
        memo: '',
        plate_number: '',
        customer: '',
        wagon_number: '',
        source: ''
      },
      // 验证coolie_id
      rules: {
        // picker_id: [{ required: true, message: '拣货员必选', trigger: 'change' }],
        // delivery_id: [{ required: true, message: '配送员必选', trigger: 'change' }]
      },
      sublitRules: '1',
      // 导出不能重复点两次
      downloadLoading: false,
      user: JSON.parse(localStorage.getItem('user'))
    }
  },
  created() {
    this.getCoolieType()
    this.getStoreWareList()
    this.getList()
    this.getBillInfo()
  },
  methods: {
    // 通过outboundId获取单号数据
    getList() {
      const diaohuo_id = this.$route.query.diaohuo_id
      getStockList(diaohuo_id).then(response => {
        response.data.list.forEach((e) => {
          e.count1 = (e.accepting_number * e.weight).toFixed(2)
        })
        // console.log(response.data)
        this.billTiemList = response.data.list
        this.planCount = response.data.planCount
      })
    },
    // 获取单号数据
    getBillInfo() {
      const diaohuo_id = this.$route.query.diaohuo_id
      if (diaohuo_id) {
        getBillInfo(diaohuo_id).then(response => {
          this.billInfo = response.data
          // 赋值
          this.sizeForm.customer = this.billInfo.customer
          this.sizeForm.plate_number = this.billInfo.plate_number
          this.sizeForm.wagon_number = this.billInfo.wagon_number
          this.sizeForm.memo = this.billInfo.memo
          this.sizeForm.source = this.billInfo.source
          this.qrcode = 'data:image/png;base64,' + this.billInfo.qrcode
          if (this.billInfo.status === 1 && this.user.uid !== 1) {
            this.disabledOne = true
            this.disabled = true
          }
          if (this.billInfo.status === 2) {
            this.disabledOne = true
          }
          if (this.billInfo.status > 2) {
            this.disabled = true
          }
          if (this.billInfo.status > 3) {
            this.disabledOne = true
          }
          this.billInfo.picker_ids ? this.sizeForm.picker_id = this.billInfo.picker_ids : false
          this.billInfo.delivery_ids ? this.sizeForm.delivery_id = this.billInfo.delivery_ids : false
        })
      }
    },
    // 获取员工数据数据
    getCoolieType() {
      const diaohuo_id = this.$route.query.diaohuo_id
      if (diaohuo_id) {
        getCoolieTypeOne().then(response => {
          this.picking = response.data.picking
          this.delivery = response.data.delivery
        })
      }
    },
    // 获取仓库库号
    getStoreWareList() {
      const diaohuo_id = this.$route.query.diaohuo_id
      getStoreWareList(diaohuo_id).then(response => {
        this.wareList = response.data
      })
    },
    // 单条修改弹出
    editItem(rew) {
      this.itemInterim = rew
      // this.form.accepting_number = rew.accepting_number
      this.form.retention_number = rew.retention_number
      this.dialogFormVisible = true
    },
    editConfirm() {
      this.form.id = this.itemInterim.id
      this.form.accepting_number = this.itemInterim.accepting_number
      this.form.diaohuo_id = this.$route.query.diaohuo_id
      // if (this.form.retention_number > (this.itemInterim.available_stock + this.itemInterim.retention_number) || this.form.retention_number === '') {
      //   this.$message.error('预约量不能大于可用数+之前预定量或不能为空！')
      //   return
      // }
      if (this.form.retention_number === '') {
        this.$message.error('预约量不能为空！')
        return
      }
      editItemFind(this.form).then(response => {
        const data = response.data
        if (data.code === 1) {
          this.$message({
            message: data.msg,
            type: 'success'
          })
          this.getList()
        } else {
          this.$message.error(data.msg)
          this.reload()
        }
      })
      this.dialogFormVisible = false
    },
    // 单条数据删除
    deleteStock1(rew) {
      rew.diaohuoStockLength = this.billTiemList.length
      deleteOutboundStock(rew).then(response => {
        const data = response.data
        if (data.code === 1) {
          this.$message({
            message: data.msg,
            type: 'success'
          })
          this.reload()
        } else {
          this.$message.error(data.msg)
          this.reload()
        }
      })
      this.deleteStock = false
    },
    // 提交单据信息
    printContent() {
      if (this.billInfo.status === 1) {
        this.sizeForm.diaohuo_id = this.$route.query.diaohuo_id
        setPrivateLodopStatus(this.sizeForm).then(response => {
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
      }
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
    // 打印状态删除单据包裹下的物料
    deleteOutbount() {
      if (!this.sizeForm.memo) {
        this.$message.error('请输入备注作废原因！')
        return
      }
      deleteOutbount(this.billTiemList, this.sizeForm.memo, this.$route.query.diaohuo_id).then(response => {
        const data = response.data
        if (data.code === 1) {
          this.$message({
            message: data.msg,
            type: 'success'
          })
          this.$router.push('/private/diaohuo')
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
          filename: '出库单O' + this.billInfo.diaohuo_code
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
