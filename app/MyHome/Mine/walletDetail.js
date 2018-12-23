import React,{Component} from 'react';
import {
    View, Text, TouchableHighlight, Image, FlatList, StyleSheet, Platform, CameraRoll, Alert,
    DeviceEventEmitter
} from 'react-native';
import Dimensions from 'Dimensions';
import axios from "../../axios";
import {Toast} from "antd-mobile";
import moment from "moment/moment";
let a = Dimensions.get("window").height/Dimensions.get("window").width;

export default class Mine extends React.Component {
    constructor(props) {
        super(props);
        this.state={

            data:[],
            refreshing:false
        }

    }




    componentWillMount(){

        axios.post(`/pay/queryUserRecharge`, {})
            .then( (response)=> {
                console.log(response,'充值明细');


                if(response.data.code==0){
                    this.setState({
                        data:response.data.data
                    })
                }

            })
            .catch(function (error) {
                console.log(error);
            });

    }


    onRefresh=()=>{
        axios.post(`/pay/queryUserRecharge`, {})
            .then( (response)=> {
                console.log(response,'充值明细');


                if(response.data.code==0){
                    this.setState({
                        data:response.data.data
                    })
                }

            })
            .catch(function (error) {
                console.log(error);
            });
    };




    render(){

        let {data,refreshing} =this.state;


        return (



                <View style={{height:Dimensions.get("window").height,backgroundColor:"#fff"}}>


                    <View style={{
                        ...Platform.select({
                            ios: {
                                paddingBottom:70
                            },
                            android: {
                                paddingBottom:a>1.9?65:90
                            },
                        })
                    }}>
                        <FlatList
                            data={data}  //列表的渲染数据源
                            getItemLayout={(data, index) => ( {length: 80, offset: 80 * index, index} )}
                            initialNumToRender={10}  //首次渲染的条数
                            ListEmptyComponent={() => <Text>暂无数据</Text>}
                            onEndReached={this.onEndReached}  //列表被滚动到距离内容最底部不足onEndReachedThreshold的距离时调用。
                            onEndReachedThreshold={0.1} //定当距离内容最底部还有多远时触发onEndReached回调。注意此参数是一个比值而非像素单位。比如，0.5表示距离内容最底部的距离为当前列表可见长度的一半时触发。
                            onRefresh={this.onRefresh} //下拉刷新
                            refreshing={refreshing} //下拉刷新时候的正在加载的符号，设置为true显示，false隐藏。加载完成，需要设置为false
                            keyExtractor={(item,index)=>`${item.id}-${index}`}
                            renderItem={({item}) => (  //渲染列表的方式

                                <View>


                                    <View style={{flexDirection:"row",padding:10,borderColor:"#f0f0f0",borderWidth:1,borderRadius:5}}>
                                        <View style={{flex:4,alignItems:"center",justifyContent:"center"}}>
                                            <Text style={{fontSize:18,fontWeight:'bold'}}>{item.payType==0?'充值':'提现'}</Text>
                                            <Text style={{marginTop:5,color:"grey"}}>{moment(item.createTime).format('YYYY-MM-DD hh:mm:ss')}</Text>
                                        </View>

                                        <View style={{flex:4,alignItems:"center",justifyContent:"center"}}>
                                            <Text>{item.bankCode}</Text>
                                            <Text style={{marginTop:5}}>尾号:{item.cardLast}</Text>
                                        </View>

                                        <View style={{flex:4,alignItems:"center",justifyContent:"center"}}>
                                            <Text style={{fontSize:18,color:item.payType==0?'blue':'purple',fontWeight:"bold"}}>{item.payType==0?`+${item.orderAmount}`:`-${item.orderAmount}`}</Text>
                                        </View>

                                        <View style={{flex:3,alignItems:"center",justifyContent:"center"}}>
                                            <Text>{item.status==0?'未支付':item.status==1?'已支付':'失败'}</Text>
                                        </View>


                                    </View>

                                </View>)


                            }

                        />
                    </View>



                </View>



        )

    }
}

const styles = StyleSheet.create({


});



