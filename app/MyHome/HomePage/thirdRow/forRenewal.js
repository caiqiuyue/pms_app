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
import moment from "moment/moment";

export default class Clean extends Component {

    constructor(props) {
        super(props);
        this.state = {
            date:"",
            text:"",
            evaluationText:"",
            code:3,
            status:'',
            data:"",
            lease:"",
            flag:false,
            monthData:[
                {
                    item:"1个月",
                    flag:false,
                    lease:"1",
                },
                {
                    item:"2个月",
                    flag:false,
                    lease:"2",
                },
                {
                    item:"3个月",
                    flag:false,
                    lease:"3",
                },
                {
                    item:"4个月",
                    flag:false,
                    lease:"4",
                },
                {
                    item:"5个月",
                    flag:false,
                    lease:"5",
                },
                {
                    item:"半年",
                    flag:false,
                    lease:"6",
                },
                {
                    item:"7个月",
                    flag:false,
                    lease:"7",
                },
                {
                    item:"8个月",
                    flag:false,
                    lease:"8",
                },{
                    item:"9个月",
                    flag:false,
                    lease:"9",
                },{
                    item:"10个月",
                    flag:false,
                    lease:"10",
                },
                {
                    item:"11个月",
                    flag:false,
                    lease:"11",
                },
                {
                    item:"一年",
                    flag:true,
                    lease:"12",
                },


            ]

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
        const data = getParam("user");

        console.log(11111);
        this.setState({
            status:data.status === "0" ? 0 : data.status == 1 ? 1
                : data.status == 3 ? 3:data.status == 4 ? 4 : 11,
            data
        })

    }


    submitBtn = ()=> {
        let {lease,flag} = this.state;

        console.log(flag,'111111111');

        if(lease==''){
            Toast.info("请选择租期",1)
        }else{


            if(flag){
                Toast.info('已提交申请，不可重复申请',1)
            }else{
                axios.post(`/self/submitRequisition`, {
                    type: "1",
                    lease:lease
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

    //选择续租租期
    chooseMonth = (item)=> {
        let {monthData} = this.state;

        let month = monthData.map((_item,index)=>{
            if(item.item==_item.item){
                _item.flag = true
            }else {
                _item.flag = false
            }

            return _item
        })

        this.setState({
            monthData:month,
            lease:item.lease
        })
    };

    render() {

        let {status,flag} = this.state;

        return (

            <View>

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
                                                    <Text>政策：</Text>
                                                    <Text style={{color:"grey"}}>1.续租以公寓最新的租金执行</Text>
                                                    <Text style={{color:"grey"}}>2.续租在原有租期进行延续</Text>
                                                    <WhiteSpace size="lg"/>

                                                    <Text>续租：</Text>
                                                    <View style={{flexDirection:"row",flexWrap:"wrap"}}>
                                                        {this.state.monthData.map((item,index)=>
                                                            <TouchableHighlight onPress={()=>this.chooseMonth(item)} underlayColor="transparent"
                                                                style={{borderRadius:5,width:"23%",alignItems:"center",padding:5,paddingTop:10,paddingBottom:10,marginRight:5,
                                                                borderWidth:1,borderColor:item.flag?"#fff":"#f0f0f0",backgroundColor:item.flag?"#f1853b":"#fff",marginTop:10}} key={index}>

                                                                <Text style={{color:item.flag?"#fff":"#000",}}>{item.item}</Text>

                                                            </TouchableHighlight>
                                                        )}
                                                        <View style={{width:"24%"}}>

                                                        </View>
                                                    </View>
                                                    <WhiteSpace size="lg"/>
                                                    <View>
                                                        <Text>请管家确认续租账单</Text>
                                                    </View>

                                                    <WhiteSpace size="lg"/>


                                                    <View style={{alignItems:"center"}}>
                                                        <TouchableHighlight underlayColor={flag ? "#fff" : "#367d80"} style={{padding:10,
                                                            borderWidth:1,borderColor:"#fff",width:100,backgroundColor:flag ? "#fff" : "#f17e3a",
                                                            borderRadius:10}} onPress={this.submitBtn }>
                                                            <Text

                                                                style={{fontSize:16,textAlign:"center",color:flag ? "#f0f0f0":"#fff"}}>
                                                                申请续租
                                                            </Text>
                                                        </TouchableHighlight>
                                                    </View>

                                                </View>
                                            </View>
                                        </View>
                    }



                </View>


            </View>
        );
    }

}

