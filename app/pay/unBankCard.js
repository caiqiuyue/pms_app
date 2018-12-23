import React, { Component } from 'react';
import {
    WebView,
    View, DeviceEventEmitter,Text


} from 'react-native';


import axios from "../../app/axios";

import close from "../MyHome/Mine/style/close.jpg";
import Dimensions from 'Dimensions';
import moment from 'moment'

import {Toast,} from 'antd-mobile'



export default class myBill extends Component {

    constructor(props) {
        super(props);

        this.state={
            data:null
        }

    }


    componentWillMount(){
        const {getParam} = this.props.navigation;
        let data = getParam("user");
        console.log(data,'解绑卡---------');
        this.setState({
            data
        })

    }


    componentWillUnmount(){
        DeviceEventEmitter.emit('yiPay','addBankCard');
    }


    getQueryString=(paramer,item) =>{

        // var url = location.search; //获取url中"?"符后的字串
        // var theRequest = {};
        // if (url.indexOf("?") != -1) {
        //     var str = url.substring(url.indexOf("?")+1);
        //     // var str = str.substr(1);
        //     console.log(str);
        //     strs = str.split("&");
        //     console.log(strs);
        //     for(var i = 0; i < strs.length; i ++) {
        //         theRequest[strs[i].split("=")[0]]=decodeURI(strs[i].split("=")[1]);
        //     }
        // }
        // console.log(theRequest);
        // return theRequest;



        let url=item.split("?")[1];            /*获取url里"?"后面的值*/
        if(url.indexOf("&")>0){                                      /*判断是否是一个参数还是多个参数*/
            urlParamArry=url.split("&");                            /*分开每个参数，并放到数组里*/
            for(let i=0; i<urlParamArry.length; i++){
                let paramerName=urlParamArry[i].split("=");   /*把每个参数名和值分开，并放到数组里*/
                if(paramer==paramerName[0]){                     /*匹配输入的参数和数组循环出来的参数是否一样*/
                    return paramerName[1];                           /*返回想要的参数值*/
                }
            }
        }else{                                                              /*判断只有个参数*/
            let paramerValue=url.split("=")[1];
            return paramerValue;
        }


    }


    a = (event)=>{
        console.log(event,"event")

        if(event.url.indexOf("http://www.fangapo.cn/unbind.html?token=")!=-1&&event.title=='解绑卡'){

            let urlStr = event.url;
            
            let token = this.getQueryString("token",urlStr)
            
            console.log("token---------",token);

            axios.post(`/pay/unbindCard`, {
                token:token,
                bindId:this.state.data.bindId,
                requestNo:this.state.data.requestNo,

            })
                .then(function (response) {
                    console.log(response,'解绑卡');

                    if(JSON.parse(response.data.data).code==1){
                        Toast.info('解绑卡成功',1)
                    }else {
                        Toast.info(JSON.parse(response.data.data).message,1)
                    }







                })
                .catch(function (error) {
                    console.log(error);
                });
            
        }


    }



    render() {

        let {data }= this.state;


        return (

            <View style={{backgroundColor:"#fff",
                height: Dimensions.get('window').height,
                width: Dimensions.get('window').width,
                paddingBottom:80
            }}>



                <WebView
                    style={{
                        // height: Dimensions.get('window').height,
                        // width: Dimensions.get('window').width,
                    }}
                    source={{uri: data.redirectUrl}}
                    onNavigationStateChange={(event)=>{this.a(event)}}

                />
            </View>


        )



    }


}





