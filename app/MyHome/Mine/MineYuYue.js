import React,{Component} from 'react';
import {
    View, Text, TouchableHighlight, ScrollView, Linking} from 'react-native';
import Dimensions from 'Dimensions';

import axios from "../../axios";
import moment from "moment";
import {Toast} from "antd-mobile/lib/index";


export default class Mine extends React.Component {
    constructor(props) {
        super(props);
        this.state={
            registerArray:[],
            orderArray:[],
        }

    }

    componentWillMount(){

        axios.post(`/my/getMyAppointment`, {
        })
            .then( (response)=> {
                console.log(response);
                let registerArray = response.data.registerArray;
                let orderArray = response.data.orderArray;
                this.setState({
                    registerArray,orderArray
                })


            })
            .catch(function (error) {
                console.log(error);
            });

    }




    render(){

        let {orderArray,registerArray} = this.state


        return (



                <View style={{height:Dimensions.get("window").height,backgroundColor:"#fff"}}>

                    <ScrollView>

                        {orderArray.length > 0 || registerArray.length > 0

                        ?(
                                <View style={{paddingBottom:80}}>


                                    {orderArray.map((item,index)=>


                                        <View key={index} style={{borderBottomWidth:1,borderBottomColor:"#999",padding:10}}>

                                            <View style={{flexDirection:"row",justifyContent:'space-between'}}>
                                                <Text style={{color:"grey",fontSize:16}}>{item.orderNo}</Text>
                                                <Text style={{color:"grey"}}>{item.orderState==0?'已取消':item.orderState==1?'已预定':item.orderState==2?'已排房':item.orderState==3?'已入住':'已退房'}</Text>
                                            </View>

                                            <View style={{flexDirection:"row",borderTopColor:"#f0f0f0",borderTopWidth:2,paddingTop:10,paddingBottom:10}}>

                                                <View style={{flex:1,justifyContent:"center"}}>
                                                    <Text  style={{color:"grey",fontSize:18}}>预定</Text>
                                                    <Text  style={{marginTop:5,color:"grey",fontSize:18}}>{moment(item.createTime).format("MM月DD日")}</Text>
                                                </View>

                                                <View style={{flex:2,alignItems:'center',justifyContent:"center"}}>
                                                    <Text>{moment(item.checkinDate).format("YYYY-MM-DD")}入住</Text>
                                                    <Text  style={{marginTop:5}}>{moment(item.checkoutDate).format("YYYY-MM-DD")}退房</Text>
                                                </View>

                                                <View style={{flex:1,alignItems:'center',justifyContent:"center"}}>
                                                    <Text>{item.roomTypeName}</Text>
                                                    <Text  style={{marginTop:5}}>{item.roomNo}</Text>
                                                </View>

                                                <View style={{alignItems:'center',justifyContent:"center"}}>
                                                    <Text style={{color:"blue",fontSize:18}}>{item.amount.toFixed(2)}</Text>
                                                </View>


                                            </View>

                                        </View>


                                    )}






                                    {registerArray.map((item,index)=>



                                        <View key={index} style={{borderBottomWidth:1,borderBottomColor:"#999",padding:10,}}>

                                            <View style={{flexDirection:"row",justifyContent:'space-between'}}>
                                                <Text  style={{color:"grey",fontSize:16}}></Text>
                                                <Text  style={{color:"grey"}}>{item.status==0?'未看房':item.status==1?'已看房':item.status==2?'已预订':'已入住'}</Text>
                                            </View>

                                            <View style={{paddingTop:10,paddingBottom:10,flexDirection:"row",borderTopColor:"#f0f0f0",borderTopWidth:2}}>

                                                <View style={{flex:1,justifyContent:"center"}}>
                                                    <Text  style={{color:"grey",fontSize:18}}>预约</Text>
                                                    <Text  style={{marginTop:5,color:"grey",fontSize:18}}>{moment(item.createTime).format("MM月DD日")}</Text>
                                                </View>

                                                <View style={{flex:2,alignItems:'center',justifyContent:"center"}}>
                                                    <Text>{moment(item.appointTime).format("YYYY-MM-DD")}看房</Text>
                                                </View>


                                                <TouchableHighlight onPress={()=>{if(item.hotelTel!=''){Linking.openURL(`tel:${item.hotelTel}`)}
                                                }} underlayColor="#f0f0f0"  style={{alignItems:"center",justifyContent:"center"}}>
                                                    <View style={{alignItems:"center",justifyContent:"center"}}>
                                                        <Text>管家电话</Text>
                                                        <Text  style={{marginTop:5}}>{item.hotelTel}</Text>
                                                    </View>
                                                </TouchableHighlight>



                                            </View>

                                        </View>


                                    )}

                                </View>
                            ):(
                                <View style={{alignItems:"center",marginTop:30}}>
                                    <Text>
                                        暂无我的预约记录
                                    </Text>
                                </View>
                            )


                        }


                    </ScrollView>
                </View>



        )

    }
}



