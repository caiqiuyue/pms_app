import React,{Component} from 'react';
import {View,CameraRoll, Text, TouchableHighlight, Image, ScrollView, StyleSheet,Platform} from 'react-native';
//import { WhiteSpace ,Button} from 'antd-mobile';
import setIcon from './style/setIcon.png'
import myContract from './style/myContract.png'
import yiy from './style/yiy.png'
import fhg from './style/fhg.png'
import ad from './style/ad.png'
import sffd from './style/sffd.png'
import yyf from './style/yyf.png'
import jk from './style/jk.png'
import eg from './style/eg.png'
import syr from './style/syr.png'
import male from './style/man.png'
import female from './style/woman.png'
import right from './style/right.png'
import wallet from './style/wallet.png'
import coupons from './style/coupons.png'
import axios from "../../axios";

import {Toast} from "antd-mobile/lib/index";

import Dimensions from "Dimensions";


export default class Mine extends React.Component {
    constructor(props) {
        super(props);
        this.state={
            username:"",
            hotelName:'',
            roomNo:'',
            sex:null,
            checkinNo:"",
            totalPrice:0
        }

    }




    componentWillMount(){

        //读取
        storage.load({
            key: 'username',
            // autoSync(默认为true)意味着在没有找到数据或数据过期时自动调用相应的sync方法
            autoSync: false
        }).then(ret => {

            console.log(ret,"mine");

            this.setState({
                username:ret.name,
                sex:ret.sex,
                hotelName:ret.hotelName,
                roomNo:ret.roomNo,
                checkinNo:ret.checkinNo
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



        axios.post(`/my/getMyBalance`, {
        })
            .then( (response)=> {
                console.log(response);
                if(response.data.totalPrice){
                    let totalPrice = response.data.totalPrice
                    this.setState({
                        totalPrice
                    })
                }


            })
            .catch(function (error) {
                console.log(error);
            });


    }






    //账单
    bill=()=>{
        const { navigate } = this.props.navigation;
        navigate('Bill',{ user: "" });

    };

    //入住需知
    liveKnow=()=>{
        const { navigate } = this.props.navigation;
        navigate('LiveKnow',{ user: "" });

    };



    //查看合同
    contract=()=>{

        if(this.state.checkinNo==''){
            Toast.info("未签约用户暂不支持此功能",1)
        }else{
            const { navigate } = this.props.navigation;
            navigate('Contract',{ user: "" });
        }

    };

    //余额
    yu_e = ()=> {
        const { navigate } = this.props.navigation;
        if(this.state.checkinNo==''){
            Toast.info("未签约用户暂不支持此功能",1)
        }else{


            navigate('YuE',{ user: "" });
        }
    };


    //我的预约
    yuyue = ()=> {
        const { navigate } = this.props.navigation;
        navigate('MineYuYue',{ user: "" });
    };

    //生活服务
    lifeService = ()=> {

        if(this.state.checkinNo==''){
            Toast.info("未签约用户暂不支持此功能",1)
        }else{

            const { navigate } = this.props.navigation;
            navigate('LifeService',{ user: "" });

        }
    };

    //自助服务
    selfService = ()=> {

        if(this.state.checkinNo==''){
            Toast.info("未签约用户暂不支持此功能",1)
        }else{
            const { navigate } = this.props.navigation;
            navigate('SelfService',{ user: "" });
        }



    };

    //建议反馈
    feedbackSuggestions = ()=> {
        const { navigate } = this.props.navigation;
        navigate('FeedbackSuggestions',{ user: "" });
    };

    //信用
    credit = ()=> {
        //const { navigate } = this.props.navigation;
        //navigate('FeedbackSuggestions',{ user: "" });
        Toast.info('暂不支持此功能',1)
    };

    setup = ()=> {

        const { navigate } = this.props.navigation;
        navigate('Setup',{ user: "" });
    };


    //钱包
    wallet=()=>{
        const { navigate } = this.props.navigation;
        navigate('Wallet',{ user: "" });
    }

    //优惠券
    coupons=()=>{
        const { navigate } = this.props.navigation;
        navigate('Coupons',{ user: "" });
    }



    render(){

        let {username,sex,roomNo,hotelName,checkinNo,totalPrice} = this.state;

        return (

            <View style={{height:Dimensions.get("window").height}}>
                <View style={{alignItems:"center",backgroundColor:"#f17e3a",height:60,justifyContent:"center"}}>
                    <View style={{alignItems:"center",marginTop:8,}}>
                        {/*<View>*/}
                            {/*<Image style={{height:16,width:16}} source={left}/>*/}
                        {/*</View>*/}
                        <Text style={{color:"#fff",fontSize:16,}}>我的</Text>
                        {/*<View>*/}
                            {/*<Image style={{height:16,width:16}} source={rightWhite}/>*/}
                        {/*</View>*/}
                    </View>

                </View>

                <View style={{backgroundColor:"#f17e3a"}}>


                    <View style={{paddingBottom:5,flexDirection:"row",}}>

                        <View style={{marginLeft:10,justifyContent:"center"}}>
                            <View style={{height:70,width:70,borderRadius:35,overflow:"hidden",alignItems:"center"}}>
                                <Image style={{height:70,width:70,}} source={sex==0 ? female : male}/>
                            </View>
                        </View>

                        <View style={{flex:2,marginLeft:10,justifyContent:"center"}}>


                            <View  style={{flexDirection:"row"}}>
                                <Text style={{color:"#fff",marginRight:50}}>{checkinNo=='' && username==null?'游客':username}</Text>
                                <Text style={{color:"#fff"}}>{checkinNo==''?'':'房间号：'}{roomNo}</Text>
                            </View>
                            <View style={{marginTop:10}}>
                                <Text style={{color:"#fff"}}>{hotelName}</Text>
                            </View>
                        </View>

                        <TouchableHighlight onPress={this.setup} underlayColor="transparent" style={{flexDirection:"row-reverse"}}>
                            <View   style={{paddingRight:10}}>
                                <Image style={{height:20,width:20}} source={setIcon}/>
                            </View>
                        </TouchableHighlight>

                    </View>
                </View>

                <ScrollView>
                    <View style={{flex:1,backgroundColor:"#fff",
                        ...Platform.select({
                            android:{
                                paddingBottom:100,
                            },
                            ios:{
                                paddingBottom:50,
                            }
                        }),
                        }}>




                        <View>
                            <View style={{}}>

                                <TouchableHighlight onPress={this.contract} underlayColor="#f0f0f0">
                                    <View style={styles.aa}>
                                        <View style={styles.imgView}><Image style={styles.img} source={myContract}/></View>
                                        <Text>我的合同</Text>
                                        <View style={{flex:1}}></View>
                                        <View>
                                            <Image style={styles.img2} source={right}/>
                                        </View>
                                    </View>
                                </TouchableHighlight>



                                <TouchableHighlight onPress={this.yuyue} underlayColor="#f0f0f0">
                                    <View style={styles.aa}>
                                        <View style={styles.imgView}><Image style={styles.img3} source={yiy}/></View>
                                        <Text>我的预约</Text>
                                        <View style={{flex:1}}></View>
                                        <View>
                                            <Image style={styles.img2} source={right}/>
                                        </View>
                                    </View>
                                </TouchableHighlight>



                                <TouchableHighlight onPress={this.liveKnow}>
                                    <View style={styles.aa}>
                                        <View style={styles.imgView}><Image style={styles.img} source={fhg}/></View>
                                        <Text>入住需知</Text>
                                        <View style={{flex:1}}></View>
                                        <View>
                                            <Image style={styles.img2} source={right}/>
                                        </View>
                                    </View>
                                </TouchableHighlight>

                            </View>

                            <View style={{borderTopWidth:10,borderTopColor:'#f0f0f0'}}>


                                <TouchableHighlight onPress={this.wallet}>
                                    <View style={styles.aa}>
                                        <View style={styles.imgView}><Image style={styles.img} source={wallet}/></View>
                                        <Text>钱包</Text>
                                        <View style={{flex:1}}></View>
                                        <View>
                                            <Image style={styles.img2} source={right}/>
                                        </View>
                                    </View>
                                </TouchableHighlight>

                                <TouchableHighlight onPress={this.yu_e}>
                                    <View style={styles.aa}>
                                        <View style={styles.imgView}><Image style={styles.img} source={ad}/></View>
                                        <Text>合同余额</Text>
                                        <View  style={{flex:1,justifyContent:'flex-end'}}><Text style={{textAlign:'right',color:"#ec833a"}}>{totalPrice.toFixed(2)}元</Text></View>

                                        <View>
                                            <Image style={styles.img2} source={right}/>
                                        </View>
                                    </View>
                                </TouchableHighlight>

                                <TouchableHighlight underlayColor="#f0f0f0" onPress={this.coupons}>
                                    <View style={styles.aa}>
                                        <View style={styles.imgView}><Image style={styles.img} source={coupons}/></View>
                                        <Text>优惠券</Text>
                                        <View style={{flex:1}}></View>
                                        <View>
                                            <Image style={styles.img2} source={right}/>
                                        </View>
                                    </View>
                                </TouchableHighlight>

                                <TouchableHighlight underlayColor="#f0f0f0" onPress={this.credit}>
                                    <View style={styles.aa}>
                                        <View style={styles.imgView}><Image style={styles.img3} source={sffd}/></View>
                                        <Text>信用</Text>
                                        <View style={{flex:1}}></View>
                                        <View>
                                            <Image style={styles.img2} source={right}/>
                                        </View>
                                    </View>
                                </TouchableHighlight>


                                <TouchableHighlight underlayColor="#f0f0f0" onPress={this.bill}>
                                    <View style={styles.aa}>
                                        <View style={styles.imgView}><Image style={styles.img} source={yyf}/></View>
                                        <Text>账单</Text>
                                        <View style={{flex:1}}></View>
                                        <View>
                                            <Image style={styles.img2} source={right}/>
                                        </View>
                                    </View>
                                </TouchableHighlight>

                            </View>


                            <View  style={{borderTopWidth:10,borderTopColor:'#f0f0f0'}}>


                                <TouchableHighlight onPress={this.lifeService}>
                                    <View style={styles.aa}>
                                        <View style={styles.imgView}><Image style={styles.img} source={jk}/></View>
                                        <Text>生活服务</Text>
                                        <View style={{flex:1}}></View>
                                        <View>
                                            <Image style={styles.img2} source={right}/>
                                        </View>
                                    </View>
                                </TouchableHighlight>


                                <TouchableHighlight onPress={this.selfService}>
                                    <View style={styles.aa}>
                                        <View style={styles.imgView}><Image style={styles.img3} source={eg}/></View>
                                        <Text>自助服务</Text>
                                        <View style={{flex:1}}></View>
                                        <View>
                                            <Image style={styles.img2} source={right}/>
                                        </View>
                                    </View>
                                </TouchableHighlight>

                                <TouchableHighlight onPress={this.feedbackSuggestions}>
                                    <View style={styles.aa}>
                                        <View style={styles.imgView}><Image style={styles.img} source={syr}/></View>
                                        <Text>建议反馈</Text>
                                        <View style={{flex:1}}></View>
                                        <View>
                                            <Image style={styles.img2} source={right}/>
                                        </View>
                                    </View>
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
    img: {
        height:16,
        width:16,
    },

    img2: {
        height:12,
        width:12
    },

    img3: {
        height:20,
        width:20
    },

    imgView:{
        marginRight:10,

        width:21,
        alignItems:'center'

    },
    
    aa:{
        borderColor:"#f0f0f0",
        borderWidth:1,
        flexDirection:"row",
        backgroundColor:"#fff",
        padding:10,paddingTop:15,
        paddingBottom:15,
        // borderRadius:10,
        alignItems:"center"
    }
    

});

