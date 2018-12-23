import React,{Component} from 'react';
import {View, Text, TouchableHighlight, Image, ScrollView, StyleSheet, Platform, CameraRoll,Alert} from 'react-native';
import Dimensions from 'Dimensions';

import axios from "../../axios";
import moment from "moment";
import right from './style/right.png'


export default class Mine extends React.Component {
    constructor(props) {
        super(props);
        this.state={
            data:[]
        }

    }

    componentWillMount(){

        axios.post(`/self/getRequisition`, {
        })
            .then( (response)=> {
                console.log(response);
                let data = response.data.data;

                this.setState({
                    data
                })

            })
            .catch(function (error) {
                console.log(error);
            });

    }



    clickBtn=(types,status,data)=>{
        console.log(types,'12wdsd');

        const { navigate } = this.props.navigation;

        switch (types){
            case '0':


                if(status==2){
                    navigate('RefundRentDetail',{ user:data})

                }else if(status==3){
                    console.log('data.status==3');
                    data.payOk = 2;
                    navigate('RefundRentDetail',{ user:data})
                }

                break;

            case '1':

                
                if(status==2){
                    navigate('ForRenewalDetail',{ user:data})

                }else if(status==3){
                    console.log('data.status==3');
                    data.payOk = 2;
                    navigate('ForRenewalDetail',{ user:data})
                }

                break;

            case '2':


                if(status==2){
                    navigate('SubletDetail',{ user:data})

                }else if(status==3){
                    console.log('data.status==3');
                    data.payOk = 2;
                    navigate('SubletDetail',{ user:data})
                }

                break;

            default:


                if(status==2){
                    navigate('ChangeDetail',{ user:data})

                }else if(status==3){
                    console.log('data.status==3');
                    data.payOk = 2;
                    navigate('ChangeDetail',{ user:data})
                }
        }


    };




    render(){


        return (



                <View style={{height:Dimensions.get("window").height,backgroundColor:"#fff"}}>

                    <ScrollView>

                        {this.state.data.length>0?

                            <View style={{paddingBottom:80}}>


                            {
                                this.state.data.map((item,index)=>

                                <View key={index}>



                                    <View
                                          style={{borderBottomWidth:2,borderBottomColor:"#f0f0f0",padding:10}}>

                                        <View style={{flexDirection:"row",paddingTop:10,paddingBottom:10}}>

                                            <View style={{flex:1,justifyContent:'center'}}>

                                                <Text style={{fontSize:18}}>{item.type==0?'退租':item.type==1?'续租':item.type==2?'转租':'换房'}</Text>
                                                <Text  style={{marginTop:5,color:"grey",}}>{moment(item.create_date).format('YYYY-MM-DD')}</Text>
                                            </View>

                                            <View style={{flex:1,alignItems:'center',justifyContent:'center'}}>
                                                <Text>{item.type==0?'预退日期':item.type==1?'续住':item.type==2?'转租申请':'换房日期'}</Text>
                                                <Text style={{marginTop:5}}>{item.type==0?item.about_date:item.type==1?item.lease+'个月':item.type==2?'':item.about_date}</Text>
                                            </View>

                                            <View style={{flex:1,alignItems:'center',justifyContent:'center'}}>


                                                {
                                                    item.status==4?
                                                        (<Text>拒绝原因</Text>):
                                                        (<Text>{(item.type==0)?'退租原因':item.type==3?'新房间号':''}</Text>)
                                                }

                                                {/*<Text>{(item.type==0)?'退租原因':item.type==3?'新房间号':item.status==4?'拒绝原因':''}</Text>*/}


                                                {
                                                    item.status==4?
                                                        (<Text style={{marginTop:5}}>{item.reason&&item.reason}</Text>):
                                                        (<Text style={{marginTop:5}}>{item.type==0?item.remark:item.type==3?item.new_room_no:''}</Text>)
                                                }


                                                {/*<Text style={{marginTop:5}}>{item.type==0?item.remark:item.type==3?item.new_room_no:item.status==4?(item.reason&&item.reason):''}</Text>*/}
                                            </View>


                                            {
                                                //（申请0、已确认1、生成账单2、已完成3、已拒绝4）
                                                item.status==2 || item.status==3?

                                                    <TouchableHighlight  underlayColor="#f0f0f0" onPress={()=>this.clickBtn(item.type,item.status,item)}  style={{flex:1,alignItems:'center',justifyContent:'center',}}>
                                                        <View style={{alignItems:'center',justifyContent:'center',flexDirection:"row"}}>
                                                            <Text>{item.status==0?'申请中':item.status==1?'已确认':item.status==2?'已生成账单':item.status==3?'已完成':item.status==4?'已拒绝':'已撤销'}</Text>
                                                            <View>
                                                                <Image style={{height:12,width:12}} source={right}/>
                                                            </View>
                                                        </View>
                                                    </TouchableHighlight>

                                                    :

                                                    <View style={{flex:1,alignItems:'center',justifyContent:'center'}}>
                                                        <Text>{item.status==0?'申请中':item.status==1?'已确认':item.status==2?'已生成账单':item.status==3?'已完成':item.status==4?'已拒绝':'已撤销'}</Text>

                                                    </View>
                                            }




                                        </View>

                                    </View>
                                </View>


                                )
                            }


                        </View>:
                            <View style={{alignItems:"center",marginTop:30}}>
                                <Text>
                                    暂无自助服务记录
                                </Text>
                            </View>}


                    </ScrollView>
                </View>



        )

    }
}



