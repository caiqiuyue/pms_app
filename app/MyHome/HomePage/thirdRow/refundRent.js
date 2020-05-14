import React, { Component } from 'react';
import {
    TouchableHighlight,
    StyleSheet,
    Text,
    Alert,
    Picker,
    View,
    Image,
    TextInput,

} from 'react-native';




import {WhiteSpace,DatePicker,List,Toast} from 'antd-mobile';
import axios from '../../../axios'
import Dimensions from 'Dimensions'
import moment from "moment";

import RefundRentDetail from './refundRentDetail'

export default class Clean extends Component {

    constructor(props) {
        super(props);
        this.state = {
            date:"",
            text:"",
            keeping:"",
            evaluationText:"",
            code:3,
            data:{},
            flag:false,
            status:'11',

        };
    }





    componentWillMount() {
        this.props.navigation.getParam = (name) => {
            let params = this.props.navigation && this.props.navigation.state && this.props.navigation.state.params || {};
            if(name) {
                return params[name];
            }
            return params;
        }
        const {getParam} = this.props.navigation;
        let datas = getParam("user")
        const data = datas.data;

        console.log(11111);
        this.setState({
            status:data.status === "0" ? 0 : data.status == 1 ? 1
                : data.status == 3 ? 3:data.status == 4 ? 4 : 11,
            data,keeping:datas.keeping
        })


    }


    submitBtn = ()=> {


        // const { navigate } = this.props.navigation;
        // navigate('RefundRentDetail',{ user:"" });
        let {date,text,flag} = this.state;

        console.log(flag,'111111111');
        if(date==''){
            Toast.info('请选择退租日期',1);
            return
        }

        if(text.trim()==''){
            Toast.info('请填写退租原因',1);
            return
        }else{

            if(flag){
                Toast.info('已提交申请，不可重复申请',1)
            }else{
                axios.post(`/self/submitRequisition`, {
                    type: "0",
                    remark:text,
                    aboutDate:moment(date).format("YYYY-MM-DD")
                })
                    .then((response)=> {
                        console.log(response);

                        this.setState({
                            flag:true
                        })

                        Toast.info('申请成功，等待生成账单',1);

                    })
                    .catch(function (error) {
                        console.log(error);
                    });
            }

        }
    };

    render() {

        //选择日期
        const nowTimeStamp = Date.now();
        const now = new Date(nowTimeStamp);
        const utcNow = new Date(now.getTime() + (now.getTimezoneOffset() * 60000));
        let minDate = new Date(nowTimeStamp);

        let maxDate = new Date(this.state.data.checkout_date);
        //const maxDate = this.state.data.checkout_date;
        // if (minDate.getDate() !== maxDate.getDate()) {
        //     minDate = new Date(maxDate.getFullYear(), maxDate.getMonth(), maxDate.getDate());
        // }

        function formatDate(date) {
            const pad = n => n < 10 ? `0${n}` : n;
            const dateStr = `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
            const timeStr = `${pad(date.getHours())}:${pad(date.getMinutes())}`;
            return `${dateStr}>`;
        }


        let {keeping,data,status,dataObj,flag}  = this.state;

        return (


            <View>
            {/*//status        状态（申请0、已确认1、生成账单2、已完成3、已拒绝4）*/}
        {
            status==0 ?
                (<View style={{alignItems:"center",marginTop:30}}>
                    <Text>
                        已提交申请，正在等待管家确认
                    </Text>
                </View>) :
                status==1 ?
                    (<View style={{alignItems:"center",marginTop:30}}>
                        <Text>
                            已确认申请，正在等待生成账单
                        </Text>
                    </View>):
                    // status==3 ?
                    //     (<View style={{alignItems:"center",marginTop:30}}>
                    //         <Text>
                    //             已完成
                    //         </Text>
                    //     </View>):
                        // status==4 ?
                        //     (<View style={{alignItems:"center",marginTop:30}}>
                        //         <Text>
                        //             已拒绝
                        //         </Text>
                        //     </View>):
                            <View style={{padding:10, alignItems: 'center',backgroundColor:"#fff",height: Dimensions.get('window').height}}>
                                <View>
                                    <View>
                                        <View style={{marginLeft:15}}>
                                            <Text style={{color:"#000"}}>退租政策:</Text>
                                            <Text style={{color:"grey"}}>{keeping}</Text>
                                            <WhiteSpace size="lg"/>
                                            <Text>正常退租日期：{data.checkout_date ? moment(data.checkout_date).format('YYYY-MM-DD') : '--'}</Text>

                                        </View>
                                        <View>
                                            <DatePicker
                                                format={val => formatDate(val)}
                                                value={this.state.date}
                                                mode="date"
                                                title="选择退租日期"
                                                extra="请选择退租日期>"
                                                minDate={minDate}
                                                maxDate={maxDate}
                                                onChange={date => this.setState({date})}
                                            >
                                                <List.Item><Text style={{color:"#000"}}>退租日期:</Text></List.Item>
                                            </DatePicker>
                                        </View>
                                        <WhiteSpace size="lg"/>
                                        <View  style={{marginLeft:15}}>
                                            <View style={{flexDirection:"row"}}>
                                                <Text style={{color:"#000",marginRight:5}}>退租原因:</Text>
                                                <TextInput
                                                    multiline={false}
                                                    underlineColorAndroid="transparent"
                                                    style={{height: 90,width:"60%",
                                                        borderColor:"grey",borderWidth:1,padding:0,
                                                        borderRadius:5,textAlign:"center"}}
                                                    placeholder="请填写退租原因"
                                                    onChangeText={(text) => this.setState({text})}
                                                />

                                            </View>
                                        </View>

                                        <WhiteSpace size="lg"/>



                                        <View style={{alignItems:"center"}}>
                                            <TouchableHighlight underlayColor={flag ? "#fff" : "#367d80"} style={{padding:10,
                                                borderWidth:1,borderColor:"#fff",width:100,backgroundColor:flag ? "#fff" : "#f17e3a",
                                                borderRadius:10}} onPress={this.submitBtn }>
                                                <Text

                                                    style={{fontSize:16,textAlign:"center",color:flag ? "#f0f0f0":"#fff"}}>
                                                    申请退租
                                                </Text>
                                            </TouchableHighlight>
                                        </View>

                                    </View>
                                </View>
                            </View>
        }



    </View>




        );
    }

}

