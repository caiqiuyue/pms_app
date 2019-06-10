import React,{Component} from 'react';
import {View, Text,Modal, Image, Platform, StyleSheet,ScrollView,TouchableHighlight} from 'react-native';

import Dimensions from 'Dimensions';
import axios from "../../../axios";
import {Toast,List} from 'antd-mobile'
import {setData} from './fleshData'
import close from "../../Mine/style/close.jpg";
import {ifIphoneX} from "react-native-iphone-x-helper";
import add from '../../Mine/style/add.png'
import noImg from './noImg.png'
let a = Dimensions.get("window").height/Dimensions.get("window").width;


export default class GoodSelect extends Component {
    constructor(props) {
        super(props);
        this.state={
            district:[],
            allMoney:0,
            animationType: 'none',//none slide fade
            modalVisible: false,//模态场景是否可见
            transparent: true,//是否透明显示
        };

    }

    _setModalVisible = (visible) => {

        this.setState({ modalVisible: visible })
    };

    componentWillMount(){

        axios.post(`/goods/getGoodsData`, {

        })
            .then( (response)=> {
                console.log(response,'生鲜');
                if(response.data.code==0&&response.data.data){

                    console.log();
                    let district = setData(response.data.data)
                    district[0].flag = true


                    this.setState({
                        district:district
                    })

                }
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    aaa = (item)=>{
        let {district} = this.state;
        let scroll = 0;
        district.map((i)=>{
            if(i.goodsCata==item.goodsCata){
                i.flag = true;
                scroll = i.top - i.height;
            } else {
                i.flag = false;
            }
        });

        this.setState({
            district
        }, () => {
            this.type = true;
            this.myScrollView.scrollTo({ x: 0, y: scroll, animated: false });
            setTimeout(() => {
                this.type = false;
            },200)
        })
    };

    bbb = (item,_item)=>{
        let {district} = this.state
        district.map((i)=>{
            i.a.map((_i)=>{
                if(_i.goodsNo==_item.goodsNo){
                    _i.flag = true;
                }else {
                    _i.flag = false;
                }
            })
        })

        this.setState({
            district
        })
    }


    addGoods = (_item)=>{
        let {district,allMoney} = this.state
        district.map((i)=>{
            i.a.map((_i)=>{
                if(_i.goodsNo==_item.goodsNo){
                    _i.num ++;
                    allMoney = allMoney+_i.otherPrice
                }
            })
        })

        this.setState({
            district,allMoney
        })
    }


    subGoods = (_item)=>{
        let {district,allMoney} = this.state
        district.map((i)=>{
            i.a.map((_i)=>{
                if(_i.goodsNo==_item.goodsNo){
                    _i.num --;
                    allMoney = allMoney-_i.otherPrice
                    if(_i.num<0){
                        _i.num =0
                    }

                    if(!allMoney){
                        this._setModalVisible(false)
                    }
                }
            })
        })

        this.setState({
            district,allMoney
        })
    }

    onScroll = (e) => {
        console.log(e.nativeEvent.contentOffset.y);

        if(!this.type) {
            let scroll = e.nativeEvent.contentOffset.y;
            this.time = setTimeout(() => {
                clearTimeout(this.time);
                let type = false;
                let {district} = this.state;
                district.map(item => {
                    if(!type && scroll <= item.top) {
                        item.flag = true;
                        type = true;
                    } else {
                        item.flag = false;
                    }
                });
                this.setState({
                    district
                })
            }, 0);
        }

    };

    showBuyGoods = ()=>{
        if(!this.state.allMoney){
            return
        }
        this._setModalVisible(true)
    }
    submitPay = ()=>{
        let {district} = this.state
        let data = []
        district.map((i)=>{
            i.a.map((_i)=>{
                if(_i.num){
                    let a = {
                        goodsNo:_i.goodsNo,
                        count: _i.num
                    }
                    data.push(a)
                }
            })
        })

        this.setState({
            modalVisible:false
        },()=>{
            axios.post(`/goods/createGoodsOrder`, {
                goodsJson:JSON.stringify(data)

            })
                .then( (response)=> {
                    console.log(response,'提交订单');
                    Toast.info(response.data.code==0?'下单成功':response.data.message)


                })
                .catch(function (error) {
                    console.log(error);
                });
        })


    }


    render()
    {

        let {district} = this.state
        let modalBackgroundStyle = {
            backgroundColor: this.state.transparent ? 'rgba(0, 0, 0, 0.5)' : 'red',
        };
        let innerContainerTransparentStyle = this.state.transparent
            ? { backgroundColor: '#fff', padding: 10 ,
                // height:"90%",
                overflow:"hidden"}
            : null;
        return (
            <View style={styles.select}>

                <View style={{alignItems:"center",backgroundColor:"#f17e3a",height:60,justifyContent:"center"}}>
                    <View style={{alignItems:"center",marginTop:8,}}>
                        <Text style={{color:"#fff",fontSize:16,}}>优选</Text>
                    </View>
                </View>

                <View>

                    <Modal
                        animationType={this.state.animationType}
                        transparent={this.state.transparent}
                        visible={this.state.modalVisible}
                        onRequestClose={() => { this._setModalVisible(false) } }

                    >
                        <View style={[styles.container,modalBackgroundStyle]}>
                            <View style={[styles.innerContainer,innerContainerTransparentStyle]}>

                                <View>

                                    <View style={{flexDirection:"row",justifyContent:"space-around",alignItems:"center"}}>

                                        <View  style={{flex:1,alignItems:'center'}}><Text style={{fontSize:20}}>购物车</Text></View>

                                        <TouchableHighlight underlayColor={"#fff"} onPress={()=>{this._setModalVisible(false)} } style={{}}>
                                            <Image style={{height:30,width:30}} source={close}/>
                                        </TouchableHighlight>


                                    </View>

                                    <View style={{padding:10}}>

                                        <ScrollView style={{maxHeight:Dimensions.get('window').height-200}}>

                                            {
                                                district.map((_item,index)=>

                                                    _item.a.map((item,index)=>

                                                        item.num?

                                                            <View key={index} style={{flexDirection:"row"}}>
                                                                <View style={{padding:10,flex:1,borderBottomColor:"#f0f0f0",borderBottomWidth:1}}>
                                                                    <Text style={{fontWeight:"bold"}}>{item.goodsName}</Text>
                                                                    <View style={{marginTop:10,flexDirection:"row-reverse"}}>
                                                                        <View style={{flexDirection:"row"}}>
                                                                            <Text style={{color:"#f17e3a",fontSize:16,fontWeight:"bold",marginRight:10}}>
                                                                                ¥{item.otherPrice}
                                                                            </Text>
                                                                            {item.num&&
                                                                            <TouchableHighlight underlayColor="transparent"
                                                                                                onPress={()=>{this.subGoods(item)}}
                                                                                                style={{width:20,height:20,borderRadius:10,borderColor:"grey",borderWidth:1,alignItems:"center",justifyContent:"center"}}>
                                                                                <Text style={{fontWeight:"bold"}}>-</Text>
                                                                            </TouchableHighlight>}
                                                                            {item.num&&<View style={{marginLeft:10,marginRight:10}}><Text>{item.num}</Text></View>}
                                                                            <TouchableHighlight underlayColor="transparent" onPress={()=>{this.addGoods(item)}}><Image style={{width:20,height:20}} source={add}/></TouchableHighlight>
                                                                        </View>

                                                                    </View>
                                                                </View>
                                                            </View>
                                                            :null

                                                    )

                                                )
                                            }


                                            <View style={{flexDirection:"row",justifyContent:"space-between",marginTop:10}}>
                                                <Text>共计:</Text>
                                                <Text style={{color:"#f1803a"}}>{this.state.allMoney}元</Text>
                                            </View>


                                            <View style={{alignItems:"center",marginTop:10}}>
                                                <Text style={{marginBottom:10,color:'red'}}>注:货到付款</Text>

                                                <TouchableHighlight underlayColor={"transparent"} style={{padding:10,
                                                    borderWidth:1,borderColor:"#fff",width:100,backgroundColor:"#f17e3a",
                                                    borderRadius:5}} onPress={this.submitPay }>
                                                    <Text
                                                        style={{fontSize:16,textAlign:"center",color:"#fff"}}>
                                                        确定
                                                    </Text>
                                                </TouchableHighlight>


                                            </View>

                                        </ScrollView>


                                    </View>
                                </View>




                            </View>
                        </View>
                    </Modal>



                </View>

                <View style={{
                    ...Platform.select({
                        ios: {
                            // height: Dimensions.get("window").height - 110,
                            height: Dimensions.get("window").height - 150,
                        },
                        android: {
                            // height: Dimensions.get("window").height - 180,
                            height: Dimensions.get("window").height - 170,
                        },
                    }),
                    ...ifIphoneX({
                        height: Dimensions.get("window").height - 160,
                    }, {

                    }),
                }}>
                    <View style={{flexDirection:"row"}}>
                        <View  style={{flex:1}}>
                            <ScrollView>
                                {
                                    district.map((item,index)=>
                                        <View key={index} style={{
                                            backgroundColor: item.flag ? "#f18f3f" : '#f5f5f5',
                                            borderColor:"#f5f5f5",
                                            borderWidth:1,
                                            justifyContent: 'center',
                                            ...Platform.select({
                                                ios: {
                                                    height: (Dimensions.get("window").height - 150)/7,
                                                },
                                                android: {
                                                    height: (Dimensions.get("window").height - 170)/7,
                                                },
                                            }),
                                            ...ifIphoneX({
                                                height: (Dimensions.get("window").height - 160)/7,
                                            }, {

                                            }),
                                        }}>
                                            <TouchableHighlight underlayColor="transparent" style={styles.ss} onPress={()=>{this.aaa(item)}}>
                                                <Text style={{color: item.flag ? "#fff" : "grey" ,fontWeight:"bold"}}>{item.value}</Text>
                                            </TouchableHighlight>
                                            {
                                                // item.flag&&item.a.map((_item,_index)=>
                                                //   <TouchableHighlight underlayColor="transparent" onPress={()=>{this.bbb(item,_item)}}   style={[styles.ss,{backgroundColor:"#fff"}]} key={_index}><Text style={{color:_item.flag?"#ff611a":"#333"}}>{_item.goodsName}</Text></TouchableHighlight>
                                                // )

                                            }
                                        </View>
                                    )
                                }
                            </ScrollView>
                        </View>
                        <View  style={{flex:3}}>
                            <ScrollView

                                ref={(view) => { this.myScrollView = view; }}
                                onScroll={this.onScroll}
                            >
                                {
                                    district.map((_item, _index)=> (
                                        <View key={`list${_index}`}>
                                            <Text style={{
                                                fontWeight:"bold",
                                                paddingVertical: 10, paddingLeft: 6, paddingBottom: 2,
                                                color: '#333',
                                                height: 40,
                                                backgroundColor: '#f5f5f5',
                                            }}>{_item.value}</Text>
                                            <View>
                                                {
                                                    _item.a.length === 0 ? (
                                                            <View  style={{
                                                                justifyContent: 'center',
                                                                alignItems: 'center',
                                                                borderBottomColor:"#f0f0f0",
                                                                borderBottomWidth:1,
                                                                height: 135
                                                            }}>
                                                                <Text style={{color: '#ccc'}}>敬请期待</Text>
                                                            </View>
                                                        ) :
                                                        _item.a.map((item,index)=> (
                                                                <View key={index} style={{
                                                                    flexDirection:"row",
                                                                    borderBottomColor:"#f0f0f0",
                                                                    borderBottomWidth:1,
                                                                    height: 135
                                                                }}>
                                                                    <View style={{height:80, marginTop: 5}}>
                                                                        <Image source={item.goodsImg?{uri: item.goodsImg}:noImg} style={{width:80,height:80,resizeMode:"contain"}}/>
                                                                    </View>
                                                                    <View style={{padding:10,flex:1}}>
                                                                        <Text style={{fontWeight:"bold"}}>{item.goodsName}</Text>
                                                                        <View style={{marginTop:5,flexDirection:"row",alignItems:'center'}}>
                                                                            <Text style={{color:"#f17e3a",fontSize:16,fontWeight:"bold",marginRight:10}}>¥{item.otherPrice}元</Text>
                                                                            <Text style={{color:"grey",textDecorationLine:"line-through"}}>{item.goodsPrice}</Text>
                                                                        </View>
                                                                        <Text style={{marginTop:5,color:"grey"}}>{item.goodsDesc}</Text>
                                                                        <View style={{marginTop:5,flexDirection:"row-reverse"}}>
                                                                            <View style={{flexDirection:"row"}}>
                                                                                {
                                                                                    item.num ?  (
                                                                                        <TouchableHighlight
                                                                                            underlayColor="transparent"
                                                                                            onPress={()=>{this.subGoods(item)}}
                                                                                            style={{
                                                                                                width:20,height:20,borderRadius:10,borderColor:"grey",
                                                                                                borderWidth:1,alignItems:"center",justifyContent:"center"
                                                                                            }}
                                                                                        >
                                                                                            <Text style={{fontWeight:"bold"}}>-</Text>
                                                                                        </TouchableHighlight>
                                                                                    ) : null
                                                                                }
                                                                                {
                                                                                    item.num ? (
                                                                                        <View style={{marginLeft:10,marginRight:10}}>
                                                                                            <Text>{item.num}</Text>
                                                                                        </View>
                                                                                    ) : null
                                                                                }
                                                                                <TouchableHighlight underlayColor="transparent" onPress={()=>{this.addGoods(item)}}><Image style={{width:20,height:20}} source={add}/></TouchableHighlight>
                                                                            </View>
                                                                        </View>
                                                                    </View>
                                                                </View>
                                                            )
                                                        )
                                                }
                                            </View>
                                        </View>
                                    ))
                                }

                            </ScrollView>
                        </View>


                    </View>
                </View>

                <View style={styles.userItem}>
                    <View style={{padding:10,flexDirection:"row",justifyContent:"space-around",flex:1,borderTopColor:"grey",borderTopWidth:1}}>
                        <Text>共计:</Text>
                        <Text style={{color:"#f1803a"}}>{this.state.allMoney}元</Text>
                    </View>
                    <TouchableHighlight onPress={this.showBuyGoods} underlayColor="#fff"  style={{padding:10,backgroundColor:this.state.allMoney?"#f1803a":"grey",flex:1}}>
                        <Text style={{color:"#fff",paddingLeft:50}}>确认下单</Text>
                    </TouchableHighlight>
                </View>

            </View>
        )

    }
}

const styles = StyleSheet.create({
    select:{
        backgroundColor:"#fff",
        height: Dimensions.get("window").height-50
    },

    ss:{
        padding:10,alignItems:"center",justifyContent:"center"
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,

    },
    innerContainer: {
        borderRadius: 10,
    },
    userItem:{
        backgroundColor:"#fff",flexDirection:"row",position:"absolute",zIndex:999,


        ...Platform.select({
            ios: {
                // bottom:65,
                bottom:0,
            },
            android: {
                // bottom:a>1.9?35:15,
                bottom:a>1.9?45:25,
            },
        }),

        ...ifIphoneX({
            bottom:45,
        }, {

        })

    },


});




