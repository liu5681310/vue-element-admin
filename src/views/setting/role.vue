<template>
  <div class="app-container">
    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%"
    >
      <el-table-column label="角色KEY" min-width="180px">
        <template slot-scope="{ row }">
          {{ row.role_id }}
        </template>
      </el-table-column>
      <el-table-column label="角色名称" class-name="status-col" width="100">
        <template slot-scope="{ row }">
          {{ row.name }}
        </template>
      </el-table-column>
      <el-table-column label="角色描述" width="150px" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.desc }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        align="center"
        width="230"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="{ row, $index }">
          <el-button type="primary" size="mini" @click="openSetRoles(row)">
            查看权限
          </el-button>
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

    <el-dialog title="查看权限" :visible.sync="rolesVisible">
      <el-form
        ref="dataForm"
        label-position="left"
        label-width="70px"
        style="margin-left: 50px"
      >
        <el-form-item label="角色名称"> {{ role.name }} </el-form-item>
        <el-form-item label="菜单">
          <el-tree :data="role.menus" :props="defaultProps"></el-tree>
        </el-form-item>
        <el-form-item label="权限">
          <el-tree :data="role.accesses" :props="defaultProps"></el-tree>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { fetchRole,readRole } from "@/api/user";

import waves from "@/directive/waves"; // waves directive
import Pagination from "@/components/Pagination"; // secondary package based on el-pagination

export default {
  name: "ComplexTable",
  components: {
    Pagination,
  },
  directives: {
    waves,
  },
  data() {
    return {
      role:{
        name:"",
        menus:[],
        accesses:[]
      },
      defaultProps: {
        children: "children",
        label: "title",
      },

      roles: [
        {
          id: 1,
          name: "超级管理员",
        },
        {
          id: 2,
          name: "运营",
        },
      ],
      roleTemp: {
        role_ids: [],
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
    };
  },
  created() {
    this.getList();
  },
  methods: {
    openSetRoles(row) {
      readRole({
        id:row.id
      }).then(res=>{
        console.log(res)
        this.role = res.data
        this.rolesVisible = true;
      })
    },
    handleSetRoles() {
      this.rolesVisible = false;
    },
    getList() {
      this.listLoading = true;
      fetchRole(this.listQuery).then((response) => {
        console.log(response);
        this.list = response.data.items;
        this.total = response.data.total;

        this.listLoading = false;
      });
    },
  },
};
</script>