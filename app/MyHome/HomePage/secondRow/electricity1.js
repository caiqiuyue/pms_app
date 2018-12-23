import React, { Component } from 'react';
import {
    TouchableHighlight,
    StyleSheet,
    Text,
    View,
    Image,
    FlatList

} from 'react-native';

import {WhiteSpace,Toast,Button} from 'antd-mobile';
import axios from "../../../axios";
import electric from "../style/electric.png";
import Dimensions from 'Dimensions';




export default class Electricity extends Component {

    constructor(props) {
        super(props);

        this.state = {
            refreshing: false,
            dataSource: [],
            willpaid:0,
            allEle:0,

        }}


    componentWillMount(){


        axios.post(`/tenant/getCostBill`, {
            type:"200002"

        })
            .then((response) =>{
                console.log(response);

                let param = response.data.data;
                let willpaid = param.filter((item)=>{
                    return item.isState == 0
                });

                let data = param.map((item)=>{
                    item.selectEle = false;
                    return item
                })

                this.setState({
                    dataSource:data,
                    willpaid:willpaid.length
                })



            })
            .catch(function (error) {
                console.log(error);
            });

    }


    //下拉刷新
    onRefresh = () => {
        this.setState({
            refreshing: true
        });
        //延时模拟加载效果
        setTimeout(() => {

            axios.post(`/tenant/getCostBill`, {
                type:"200002"

            })
                .then((response) =>{
                    console.log(response);
                    let param = response.data.data;
                    let willpaid = param.filter((item)=>{
                        return item.isState == 0
                    });
                    this.setState({
                        dataSource:param,
                        refreshing: false,
                        willpaid:willpaid.length
                    })


                })
                .catch(function (error) {
                    console.log(error);
                });


        }, 1000)
    };

    selectEle=(item, index)=>{
       let {dataSource} = this.state;
        this.setState({
            dataSource: dataSource.map(_item => {
                if(_item.id == item.id) {
                    _item.selectEle = !_item.selectEle;
                }
                return _item;
            })
    })
    };


    render() {

        let {refreshing,dataSource,selectEle,willpaid,allEle} = this.state;

        return (

            <View>
                {
                    dataSource ?
                        <View  style={{height:Dimensions.get("window").height}}>

                            <View style={{backgroundColor:"grey",height:20,width:Dimensions.get("window").width,top:0,position:"absolute",zIndex:999}}>
                                <Text>您有<Text style={{color:"red"}}>{willpaid}笔</Text>电费待支付</Text>
                            </View>

                            <View style={{display:willpaid==0?"none":"flex",backgroundColor:"#f0f0f0",justifyContent:"center",alignItems:"center",padding:10,width:Dimensions.get("window").width,bottom:"11%",position:"absolute",zIndex:999}}>
                                <Text>需支付电费{allEle}元</Text>
                                <TouchableHighlight style={{backgroundColor:"#5cd9e7",paddingTop:10,paddingBottom:10,paddingLeft:15,paddingRight:15,marginBottom:10,marginTop:10}}>
                                    <Text style={{backgroundColor:"#5cd9e7",color:"#fff"}}>支付</Text>
                                </TouchableHighlight>

                            </View>


                            <View style={{marginTop:20,height: Dimensions.get("window").height - 200}}>
                                <FlatList
                                    data={this.state.dataSource}  //列表的渲染数据源
                                    getItemLayout={(data, index) => ( {length: 80, offset: 80 * index, index} )}
                                    initialNumToRender={7}  //首次渲染的条数
                                    onEndReached={this.onEndReached}  //列表被滚动到距离内容最底部不足onEndReachedThreshold的距离时调用。
                                    onEndReachedThreshold={0.1} //定当距离内容最底部还有多远时触发onEndReached回调。注意此参数是一个比值而非像素单位。比如，0.5表示距离内容最底部的距离为当前列表可见长度的一半时触发。
                                    onRefresh={this.onRefresh} //下拉刷新
                                    refreshing={refreshing} //下拉刷新时候的正在加载的符号，设置为true显示，false隐藏。加载完成，需要设置为false
                                    keyExtractor={(item,index)=>`${index}`}
                                    renderItem={({item, index}) => (  //渲染列表的方式
                                        <View>
                                            <View
                                                style={{flexDirection:"row",justifyContent: "space-around",
                                                    alignItems: 'center',borderRadius:10,
                                                    fontSize:16,padding:5,backgroundColor:item.selectEle ? "pink" : "#fff"}}>

                                                <View style={{flexDirection:"row",flex:3,alignItems:"center"}}>
                                                    <View style={{marginRight:8}}>
                                                        <Image style={{height:30,width:30}} source={electric}/>
                                                    </View>
                                                    <View>
                                                        <Text style={{fontSize:18,color:item.isState == 0 ? "#000" : "grey"}}>电费</Text>
                                                        <WhiteSpace size="xs"/>
                                                        <Text  style={{color:"grey"}}>{item.fromDate && item.fromDate.substring(5, 10)}至</Text>
                                                        <Text  style={{color:"grey"}}>{item.toDate && item.toDate.substring(5, 10)}</Text>
                                                    </View>
                                                </View>

                                                <View  style={{flex:2,alignItems:"center"}}>
                                                    <Text style={{color:item.isState == 0?"#000":"grey"}}>{item.addDate && item.addDate.substring(5, 10)}应收</Text>
                                                    <WhiteSpace size="xs"/>
                                                    <Text style={{color:item.isState == 0?"#000":"grey"}}>{item.toDate && item.toDate.substring(5, 10)}截止</Text>
                                                </View>

                                                <View style={{flex:2,alignItems:"center"}}>
                                                    <Text style={{fontsize:18,color:item.isState == 0?"#000":"grey"}}>{item.rentPrice.toFixed(2)}</Text>
                                                </View>

                                                <View style={{flex:1,alignItems:"center"}}>
                                                    {
                                                        item.isState == 0 ? (<TouchableHighlight onPress={()=>this.selectEle(item)} underlayColor="#fff">
                                                                <Text style={{
                                                                    color: "#5cd9e7"
                                                                }}>选择</Text>
                                                            </TouchableHighlight>) :
                                                            (<Text style={{color:"grey"}}>已交</Text>)

                                                    }

                                                </View>
                                            </View>
                                            <WhiteSpace size="xs"/>
                                        </View>)


                                    }

                                />
                            </View>





                        </View> :
                        (<View style={{alignItems:"center",marginTop:30}}>
                            <Text>
                                暂无电费账单记录
                            </Text>
                        </View>)
                }


            </View>



        );
    }







}
