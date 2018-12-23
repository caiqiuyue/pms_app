import React,{Component} from 'react';
import {View,CameraRoll, TextInput,Text, TouchableHighlight, Image, ScrollView, StyleSheet,Platform} from 'react-native';

import axios from "../../axios";
import Dimensions from "Dimensions";
import {Toast,InputItem,Button} from "antd-mobile";

import securityIcon from '../../main/Login/style/securityIcon.png'

export default class Mine extends React.Component {
    constructor(props) {
        super(props);
        this.state={
            phone:"",
            oldPhone:"",
            code:"",
            codeType: false,
            CountDown: false,
            CountDownNum: 60,
        };


    }


    aa = (tel)=>{
        let mtel = tel.substr(0, 3) + '****' + tel.substr(7);
        return mtel
    }

    //验证码输入
    handleCodeChange = (code) => {

        // let value = this.state.code;

        console.log(code)
        let codeType;
        if (code.replace(/\s/g, '').length < 6) {
            codeType = true;
        } else {
            codeType = false;
        }
        this.setState({
            code,
            codeType
        });
    };

    //验证码错误icon
    handleCodeError = () => {
        const { code, codeType } = this.state;
        if (codeType) {
            Toast.info(code.length > 0 ? '验证码为6位数字组合' : '验证码不能为空',1);
        }
    };

    //获取验证码倒计时
    handleCountDown = () => {
        //发送请求，获取验证码
        let {phone} = this.state;


        if(phone.replace(/\s/g, '').length < 11){
            Toast.info(phone.length > 0 ? '请输入正确的手机号码' : '手机号不能为空', 1);
            return
        }

        axios.post(`/tenant/getVerCode`, {
            phone: this.state.phone,

        })
            .then( (response)=> {
                console.log(response);
                console.log(response.data.code)
                if(response.data.code == 0) {
                    //请求发送成功设置定时器
                    this.setState({
                        CountDown: true
                    }, () => {
                        let CountDownTimer =  setInterval(() => {
                            let { CountDownNum } = this.state;
                            let CountDown = true;

                            CountDownNum --;

                            if(CountDownNum === 0) {
                                CountDown = false;
                                CountDownNum = 60;
                                //清楚定时器
                                clearInterval(CountDownTimer);
                            }

                            this.setState({
                                CountDown,
                                CountDownNum
                            });
                        }, 1000)
                    });
                } else {
                    Toast.info(response.data.message, 1);
                }

            })
            .catch(function (error) {
                console.log(error);
            });
    };


    componentWillMount(){


        axios.post(`/my/getMyAuthent`, {

        })
            .then( (response)=> {
                console.log(response,'身份证审核');
                let oldPhone=response.data.phone+'';

                this.setState({
                    oldPhone
                })




            })
            .catch(function (error) {
                console.log(error);
            });



    }



    submitBtn=()=>{
        let {phone,code, codeType,flag} = this.state;

        console.log(codeType,'codeType');

        if(flag){
            Toast.info('已成功，不可重复提交',1);
        }else {
            if(phone.replace(/\s/g, '').length < 11){
                Toast.info(phone.length > 0 ? '请输入正确的手机号码' : '手机号不能为空', 1);
                return
            }else if (code.replace(/\s/g, '').length < 6) {
                Toast.info(code.length > 0 ? '验证码为6位数字组合' : '验证码不能为空',1);
                return
            }else {

                axios.post(`/my/changePhoneNumber`, {
                    newPhone:phone,
                    verCode:code,

                })
                    .then( (response)=> {

                        if(response.data.code==0){
                            Toast.info('修改成功',1);
                        }else if(response.data.code==1){
                            Toast.info(response.data.message,1);
                        }


                        console.log(response,'改手机号');
                        this.setState({
                            flag:true
                        })

                    })
                    .catch(function (error) {
                        console.log(error);
                    });
            }
        }


    };







    render(){

        let{flag,oldPhone,code,codeType,CountDown, CountDownNum,} = this.state;
        return (

            <View style={{height:Dimensions.get("window").height,backgroundColor:"#fff",}}>
                <ScrollView>
                    <View style={{flex:1,
                        ...Platform.select({
                            android:{
                                paddingBottom:80,
                            },
                            ios:{
                                paddingBottom:30,
                            }
                        }),
                        }}>


                        <View style={{padding:20}}>


                            <View style={styles.userMessage}>
                                <View>
                                    <Text>手机号:</Text>
                                </View>
                                <View style={styles.userItem}>
                                   <Text>{this.aa(oldPhone)}</Text>
                                </View>
                            </View>

                            <View style={styles.userMessage}>
                                <View>
                                    <Text>新手机号:</Text>
                                </View>
                                <View style={styles.userItem}>
                                    <TextInput
                                        style={{padding:0}}
                                        maxLength={11}
                                        type="number"
                                        underlineColorAndroid="transparent"
                                        placeholder="请输入电话号码"
                                        onChangeText={(phone) => this.setState({phone})}>

                                    </TextInput>
                                </View>
                            </View>

                            <View style={styles.phoneNum}>
                                <View><Image source={securityIcon} style={styles.iconImg}/></View>

                                <View style={styles.userItem}>
                                    <TextInput
                                        type="number"
                                        placeholder="请输入验证码"
                                        className="input"
                                        maxLength={6}
                                        underlineColorAndroid="transparent"
                                        style={{flex: 1}}
                                        onChangeText={(code)=>this.handleCodeChange(code)}
                                        // value={code}
                                        // error={codeType}
                                        // onErrorClick={this.handleCodeError}
                                    >
                                    </TextInput>
                                </View>

                                <View  style={{flex: 1 }}>
                                    <TouchableHighlight underlayColor='transparent' style={{backgroundColor:"#ef813a",alignItems:"center",borderRadius:5}}  disabled={CountDown} onPress={this.handleCountDown}>
                                        <Text style={{color:'#fff',padding:5}}>{CountDown ? `重新获取验证码${CountDownNum}S` : '获取验证码'}</Text>
                                    </TouchableHighlight>
                                </View>



                            </View>




                            <View style={{alignItems:"center",marginBottom:30}}>

                                <TouchableHighlight underlayColor={flag ? "#fff" : "#367d80"} style={{padding:10,
                                    borderWidth:1,borderColor:flag ? "#000" : "#fff",width:'100%',backgroundColor:flag ? "#fff" : "#ef813a",
                                    borderRadius:10}} onPress={this.submitBtn }>
                                    <Text

                                        style={{fontSize:16,textAlign:"center",color:flag ? "#f0f0f0":"#fff"}}>
                                        确定
                                    </Text>
                                </TouchableHighlight>

                            </View>


                        </View>
                    </View>
                </ScrollView>
            </View>

        )

    }
}
const styles = StyleSheet.create({
    userMessage:{
        flexDirection:"row",
        alignItems:"center",
        padding:5,
        paddingTop:10,
        paddingBottom:10,
        paddingLeft:16,
        borderBottomWidth:2,
        borderBottomColor:"#f0f0f0",
        marginBottom:5
    },
    userItem:{
        flex:1,
        marginLeft:20

    },
    phoneNum:{
        flexDirection:"row",
        justifyContent:"flex-start",
        padding:5,

        paddingLeft:16,
        borderBottomWidth:2,
        borderBottomColor:"#f0f0f0",
        marginBottom:5
    },
    iconImg:{
        width: 16,
        height: 16
    },

});

