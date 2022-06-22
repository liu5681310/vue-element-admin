<template>
  <div>
    <div style="height: 5px; background-color: #eeeeee"></div>
    <el-card shadow="never" v-loading="loading">
      <div slot="header" class="list-card-header">
        <span>{{ listType == "group" ? "拼团" : "限时秒杀" }}</span>
      </div>
      <div style="white-space: nowrap; overflow-x: auto">
        <div
          v-for="(item, index) in list"
          :key="index"
          style="width: 160px; display: inline-block; margin-right: 10px"
        >
          <img :src="item.value.cover" style="width: 100%" />
          <div>
            <div class="list-title">{{ item.value.title }}</div>
            <div class="list-desc" v-html="item.try"></div>
            <div class="list-price">
              <span
                >{{ listType == "group" ? "拼团" : "限时" }}￥{{
                  item.price
                }}</span
              >
              <span>￥{{ item.value.price }}</span>
            </div>
          </div>
        </div>
      </div>
    </el-card>
  </div>
</template>
<script>
import { fetchGroup, fetchFlashsale } from "@/api/marketing";
export default {
  props: {
    listType: {
      type: String,
      default: "group",
    },
  },
  data() {
    return {
      list: [],
      loading: false,
    };
  },
  watch:{
      listType(newVal,oldVal){
          this.getData()
      }
  },
  created() {
    this.getData();
  },
  methods: {
    getData() {
      this.loading = true;
      let fun = this.listType == 'group' ? fetchGroup : fetchFlashsale
      fun({
        page: 1,
        limit: 10,
        usable: 1,
        status: 1,
      })
        .then((res) => {
          this.list = res.data.items
        })
        .finally(() => {
          this.loading = false;
        });
    },
  },
};
</script>
<style>
.componnent-no-data {
  border: 1px solid #cccccc;
  background-color: #eeeeee;
  color: #cccccc;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 15px 0;
}

.list-card-header {
  border-bottom: 0;
}

.list-card-more {
  float: right;
  padding: 0;
  color: #999999;
}

.list-title {
  font-size: 14px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin: 5px 0;
}

.list-desc {
  font-size: 12px;
  color: #999999;
  margin: 5px 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.list-price {
  display: flex;
  align-items: flex-end;
}

.list-price span:first-child {
  color: red;
}

.list-price span:last-child {
  color: #888888;
  margin-left: 5px;
  font-size: 10px;
}
</style>