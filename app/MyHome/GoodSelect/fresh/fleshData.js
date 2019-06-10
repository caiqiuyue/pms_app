import boluo from "./fruit/boluo.png";
import caomei from "./fruit/caomei.png";
import juzi from "./fruit/juzi.png";
import longyan from "./fruit/longyan.png";
import mangguo from "./fruit/mangguo.png";
import pingguo from "./fruit/pingguo.png";
import putao from "./fruit/putao.png";
import taozi from "./fruit/taozi.png";
import xiangjiao from "./fruit/xiangjiao.png";
import xigua from "./fruit/xigua.png";
import xueli from "./fruit/xueli.png";
import dabaicai from "./vegetables/dabaicai.png";
import dacong from "./vegetables/dacong.png";
import huacai from "./vegetables/huacai.png";
import huluobo from "./vegetables/huluobo.png";
import jiang from "./vegetables/jiang.png";
import jidan from "./vegetables/jidan.png";
import qiezi from "./vegetables/qiezi.png";
import qincai from "./vegetables/qincai.png";
import qingjiao from "./vegetables/qingjiao.png";
import rou from "./vegetables/rou.png";
import suan from "./vegetables/suan.png";
import tudou from "./vegetables/tudou.png";
import xianggu from "./vegetables/xianggu.png";
import xiaobaicai from "./vegetables/xiaobaicai.png";
import xiaomijiao from "./vegetables/xiaomijiao.png";
import xihongshi from "./vegetables/xihongshi.png";
import xinlimei from "./vegetables/xinlimei.png";
import yangcong from "./vegetables/yangcong.png";


// export const district = [
//     {
//         value:'水果类',
//         flag:true,
//         a:[
//             {
//                 value:'菠萝',
//                 image:boluo,
//                 price:2
//             },
//             {
//                 value:'草莓',
//                 image:caomei,
//                 price:2
//             },
//             {
//                 value:'橘子',
//                 image:juzi,
//                 price:2
//             },
//             {
//                 value:'龙眼',
//                 image:longyan,
//                 price:2
//             },
//             {
//                 value:'芒果',
//                 image:mangguo,
//                 price:2
//             },
//             {
//                 value:'苹果',
//                 image:pingguo,
//                 price:2
//             },
//             {
//                 value:'葡萄',
//                 image:putao,
//                 price:2
//             },
//             {
//                 value:'桃子',
//                 image:taozi,
//                 price:2
//             },
//             {
//                 value:'香蕉',
//                 image:xiangjiao,
//                 price:2
//             },
//             {
//                 value:'西瓜',
//                 image:xigua,
//                 price:2
//             },
//             {
//                 value:'雪梨',
//                 image:xueli,
//                 price:2
//             },
//
//         ]
//     },
//     {
//         value:'蔬菜类',
//         flag:false,
//         a:[
//             {
//                 value:'大白菜',
//                 image:dabaicai,
//                 price:2
//             },
//             {
//                 value:'大葱',
//                 image:dacong,
//                 price:2
//             },
//             {
//                 value:'花菜',
//                 image:huacai,
//                 price:2
//             },
//             {
//                 value:'胡萝卜',
//                 image:huluobo,
//                 price:2
//             },
//             {
//                 value:'姜',
//                 image:jiang,
//                 price:2
//             },
//             {
//                 value:'鸡蛋',
//                 image:jidan,
//                 price:2
//             },
//             {
//                 value:'茄子',
//                 image:qiezi,
//                 price:2
//             },
//             {
//                 value:'芹菜',
//                 image:qincai,
//                 price:2
//             },{
//                 value:'青椒',
//                 image:qingjiao,
//                 price:2
//             },{
//                 value:'肉',
//                 image:rou,
//                 price:2
//             },
//             {
//                 value:'蒜',
//                 image:suan,
//                 price:2
//             },
//             {
//                 value:'土豆',
//                 image:tudou,
//                 price:2
//             },
//             {
//                 value:'香菇',
//                 image:xianggu,
//                 price:2
//             },
//             {
//                 value:'小白菜',
//                 image:xiaobaicai,
//                 price:2
//             },
//             {
//                 value:'小米椒',
//                 image:xiaomijiao,
//                 price:2
//             },
//             {
//                 value:'西红柿',
//                 image:xihongshi,
//                 price:2
//             },
//             {
//                 value:'心里美',
//                 image:xinlimei,
//                 price:2
//             },
//             {
//                 value:'洋葱',
//                 image:yangcong,
//                 price:2
//             },
//
//
//
//
//         ]
//     },
//
// ]

export const setData  = (data) => {
    let goodsNames = [
        {
            goodsCata: '1',
            value: '食品类',
            flag: false,
            a: []
        },
        {
            goodsCata: '2',
            value: '特产类',
            flag: false,
            a: []
        },
        {
            goodsCata: '3',
            value: '烟酒类',
            flag: false,
            a: []
        },
        {
            goodsCata: '4',
            value: '门票类',
            flag: false,
            a: []
        },
        {
            goodsCata: '5',
            value: '消耗品类',
            flag: false,
            a: []
        },
        {
            goodsCata: '6',
            value: '生鲜类',
            flag: false,
            a: []
        },
        {
            goodsCata: '7',
            value: '水果类',
            flag: false,
            a: []
        }
    ];
    goodsNames.map(item => {
        data.map(_item => {
            if(item.goodsCata == _item.goodsCata) {
                _item.num = 0;
                item.a.push(_item);
            }
        });
    });
    let top = 0;
    goodsNames.map(item => {
        let length = item.a.length || 1;
        top += 40 + (length * 135);
        item.height = 40 + (length * 135);
        item.top = top;
    });
    // return goodsNames.filter(item => item.a.length > 0);
    return goodsNames;
};








