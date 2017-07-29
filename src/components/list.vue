<template>
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
</template>
<script>
    export default{
        name:"list",
        props:["dataItem", "dataTitle"],
    }
</script>
<style lang="scss" scoped>
    .header {
        font-size: 2em;
        margin-top: 1em;
        margin-bottom: 0.6em;
        line-height: 1.35;
        font-weight: 100%;
        .h3 {
            font-size: 1.6em;
        }
    }
    img {
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
        max-width: 100%;
        height: auto !important;
    }
    .list_ul {
        margin-left: 1.3em;
        a {
            font-size: 1.7rem;
        }
        li ul:after {
            content: "";
            clear: both;
            display: block;
        }
        .list_image {
            position: relative;
            list-style: none;
            text-align: center;
            width: 120px;
            float: left;
            padding: 1rem;
        }
    }
</style>