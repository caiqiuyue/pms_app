import React,{Component} from 'react';
import {View, CameraRoll, Text, TouchableHighlight, Image, ScrollView, StyleSheet, Platform, Modal} from 'react-native';
import myContract from './style/myContract.png'
import realName from './style/1-60xp.png'
import bankcard from './style/2-60px.png'
import safeSetup from './style/3-60px.png'
import triedCard from './style/4-60px.png'
import right from './style/right.png'
import axios from "../../axios";


import Dimensions from "Dimensions";
import RealName from "./realName";
import BankCard from "./bankCard";
import ChangePhoneNum from "./changePhoneNum";
import close from "./style/close.jpg";
import Txt from "../../main/Login/a";

export default class Mine extends React.Component {
    constructor(props) {
        super(props);
        this.state={
            cardImg:null,
            cardImgList:[],
            bankCardJson:null,
            emergencyJson:null,
            animationType: 'none',//none slide fade
            modalVisible: false,//模态场景是否可见
            transparent: true,//是否透明显示
        }

    }




    componentWillMount(){
        axios.post(`/my/getMyAuthent`, {

        })
            .then( (response)=> {
                console.log(response,'身份证审核');
                let cardImg=response.data.cardImg;
                let bankCardJson=response.data.bankCardJson;
                let emergencyJson=response.data.emergencyJson;

                if(cardImg!=null){
                    let cardImgList=cardImg.split(',');
                    console.log(cardImgList);
                    this.setState({
                        cardImgList,

                    })
                }


                this.setState({
                    cardImg,
                    bankCardJson,emergencyJson
                })


            })
            .catch(function (error) {
                console.log(error);
            });

    }

    //实名认证
    realName = ()=>{

        axios.post(`/my/getMyAuthent`, {

        })
            .then( (response)=> {
                console.log(response,'身份证审核');



                if(response.data.cardImg!=null){
                    response.data.cardImg=response.data.cardImg.split(',');
                    this.setState({
                        cardImgList:response.data.cardImg
                    })
                }else {
                    response.data.cardImg = []
                }

                const { navigate } = this.props.navigation;
                navigate('RealName',{ user: response.data });


            })
            .catch(function (error) {
                console.log(error);
            });


    };

    _setModalVisible = (visible) => {
        this.setState({ modalVisible: visible });
    };

    //设置银行卡
    bankcardbtn = ()=>{
        const { navigate } = this.props.navigation;
        navigate('BankCard',{ user: "" });
    }


    //安全设置
    safeSetup = ()=>{
        const { navigate } = this.props.navigation;
        navigate('ChangePhoneNum',{ user: "" });
    }

    triedCard = ()=>{
        const { navigate } = this.props.navigation;
        navigate('EmergencyContact',{ user: "" });
    }


    //退出登陆
    logOut=()=>{

        storage.remove({
            key: 'tokenKey'
        });

        clearInterval(global.stopMsgTime);

        // storage.clearMapForKey('tokenKey');
        // storage.clearMapForKey('username');

        storage.remove({
            key: 'username'
        });

        const { navigate } = this.props.navigation;

        global.tokenKey='';

        navigate('Login',{ user: '' })
    };


    render(){
        //弹框
        let modalBackgroundStyle = {
            backgroundColor: this.state.transparent ? 'rgba(0, 0, 0, 0.5)' : 'red',
        };
        let innerContainerTransparentStyle = this.state.transparent
            ? { backgroundColor: '#fff', padding: 10 ,

                overflow:"hidden"}
            : null;

        const { modalName,} = this.state;


        return (

            <View style={{height:Dimensions.get("window").height,backgroundColor:"#fff",}}>

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

                                    <View  style={{flex:1,alignItems:'center'}}><Text style={{fontSize:20}}>{''}</Text></View>

                                    <TouchableHighlight underlayColor={"#fff"} onPress={this._setModalVisible.bind(this,false)}>
                                        <Image style={{height:30,width:30}} source={close}/>
                                    </TouchableHighlight>

                                </View>

                                <Txt/>


                            </View>
                        </View>
                    </View>
                </Modal>
                <ScrollView>
                    <View style={{flex:1,
                        ...Platform.select({
                            android:{
                                paddingBottom:100,
                            },
                            ios:{
                                paddingBottom:50,
                            }
                        }),
                        }}>


                        <View style={{}}>
                            <View style={{marginTop:10}}>

                                <TouchableHighlight onPress={this.realName} underlayColor="#f0f0f0" style={{borderBottomColor:"#f0f0f0",borderBottomWidth:2}}>
                                    <View style={{flexDirection:"row",backgroundColor:"#fff",padding:10,borderRadius:5,alignItems:"center"}}>
                                        <View style={styles.imgView}><Image style={styles.img} source={realName}/></View>
                                        <Text>实名认证</Text>
                                        <View  style={{flex:1,justifyContent:'flex-end'}}>
                                            <Text style={{textAlign:'right',color:"grey"}}>{this.state.cardImg!=null?'已认证':'未认证'}</Text>
                                        </View>

                                        <View>
                                            <Image style={styles.img2} source={right}/>
                                        </View>
                                    </View>
                                </TouchableHighlight>



                                <TouchableHighlight onPress={this.bankcardbtn} underlayColor="#f0f0f0" style={{borderBottomColor:"#f0f0f0",borderBottomWidth:2}}>
                                    <View style={{marginTop:1,flexDirection:"row",backgroundColor:"#fff",padding:10,borderRadius:5,alignItems:"center"}}>
                                        <View style={styles.imgView}><Image style={styles.img} source={bankcard}/></View>
                                        <Text>银行卡(退款用)</Text>
                                        <View  style={{flex:1,justifyContent:'flex-end'}}>
                                            <Text style={{textAlign:'right',color:"grey"}}>{this.state.bankCardJson==null?'未设置':'已设置'}</Text>
                                        </View>
                                        <View>
                                            <Image style={styles.img2} source={right}/>
                                        </View>
                                    </View>
                                </TouchableHighlight>



                                <TouchableHighlight onPress={this.safeSetup} underlayColor="#f0f0f0" style={{borderBottomColor:"#f0f0f0",borderBottomWidth:2}}>
                                    <View style={{marginTop:1,flexDirection:"row",backgroundColor:"#fff",padding:10,borderRadius:5,alignItems:"center"}}>
                                        <View style={styles.imgView}><Image style={styles.img} source={safeSetup}/></View>
                                        <Text>安全设置</Text>
                                        <View  style={{flex:1,justifyContent:'flex-end'}}>
                                        </View>
                                        <View>
                                            <Image style={styles.img2} source={right}/>
                                        </View>
                                    </View>
                                </TouchableHighlight>

                                <TouchableHighlight onPress={this.triedCard} underlayColor="#f0f0f0" style={{borderBottomColor:"#f0f0f0",borderBottomWidth:2}}>
                                    <View style={{marginTop:1,flexDirection:"row",backgroundColor:"#fff",padding:10,borderRadius:5,alignItems:"center"}}>
                                        <View style={styles.imgView}><Image style={styles.img} source={triedCard}/></View>
                                        <Text>紧急联系人</Text>
                                        <View  style={{flex:1,justifyContent:'flex-end'}}>
                                            <Text style={{textAlign:'right',color:"grey"}}>{this.state.emergencyJson?'已设置':'未设置'}</Text>
                                        </View>
                                        <View>
                                            <Image style={styles.img2} source={right}/>
                                        </View>
                                    </View>
                                </TouchableHighlight>

                            </View>


                            <View style={{alignItems:"center",marginTop:30}}>
                                <TouchableHighlight style={{width:"80%",alignItems:"center",marginTop:20,marginBottom:10,backgroundColor:"#f17e3a",padding:10,borderRadius:5}} onPress={this.logOut}>
                                    <Text style={{color:"#fff"}}>退出</Text>
                                </TouchableHighlight>
                            </View>


                            <View style={{alignItems:"center",marginTop:30}}>
                                <Text style={{color:"#ccc"}}><Text style={{textDecorationLine:"underline"}} onPress={()=>{this.setState({modalVisible:true})}}>《服务协议》</Text>｜<Text  style={{textDecorationLine:"underline"}} onPress={()=>{this.setState({modalVisible:true,modalName:"闪猪服务协议"})}}>《隐私政策》</Text></Text>
                            </View>

                        </View>

                    </View>
                </ScrollView>
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
        height:12,
        width:12
    },

    imgView:{
        marginRight:10
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,

    },
    innerContainer: {
        borderRadius: 10,
    },


});

