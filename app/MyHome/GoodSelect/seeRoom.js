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



export default class GoodSelect extends React.Component {
    constructor(props) {
        super(props);
        this.state={
            roomname:"廊坊燕郊店",
            username:"",
            sex:"1",
            phone:"",
            date:"",
            man:false,
            woman:false,
            data:"",
            flag:false,

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
        const {getParam} = this.props.navigation;
        const data = getParam("user");

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
            }else{
                this.setState({
                    man:true,
                    woman:false,
                })
            }

            this.setState({
                sex:ret.sex,
                data
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

        let{username,phone,man,sex,date,data} = this.state;
        this.setState({
            sex:man ? "0":"1"
        });


        if(username.trim()==''){
            Toast.info("请输入姓名", 1);
            return
        }
        if(phone.replace(/\s/g, '').length < 11){
            Toast.info(phone.length > 0 ? '请输入正确的手机号码' : '手机号不能为空', 1);
            return
        }

        if(phone.trim()=='' && username.trim()==''){
            Toast.info("请输入姓名和电话号码", 1);
        }else{

            if(this.state.flag){
                Toast.info('已提交申请，不可重复提交',1)
            }else{
                axios.post(`/tenant/reservations`, {
                    hotelNo:data.hotel_no,
                    name:username,
                    phone:phone,
                    date:moment(date).format("YYYY-MM-DD HH:mm:ss")

                })
                    .then( (response)=> {
                        console.log(response);
                        Toast.info("预约成功", 2);
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
        let {flag,username,sex,phone,man,woman,data} = this.state;

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
            const timeStr = `${pad(date.getHours())}:00`;
            return `${dateStr} ${timeStr}>`;
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
                                <Text>{data.hotel_name}</Text>
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
                                    extra="请输入日期>"
                                    format={val => formatDate(val)}
                                    minDate={minDate}
                                    onChange={date => this.setState({date})}
                                >
                                    <List.Item><Text style={{fontSize:14}}>日期:</Text></List.Item>
                                </DatePicker>

                        </View>
                    </View>
                </List>

                <View style={{alignItems:"center"}}>

                    <TouchableHighlight onPress={this.seeRoom} underlayColor="#fff" style={{marginTop:50,backgroundColor:flag?'#fff':"#f8bd49",borderColor:flag?'#000':"#fff",borderWidth:1,borderRadius:30,alignItems:"center",width:"80%",padding:15}}>
                        <Text style={{color:flag?'grey':"#fff"}}>预约看房</Text>
                    </TouchableHighlight>

                </View>


            </View>
        )

    }
}


const styles = StyleSheet.create({

    sex:{
        flexDirection:"row",
        marginLeft:30

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