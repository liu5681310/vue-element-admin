<template>
  <div>
    <navbar :showSidebar="false"></navbar>
    <div class="app-container">
      <div
        class="filter-container"
        style="display: flex; justify-content: space-between"
      >
        <el-button
          class="filter-item"
          style="margin-left: 10px"
          type="primary"
          icon="el-icon-edit"
          @click="handleCreate">
          添加角色
        </el-button>
      </div>

    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%"
    >
      <el-table-column label="角色KEY">
        <template slot-scope="{ row }">
          {{ row.role_id }}
        </template>
      </el-table-column>
      <el-table-column label="角色名称" class-name="status-col" width="150">
        <template slot-scope="{ row }">
          {{ row.name }}
        </template>
      </el-table-column>
      <el-table-column label="角色描述" width="150px" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.desc }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" class-name="status-col" width="100">
        <template slot-scope="{row}">
            <el-tag :type="row.status ? 'success' : 'danger'">
                {{ row.status | statusFilter }}
            </el-tag>
        </template>
    </el-table-column>
      <el-table-column
        label="操作"
        align="center"
        width="230"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="{ row, $index }">
          <div v-if=" row.id != 4">
            <el-button type="primary" size="mini" @click="handleUpdate(row)">
            修改
          </el-button>
          <el-button type="warning" size="mini" @click="openSetRoles(row,true)">
            修改权限
          </el-button>
          <el-button size="mini" type="danger" @click="handleDelete(row,$index)">
            删除
          </el-button>
          </div>
          <div v-else>
            <el-button type="primary" size="mini" @click="openSetRoles(row)">
            查看权限
          </el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.limit"
      @pagination="getList"
    />

    <el-dialog :title="editRole ? '修改权限': '查看权限'" :visible.sync="rolesVisible">
      <el-form
        ref="dataForm"
        label-position="left"
        label-width="70px"
        style="margin-left: 50px"
      >
        <el-form-item label="角色名称"> {{ role.name }} </el-form-item>
        <el-form-item label="菜单">
          <el-tree check-strictly default-expand-all :show-checkbox="editRole" node-key="id" :data="editRole ? all.menus : role.menus" :props="defaultProps" :default-checked-keys="role.menusId" @check="handleMenusCheckChange"></el-tree>
        </el-form-item>
        <el-form-item label="权限">
          <el-tree check-strictly default-expand-all @check="handleAccessesCheckChange" :show-checkbox="editRole" node-key="id" :data="editRole ? all.accesses : role.accesses" :props="defaultProps" :default-checked-keys="role.accessesId"></el-tree>
        </el-form-item>
      </el-form>
      <div v-if="editRole" slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handleSetRoles">
             {{ dialogBtnLoading ? '提交中...' : '提交' }}
        </el-button>
    </div>
    </el-dialog>


<el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
    <el-form ref="form" :rules="rules" :model="temp" label-position="left" label-width="70px" style=" margin-left:50px;">
        <el-form-item label="角色名称" prop="name">
            <el-input v-model="temp.name" />
        </el-form-item>
        <el-form-item label="角色标识" prop="role_id">
            <el-input v-model="temp.role_id" />
        </el-form-item>
        <el-form-item label="状态">
             <el-radio-group v-model="temp.status">
                <el-radio :label="0">禁用</el-radio>
                <el-radio :label="1">启用</el-radio>
            </el-radio-group>
        </el-form-item>
        <el-form-item label="角色标识" prop="desc">
            <el-input v-model="temp.desc" type="textarea" :rows="3"/>
        </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()" :loading="dialogBtnLoading">
             {{ dialogBtnLoading ? '提交中...' : '提交' }}
        </el-button>
    </div>
</el-dialog>

  </div>
  </div>
</template>

<script>
import { fetchRole,readRole,addRole,updateRole,deleteRole,setrules } from "@/api/role";
import { fetchAccess } from "@/api/access";
import Navbar from "@/layout/components/Navbar";
import waves from "@/directive/waves"; // waves directive
import Pagination from "@/components/Pagination"; // secondary package based on el-pagination

const statusOptions = {
    0:"禁用",
    1:"启用"
}

export default {
  name: "ComplexTable",
  components: {
    Pagination,
    Navbar
  },
  directives: {
    waves,
  },
  filters: {
      statusFilter(status) {
          return statusOptions[status]
      }
  },
  data() {
    return {
      dialogBtnLoading:false,

      all:{
        menus:[],
        accesses:[],
      },

      editRole:false,
      role:{
        id:0,
        name:"",
        menus:[],
        accesses:[],
        menusId:[],
        accessesId:[],
      },
      defaultProps: {
        children: "children",
        label: "title",
      },
      rolesVisible: false,

      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
      },


      statusOptions,
      temp: {
          id: undefined,
          name: '',
          role_id:"",
          desc:"",
          status: 1,
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
          update: '修改',
          create: '新增'
      },
      rules: {
          name: [{
              required: true,
              message: '角色名称不能为空',
              trigger: 'blur'
          }],
          role_id: [{
              required: true,
              message: '角色标识不能为空',
              trigger: 'blur'
          }],
      },
    };
  },
  created() {
    this.getList();
    this.getRules()
  },
  methods: {
    handleMenusCheckChange(a,b){
      this.role.menusId = b.checkedKeys
    },
    handleAccessesCheckChange(a,b){
      this.role.accessesId = b.checkedKeys
    },
    getRules(){
      fetchAccess({
        type:"rule"
      }).then(res=>{
        this.all.accesses = res.data.items
      })
      fetchAccess({
        type:"menu"
      }).then(res=>{
        this.all.menus = res.data.items
      })
    },
    openSetRoles(row,edit = false) {
      this.role = {
        id:0,
        name:"",
        menus:[],
        accesses:[],
        menusId:[],
        accessesId:[],
      }
      this.editRole = edit
      this.listLoading = true
      readRole({
        id:row.id
      }).then(res=>{
        // console.log(res)
        this.role = res.data
        this.role.id = row.id
        this.rolesVisible = true;
      }).finally(()=>{
        this.listLoading = false
      })
    },
    handleSetRoles() {
      this.dialogBtnLoading = true
      console.log([...this.role.menusId,...this.role.accessesId ]);
      setrules({
        role_id:this.role.id,
        access_ids:[...this.role.menusId,...this.role.accessesId ]
      }).then(res=>{
        this.$message.success('配置权限成功')
      }).finally(()=>{
        this.dialogBtnLoading = false
        this.rolesVisible = false;
      })
    },
    getList() {
      this.listLoading = true;
      fetchRole(this.listQuery).then((response) => {
        // console.log(response);
        this.list = response.data.items;
        this.total = response.data.total;

        this.listLoading = false;
      });
    },
    resetTemp() {
        this.temp = {
          id: undefined,
          name: '',
          role_id:"",
          desc:"",
          status: 1,
        }
    },
    handleCreate() {
        this.resetTemp()
        this.dialogStatus = 'create'
        this.dialogFormVisible = true
        this.$nextTick(() => {
            this.$refs['form'].clearValidate()
        })
    },
    createData() {
        this.$refs['form'].validate((valid) => {
            if (valid) {
                this.dialogBtnLoading = true
                addRole(this.temp).then(() => {
                    this.getList()
                    this.dialogFormVisible = false
                    this.$notify({
                        title: 'Success',
                        message: 'Created Successfully',
                        type: 'success',
                        duration: 2000
                    })
                }).finally(()=>{
                    this.dialogBtnLoading = false
                })
            }
        })
    },
    handleUpdate(row) {
        this.temp = Object.assign({}, row) // copy obj
        this.dialogStatus = 'update'
        this.dialogFormVisible = true
        this.$nextTick(() => {
            this.$refs['form'].clearValidate()
        })
    },
    updateData() {
        this.$refs['form'].validate((valid) => {
            if (valid) {
                const tempData = Object.assign({}, this.temp)
                this.dialogBtnLoading = true
                updateRole(tempData).then(() => {
                    const index = this.list.findIndex(v => v.id === this.temp.id)
                    this.list.splice(index, 1, this.temp)
                    this.dialogFormVisible = false
                    this.$notify({
                        title: 'Success',
                        message: 'Update Successfully',
                        type: 'success',
                        duration: 2000
                    })
                }).finally(()=>{
                    this.dialogBtnLoading = false
                })
            }
        })
    },
    handleDelete(row, index) {
        this.$confirm('是否要删除该社区', '提示', {
            confirmButtonText: '删除',
            cancelButtonText: '取消',
            type: 'warning',
        }).then(action => {
            this.listLoading = true
            deleteRole({
                ids:[row.id]
            }).then(response=>{
                this.$notify({
                    title: '提示',
                    message: '删除成功',
                    type: 'success',
                    duration: 2000
                })
                this.getList()
            }).finally(()=>{
                this.listLoading = false
            })
        })
    },

  },
};
</script>
