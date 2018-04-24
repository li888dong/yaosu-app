<style scoped>
  .top-bar {
    width: 100%;
    height: 50px;
    line-height: 50px;
    font-size: 16px;
    background-color: #03A657;
    color: #ffffff;
    text-align: center;
    position: fixed;
    top: 0;
    z-index: 14;
  }

  .top-bar .icon-fanhui {
    position: absolute;
    left: 10px;
  }


  .pannel {
    background-color: #fff;
    margin-top: 5px;
    overflow: hidden;
    position: relative;
  }
  .list-item{
    font-size: 14px;
    padding: 10px;
    line-height: 22px;
  }
  .productname{
    color: #cc0000;
  }
  .no-data{
    margin: 5px;
    text-align: center;
  }
  .mgt_50{
    margin-top: 50px;
  }
</style>
<template>
  <div>
    <div class="top-bar" v-if="ua=='broswer'">
      <i class="icon iconfont icon-fanhui" @click="backWap"></i>
      <p v-if="type=='A'">供应信息</p>
      <p v-else>求购信息</p>
    </div>
    <!--采购列表-->
    <VueDataLoading
      :class="{mgt_50:ua=='broswer'}"
      :loading="loading"
      :completed="completed"
      :listens="['infinite-scroll']"
      :init-scroll="true"
      @infinite-scroll="infiniteScroll">
      <div class="list-item pannel" v-for="item in dataList">
        <p><span class="productname">{{item.productname}} ({{item.specifications}})</span></p>
        <p><span class="qualitystandard">数量：{{item.quantity}}</span></p>
        <p><span class="qualitystandard">企业名称：{{item.companyname}}</span></p>
        <p>
          <span class="qualitystandard">联系方式：{{item.contact}}</span>
          <span>-{{item.phone}}</span>
          <span class="fr">{{getDate(item.addtime)}}</span>
        </p>
      </div>
      <div slot="infinite-scroll-loading">加载中...</div>
    </VueDataLoading>
    <div v-if="dataList.length==0">
      <p class="no-data">暂无数据...</p>
    </div>
  </div>
</template>
<script>
//  字体图标
  import '../assets/iconfont/iconfont.css'
//  时间格式化函数
  import '../util/Dataformat'
//发网络请求的类库
  import axios from 'axios'
//滚动触底刷新的组件
  import VueDataLoading from 'vue-data-loading'
  // ajax请求数据格式化
  import qs from 'qs'
  // 配置ajax请求
  const instance = axios.create({
    // `transformRequest` 允许在向服务器发送前，修改请求数据
    // 只能用在 'PUT', 'POST' 和 'PATCH' 这几个请求方法
    // 后面数组中的函数必须返回一个字符串，或 ArrayBuffer，或 Stream
    transformRequest: [function (data) {
      // 对 data 进行任意转换处理
      return qs.stringify(data);
    }],
    // 开发地址
//      baseURL: "http://192.168.10.4:8086",
    // 线上地址
    baseURL: "https://yxrhome.com",
    timeout: 15000
  });
  export default {
    data() {
      return {
//        用以填充页面的数据
        dataList: [],
        page: 1,
        pageSize: 15,
        loading: false,
        completed: false
      }
    },
    computed:{
//      供应或者求购
      type(){
        return this.getParam('type')
      },
//      判断浏览器进入或者app进入
      ua(){
          return this.getParam('ua')
        }
    },
    methods: {
      fetchData() {
//        请求带过去的数据
        let reqData= {
          page:this.page,
          pageSize:this.pageSize,
          type:this.type
        };

        instance.post('/app/business/list',reqData)
          .then((res) => {
            if (res.data.status===200){
              this.dataList = this.dataList.concat(res.data.data.rows);
            } else if(res.data.status===300){
              this.completed = true
            }else {
              alert(res.data.msg);
            }

          })
          .catch((err) => {
            alert('网络错误')
          })
      },
      infiniteScroll() {
        this.fetchData();
        this.page++
      },
//      获取url中的参数
      getParam (name) {
        let search = document.location.search;
        //alert(search);
        let pattern = new RegExp("[?&]" + name + "\=([^&]+)", "g");
        let matcher = pattern.exec(search);
        let items = null;
        if (null != matcher) {
          try {
            items = decodeURIComponent(decodeURIComponent(matcher[1]));
          } catch (e) {
            try {
              items = decodeURIComponent(matcher[1]);
            } catch (e) {
              items = matcher[1];
            }
          }
        }
        return items;
      },
//      回到y.yaosuce.com
      backWap(){
        location.href = './index.html'
      },
      getDate(targetDate){
        let now = new Date();
        let _targetDate = new Date(targetDate);
        let year = _targetDate.getFullYear(); //得到年份
        let month = _targetDate.getMonth();//得到月份
        let date = _targetDate.getDate();//得到日期
        let day = _targetDate.getDay();//得到周几
        let hour = _targetDate.getHours();//得到小时
        let minu = _targetDate.getMinutes();//得到分钟
        let sec = _targetDate.getSeconds();//得到秒
        let MS = _targetDate.getMilliseconds();//获取毫秒
        let week;
        month = month + 1;
        if (month < 10) month = "0" + month;
        if (date < 10) date = "0" + date;
        if (hour < 10) hour = "0" + hour;
        if (minu < 10) minu = "0" + minu;
        if (sec < 10) sec = "0" + sec;
        if (MS < 100) MS = "0" + MS;
        let arr_week = ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"];
        week = arr_week[day];
        let time = "";
        time = year + "-" + month + "-" + date;
        if (now - targetDate>7*24*60*60*1000){
          return time
        }else if (now - targetDate>7*24*60*60*1000&&now - targetDate<30*24*60*60*1000){
          return '七天前'
        }else if (now - targetDate<7*24*60*60*1000&&now - targetDate>3*24*60*60*1000){
          return '三天前'
        }else if (now - targetDate>24*60*60*1000&&now - targetDate<2*24*60*60*1000){
          return '昨天'
        }else if (now - targetDate<24*60*60*1000){
          return '今天'
        }else {
          return time
        }
      }
    },
    components:{
      VueDataLoading
    }
  }
</script>
