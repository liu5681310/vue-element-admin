<template>
  <div class="dashboard-editor-container">
    <panel-group />

    <el-row :gutter="20" style="margin-bottom:30px;">
      <el-col :span="12" :offset="0">
        <card-box title="运营小助手" :list="list1"></card-box>
      </el-col>
      <el-col :span="12" :offset="0">
        <card-box title="常见功能" :list="list2"></card-box>
      </el-col>
    </el-row>

    <el-row :gutter="20">
      <el-col :span="12" :offset="0">
        <course></course>
      </el-col>
      <el-col :span="12" :offset="0">
        <order></order>
      </el-col>
    </el-row>
    

  </div>
</template>

<script>
import PanelGroup from "./components/PanelGroup";
import CardBox from "./components/CardBox";
import Course from "./components/Course";
import Order from "./components/Order";

export default {
  name: "DashboardAdmin",
  components: {
    PanelGroup,
    CardBox,
    Course,
     Order
  },
  data() {
    return {
      list1: [
        {
          name: "拼团",
          remark: "多人拼团享受优惠",
          icon: "el-icon-guide",
          path:"Group"
        },
        {
          name: "秒杀",
          remark: "限时秒杀享低价",
          icon: "el-icon-thumb",
          path:"Flashsale"
        },
        {
          name: "优惠券",
          remark: "有偿激励课程推广",
          icon: "el-icon-news",
          path:"Coupon"
        },
        {
          name: "限时折扣",
          remark: "限时限量打折降价",
          icon: "el-icon-time",
          path:"Flashsale"
        },
      ],
      list2: [
        {
          name: "图文",
          remark: "图文课程",
          icon: "el-icon-copy-document",
          path:"Media"
        },
        {
          name: "音频",
          remark: "音频课程",
          icon: "el-icon-microphone",
          path:"Audio"
        },
        {
          name: "视频",
          remark: "视频课程",
          icon: "el-icon-video-camera",
          path:"Video"
        },
        {
          name: "专栏",
          remark: "专栏",
          icon: "el-icon-goods",
          path:"Column"
        },
      ],
    };
  },
  methods: {},
};
</script>

<style lang="scss" scoped>
.dashboard-editor-container {
  padding: 32px;
  background-color: rgb(240, 242, 245);
  position: relative;

  .github-corner {
    position: absolute;
    top: 0px;
    border: 0;
    right: 0;
  }

  .chart-wrapper {
    background: #fff;
    padding: 16px 16px 0;
    margin-bottom: 32px;
  }
}

@media (max-width: 1024px) {
  .chart-wrapper {
    padding: 8px;
  }
}
</style>
