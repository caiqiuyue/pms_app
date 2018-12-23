import React, { Component } from 'react';
import {
    TouchableHighlight,
    StyleSheet,
    Text,
    FlatList,
    View,
    Image

} from 'react-native';

import {WhiteSpace,List,Toast} from 'antd-mobile';
import axios from "../../../axios";

export default class RepairHistory extends Component {

    constructor(props) {
        super(props);
        this.state = {
            refreshing: false,
            dataSource: [],
            
        };
    }


    componentWillMount() {

        axios.post(`/tenant/getAppointmentHistory`, {
            type:"0",
            status:"4"
        })
            .then( (response)=> {

                let historyData =  response.data.data;
                this.setState({
                    dataSource: historyData

                })



            })
            .catch(function (error) {
                console.log(error);
            });



    }


        render() {

        let {dataSource} = this.state;

            return (

                <View>

                {
                    dataSource.length > 0 ? (
                        <View>
                            <FlatList
                                data={this.state.dataSource}  //列表的渲染数据源
                                getItemLayout={(data, index) => ( {length: 80, offset: 80 * index, index} )}
                                initialNumToRender={7}  //首次渲染的条数
                                onEndReached={this.onEndReached}  //列表被滚动到距离内容最底部不足onEndReachedThreshold的距离时调用。
                                onEndReachedThreshold={0.1} //定当距离内容最底部还有多远时触发onEndReached回调。注意此参数是一个比值而非像素单位。比如，0.5表示距离内容最底部的距离为当前列表可见长度的一半时触发。
                                keyExtractor={(item,index)=>`${index}`}
                                renderItem={({item}) => (  //渲染列表的方式

                                    <View style={{backgroundColor: "#fff"}}>
                                <WhiteSpace size="xl"/>
                                <View>
                                    <View
                                        style={{
                                            flexDirection: "row", justifyContent: "space-around",
                                            alignItems: 'center', backgroundColor: "#d9d9d9", borderRadius: 10,
                                            fontSize: 16, padding: 10
                                        }}>
                                        <View>
                                            <Text>{item.startTime && item.startTime.substring(0, 10)}</Text>
                                            <WhiteSpace size="xs"/>
                                            <Text style={{color: "#bababa"}}>{item.betweenStartDays}天前</Text>
                                        </View>
                                        <View style={{width: "25%"}}>
                                            <Text>{item.content}</Text>
                                            <WhiteSpace size="xs"/>
                                            <Text style={{color: "#bababa"}}>比较紧急</Text>
                                        </View>
                                        <View>
                                            <Text>{item.star}星</Text>
                                        </View>
                                        <View>
                                            <Text>已完成</Text>
                                            <WhiteSpace size="xs"/>
                                            <Text style={{color: "#bababa"}}>{item.betweenEndDays}天前</Text>
                                        </View>
                                    </View>
                                    <WhiteSpace size="xs"/>
                                </View>
                            </View>)

                        }
                    />
                </View>):(
                    <View style={{alignItems:"center",marginTop:30}}>
                        <Text>
                            暂无历史记录
                        </Text>
                    </View>
                )
                }

                </View>




            );

        }



}

