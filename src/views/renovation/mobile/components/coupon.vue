<template>
  <div>
    <div class="coupon-nothing" v-loading="loading" v-if="!list.length">暂无优惠券</div>
    <div class="coupon" v-else>
      <div v-for="(item, index) in list" :key="index">
        <div class="coupon-desc">
          <span style="font-size: 20px">￥{{ item.price }}</span>
          <span style="font-size: 9px"
            >适用{{ item.type == "course" ? "课程" : "专栏" }}：{{
              item.value.title
            }}</span
          >
        </div>
        <div class="coupon-action">领取</div>
      </div>
    </div>
  </div>
</template>
<script>
import { fetchCoupon } from "@/api/marketing";
export default {
  data() {
    return {
      list: [],
      loading:false
    };
  },
  created() {
    this.getData();
  },
  methods: {
    getData() {
        this.loading = true
      fetchCoupon({
        page: 1,
        limit: 20,
        usable: 1,
      }).then((res) => {
        this.list = res.data.items;
      }).finally(()=>{
          this.loading = false
      })
    },
  },
};
</script>
<style>
.coupon {
  width: 100%;
  overflow-x: auto;
  padding: 10px;
  display: flex;
}
.coupon > div {
  display: flex;
  color: #ffffff;
  min-width: 200px;
  margin-right: 10px;
}
.coupon-desc {
  display: flex;
  flex-direction: column;
  justify-content: center;
  background-color: #d39e00;
  padding: 10px;
}
.coupon-desc span:last-child {
  font-size: 12px;
  margin-top: 5px;
}
.coupon-action {
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #ffc107;
  padding: 0 10px;
  font-size: 14px;
  width: 100px;
}
.coupon-nothing {
  color: #aaaaaa !important;
  padding: 20px 0;
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;
}
</style>