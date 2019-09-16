import React, { Component } from 'react';
import {ScrollView,StyleSheet, Text, View, TouchableHighlight, Image, TextInput, NetInfo} from 'react-native';
import { NavBar, Icon ,List, InputItem,Button,WingBlank,Radio,Flex,Toast,Checkbox,WhiteSpace} from 'antd-mobile';
import lockIcon from './style/lockIcon.png'
import securityIcon from './style/securityIcon.png'
import phoneIcon from './style/phoneIcon.png'
import axios from "axios/index";
import loginCss from './style/loginCss'
import eye_close from './style/eye_close.png'
import eye_open from './style/eye_open.png'
const AgreeItem = Checkbox.AgreeItem;

import initReactFastclick from 'react-fastclick';
import JPushModule from "jpush-react-native";
import bg from './style/bg.png'
import Dimensions from 'Dimensions';
initReactFastclick();

export default class Register extends Component {
    constructor(props) {
        super(props);
        this.state = {
            phone: '',
            password: '',
            code: '',
            codeType: false,
            phoneType: false,
            passwordType: false,
            agreeChecked: false,
            yzmText: "",
            CountDown: false,
            CountDownNum: 60,
            url:"",
            passwordT:true,
            passwordFlag:false,
            registrationId:null,
            margintop:Dimensions.get('window').height

        };
    }



    netInfo=()=>{
        //检测网络是否连接
        NetInfo.isConnected.fetch().done((isConnected) => {
            console.log(isConnected,'isConnected');
        });

        //检测网络连接信息
        NetInfo.getConnectionInfo().done((connectionInfo) => {
            console.log(connectionInfo,'connectionInfo');
            if(connectionInfo.type=='none'){

                Toast.info('暂无网络链接',1)
            }else if(connectionInfo.type=='unknown'){
                Toast.info('联网状态异常',1)
            }
        });

        //监听网络变化事件
        NetInfo.addEventListener('connectionChange', (networkType) => {
            console.log(networkType,'networkType');

            if(networkType=='none'){

                Toast.info('暂无网络链接',1)
            }else if(networkType=='unknown'){
                Toast.info('联网状态异常',1)
            }
        });
    }

    //密码可见
    changePasswordType=()=>{
        let {passwordFlag} = this.state;
        this.setState({
            passwordFlag:!passwordFlag
        });

        if(!passwordFlag){
            this.setState({
                passwordT:false
            })

        }else {
            this.setState({
                passwordT:true
            })
        }
    };



    focus=()=>{
        this.setState({
            margintop:Dimensions.get('window').height
        })


    }



    componentWillMount(){
        //读取
        storage.load({
            key: 'url',
            // autoSync(默认为true)意味着在没有找到数据或数据过期时自动调用相应的sync方法
            autoSync: false
        }).then(ret => {
            this.setState({
                url:ret.url
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



        JPushModule.getRegistrationID(id =>{
            let registrationId = id;

            this.setState({
                registrationId
            })

        });


    }


    //手机号码输入
    handlePhoneChange = (value) => {
        console.log(value)
        let phoneType;
        if (value.replace(/\s/g, '').length < 11) {
            phoneType = true;
        } else {
            phoneType = false;
        }
        this.setState({
            phone: value,
            phoneType
        });
    };

    //点击手机错误icon
    handlePhoneError = () => {

        const { phone, phoneType } = this.state;
        if (phoneType) {
            Toast.info(phone.length > 0 ? '请输入正确的手机号码' : '手机号不能为空');
        }
    };

    //密码输入
    handlePasswordChange = (value) => {
        let passwordType;
        if (value.replace(/\s/g, '').length < 8) {
            passwordType = true;
        } else {
            let regExp = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{8,16}$/;
            if(!regExp.test(value)) {
                passwordType = true;
            } else {
                passwordType = false;
            }
        }
        this.setState({
            password: value,
            passwordType
        });
    };

    //点击密码错误icon
    handlePasswordError = () => {
        const { password, passwordType } = this.state;
        if (passwordType) {
            Toast.info(password.length > 0 ? '密码必须是字母加数字的8~16位组合' : '密码不能为空');
        }
    };



    //验证码输入
    handleCodeChange = (value) => {
        console.log(value)
        let codeType;
        if (value.replace(/\s/g, '').length < 6) {
            codeType = true;
        } else {
            codeType = false;
        }
        this.setState({
            code: value,
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

    //协议按钮
    agree = (e)=>{
        let checked = e.target.checked;
        this.setState({
            agreeChecked: checked
        })
    };

    //获取验证码倒计时
    handleCountDown = () => {
        //发送请求，获取验证码
        let {phoneType, phone,url} = this.state;
        if(phoneType || (!phoneType && phone.length !== 11)){
            Toast.info(phone.length > 0 ? '请输入正确的手机号码' : '手机号不能为空',1);
            return;
        }


        this.netInfo();

        axios.post(`${url}/tenant/getVerCode`, {
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

    //点击注册
    registerSub=()=>{
        const {url, phone, password, phoneType, passwordType, agreeChecked, code, codeType} = this.state;


        if (phoneType || phone.replace(/\s/g, '').length !== 11) {
            Toast.info(phone.length > 0 ? '请输入正确的手机号码' : '手机号不能为空',1);
            this.setState({
                phoneType: !(phone.replace(/\s/g, '').length === 11),
                // passwordType: !(password.trim().length > 8 && password.trim().length < 16),
                // codeType: !(code.replace(/\s/g, '').length === 6)
            });
            return
        }



        if (passwordType || (password.trim().length < 8 || password.trim().length > 16) ) {
            Toast.info(password.length > 0 ? '密码必须是字母加数字的8~16位组合' : '密码不能为空',1);
            this.setState({
                // phoneType: !(phone.replace(/\s/g, '').length === 11),
                passwordType: !(password.trim().length > 8 && password.trim().length < 16),
                // codeType: !(code.replace(/\s/g, '').length === 6)
            });
            return
        }


        if (codeType || code.replace(/\s/g, '').length !== 6) {
            Toast.info(code.length > 0 ? '验证码为6位数字组合' : '验证码不能为空',1);
            this.setState({
                // phoneType: !(phone.replace(/\s/g, '').length === 11),
                // passwordType: !(password.trim().length > 8 && password.trim().length < 16),
                codeType: !(code.replace(/\s/g, '').length === 6)
            });
            return
        }




        // if(phoneType || passwordType || codeType || phone.replace(/\s/g, '').length !== 11 || (password.trim().length < 8 || password.trim().length > 16) || code.replace(/\s/g, '').length !== 6) {
        //     Toast.info("请填写正确的注册信息再提交", 1);
        //     this.setState({
        //         phoneType: !(phone.replace(/\s/g, '').length === 11),
        //         passwordType: !(password.trim().length > 8 && password.trim().length < 16),
        //         codeType: !(code.replace(/\s/g, '').length === 6)
        //     });
        //     return;
        // }

        if(!agreeChecked) {
            Toast.info("请同意协议", 1);
            return;
        }

        if(!passwordType && !phoneType && !codeType) {
            const { navigate ,Reset} = this.props.navigation;


            this.netInfo();

            //这里发送Ajax
            axios.post(`${url}/tenant/regTenantUser`, {
                phone: this.state.phone,
                password: this.state.password,
                verCode:this.state.code
            })
                .then( (response)=> {
                    console.log(response);
                    console.log(response.data.code);
                    if(response.data.code == 0) {

                        axios.post(`${url}/tenant/loginTenant`, {
                            phone: this.state.phone,
                            password: this.state.password,
                            registrationId:this.state.registrationId
                        })
                            .then(function (response) {
                                console.log(response);

                                if(response.data.code===1){
                                    Toast.info(response.data.message, 1);
                                } else {
                                    let tokenKey = {
                                        tokenKey:response.data.tokenKey
                                    };

                                    let username = response.data.data;
                                    username.payOrderId = '';


                                    console.log(username);


                                    //设置storage
                                    storage.save({
                                        key: 'tokenKey',  // 注意:请不要在key中使用_下划线符号!
                                        //data是你想要存储在本地的storage变量，这里的data只是一个示例。如果你想存一个叫item的对象，那么可以data: item，这样使用
                                        data:tokenKey,
                                        // 如果不指定过期时间，则会使用defaultExpires参数
                                        // 如果设为null，则永不过期
                                        expires: null
                                    });

                                    //设置storage
                                    storage.save({
                                        key: 'username',  // 注意:请不要在key中使用_下划线符号!
                                        //data是你想要存储在本地的storage变量，这里的data只是一个示例。如果你想存一个叫item的对象，那么可以data: item，这样使用
                                        data:username,
                                        // 如果不指定过期时间，则会使用defaultExpires参数
                                        // 如果设为null，则永不过期
                                        expires: null
                                    });

                                    let setup = {
                                        uri1:'',
                                        uri2:''
                                    };

                                    //设置storage
                                    storage.save({
                                        key: 'setup',  // 注意:请不要在key中使用_下划线符号!
                                        //data是你想要存储在本地的storage变量，这里的data只是一个示例。如果你想存一个叫item的对象，那么可以data: item，这样使用
                                        data:setup,
                                        // 如果不指定过期时间，则会使用defaultExpires参数
                                        // 如果设为null，则永不过期
                                        expires: null
                                    });

                                    //跳转页面
                                    navigate('Home',{ user: '' });
                                    Reset();

                                }

                            })
                            .catch(function (error) {
                                console.log(error);
                            });







                    } else {
                        Toast.info(response.data.message, 1);
                    }
                })
                .catch(function (error) {
                    console.log(error);
                });
        }
    }


    render() {
        const { phone, password, phoneType, passwordType,passwordT,passwordFlag, agreeChecked, CountDown, CountDownNum, code, codeType } = this.state;
        console.log(agreeChecked);
        return (


                <View style={{ padding:30,marginTop:50}}>

                    <Text>
                        本APP为公寓内部软件，暂不支持游客注册，如您已办理入住，请直接登录；手机号为入住人手机号，初始密码为：12345678，为了您的信息安全，请登录后尽快修改密码！
                    </Text>
                    {/*<View>*/}

                        {/*<View>*/}
                            {/*<Image*/}
                                {/*source={bg}*/}
                                {/*style={{height:150,width: Dimensions.get('window').width, resizeMode:"stretch"}}*/}
                                {/*alt=""*/}

                            {/*/>*/}
                        {/*</View>*/}
                        {/*<ScrollView>*/}

                            {/*<View style={{height: 800,padding:30}}>*/}
                                {/*<View style={{flexDirection:"row",padding:5,borderColor:"#f0f0f0",borderWidth:1,borderRadius:20,}}>*/}
                                    {/*<View  style={{justifyContent:'center',}}><Image source={phoneIcon} style={styles.iconImg}/></View>*/}
                                    {/*<View style={{justifyContent:'center',alignItems:"center",marginLeft:15}}>*/}
                                        {/*<TextInput*/}
                                            {/*placeholder="手机号"*/}
                                            {/*style={{minWidth:300,padding:0}}*/}
                                            {/*maxLength={11}*/}
                                            {/*dataDetectorTypes='phoneNumber'*/}
                                            {/*keyboardType='numeric'*/}
                                            {/*underlineColorAndroid="transparent"*/}
                                            {/*onChangeText={(phone) => this.handlePhoneChange(phone)}*/}
                                            {/*onBlur={this.handlePhoneError}*/}

                                        {/*>*/}
                                        {/*</TextInput>*/}
                                    {/*</View>*/}

                                {/*</View>*/}


                                {/*<View style={{marginTop:10,flexDirection:"row",padding:5,borderColor:"#f0f0f0",borderWidth:1,borderRadius:20}}>*/}
                                    {/*<View  style={{justifyContent:'center',}}><Image source={lockIcon} style={styles.iconImg}/></View>*/}
                                    {/*<View style={{justifyContent:'center',marginLeft:15,flex:1}}>*/}
                                        {/*<TextInput*/}
                                            {/*placeholder="请输入密码"*/}
                                            {/*style={{minWidth:300,padding:0}}*/}
                                            {/*secureTextEntry={passwordT?true:false}*/}
                                            {/*underlineColorAndroid="transparent"*/}
                                            {/*onChangeText={(passwordType) => this.handlePasswordChange(passwordType)}*/}
                                            {/*onBlur={()=>{this.handlePasswordError()}}*/}


                                        {/*>*/}
                                        {/*</TextInput>*/}
                                    {/*</View>*/}

                                    {/*<TouchableHighlight underlayColor="#fff" onPress={this.changePasswordType} style={{marginRight:20}}>*/}
                                        {/*<View>*/}
                                            {/*<Image source={passwordFlag ? eye_open : eye_close} style={styles.iconImg}/>*/}
                                        {/*</View>*/}
                                    {/*</TouchableHighlight>*/}

                                {/*</View>*/}


                                {/*<View style={{marginTop:10,flexDirection:"row",padding:5,borderColor:"#f0f0f0",borderWidth:1,borderRadius:20}}>*/}
                                    {/*<View  style={{justifyContent:'center',}}><Image source={securityIcon} style={styles.iconImg}/></View>*/}

                                    {/*<View style={{justifyContent:'center',marginLeft:15,flex:2}}>*/}
                                        {/*<TextInput*/}
                                            {/*placeholder="请输入验证码"*/}
                                            {/*style={{minWidth:80,padding:0}}*/}
                                            {/*keyboardType='numeric'*/}
                                            {/*maxLength={6}*/}
                                            {/*underlineColorAndroid="transparent"*/}
                                            {/*onChangeText={(code) => this.handleCodeChange(code)}*/}
                                            {/*onBlur={()=>{this.handleCodeError()}}*/}

                                        {/*>*/}
                                        {/*</TextInput>*/}
                                    {/*</View>*/}


                                    {/*<View  style={{flex: 2 }}>*/}
                                        {/*<Button size="small" style={{height:26, backgroundColor:"#ef813a"}} inline="true" disabled={CountDown} onClick={this.handleCountDown}>*/}
                                            {/*<Text style={{color:'#fff'}}>{CountDown ? `重新获取验证码${CountDownNum}S` : '获取验证码'}</Text>*/}
                                        {/*</Button>*/}
                                    {/*</View>*/}



                                {/*</View>*/}

                                {/*<Flex style={{ width:'100%',height:40}}>*/}
                                    {/*<Flex.Item>*/}
                                        {/*<AgreeItem data-seed="logId" onChange={this.agree} checked={agreeChecked}>*/}
                                            {/*<Text>已阅读并同意 <Text>《注册协议和隐私权政策》</Text></Text>*/}
                                        {/*</AgreeItem>*/}
                                    {/*</Flex.Item>*/}
                                {/*</Flex>*/}


                                {/*<Button*/}
                                    {/*style={{backgroundColor:'#ef813a',borderRadius:20,marginTop:20}}*/}
                                    {/*onClick={this.registerSub}><Text style={{color:'#fff'}}>确定</Text>*/}
                                {/*</Button>*/}
                            {/*</View>*/}
                        {/*</ScrollView>*/}

                    {/*</View>*/}



                </View>




        );
    }


}

const styles = StyleSheet.create(loginCss);