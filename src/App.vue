<template>
  <div>
    <header class="brand">
    <h5><a href="https://baixiaoyu2997.github.io/vue-gank/">干货集中营</a></h5>
    <p class="slogan">每日分享妹子图 和 技术干货，还有供大家中午休息的休闲视频</p>
    <img src="./assets/work.png" title="收心工作啦！">
  </header>
  <div id="app" v-if="show" class="container">
    <div class="preAndNext">
      <p><a href="javascript:void(0)" @click="doPre">{{preTitle}}</a></p>
      <p class="preAndNext_right"><a href="javascript:void(0)" @click="doNext">{{nextTitle}}</a></p>
    </div>
    <h1 class="header">{{currentMonth+"月"+currentDate+"日:"+headerTitle}}</h1>
    <hr>
    <div class="fuli">
      <img v-bind:src="fuliUrl">
    </div>
    <list v-if="iOS" :data-item="iOS" data-title="IOS"></list>
    <list v-if="Android" :data-item="Android" data-title="Android"></list>
    <list v-if="前端" :data-item="前端" data-title="前端"></list>
    <list v-if="瞎推荐" :data-item="瞎推荐" data-title="瞎推荐"></list>
    <list v-if="App" :data-item="App" data-title="App"></list>
    <list v-if="拓展资源" :data-item="拓展资源" data-title="拓展资源"></list>
    <list v-if="休息视频" :data-item="休息视频" data-title="休息视频"></list> 
    <p>感谢所有默默付出的编辑们，愿大家有美好一天。</p>
    <div class="preAndNext">
      <p><a href="javascript:void(0)" @click="doPre">{{preTitle}}</a></p>
      <p class="preAndNext_right"><a href="javascript:void(0)" @click="doNext">{{nextTitle}}</a></p>
    </div>
    <hr>
  </div>
  </div>
</template>

<script>
import list from './components/list.vue';
import axios from 'axios';

export default {
  name: 'app',
  data() {
    return {
    show: false,
    currentYear: "",
    currentMonth: "",
    currentDate: "",
    headerTitle: "",
    preTitle: "",
    nextTitle: "",
    headerDate: "",
    fuliUrl: "",
    Android: [],
    iOS: [],
    休息视频: [],
    前端: [],
    瞎推荐: [],
    福利: [],
    拓展资源: [],
    App: [],
    history: [],
  }
  },
  beforeCreate() {
    const vm=this;
    //获取最后一篇gank日期，并缓存history
    axios.get("https://gank.io/api/day/history")
      .then(function (v) {
        vm.history = v.data.results;
        [vm.currentYear, vm.currentMonth, vm.currentDate] = vm.history[0].split("-");
      })
      .catch(function (error) {
        console.log(error);
      });
  },
  computed: {
    preGank() {
      let index = this.history.indexOf(this.currentYear + "-" + this.currentMonth + "-" + this.currentDate);
      return (index != 0) && this.history[index - 1];
    },
    nextGank() {
      let index = this.history.indexOf(this.currentYear + "-" + this.currentMonth + "-" + this.currentDate);
      return (this.history.length - 1 != index) && this.history[index + 1];
    }
  },
   methods: {
    getDate(str) {
      let year = this.currentYear;
      let month = this.currentMonth;
      let date = this.currentDate;
      if (str == "pre") {
        return this.preGank && this.preGank.split("-");
      } else if (str == "next") {
        return this.nextGank && this.nextGank.split("-");
      }
      return [year, month, date]
    },
    getData(str) {
      let [year, month, date] = this.getDate(str);
      let vm=this;
      axios.get('https://gank.io/api/day/' + year + "/" + month +
          "/" + date)
        .then(function (r) {
          //清除原先数据
          [vm.iOS, vm.休息视频, vm.前端, vm.瞎推荐, vm.福利, vm.拓展资源, vm.App] = [];
          for (let x in r.data.results) {
            vm[x] = r.data.results[x];
          }
          vm.show = true;
          if (r.data.results["福利"]) {
            vm.fuliUrl = r.data.results["福利"][0].url;
          }
        })
    },
    getPreAndNextTitle(str) {
      let vm=this;
      //获取title
      if (!this.getDate(str)) {
        if (str == "pre") {
          vm.preTitle = "";
          return
        } else if (str == "next") {
          vm.nextTitle = "";
          return;
        }
      }
      let [year, month, date] = this.getDate(str);
      axios.get("https://gank.io/api/history/content/day/" + year + "/" + month + "/" +
          date)
        .then(function (v) {
          if (str == "pre") {
            vm.preTitle = v.data.results[0].title;
            return
          } else if (str == "next") {
            vm.nextTitle = v.data.results[0].title;
            return;
          }
          vm.headerTitle = document.title = v.data.results[0].title
        })
    },
    doNext() {
      let vm=this;
      [vm.currentYear, vm.currentMonth, vm.currentDate] = this.nextGank.split("-");
    },
    doPre() {
      let vm=this;
      [vm.currentYear, vm.currentMonth, vm.currentDate] = this.preGank.split("-");
    }
  },
  watch: {
    currentDate() {
      this.show = false;
      this.getData();
      this.getPreAndNextTitle();
      this.getPreAndNextTitle("pre");
      this.getPreAndNextTitle("next");
    }
  },
  components:{
    list
  }
}
</script>

<style lang="scss">
 * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

[v-cloak] {
    display: none !important;
}

html {
    font-size: 62.5%;
}

p {
    font-size: 1.5em;
}

body {
    background-image: url("./assets/bg.png"); 
    font-style: normal;
    font-variant: normal;
    font-stretch: normal;
    line-height: 2;
    font-family: 'Lantinghei SC', 'Microsoft Yahei', 'Hiragino Sans GB', 'Microsoft Sans Serif', 'WenQuanYi Micro Hei', sans-serif;
}

.brand {
    width: 80%;
    margin: 50px auto;
    text-align: center;
    clear: right;
    padding-top: 3em;
    padding-bottom: 1em;
    h5 {
        font-size: 2.4rem;
        font-family: Verdana, 'Helvetica Neue', 'Microsoft Yahei', 'Hiragino Sans GB', 'Microsoft Sans Serif', 'WenQuanYi Micro Hei', sans-serif;
        font-weight: 100;
        color: #000;
        line-height: 1.35;
        letter-spacing: -.05rem;
        a {
            text-align: center;
            color: #333;
            font-size: 1.2em;
            text-decoration: none;
        }
        @media screen and (max-width: 550px) {
            font-size: 1.8rem !important;
        }
    }
    .slogan {
        color: #000;
        margin: 1em;
        font-size: 0.95em;
    }
}

.container {
    background-color: #fff;
    box-shadow: 0 1px 6px rgba(0, 0, 0, 0.12);
    width: 80%;
    margin: 0 auto 40px;
    max-width: 960px;
    padding: 40px 60px;
    @media screen and (max-width: 550px) {
        width: 100%;
        padding: 2em 1em;
    }
    &>* {
        margin-bottom: 1.2em;
    }
    a {
        color: #4183c4;
        word-break: break-all;
        text-decoration: none;
        &:hover {
            text-decoration: underline;
            color: #0fa0ce;
        }
    }
    .preAndNext {
        display: flex;
        justify-content: space-between;
        margin-bottom: 0;
        flex-wrap: wrap;
        p {
            margin-bottom: 1.2em;
            flex: 0 0 47%;
            @media screen and (max-width: 550px) {
                flex: 0 0 100%;
            }
        }
        &_right {
            text-align: right;
        }
    }
    img {
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
        max-width: 100%;
        height: auto !important;
    }
   
    hr {
        height: 10px;
        border: none;
        border-bottom: 1px solid #cfcfcf;
    }
    .fuli {
        img {
            border: 4px solid #fff;
            width: 100%;
        }
    }
}
</style>
