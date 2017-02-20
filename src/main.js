window.__resource_map__ = require('resourcemap.js');

require('normalize-css');
require('icons.scss');

const Vue = require('vue');
const VueRouter = require('vue-router');

Vue.config.debug = true;
Vue.config.devtools = true;
Vue.use(VueRouter);

window.Promise = require('bluebird');
Vue.config.debug = true;

var router = new VueRouter();
    router.map({
        '/': {
            name: 'index',
            component: function(resolve) {
                require(['src/test'], resolve);
            }
        },
        '/loading':{
            name: 'loading',
            component: function(resolve) {
                require(['src/loading'], resolve);
            }
        }
    });

//路由跳转前的全局钩子
router.beforeEach(function(transition){
    if(transition.to.name === "loading"){
        transition.next();
    }else{
        if(window.__isload__) transition.next();
        else transition.redirect('/loading');
    }
});

router.start({
    data: function(){
        return {
            message: 'VFIS',
            userInfo: require('user')
        };
    }
}, "#layout");