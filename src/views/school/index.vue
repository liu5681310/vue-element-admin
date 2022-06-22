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
          @click="handleCreate"
        >
          添加网校
        </el-button>
      </div>

        <el-row :gutter="20">
            <el-col :span="8" :offset="0" v-for="(item,index) in list" :key="index">
                <el-card shadow="hover" style="margin-bottom:10px;">
                   <div style="display:flex;align-items: center;justify-content: space-between;">
                        {{ item.name }}
                        <el-button type="text" size="mini" @click="openSchool(item)">管理</el-button>
                        
                   </div>
                </el-card>
            </el-col>
        </el-row>

    </div>


    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.limit"
      @pagination="getList"
    />

    <el-dialog title="添加网校" :visible.sync="dialogFormVisible">
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="temp"
        label-position="left"
        label-width="70px"
        style="margin-left: 50px"
      >
        <el-form-item label="网校名称" prop="name">
          <el-input v-model="temp.name" placeholder="网校名称" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false"> 取消 </el-button>
        <el-button type="primary" @click="createData"> 提交 </el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
    import {
        fetchSchool,
        createSchool,
    } from '@/api/school'
    import {
        setSchoolid,
    } from '@/utils/auth'
    import Navbar from "@/layout/components/Navbar";
    import waves from "@/directive/waves"; // waves directive
    import Pagination from "@/components/Pagination"; // secondary package based on el-pagination
    export default {
        directives: {
            waves,
        },
        components: {
            Navbar,
            Pagination,
        },
        data() {
            return {
                list: null,
                total: 0,
                listLoading: true,
                listQuery: {
                    page: 1,
                    limit: 20,
                },
                temp: {
                    name: "",
                },
                dialogFormVisible: false,
                dialogStatus: "",
                textMap: {
                    update: "修改",
                    create: "新增",
                },
                rules: {
                    name: [{
                        required: true,
                        message: "网校名称不能为空",
                        trigger: "blur",
                    }, ],
                },
            };
        },
        created() {
            this.getList();
        },
        methods: {
            openSchool(item) {
                setSchoolid(item.id)
                this.$router.push({
                    name: "Dashboard"
                })
            },
            getList() {
                this.listLoading = true;
                fetchSchool(this.listQuery).then((response) => {
                    console.log(response);
                    this.list = response.data.items;
                    this.total = response.data.total;

                    this.listLoading = false;
                });
            },
            resetTemp() {
                this.temp = {
                    name:""
                };
            },
            handleCreate() {
                this.resetTemp();
                this.dialogStatus = "create";
                this.dialogFormVisible = true;
                this.$nextTick(() => {
                    this.$refs["dataForm"].clearValidate();
                });
            },
            createData() {
                this.$refs["dataForm"].validate((valid) => {
                    if (valid) {
                        createSchool(this.temp).then(() => {
                            this.getList()
                            this.dialogFormVisible = false;
                            this.$notify({
                                title: "Success",
                                message: "创建网校成功",
                                type: "success",
                                duration: 2000,
                            });
                        });
                    }
                });
            },
        },
    };
</script>