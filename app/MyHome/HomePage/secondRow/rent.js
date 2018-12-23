import React, { Component } from 'react';
import {
    TouchableHighlight,
    StyleSheet,
    Text,
    View,
    Image,
    FlatList, Platform, Modal, ScrollView, DeviceEventEmitter
} from 'react-native';

import {WhiteSpace,List,Toast,Button} from 'antd-mobile';
import axios from "../../../axios";
import rent from "../style/5.png";
import electric from "../style/6.png";
import water from "../style/7.png";
import fee from "../style/fee.png";
import Dimensions from 'Dimensions';
import close from "../../Mine/style/close.jpg";
import {ifIphoneX} from "react-native-iphone-x-helper/index";
import Electricity from "./electricity";
import Water from "./water";
import AllBills from "./allBills";
import FenqiText from "./fenqiText";
import CodePush from "react-native-code-push";

import selectIcon from '../../../pay/selectIcon.png'

let a = Dimensions.get("window").height/Dimensions.get("window").width;

import moment from "moment";


export default class Rent extends Component {

    constructor(props) {
        super(props);
        this.state = {
            refreshing: false,
            fenqiAgreement: false,
            dataSource: [],
            contractNum:1,
            complete:1,
            willpaid:0,
            allRent:0,
            monthRent:0,
            payMonth:0,
            modal:'分期',
            roomInfo:{},
            animationType: 'none',//none slide fade
            modalVisible: false,//模态场景是否可见
            transparent: true,//是否透明显示
        };
        this.bet = false;
        this.dep = false;
        this.type = false;
        this.flag = true;
        this.onLine = false;
    }



    componentDidMount(){

        console.log('组件加载完毕');

        CodePush.sync();
        CodePush.allowRestart();//在加载完了可以允许重启

        this.onfresh =  DeviceEventEmitter.addListener('onFresh', (item)=>{
            if(item=='onFresh'){
                this.onRefresh();
            }
        });


        this.yiPay =  DeviceEventEmitter.addListener('yiPay', (item)=>{
            if(item=='yiPay' || item=='wechatPay'){
                // alert(1234)
                this.onRefresh();
            }
        });
    }


    componentWillUnmount(){
        this.onfresh&&this.onfresh.remove();
        this.yiPay&&this.yiPay.remove();
    };

    //初始化设置state
    handleSetData = () => {
        let type = "";
        switch (this.props.type)
        {
            case 1:
                type = "200002";
                break;
            case 2:
                type = "200001";
                break;
            case 3:
                type = null;
                break;
            default:
                type = "100000";
        }
        axios.post(`/tenant/getCostBill`, {
            type:type
        })
            .then((response) =>{
                console.log(response);

                if(response.data.data){
                    let param = response.data.data;

                    this.payMonth = response.data.payMonth;
                    // console.log(this.payMonth,'this.payMonth');

                    this.onLine = response.data.onLine;


                    let complete = param.filter((item)=>{
                        return item.isState != 0
                    });

                    let willpaid = param.filter((item)=>{
                        return item.isState == 0
                    });

                    let num = 0, allRent = 0;
                    willpaid.map(item => {
                        if(item.isFenqi==1) {
                            this.type = true
                        }
                        if(item.feeCode == '100201') {
                            this.bet = true;
                        }
                        //200007
                        if(item.feeCode == '100101') {
                            this.dep = true;
                        }
                    });
                    let data = param;
                    if(this.props.type !== 3 || this.bet || this.dep) {
                        data = param.map((item)=>{
                            if(this.props.type == 1 || this.props.type == 2) {
                                if(item.isState == 0 && num < 1) {
                                    item.disabled = true;
                                    item.selectRent = true;
                                    allRent += (item.rentPrice+(item.lateFee || 0));
                                    num ++;
                                } else {
                                    item.disabled = false;
                                    item.selectRent = false;
                                }
                            } else {
                                if(this.type) {

                                    if(item.isState == 0 && item.isFenqi &&  item.feeCode == "100000" && num < 1) {
                                        item.disabled = true;
                                        item.selectRent = true;
                                        allRent += (item.rentPrice + item.fenqiFee+(item.lateFee || 0));
                                        num ++;
                                    } else {
                                        item.disabled = false;
                                        item.selectRent = false;
                                    }
                                } else {

                                    if(item.isState == 0 && item.feeCode == "100000" && num < this.payMonth) {
                                        
                                        item.disabled = true;
                                        item.selectRent = true;
                                        allRent += (item.rentPrice+(item.lateFee || 0));
                                        num ++;
                                    } else {
                                        item.disabled = false;
                                        item.selectRent = false;
                                    }
                                }
                            }
                            return item;
                        });
                    }

                    if(this.bet || this.dep) {
                        let feecodeArr = [];
                        data.map(item => {
                            if(item.feeCode != "100000") {
                                if(feecodeArr.indexOf(item.feeCode) === -1) {
                                    feecodeArr.push(item.feeCode);
                                    if(item.feeCode=='100201'||item.feeCode=='100101'){
                                        item.disabled=true;
                                    }
                                    item.selectRent = true;
                                    allRent += item.rentPrice;
                                }
                            }
                        });
                    }

                    this.setState({
                        dataSource:data,
                        contractNum:param.length,
                        complete:complete.length,
                        willpaid:willpaid.length,
                        allRent,
                        monthRent: num,
                        payMonth: this.payMonth,
                        refreshing: false
                    })
                }


                this.setState({
                    refreshing: false
                })

            })

            .catch(function (error) {
                console.log(error);
            });
    };

    componentWillMount(){
        this.handleSetData();
    }


    //下拉刷新
    onRefresh = () => {
        this.setState({
            refreshing: true
        },()=>{
            this.handleSetData();
        });

    };




    //缴费
    onPay=()=>{

        let {type} = this.props;


        let aa = false;
        let fenqiType=false;
        let moneyData=[];
        this.state.dataSource.map((item)=>{
            if(item.selectRent){
                aa = true;

                let bb = {
                    feeCode:item.feeCode,
                    rentPrice:item.rentPrice,
                    feeName:item.feeName
                };

                moneyData.push(bb)

                 if(item.isFenqi&&item.isFenqi==1){

                     fenqiType = true
                 }


            }
        })
        



        if(aa){
            if(type!==1&&type!==2&&type!==3&&this.onLine){
                Toast.info('请去"全部"缴纳账单',1);
                return
            }else{


                let dataPay = {};
                let data = {
                    ids: []
                };

                let {dataSource, allRent} = this.state;
                dataSource.map(_item => {
                    if(_item.selectRent) {
                        data.ids.push(_item.id);
                    }
                });

                data.ids = data.ids.join(',');

                dataPay.moneyData = moneyData;
                dataPay.fenqiType = fenqiType;
                dataPay.dataPay = data;
                dataPay.url = "/tenant/alipaySignature";
                dataPay.price = allRent;
                dataPay.orderType = 0;
                dataPay.introduce = this.props.type==1?'电费':this.props.type==2?'水费':this.props.type==3?'全部':'房租';
                dataPay.navigator = this.props.type==1?'Electricity':this.props.type==2?'Water':this.props.type==3?'AllBills':'Rent';

                dataPay.yiPay={
                    price:allRent,
                    orderType:0,
                    ids:data.ids,
                }

                console.log(dataPay);

                const { navigate } = this.props.navigation;
                navigate('Pay',{ user:dataPay });
            }
        }else {
            Toast.info('请选择账单',1);
        }







    };



    //选择费用
    selectRent=(item, index)=>{
        let {dataSource} = this.state;
        let monthRent = 0, allRent = 0, type = false;
        let status = item.feeCode == "100000" && !item.selectRent;
        console.log(status);
        if(item.isState == 0){



            if(this.props.type == 3 && !(this.bet || this.dep) && this.flag && item.feeCode == "100000") {
                this.flag = false;
                let num = 0;
                let data = dataSource.map((_item)=>{
                    if(this.type) {
                        if(_item.isState == 0 && _item.isFenqi &&  _item.feeCode == "100000" && num < 1) {
                            _item.disabled = false;
                            _item.checked = true;
                            _item.selectRent = true;
                            // allRent += (_item.rentPrice + _item.fenqiFee);
                            num ++;
                        }
                    } else {
                        if(_item.isState == 0 && _item.feeCode == "100000" && num < this.payMonth) {
                            _item.disabled = false;
                            _item.checked = true;
                            _item.selectRent = true;
                            // allRent +=(_item.rentPrice + _item.fenqiFee);
                            num ++;
                        }
                    }
                    return _item;
                }).map(_item => {
                    if(_item.id == item.id&&_item.isState == 0) {
                        status = false;
                        _item.selectRent = true;
                        allRent += (_item.rentPrice + (_item.fenqiFee || 0)+(_item.lateFee|| 0));
                        monthRent ++;
                    } else if(_item.selectRent&&_item.isState == 0) {
                        allRent += (_item.rentPrice + (_item.fenqiFee || 0)+(_item.lateFee|| 0));
                        monthRent ++;
                    } else if(status && _item.feeCode == "100000" && !_item.selectRent&&_item.isState == 0) {
                        _item.selectRent = true;
                        allRent += (_item.rentPrice + (_item.fenqiFee || 0)+(_item.lateFee|| 0));
                        monthRent ++;
                    }

                    return _item;
                });

                this.setState({
                    dataSource:data,
                    allRent,
                    monthRent: num,
                })
            } else {
                let data = null;
                if(item.checked) {
                    data = dataSource.map(_item => {
                        if(_item.feeCode == "100000"&&_item.isState == 0) {
                            _item.disabled = false;
                            _item.selectRent = false;
                        }
                        if(_item.selectRent&&_item.isState == 0) {

                            if(_item.fenqiFee&&_item.isState == 0){
                                allRent += (_item.rentPrice + _item.fenqiFee+(_item.lateFee|| 0));
                            }else {
                                allRent += _item.rentPrice+(_item.lateFee|| 0);
                            }

                            //allRent += _item.rentPrice;
                            monthRent ++;
                        }
                        return _item;
                    });
                    this.flag = true;
                } else {
                    let flag = item.feeCode == "100000" && item.selectRent;
                    let code = false;
                    data = dataSource.map(_item => {
                        if(status) {
                            if(_item.id == item.id && !_item.disabled&&_item.isState == 0) {
                                status = false;
                                _item.selectRent = !_item.selectRent;
                            } else if(_item.feeCode == "100000" && !_item.selectRent&&_item.isState == 0) {
                                _item.selectRent = !_item.selectRent;
                            }
                        } else {
                            if(_item.id == item.id && !_item.disabled&&_item.isState == 0) {
                                code = true;
                                _item.selectRent = !_item.selectRent;
                            } else if(flag && code && _item.feeCode == "100000"&&_item.isState == 0) {
                                _item.selectRent = false;
                            }
                        }

                        if(_item.selectRent) {

                            if(_item.fenqiFee&&_item.isState == 0){
                                allRent += (_item.rentPrice + _item.fenqiFee+(_item.lateFee|| 0));
                            }else {
                                allRent += _item.rentPrice;
                            }


                            monthRent ++;
                        }
                        if(_item.selectRent && _item.feeCode == "100000"&&_item.isState == 0) {
                            type = true;
                        }
                        return _item;
                    });
                    if(!type) {
                        this.flag = true;
                    }
                }
                this.setState({
                    dataSource: data,
                    monthRent,
                    allRent
                })
            }
        }
    };



    _setModalVisible = (visible) => {
        this.setState({ modalVisible: visible });
    };


    //分期确定
    submitOk=()=>{



        if(!this.state.fenqiAgreement){
            alert('请同意协议');
            return
        }

        axios.post(`/tenant/roomByStages`, {
        })
            .then((response) => {
                console.log(response);

                this.setState({ modalVisible: false },()=>{

                    if(response.data.code==0){
                        Toast.info('分期月付成功',1);
                    }else if(response.data.code==1){
                        Toast.info(response.data.message,1);
                    }

                    this.onRefresh();
                });



            })
            .catch(function (error) {
                console.log(error);
                Toast.info('分期失败',1)
            });

        this._setModalVisible(false);



    };


    //点击分期按钮
    installment=()=>{

        let {type} = this.props;

        if(type!==1&&type!==2&&type!==3&&this.onLine){
            Toast.info('请去"全部"缴纳账单',1);
            return
        }else{

            this.setState({
                modal:'分期',
                modalVisible: true
            })
        }


    };


    //分期协议同意
    fenqiAgreement = ()=>{
        let {fenqiAgreement} = this.state;

        this.setState({
            fenqiAgreement:fenqiAgreement?false:true
        })


    }


    //查看详情
    getBillInfo=(item)=>{
        this.setState({
            modal:'详情',
            modalVisible: true,
            roomInfo:item
        })
    }


    render() {

        let {roomInfo,fenqiAgreement,refreshing,dataSource,contractNum,complete,willpaid,allRent,monthRent,payMonth} = this.state;
        let {type} = this.props;

        //弹框
        let modalBackgroundStyle = {
            backgroundColor: this.state.transparent ? 'rgba(0, 0, 0, 0.5)' : 'red',
        };
        let innerContainerTransparentStyle = this.state.transparent
            ? { backgroundColor: '#fff', padding: 10 ,
                // height:"90%",
                overflow:"hidden"}
            : null;

        let isFenqi = true;
        let fenqiArr =  dataSource.filter(item => item.isState == 0);
        fenqiArr = fenqiArr.filter(item => item.feeCode == '100000');
        if(fenqiArr.length > 0) {
            isFenqi = !(fenqiArr[0].isFenqi == 1);
        }




        return (

            <View>


                {/*分期弹框*/}
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
                                    this.state.modal=='分期'?
                                        <View>
                                            <View style={{flexDirection:"row-reverse"}}>
                                                <TouchableHighlight underlayColor={"#fff"} onPress={this._setModalVisible.bind(this,false) } style={{width:32}}>
                                                    <Image style={{height:30,width:30}} source={close}/>
                                                </TouchableHighlight>
                                            </View>


                                            <WhiteSpace size="xs"/>

                                            <ScrollView style={{maxHeight:Dimensions.get('window').height-200,borderColor:"#f0f0f0",borderWidth:1}}>

                                                <FenqiText/>
                                            </ScrollView>


                                            <View>

                                                <TouchableHighlight style={{marginTop:10,marginBottom:10}}
                                                                    onPress={this.fenqiAgreement}  underlayColor="transparent">
                                                    <View style={{flexDirection:"row",marginRight:15,alignItems:"center"}}>
                                                        <View style={{backgroundColor:fenqiAgreement ? "#f17e3a" :'#fff',marginRight:5,
                                                            width:20,height:20,borderRadius:10,borderColor:"#ccc",borderWidth:1,overflow:"hidden"}} >
                                                            <Image style={{width:20,height:20}} source={selectIcon}/>
                                                        </View>
                                                        <Text>我已阅读并同意该协议</Text>

                                                    </View>
                                                </TouchableHighlight>

                                            </View>

                                            <View style={{alignItems:"center"}}>
                                                <TouchableHighlight underlayColor={"#367d80"} style={{padding:10,
                                                    borderWidth:1,borderColor:"#fff",width:100,backgroundColor:"#f1803a",
                                                    borderRadius:10}} onPress={this.submitOk }>
                                                    <Text
                                                        style={{fontSize:16,textAlign:"center",color:"#fff"}}>
                                                        确定月付
                                                    </Text>
                                                </TouchableHighlight>
                                            </View>
                                        </View>:
                                        <View>
                                            <View style={{flexDirection:"row",justifyContent:"space-around",alignItems:"center"}}>

                                                <View  style={{flex:1,alignItems:'center'}}><Text style={{fontSize:20}}>查看详情</Text></View>



                                                <TouchableHighlight underlayColor={"#fff"} onPress={this._setModalVisible.bind(this,false) } style={{}}>
                                                    <Image style={{height:30,width:30}} source={close}/>
                                                </TouchableHighlight>

                                            </View>


                                            <ScrollView style={{maxHeight:Dimensions.get('window').height-200}}>
                                                <View style={{padding:10}}>


                                                    <View style={styles.a}>
                                                        <Text style={styles.f}>抄表时间:</Text>
                                                        <View style={[styles.b,{flex:3}]}>
                                                            <Text style={{flex:1}}>{roomInfo.createTime ? moment(roomInfo.createTime).format("YYYY-MM-DD hh:mm:ss"):null}</Text>
                                                        </View>
                                                    </View>



                                                    <View style={{borderLeftWidth:3,borderLeftColor:'#7ebef9',marginTop:15}}>
                                                        <Text style={{fontSize:20,fontWeight:'bold',paddingLeft:10}}>电费</Text>
                                                    </View>

                                                    <View style={{width:"100%",height:1,backgroundColor:"#f0f0f0",marginTop:10}}></View>

                                                    <View style={styles.a}>
                                                        <Text style={styles.f}>上次电量:</Text>
                                                        <View style={[styles.b,{flex:3}]}>
                                                            <Text style={{flex:1}}>{roomInfo.lastElectric}度</Text>
                                                        </View>
                                                    </View>

                                                    <View style={styles.a}>
                                                        <Text style={styles.f}>本次电量:</Text>
                                                        <View style={[styles.b,{flex:3}]}>
                                                            <Text style={{flex:1}}>{roomInfo.electric}度</Text>
                                                        </View>
                                                    </View>


                                                    <View style={styles.a}>
                                                        <Text style={styles.f}>电费单价:</Text>
                                                        <View style={[styles.b,{flex:3}]}>
                                                            <Text style={{flex:1}}>{roomInfo.hotelPower}元</Text>
                                                        </View>
                                                    </View>

                                                    <View style={styles.a}>
                                                        <Text style={styles.f}>电费金额:</Text>
                                                        <View style={[styles.b,{flex:3}]}>
                                                            <Text style={{flex:1}}>{roomInfo.electricMoney}元</Text>
                                                        </View>
                                                    </View>

                                                    <View style={{borderLeftWidth:3,borderLeftColor:'#7ebef9',marginTop:15}}>
                                                        <Text style={{fontSize:20,fontWeight:'bold',paddingLeft:10}}>水费</Text>
                                                    </View>

                                                    <View style={{width:"100%",height:1,backgroundColor:"#f0f0f0",marginTop:10}}></View>


                                                    <View style={styles.a}>
                                                        <Text style={styles.f}>上次水量:</Text>
                                                        <View style={[styles.b,{flex:3}]}>
                                                            <Text style={{flex:1}}>{roomInfo.lastWater}吨</Text>
                                                        </View>
                                                    </View>

                                                    <View style={styles.a}>
                                                        <Text style={styles.f}>本次水量:</Text>
                                                        <View style={[styles.b,{flex:3}]}>
                                                            <Text style={{flex:1}}>{roomInfo.water}吨</Text>
                                                        </View>
                                                    </View>

                                                    <View style={styles.a}>
                                                        <Text style={styles.f}>水费单价:</Text>
                                                        <View style={[styles.b,{flex:3}]}>
                                                            <Text style={{flex:1}}>{roomInfo.hotelWater}元</Text>
                                                        </View>
                                                    </View>

                                                    <View style={styles.a}>
                                                        <Text style={styles.f}>水费金额:</Text>
                                                        <View style={[styles.b,{flex:3}]}>
                                                            <Text style={{flex:1}}>{roomInfo.waterMoney}元</Text>
                                                        </View>
                                                    </View>

                                                    <View style={{borderLeftWidth:3,borderLeftColor:'#7ebef9',marginTop:15}}>
                                                        <Text style={{fontSize:20,fontWeight:'bold',paddingLeft:10}}>热水费</Text>
                                                    </View>

                                                    <View style={{width:"100%",height:1,backgroundColor:"#f0f0f0",marginTop:10}}></View>


                                                    <View style={styles.a}>
                                                        <Text style={styles.f}>上次热水:</Text>
                                                        <View style={[styles.b,{flex:3}]}>
                                                            <Text style={{flex:1}}>{roomInfo.lastHotWater}吨</Text>
                                                        </View>
                                                    </View>

                                                    <View style={styles.a}>
                                                        <Text style={styles.f}>本次热水:</Text>
                                                        <View style={[styles.b,{flex:3}]}>
                                                            <Text style={{flex:1}}>{roomInfo.hotWater}吨</Text>
                                                        </View>
                                                    </View>


                                                    <View style={styles.a}>
                                                        <Text style={styles.f}>热水单价:</Text>
                                                        <View style={[styles.b,{flex:3}]}>
                                                            <Text style={{flex:1}}>{roomInfo.hotelWaterHot}元</Text>
                                                        </View>
                                                    </View>

                                                    <View style={styles.a}>
                                                        <Text style={styles.f}>热水金额:</Text>
                                                        <View style={[styles.b,{flex:3}]}>
                                                            <Text style={{flex:1}}>{roomInfo.hotWaterMoney}元</Text>
                                                        </View>
                                                    </View>







                                                </View>
                                            </ScrollView>
                                        </View>
                                }



                            </View>
                        </View>
                    </Modal>



                </View>

                {
                    dataSource.length > 0 ? (
                        <View  style={{height:Dimensions.get("window").height}}>

                            <View style={{flex:1,alignItems:"center",backgroundColor:"grey",height:20,width:Dimensions.get("window").width,top:0,position:"absolute",zIndex:999}}>
                                <Text>您有<Text style={{color:"red"}}>{willpaid}笔</Text>{`账单待支付${!type ? `,合约${contractNum}个月，完成${complete}个月` : ''}`}</Text>
                            </View>



                            {
                                willpaid==0? <Text>{}</Text> : (
                                    <View style={styles.userItem}>
                                        <View style={{padding:10,flexDirection:"row",justifyContent:"space-around",flex:1,borderTopColor:"grey",borderTopWidth:1}}>
                                            <Text>共计:</Text>
                                            <Text style={{color:"#f1803a"}}>{allRent.toFixed(2)}元</Text>
                                        </View>
                                        {
                                            (!isFenqi || willpaid==1) ?<Text/> :
                                                (
                                                    <TouchableHighlight  underlayColor="#fff" onPress={this.installment}  style={{display:type!==1&&type!==2&&payMonth>1?'flex':'none',alignItems:"center",padding:10,backgroundColor:type!==1&&type!==2&&type!==3&&this.onLine?'#666':"#f1803a",flex:1}}>
                                                        <Text style={{color:"#fff"}}>房租月付</Text>
                                                    </TouchableHighlight>

                                                )
                                        }


                                        <TouchableHighlight onPress={this.onPay} underlayColor="#fff"  style={{marginLeft:2,padding:10,backgroundColor:type!==1&&type!==2&&type!==3&&this.onLine?'#666':"#f1803a",flex:1,alignItems:"center"}}>
                                            <Text style={{color:"#fff"}}>确认账单</Text>
                                        </TouchableHighlight>
                                    </View>
                                )
                            }


                            <View style={styles.hei}>

                                <FlatList
                                    data={dataSource}  //列表的渲染数据源
                                    getItemLayout={(data, index) => ( {length: 80, offset: 80 * index, index} )}
                                    initialNumToRender={10}  //首次渲染的条数
                                    onEndReached={this.onEndReached}  //列表被滚动到距离内容最底部不足onEndReachedThreshold的距离时调用。
                                    onEndReachedThreshold={0.1} //定当距离内容最底部还有多远时触发onEndReached回调。注意此参数是一个比值而非像素单位。比如，0.5表示距离内容最底部的距离为当前列表可见长度的一半时触发。
                                    onRefresh={this.onRefresh} //下拉刷新
                                    refreshing={refreshing} //下拉刷新时候的正在加载的符号，设置为true显示，false隐藏。加载完成，需要设置为false
                                    keyExtractor={(item,index)=>`${item.id}-${index}`}
                                    renderItem={({item}) => (  //渲染列表的方式

                                        <TouchableHighlight  onPress={()=>this.selectRent(item)} underlayColor="#367d80">

                                            <View>
                                                <View
                                                    style={{flexDirection:"row",justifyContent: "space-around",
                                                        alignItems: 'center',borderRadius:10,
                                                        padding:5,backgroundColor:item.selectRent ? "#5cd9e7" : "#fff"}}>

                                                    <View style={{flexDirection:"row",flex:3,alignItems:"center"}}>
                                                        <View style={{marginRight:8}}>
                                                            <Image style={{height:30,width:30}} source={item.feeCode == '200002' ? electric : item.feeCode == '200001' ? water : item.feeCode == '100000' ? rent : fee }/>
                                                        </View>
                                                        <View>
                                                            <Text style={{color:item.isState == 0?"#000":"grey",fontSize:18}}>
                                                                {item.feeName}
                                                            </Text>
                                                            <WhiteSpace size="xs"/>
                                                            <Text style={{color:"grey"}}>{item.fromDate && item.fromDate.substring(5, 10)}至</Text>
                                                            <Text style={{color:"grey"}}>{item.toDate && item.toDate.substring(5, 10)}</Text>
                                                        </View>
                                                    </View>

                                                    <View  style={{flex:2}}>
                                                        <Text style={{color:item.isState == 0?"#000":"grey"}}>{item.addDate && item.addDate.substring(5, 10)}应收</Text>
                                                        <WhiteSpace size="xs"/>
                                                        <Text style={{color:item.isState == 0?"#000":"grey"}}>{item.nextDate && moment(item.nextDate).format('MM-DD')}截止</Text>
                                                    </View>

                                                    <View style={{flex:2,alignItems:"center"}}>
                                                        <Text style={{color:item.isState == 0?"#000":"grey",fontSize:18,fontWeight:"bold"}}>{item.rentPrice.toFixed(2)}</Text>
                                                        {
                                                            item.isFenqi == 1 &&
                                                            <View style={{alignItems:'center'}}>
                                                                <Text style={{color:item.isState == 0?"red":"grey",fontWeight:"bold"}}>{`${(item.fenqiFee && item.fenqiFee.toFixed(2) || 0)}`}</Text>
                                                                <Text style={{color:item.isState == 0&&item.selectRent?"#fff":"grey",fontSize:10}}>{`月付手续费`}</Text>
                                                            </View>
                                                        }

                                                        {
                                                            item.lateFee>0 &&
                                                            <View style={{alignItems:'center'}}>
                                                                <Text style={{color:item.isState == 0?"red":"grey",fontWeight:"bold"}}>{`${(item.lateFee && item.lateFee.toFixed(2) || 0)}`}</Text>
                                                                <Text style={{color:item.isState == 0&&item.selectRent?"#fff":"grey",fontSize:10}}>{`滞纳金`}</Text>
                                                            </View>
                                                        }

                                                    </View>

                                                    <View style={{flex:2,alignItems:"center"}}>
                                                        {
                                                            item.isState == 0 ? (

                                                                item.feeCode=='200001'||item.feeCode=='200002'||item.feeCode=='200007'?
                                                                <TouchableHighlight underlayColor="transparent" onPress={()=>{this.getBillInfo(item)}}>
                                                                    <View  style={{alignItems:"center"}}>
                                                                        <Text style={{color:item.selectRent? "#fff":"#5cd9e7"}}>{item.selectRent?'待交':"选择"}</Text>
                                                                        <Text style={{color:'red',marginTop:8}}>查看详情</Text>
                                                                    </View>
                                                                </TouchableHighlight>:
                                                                    <Text style={{color:item.selectRent? "#fff":"#5cd9e7"}}>{item.selectRent?'待交':"选择"}</Text>


                                                                ) :
                                                                (
                                                                    item.feeCode=='200001'||item.feeCode=='200002'||item.feeCode=='200007'?
                                                                        <TouchableHighlight underlayColor="transparent" onPress={()=>{this.getBillInfo(item)}}>
                                                                            <View  style={{alignItems:"center"}}>
                                                                                <Text style={{color:"grey"}}>已交</Text>
                                                                                <Text style={{color:'red',marginTop:8}}>查看详情</Text>
                                                                            </View>
                                                                        </TouchableHighlight>:
                                                                        <Text style={{color:"grey"}}>已交</Text>)

                                                        }

                                                    </View>
                                                </View>
                                                <WhiteSpace size="xs"/>
                                            </View>
                                        </TouchableHighlight>)


                                    }

                                />
                            </View>
                        </View>
                    ):(<View style={{alignItems:"center",marginTop:30}}>
                        <Text>
                            暂无账单记录
                        </Text>
                    </View>)
                }

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
            bottom:110,
        }, {

        })

    },


    hei:{
        marginTop:20,

        ...Platform.select({
            ios: {
                height: Dimensions.get("window").height - 120,
            },
            android: {
                height: a>1.9?Dimensions.get("window").height - 155:Dimensions.get("window").height - 140,
            },
        }),

        ...ifIphoneX({
            height: Dimensions.get("window").height - 165,
        }, {

        })
    },

    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,

    },
    innerContainer: {
        borderRadius: 10,


    }
    ,

    a:{
        flexDirection:"row",alignItems:"center",marginTop:10
    },

    b:{
        marginLeft:10,flex:1,
    },

    f:{
        flex:1,color:"grey"
    }



});
