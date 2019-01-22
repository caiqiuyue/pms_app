import React,{Component} from 'react';
import {View,CameraRoll, TextInput,Text, TouchableHighlight, Image, ScrollView, StyleSheet,Platform} from 'react-native';

import axios from "../../axios";
import Dimensions from "Dimensions";
import {Picker,InputItem,Toast} from "antd-mobile";
import s1 from "../GoodSelect/style/234.png";
import bankCardAttribution from "./bank";
import MyTextInput from "../textInput";



const CustomChildren = props => {
    return (
        <TouchableHighlight underlayColor="transparent" onPress={props.onClick}>

            <View style={{flexDirection:"row",}}>
                <View style={{marginRight:30}}><Text>银行卡类型:</Text></View>
                <View><Text>{props.extra}</Text></View>
                <View style={{marginTop:3,marginLeft:10}}><Image style={{height:10,width:10}} source={s1}/></View>
            </View>
        </TouchableHighlight>
    )
};

export default class Mine extends React.Component {
    constructor(props) {
        super(props);
        this.state={
            value:null,
            bankCardJson:null,
            cardNumber:"",
            flag:false,
            username:"",
            cardType:"",
            
        }

    }


    componentWillMount(){

        // let {username, cardNumber,cardType} = this.state;

        axios.post(`/my/getMyAuthent`, {

        })
            .then( (response)=> {
                console.log(response,'身份证审核');
                let bankCardJson=response.data.bankCardJson;

                if(bankCardJson!=null){
                    bankCardJson=JSON.parse(bankCardJson);
                    console.log(bankCardJson,'bankCardJson');
                    console.log(bankCardJson.cardName,'bankCardJson.cardMsg');
                //    {"cardMsg ": "蔡秋月", cardCode: "6216 9101 1055 8605", bankName: "中国民生银行"}
                    this.setState({
                        username:bankCardJson.cardName,
                        cardNumber:bankCardJson.cardCode,
                        cardType:bankCardJson.bankName,
                    })
                }

                


            })
            .catch(function (error) {
                console.log(error);
            });

    }


    bankNumRep = (item) => {
        let str = item.replace(/\s/g,'').replace(/(.{4})/g,"$1 ");
        str=str.trim();
        return str
    }

    submitBtn=()=>{
        let {username, cardNumber,cardType,flag} = this.state;
        console.log(username,cardType);

        if(flag) {
             Toast.info('已提交，不可重复提交',1)

        }else {
            if(username==''||username==undefined){
                Toast.info('请输入姓名',1)

            }else if(cardNumber==''){
                Toast.info('请输入银行卡号',1)

            }else if(!cardType){
                Toast.info('未匹配到您的银行卡类型,请重新输入',1)
            }else{

                axios.post(`/my/refundBank`, {
                    bankName:cardType,
                    cardCode:cardNumber,
                    cardName:username,

                })
                    .then( (response)=> {
                        Toast.info(response.data.code==0?'成功提交':response.data.message,1);
                        console.log(response,'银行卡');
                        this.setState({
                            flag:response.data.code==0?true:false
                        })
                    })
                    .catch(function (error) {
                        console.log(error);
                    });
            }
        }



    };

    // setbankCardType = (data) => {
    //     this.setState({value:data})
    //     console.log(data);
    // };






    changeBankCard=(value)=>{
        let num = value.replace(/\s+/g,"");
        bankCardAttribution(num, this.getCardType);

        this.setState({
            cardNumber: value
        });

    };

    //获取银行卡类型
    getCardType = (value) => {
        if(value.validated) {
            this.setState({
                cardType: value.type
            });
        }else {
            this.setState({
                cardType: ''
            });
        }
    };



    render(){

        let{flag,value,cardNumber} = this.state;
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
                                    <Text>姓名:</Text>
                                </View>
                                <View style={styles.userItem}>
                                    <MyTextInput
                                        style={{padding: 0,}}
                                        placeholder={this.state.username?this.state.username:"请输入姓名"}
                                        placeholderTextColor={this.state.username?"#000":'#ccc'}
                                        // value={this.state.username}
                                        // keyboardType='numeric'
                                        underlineColorAndroid="transparent"
                                        onChangeText={(username) => this.setState({username})}>

                                    </MyTextInput>
                                </View>
                            </View>



                            <View style={styles.userMessage}>
                                <View>
                                    <Text>卡号:</Text>
                                </View>
                                <View style={styles.userItem}>
                                    <TextInput
                                        style={{padding: 0,}}
                                        placeholder={cardNumber}
                                        keyboardType='numeric'
                                        underlineColorAndroid="transparent"
                                        value={this.bankNumRep(cardNumber)}
                                        onChangeText={(cardNumber) => this.changeBankCard(cardNumber)}
                                    >
                                    </TextInput>
                                </View>
                            </View>


                            <View style={[styles.userMessage,{backgroundColor:'#f0f0f0'}]}>
                                <View>
                                    <Text>银行卡类型:</Text>
                                </View>
                                <View style={styles.userItem}>
                                    <TextInput
                                        editable={false}
                                        style={{padding: 0}}
                                        placeholder="银行卡类型"
                                        underlineColorAndroid="transparent"
                                        value={this.state.cardType}
                                        // onChangeText={(cardType) => this.setState({cardType})}

                                    >
                                    </TextInput>
                                    {/*<Text>{this.state.cardType}</Text>*/}
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
        paddingLeft:16,
        borderBottomWidth:2,
        borderBottomColor:"#f0f0f0",
        marginBottom:5
    },
    userItem:{
        flex:1,
        marginLeft:20

    }


});

