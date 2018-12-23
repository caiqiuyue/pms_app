import React,{Component} from 'react';
import {
    View, Text, TouchableHighlight, Image, TextInput, StyleSheet, Platform, CameraRoll, Alert,
    DeviceEventEmitter
} from 'react-native';
import Dimensions from 'Dimensions';
import selectIcon from '../../pay/selectIcon.png'
import add from '../../pay/add.png'

import axios from "../../axios";
import {Toast} from "antd-mobile/lib/index";


export default class Mine extends React.Component {
    constructor(props) {
        super(props);
        this.state={

            bankcard:[],
            bankcardNo:false,
            amount:null,
            cardType:null,
        }

    }



    componentDidMount(){

        this.yiPay =  DeviceEventEmitter.addListener('yiPay', (item)=>{
            if(item=='topUp'){

                axios.post(`/pay/bindCardList`, {

                })
                    .then( (response)=> {
                        console.log(response,'查询绑卡列表');
                        if(response.data.code==1){
                            Toast.info(response.data.message, 1);
                        }else {
                            let bankcard = JSON.parse(response.data.data);
                            console.log(bankcard);

                            if(bankcard.length>0){
                                this.setState({

                                    bankcard,
                                    bankcardNo:bankcard&&bankcard[0].bindId
                                    // bankcardNo:wechatPayType==1?false:item,

                                });
                            }
                        }



                    })
                    .catch(function (error) {
                        console.log(error);
                    });
            }
        });
    }

    componentWillUnmount(){
        this.yiPay.remove();
    };


    componentWillMount(){

        axios.post(`/pay/bindCardList`, {

        })
            .then( (response)=> {
                console.log(response,'查询绑卡列表');
                if(response.data.code==1){
                    Toast.info(response.data.message, 1);
                }else {
                    let bankcard = JSON.parse(response.data.data);
                    console.log(bankcard);

                    if(bankcard.length>0){
                        this.setState({

                            bankcard,
                            bankcardNo:bankcard&&bankcard[0].bindId,
                            cardType:bankcard&&bankcard[0].cardType,

                        });
                    }
                }



            })
            .catch(function (error) {
                console.log(error);
            });


    }

    //选择银行卡
    setBankPay = (item) => {
        let {bankcardNo} = this.state;

        this.setState({
            bankcardNo:bankcardNo==item.bindId?false:item.bindId,
            cardType:item.cardType,

        })
    };

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


    //确定充值
    submitBtn=()=>{
        let {bankcardNo,amount,cardType} = this.state;
        const { navigate } = this.props.navigation;

        if(!bankcardNo){
            Toast.info('请选择银行卡',1)
            return
        }


        if(amount==null){
            Toast.info('请输入充值金额',1)
            return
        }

        if(amount==0){
            Toast.info('充值金额不得为0',1)
            return
        }

        if(cardType=='CREDITCARD'){
            Toast.info('暂不支持信用卡充值',1)
            return
        }

        axios.post(`/pay/orderRecharge`, {
            webCallbackUrl:'http://www.fangapo.cn/topUp.html',
            orderAmount:amount,
            bindCardId:bankcardNo,

        })
            .then(function (response) {
                console.log(response,'充值');

                if(response.data.code==1){
                    Toast.info(response.data.message, 1);
                }else{
                    let data = JSON.parse(response.data.data);

                    if(data.code&&data.code==1){
                        navigate('TopUpUrl',{ user:data });
                    }else {
                        Toast.info(data.message, 1);
                    }


                }




            })
            .catch(function (error) {
                console.log(error);
            });



    }


    render(){

        let {bankcardNo} =this.state;


        return (



                <View style={{height:Dimensions.get("window").height,backgroundColor:"#fff"}}>

                    <View style={{marginTop:10,}}>

                        {
                            this.state.bankcard.map((item,index)=>
                                <TouchableHighlight key={index} underlayColor="transparent" onPress={()=>this.setBankPay(item)}>
                                    <View style={{flexDirection:"row",padding:10,borderBottomColor:"#f0f0f0",borderBottomWidth:1}}>

                                        <View style={{flex:1,flexDirection:"row"}}>
                                            <Text>{item.bankName}:</Text>
                                            <Text>{item.cardNo}</Text>
                                            <View style={{padding:3,backgroundColor:"#f1803a",alignItems:"center",borderWidth:1,borderColor:"#fff",borderRadius:3}}><Text style={{color:"#fff",fontSize:10}}>{item.cardType=="DEBITCARD"?"储蓄卡":"信用卡"}</Text></View>

                                        </View>



                                        <View style={{
                                            backgroundColor:bankcardNo == item.bindId ? "#55b72d" :'#fff',marginRight:10,
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


                    <View>
                        <Text style={{fontSize:20,marginTop:10,marginLeft:10}}>充值金额:</Text>


                        <View style={{marginTop:10,flexDirection:"row",alignItems:"center",justifyContent:"center"}}>
                            <Text style={{fontSize:35}}>¥</Text>

                            <View style={{width:"80%",marginLeft:20}}>
                                <TextInput
                                    placeholder="充值金额"
                                    style={{minWidth:100,fontSize:20,padding:10,borderColor:"#ccc",borderWidth:1}}
                                    dataDetectorTypes='phoneNumber'
                                    keyboardType='numeric'
                                    underlineColorAndroid="transparent"
                                    onChangeText={(amount) => this.setState({amount})}
                                >
                                </TextInput>
                            </View>

                        </View>

                        <Text style={{margin:10,color:"grey",}}>充值到余额，充值账户无收益，提现需支付手续费</Text>

                    </View>


                    <View style={{alignItems:"center",marginTop:10}}>

                        <TouchableHighlight underlayColor={"#fff"} style={{padding:10,
                            borderWidth:1,borderColor:"#fff",width:100,backgroundColor:"#f17e3a",
                            borderRadius:10}} onPress={this.submitBtn }>
                            <Text

                                style={{fontSize:16,textAlign:"center",color:"#fff"}}>
                                充值
                            </Text>
                        </TouchableHighlight>


                    </View>

                </View>



        )

    }
}

const styles = StyleSheet.create({
    paySelect:{
        width:20,
        height:20
    },


});



