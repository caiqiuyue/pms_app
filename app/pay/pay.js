import React, { Component } from 'react';
import {
    Text,
    View,
    Image, StyleSheet, Platform,
    TouchableHighlight,
    DeviceEventEmitter,Modal,ScrollView,TextInput,
    Alert,Clipboard,CameraRoll,
    Linking
} from 'react-native';

import {WhiteSpace,Toast,Accordion, List} from 'antd-mobile'
import Dimensions from 'Dimensions'
import alipay from './alipay.png'
import wechatpay from './wechatpay.png'
import bankcard from './bankcard.png'
import selectIcon from './selectIcon.png'
import zfb from './zfb.png'
import wxTeach from './wechatPayTeach.png'
import zfbTeach from './zfbTeach.png'
import zfbTeach2 from './zfbTeach.jpeg'
import add from './add.png'
import wallet from './wallet.png'

import unbind from './unbind.png'
import * as wechat from "react-native-wechat";
import axios from "../axios";
import Alipay from "react-native-yunpeng-alipay";
import {ifIphoneX} from "react-native-iphone-x-helper";
import AddBankCard from "./addBankCard";
import CodePush from "react-native-code-push";
import close from "../MyHome/Mine/style/close.jpg";
import right from '../MyHome/Mine/style/right.png'
let a = Dimensions.get("window").height/Dimensions.get("window").width;

import RNFS from 'react-native-fs';




// let getCouponData = (data, moneyData, hotelNo, period) => {
//
//     //存储各类feeCode价格
//     let typeData = {
//         allMoney: 0,
//         allAttrMoney: 0
//     };
//     //moneyData数据中的feeCode种类集合
//     let feeCodes = [];
//     moneyData.map(item => {
//         if(typeData[item.feeCode]) {
//             typeData[item.feeCode] += item.rentPrice * 1;
//         } else {
//             typeData[item.feeCode] = item.rentPrice * 1;
//         }
//         //存储总价格
//         typeData.allMoney += item.rentPrice * 1;
//         //存储处房租之外的价格
//         if(item.feeCode != '100000') {
//             typeData.allAttrMoney += item.rentPrice * 1;
//         }
//         //如果feeCodes没有，则添加当前feeCode
//         if(feeCodes.indexOf(item.feeCode) === -1) {
//             feeCodes.push(item.feeCode);
//         }
//     });
//     //过滤出可用的优惠券
//     data = data.filter(item => {
//         let flag = false;
//         let money = 0;
//         let feeCodeArr = item.feeCodes.split(',');
//         if(item.couponState == 1 && item.hotelNos.indexOf(hotelNo) !== -1 && (item.feeCodes == 'all' || feeCodes.filter(_item => item.feeCodes.indexOf(_item) !== -1).length > 0)) {
//             if(item.feeCodes == 'all') {
//                 if(period) {
//                     if(typeData.allAttrMoney >= item.condition && typeData.allAttrMoney >= item.couponMoney) flag = true;
//                 } else {
//                     if(typeData.allMoney >= item.condition && typeData.allMoney >= item.couponMoney) flag = true;
//                 }
//             } else {
//                 feeCodeArr.map(_item => {
//                     if(typeData[_item]) {
//                         if(period) {
//                             if(_item != '100000') {
//                                 money += typeData[_item];
//                             }
//                         } else {
//                             money += typeData[_item];
//                         }
//                     }
//                 });
//                 if(money >= item.condition && (period ? typeData.allAttrMoney : typeData.allMoney) >= item.couponMoney){
//                     flag = true;
//                 }
//             }
//         }
//         return flag;
//     });
//
//
//     //按价格couponMoney排序，从大到小
//     let sortNumber = (a, b) => {
//         return b.couponMoney - a.couponMoney
//     };
//
//
//
//     let ifOverlay0 = [];
//     let ifOverlay1 = [];
//     let ifOverlay2 = [];
//
//
//     ifOverlay0 = data.sort(sortNumber).filter(item => {
//         return item.ifOverlay == 0
//     });
//     ifOverlay1 = data.sort(sortNumber).filter(item => {
//         return item.ifOverlay == 1
//     });
//
//     ifOverlay2 = data.sort(sortNumber).filter(item => {
//         return item.ifOverlay == 2
//     });
//
//
//
//     data = [...ifOverlay2,...ifOverlay1,...ifOverlay0];
//
//     console.log(JSON.stringify(data));
//
//     let aaa = [];
//
//     aaa = moneyData.filter(item=>{
//         return item.feeCode=='100000'
//     })
//
//
//
//
//     if(!period){
//         if(ifOverlay2.length==0 &&ifOverlay1.length==0 && ifOverlay0.length>0 ){
//             data = data.sort(sortNumber);
//             data[0].flag = true;
//             return data
//         }else {
//             //返回数据，并给第一条数据添加flag状态
//             return data.sort(sortNumber).map((item, index) => {
//
//                 if(ifOverlay2.length>0){
//
//                     if(item.ifOverlay==2) item.flag = true; return item;
//
//                 }else if(ifOverlay2.length==0 && ifOverlay1.length>0){
//
//                     let rentData = [];
//                     rentData = data.filter(_item => {
//                         return _item.feeCodes == '100000'
//                     });
//
//                     rentData = rentData.sort(sortNumber);
//
//                     let elseData = [];
//
//                     elseData = data.filter(_item => {
//                         return _item.feeCodes != '100000'
//                     });
//                     elseData = elseData.sort(sortNumber);
//                     data = [...rentData,...elseData]
//
//                     if(aaa.length>0){
//                         if(index < aaa.length) item.flag = true; return item;
//
//                     }else {
//                         if(index === 0) item.flag = true; return item;
//                     }
//                 }
//
//
//
//             });
//         }
//     }else {
//         if(ifOverlay2.length==0 && ifOverlay1.length==0 && ifOverlay0.length>0 ){
//             data = data.sort(sortNumber);
//             data[0].flag = true;
//             return data
//         }else {
//             //返回数据，并给第一条数据添加flag状态
//             return data.sort(sortNumber).map((item, index) => {
//
//                 if(ifOverlay2.length > 0){
//                     if(item.ifOverlay==2){
//                         item.flag = true; return item;
//                     }
//                 }else if(ifOverlay2.length == 0 && ifOverlay1.length > 0){
//                     data = data.sort(sortNumber);
//                     data[0].flag = true;
//                     return data
//                 }
//
//
//
//             });
//         }
//     }
//
//
//
//
//
//
// };



export default class Clean extends Component {

    constructor(props) {
        super(props);
        this.state = {
            wechatPayType:false,
            qrcode:"",
            url:"",
            alipayTradeNo:"",
            dataPay:{
            },
            bankcardNo:false,
            data:null,
            tradeNo:'',
            yiPayData:null,
            bankcard:[
            ],
            zfbImg:false,
            zfbPayFlag:false,
            cardType:null,
            poundage:0,
            availableAmount:0,
            money:0,
            Accounts:null,
            animationType: 'none',//none slide fade
            modalVisible: false,//模态场景是否可见
            transparent: true,//是否透明显示
            modalName:'',
            coupon:[],
            hotelNo:'',
            couponMoney:0,
            couponId:'',
            aaa:[],
            bbb:false,
            clipboardOK:false,
            typeData: {},

        };

    }

    getCouponData = (data, moneyData, hotelNo, period) => {
        //存储各类feeCode价格
        let typeData = {
            allMoney: 0,
            allAttrMoney: 0,
            feeNames: []
        };
        //moneyData数据中的feeCode种类集合
        let feeCodes = [];
        moneyData.map(item => {
            if(typeData[item.feeCode]) {
                typeData[item.feeCode] += item.rentPrice * 1;
            } else {
                typeData[item.feeCode] = item.rentPrice * 1;
            }
            if(typeData.feeNames.filter(_item => _item.feeName == item.feeName).length === 0) {
                typeData.feeNames.push(item);
            }
            //存储总价格
            typeData.allMoney += item.rentPrice * 1;
            //存储处房租之外的价格
            if(item.feeCode != '100000') {
                typeData.allAttrMoney += item.rentPrice * 1;
            }
            //如果feeCodes没有，则添加当前feeCode
            if(feeCodes.indexOf(item.feeCode) === -1) {
                feeCodes.push(item.feeCode);
            }
        });
        //过滤出可用的优惠券
        data = data.filter(item => {
            let flag = false;
            let money = 0;
            let feeCodeArr = item.feeCodes.split(',');
            // if(item.couponState == 1 && item.hotelNos.indexOf(hotelNo) !== -1 && (item.feeCodes == 'all' || feeCodes.filter(_item => item.feeCodes.indexOf(_item) !== -1).length > 0)) {
            if(item.couponState == 1 && item.hotelNos.indexOf(hotelNo) !== -1 && (item.feeCodes == 'all' || feeCodes.filter(_item => item.feeCodes.indexOf(_item) !== -1).length > 0)) {
                if(item.feeCodes == 'all') {
                    if(period) {
                        if(typeData.allAttrMoney >= item.condition && typeData.allAttrMoney >= item.couponMoney) flag = true;
                    } else {
                        if(typeData.allMoney >= item.condition && typeData.allMoney >= item.couponMoney) flag = true;
                    }
                } else {
                    feeCodeArr.map(_item => {
                        if(typeData[_item]) {
                            if(period) {
                                if(_item != '100000') {
                                    money += typeData[_item];
                                }
                            } else {
                                money += typeData[_item];
                            }
                        }
                    });
                    if(money >= item.condition && (period ? typeData.allAttrMoney : typeData.allMoney) >= item.couponMoney){
                        flag = true;
                    }
                }
            }
            return flag;
        });


        typeData.feeNames = typeData.feeNames.sort((a, b) => a.feeCode - b.feeCode);
        typeData.feeNames.map(item => {
            data = this.setCondition(item, data, moneyData, typeData);
        });

        console.log(typeData);
        this.setState({typeData});
        //按价格couponMoney排序，从大到小
        let sortNumber = (a, b) => {
            return b.couponMoney - a.couponMoney
        };
        //返回数据
        return data.sort(sortNumber);
    };

    setCondition = (itemType, couponData, moneyData, typeData) => {
        let length = moneyData.filter(item => item.feeCode == itemType.feeCode).length;
        let moneyObject = [{overlay: 0, type: 0}, {overlay: 0, type: 1}, {overlay: 0, type: 2}];
        typeData[itemType.feeName] = couponData.filter(item => (item.feeCodes.indexOf(itemType.feeCode) !== -1 || item.feeCodes == 'all') && !item.flag);
        if(length > 0){
            let num = 0;
            typeData[itemType.feeName] = typeData[itemType.feeName].sort((a, b) => b.couponMoney - a.couponMoney).map(item => {
                if(!moneyObject[0].overlay && item.ifOverlay == 0 && item.couponMoney < typeData[itemType.feeCode]) {
                    moneyObject[0].overlay = item.couponMoney;
                    item.flag = true;
                }
                if(num < length && item.ifOverlay == 1 && (moneyObject[1].overlay + item.couponMoney) < typeData[itemType.feeCode]) {
                    num ++;
                    moneyObject[1].overlay += item.couponMoney;
                    item.flag = true;
                }
                if(item.ifOverlay == 2  && (moneyObject[2].overlay + item.couponMoney) < typeData[itemType.feeCode]) {
                    moneyObject[2].overlay += item.couponMoney;
                    item.flag = true;
                }
                return item;
            });
            let big = moneyObject.sort((a, b) => b.overlay - a.overlay)[0];
            typeData[itemType.feeName] = typeData[itemType.feeName].map(item => {
                if(big.type == 0) {
                    if(item.ifOverlay == 1 || item.ifOverlay == 2) {
                        item.flag = false;
                    }
                } else if(big.type == 1) {
                    if(item.ifOverlay == 0 || item.ifOverlay == 2) {
                        item.flag = false;
                    }
                } else {
                    if(item.ifOverlay == 0 || item.ifOverlay == 1) {
                        item.flag = false;
                    }
                }
                return item;
            });
        }
        let filterData = typeData[itemType.feeName].filter(item => item.flag);

        typeData.feeNames.map(item => {
            if(typeData[item.feeName] && item.feeName !== itemType.feeName) {
                typeData[item.feeName] = typeData[item.feeName].filter(_item => {
                    let flag = true;
                    filterData.map(_val => {
                        if(_item.couponId == _val.couponId) {
                            flag = false;
                        }
                    });
                    return flag;
                });
            }
        });
        return couponData.map(item => {
            filterData.map(_item => {
                if(item.couponId == _item.couponId) {
                    item.flag = true;
                }
                return _item;
            });
            return item;
        })
    };


    componentWillUnmount(){
        console.log('组件将要卸载');
        // this.yiPay.remove();
    }


    unique5=(arr)=>{
        let x = new Set(arr);
        return [...x];
    }

    componentWillMount() {



        CodePush.sync();
        CodePush.allowRestart();//在加载完了可以允许重启

        this.props.navigation.getParam = (name) => {
            let params = this.props.navigation && this.props.navigation.state && this.props.navigation.state.params || {};
            if(name) {
                return params[name];
            }
            return params;
        }
        const {getParam} = this.props.navigation;
        let data = getParam("user");
        console.log(JSON.parse(JSON.stringify(data)),'1234567654321');

        let aaa = [];

        if(data.moneyData&&data.moneyData.length>0){

            data.moneyData.map(item=>{
                aaa.push(item.feeCode)
            });

            aaa = this.unique5(aaa);

        }



        this.setState({
            data,
            aaa
        },()=>{

            //读取
            storage.load({
                key: 'username',
                // autoSync(默认为true)意味着在没有找到数据或数据过期时自动调用相应的sync方法
                autoSync: false
            }).then(ret => {
                console.log(ret,'ret');
                this.setState({
                    hotelNo:ret.hotelNo,
                    // zfbPayFlag:ret.hotelNo=="H10055"||ret.hotelNo=="H10057"?true:false
                    zfbPayFlag:ret.hotelNo=="H10040"?true:false
                },()=>{
                    this.getMyCoupon();
                })
            }).catch(err => {
                //如果没有找到数据且没有sync方法，
                //或者有其他异常，则在catch中返回
                console.warn(err.message);
                switch (err.name) {
                    case 'NotFoundError':
                        break;
                    case 'ExpiredError':
                        break;
                }
            });


        })



        this.setState({
            dataPay:data,
            money:data.price&&data.price
        });




    }



    //代金券弹框
    couponPay=()=>{
        this.setState({
            modalName:'代金券',
            modalVisible:true
        })
        // this.getMyCoupon()
    }


    //查询代金券
    getMyCoupon=()=>{

        let {dataPay,hotelNo,money} = this.state;

        console.log(dataPay.fenqiType,'dataPay.fenqiType');


        if(dataPay.moneyData){


            axios.post(`/coupon/getMyCoupon`, {

            })
                .then( (response)=> {
                    console.log(response,'查询代金券');
                    // console.log(JSON.stringify(response.data.data),'1111');

                    this.setState({
                        bbb:true
                    },()=>{
                        if(response.data.code==0){

                            let data=[];

                            if(response.data.data.length>0){
                                data=response.data.data;


                                console.log(dataPay.moneyData);
                                data=this.getCouponData(data,dataPay.moneyData,hotelNo,dataPay.fenqiType);


                                let amount = 0;
                                let couponId = [];

                                data.map(item=>{
                                    if(item.flag){
                                        amount += item.couponMoney;
                                        couponId.push(item.couponId)
                                    }
                                });

                                console.log(data,'代金券');



                                // dataPay.price = money-amount;
                                // dataPay.yiPay.price = money-amount;

                                console.log(couponId.join(','),'couponId.join(\',\')111');

                                this.setState({
                                    couponMoney:amount,
                                    couponId:couponId.join(','),
                                    // dataPay:dataPay,
                                    Accounts:money-amount
                                })


                            }

                            console.log(data,'data');

                            this.setState({
                                coupon:data,

                            })
                        }
                    })


                })
                .catch(function (error) {
                    console.log(error);
                });


        }


    }


    //选代金券
    selectCoupon=(item, result)=>{
        let {coupon,Accounts,money,dataPay, typeData} = this.state;
        let moneyData = dataPay.moneyData;
        let aLength = moneyData.filter(_item => _item.feeCode == result.feeCode).length;
        let bLength = typeData[result.feeName].filter(_item=> _item.flag && _item.ifOverlay == 1).length;

        if(item.flag) {
            typeData[result.feeName] = typeData[result.feeName].map(_item => {
                if(_item.couponId == item.couponId){
                    _item.flag = false;
                }
                return _item;
            });
            coupon = coupon.map(_item=>{
                if(_item.couponId == item.couponId){
                    _item.flag = false;
                }
                return _item;
            });
            typeData.feeNames.map(_l => {
                if(typeData[_l.feeName] && _l.feeName != result.feeName) {
                    if(item.feeCodes == 'all') {
                        typeData[_l.feeName].push(item);
                        typeData[_l.feeName] = typeData[_l.feeName].sort((a, b) => b.couponMoney - a.couponMoney);
                    } else {
                        let feeCodeArr = item.feeCodes.split(',');
                        let flag = false;
                        typeData[_l.feeName].map(_item => {
                            feeCodeArr.map(_val => {
                                if(_item.feeCodes.indexOf(_val) !== -1) {
                                    flag = true;
                                }
                            });
                        });
                        if(flag) {
                            typeData[_l.feeName].push(item);
                            typeData[_l.feeName] = typeData[_l.feeName].sort((a, b) => b.couponMoney - a.couponMoney);
                        }
                    }
                }
            });
        } else {
            let couponData = [];
            if(item.ifOverlay == 0) {
                if(item.couponMoney > typeData[result.feeCode]) {
                    alert('优惠金额不能大于付款金额！');
                    return;
                }
                typeData[result.feeName] = typeData[result.feeName].map(_item => {
                    if(_item.couponId == item.couponId){
                        _item.flag = true;
                    } else {
                        _item.flag = false;
                        couponData.push(_item);
                    }
                    return _item;
                });
            } else if(item.ifOverlay == 1) {
                let couponMoney = 0;
                typeData[result.feeName].map(_item => {
                    if(_item.ifOverlay == 1 && _item.flag) {
                        couponMoney += _item.couponMoney
                    }
                });
                if(couponMoney + item.couponMoney > typeData[result.feeCode]) {
                    alert('优惠金额不能大于付款金额！')
                    return;
                }
                if(bLength == aLength && aLength > 0) {
                    alert(`最多可选择${aLength}张优惠券！`)
                    return;
                }
                typeData[result.feeName] = typeData[result.feeName].map(_item => {
                    if(_item.couponId == item.couponId){
                        _item.flag = true;
                    } else {
                        if(_item.ifOverlay != 1) {
                            _item.flag = false;
                            couponData.push(_item);
                        }
                    }
                    return _item;
                })
            } else {
                let couponMoney = 0;
                typeData[result.feeName].map(_item => {
                    if(_item.ifOverlay == 2 && _item.flag) {
                        couponMoney += _item.couponMoney
                    }
                });
                if(couponMoney + item.couponMoney > typeData[result.feeCode]) {
                    alert('优惠金额不能大于付款金额！');
                    return;
                }
                typeData[result.feeName] = typeData[result.feeName].map(_item => {
                    if(_item.couponId == item.couponId){
                        _item.flag = true;
                    } else {
                        if(_item.ifOverlay != 2) {
                            _item.flag = false;
                            couponData.push(_item);
                        }
                    }
                    return _item;
                });
            }

            let filterData = typeData[result.feeName].filter(_item => _item.flag);
            typeData.feeNames.map(_item => {
                if(typeData[_item.feeName] && _item.feeName !== result.feeName) {
                    typeData[_item.feeName] = typeData[_item.feeName].filter(_result => {
                        let flag = true;
                        filterData.map(_val => {
                            if(_result.couponId == _val.couponId) {
                                flag = false;
                            }
                        });
                        return flag;
                    });
                    couponData.map(_res => {
                        let flag = true;
                        typeData[_item.feeName].map(value => {
                            if(value.couponId == _res.couponId) {
                                flag = false;
                            }
                        });
                        if(_res.feeCodes == 'all') {
                            if(flag) {
                                typeData[_item.feeName].push(_res);
                            }
                        } else {
                            let feeCodeArr = _res.feeCodes.split(',');
                            let status = false;
                            typeData[_item.feeName].map(_i => {
                                feeCodeArr.map(_val => {
                                    if(_i.feeCodes.indexOf(_val) !== -1) {
                                        status = true;
                                    }
                                });
                            });

                            if(flag && status) {
                                typeData[_item.feeName].push(_res);
                            }
                        }
                    });
                    typeData[_item.feeName] = typeData[_item.feeName].sort((a, b) => b.couponMoney - a.couponMoney);
                }
            });
            coupon = coupon.map(item => {
                filterData.map(_item => {
                    if(item.couponId == _item.couponId) {
                        item.flag = true;
                    }
                    return _item;
                });
                return item;
            })

        }

        this.setState({
            coupon,
            typeData
        },()=>{
            let amount = 0;
            let couponId=[];
            Accounts = null;
            this.state.coupon.map(_item=>{
                if(_item.flag){

                    console.log(_item,'qwertytresxcv');

                    amount += _item.couponMoney;
                    couponId.push(_item.couponId)
                    // dataPay.price = money-amount;
                    // dataPay.yiPay.price = money-amount;
                    Accounts = money-amount
                }
            });
            console.log(couponId.join(','),'couponId.join(\',\')222');
            this.setState({
                couponMoney:amount,
                couponId:couponId.join(','),
                Accounts,
                // dataPay:dataPay,
            })
        })


    }




    bindCard=()=>{
        //查询绑卡列表
        axios.post(`/pay/bindCardList`, {

        })
            .then( (response)=> {
                console.log(response,'查询绑卡列表');

                let bankcard = JSON.parse(response.data.data);
                console.log(bankcard);

                this.setState({
                    bankcard
                })

            })
            .catch(function (error) {
                console.log(error);
            });
    }

    openZFB = ()=>{
        Alert.alert('打开支付宝','支付完成后必须回到该页面填写支付宝订单号！！！！',
            [
                // {text:"取消", onPress:this.cancelSelected},
                {text:"确认", onPress:()=>{

                        Linking.openURL('alipayqr://platformapi/startapp?saId=10000007&qrcode=https://qr.alipay.com/tsx03647vxqajtgeoflyu4c');

                    }}
            ],
            { cancelable: false }
        );

    }


    //支付宝扫码支付
    submitAlipay = ()=>{
        let {tradeNo,alipayTradeNo} = this.state


        if(!alipayTradeNo){
            alert("请输入支付宝交易号")
            return
        }

        axios.post(`/pay/alipayFinish`, {
            tradeNo,
            alipayTradeNo

        })
            .then( (response)=> {
                console.log(response,'支付宝扫码支付');
                if(response.data.code==0){
                    this.setState({modalVisible:false},()=>{
                        Toast.info('支付成功',2);
                        DeviceEventEmitter.emit('yiPay','aliPay');

                    })

                }else {
                    alert(response.data.message)
                }


            })
            .catch(function (error) {
                console.log(error);
            });
    }


    componentDidMount() {


        // this.bindCard();

        // this.yiPay =  DeviceEventEmitter.addListener('yiPay', (item)=>{
        //
        //     console.log(item,'123456');
        //
        //     if(item=='realNamePay'||'addBankCard'){
        //         console.log('回到支付页面');
        //         this.bindCard();
        //     }
        // });

    }




    //微信支付
    WechatPay=(wechatPayData)=>{
        wechat.pay(
            wechatPayData
        ).then((success) => {

            Toast.info("微信支付成功",2);
            console.log(success);

            // this.props.navigation.dispatch(popAction);
            DeviceEventEmitter.emit('onFresh','onFresh');
            this.props.navigation.goBack()



        }).catch((error)=>{
            Toast.info("微信支付失败",2);
            console.log(error)
        })
    };


    //支付宝支付
    AliPayHandler = (data)=> {
        Alipay.pay(data).then((resp)=>{
            console.log("支付宝支付成功:"+JSON.stringify(resp));

            Toast.info("支付宝支付成功",2);


            //this.props.navigation.dispatch(popAction);
            DeviceEventEmitter.emit('onFresh','onFresh');
            this.props.navigation.goBack()




        },(err)=>{
            console.log("err:"+JSON.stringify(err));
            let payResultStr = "";
            switch (err.code){
                case "10000":
                    payResultStr = "没有配置URL Scheme";
                    break;
                case "9000":
                    payResultStr = "支付成功";
                    break;
                case "8000":
                    payResultStr = "支付结果未知,请查询订单状态";
                    break;
                case "4000":
                    payResultStr = "订单支付失败";
                    break;
                case "5000":
                    payResultStr = "重复请求";
                    break;
                case "6001":
                    payResultStr = "用户中途取消";
                    break;
                case "6002":
                    payResultStr = "网络连接出错";
                    break;
                case "6004":
                    payResultStr = "支付结果未知,请查询订单状态";
                    break;
                default:
                    payResultStr = "其他失败原因";
                    break;
            }
            console.log("支付宝支付支付失败:"+payResultStr);
            Toast.info(`支付宝支付支付失败:${payResultStr}`,2)
        });
    }


    //去钱包充值
    walletSelected=()=>{
        const { navigate } = this.props.navigation;
        navigate('Wallet',{ user: '' });
    }

    //选择支付方式
    selectPayType(item){

        let {dataPay,wechatPayType,bankcard,data} = this.state;

        if(item==2){
            //微信支付

            // Toast.info("暂不支持微信支付", 1);
            this.setState({
                wechatPayType:2,
            });

            this.state.dataPay.dataPay.type = "1";

        }else if(item==3){
            //支付宝支付


            // Toast.info("暂不支持支付宝支付", 1);

            this.setState({
                wechatPayType:3,

            });

            this.state.dataPay.dataPay.type = "0";
        }else if(item==4){

            let amount = dataPay.price ||dataPay.price===0 ? (dataPay.price).toFixed(2) : (dataPay.dataPay.amount).toFixed(2);

            //钱包支付
            this.setState({
                wechatPayType:wechatPayType==4?false:4,
            },()=>{

                if(this.state.wechatPayType==4){


                    axios.post(`/pay/yeePay`, {})
                        .then( (response)=> {
                            console.log(response,'实名认证');
                            if(response.data.code==0){
                                axios.post(`/pay/queryUserBalance`, {

                                })
                                    .then( (response)=> {
                                        console.log(response,'查询钱包');
                                        if(response.data.code==0){

                                            let data =JSON.parse(response.data.data);
                                            console.log(data);
                                            this.setState({
                                                availableAmount:data.availableAmount-0
                                            })



                                            if(this.state.Accounts!=null){
                                                dataPay.price = this.state.money-this.state.couponMoney;
                                                dataPay.yiPay.price = this.state.money-this.state.couponMoney;
                                            }

                                            let amount = dataPay.price||dataPay.price===0 ? (dataPay.price).toFixed(2) : (dataPay.dataPay.amount).toFixed(2);

                                            console.log(data.availableAmount,'data.availableAmount');
                                            console.log(amount,'amount');

                                            console.log(data.availableAmount<amount,'data.availableAmount<amount');

                                            if((data.availableAmount-0)<(amount-0)){

                                                Alert.alert('余额不足','请去钱包充值',
                                                    [
                                                        {text:"取消", onPress:this.cancelSelected},
                                                        {text:"确认", onPress:this.walletSelected}
                                                    ],
                                                    { cancelable: false }
                                                );
                                            }
                                        }



                                    })
                                    .catch(function (error) {
                                        console.log(error);
                                    });
                            }


                        })
                        .catch(function (error) {
                            console.log(error);
                        });




                }


            });

        }else if(item==1){


            this.setState({
                wechatPayType:wechatPayType==1?false:1,
                // bankcardNo:wechatPayType==1?false:item,

            },()=>{

                if(this.state.wechatPayType==1){
                    //实名认证
                    axios.post(`/pay/yeePay`, {})
                        .then( (response)=> {
                            console.log(response,'实名认证,发起易宝支付');

                            if(response.data.code==1){
                                Toast.info(response.data.message, 1);
                            }else {
                                let data = JSON.parse(response.data.data);

                                let yeeState = data.yeeState;

                                if(yeeState==0){
                                    Alert.alert('未实名认证','请先实名认证',
                                        [
                                            {text:"取消", onPress:this.cancelSelected},
                                            {text:"确认", onPress:this.realNameSelected}
                                        ],
                                        { cancelable: false }
                                    );

                                    // return
                                }else {


                                    axios.post(`/pay/bindCardList`, {

                                    })
                                        .then( (response)=> {
                                            console.log(response,'查询绑卡列表');

                                            let bankcard = JSON.parse(response.data.data);
                                            console.log(bankcard);

                                            if(bankcard.length>0){
                                                this.setState({
                                                    wechatPayType:wechatPayType==1?false:1,
                                                    bankcard,
                                                    bankcardNo:bankcard&&bankcard[0].bindId
                                                    // bankcardNo:wechatPayType==1?false:item,

                                                });
                                            }else {
                                                Alert.alert('未绑定银行卡','请先绑定银行卡',
                                                    [
                                                        {text:"取消", onPress:this.cancelSelected},
                                                        {text:"确认", onPress:this.comfirmSelected}
                                                    ],
                                                    { cancelable: false }
                                                );
                                            }

                                            this.setState({


                                            })

                                        })
                                        .catch(function (error) {
                                            console.log(error);
                                        });


                                }


                            }



                        })
                        .catch(function (error) {
                            console.log(error);
                        });
                }


            });






        }else if(item==5){

            //朋友代付


            this.setState({
                wechatPayType:wechatPayType==5?false:5,
                // bankcardNo:wechatPayType==1?false:item,

            },()=>{
                axios.post(`/pay/yeePay`, {})
                    .then( (response)=> {
                        console.log(response,'实名认证,注册');

                        if(response.data.code!=0){
                            Toast.info(response.data.message, 1);
                            this.setState({
                                wechatPayType:false,
                            })
                        }



                    })
                    .catch(function (error) {
                        console.log(error);
                    });
            })
        }else if(item==6){
            // 支付宝支付
            this.setState({
                wechatPayType:wechatPayType==6?false:6,
                // bankcardNo:wechatPayType==1?false:item,

            })
        }

    }



    //绑定银行卡
    comfirmSelected=()=>{

        const { navigate } = this.props.navigation;


        axios.post(`/pay/bindCard`, {
            webCallbackUrl:'http://www.fangapo.cn/bindSuccess.html',
            returnUrl:'http://www.fangapo.cn/bindSuccess.html',

        })
            .then(function (response) {
                console.log(response);
                let data = JSON.parse(response.data.data);

                navigate('AddBankCard',{ user:data });

            })
            .catch(function (error) {
                console.log(error);
            });

    };


    //发起实名认证
    realNameSelected=()=>{
        const { navigate } = this.props.navigation;


        axios.post(`/pay/userAuth`, {
            webCallbackUrl:'http://www.fangapo.cn/realNameSuccess.html',
            returnUrl:'http://www.fangapo.cn/realNameSuccess.html',

        })
            .then(function (response) {
                console.log(response);
                let data = JSON.parse(response.data.data);

                navigate('RealNamePay',{ user:data });

            })
            .catch(function (error) {
                console.log(error);
            });




    };

    cancelSelected=()=>{

    };



    //确认支付
    onPay = ()=>{

        //this.props.navigation.goBack();

        const { navigate } = this.props.navigation;



        let {dataPay,wechatPayType,bankcardNo,yiPayData,data,availableAmount} = this.state;

        console.log(dataPay,'dataPay');



        if(!wechatPayType){
            Toast.info("请选择支付方式", 1);
            return
        }else{

            if(wechatPayType==1){
                // Toast.info("银行卡支付", 1);


                if(bankcardNo==false){
                    Toast.info("请选择支付银行卡", 1);
                    return
                }

                if(this.state.Accounts!=null){
                    dataPay.price = this.state.money-this.state.couponMoney;
                    dataPay.yiPay.price = this.state.money-this.state.couponMoney;
                }



                data.yiPay.webCallbackUrl='http://www.fangapo.cn/yiPaySuccess.html';
                data.yiPay.credit=this.state.cardType=='CREDITCARD'?0:-1;
                data.yiPay.payTool='BINDCARD';
                data.yiPay.couponIds=this.state.couponId;



                //读取
                storage.load({
                    key: 'username',
                    // autoSync(默认为true)意味着在没有找到数据或数据过期时自动调用相应的sync方法
                    autoSync: false
                }).then(ret => {

                    console.log(ret,'ret');
                    if(ret.payOrderId){
                        data.yiPay.payOrderId=ret.payOrderId
                    }


                    axios.post(`/pay/orderConsume`,data.yiPay)
                        .then( (response)=> {
                            console.log(response,'银行卡支付');

                            if(response.data.code==1){
                                Toast.info(response.data.message, 1);
                            }else if(response.data.code==0){

                                //读取
                                storage.load({
                                    key: 'username',
                                    // autoSync(默认为true)意味着在没有找到数据或数据过期时自动调用相应的sync方法
                                    autoSync: false
                                }).then(ret => {
                                    ret.payOrderId = response.data.payOrderId
                                    return ret

                                }).catch(err => {
                                    //如果没有找到数据且没有sync方法，
                                    //或者有其他异常，则在catch中返回
                                    console.warn(err.message);
                                    switch (err.name) {
                                        case 'NotFoundError':
                                            break;
                                        case 'ExpiredError':
                                            break;
                                    }
                                });

                                let data = JSON.parse(response.data.data);

                                if(data.code==1){
                                    navigate('YiPay',{ user:data });
                                }else {
                                    Toast.info(data.message, 1);
                                }
                            }



                        })
                        .catch(function (error) {
                            console.log(error);
                        });


                }).catch(err => {
                    //如果没有找到数据且没有sync方法，
                    //或者有其他异常，则在catch中返回
                    console.warn(err.message);
                    switch (err.name) {
                        case 'NotFoundError':
                            break;
                        case 'ExpiredError':
                            break;
                    }
                });






            }
            else if(wechatPayType==5){

                //朋友代付

                if(this.state.Accounts!=null){
                    dataPay.price = this.state.money-this.state.couponMoney;
                    dataPay.yiPay.price = this.state.money-this.state.couponMoney;
                }


                data.yiPay.webCallbackUrl='http://www.fangapo.cn/yiPaySuccess.html';
                data.yiPay.payTool='WECHATOFFICIAL';
                data.yiPay.credit=2;
                data.yiPay.couponIds=this.state.couponId;
                if(this.state.zfbPayFlag){
                    data.yiPay.payTool='OUR_WECHAT';
                }


                //读取
                storage.load({
                    key: 'username',
                    // autoSync(默认为true)意味着在没有找到数据或数据过期时自动调用相应的sync方法
                    autoSync: false
                }).then(ret => {

                    console.log(ret,'ret');
                    if(ret.payOrderId){
                        data.yiPay.payOrderId=ret.payOrderId
                    }


                    axios.post(`/pay/orderConsume`,data.yiPay)
                        .then( (response)=> {
                            console.log(response,'微信代付');

                            if(response.data.code==1){
                                Toast.info(response.data.message, 1);
                            }else if(response.data.code==0){

                                let data = response.data.data;

                                if(this.state.zfbPayFlag){
                                    this.setState({
                                        modalName:'微信扫码支付',
                                        modalVisible:true,
                                        tradeNo:response.data.tradeNo,
                                        qrcode:response.data.qrcode,
                                    })

                                }else {
                                    wechat.isWXAppInstalled()
                                        .then((isInstalled) => {

                                            if (isInstalled) {
                                                wechat.shareToSession({
                                                    title:'闪猪微信代付',
                                                    description: '闪猪微信代付',
                                                    thumbImage: ' http://47.95.116.56:8080/file_upload/images/app/logo.png',
                                                    type: 'news',
                                                    webpageUrl: data
                                                })
                                                    .catch((error) => {
                                                        Alert.alert(error.message);
                                                    });
                                            } else {
                                                Alert.alert('请安装微信');
                                            }
                                        });
                                }
                                //读取
                                storage.load({
                                    key: 'username',
                                    // autoSync(默认为true)意味着在没有找到数据或数据过期时自动调用相应的sync方法
                                    autoSync: false
                                }).then(ret => {
                                    ret.payOrderId = response.data.payOrderId
                                    return ret

                                }).catch(err => {
                                    //如果没有找到数据且没有sync方法，
                                    //或者有其他异常，则在catch中返回
                                    console.warn(err.message);
                                    switch (err.name) {
                                        case 'NotFoundError':
                                            break;
                                        case 'ExpiredError':
                                            break;
                                    }
                                });



                                DeviceEventEmitter.emit('yiPay','wechatPay');




                            }



                        })
                        .catch(function (error) {
                            console.log(error);
                        });


                }).catch(err => {
                    //如果没有找到数据且没有sync方法，
                    //或者有其他异常，则在catch中返回
                    console.warn(err.message);
                    switch (err.name) {
                        case 'NotFoundError':
                            break;
                        case 'ExpiredError':
                            break;
                    }
                });




            }
            else if(wechatPayType==6){

                //支付宝支付

                if(this.state.Accounts!=null){
                    dataPay.price = this.state.money-this.state.couponMoney;
                    dataPay.yiPay.price = this.state.money-this.state.couponMoney;
                }


                data.yiPay.webCallbackUrl='http://www.fangapo.cn/yiPaySuccess.html';
                data.yiPay.payTool='OUR_ALIPAY';
                data.yiPay.credit=2;
                data.yiPay.couponIds=this.state.couponId;


                //读取
                storage.load({
                    key: 'username',
                    // autoSync(默认为true)意味着在没有找到数据或数据过期时自动调用相应的sync方法
                    autoSync: false
                }).then(ret => {

                    console.log(ret,'ret');
                    if(ret.payOrderId){
                        data.yiPay.payOrderId=ret.payOrderId
                    }


                    axios.post(`/pay/orderConsume`,data.yiPay)
                        .then( (response)=> {
                            console.log(response,'支付宝');

                            if(response.data.code==1){
                                Toast.info(response.data.message, 1);
                            }else if(response.data.code==0){

                                this.setState({
                                    modalName:'',
                                    modalVisible:true,
                                    tradeNo:response.data.tradeNo,
                                    qrcode:response.data.qrcode,
                                    alipayTradeNo:''
                                })

                                //读取
                                storage.load({
                                    key: 'username',
                                    // autoSync(默认为true)意味着在没有找到数据或数据过期时自动调用相应的sync方法
                                    autoSync: false
                                }).then(ret => {
                                    ret.payOrderId = response.data.payOrderId
                                    return ret

                                }).catch(err => {
                                    //如果没有找到数据且没有sync方法，
                                    //或者有其他异常，则在catch中返回
                                    console.warn(err.message);
                                    switch (err.name) {
                                        case 'NotFoundError':
                                            break;
                                        case 'ExpiredError':
                                            break;
                                    }
                                });
                            }



                        })
                        .catch(function (error) {
                            console.log(error);
                        });


                }).catch(err => {
                    //如果没有找到数据且没有sync方法，
                    //或者有其他异常，则在catch中返回
                    console.warn(err.message);
                    switch (err.name) {
                        case 'NotFoundError':
                            break;
                        case 'ExpiredError':
                            break;
                    }
                });




            }

            else if(wechatPayType==4){


                //钱包支付

                if(this.state.Accounts!=null){
                    dataPay.price = this.state.money-this.state.couponMoney;
                    dataPay.yiPay.price = this.state.money-this.state.couponMoney;
                }

                let amount = dataPay.price||dataPay.price===0 ? (dataPay.price).toFixed(2) : (dataPay.dataPay.amount).toFixed(2);

                console.log(availableAmount,'availableAmount');
                console.log(amount,'amount');

                if(availableAmount<amount){

                    Alert.alert('余额不足，请去钱包充值',
                        [
                            {text:"取消", onPress:this.cancelSelected},
                            {text:"确认", onPress:this.walletSelected}
                        ],
                        { cancelable: false }
                    );



                }else {

                    // if(this.state.Accounts!=null){
                    //     dataPay.price = this.state.money-this.state.couponMoney;
                    //     dataPay.yiPay.price = this.state.money-this.state.couponMoney;
                    // }


                    data.yiPay.webCallbackUrl='http://www.fangapo.cn/yiPaySuccess.html';
                    data.yiPay.payTool='BALANCE';
                    data.yiPay.credit=1;
                    data.yiPay.couponIds=this.state.couponId;


                    //读取
                    storage.load({
                        key: 'username',
                        // autoSync(默认为true)意味着在没有找到数据或数据过期时自动调用相应的sync方法
                        autoSync: false
                    }).then(ret => {

                        console.log(ret,'ret');

                        if(ret.payOrderId){
                            data.yiPay.payOrderId=ret.payOrderId
                        }




                        axios.post(`/pay/orderConsume`,data.yiPay)
                            .then( (response)=> {
                                console.log(response,'余额支付');

                                if(response.data.code==1){
                                    Toast.info(response.data.message, 1);
                                }else if(response.data.code==0){


                                    //读取
                                    storage.load({
                                        key: 'username',
                                        // autoSync(默认为true)意味着在没有找到数据或数据过期时自动调用相应的sync方法
                                        autoSync: false
                                    }).then(ret => {
                                        ret.payOrderId = response.data.payOrderId
                                        return ret

                                    }).catch(err => {
                                        //如果没有找到数据且没有sync方法，
                                        //或者有其他异常，则在catch中返回
                                        console.warn(err.message);
                                        switch (err.name) {
                                            case 'NotFoundError':
                                                break;
                                            case 'ExpiredError':
                                                break;
                                        }
                                    });

                                    let data = JSON.parse(response.data.data);

                                    if(data.code==1){
                                        navigate('WalletPay',{ user:data });
                                    }else {
                                        Toast.info(data.message, 1);
                                    }
                                }



                            })
                            .catch(function (error) {
                                console.log(error);
                            });


                    }).catch(err => {
                        //如果没有找到数据且没有sync方法，
                        //或者有其他异常，则在catch中返回
                        console.warn(err.message);
                        switch (err.name) {
                            case 'NotFoundError':
                                break;
                            case 'ExpiredError':
                                break;
                        }
                    });




                }

            }
            else if(wechatPayType==2){

                axios.post(`${dataPay.url}`, dataPay.dataPay)
                    .then((response) => {
                        console.log(response);
                        if(response.data.code==1){
                            Toast.info(response.data.message,2)
                            //navigate('AllBills',{ user:"" });
                        }else{
                            let datas = response.data.data;
                            let wechatPayData = {
                                appid:datas.appid,
                                partnerId:datas.partnerid,  // 商家向财付通申请的商家id
                                prepayId:datas.prepayid,   // 预支付订单
                                nonceStr:datas.noncestr,   // 随机串，防重发
                                timeStamp:datas.timestamp,  // 时间戳，防重发
                                package:datas.package,    // 商家根据财付通文档填写的数据和签名
                                sign: datas.sign     // 商家根据微信开放平台文档对数据做的签名
                            };
                            this.WechatPay(wechatPayData);
                        }


                    }).catch(function (err) {
                    console.log(err);

                });

                // Toast.info("暂不支持微信支付", 1);
            }
            else if(wechatPayType==3){

                axios.post(`${dataPay.url}`, dataPay.dataPay)
                    .then((response) => {
                        console.log(response);

                        let aliData = response.data.data;

                        if(response.data.code==1){
                            Toast.info(response.data.message,2)
                            //navigate('AllBills',{ user:"" });
                        }else{
                            this.AliPayHandler(aliData);
                        }



                    })
                    .catch(function (err) {
                        console.log(err);

                    });

                // Toast.info("暂不支持支付宝支付", 1);
            }



        }

    };



    //复制订单号支付
    setClipboard = (item)=>{
        Clipboard.setString(this.state.tradeNo)
        Alert.alert(`复制订单号成功，打开${item?"微信":"支付宝"}`,`复制的订单号一定要填写到${item?"微信":"支付宝"}转账页面备注中！！！！`,
            [
                // {text:"取消", onPress:this.cancelSelected},
                {text:"确认", onPress:()=>{

                        Linking.openURL(item?"weixin://":`alipayqr://platformapi/startapp?saId=10000007&qrcode=${this.state.qrcode}`);

                    }}
            ],
            { cancelable: false }
        );

    }


    onChange = (key) => {
        console.log(key);
    }

    //选择支付的银行卡
    setBankPay = (item) => {
        let {bankcardNo,dataPay} = this.state;

        // if(item.cardType=='CREDITCARD'){
        //
        //     // let a = dataPay.price ? dataPay.price : dataPay.dataPay.amount
        //
        //     // let poundage = a*0.002;
        //
        //     this.setState({
        //         poundage
        //     })
        // }else {
        //     this.setState({
        //         poundage:0
        //     })
        // }

        this.setState({
            bankcardNo:bankcardNo==item.bindId?false:item.bindId,
            cardType:item.cardType,
        })
    }


    //解绑卡
    unbind = (item)=>{

        const { navigate } = this.props.navigation;

        axios.post(`/pay/getPswdVerifyUrl`, {
            webCallbackUrl: "http://www.fangapo.cn/unbind.html",
            returnUrl: "http://www.fangapo.cn/unbind.html",
            tokenBizType:'UN_BIND_CARD'


        })
            .then(function (response) {
                console.log(response);

                if(response.data.code==1){
                    Toast.info(response.data.message, 1);
                }else {

                    let data = JSON.parse(response.data.data);



                    if(data.code==1){

                        data.bindId = item.bindId;
                        data.requestNo = response.data.requestNo;

                        console.log(data);


                        navigate('UnBankCard',{ user:data });
                    }else {
                        Toast.info(data.message, 1);
                    }
                }

            })
            .catch(function (error) {
                console.log(error);
            });
    }

    //添加银行卡
    addBankcard=()=>{

        const { navigate } = this.props.navigation;

        axios.post(`/pay/bindCard`, {
            webCallbackUrl:'http://www.fangapo.cn/bindSuccess.html',
            returnUrl:'http://www.fangapo.cn/bindSuccess.html',

        })
            .then(function (response) {
                console.log(response);
                let data = JSON.parse(response.data.data);

                navigate('AddBankCard',{ user:data });

            })
            .catch(function (error) {
                console.log(error);
            });
    }

    _setModalVisible = (visible) => {

        this.setState({ modalVisible: visible })
    };


    // 保存图片
    download=(uri)=> {
        if (!uri) return null;
        return new Promise((resolve, reject) => {
            let dirs = Platform.OS === 'ios' ? RNFS.LibraryDirectoryPath : RNFS.ExternalDirectoryPath; //外部文件，共享目录的绝对路径（仅限android）
            const downloadDest = `${dirs}/${((Math.random() * 10000000) | 0)}.jpg`;
            const url = uri;
            const options = {
                fromUrl: url,
                toFile: downloadDest,
                background: true,
                begin: (res) => {
                    console.log('begin', res);
                    console.log('contentLength:', res.contentLength / 1024 / 1024, 'M');
                },
            };
            try {
                const ret = RNFS.downloadFile(options);
                ret.promise.then(res => {
                    console.log('success', res);
                    console.log('file://' + downloadDest);
                    let promise = CameraRoll.saveToCameraRoll(downloadDest);
                    promise.then(function(result) {
                        //alert('保存成功');
                        alert('保存成功')

                    }).catch(function(error) {
                        alert('保存失败')
                    });
                    resolve(res);
                }).catch(err => {
                    reject(new Error(err))
                });
            } catch (e) {
                reject(new Error(e))
            }

        })

    }




    render() {

        let {tradeNo,zfbPayFlag,zfbImg,modalName,coupon,poundage,dataPay,wechatPayType,amount,bankcardNo, typeData} = this.state;
        //弹框
        let modalBackgroundStyle = {
            backgroundColor: this.state.transparent ? 'rgba(0, 0, 0, 0.5)' : 'red',
        };
        let innerContainerTransparentStyle = this.state.transparent
            ? { backgroundColor: '#fff', padding: 10 ,
                // height:"90%",
                overflow:"hidden"}
            : null;

        return (

            <View style={{backgroundColor:"#f0f0f0",height: Dimensions.get('window').height}}>



                <View>

                    <Modal
                        animationType={this.state.animationType}
                        transparent={this.state.transparent}
                        visible={this.state.modalVisible}
                        onRequestClose={() => { this._setModalVisible(false) } }

                    >
                        <View style={[styles.container,modalBackgroundStyle]}>
                            <View style={[styles.innerContainer,innerContainerTransparentStyle]}>

                                <View>
                                    <View style={{flexDirection:"row",justifyContent:"space-around",alignItems:"center"}}>

                                        <View  style={{flex:1,alignItems:'center'}}><Text style={{fontSize:20}}>{modalName=='代金券'?'选择代金券':modalName=='微信扫码支付'?"微信扫码支付":'支付宝支付'}</Text></View>

                                        <TouchableHighlight underlayColor={"#fff"} onPress={()=>{this._setModalVisible(false)} } style={{}}>
                                            <Image style={{height:30,width:30}} source={close}/>
                                        </TouchableHighlight>


                                    </View>


                                    <View style={{padding:10}}>

                                        {
                                            modalName=='代金券'?
                                                <ScrollView style={{maxHeight:Dimensions.get('window').height-200}}>
                                                    <View style={{marginTop: 10, alignItems:'center'}}>
                                                        <Text style={{color:'#ff7000', fontSize: 12, textAlign: 'center'}}>tips:不可叠加、部分叠加、无限叠加在同一种费用类型下不可同时使用</Text>
                                                    </View>
                                                    <View>
                                                        {
                                                            typeData.feeNames && typeData.feeNames.map((result,index) => {
                                                                let num = 0;
                                                                typeData[result.feeName].length > 0 && typeData[result.feeName].map(item => {
                                                                    if(item.flag) {
                                                                        num += item.couponMoney;
                                                                    }
                                                                });
                                                                return (
                                                                    <View style={{paddingTop:10, paddingBottom: 10}} key={index}>
                                                                        <Text style={{fontSize: 14, fontWeight: 'normal'}}><Text style={{fontSize: 16}}>{result.feeName}</Text>：共计优惠<Text style={{color:'red'}}>{num}元</Text></Text>
                                                                        <View style={{flexDirection:"row",flexWrap:"wrap"}}>
                                                                            {
                                                                                typeData[result.feeName].length > 0 && typeData[result.feeName].map((item,index) => (
                                                                                        <TouchableHighlight style={{width:"33.33%",}} underlayColor="transparent" onPress={()=>{this.selectCoupon(item, result)}} key={index}>
                                                                                            <View style={{alignItems:"center",justifyContent:"center",padding:5,marginTop:10,marginRight:10,borderWidth:1,borderColor:!item.flag?"#f0f0f0":"#fff",backgroundColor:!item.flag?"#fff":"#ff7000",borderRadius:5}}>

                                                                                                {/*{item.ifOverlay==1&&<View style={{position:"absolute" ,zIndex:999,top:0,right:0,backgroundColor:"red",padding:2}}><Text style={{color:'#fff',fontWeight:'bold'}}>叠</Text></View>}*/}
                                                                                                {item.couponType==0&&<View style={{flexDirection:"row-reverse",marginBottom:5}}><Text>纸质</Text></View>}
                                                                                                <Text style={{fontSize:18,color:!item.flag?"#000":"#fff",fontWeight:"bold"}}>{item.couponMoney}</Text>
                                                                                                <Text style={{marginTop:5,color:!item.flag?"#000":"#fff",fontSize:12}}>{item.couponName}</Text>
                                                                                                <Text style={{color:!item.flag?"#000":"#fff",marginTop:5,fontSize:12}}>满{item.condition}可用</Text>
                                                                                                <Text style={{color:!item.flag?"#000":"#fff",marginTop:5,fontSize:12,fontWeight:"bold"}}>({item.ifOverlay==0?'不可叠加':item.ifOverlay==1?'可叠加':'无限叠加'})</Text>
                                                                                            </View>
                                                                                        </TouchableHighlight>
                                                                                    )
                                                                                )
                                                                            }
                                                                        </View>
                                                                    </View>
                                                                )})
                                                        }

                                                    </View>
                                                </ScrollView>:
                                                modalName=='微信扫码支付'?
                                                    <View>

                                                        <ScrollView style={{maxHeight:Dimensions.get('window').height-200}}>

                                                            <View>
                                                                <View style={styles.a}>
                                                                    <Text style={{flex: 1}}>支付说明:</Text>
                                                                    <View style={[styles.b, {flex: 3}]}>
                                                                        <Text style={{color: "black",fontWeight:"bold"}}>1.长按保存下方二维码。</Text>
                                                                        <Text style={{color: "grey"}}><Text style={{color: "black",fontWeight:"bold"}}>2.点击"复制并支付"按钮，将会自动复制订单号到系统粘贴板，且打开微信。</Text>点击微信"扫一扫"功能，进入微信扫码页面。在"微信扫码"页面中选择右上角相册，选择第一步保存的二维码图片,将会打开微信转账支付页面</Text>
                                                                        <Text style={{color: "black",fontWeight:"bold"}}>3.将复制好的订单号粘贴到微信转账页面的备注中。此操作一定要做，否则系统判定支付失败。</Text>

                                                                        <Text style={{color: "grey"}}><Text style={{color: "black",fontWeight:"bold"}}>4.输入转账金额,</Text>金额为
                                                                            <Text
                                                                                style={{color: "red", fontWeight: "bold"}}>

                                                                                {(this.state.Accounts == null) ? (dataPay.price || dataPay.price === 0 ? (dataPay.price).toFixed(2) : (dataPay.dataPay.amount).toFixed(2)) : this.state.Accounts.toFixed(2)}

                                                                                元(必须为{(this.state.Accounts == null) ? (dataPay.price || dataPay.price === 0 ? (dataPay.price).toFixed(2) : (dataPay.dataPay.amount).toFixed(2)) : this.state.Accounts.toFixed(2)}
                                                                                元多转或少转都会导致系统判定支付失败！！！)</Text></Text>
                                                                    </View>
                                                                </View>
                                                                <View style={styles.a}>
                                                                    <Text style={{flex: 1}}>订单号(该订单号为您支付的唯一凭证):</Text>
                                                                    <View style={[styles.b, {flex: 3, marginTop: 5}]}>
                                                                        <Text style={{color: "grey"}}>
                                                                            {tradeNo}
                                                                        </Text>
                                                                    </View>
                                                                </View>

                                                                <View style={{
                                                                    flexDirection: "row",
                                                                    alignItems: "center",
                                                                    justifyContent: "center"
                                                                }}>


                                                                    <View style={{alignItems: "center", padding: 10}}>
                                                                        <TouchableHighlight underlayColor={"#367d80"}
                                                                                            style={{
                                                                                                padding: 10,
                                                                                                borderWidth: 1,
                                                                                                borderColor: "#fff",
                                                                                                width: 150,
                                                                                                backgroundColor: "#f17e3a",
                                                                                                borderRadius: 10
                                                                                            }} onPress={()=>{this.setClipboard(true)}}>
                                                                            <Text

                                                                                style={{
                                                                                    fontSize: 16,
                                                                                    textAlign: "center",
                                                                                    color: "#fff"
                                                                                }}>
                                                                                复制并支付
                                                                            </Text>
                                                                        </TouchableHighlight>
                                                                    </View>


                                                                </View>


                                                                <TouchableHighlight onLongPress={()=>this.download(this.state.qrcode)} underlayColor="transparent">

                                                                    <Image  style={{
                                                                        width: "100%",
                                                                        height: 300,
                                                                        resizeMode: "contain"
                                                                    }} source={{uri:this.state.qrcode}}/>


                                                                </TouchableHighlight>

                                                                <View>
                                                                    <View>
                                                                        <Text style={{
                                                                            color: "red",
                                                                            marginTop: 10
                                                                        }}>有任何问题请联系我们</Text>
                                                                        <Text onPress={() => {
                                                                            Linking.openURL('tel:15801327369');
                                                                        }} style={{
                                                                            color: "red",
                                                                            marginTop: 10,
                                                                            textDecorationLine:"underline"
                                                                        }}>手机号:15801327369</Text>
                                                                        <Text style={{color: "red", marginTop: 10}}
                                                                              selectable={true}>微信:huiz42b</Text>

                                                                    </View>
                                                                    <Text style={{
                                                                        color: "#009def",
                                                                        marginTop: 10,
                                                                        textAlign: "center",
                                                                        fontWeight: "bold",
                                                                        fontSize: 18
                                                                    }}>支付教程</Text>

                                                                    <View>
                                                                        <Image style={{
                                                                            width: "100%",
                                                                            height: 2000,
                                                                            resizeMode: "contain"
                                                                        }} source={wxTeach}/>
                                                                    </View>


                                                                </View>

                                                            </View>




                                                        </ScrollView>

                                                    </View>:

                                                <View>

                                                    <ScrollView style={{maxHeight:Dimensions.get('window').height-200}}>
                                                        {zfbPayFlag ?
                                                            <View>
                                                            <View style={styles.a}>
                                                                <Text style={{flex: 1}}>支付说明:</Text>
                                                                <View style={[styles.b, {flex: 3}]}>
                                                                    <Text
                                                                        style={{color: "black",fontWeight:"bold"}}>1.点击"复制并支付"按钮复制订单号，会自动将订单号复制到系统粘贴板中，且打开支付宝。</Text>
                                                                    <Text style={{color: "black",fontWeight:"bold"}}>2.将复制好的订单号粘贴到支付宝转账页面的备注中。此操作一定要做，否则系统判定支付失败。</Text>

                                                                    <Text style={{color: "grey"}}><Text style={{color: "black",fontWeight:"bold"}}>3.输入转账金额,</Text>金额为
                                                                        <Text
                                                                            style={{color: "red", fontWeight: "bold"}}>

                                                                            {(this.state.Accounts == null) ? (dataPay.price || dataPay.price === 0 ? (dataPay.price).toFixed(2) : (dataPay.dataPay.amount).toFixed(2)) : this.state.Accounts.toFixed(2)}

                                                                            元(必须为{(this.state.Accounts == null) ? (dataPay.price || dataPay.price === 0 ? (dataPay.price).toFixed(2) : (dataPay.dataPay.amount).toFixed(2)) : this.state.Accounts.toFixed(2)}
                                                                            元多转或少转都会导致支付失败！！！)</Text></Text>
                                                                </View>
                                                            </View>
                                                            <View style={styles.a}>
                                                                <Text style={{flex: 1}}>订单号(该订单号为您支付的唯一凭证):</Text>
                                                                <View style={[styles.b, {flex: 3, marginTop: 5}]}>
                                                                    <Text style={{color: "grey"}}>
                                                                        {tradeNo}
                                                                    </Text>
                                                                </View>
                                                            </View>

                                                            <View style={{
                                                                flexDirection: "row",
                                                                alignItems: "center",
                                                                justifyContent: "center"
                                                            }}>


                                                                <View style={{alignItems: "center", padding: 10}}>
                                                                    <TouchableHighlight underlayColor={"#367d80"}
                                                                                        style={{
                                                                                            padding: 10,
                                                                                            borderWidth: 1,
                                                                                            borderColor: "#fff",
                                                                                            width: 150,
                                                                                            backgroundColor: "#f17e3a",
                                                                                            borderRadius: 10
                                                                                        }} onPress={()=>{this.setClipboard(false)}}>
                                                                        <Text

                                                                            style={{
                                                                                fontSize: 16,
                                                                                textAlign: "center",
                                                                                color: "#fff"
                                                                            }}>
                                                                            复制并支付
                                                                        </Text>
                                                                    </TouchableHighlight>
                                                                </View>

                                                                {/*<View style={{alignItems: "center", padding: 10}}>*/}
                                                                    {/*<TouchableHighlight underlayColor={"transparent"}*/}
                                                                                        {/*style={{*/}
                                                                                            {/*padding: 10,*/}
                                                                                            {/*borderWidth: 1,*/}
                                                                                            {/*borderColor: "#fff",*/}
                                                                                            {/*width: 120,*/}
                                                                                            {/*backgroundColor: "#009def",*/}
                                                                                            {/*borderRadius: 10*/}
                                                                                        {/*}} onPress={this.openZFB}>*/}
                                                                        {/*<Text*/}

                                                                            {/*style={{*/}
                                                                                {/*fontSize: 16,*/}
                                                                                {/*textAlign: "center",*/}
                                                                                {/*color: "#fff"*/}
                                                                            {/*}}>*/}
                                                                            {/*打开支付宝*/}
                                                                        {/*</Text>*/}
                                                                    {/*</TouchableHighlight>*/}
                                                                {/*</View>*/}

                                                            </View>


                                                            <View>
                                                                <View>
                                                                    <Text style={{
                                                                        color: "red",
                                                                        marginTop: 10
                                                                    }}>有任何问题请联系我们</Text>
                                                                    <Text onPress={() => {
                                                                        Linking.openURL('tel:15801327369');
                                                                    }} style={{
                                                                        color: "red",
                                                                        marginTop: 10,
                                                                        textDecorationLine:"underline"
                                                                    }}>手机号:15801327369</Text>
                                                                    <Text style={{color: "red", marginTop: 10}}
                                                                          selectable={true}>微信:huiz42b</Text>

                                                                </View>
                                                                <Text style={{
                                                                    color: "#009def",
                                                                    marginTop: 10,
                                                                    textAlign: "center",
                                                                    fontWeight: "bold",
                                                                    fontSize: 18
                                                                }}>支付教程</Text>

                                                                <Image style={{
                                                                    width: "100%",
                                                                    height: 800,
                                                                    resizeMode: "contain"
                                                                }} source={zfbTeach2}/>

                                                            </View>

                                                        </View> :
                                                            <View>
                                                            <View style={styles.a}>
                                                                <Text style={{flex: 1}}>支付说明:</Text>
                                                                <View style={[styles.b, {flex: 3}]}>
                                                                    <Text
                                                                        style={{color: "grey"}}>1.点击"打开支付宝"按钮,会直接进入转账页面。</Text>
                                                                    <Text style={{color: "grey"}}>2.输入转账金额,金额为
                                                                        <Text
                                                                            style={{color: "red", fontWeight: "bold"}}>

                                                                            {(this.state.Accounts == null) ? (dataPay.price || dataPay.price === 0 ? (dataPay.price).toFixed(2) : (dataPay.dataPay.amount).toFixed(2)) : this.state.Accounts.toFixed(2)}

                                                                            元(必须为{(this.state.Accounts == null) ? (dataPay.price || dataPay.price === 0 ? (dataPay.price).toFixed(2) : (dataPay.dataPay.amount).toFixed(2)) : this.state.Accounts.toFixed(2)}
                                                                            元多转或少转都会导致支付失败！！！)</Text></Text>
                                                                    <Text
                                                                        style={{color: "grey"}}>3.转账成功后，将支付宝交易号复制到输入框并确认。(支付宝交易号在支付宝页面-我的-账单-找到刚转账的订单点进去订单详情页-复制订单号)</Text>
                                                                </View>
                                                            </View>
                                                            <View style={styles.a}>
                                                                <Text style={{flex: 1}}>支付宝订单号:</Text>
                                                                <View style={[styles.b, {flex: 3, marginTop: 5}]}>
                                                                    <TextInput
                                                                        placeholder={'请输入支付宝交易订单号'}
                                                                        // value={this.state.username}
                                                                        style={{
                                                                            minWidth: '100%',
                                                                            padding: 10,
                                                                            borderRadius: 5,
                                                                            borderColor: "grey",
                                                                            borderWidth: 1
                                                                        }}
                                                                        underlineColorAndroid="transparent"
                                                                        onChangeText={(alipayTradeNo) => this.setState({alipayTradeNo})}
                                                                    >
                                                                    </TextInput>
                                                                </View>
                                                            </View>

                                                            <View style={{
                                                                flexDirection: "row",
                                                                alignItems: "center",
                                                                justifyContent: "space-between"
                                                            }}>
                                                                <View style={{alignItems: "center", padding: 10}}>
                                                                    <TouchableHighlight underlayColor={"transparent"}
                                                                                        style={{
                                                                                            padding: 10,
                                                                                            borderWidth: 1,
                                                                                            borderColor: "#fff",
                                                                                            width: 120,
                                                                                            backgroundColor: "#009def",
                                                                                            borderRadius: 10
                                                                                        }} onPress={this.openZFB}>
                                                                        <Text

                                                                            style={{
                                                                                fontSize: 16,
                                                                                textAlign: "center",
                                                                                color: "#fff"
                                                                            }}>
                                                                            打开支付宝
                                                                        </Text>
                                                                    </TouchableHighlight>
                                                                </View>

                                                                <View style={{alignItems: "center", padding: 10}}>
                                                                    <TouchableHighlight underlayColor={"#367d80"}
                                                                                        style={{
                                                                                            padding: 10,
                                                                                            borderWidth: 1,
                                                                                            borderColor: "#fff",
                                                                                            width: 100,
                                                                                            backgroundColor: "#f17e3a",
                                                                                            borderRadius: 10
                                                                                        }} onPress={this.submitAlipay}>
                                                                        <Text

                                                                            style={{
                                                                                fontSize: 16,
                                                                                textAlign: "center",
                                                                                color: "#fff"
                                                                            }}>
                                                                            确定支付
                                                                        </Text>
                                                                    </TouchableHighlight>
                                                                </View>
                                                            </View>


                                                            <View>
                                                                <View>
                                                                    <Text style={{
                                                                        color: "red",
                                                                        marginTop: 10
                                                                    }}>有任何问题请联系我们</Text>
                                                                    <Text onPress={() => {
                                                                        Linking.openURL('tel:15801327369');
                                                                    }} style={{
                                                                        color: "red",
                                                                        marginTop: 10
                                                                    }}>手机号:15801327369</Text>
                                                                    <Text style={{color: "red", marginTop: 10}}
                                                                          selectable={true}>微信:huiz42b</Text>
                                                                </View>
                                                                <Text style={{
                                                                    color: "#009def",
                                                                    marginTop: 10,
                                                                    textAlign: "center",
                                                                    fontWeight: "bold",
                                                                    fontSize: 18
                                                                }}>支付教程</Text>

                                                                <Image style={{
                                                                    width: "100%",
                                                                    height: 3000,
                                                                    resizeMode: "contain"
                                                                }} source={zfbTeach}/>

                                                            </View>


                                                        </View>


                                                        }

                                                    </ScrollView>

                                                </View>

                                        }


                                    </View>
                                </View>




                            </View>
                        </View>
                    </Modal>



                </View>



                <View style={[styles.style1,styles.view]}>
                    <Text>金额：</Text>
                    {/*<Text style={{color:"#55b72d"}}>{dataPay.price ? (dataPay.price+poundage).toFixed(2) : (dataPay.dataPay.amount+poundage).toFixed(2)}元</Text>*/}
                    <Text style={{color:"#55b72d"}}>{dataPay.price || dataPay.price === 0 ? (dataPay.price).toFixed(2) : (dataPay.dataPay.amount).toFixed(2)}元</Text>
                </View>

                <WhiteSpace size="lg"/>

                <View style={{backgroundColor:"#fff",paddingBottom:70}}>
                    <View style={[styles.view,styles.padd]}>
                        <Text>支付方式:
                            {/*{poundage!=0&&<Text style={{color:"red"}}>信用卡支付需缴纳千分之一手续费</Text>}*/}
                        </Text>
                    </View>


                    {/*银行卡支付*/}

                    <View style={styles.padd}>



                        <TouchableHighlight underlayColor="transparent"
                                            onPress={()=>this.selectPayType(1)}
                                            style={[styles.view,]}>

                            <View style={{flexDirection:"row",alignItems:"center",justifyContent:"space-between"}}>



                                <View style={{flexDirection:"row",alignItems:"center"}}>
                                    <View>
                                        <Image style={styles.payImg} source={bankcard}/>
                                    </View>

                                    <View style={{width:100}}>
                                        <Text>银行卡支付</Text>
                                    </View>
                                </View>



                                <View style={{...Platform.select({
                                        // android: {
                                        //     marginLeft:"50%"
                                        // },
                                        //
                                        // ios:{
                                        //     marginLeft:"50%",
                                        // }
                                    }),backgroundColor:wechatPayType == 1 ? "#55b72d" :'#fff',
                                    width:20,height:20,borderRadius:10,borderColor:"#f0f0f0",borderWidth:1,overflow:"hidden"}} >
                                    <Image style={styles.paySelect} source={selectIcon}/>
                                </View>
                            </View>

                        </TouchableHighlight>


                        <View style={{margin:10,borderColor:"#f0f0f0",borderWidth:1,display:this.state.bankcard.length>0&&wechatPayType == 1 ?'flex':'none'}}>

                            {
                                this.state.bankcard.map((item,index)=>
                                    <TouchableHighlight key={index} underlayColor="transparent" onPress={()=>this.setBankPay(item)}>
                                        <View style={{flexDirection:"row",padding:10,borderBottomColor:"#f0f0f0",borderBottomWidth:1}}>

                                            <View style={{flex:4,flexDirection:"row"}}>

                                                <View  style={{flexDirection:"row",flexWrap:'wrap'}}>
                                                    <Text>{item.bankName}:</Text>
                                                    <Text>{item.cardNo}</Text>
                                                    <View style={{padding:3,backgroundColor:"#f1803a",alignItems:"center",borderWidth:1,borderColor:"#fff",borderRadius:3}}><Text style={{color:"#fff",fontSize:10}}>{item.cardType=="DEBITCARD"?"储蓄卡":"信用卡"}</Text></View>

                                                </View>


                                            </View>


                                            <TouchableHighlight style={{marginLeft:10,flex:1}} underlayColor="transparent" onPress={()=>{this.unbind(item)}}>
                                                <View style={{flexDirection:"row",}}>

                                                    <View style={{flexDirection:"row",alignItems:"center"}}>
                                                        <View>
                                                            <Image style={{height:16,width:16}} source={unbind}/>
                                                        </View>

                                                        <View style={{width:100}}>
                                                            <Text>解绑</Text>
                                                        </View>

                                                    </View>

                                                </View>


                                            </TouchableHighlight>



                                            <View style={{
                                                backgroundColor:bankcardNo == item.bindId ? "#55b72d" :'#fff',
                                                width:20,height:20,borderRadius:10,borderColor:"#f0f0f0",borderWidth:1,overflow:"hidden"}} >
                                                <Image style={styles.paySelect} source={selectIcon}/>
                                            </View>
                                        </View>


                                    </TouchableHighlight>
                                )
                            }


                            <TouchableHighlight underlayColor="transparent" onPress={this.addBankcard}>
                                <View style={{flexDirection:"row",padding:10,borderBottomColor:"#f0f0f0",borderBottomWidth:1}}>

                                    <View style={{flexDirection:"row",alignItems:"center"}}>
                                        <View>
                                            <Image style={{height:16,width:16}} source={add}/>
                                        </View>

                                        <View style={{width:100}}>
                                            <Text>添加银行卡</Text>
                                        </View>

                                    </View>

                                </View>


                            </TouchableHighlight>





                        </View>

                    </View>

                    {/*钱包支付*/}


                    <TouchableHighlight underlayColor="transparent"
                                        onPress={()=>this.selectPayType(4)}
                                        style={[styles.view,styles.padd]}>

                        <View style={{flexDirection:"row",alignItems:"center",justifyContent:"space-between"}}>


                            <View style={{flexDirection:"row",alignItems:"center"}}>
                                <View>
                                    <Image style={styles.payImg} source={wallet}/>
                                </View>

                                <View style={{width:100}}>
                                    <Text>钱包支付</Text>
                                </View>
                            </View>





                            <View style={{...Platform.select({
                                    // android: {
                                    //     marginLeft:"50%"
                                    // },
                                    //
                                    // ios:{
                                    //     marginLeft:"50%",
                                    // }
                                }),backgroundColor:wechatPayType == 4 ? "#55b72d" :'#fff',
                                width:20,height:20,borderRadius:10,borderColor:"#f0f0f0",borderWidth:1,overflow:"hidden"}} >
                                <Image style={styles.paySelect} source={selectIcon}/>
                            </View>
                        </View>

                    </TouchableHighlight>




                    <TouchableHighlight underlayColor="transparent"
                                        onPress={()=>this.selectPayType(5)}
                                        style={[styles.view,styles.padd]}>

                        <View style={{flexDirection:"row",alignItems:"center",justifyContent:"space-between"}}>


                            <View style={{flexDirection:"row",alignItems:"center"}}>
                                <View>
                                    <Image style={styles.payImg} source={wechatpay}/>
                                </View>

                                <View style={{width:100}}>
                                    <Text>微信支付</Text>
                                </View>
                            </View>

                            <View style={{...Platform.select({

                                }),backgroundColor:wechatPayType == 5 ? "#55b72d" :'#fff',
                                width:20,height:20,borderRadius:10,borderColor:"#f0f0f0",borderWidth:1,overflow:"hidden"}} >
                                <Image style={styles.paySelect} source={selectIcon}/>
                            </View>
                        </View>

                    </TouchableHighlight>

                    {
                        // zfbPayFlag&&
                        <TouchableHighlight underlayColor="transparent"
                                            onPress={()=>this.selectPayType(6)}
                                            style={[styles.view,styles.padd]}>

                            <View style={{flexDirection:"row",alignItems:"center",justifyContent:"space-between"}}>


                                <View style={{flexDirection:"row",alignItems:"center"}}>
                                    <View>
                                        <Image style={styles.payImg} source={alipay}/>
                                    </View>

                                    <View style={{width:100}}>
                                        <Text>支付宝支付</Text>
                                    </View>
                                </View>

                                <View style={{...Platform.select({

                                    }),backgroundColor:wechatPayType == 6 ? "#55b72d" :'#fff',
                                    width:20,height:20,borderRadius:10,borderColor:"#f0f0f0",borderWidth:1,overflow:"hidden"}} >
                                    <Image style={styles.paySelect} source={selectIcon}/>
                                </View>
                            </View>

                        </TouchableHighlight>
                    }








                    {/*代金券*/}


                    {
                        dataPay.moneyData&&dataPay.fenqiType&&(this.state.aaa.length==1&&this.state.aaa[0]=='100000')?
                            <View style={{marginTop:10,alignItems:"center"}}>
                                <Text>分期不可使用优惠券</Text>
                            </View>

                            :
                            dataPay.moneyData?
                                (

                                    coupon.length>0?

                                        <View style={{padding:10,marginTop:10,borderBottomColor:"#f0f0f0",borderBottomWidth:2}}>
                                            <TouchableHighlight onPress={this.couponPay} underlayColor="transparent">
                                                <View style={{flexDirection:"row",alignItems:"center"}}>
                                                    <Text>代金券支付</Text>
                                                    <View  style={{flex:1,flexDirection:"row-reverse"}}><Text style={{color:"red"}}>-{this.state.couponMoney}元</Text></View>
                                                    <View>
                                                        <Image style={styles.img2} source={right}/>
                                                    </View>
                                                </View>
                                            </TouchableHighlight>
                                        </View>

                                        :
                                        <View style={{marginTop:10,alignItems:"center"}}>
                                            <Text>{this.state.bbb?'暂无可用优惠券':'查询优惠券中'}</Text>
                                        </View>
                                ):null

                    }







                    {/*<TouchableHighlight onPress={()=>this.selectPayType(3)} underlayColor="transparent" style={[styles.style1,styles.view,styles.padd]}>*/}

                    {/*<View style={{flexDirection:"row",alignItems:"center"}}>*/}
                    {/*<View>*/}
                    {/*<Image style={styles.payImg} source={alipay}/>*/}
                    {/*</View>*/}

                    {/*<View style={{width:100}}>*/}
                    {/*<Text>支付宝支付</Text>*/}
                    {/*</View>*/}


                    {/*<View*/}
                    {/*style={{...Platform.select({*/}
                    {/*android: {*/}
                    {/*marginLeft:"50%"*/}
                    {/*},*/}

                    {/*ios:{*/}
                    {/*marginLeft:"50%",*/}
                    {/*}*/}
                    {/*}),backgroundColor:wechatPayType == 3 ? "#55b72d" :'#fff',*/}
                    {/*width:20,height:20,borderRadius:10,borderColor:"#f0f0f0",borderWidth:1,overflow:"hidden"}} >*/}
                    {/*<Image style={styles.paySelect} source={selectIcon}/>*/}
                    {/*</View>*/}
                    {/*</View>*/}

                    {/*</TouchableHighlight>*/}

                </View>


                <View style={styles.userItem}>
                    <View style={{padding:10,flexDirection:"row",justifyContent:"space-around",flex:1,borderTopColor:"grey",borderTopWidth:1}}>
                        <Text>共计:</Text>
                        {/*<Text style={{color:"#f1803a"}}>{dataPay.price ? (dataPay.price+poundage).toFixed(2) : (dataPay.dataPay.amount+poundage).toFixed(2)}元</Text>*/}
                        <Text style={{color:"#f1803a"}}>{(this.state.Accounts==null)?(dataPay.price || dataPay.price === 0 ? (dataPay.price).toFixed(2) : (dataPay.dataPay.amount).toFixed(2)):this.state.Accounts.toFixed(2)}元</Text>
                    </View>
                    <TouchableHighlight onPress={this.onPay} underlayColor="#fff"  style={{padding:10,backgroundColor:"#f1803a",flex:1}}>
                        <Text style={{color:"#fff",paddingLeft:50}}>确认支付</Text>
                    </TouchableHighlight>
                </View>

            </View>
        );
    }

}


const styles = StyleSheet.create({

    userItem:{
        backgroundColor:"#fff",flexDirection:"row",position:"absolute",zIndex:999,


        ...Platform.select({
            ios: {
                bottom:65,
            },
            android: {
                bottom:a>1.9?95:80,
            },
        }),

        ...ifIphoneX({
            bottom:105,
        }, {

        })

    },

    a:{
        marginTop:10
    },

    b:{
        // marginLeft:10,flex:1,
    },

    view:{
        padding:10,
    },


    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,

    },
    innerContainer: {
        borderRadius: 10,
    },

    padd:{
        borderBottomWidth:1,
        borderBottomColor:"#f0f0f0"
    },

    style1:{
        flexDirection:"row",backgroundColor:"#fff",justifyContent:"space-between"
    },

    paySelect:{
        width:20,
        height:20
    },

    paySelectView:{
        width:20,
        height:20,borderRadius:10,
        overflow:"hidden",


    },
    img2: {
        height:12,
        width:12
    },

    payImg:{
        width:40,
        height:40,
        marginRight:10
    }

});


