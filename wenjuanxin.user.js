// ==UserScript==
// @name         问卷星自动随机答题
// @version      0.4
// @description 全自动填写问卷星的问卷，支持自定义填空答案，平均两三秒填写一份问卷，可多开几个标签同时刷
// 已适配题型
// 表格
//  - 单选
//  - 多选
// 单选
// 多选
// 星星
// 下拉
// 拉条
// 填空 默认为空
// 排序
// 图片
// @author       ZainCheung
// @include     https://www.wjx.cn/jq/*.aspx
// @include     https://www.wjx.cn/m/*.aspx
// @include     https://www.wjx.cn/hj/*.aspx
// @include     https://www.wjx.cn/wjx/join/complete.aspx*
// @grant        none
// @namespace http://tampermonkey.net/
// ==/UserScript==

(function() {
    'use strict';

    // 配置填空的答案项,如果不配置,默认填无
    var config = [
        {
            id: 3,//第三题:你每个月的生活费用是多少元？
            answer: [800,900,1000,1100,1500,2000]//随机选出一个答案
        },
        {
            id: 4,//第四题:你的生活费用来源是？
            answer: ["父母给","自己兼职","傍富婆"]
        },
        {
            id: 6,//第六题:你曾经或现在的恋爱时长是多长时间？（X日/X个月/X年）
            answer: ["三天","一个月","两个月","五个月","十个月","一年","两年","三年","五年","十年"]
        },
        {
            id: 7,//第七题:恋爱时的每月花费是多少元？
            answer: [100,200,300,400,500,600,700,800,900,1000,1500,2000]
        },
        {
            id: 16,//第七题:根据第15题，选择该地区的原因是？
            answer: ["个人喜好","没有原因"]
        },
        {
            id: 17,//第七题:你对另一半的身高要求具体是多少m？（数值）
            answer: [1.6,1.65,1.7,1.75,1.8,1.85,1.9]
        },
        {
            id: 18,//第七题:你能接受另一半的恋爱次数最多是多少次？（数值）
            answer: [0,1,2,3,4,5,6,7,8,9,10]
        },
        {
            id: 19,//第七题:你认为大学期间情侣每天在一起多长时间合适？（X个小时）
            answer: [0.5,1,1.5,2,2.5,3,3.5,4]
        }
    ];



    //答题结束，则打开新的问卷
    (function openNew() {
        var currentURL = window.location.href;
        var pat = /complete\.aspx\?activityid=(\d+)/;
        var obj = pat.exec(currentURL);
        if (obj) {
            window.location.href = "https://www.wjx.cn/jq/" + obj[1] + ".aspx";
        } else {
            console.log("not pat", obj);
        }
    })();


    var currentURL = window.location.href;
    //自动转为电脑网页版
    (function redirect() {
        try {
            var pat = /(https:\/\/www\.wjx\.cn\/)(jq|m)(.*)/g;
            var obj = pat.exec(currentURL);
            if (obj[2] == "m") {
                console.log("redirect now");
                window.location.href = obj[1] + "jq" + obj[3];
            } else {
                console.log("do!");
            }
        } catch (error) {}
    })();


    /**
     *
     *
     * @param {int} min The minimum value in the range
     * @param {int} max The maxmum value in the range
     * @return {int} Return Returns a random number within this range (both include)
     */
    function randint(min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }

    function getRandomArrayElements(arr, count) {
        var shuffled = arr.slice(0), i = arr.length, min = i - count, temp, index;
        while (i-- > min) {
            index = Math.floor((i + 1) * Math.random());
            temp = shuffled[index];
            shuffled[index] = shuffled[i];
            shuffled[i] = temp;
        }
        return shuffled.slice(min);
    }


    /**
     * @description 该函数用于自动选择
     */
    function RandomChoose() {
        /**
         * @name 普通单选题随机选择
         * @param {object}  subject single subject
         */
        this.singleChoose = function(subject) {
            if (subject.querySelectorAll("img")[0]) { //带有图片的，无法直接click 标签<li>
                var img = subject.querySelectorAll("img");
                img[randint(0, img.length - 1)].click();
            } else {
                var list = subject.querySelectorAll("li");
                var no;
                for(var i = 0; i < list.length; i++){
                    if(list[i].querySelector(".underline") != null){
                        no = i;
                    }
                }
                var index = randint(0, list.length - 1);
                while(index == no){index = randint(0, list.length - 1);}
                list[index].click();

            }
        }

        /****
         * @name    普遍多选题随机选择
         * @param {object}  subject single subject
         *
         */
        this.multiChoose = function(subject) {
            var list = subject.querySelectorAll("li");
            var arr = new Array();
            for (var i = 0; i < list.length; i++) {
                if (list[i].querySelectorAll("input")[0].checked == true) {
                    list[i].click();
                }
                arr.push(list[i]);
            }
            var times = randint(3, arr.length - 1); // 多选题选择数量，一般不小于3
            var indexAry = getRandomArrayElements(arr, times);//准备选中的项
            var no;//禁止项
            for(var j = 0; j < indexAry.length; j++){
                if(indexAry[j].querySelector(".underline") != null){//去除多选框里需要填空的项
                    console.log(indexAry[j]);
                    no = j;
                }
            }
            for (i = 0; i < indexAry.length; i++) {
                if (indexAry[i].querySelectorAll("input")[0].checked == false && (i != no)) {
                    indexAry[i].click();
                }
            }
//             for (i = 0; i < times; i++) {
//                 var randomChoose = arr.splice(randint(0, arr.length - 1), 1)[0];
//                 if (randomChoose.querySelectorAll("input")[0].checked == false) {
//                     randomChoose.click();
//                 }
//             }
        }



        //随机排序题
        this.randomSort = function(subject) {
            var list = subject.querySelectorAll("li");
            var arr = new Array();
            for (var i = 0; i < list.length; i++) {
                list[i].querySelectorAll("input")[0].checked = false;
                list[i].querySelectorAll("span")[0].classList.remove("sortnum-sel"); //事实上这个只是一个样式，真正选择在于checkd = true || false
                arr.push(list[i]);
            }
            for (i = 0; i < list.length; i++) {
                var randomChoose = arr.splice(randint(0, arr.length - 1), 1)[0];
                randomChoose.querySelectorAll("input")[0].checked = true;
                randomChoose.querySelectorAll("span")[0].classList.add("sortnum-sel");
                randomChoose.querySelectorAll("span")[0].innerHTML = i + 1;
            }
        }

        //表格单选
        this.martixSingleChoose = function(subject) {
                var tr = subject.querySelectorAll("tbody > tr");
                for (var i = 0; i < tr.length; i++) {
                    var td = tr[i].querySelectorAll("td");
                    td[randint(0, td.length - 1)].click();
                }
            }
            //表格多选
        this.martixMultiChoose = function(subject) {
            var tr = subject.querySelectorAll("tbody > tr");
            for (var i = 0; i < tr.length; i++) {
                var td = tr[i].querySelectorAll("td");
                var arr = new Array();
                for (var j = 0; j < td.length; j++) {
                    td[j].querySelectorAll("input")[0].checked = false;
                    td[j].querySelectorAll("a")[0].classList.remove("jqChecked");
                    arr.push(td[j]);
                }

                var times = randint(3, arr.length - 1); // 多选题选择数量，一般不小于3
                for (var k = 0; k < times; k++) {
                    var randomChoose = arr.splice(randint(0, arr.length - 1), 1)[0];
                    randomChoose.querySelectorAll("input")[0].checked = true;
                    randomChoose.querySelectorAll("a")[0].classList.add("jqChecked");
                }
                console.log(times);
            }
        }
        this.martixStar = function(subject) {
            var tr = subject.querySelectorAll("tbody > tr");
            for (var i = 0; i < tr.length; i++) {
                var list = tr[i].querySelectorAll("li");
                var rnnum = randint(0, list.length - 1);
                list[rnnum].click();
                console.log(i, rnnum);
            }
        }

        this.dropdownSelect = function(subject) {
            var select = subject.querySelectorAll("select")[0];
            var rnnum = randint(1, select.length - 1);
            select.selectedIndex = rnnum;
        }

        this.singleSlider = function(subject) {

            /**
             *
             * @param {int} _value 随机值
             * @param {*} min 可选的最小值
             * @param {*} max 可选的最大值
             * @param {*} subject 题目
             * @description 里面的_coordsX, _Number, getElCoordinate, 方法不用管，这是根据网页的方法复制下来的， 用来反模拟出clientX的值（即鼠标的值）, 因为网页上没有提供js直接修改的value，因此只能模拟鼠标时间来点击拉条，需要参数clientX。
             *
             */
            function getClientX(_value, min, max, subject) {
                var _bar = subject.querySelectorAll(".imageBar1")[0];
                var _slider = subject.querySelectorAll(".imageSlider1")[0]

                function _coordsX(x) {
                    x = _Number(x);
                    x = x <= _slider.offsetLeft ? _slider.offsetLeft : x >= _slider.offsetLeft + _slider.offsetWidth - _bar.offsetWidth ? _slider.offsetLeft + _slider.offsetWidth - _bar.offsetWidth : x;
                    return x;
                }

                function _Number(b) {
                    return isNaN(b) ? 0 : b;
                }

                function getElCoordinate(h) {
                    var e = h.offsetLeft;
                    while (h = h.offsetParent) {
                        e += h.offsetLeft;
                    }
                    return {
                        left: e,
                    };
                }

                var x = (_value - min) * ((_slider.offsetWidth - _bar.offsetWidth) / (max - min));
                x = _coordsX(x);
                var clientX = x + getElCoordinate(_slider).left + (_bar.offsetWidth / 2);
                return Math.round(clientX);
            }

            var max = Number(subject.querySelectorAll(".slider")[0].getAttribute("maxvalue"));
            var min = Number(subject.querySelectorAll(".slider")[0].getAttribute("minvalue"));
            //模拟鼠标点击的事件, 关键参数ClientX
            var evt = new MouseEvent("click", {
                clientX: getClientX(randint(min, max), min, max, subject),
                type: "click",
                __proto__: MouseEvent,
            });
            subject.querySelectorAll(".ruler")[0].dispatchEvent(evt);
        }
        this.singleStar = function(subject) {
            var list = subject.querySelectorAll("li:not([class='notchoice'])");
            list[randint(0, list.length - 1)].click();
        }
    }


    /**
     * @name 智慧树题目类型判断，并随机选择
     */
    function judgeType() {
        //q = $$(".div_question");
        var q = document.getElementsByClassName("div_question");
        var rc = new RandomChoose();
        for (var i = 0; i < q.length; i++) {
            //普通单选 or 多选
            if ((q[i].querySelectorAll(".ulradiocheck")[0]) && (q[i].querySelectorAll("input")[0])) { // 非表格单选或者多选
                var input = q[i].querySelectorAll("input");
                if (input[0].type == 'radio') {
                    console.log("单选题", i);
                    rc.singleChoose(q[i]);
                } else if (input[0].type == 'checkbox') {
                    console.log("多选题", i);
                    rc.multiChoose(q[i]);
                }

                //表格
            } else if (q[i].querySelectorAll("table")[0]) {
                if (q[i].querySelectorAll("input")[0]) { // 表格题中包含有单选， 多选
                    input = q[i].querySelectorAll("input");
                    if (input[0].type == 'radio') {
                        console.log("表格单选", i);
                        rc.martixSingleChoose(q[i]);
                    } else if (input[0].type == 'checkbox') {
                        console.log("表格多选", i);
                        rc.martixMultiChoose(q[i]);
                    }
                } else if (!q[i].querySelectorAll("input")[0] && q[i].querySelectorAll("li")[0]) { // 表格中的星星题目，没有Input标签
                    console.log("Martix-Star", i);
                    rc.martixStar(q[i]);
                }
                // 填空题
            } else if (q[i].querySelectorAll("textarea")[0]) {
                for(var j = 0; j < config.length; j++){
                    if(q[i].querySelectorAll("textarea")[0].id == ("q" + config[j].id)){
                        q[i].querySelectorAll("textarea")[0].value = config[j].answer[Math.floor(Math.random()*config[j].answer.length)];
                    }
                }

                console.log("填空", i);
            } else if (q[i].querySelectorAll(".slider")[0]) {
                console.log("Slider-Single-line", i);
                rc.singleSlider(q[i]);
            } else if (q[i].querySelectorAll(".notchoice")[0]) {
                console.log("Star-Single-line", i);
                rc.singleStar(q[i]);
            } else if (q[i].querySelectorAll(".lisort")[0]) {
                console.log("li-Sort", i);
                rc.randomSort(q[i]);
            } else if (q[i].querySelectorAll("select")[0]) {
                console.log("Select", i);
                rc.dropdownSelect(q[i]);
            }
        }
        try{
            var textArea = document.getElementsByTagName('textarea');
            //textArea[0].value = "无";
            //textArea[1].value = "无";
        }catch(error){}
    }
    judgeType();

    //滚动到提交按钮处
    try {
        var scrollvalue = document.getElementById("submit_button").offsetParent.offsetParent.offsetTop;
        window.scrollTo({
            top: scrollvalue,
            behavior: "smooth"
        });
    } catch (error) {}

})();
window.alert = function(str) {
   location.reload();
   return ;
}
setTimeout(function(){
    // 延时两秒防止验证
    document.getElementById("submit_button").click();
    console.log("答题成功!");
},2000);
setTimeout(function(){
    // 5秒自动刷新,解决验证问题
    location.reload();
},5000);
