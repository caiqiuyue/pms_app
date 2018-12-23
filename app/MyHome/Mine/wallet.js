import React,{Component} from 'react';
import {
    View, Text, TouchableHighlight, Image, ScrollView, StyleSheet, Platform, CameraRoll, Alert,
    DeviceEventEmitter
} from 'react-native';
import Dimensions from 'Dimensions';
import right from './style/right.png'
import topUp from './style/topUp.png'
import withdrawal from './style/withdrawal.png'
import axios from "../../axios";
import {Toast} from "antd-mobile";


export default class Mine extends React.Component {
    constructor(props) {
        super(props);
        this.state={

            data:{}
        }

    }


    componentDidMount(){

        this.yiPay =  DeviceEventEmitter.addListener('yiPay', (item)=>{
            if(item=='topUp'||item=='withdrawalurl'){

                axios.post(`/pay/queryUserBalance`, {

                })
                    .then( (response)=> {
                        console.log(response,'查询钱包');
                        console.log(JSON.parse(response.data.data),'查询钱包');

                        if(response.data.code==0){

                            this.setState({
                                data:JSON.parse(response.data.data)
                            })
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

    //实名认证
    realName=(item)=>{

        const { navigate } = this.props.navigation;


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
                                if(response.data.code==1){
                                    Toast.info(response.data.message, 1);
                                }else {
                                    let bankcard = JSON.parse(response.data.data);
                                    console.log(bankcard);

                                    if(bankcard.length>0){
                                        if(item==1){
                                            navigate('TopUp',{ user: "" });
                                        }else if(item==2){
                                            navigate('Withdrawal',{ user: this.state.data });
                                        }

                                    }else {
                                        Alert.alert('未绑定银行卡','请先绑定银行卡',
                                            [
                                                {text:"取消", onPress:this.cancelSelected},
                                                {text:"确认", onPress:this.comfirmSelected}
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


                }



            })
            .catch(function (error) {
                console.log(error);
            });
    }

    componentWillMount(){

        axios.post(`/pay/yeePay`, {})
            .then( (response)=> {
                console.log(response,'实名认证');
                if(response.data.code==0){
                    axios.post(`/pay/queryUserBalance`, {

                    })
                        .then( (response)=> {
                            console.log(response,'查询钱包');
                            console.log(JSON.parse(response.data.data),'查询钱包');

                            if(response.data.code==0){

                                this.setState({
                                    data:JSON.parse(response.data.data)
                                })
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



    //充值
    topUp=()=>{

        this.realName(1)

    };

    //提现
    withdrawal=()=>{

        this.realName(2)

    };

    //明细
    detail=()=>{
        const { navigate } = this.props.navigation;
        navigate('WalletDetail',{ user: this.state.data });

    };




    render(){

        let {data} =this.state;


        return (



                <View style={{height:Dimensions.get("window").height,backgroundColor:"#fff",padding:10,}}>

                    <View style={{flexDirection:"row",justifyContent:"space-between",padding:10,backgroundColor:"#f0f0f0"}}>
                        <View>
                            <Text>余额账户（元）</Text>
                            <Text style={{fontSize:35,marginTop:5,color:"#f1803a",fontWeight:'bold'}}>{data.availableAmount?data.availableAmount:"0.00"}</Text>
                        </View>
                        <TouchableHighlight onPress={this.detail} underlayColor="transparent" style={{marginRight:10}}>
                            <Text>明细</Text>
                        </TouchableHighlight>
                    </View>


                    <TouchableHighlight onPress={this.topUp} underlayColor="#f0f0f0">
                        <View style={styles.aa}>
                            <View style={styles.imgView}><Image style={styles.img} source={topUp}/></View>
                            <Text>充值</Text>
                            <View style={{flex:1}}></View>
                            <View>
                                <Image style={styles.img2} source={right}/>
                            </View>
                        </View>
                    </TouchableHighlight>

                    <TouchableHighlight onPress={this.withdrawal} underlayColor="#f0f0f0">
                        <View style={styles.aa}>
                            <View style={styles.imgView}><Image style={styles.img3} source={withdrawal}/></View>
                            <Text>提现</Text>
                            <View style={{flex:1}}></View>
                            <View>
                                <Image style={styles.img2} source={right}/>
                            </View>
                        </View>
                    </TouchableHighlight>

                </View>



        )

    }
}

const styles = StyleSheet.create({
    img: {
        height:20,
        width:20,
    },

    img2: {
        height:16,
        width:16
    },

    img3: {
        height:22,
        width:22
    },

    imgView:{
        marginRight:10,
        width:21,
        alignItems:'center'

    },

    aa:{
        borderBottomColor:"#f0f0f0",
        borderBottomWidth:3,
        flexDirection:"row",
        backgroundColor:"#fff",
        padding:10,paddingTop:15,
        paddingBottom:15,
        // borderRadius:10,
        alignItems:"center"
    }


});



