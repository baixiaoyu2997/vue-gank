Vue.component("list", {
  props: ["dataItem", "dataTitle"],
  template: `
      <div>
        <h3 class="header h3">{{dataTitle}}</h3>
        <ul class="list_ul">
          <li v-for="di in dataItem">
            <a :href="di.url">{{di.desc}}</a>&nbsp;({{di.who?di.who:'None'}})
            <ul v-if="di.images">
              <li v-for="diImages in di.images" class="list_image"><a :href="di.url" target="_blank"><img :src="diImages" :title="di.desc"></a></li>
            </ul>
          </li>
        </ul>
     </div>
      `
})

let vm = new Vue({
  el: '#app',
  data: {
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
  },
  beforeCreate() {
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
      [vm.currentYear, vm.currentMonth, vm.currentDate] = this.nextGank.split("-");
    },
    doPre() {
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
  }
})