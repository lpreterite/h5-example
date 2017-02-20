<template>
    <section id="loading">
        <div class="text-center" style="margin-bottom: 20px">图片加载中...</div>
        <div class="progress">
            <div class="progress-bar" role="progressbar" :aria-valuenow="ratio" aria-valuemin="0" aria-valuemax="100" style="width: 0%;" :style="{width: ratio+'%'}">
                <span class="sr-only">{{ ratio }}%</span>
            </div>
        </div>
    </section>
</template>

<style lang="scss">
    #loading{
        padding: 50px;
        text-align: center;
        .progress {
            border-radius: 3px;
            border: solid 1px #999;
            height: 8px;
            width: 100%;
        }

        .progress-bar {
            background-color: #999;
            height: 100%;
            width: 0;
            transition: width .25s;
            .sr-only{
                display: none;
            }
        }
    }
</style>

<script>
    var Pool = require('imagepool');

    var imageLoader = function(sourcemap, thread, cb, onerror){
            thread = typeof thread === "undefined" ? 5 : thread;
            var imagepool = Pool.initImagePool(thread);

            imagepool.load(sourcemap,{
                success: cb,
                error: onerror
            });
        },
        onError = function(src){
            console.log("error:::::"+src)
        }

    module.exports = {
        data: function(){
            return {
                finish: 0,
                length: 0,
                ratio: 0
            }
        },
        watch: {
            ratio: function(val){
                if(val>=100)
                    setTimeout(function(){
                        window.__isload__ = true
                        this.$router.replace({name: 'index', query: this.$route.query})
                    }.bind(this), 500)
            }
        },
        ready: function(){
            var reloadList = [];
            for(var i in window.__resource_map__.res){
                var item = window.__resource_map__.res[i];
                if('png,jpg,gif'.indexOf(item.type) === -1){
                    continue;
                }
                reloadList.push(item.uri);
            }
            this.length = reloadList.length

            console.log("加载图片总数：%s",reloadList.length)
            imageLoader(reloadList, undefined, function(src){
                ++this.finish;
                this.ratio = Math.floor(this.finish / this.length * 100)
            }.bind(this), onError)
        }
    }
</script>