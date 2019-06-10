import React,{Component} from 'react';
import {
    TextInput,Modal,View, Text, TouchableHighlight, Image, ScrollView, StyleSheet, Platform, CameraRoll, Alert,
    DeviceEventEmitter
} from 'react-native';
import Dimensions from 'Dimensions';
import add from './style/add.png'
import close from "./style/close.jpg";
import used from "./style/used.png";
import expired from "./style/expired.png";
import giving from "./style/giving.png";
import select from "./style/select.png";

import axios from "../../axios";
import {Toast} from "antd-mobile";


export default class Mine extends React.Component {
    constructor(props) {
        super(props);
        this.state={
            coupon:[],
            couponNo:'',
            modal:'',
            phone:'',
            givingCouponNo:'',
            animationType: 'none',//none slide fade
            modalVisible: false,//模态场景是否可见
            transparent: true,//是否透明显示
        }

    }


    getMyCoupon=()=>{
        axios.post(`/coupon/getMyCoupon`, {

        })
            .then( (response)=> {
                console.log(response,'查询代金券');
                if(response.data.code==0){

                    let data=[];


                    if(response.data.data.length>0){
                        data=response.data.data;
                        data.map(item=>{
                            item.flag=false
                        })

                    }

                    this.setState({
                        coupon:data
                    })
                }
            })
            .catch(function (error) {
                console.log(error);
            });
    }


    componentWillMount(){

        this.getMyCoupon()


    }


    //添加优惠券
    addCoupons=()=>{

        this.setState({
            couponNo:''
        },()=>{

            this.setState({
                modal:'addCoupons',
                modalVisible:true
            })

        })


    };

    //赠送优惠券
    givingCoupons=()=>{

        let {givingCouponNo} = this.state
        if(givingCouponNo==''){
            Toast.info('请选择赠送的优惠券',1)
            return
        }

        this.setState({
            modal:'givingCoupons',
            modalVisible:true
        })




    }

    //选择优惠券
    handleCoupon = (item)=>{

        let {coupon} = this.state;

        if(item.couponState==1&&item.ifGive==1){
            coupon.map(_item=>{
                if(_item.couponId==item.couponId){
                    _item.flag=!item.flag
                }else {
                    _item.flag=false
                }
            })


            this.setState({
                coupon,
                givingCouponNo:item.flag?item.couponId:''
            })

        }else {
            Toast.info('该优惠券不可被赠送',1)
            this.setState({
                givingCouponNo:''
            })
        }

    }

    _setModalVisible = (visible) => {

        this.setState({ modalVisible: visible })
    };

    submitTaker=()=>{
        let {couponNo} = this.state;

        if(couponNo.trim()==''){
            Toast.info('请输入券号',1);
            return
        }


        axios.post(`/coupon/userAddCoupon`, {
            couponNo
        })
            .then( (response)=> {
                console.log(response,'添加代金券');
                if(response.data.code==0){
                    alert('添加成功');

                    this.getMyCoupon()

                }else if(response.data.code==1){
                    alert(response.data.message)
                }
            })
            .catch(function (error) {
                console.log(error);
            });




    }

    //确定赠送按钮
    submitGiving = ()=>{
        let {givingCouponNo,phone} = this.state

        if(phone.trim()==''){
            alert('请输入赠送人手机号')
            return
        }

        axios.post(`/coupon/couponDonation`, {
            couponId:givingCouponNo,
            phone
        })
            .then( (response)=> {
                console.log(response,'赠送代金券');
                if(response.data.code==0){
                    alert('赠送成功');
                    this.getMyCoupon()


                }else if(response.data.code==1){
                    alert(response.data.message)
                }
            })
            .catch(function (error) {
                console.log(error);
            });



    }

    render(){

        let {coupon} = this.state;




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



                <View style={{height:Dimensions.get("window").height,backgroundColor:"#fff"}}>

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
                                        this.state.modal=='addCoupons'?
                                            <View>
                                                <View style={{flexDirection:"row",justifyContent:"space-around",alignItems:"center"}}>

                                                    <View  style={{flex:1,alignItems:'center'}}><Text style={{fontSize:20}}>添加代金券</Text></View>

                                                    <TouchableHighlight underlayColor={"#fff"} onPress={()=>{this._setModalVisible(false)} } style={{}}>
                                                        <Image style={{height:30,width:30}} source={close}/>
                                                    </TouchableHighlight>

                                                </View>

                                                <View style={{padding:10,marginTop:10}}>



                                                    <View style={styles.a}>
                                                        <Text>券号:</Text>
                                                        <View style={styles.b}>
                                                            <TextInput
                                                                placeholder={'券号'}
                                                                style={{minWidth:'100%',padding:10,borderColor:"#ccc",borderWidth:1,borderRadius:5,}}
                                                                underlineColorAndroid="transparent"
                                                                onChangeText={(couponNo) => this.setState({couponNo})}
                                                            >
                                                            </TextInput>
                                                        </View>
                                                    </View>


                                                    <View style={{alignItems:"center",marginTop:10}}>

                                                        <TouchableHighlight underlayColor={"transparent"} style={{padding:10,
                                                            borderWidth:1,borderColor:"#fff",width:100,backgroundColor:"#f17e3a",
                                                            borderRadius:5}} onPress={this.submitTaker }>
                                                            <Text
                                                                style={{fontSize:16,textAlign:"center",color:"#fff"}}>
                                                                添加
                                                            </Text>
                                                        </TouchableHighlight>


                                                    </View>

                                                </View>
                                            </View>:
                                            <View>
                                                <View style={{flexDirection:"row",justifyContent:"space-around",alignItems:"center"}}>

                                                    <View  style={{flex:1,alignItems:'center'}}><Text style={{fontSize:20}}>赠送代金券</Text></View>

                                                    <TouchableHighlight underlayColor={"#fff"} onPress={()=>{this._setModalVisible(false)} } style={{}}>
                                                        <Image style={{height:30,width:30}} source={close}/>
                                                    </TouchableHighlight>

                                                </View>

                                                <View style={{padding:10,marginTop:10}}>



                                                    <View style={styles.a}>
                                                        <Text>手机号:</Text>
                                                        <View style={styles.b}>
                                                            <TextInput
                                                                placeholder={'请填写赠送手机号'}
                                                                style={{minWidth:'100%',padding:10,borderColor:"#ccc",borderWidth:1,borderRadius:5,}}
                                                                underlineColorAndroid="transparent"
                                                                onChangeText={(phone) => this.setState({phone})}
                                                            >
                                                            </TextInput>
                                                        </View>
                                                    </View>


                                                    <View style={{alignItems:"center",marginTop:10}}>

                                                        <TouchableHighlight underlayColor={"transparent"} style={{padding:10,
                                                            borderWidth:1,borderColor:"#fff",width:100,backgroundColor:"#f17e3a",
                                                            borderRadius:5}} onPress={this.submitGiving }>
                                                            <Text
                                                                style={{fontSize:16,textAlign:"center",color:"#fff"}}>
                                                                赠送
                                                            </Text>
                                                        </TouchableHighlight>


                                                    </View>

                                                </View>
                                            </View>
                                    }






                                </View>
                            </View>
                        </Modal>



                    </View>


                    <View style={{marginTop:5,padding:10,marginRight:10}}>

                        <View style={{flexDirection:"row",justifyContent:"space-between"}}>
                            <TouchableHighlight underlayColor="transparent" onPress={this.addCoupons}>
                                <View style={{flexDirection:"row-reverse",alignItems:"center"}}>
                                    <Text>添加优惠券</Text>
                                    <Image source={add} style={{width:20,height:20}}/>

                                </View>
                            </TouchableHighlight>

                            <TouchableHighlight underlayColor="transparent" onPress={this.givingCoupons}>
                                <View style={{flexDirection:"row-reverse",alignItems:"center"}}>
                                    <Text>赠送优惠券</Text>
                                    <Image source={giving} style={{width:20,height:20}}/>

                                </View>
                            </TouchableHighlight>
                        </View>


                        {
                            coupon.length>0?
                                <ScrollView>
                                    <View style={{marginTop:5,
                                        ...Platform.select({
                                            android:{
                                                paddingBottom:100,
                                            },
                                            ios:{
                                                paddingBottom:80,
                                            }
                                        }),}}>
                                        <Text style={{color:"red",fontWeight:"bold"}}>
                                            注意：若违约退房，退款中将会扣除已使用的优惠券金额，优惠券发放及使用政策最终解释权归条玛青年社区所有。
                                        </Text>
                                        {

                                            coupon.length>0&&coupon.map((item,index)=>

                                                <TouchableHighlight key={index} style={{marginTop:10,}} underlayColor="transparent" onPress={()=>{this.handleCoupon(item)}}>
                                                    <View style={{flexDirection:"row",backgroundColor:"#fff"}}>
                                                        <View style={{padding:10,backgroundColor:"#ff6600",flex:1,alignItems:"center",justifyContent:"center"}}>
                                                            <Text style={{color:"#fff",fontSize:20,fontWeight:'bold'}}>{item.couponMoney}</Text>

                                                        </View>


                                                        {item.couponState!==1&&<View style={{position:'absolute',zIndex:999,right:5,top:5}}><Image source={item.couponState==2?used:expired} style={{width:40,height:40}}/></View>}



                                                        <View style={{padding:10,flex:2,borderColor:"#ccc",borderWidth:1}}>
                                                            {item.couponType==0&&<View style={{flexDirection:"row-reverse",marginBottom:5}}><Text style={{color:"grey"}}>纸质</Text></View>}

                                                            <View style={{alignItems:"center",justifyContent:"center"}}>

                                                                <Text style={{fontSize:16,fontWeight:'bold'}}>{item.couponName}</Text>
                                                                <Text style={{marginTop:5,}}>满{item.condition}可用</Text>
                                                                <Text style={{marginTop:5,}}>({item.ifOverlay==0?'不可叠加':item.ifOverlay==1?'可叠加':'无限叠加'})</Text>
                                                                <Text style={{marginTop:5,}}>{item.feeNames}可用</Text>


                                                            </View>


                                                            {item.flag&&<View style={{position:"absolute",zIndex:999,top:5,left:5}}><Image source={select} style={{height:30,width:30}}/></View>}

                                                        </View>
                                                    </View>
                                                </TouchableHighlight>



                                            )


                                        }
                                    </View>
                                </ScrollView>:
                                <View style={{marginTop:10,alignItems:"center"}}>
                                    <Text>暂无优惠券</Text>
                                </View>
                        }






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

    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,

    },
    innerContainer: {
        borderRadius: 10,
    },

    a:{
        flexDirection:"row",alignItems:"center",marginTop:10
    },

    b:{
        marginLeft:10,flex:1,
    }


});



