
import React, { Component } from 'react';
import {
    Keyboard,StyleSheet, Text, View, TouchableHighlight, AsyncStorage, Image, TextInput, Platform,
    NetInfo,Modal,ScrollView
} from 'react-native';
import { List, InputItem,  WingBlank, Toast,Button } from 'antd-mobile';
import axios from 'axios'
import initReactFastclick from 'react-fastclick';
import Dimensions from 'Dimensions';
initReactFastclick();

import JPushModule from 'jpush-react-native'
import Txt from './a'

import loginCss from './style/loginCss'

import lockIcon from './style/lockIcon.png'
import phoneIcon from './style/phoneIcon.png'
import eye_close from './style/eye_close.png'
import eye_open from './style/eye_open.png'
import yes from './style/yes.png'
import no from './style/no.png'
import bg from './style/bg.png'
import {ifIphoneX} from "react-native-iphone-x-helper/index";
import close from "../../MyHome/Mine/style/close.jpg";
import CodePush from "react-native-code-push";

export default class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            phone: '',
            password: '',
            phoneType: false,
            passwordType: false,
            url:"",
            modalName:"",
            passwordT:true,
            yinsiFlag:true,
            passwordFlag:false,
            registrationId:null,
            margintop:0,
            animationType: 'none',//none slide fade
            modalVisible: false,//模态场景是否可见
            transparent: true,//是否透明显示
            contractData:[]
        };
        this.userInfo = {}
        this.tokenKey = ''
        this.contracts = {}
    }
    _setModalVisible = (visible) => {
        this.setState({ modalVisible: visible });
    };


    chooseConstract = (item)=>{
        let {contractData} = this.state
        contractData.map(i=>{
            if(i.checkinNo==item.checkinNo){
                i.flag=true
            }else {
                i.flag=false
            }

        })
        this.contracts = item
        console.log(this.contracts,'this.contractsthis.contracts');
        this.setState({
            contractData
        })
    }

    submitConstract = ()=>{
        const { navigate, Reset } = this.props.navigation;
        if(!this.contracts.checkinNo){
            alert('请选择房间')
            return
        }

        this.setState({
            modalVisible:false
        },()=>{
            axios.post(`${this.state.url}/tenant/selectContract`, {
                tokenKey:this.tokenKey.tokenKey,
                hotelNo:this.contracts.hotelNo,
                brandNo:this.contracts.brandNo,
                checkinNo:this.contracts.checkinNo,
                roomNo:this.contracts.roomNo,
            })
                .then((response) =>{
                    console.log(response,'用户选择合同');
                    if(response.data.code==0){
                        this.userInfo = Object.assign({},this.userInfo,response.data.data)
                        //设置storage
                        storage.save({
                            key: 'tokenKey',  // 注意:请不要在key中使用_下划线符号!
                            //data是你想要存储在本地的storage变量，这里的data只是一个示例。如果你想存一个叫item的对象，那么可以data: item，这样使用
                            data:this.tokenKey,
                            // 如果不指定过期时间，则会使用defaultExpires参数
                            // 如果设为null，则永不过期
                            expires: null
                        });

                        //设置storage
                        storage.save({
                            key: 'username',  // 注意:请不要在key中使用_下划线符号!
                            //data是你想要存储在本地的storage变量，这里的data只是一个示例。如果你想存一个叫item的对象，那么可以data: item，这样使用
                            data:this.userInfo,
                            // 如果不指定过期时间，则会使用defaultExpires参数
                            // 如果设为null，则永不过期
                            expires: null
                        });
                        //跳转页面
                        navigate('Home',{ user: '' });
                        Reset();
                    }else {
                        Toast.info(response.data.message)
                    }

                })
                .catch(function (error) {
                    console.log(error);

                });
        })



    }

    //密码可见
    changePasswordType=()=>{
        let {passwordFlag} = this.state;
        this.setState({
            passwordFlag:!passwordFlag
        })

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

    _keyboardDidShow =()=> {
        this.setState({
            margintop:-50
        })
    }

    _keyboardDidHide =()=> {
        this.setState({
            margintop:0
        })
    }


    focus=()=>{

        this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', ()=>{this._keyboardDidShow()});



    }

    blur=()=>{

        this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', ()=>{this._keyboardDidHide()});



    }



    componentWillUnmount () {

        this.keyboardDidShowListener&&this.keyboardDidShowListener.remove();
        this.keyboardDidHideListener&&this.keyboardDidHideListener.remove();


    }

    componentWillMount(){

        CodePush.sync();

        CodePush.allowRestart();//在加载完了可以允许重启
        JPushModule.getRegistrationID(id =>{
            let registrationId = id;

            this.setState({
                registrationId
            })

        });


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

                Toast.info('暂无网络链接，请联网后使用！！！',1)
            }
            // else if(connectionInfo.type=='unknown'){
            //     // Toast.info('联网状态异常',1)
            // }
            else{

                Toast.loading('loading');
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




    //手机号码输入
    handlePhoneChange = (value) => {
        let phoneType;
        if (value.replace(/\s/g, '').length < 11 ) {
            phoneType = true;
        } else {
            phoneType = false;
        }
        this.setState({
            phone: value,
            phoneType
        });
    }

    //点击手机错误icon
    handlephoneError = () => {
        const { phone } = this.state;
        if (this.state.phoneType) {
            Toast.info(phone.length > 0 ? '请输入正确的手机号码' : '手机号不能为空',1);
        }
    }

    //密码输入
    handlePasswordChange = (value) => {
        this.setState({
            password: value,
            passwordType: false
        });
    }

    //点击密码错误icon
    handlepasswordError = () => {
        const { password } = this.state;
        if (this.state.passwordType) {
            Toast.info(password.length > 0 ? '密码必须是字母加数字的8~16位组合' : '密码不能为空',1);
        }
    }

    //提交
    handleSublit = () => {

        const { phone, password, phoneType,url,passwordType } = this.state;
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


        if(!passwordType && !phoneType) {
            const { navigate, Reset } = this.props.navigation;


            this.netInfo();



            //这里发送Ajax
            axios.post(`${url}/tenant/loginTenant`, {
                phone: this.state.phone,
                password: this.state.password,
                registrationId:this.state.registrationId
            })
                .then((response)=> {
                    console.log(response);

                    if(response.data.code==0){
                        let tokenKey = {
                            tokenKey:response.data.tokenKey
                        };

                        let username = response.data.data;
                        username.payOrderId = '';
                        axios.post(`${url}/tenant/getAllContract`,{
                            tokenKey:response.data.tokenKey
                        } )
                            .then((res) =>{
                                console.log(res,'查看用户所有合同');
                                if(res.data.code==0){
                                    if(res.data.data.length==1){
                                        axios.post(`${url}/tenant/selectContract`, {
                                            tokenKey:response.data.tokenKey,
                                            hotelNo:res.data.data[0].hotelNo,
                                            brandNo:res.data.data[0].brandNo,
                                            checkinNo:res.data.data[0].checkinNo,
                                            roomNo:res.data.data[0].roomNo,
                                        })
                                            .then((ree) =>{
                                                console.log(ree,'用户选择合同');
                                                if(ree.data.code==0){
                                                    username = Object.assign({},username,ree.data.data)
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
                                                    //跳转页面
                                                    Toast.hide()
                                                    navigate('Home',{ user: '' });
                                                    Reset();


                                                }else {
                                                    Toast.info(ree.data.message, 1);

                                                }

                                            })
                                            .catch(function (error) {
                                                console.log(error);

                                            });

                                    }else {
                                        this.userInfo = username
                                        this.tokenKey = tokenKey
                                        this.contracts= {}
                                        this.setState({
                                            contractData:res.data.data,modalVisible:true,modalName:'合同'

                                        })
                                    }

                                }else {
                                    Toast.info(res.data.message, 1);
                                }

                            })

                            .catch(function (error) {
                                console.log(error);
                            });

                        console.log(username);

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



                    }else {
                        Toast.info(response.data.message, 1);
                    }


                })
                .catch(function (error) {
                    console.log(error);
                });
        }

    }

    render() {
        //弹框
        let modalBackgroundStyle = {
            backgroundColor: this.state.transparent ? 'rgba(0, 0, 0, 0.5)' : 'red',
        };
        let innerContainerTransparentStyle = this.state.transparent
            ? { backgroundColor: '#fff', padding: 10 ,

                overflow:"hidden"}
            : null;
        const {yinsiFlag, contractData,modalName, password, phoneType, passwordType ,passwordT,passwordFlag} = this.state;
        //console.log(phone, password, phoneType, passwordType);
        return (
            <View style={{height: Dimensions.get('window').height, backgroundColor:"#fff",marginTop:this.state.margintop}}>

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

                                        <View  style={{flex:1,alignItems:'center'}}><Text style={{fontSize:20}}>{modalName=="合同"?'选择合同':''}</Text></View>

                                        <TouchableHighlight underlayColor={"#fff"} onPress={this._setModalVisible.bind(this,false)}>
                                            <Image style={{height:30,width:30}} source={close}/>
                                        </TouchableHighlight>

                                    </View>

                                    {
                                        modalName=="合同"?
                                            <View>
                                                <ScrollView style={{maxHeight:Dimensions.get('window').height-200}}>
                                                    <View style={{padding:10,flexDirection:"row",justifyContent:"space-around",flexWrap:"wrap"}}>
                                                        {
                                                            contractData.length>0&& contractData.map((item,index)=>

                                                                <TouchableHighlight onPress={()=>{this.chooseConstract(item)}} underlayColor="transparent" key={index} style={{width:"48%",padding:10,borderWidth:1,borderColor:"#f0f0f0",borderRadius:10,backgroundColor:item.flag?"#f17e3a":"#fff",marginTop:10}}>
                                                                    <View style={{alignItems:"center",justifyContent:"center"}}>
                                                                        <Text>{item.hotelName}</Text>
                                                                        <Text style={{marginTop:5,fontSize:16,fontWeight:"bold"}}>{item.roomNo}</Text>
                                                                        <Text style={{marginTop:5,}}>{item.status==1?'在住':'已退房'}</Text>
                                                                    </View>
                                                                </TouchableHighlight>

                                                            )
                                                        }

                                                    </View>
                                                </ScrollView>
                                                <View style={{alignItems:"center",marginTop:10}}>
                                                    <TouchableHighlight underlayColor={"transparent"} style={{padding:10,
                                                        borderWidth:1,borderColor:"#fff",width:100,backgroundColor:"#f17e3a",
                                                        borderRadius:5}} onPress={()=>{this.submitConstract() }}>
                                                        <Text
                                                            style={{fontSize:16,textAlign:"center",color:"#fff"}}>

                                                            确定

                                                        </Text>
                                                    </TouchableHighlight>
                                                </View>
                                            </View>:
                                            <Txt/>
                                    }


                                </View>
                            </View>
                        </View>
                    </Modal>



                </View>
                <View style={styles.login}>
                    <View style={{marginTop:30}}>
                        <Text style={{color:"#fff",fontSize:20}}>
                            登陆
                        </Text>
                    </View>
                </View>


                <View>
                    <Image
                        source={bg}
                        style={{height:150,width: Dimensions.get('window').width, resizeMode:"stretch"}}
                        alt=""

                    />
                </View>


                <View style={{padding:30}}>
                    <View>
                        {/*<View style={styles.phoneNum}>*/}
                        {/*<View style={{paddingTop:10}}><Image source={phoneIcon} style={styles.iconImg}/></View>*/}
                        {/*<InputItem*/}
                        {/*type="phone"*/}
                        {/*placeholder="手机号"*/}
                        {/*style={{width:"80%"}}*/}
                        {/*onChange={this.handlePhoneChange}*/}
                        {/*value={phone}*/}
                        {/*maxLength={13}*/}
                        {/*error={phoneType}*/}
                        {/*onErrorClick={this.handlephoneError}>*/}
                        {/*</InputItem>*/}

                        {/*</View>*/}


                        <View style={{flexDirection:"row",padding:5,borderColor:"#f0f0f0",borderWidth:1,borderRadius:20,}}>
                            <View style={{justifyContent:'center',}}><Image source={phoneIcon} style={styles.iconImg}/></View>
                            <View style={{justifyContent:'center',alignItems:"center",marginLeft:15}}>
                                <TextInput
                                    placeholder="手机号"
                                    style={{minWidth:300,padding:0}}
                                    maxLength={11}
                                    dataDetectorTypes='phoneNumber'
                                    keyboardType='numeric'
                                    underlineColorAndroid="transparent"
                                    onChangeText={(phone) => this.handlePhoneChange(phone)}
                                >
                                </TextInput>
                            </View>

                        </View>


                        <View style={{marginTop:10,flexDirection:"row",padding:5,borderColor:"#f0f0f0",borderWidth:1,borderRadius:20}}>
                            <View style={{justifyContent:'center',}}><Image source={lockIcon} style={styles.iconImg}/></View>
                            <View style={{justifyContent:'center',marginLeft:15,flex:1}}>
                                <TextInput
                                    placeholder="请输入密码"
                                    style={{minWidth:300,padding:0}}
                                    secureTextEntry={passwordT?true:false}
                                    underlineColorAndroid="transparent"
                                    onChangeText={(passwordType) => this.handlePasswordChange(passwordType)}
                                    onBlur={()=>{this.blur()}}
                                    onFocus={()=>{this.focus()}}
                                >
                                </TextInput>
                            </View>

                            <TouchableHighlight underlayColor="#fff" onPress={this.changePasswordType} style={{marginRight:20,justifyContent:"center"}}>
                                <View>
                                    <Image source={passwordFlag ? eye_open : eye_close} style={styles.iconImg}/>
                                </View>
                            </TouchableHighlight>

                        </View>



                    </View>

                    <Button
                        style={{backgroundColor:'#ef813a',borderRadius:20,marginTop:20,marginBottom:10}}
                        onClick={this.handleSublit}
                    >
                        <Text style={{color:"#fff"}}>登陆</Text>
                    </Button>

                    <View style={{flexDirection:"row",marginBottom:20,alignItems:"center"}}>
                        <TouchableHighlight underlayColor="#fff" onPress={()=>{this.setState({yinsiFlag:!yinsiFlag})}}><Image source={yinsiFlag ? yes : no} style={styles.iconImg2} /></TouchableHighlight>

                        <Text style={{color:"#ccc"}}>已同意<Text style={{textDecorationLine:"underline"}} onPress={()=>{this.setState({modalVisible:true,modalName:"闪猪服务协议"})}}>《闪猪服务协议》</Text>及<Text  style={{textDecorationLine:"underline"}} onPress={()=>{this.setState({modalVisible:true,modalName:"闪猪服务协议"})}}>《隐私政策》</Text></Text>
                    </View>

                    <View style={{flexDirection:"row",justifyContent:"space-between",padding:5}}>
                        <TouchableHighlight onPress={() => {
                            const { navigate } = this.props.navigation;
                            //跳转页面
                            navigate('FindPassword',{ user: '' })
                        } }>
                            <Text style={{color:"grey"}}>忘记密码?</Text>
                        </TouchableHighlight>

                        <TouchableHighlight onPress={() => {


                            const { navigate } = this.props.navigation;
                            //跳转页面
                            navigate('Register',{ user: '' })
                        } }>
                            <Text  style={{color:"#ef813a"}}>注册</Text>
                        </TouchableHighlight>

                    </View>
                </View>




            </View>

        );
    }
}


const styles = StyleSheet.create(loginCss);
