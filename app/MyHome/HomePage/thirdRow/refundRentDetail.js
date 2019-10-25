import React,{Component} from 'react';
import {View, Text, ScrollView, Platform, StyleSheet,TouchableHighlight} from 'react-native';
import {Toast} from 'antd-mobile';
import Dimensions from 'Dimensions';
import axios from "../../../axios";
import moment from 'moment'
import {ifIphoneX} from "react-native-iphone-x-helper";
let a = Dimensions.get("window").height/Dimensions.get("window").width

export default class RefundRentDetail extends React.Component {
    constructor(props) {
        super(props);
        this.state={
            data1:[],
            data:{},
            data2:[],
            flag:false,
            allData1:0,
            allData2:0,
            allPrice:0



        };

    }



    componentWillMount(){


        this.props.navigation.getParam = (name) => {
            let params = this.props.navigation && this.props.navigation.state && this.props.navigation.state.params || {};
            if(name) {
                return params[name];
            }
            return params;
        };
        let {allData1,allData2} = this.state;

        const {getParam} = this.props.navigation;
        const data = getParam("user");



        // if(JSON.parse(data.bill_json).length != 0 ){
        //     detailData = JSON.parse(data.bill_json);
        //
        // }
        // else{
        //     detailData = dataArr.bill_json;
        // }


        // let   detailData = [
        //             {feeName:"房租",money:'-1000'},
        //             {feeName:"房租",money:'1000'},
        //             {feeName:"水费",money:'-1000'},
        //             {feeName:"水费",money:'1000'},
        //             {feeName:"水费",money:'1000'},
        //             {feeName:"水费",money:'1000'},
        //             {feeName:"水费",money:'1000'},
        //             {feeName:"水费",money:'1000'},
        //             {feeName:"水费",money:'-1000'},
        //             {feeName:"电费",money:'1000'},
        //             {feeName:"电费",money:'-1000'},
        //             {feeName:"网费",money:'-1000'},
        //             {feeName:"网费",money:'1000'},
        //             {feeName:"网费",money:'1000'},
        //             {feeName:"网费",money:'1000'},
        //             {feeName:"网费",money:'-1000'},
        //             {feeName:"电视费",money:'-1000'},
        //         ];




        let detailData = JSON.parse(data.bill_json);
        //let detailData = data.bill_json;


        console.log(detailData,'detailData');

        let data1 = detailData.filter((item,index)=>{
            return item.money-0 > 0;

        });

        console.log(data1);


        let data2 = detailData.filter((item,index)=>{
            return item.money-0 < 0;

        });

        console.log(data2,'console.log(data2);');

        data1.map((item,index)=>{
            allData1 += item.money-0

        });

        data2.map((item,index)=>{
            allData2 += item.money-0

        });


        this.setState({
            data1,data2,allData1,allData2,data,
            allPrice:allData1+allData2
        },()=>{console.log(allData1,allData2);});





        //console.log(data2);

    }

    submitBtn = () => {

        let {type} = this.props;


        if(this.state.flag){
            Toast.info('已确认，不可重复操作',1)
        }else{

            if(this.state.data.isPay){

                let data={
                };
                data.id = this.state.data.id;

                let dataPay = {};
                dataPay.dataPay = data;
                dataPay.url = '/self/finishRequisition';
                dataPay.price = this.state.allPrice;

                dataPay.introduce = (type==2?'续房':type==3?'转租':type==4?'换房':'退房');

                dataPay.yiPay={
                    price:this.state.allPrice,
                    orderType:2,
                    id:data.id,
                }


                const { navigate } = this.props.navigation;
                navigate('Pay',{ user:dataPay });
            }

            else {

                this.setState({
                    flag:true
                },()=>{
                    axios.post(`/self/finishRequisition`,   {
                        id:this.state.data.id

                    })
                        .then((response) => {
                            console.log(response);

                            if(this.state.allData2-0==0&&this.state.allData1-0==0){
                                Toast.info('已确认',1);
                            }else {
                                Toast.info('请等待财务退款',1);
                            }

                        })
                        .catch(function (err) {
                            console.log(err);

                        });
                })


            }

        }



    };



    render(){

        let len = Dimensions.get("window").width;
        let arr = [];
        for (let i = 0; i < len; i++) {
            arr.push(i);
        }

        let {type} = this.props;
        let {data,flag} = this.state;


        return (



            <View style={styles.select}>


                <ScrollView  style={styles.hei} showsVerticalScrollIndicator={false}>
                    <View>

                        <View>
                            {
                                //续租
                                type==2 ?
                                    (<View>
                                        <View style={{flexDirection:"row",paddingLeft:10,paddingTop:30,paddingBottom:30,alignItems:"center"}}>
                                            <View>
                                                <Text style={{fontSize:12}}>新租金</Text>
                                                <Text style={{fontSize:12,color:"grey"}}>最新租金政策</Text>
                                            </View>

                                            <View style={{backgroundColor:"#f17e3a",borderRadius:5,marginLeft:5,marginRight:15}}><Text style={{padding:5,color:"#fff",fontSize:12}}>{data.after_rent?data.after_rent:""}元/月</Text></View>
                                            <View style={{backgroundColor:"#666",borderRadius:5,marginRight:5}}><Text style={{padding:5,color:"#fff",fontSize:12}}>{data.before_rent?data.before_rent:""}元/月</Text></View>
                                            <Text style={{fontSize:12}}>原租金</Text>

                                        </View>

                                        <View style={{height:4,backgroundColor:"#f0f0f0"}}></View>

                                    </View>) :
                                    //转租
                                    type==3 ?
                                        (<View>
                                            <View style={{alignItems:"center",marginTop:20}}>
                                                <Text style={{fontSize:30,color:"#3a811d"}}>转租成功</Text>
                                                <Text style={{marginTop:10,marginBottom:10}}>租客预计入住时间：{data.about_date?data.about_date:""}，请做好搬离准备。</Text>

                                            </View>

                                            <View style={{height:4,backgroundColor:"#f0f0f0"}}></View>

                                        </View>) :

                                        //换房
                                        type==4 ?
                                            (<View>
                                                <View  style={{padding:30}}>
                                                    <View style={{flexDirection:"row",alignItems:"center"}}>
                                                        <View>
                                                            <Text>新房间号：</Text>
                                                        </View>

                                                        <View style={{backgroundColor:"#f17e3a",borderRadius:5,marginLeft:5,marginRight:15}}>
                                                            <Text style={{padding:5,color:"#fff"}}>{data.new_room_no?data.new_room_no:""}</Text>
                                                        </View>
                                                        <Text>{data.name}</Text>
                                                    </View>

                                                    <Text style={{color:"grey",marginTop:10}}>支付账单后请联系管家查房和换到新房间</Text>

                                                </View>

                                                <View style={{height:4,backgroundColor:"#f0f0f0"}}></View>

                                            </View>) :

                                            (<View></View>)
                            }
                        </View>

                        {
                             JSON.parse(data.bill_json).length>0?
                            //data.bill_json.length>0?

                                (
                                <View>

                                    <View>

                                        <View style={[styles.usermessage,{borderBottomColor:"#fff"}]}>
                                            <View>
                                                <Text>退款项</Text>
                                            </View>
                                            <View style={{marginLeft:"60%"}}>
                                                <Text style={{color:"red"}}>¥{this.state.allData2.toFixed(2)}元</Text>
                                            </View>
                                        </View>

                                        <View style={{flexDirection:"row",width: Dimensions.get("window").width,height:2,backgroundColor:"#fff"}}>
                                            {
                                                arr.map((item, index) => {
                                                    return <Text style={[styles.dashItem, {backgroundColor: "#c0c0c0"}]}
                                                                 key={'dash' + index}> </Text>
                                                })
                                            }


                                        </View>


                                        {
                                            this.state.data2.map((item,index)=>
                                                <View key={index} style={styles.usermessage}>
                                                    <View>
                                                        <Text>{item.feeName}:</Text>
                                                    </View>
                                                    <View style={styles.userItem}>
                                                        <Text style={styles.textcolor}>{(item.money-0).toFixed(2)}元</Text>
                                                    </View>
                                                </View>
                                            )
                                        }






                                        <View style={{height:4,backgroundColor:"#f0f0f0"}}>

                                        </View>


                                        <View style={[styles.usermessage,{borderBottomColor:"#fff"}]}>
                                            <View>
                                                <Text>收款项</Text>
                                            </View>
                                            <View style={{marginLeft:"60%"}}>
                                                <Text style={{color:"#7fd47d"}}>¥{this.state.allData1.toFixed(2)}元</Text>
                                            </View>
                                        </View>


                                        <View style={{flexDirection:"row",width: Dimensions.get("window").width,height:2,backgroundColor:"#fff"}}>
                                            {
                                                arr.map((item, index) => {
                                                    return <Text style={[styles.dashItem, {backgroundColor: "#c0c0c0"}]}
                                                                 key={'dash' + index}> </Text>
                                                })
                                            }


                                        </View>

                                        {
                                            this.state.data1.map((item,index)=>
                                                <View key={index} style={styles.usermessage}>
                                                    <View>
                                                        <Text>{item.feeName}:</Text>
                                                    </View>
                                                    <View style={styles.userItem}>
                                                        <Text style={styles.textcolor}>{(item.money-0).toFixed(2)}元</Text>
                                                    </View>
                                                </View>
                                            )
                                        }

                                    </View>

                                    <View style={{flexDirection:"row",marginLeft:"60%",marginTop:30,marginBottom:20}}>
                                        <Text>总计:</Text>
                                        <Text style={{color:this.state.allPrice > 0 ? "#7fd47d":"red"}}>{this.state.allPrice.toFixed(2)}元</Text>
                                        <Text>{this.state.allPrice>0?"(收款)":"(退款)"}</Text>
                                    </View>
                                </View>
                            ) : (
                                <Text>{}</Text>
                            )
                        }






                    </View>
                </ScrollView>




                    {data.payOk==2?
                        (
                            <View style={styles.userItem2}>

                                <View style={{paddingBottom:10,flex:1,alignItems:"center"}}>
                                    <Text

                                        style={{fontSize:20,textAlign:"center",color:"red"}}>
                                        已支付
                                    </Text>
                                </View>



                            </View>

                            ):
                        (
                            <View style={styles.userItem2}>

                                <View style={{padding:10,flexDirection:"row",borderTopColor:"#f0f0f0",borderTopWidth:1,justifyContent:"space-around",flex:1}}>
                                    <Text>共计:</Text>
                                    <Text style={{color:"#f1803a"}}>{this.state.allPrice.toFixed(2)}元</Text>
                                </View>
                                <TouchableHighlight onPress={this.submitBtn} underlayColor="#fff"  style={{padding:10,backgroundColor:"#f1803a",flex:1}}>
                                    <Text style={{color:"#fff",paddingLeft:50}}>确认账单</Text>
                                </TouchableHighlight>

                            </View>
                                )}








            </View>
        )

    }
}



const styles = StyleSheet.create({


    userItem2:{
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
            bottom:110,
        }, {

        })

    },


    hei:{
        marginTop:20,

        // ...Platform.select({
        //     ios: {
        //         height: Dimensions.get("window").height - 120,
        //     },
        //     android: {
        //         height: Dimensions.get("window").height,
        //         paddingBottom:100
        //     },
        // })
    },

    userItems:{
        backgroundColor:"#fff",flexDirection:"row",position:"absolute",zIndex:999,
    },


    textcolor:{
        color:"#000"
    },

    select:{
        backgroundColor:"#fff",
        height: Dimensions.get("window").height,

        ...Platform.select({
            ios: {
                paddingBottom:120
            },
            android: {
                paddingBottom:a>1.9?155:140
            },
        })



    }

    ,usermessage:{
        flexDirection:"row",
        padding:10,
        paddingLeft:30,
        borderBottomWidth:1,
        borderBottomColor:"#f0f0f0",
    },
    userItem:{
        flex:1,
        paddingLeft:10,
    },
    dashItem: {
        height: 1,
        width: 1,
        marginRight: 2,

    }



});
