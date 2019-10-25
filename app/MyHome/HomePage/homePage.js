import React, { Component } from 'react';
import {
    Modal, DeviceEventEmitter, StyleSheet, Text, View, Image, ImageBackground, ListView, TouchableHighlight,
    Platform, Linking, ScrollView, Alert
} from 'react-native';
import Dimensions from 'Dimensions';
import { Carousel, Toast,} from 'antd-mobile';
import icon1 from './style/1.png';
import icon2 from './style/2.png';
import icon3 from './style/3.png';
import icon4 from './style/4.png';
import icon5 from './style/5.png';
import icon6 from './style/6.png';
import icon7 from './style/7.png';
import icon8 from './style/8.png';
import icon9 from './style/9.png';
import icon10 from './style/10.png';
import icon11 from './style/11.png';
import icon12 from './style/12.png';
import icon13 from './style/13.png';
import icon14 from './style/14.png';
import icon15 from './style/15.png';
import icon16 from './style/16.png';
import fnagkuai from './style/fnagkuai.png';
import close from "../Mine/style/close.jpg";
import left from '../Mine/style/left.png'
import carousel1 from './style/pangxie.jpg';
import carousel2 from './style/banner.png';
import carousel4 from './style/carousel4.png';

import initReactFastclick from 'react-fastclick';

import { ifIphoneX } from 'react-native-iphone-x-helper'

//import Sublet from "./thirdRow/sublet";
initReactFastclick();

import axios from "../../axios";
// import Suggestions from "./fourthRow/suggestions";
import JPushModule from 'jpush-react-native'
// import Message from "../Message/message";

import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {getData} from '../../components/active/reducer';
import base64 from "base-64";
import Contract from "../Mine/contract";
import CodePush from "react-native-code-push";

const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

class A extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [
                // {img:carousel1,imgUrl:'http://www.baidu.com'},
                {img:carousel4,imgUrl:''},
                {img:carousel2,imgUrl:''},
            ],
            dataSource: ds.cloneWithRows(['row 0']),
            checkinNo:'',
            hotelNo:'',
            status:null,
            constractImg:[],
            contractNo:'',
            animationType: 'none',//none slide fade
            modalVisible: false,//模态场景是否可见
            transparent: true,//是否透明显示
            hotelAlone:null,
            name:null,
            tokenKey:'',
            phone:null,
            payOrderData:{},
            realName:{},



    };
        this.flagNum = 1;
        this.imgCarousel = false;
    }


    _setModalVisible = (visible) => {
        this.setState({ modalVisible: visible });
    };


    getMyMsg = () => {
        axios.post(`/my/getMyMsg`, {

        })
            .then( (response)=> {
                console.log(response,'消息定时');
                let unread = response.data.unread;
                this.props.getData(unread);
            })
            .catch(function (error) {
                console.log(error);
            });
    };

    // cancelSelecte = ()=>{}
    walletSelected = ()=>{
        if(Platform.OS === 'android'){
            let url = 'http://a.app.qq.com/o/simple.jsp?pkgname=com.mypmsapp';
            Linking.openURL(url)
        }else {
            let url = 'itms-apps://itunes.apple.com/us/app/%E9%97%AA%E7%8C%AA/id1407629221?l=zh&ls=1&mt=8';
            Linking.openURL(url)
        }
    }
    componentWillMount(){

        // if(Platform.OS== 'android'){
        //     Alert.alert('下载最新app','为了更好的使用体验，安卓用户请卸载app后下载最新版本app！',
        //         [
        //             // {text:"取消", onPress:this.cancelSelecte},
        //             {text:"确认", onPress:this.walletSelected}
        //         ],
        //         { cancelable: false }
        //     );
        // }




        CodePush.sync();
        CodePush.allowRestart();//在加载完了可以允许重启

        //长链接实时获取消息
        this.getMyMsg();
        global.stopMsgTime = setInterval(this.getMyMsg, 300000);

        axios.post(`/tenant/getRotationChart`,{} )
            .then((response) =>{
                console.log(response,'轮播图');
                if(response.data.code==0){
                    if(response.data.data.length>0){
                        this.imgCarousel = true;
                        let data = response.data.data
                        console.log(data,'datadata');
                        this.setState({
                            data
                        })
                    }

                }
            })

            .catch(function (error) {
                console.log(error);
            });

        //读取
        storage.load({
            key: 'username',
            // autoSync(默认为true)意味着在没有找到数据或数据过期时自动调用相应的sync方法
            autoSync: false
        }).then(ret => {

            console.log(ret,'ret');

            this.setState({
                checkinNo:ret.checkinNo,
                hotelAppScroll:ret.hotelAppScroll,
                phone:ret.phone,
                name:ret.name,
                hotelNo:ret.hotelNo,

            },()=>{
                this.ifExistsUnPayOrder()
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

    }

    componentWillReceiveProps() {
        this.ifExistsUnPayOrder()

    }


    //身份证上传
    uploadImgSelected=(item)=>{
        const { navigate } = this.props.navigation;
        if(item){
            navigate('RealName',{ user: item });
        }else {
            navigate('Contract',{ user: '' });
        }
        this._setModalVisible(false)

    }


    cancelSelected=()=>{

        axios.post(`/tenant/getCostBill`, {
            type:null
        })
            .then((response) =>{
                console.log(response);
                if(response.data.code==0){

                    response.data.data.map(item=>{
                        if(item.feeCode== "100101"){
                            const { navigate } = this.props.navigation;
                            navigate('AllBills',{ user:"" });
                        }
                    })


                }
            })

            .catch(function (error) {
                console.log(error);
            });



    };


    //实名认证
    realName = ()=>{

        if(this.state.checkinNo){

            axios.post(`/my/getMyAuthent`, {

            })
                .then( (response) => {
                    console.log(response,'身份证审核');


                    if(response.data.code==0){
                        if(!response.data.cardCode){

                            response.data.cardImg = []

                            this.setState({
                                modalVisible: true,
                                modal: '实名认证',
                                realName:response.data

                            })

                        }else {
                            this.constract()
                        }
                    }


                })
                .catch(function (error) {
                    console.log(error);
                });
        }





    };


    //合同
    constract = ()=>{
        axios.post(`/contract/getMyContract`, {
            // checkinNo:this.state.checkinNo,
            hotelNo:this.state.hotelNo,
            isQueryState:true
        })
            .then((response) =>{
                console.log(response,'合同');

                if (response.data.data) {

                    //读取
                    storage.load({
                        key: 'username',
                        // autoSync(默认为true)意味着在没有找到数据或数据过期时自动调用相应的sync方法
                        autoSync: false
                    }).then(ret => {
                        ret.checkinNo=response.data.data.checkinNo;

                        this.setState({
                            checkinNo:response.data.data.checkinNo
                        })

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


                    if(response.data.data.status!=2){
                        this.setState({
                            modalVisible: true,
                            modal: '合同',
                            checkinNo: response.data.data.checkinNo,
                            // constractImg:response.data.data.imgList

                        })

                        // Alert.alert('确定签约','请先签署电子合同',
                        //     [
                        //         // {text:"取消", onPress:this.cancelSelected},
                        //         {text:"确认", onPress:()=>{this.uploadImgSelected()}}
                        //     ],
                        //     { cancelable: false }
                        // );
                    }

                }



            })
            .catch(function (error) {
                console.log(error);

            });
    };



    //未支付的预定
    ifExistsUnPayOrder = ()=>{
        axios.post(`/tenant/ifExistsUnPayOrder`, {
            phone:this.state.phone

        })
            .then((response) =>{
                console.log(response,'未预定的支付');

                if (response.data.code==0) {


                    response.data.data.orderId=null

                    if(response.data.data.orderId){

                        this.setState({
                            modalVisible: true,
                            modal: '未预定的支付',
                            payOrderData:response.data.data
                        })

                    }else {

                        this.realName()
                    }


                }




            })
            .catch(function (error) {
                console.log(error);

            });
    };


    acceept = () =>{

        axios.post(`/contract/commitContract`, {
            checkinNo:this.state.checkinNo,
            status:1
        })
            .then((response) => {
                console.log(response);

                if(response.data.code == 0){
                    alert("签约成功");

                    const { navigate } = this.props.navigation;
                    navigate('AllBills',{ user:"" });


                }else if(response.data.code==1){
                    alert(response.data.message);
                }




            })
            .catch(function (error) {
                console.log(error);
            });

        this._setModalVisible(false);


    }



    payOrder = () =>{

        let {payOrderData} = this.state

        const { navigate } = this.props.navigation;


        let dataPay = {};

        dataPay.price = payOrderData.money;



        dataPay.yiPay={
            price:payOrderData.money,
            orderId:payOrderData.orderId,
            orderType:1,

        }

        navigate('Pay',{ user:dataPay });


        this._setModalVisible(false);


    }

    componentDidMount() {

        console.log('componentDidMount');

        this.tab =  DeviceEventEmitter.addListener('tab', (item)=>{

            if(item=='TabHome' || item=='realName'){
                this.ifExistsUnPayOrder();

            }
        });




        const { navigate } = this.props.navigation;

        if(Platform.OS === 'android'){
            JPushModule.notifyJSDidLoad(resultCode=>console.log(resultCode))//报错
        }


        JPushModule.addReceiveCustomMsgListener((message) => {
            console.log(message);
        });
        JPushModule.addReceiveNotificationListener((message) => {
            console.log("receive notification: " + message);
        });

        JPushModule.addReceiveOpenNotificationListener((map) => {
            navigate('Message',{ user:"" })

        })
    }





    componentWillUnmount() {

        JPushModule.removeReceiveCustomMsgListener();

        JPushModule.removeReceiveNotificationListener();
        this.tab&&this.tab.remove();

        // BackAndroid.removeEventListener('hardwareBackPress');
        //
        // NativeAppEventEmitter.removeAllListeners();
        //
        // DeviceEventEmitter.removeAllListeners();

    }




    // componentDidMount() {
    //
    //     const { navigate } = this.props.navigation;
    //     let callback = event => {
    //         console.log('alertContent: ' + JSON.stringify(event))
    //     };
    //     JPushModule.addReceiveNotificationListener(callback);
    //
    //     JPushModule.addReceiveOpenNotificationListener((map) => {
    //         navigate('TabHome',{ user:"" })
    //
    //
    //     })
    //
    //
    //
    // }



    aaa = (item)=>{
        const { navigate } = this.props.navigation;
        let {checkinNo} = this.state;
        switch (item.text)
        {
            case "预约维修":

                if(checkinNo==''){
                    Toast.info("未签约用户暂不支持此功能",1)
                }else{
                    //在这里请求维修接口数据，获取维修状态，是维修中还是维修结束
                    axios.post(`/tenant/getAppointmentHistory`, {
                        type: "0"
                    })
                        .then(function (response) {
                            console.log(response);
                            let data = {}
                            data.data =  response.data.data;
                            data.count = response.data.count;
                            data.keeping = response.data.keeping;
                            navigate('Repair',{ user:data })

                        })
                        .catch(function (error) {
                            console.log(error);
                        });
                }



                break;

            case "预约保洁":

                if(checkinNo==''){
                    Toast.info("未签约用户暂不支持此功能",1)
                }else{
                    //在这里请求维修接口数据，获取维修状态，是维修中还是维修结束
                    axios.post(`/tenant/getAppointmentHistory`, {
                        type: "1"
                    })
                        .then(function (response) {
                            console.log(response);
                            let data = {}
                            data.data =  response.data.data;
                            data.count = response.data.count;
                            data.keeping = response.data.keeping;
                            navigate('Clean',{ user:data })

                        })
                        .catch(function (error) {
                            console.log(error);
                        });
                }


                break;

            case "房租":
                console.log('fangzu');

                if(checkinNo==''){
                    Toast.info("未签约用户暂不支持此功能",1)
                }else{
                    navigate('Rent',{ user:"" });
                }

                break;

            case "电费":

                if(checkinNo==''){
                    Toast.info("未签约用户暂不支持此功能",1)
                }else{
                    navigate('Electricity',{ user:"" });
                }


                break;

            case "水费":
                if(checkinNo==''){
                    Toast.info("未签约用户暂不支持此功能",1)
                }else{
                    navigate('Water',{ user:"" });
                }

                break;

            case "全部":
                if(checkinNo==''){
                    Toast.info("未签约用户暂不支持此功能",1)
                }else{
                    navigate('AllBills',{ user:"" });
                }


                break;
            case "退租":


                if(checkinNo==''){
                    Toast.info("未签约用户暂不支持此功能",1)
                }else {

                    axios.post(`/self/getRequisition`, {
                        type: "0"
                    })
                        .then((response)=> {
                            console.log(response);
                            let data = response.data.data;

                            if(data.status==2){
                                navigate('RefundRentDetail',{ user:data})
                            }else{
                                navigate('RefondRent',{ user:data })
                            }

                        })
                        .catch(function (error) {
                            console.log(error);
                        });


                }



                break;
            case "续租":

                if(checkinNo==''){
                    Toast.info("未签约用户暂不支持此功能",1)
                }else {

                    axios.post(`/self/getRequisition`, {
                        type: "1"
                    })
                        .then((response)=> {
                            console.log(response);
                            let data = response.data.data;

                            if(data.status==2){
                                navigate('ForRenewalDetail',{ user:data})
                            }else{
                                navigate('ForRenewal',{ user:data })
                            }

                        })
                        .catch(function (error) {
                            console.log(error);
                        });

                }




                break;
            case "转租":
                if(checkinNo==''){
                    Toast.info("未签约用户暂不支持此功能",1)
                }else {

                    axios.post(`/self/getRequisition`, {
                        type: "2"
                    })
                        .then((response)=> {
                            console.log(response);
                            let data = response.data.data;

                            if(data.status==2){
                                navigate('SubletDetail',{ user:data})
                            }else{
                                navigate('Sublet',{ user:data || {} })
                            }

                        })
                        .catch(function (error) {
                            console.log(error);
                        });

                }



                break;
            case "换房":
                if(checkinNo==''){
                    Toast.info("未签约用户暂不支持此功能",1)
                }else {

                    axios.post(`/self/getRequisition`, {
                        type: "3"
                    })
                        .then((response)=> {
                            console.log(response);
                            let data = response.data.data;

                            if(data.status==2){
                                navigate('ChangeDetail',{ user:data})
                            }else{
                                navigate('ChangeRooms',{ user:data })
                            }

                        })
                        .catch(function (error) {
                            console.log(error);
                        });

                }



                break;


            case "投诉建议":
                navigate('Suggestions',{ user:"" });
                break;

            case "呼叫管家":
                if(checkinNo==''){
                    Toast.info("未签约用户暂不支持此功能",1)
                }else{
                    axios.post(`/self/callButler`, {
                    })
                        .then((response) =>{
                            console.log(response);
                            //Linking.openURL('tel:10086')

                            if(response.data.hotelTel==''){
                                Toast.info("暂无管家电话",1)

                            }else {
                                Linking.openURL(`tel:${response.data.hotelTel}`);
                            }



                        })
                        .catch(function (error) {
                            console.log(error);
                        });
                }

                break;

            default:
                Toast.info("暂不支持此功能",1)
        }
    }


    allHomeGrid = (item,index) => {


        axios.post(`/contract/getMyContract`, {
            // checkinNo:this.state.checkinNo,
            hotelNo:this.state.hotelNo,
            isQueryState:true

        })
            .then((response) =>{
                console.log(response,'合同');
                if (response.data.data) {
                    if(response.data.data.status!=2){
                        this.setState({
                            modalVisible: true,
                            modal: '合同',
                            checkinNo: response.data.data.checkinNo,
                            // constractImg:response.data.data.imgList
                        })
                    }else {
                        this.aaa(item)
                    }

                }else {
                    this.aaa(item)
                }



            })
            .catch(function (error) {
                console.log(error);

            });



    };


    dataItem = (dataItem, index) => {
        return (
            <TouchableHighlight underlayColor="#fff" onPress={() => this.allHomeGrid(dataItem, index)}>
                <View style={{ paddingTop: 20, paddingBottom: 20, backgroundColor: "#5cd9e7", alignItems: 'center', justifyContent: 'center' }}>
                    <Image source={dataItem.icon} style={{ width: 30, height: 30 }} />
                    <View style={{ color: '#888', fontSize: 14, marginTop: 12 }}>
                        <Text>{dataItem.text}</Text>
                    </View>
                </View>
            </TouchableHighlight>
        )
    };

    jumpto = (val) => {
        console.log(val,'valval');
        const { navigate } = this.props.navigation;

        let a  = `channel=shanpig&phone=${this.state.phone}`
        let str = base64.encode(a)
        let data = ''

        if(val){
            if(val.indexOf('anjutou360.com')!=-1){
                data=`${val}${str}`
            }else {
                data = val
            }

            console.log(this.state.phone,'this.state.phone');

            console.log(data,'安居头');
            navigate('Jumpto',{ user:data })

        }
        // let data = `http://anjutou360.com/ajt-ui/shanIndex/?data=${str}`
        // let data = `http://test.fanci.net/ajt-ui?data=${str}`

    }




    render(){

        //弹框
        let modalBackgroundStyle = {
            backgroundColor: this.state.transparent ? 'rgba(0, 0, 0, 0.5)' : 'red',
        };
        let innerContainerTransparentStyle = this.state.transparent
            ? { backgroundColor: '#fff', padding: 10 ,

                overflow:"hidden"}
            : null;


        const data = [
            { icon: icon1,  text: "智能门锁" },
            { icon: icon2,  text: "预约维修" },
            { icon: icon3,  text: "预约保洁" },
            { icon: icon4,  text: "快递查收" },
            { icon: icon5,  text: "房租" },
            { icon: icon6,  text: "电费" },
            { icon: icon7,  text: "水费" },
            { icon: icon8,  text: "全部" },
            { icon: icon9,  text: "退租" },
            { icon: icon10, text: "续租" },
            { icon: icon11, text: "转租" },
            { icon: icon12, text: "换房" },
            { icon: icon13, text: "呼叫管家" },
            { icon: icon14, text: "投诉建议" },
            { icon: icon15, text: "问卷信息" },
            { icon: icon16, text: "服务支持" }
        ];

        return (

            <View>

                <View>

                    <Modal
                        animationType={this.state.animationType}
                        transparent={this.state.transparent}
                        visible={this.state.modalVisible}

                        onRequestClose={() => { this._setModalVisible(false) } }

                    >
                        <View style={[styles.container,modalBackgroundStyle]}>
                            <View style={[styles.innerContainer,innerContainerTransparentStyle]}>

                                {
                                    this.state.modal=='合同'?

                                        <View>
                                            <View style={{flexDirection:"row",justifyContent:"space-around",alignItems:"center"}}>

                                                <View  style={{flex:1,alignItems:'center'}}><Text style={{fontSize:20}}>签订合同</Text></View>

                                                {/*<TouchableHighlight underlayColor={"#fff"} onPress={this._setModalVisible.bind(this,false)}>*/}
                                                    {/*<Image style={{height:30,width:30}} source={close}/>*/}
                                                {/*</TouchableHighlight>*/}


                                            </View>

                                            <View style={{alignItems:"center",marginTop:10}}>
                                                <TouchableHighlight underlayColor={"transparent"} style={{padding:10,
                                                    borderWidth:1,borderColor:"#fff",width:100,backgroundColor:"#f17e3a",
                                                    borderRadius:5}} onPress={()=>{this.uploadImgSelected() }}>
                                                    <Text
                                                        style={{fontSize:16,textAlign:"center",color:"#fff"}}>

                                                        确定

                                                    </Text>
                                                </TouchableHighlight>
                                            </View>
                                        </View>:
                                        this.state.modal=='实名认证'?

                                            <View>
                                                <View style={{flexDirection:"row",justifyContent:"space-around",alignItems:"center"}}>

                                                    <View  style={{flex:1,alignItems:'center'}}><Text style={{fontSize:20}}>实名认证</Text></View>

                                                    <TouchableHighlight underlayColor={"#fff"} onPress={this._setModalVisible.bind(this,false)}>
                                                        <Image style={{height:30,width:30}} source={close}/>
                                                    </TouchableHighlight>


                                                </View>

                                                <View>
                                                    <Text>应公安部要求，请上传身份证照片</Text>
                                                </View>

                                                <View style={{alignItems:"center",marginTop:10}}>
                                                    <TouchableHighlight underlayColor={"transparent"} style={{padding:10,
                                                        borderWidth:1,borderColor:"#fff",width:100,backgroundColor:"#f17e3a",
                                                        borderRadius:5}} onPress={()=>{this.uploadImgSelected(this.state.realName) }}>
                                                        <Text
                                                            style={{fontSize:16,textAlign:"center",color:"#fff"}}>

                                                            确定

                                                        </Text>
                                                    </TouchableHighlight>
                                                </View>
                                            </View>:
                                        <View>
                                            <View style={{flexDirection:"row",justifyContent:"space-around",alignItems:"center"}}>

                                                <View  style={{flex:1,alignItems:'center'}}><Text style={{fontSize:20}}>确认支付预定金</Text></View>

                                                <TouchableHighlight underlayColor={"#fff"} onPress={this._setModalVisible.bind(this,false)}>
                                                    <Image style={{height:30,width:30}} source={close}/>
                                                </TouchableHighlight>


                                            </View>


                                            <View style={{alignItems:"center",marginTop:10}}>
                                                <TouchableHighlight underlayColor={"transparent"} style={{padding:10,
                                                    borderWidth:1,borderColor:"#fff",width:100,backgroundColor:"#f17e3a",
                                                    borderRadius:5}} onPress={this.payOrder }>
                                                    <Text
                                                        style={{fontSize:16,textAlign:"center",color:"#fff"}}>

                                                        确定

                                                    </Text>
                                                </TouchableHighlight>
                                            </View>
                                        </View>
                                }






                            </View>
                        </View>
                    </Modal>



                </View>

                <View style={{height: Dimensions.get('window').height,backgroundColor:"#fff",paddingBottom:50}}>

                    <View style={{alignItems:"center",backgroundColor:"#f17e3a",height:60,justifyContent:"center"}}>
                        <View style={{alignItems:"center",marginTop:8,}}>
                            <Text style={{color:"#fff",fontSize:18,fontWeight:'bold'}}>{this.state.hotelAppScroll}</Text>
                        </View>
                    </View>




                    {/*<View style={[styles.userItem,{*/}

                    {/*}]}>*/}
                        {/*<Text style={{color:"#fff",fontSize:22}}>{this.state.hotelAppScroll==null?'条玛青年社区':this.state.hotelAppScroll}</Text>*/}
                    {/*</View>*/}




                    <ScrollView>
                        <View >
                            <View style={{flexDirection:"row",alignItems:"center",backgroundColor:"#fff"}}>

                            </View>
                            <Carousel
                                autoplayInterval={4000}
                                autoplay={true}
                                infinite={true}
                                // dots={false}

                            >
                                {this.state.data.map((val,index) => (
                                    <TouchableHighlight underlayColor="transparent" onPress={()=>{this.jumpto(val.imgUrl)}} key={index}>
                                        <Image
                                            source={this.imgCarousel?{uri:val.img}:val.img}
                                            style={{
                                                ...Platform.select({
                                                    android: {
                                                        height:170,
                                                    },
                                                    ios:{
                                                        height:180,
                                                    }
                                                }),

                                                ...ifIphoneX({
                                                    height:220,
                                                }, {

                                                }),

                                                width: Dimensions.get('window').width, resizeMode:"stretch"}}
                                            alt=""
                                        />
                                    </TouchableHighlight>
                                ))}
                            </Carousel>





                            <View style={{flexDirection:"row",flexWrap:"wrap",marginTop:10}} >
                                {
                                    data.map((dataItem, index) => (

                                        <TouchableHighlight key={index + dataItem.text}
                                                            style={{width:'25%',alignItems:"center",marginBottom:10}}
                                                            underlayColor="#fff" onPress={() => this.allHomeGrid(dataItem, index)}>

                                            <ImageBackground source={fnagkuai} style={{width:"100%",
                                                paddingTop: 10, paddingBottom: 10,
                                                marginRight: (index + 1) !== 1 && index % 4 === 0 ? 0 : 10,
                                                alignItems: 'center', justifyContent: 'center' ,
                                            }}>
                                                <View>
                                                    <Image source={dataItem.icon} style={{ width: 30, height: 30 }} />
                                                </View>

                                                <View style={{ marginTop: 12 }}>
                                                    <Text>{dataItem.text}</Text>
                                                </View>
                                            </ImageBackground>



                                        </TouchableHighlight>

                                    ))
                                }
                            </View>



                        </View>
                    </ScrollView>



                </View>
            </View>






        )

    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,

    },
    innerContainer: {
        borderRadius: 10,
    },
    grid:{
        backgroundColor:"#f0f0f0"
    },

    userItem:{
        backgroundColor:"rgba(0, 0, 0, 0.3)",
        flexDirection:"row",
        position:"absolute",
        width:Dimensions.get('window').width,
        height:50,
        alignItems:'center',
        justifyContent:'center',
        zIndex:999,
        top:60

    },
});

export default connect (
    state => ({reduxData: state.reduxData}),
    dispath => bindActionCreators({getData},dispath)
)(A);
