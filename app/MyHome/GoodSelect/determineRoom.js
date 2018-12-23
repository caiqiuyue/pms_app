import React,{Component} from 'react';
import {View, Text, Image, Platform, StyleSheet,TouchableHighlight} from 'react-native';
import { List, InputItem ,Checkbox,Flex,DatePicker,Toast} from 'antd-mobile';
import tiaoma from '../../MyHome/HomePage/style/tiaoma.jpg';
import tiaomaText from '../../MyHome/HomePage/style/tiaomaText.png';
import TextInput from '../../MyHome/textInput'
import Dimensions from 'Dimensions';
import axios from "../../axios";
//import axios from "axios";
const AgreeItem = Checkbox.AgreeItem;
import moment from 'moment'
import {ifIphoneX} from "react-native-iphone-x-helper/index";

let a = Dimensions.get("window").height/Dimensions.get("window").width

export default class GoodSelect extends React.Component {
    constructor(props) {
        super(props);
        this.state={
            roomname:"廊坊燕郊店",
            username:"",
            sex:"1",
            phone:"",
            agreeChecked: false,
            date:"",
            url:"",
            man:false,
            woman:false,
            data:{
                hotel_name:"龙泽店",
                price:"4500",
                room_no:"A102",
            }

        };

    }



    componentWillMount(){
        this.props.navigation.getParam = (name) => {
            let params = this.props.navigation && this.props.navigation.state && this.props.navigation.state.params || {};
            if(name) {
                return params[name];
            }
            return params;
        }
        // const {getParam} = this.props.navigation;
        // const data = getParam("user");


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


        //读取
        storage.load({
            key: 'roomData',
            // autoSync(默认为true)意味着在没有找到数据或数据过期时自动调用相应的sync方法
            autoSync: false
        }).then(ret => {
            this.setState({
            data:{
                    hotel_name:ret.hotelName,
                    price:ret.amount,
                    room_no:ret.room_no,
                    lease:ret.lease,

                }
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


        //读取
        storage.load({
            key: 'username',
            // autoSync(默认为true)意味着在没有找到数据或数据过期时自动调用相应的sync方法
            autoSync: false
        }).then(ret => {
            console.log(ret);

            if(ret.sex==0){
                this.setState({
                    man:false,
                    woman:true,
                })
            }else if(ret.sex == null || ret.sex == 1){
                this.setState({
                    man:true,
                    woman:false,
                })
            }

            this.setState({
                sex:ret.sex==null || ret.sex == 1 ? '1' :'0',
                // data
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


    agree = (e)=>{
        let checked = e.target.checked;
        this.setState({
            agreeChecked: checked
        })
    };


    selectMan = (e) => {
        let checked = e.target.checked;
        this.setState({
            man:checked,
            woman:!checked
        })

    };

    selectWoman = (e) => {
        let checked = e.target.checked;
        this.setState({
            woman:checked,
            man:!checked
        })
    };

    seeRoom=()=>{
        let{username,phone,man,sex,date,agreeChecked,url} = this.state;
        this.setState({
            sex:man ? "0":"1"
        });

        if(username.trim()==''){
            Toast.info("请输入姓名", 1);
            return
        }

        if(!agreeChecked){
            Toast.info("请同意协议", 1);
            return
        }

        if(date==''){
            Toast.info("请输入入住日期", 1);
            return
        }

        if(phone.trim()=='' && username.trim()=='' && !agreeChecked && date==''){
            Toast.info("请输入姓名和电话号码", 1);
        }else{

            let data = {};

            //读取
            storage.load({
                key: 'roomData',
                // autoSync(默认为true)意味着在没有找到数据或数据过期时自动调用相应的sync方法
                autoSync: false
            }).then(ret => {
                    data.hotelNo = ret.hotelNo;
                    data.roomNo = ret.roomNo;
                    data.lease = ret.lease;
                    data.amount = ret.amount;
                    data.policyId = ret.policyId;

                    data.name = username;
                    data.sex = sex;
                    data.phone = phone;
                    data.date = moment(date).format("YYYY-MM-DD");

                    let dataPay = {};
                    dataPay.dataPay = data;
                    dataPay.url = '/tenant/reservedRoomPay';
                    dataPay.price = ret.amount;
                    dataPay.introduce = '定金';


                dataPay.yiPay={
                    price:ret.amount,
                    orderType:1,
                    hotelNo:ret.hotelNo,
                    roomNo :ret.roomNo,
                    lease :ret.lease,
                    name :username,
                    sex :sex,
                    phone :phone,
                    date :moment(date).format("YYYY-MM-DD"),
                    policyId :ret.policyId
                }


                    const { navigate } = this.props.navigation;
                    navigate('Pay',{ user:dataPay });
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




            // axios.post(`/tenant/reservations`, {
            //     hotelNo:data.hotel_no,
            //     name:username,
            //     phone:phone,
            //     date:moment(date).format("YYYY-MM-DD hh:mm:ss")
            //
            // })
            //     .then(function (response) {
            //         console.log(response);
            //         Toast.info("预约成功", 2);
            //         const { navigate } = this.props.navigation;
            //         navigate('Home',{ user:"" });
            //
            //
            //     })
            //     .catch(function (error) {
            //         console.log(error);
            //     });
        }

    };

    render(){
        let {roomname,username,sex,phone,man,woman,data} = this.state;

        //选择日期
        const nowTimeStamp = Date.now();
        const now = new Date(nowTimeStamp);
        const utcNow = new Date(now.getTime() + (now.getTimezoneOffset() * 60000));
        let minDate = new Date(nowTimeStamp);
        const maxDate = new Date(nowTimeStamp + 1e7);
        if (minDate.getDate() !== maxDate.getDate()) {
            minDate = new Date(maxDate.getFullYear(), maxDate.getMonth(), maxDate.getDate());
        }


        function formatDate(date) {
            const pad = n => n < 10 ? `0${n}` : n;
            const dateStr = `${pad(date.getFullYear() + 1)}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
            return `${dateStr}>`;
        }

        return (
            <View style={styles.select}>
                {/*<View style={{flexDirection:"row",alignItems:"center",justifyContent:"center",backgroundColor:"#fff",padding:5}}>*/}
                    {/*<Image style={{height:20,width:20}}  source={tiaoma}/>*/}
                    {/*<Image style={{height:20,width:147}}  source={tiaomaText}/>*/}
                {/*</View>*/}

                <List>
                    <View>
                        <View style={styles.usermessage}>
                            <View>
                                <Text>门店</Text>
                            </View>
                            <View style={styles.userItem}>
                                <Text style={styles.textcolor}>{data.hotel_name}</Text>
                            </View>
                        </View>

                        {/*<View style={styles.usermessage}>*/}
                            {/*<View>*/}
                                {/*<Text>房型</Text>*/}
                            {/*</View>*/}
                            {/*<View style={styles.userItem}>*/}
                                {/*<Text style={styles.textcolor}>{data.room_type}({data.price}元/月)</Text>*/}
                            {/*</View>*/}
                        {/*</View>*/}

                        <View style={styles.usermessage}>
                            <View>
                                <Text>房间</Text>
                            </View>
                            <View style={styles.userItem}>
                                <Text style={styles.textcolor}>{data.room_no}</Text>
                            </View>
                        </View>

                        <View style={styles.usermessage}>
                            <View>
                                <Text>定金</Text>
                            </View>
                            <View style={styles.userItem}>
                                <Text style={styles.textcolor}>{data.price}</Text>
                            </View>
                        </View>

                        <View style={styles.usermessage}>
                            <View>
                                <Text>租期</Text>
                            </View>
                            <View style={styles.userItem}>
                                <Text style={styles.textcolor}>{data.lease=='3' ? '三个月':data.lease=='6' ? '半年' : '一年'}</Text>
                            </View>
                        </View>

                        <View style={styles.usermessage}>
                            <View>
                                <Text>姓名</Text>
                            </View>
                            <View style={styles.userItem}>
                                <TextInput
                                    style={{padding: 0,underlineColor:"#fff"}}
                                    placeholder="请输入姓名"
                                    underlineColorAndroid="transparent"
                                    onChangeText={(username) => this.setState({username})}>
                                </TextInput>
                            </View>
                        </View>

                        <View style={styles.usermessage}>
                            <View>
                                <Text>性别</Text>
                            </View>
                            <View style={{flex:1}}>
                                <Flex style={styles.sex}>
                                    <Flex.Item>
                                        <AgreeItem data-seed="logId" onChange={this.selectMan} checked={man}>
                                            <Text>男</Text>
                                        </AgreeItem>
                                    </Flex.Item>
                                    <Flex.Item>
                                        <AgreeItem data-seed="logId" onChange={this.selectWoman} checked={woman}>
                                            <Text>女</Text>
                                        </AgreeItem>

                                    </Flex.Item>
                                </Flex>

                            </View>
                        </View>

                        <View style={styles.usermessage}>
                            <View>
                                <Text>电话</Text>
                            </View>
                            <View style={styles.userItem}>
                                <TextInput
                                    style={{padding: 0,underlineColor:"#fff"}}
                                    maxLength={11}
                                    type="number"
                                    underlineColorAndroid="transparent"
                                    placeholder="请输入电话号码"
                                    onChangeText={(phone) => this.setState({phone})}>

                                </TextInput>
                            </View>
                        </View>

                        <View>

                                <DatePicker
                                    value={this.state.date}
                                    extra="请输入入住日期>"
                                    mode="date"
                                    format={val => formatDate(val)}
                                    minDate={minDate}
                                    onChange={date => this.setState({date})}
                                >
                                    <List.Item><Text style={{fontSize:14}}>日期:</Text></List.Item>
                                </DatePicker>

                        </View>
                    </View>
                </List>

                <View style={{backgroundColor:"#f0f0f0",paddingTop:5,paddingBottom:5}}>
                    <Flex>
                        <Flex.Item>
                            <AgreeItem data-seed="logId" onChange={this.agree} checked={this.state.agreeChecked}>
                                <View style={{flexDirection:"row"}}>
                                    <Text>同意</Text>
                                    <TouchableHighlight underlayColor="transparent"><Text style={{color:"#4ca1e4"}}>《预定协议》</Text></TouchableHighlight>
                                    <Text>条款</Text>
                                </View>

                            </AgreeItem>
                        </Flex.Item>
                    </Flex>
                </View>


                <View style={{alignItems:"center" ,marginTop:20}}>
                    <Text style={{color:"red",fontSize:18}}>
                        确定预定留房后定金不可退
                    </Text>
                </View>


                <View style={styles.userItems}>
                    <View style={{padding:10,flexDirection:"row",justifyContent:"space-around",flex:1,borderTopColor:"grey",borderTopWidth:1}}>
                        <Text>共计:</Text>
                        <Text style={{color:"#f1803a"}}>{data.price}元</Text>
                    </View>
                    <TouchableHighlight onPress={this.seeRoom} underlayColor="transparent" style={{padding:10,backgroundColor:"#f1803a",flex:1}}>
                        <Text style={{color:"#fff",paddingLeft:50}}>确认提交</Text>
                    </TouchableHighlight>
                </View>
            </View>
        )

    }
}


const styles = StyleSheet.create({

    userItems:{
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
            bottom:105,
        }, {

        })

    },

    sex:{
        flexDirection:"row",
        marginLeft:30

    },

    textcolor:{
        color:"grey"
    },

    select:{
        backgroundColor:"#fff",
        height: Dimensions.get("window").height
    }

    ,usermessage:{
        flexDirection:"row",
        alignItems:"center",
        padding:10,
        paddingLeft:16,
        borderBottomWidth:1,
        borderBottomColor:"#f0f0f0"
    },
    userItem:{
        flex:1,
        ...Platform.select({
            ios: {
                paddingLeft:"25%",
            },
            android: {
                paddingLeft:"35%"
            },
        })

    }


});