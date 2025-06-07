# 简介

这是一款自动提交问卷辅助插件，适用于问卷星：www.wjx.cn

安装这款插件可以帮你做到自动填写问卷并提交,然后自动刷新继续填写,适用于问卷星刷大量问卷数据。
# 安装

安装并使用这款插件，需要你的浏览器装有油猴[Tampermonkey](https://tampermonkey.net/)插件。

| [GitHub版](https://greasyfork.org/zh-CN/scripts/403205-%E9%97%AE%E5%8D%B7%E6%98%9F%E8%87%AA%E5%8A%A8%E9%9A%8F%E6%9C%BA%E7%AD%94%E9%A2%98) | [油猴版](https://cdn.jsdelivr.net/gh/ZainCheung/wenjuanxin/wenjuanxin.user.js) |
| :----------------------------------------------------------: | :----------------------------------------------------------: |
|         在Github上正式发布的版本, 最稳定, 更新频率较低         |         新增内容测试的地方, 更新频率高, 但功能不稳定         |

# 快速开始

安装插件并保持打开状态，打开网址：https://www.wjx.cn/jq/77295530.aspx

# 动图演示

插件将会驱使网页，在加载完成时自动填写答案，并滚动到提交按钮处，帮你点击它。提交完成后也会帮你自动刷新网页，以便快速进行下一轮作答

![](https://cdn.jsdelivr.net/gh/ZainCheung/CDN/img/start.gif)

![](https://cdn.jsdelivr.net/gh/ZainCheung/CDN/img/switchIP.gif)

# 破解验证

问卷星对IP有提交次数限制，在一台机器上提交达到一定次数时会出现智能验证,所以可以配合Chrome插件:**Modify Headers** 破解这一限制

下载地址：https://chrome.google.com/webstore/detail/modify-headers-for-google/innpjfdalfhpcoinfnehdnbkglpmogdi

或者使用打包版**crx**文件（备用地址）：https://zaincheung.lanzous.com/ickksuf

查询IP地址段：http://ip.bczs.net/countrylist

你也可以使用项目里的 modifyheaders.json 文件,并将它导入到你的**Modify Headers**,这样你就能快速开始免去IP限制

下载地址: https://cdn.jsdelivr.net/gh/superBoyJack/wenjuanxin/modifyheaders.json

# 配置

填空题随机填写自定义答案，所以安装好脚本之后，可以进入管理面板修改代码里的答案配置

答案配置在**config**变量里面,打开脚本前几行就可以看到它。脚本默认问卷的第3,4,6,7,16,17,18,19题共八道填空题

```
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
```

这是一个数组，里面存放着填空题的答案，你可以在里面修改为你要填写的问卷的具体格式

比如说第一题是填空题，问题是你每个月的工资是多少元？那么你可以在里面添加一条记录

```
{
  id: 1, 
  answer: [100,200,500,1000,1500,2000]
}
```

请注意:如果答案不是数字记得加上**双引号**，否则不符合语法要求

而且每一条记录之间要有一个英文半角逗号,这样才符合json格式,否则也是会出错的呢

再比如说你的问卷第二题也是填空题，问题是你的女朋友和你的妈咪携手掉进小湖泊里,你先救哪一个？那么你可以在里面添加一条记录

```
{
   id: 2, 
   answer: ["先救妈咪","先救女票","小孩子才做选择题,我全部都要救"]
}
```

## 🏢 赞助More actions

感谢以下赞助商支持 本项目 的开发：

[![Powered by DartNode](https://dartnode.com/branding/DN-Open-Source-sm.png)](https://dartnode.com "Powered by DartNode - Free VPS for Open Source")


# 鸣谢

最后要感谢Junli提供的开源 原作者GitHub地址:https://github.com/tignioj
