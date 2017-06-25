"use strict";

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

Vue.component("list", {
  props: ["dataItem", "dataTitle"],
  template: "\n      <div>\n        <h3 class=\"header h3\">{{dataTitle}}</h3>\n        <ul class=\"list_ul\">\n          <li v-for=\"di in dataItem\">\n            <a :href=\"di.url\">{{di.desc}}</a>&nbsp;({{di.who?di.who:'None'}})\n            <ul v-if=\"di.images\">\n              <li v-for=\"diImages in di.images\" class=\"list_image\"><a :href=\"di.url\" target=\"_blank\"><img :src=\"diImages\" :title=\"di.desc\"></a></li>\n            </ul>\n          </li>\n        </ul>\n     </div>\n      "
});

var vm = new Vue({
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
    history: []
  },
  beforeCreate: function beforeCreate() {
    //获取最后一篇gank日期，并缓存history
    axios.get("https://gank.io/api/day/history").then(function (v) {
      vm.history = v.data.results;

      var _vm$history$0$split = vm.history[0].split("-");

      var _vm$history$0$split2 = _slicedToArray(_vm$history$0$split, 3);

      vm.currentYear = _vm$history$0$split2[0];
      vm.currentMonth = _vm$history$0$split2[1];
      vm.currentDate = _vm$history$0$split2[2];
    }).catch(function (error) {
      console.log(error);
    });
  },

  computed: {
    preGank: function preGank() {
      var index = this.history.indexOf(this.currentYear + "-" + this.currentMonth + "-" + this.currentDate);
      return index != 0 && this.history[index - 1];
    },
    nextGank: function nextGank() {
      var index = this.history.indexOf(this.currentYear + "-" + this.currentMonth + "-" + this.currentDate);
      return this.history.length - 1 != index && this.history[index + 1];
    }
  },
  methods: {
    getDate: function getDate(str) {
      var year = this.currentYear;
      var month = this.currentMonth;
      var date = this.currentDate;
      if (str == "pre") {
        return this.preGank && this.preGank.split("-");
      } else if (str == "next") {
        return this.nextGank && this.nextGank.split("-");
      }
      return [year, month, date];
    },
    getData: function getData(str) {
      var _getDate = this.getDate(str),
          _getDate2 = _slicedToArray(_getDate, 3),
          year = _getDate2[0],
          month = _getDate2[1],
          date = _getDate2[2];

      axios.get('https://gank.io/api/day/' + year + "/" + month + "/" + date).then(function (r) {

        for (var x in r.data.results) {
          vm[x] = r.data.results[x];
        }
        vm.show = true;
        if (r.data.results["福利"]) {
          vm.fuliUrl = r.data.results["福利"][0].url;
        }
      });
    },
    getPreAndNextTitle: function getPreAndNextTitle(str) {
      //获取title
      if (!this.getDate(str)) {
        if (str == "pre") {
          vm.preTitle = "";
          return;
        } else if (str == "next") {
          vm.nextTitle = "";
          return;
        }
      };

      var _getDate3 = this.getDate(str),
          _getDate4 = _slicedToArray(_getDate3, 3),
          year = _getDate4[0],
          month = _getDate4[1],
          date = _getDate4[2];

      axios.get("https://gank.io/api/history/content/day/" + year + "/" + month + "/" + date).then(function (v) {
        if (str == "pre") {
          vm.preTitle = v.data.results[0].title;
          return;
        } else if (str == "next") {
          vm.nextTitle = v.data.results[0].title;
          return;
        }
        vm.headerTitle = document.title = v.data.results[0].title;
      });
    },
    doNext: function doNext() {
      var _nextGank$split = this.nextGank.split("-");

      var _nextGank$split2 = _slicedToArray(_nextGank$split, 3);

      vm.currentYear = _nextGank$split2[0];
      vm.currentMonth = _nextGank$split2[1];
      vm.currentDate = _nextGank$split2[2];
    },
    doPre: function doPre() {
      var _preGank$split = this.preGank.split("-");

      var _preGank$split2 = _slicedToArray(_preGank$split, 3);

      vm.currentYear = _preGank$split2[0];
      vm.currentMonth = _preGank$split2[1];
      vm.currentDate = _preGank$split2[2];
    }
  },
  watch: {
    currentDate: function currentDate() {
      this.getData();
      this.getPreAndNextTitle();
      this.getPreAndNextTitle("pre");
      this.getPreAndNextTitle("next");
    }
  }
});