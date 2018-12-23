import React,{Component} from 'react';
import {View, Text, TouchableHighlight, Image, StyleSheet,Platform,FlatList} from 'react-native';
import announcement from './style/announcement.png';
import preferential from './style/preferential.png';
import rent from './style/rent.png';
import social from './style/social.png';
import Dimensions from 'Dimensions';
import {Toast} from 'antd-mobile';
import axios from "../../axios";
import moment from "moment/moment";
import JPushModule from 'jpush-react-native'
import AllBills from "../HomePage/secondRow/allBills";


import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {getData} from "../../components/active/reducer";


const setDate = (date) => {

    let a = 1000*60;//分钟
    let b = 1000*60*60;//小时

    let newDate = new Date();
    let num = moment(newDate).valueOf() - moment(date).valueOf();

    if(num / a < 60){

        return(`${Math.round(num/a)}分钟前`)

    }else if(num / b < 24){

        return(`${Math.round(num/b)}小时前`)

    }else if(moment(num).dayOfYear() < 10){

        return(`${moment(num).dayOfYear()}天前`)

    }else {

        return moment(date).format('YYYY-MM-DD');
    }


};


class ReadMessage extends React.Component {
    constructor(props) {
        super(props);
        this.state= {
            read: false,
            unread: false,
            refreshing: false,
            dataSource: [],
            readData: [],
            unreadData: [],
            handelMsg:[
                {
                    value:"未读消息",
                    flag:true
                },

                {
                    value:"已读消息",
                    flag:false
                },

            ],

            changeMsg:"未读消息",

            aa:false
        }

        ;
        this.type = 1

    }

    componentWillMount(){
        if(Platform.OS === 'ios'){
            JPushModule.setBadge(0, (badgeNumber) => {
                console.log(badgeNumber)
            });
        }

        axios.post(`/my/getMyMsg`, {
        })
            .then( (response)=> {
                console.log(response);

                this.setState({
                    aa:true
                },()=>{
                    if(response.data.unread){
                        this.setState({
                            unreadData:response.data.unread&&response.data.unread,
                            readData:response.data.read&&response.data.read
                        })
                    }
                })

            })
            .catch(function (error) {
                console.log(error);
            });
    }

    // componentWillReceiveProps(newProps){
    //     console.log(newProps, '222313123123123123123123123');
    //     const reduxData = newProps.reduxData;
    //     this.setState({
    //         dataSource:reduxData.unread,
    //         readData:reduxData.read,
    //         unreadData:reduxData.unread
    //     })
    // }


    //选择状态
    handelMsg=(item)=>{

        let {handelMsg} = this.state;

        handelMsg.map((_item)=>{
            if(_item.value==item.value){
                _item.flag=true;
            }else {
                _item.flag = false
            }

        })

        this.setState({
            handelMsg,
            changeMsg:item.value
        },()=>{
            if(item.value=='未读消息'){

            }

            if(item.value=='已读消息'){


            }
        })

    }


    getMyMsg=()=>{

        this.setState({
            refreshing: true
        },()=>{
            axios.post(`/my/getMyMsg`, {
            })
                .then( (response)=> {
                    console.log(response);

                    console.log(this.state.refreshing,'refreshing');

                    this.setState({
                        aa:true,
                        refreshing:false
                    },()=>{

                        if(response.data.unread){

                            let unread = response.data.unread;

                            this.props.getData(unread);

                            this.setState({
                                unreadData:response.data.unread&&response.data.unread,
                                readData:response.data.read&&response.data.read,

                            })
                        }else if(response.data.code==1){
                            Toast.info(response.data.message,1)

                        }


                    })

                })
                .catch((error) =>{
                    console.log(error);
                    this.setState({
                        refreshing:false
                    })
                });
        });








    }

    //下拉刷新
    onRefresh = () => {
        this.getMyMsg()
    };




    //点击标为已读
    messageBtn = (item)=>{

        if(item.sendStatus==1){
            axios.post(`/my/updateMyMsg`, {
                id:item.id
            })
                .then( (response)=> {
                    console.log(response);
                    this.onRefresh();
                })
                .catch(function (error) {
                    console.log(error);
                });
        }
    };




    //跳页面
    jumptoBtn = (item)=>{
        const { navigate } = this.props.navigation;
        if(item.sendParam =='bill_overdue'||item.sendParam =='renting_bill'){
            navigate('Rent',{ user:"" });
        }else if(item.countent.indexOf('水费')!=-1){
            navigate('Water',{ user:"" });

        }else if(item.countent.indexOf('电费')!=-1){
            navigate('Electricity',{ user:"" });

        }else if(item.countent.indexOf('电费')==-1&&item.countent.indexOf('水费')==-1&&item.countent.indexOf('房租')==-1&&item.title.indexOf('杂费')!=-1){
            navigate('AllBills',{ user:"" });
        }else if(item.sendParam=="checkin_reminding"){
            navigate('AllBills',{ user:"" });

        }

    };


    render(){

        let {changeMsg,handelMsg,unread,read,dataSource, refreshing,readData,unreadData} = this.state;

        return (

            <View style={{height: Dimensions.get("window").height,backgroundColor:"#fff"}}>

                <View style={{alignItems:"center",backgroundColor:"#f17e3a",height:60,justifyContent:"center"}}>
                    <View style={{alignItems:"center",marginTop:8,}}>

                        <Text style={{color:"#fff",fontSize:16,}}>消息</Text>

                    </View>
                </View>

                <View style={{borderTopColor:"#ccc",borderTopWidth:1,flexDirection:"row",justifyContent:"space-around"}}>
                    {
                        handelMsg.map((item,index)=>

                            <TouchableHighlight  onPress={()=>this.handelMsg(item)} style={{padding:10,alignItems:"center",width:"50%",backgroundColor:!item.flag?"#f6f8fa":"#fff",borderBottomWidth:1,borderBottomColor:item.flag?"#7ebef9":"#b5b5b5"}} underlayColor="transparent" key={index}>

                                <Text style={{color:item.flag?"#7ebef9":"#000"}}>{item.value}</Text>
                            </TouchableHighlight>
                        )
                    }

                </View>



                {
                    changeMsg=='未读消息'?
                        <View>
                            <View style={{height: Dimensions.get("window").height-130,padding:10}}>
                                <FlatList
                                    data={unreadData}  //列表的渲染数据源
                                    ListEmptyComponent={()=><View style={{marginTop:30,alignItems:"center"}}><Text>{this.state.aa?'暂无未读消息':'获取消息数据中'}</Text></View>} //列表没有数据时展示，箭头函数中可以写一个react组件
                                    getItemLayout={(data, index) => ( {length: 80, offset: 80 * index, index} )}
                                    initialNumToRender={10}  //首次渲染的条数
                                    // onEndReached={this.onEndReached}  //列表被滚动到距离内容最底部不足onEndReachedThreshold的距离时调用。
                                    onEndReachedThreshold={0.1} //定当距离内容最底部还有多远时触发onEndReached回调。注意此参数是一个比值而非像素单位。比如，0.5表示距离内容最底部的距离为当前列表可见长度的一半时触发。
                                    onRefresh={this.onRefresh} //下拉刷新
                                    refreshing={refreshing} //下拉刷新时候的正在加载的符号，设置为true显示，false隐藏。加载完成，需要设置为false
                                    keyExtractor={(item,index)=>`${index}`}
                                    renderItem={({item}) => (  //渲染列表的方式

                                        <View>
                                            <View style={{flexDirection:"row",backgroundColor:"#f6f8fa",marginBottom:5}}>

                                                <View style={{flex:1,alignItems:"center",justifyContent:"center",paddingLeft:10,paddingRight:10,marginTop:10,marginBottom:10,borderRightColor:"#e7e9ea",borderRightWidth:1}}>
                                                    <View  style={{alignItems:"center",flexDirection:"row",marginLeft:0}}>
                                                        <Image style={{height:20,width:20,marginRight:5}}

                                                               source={item.sendParam == 'notice_msg' ||item.sendParam == 'app_msg'? announcement :
                                                                   item.sendParam == "bill_msg" ||item.sendParam == "renting_bill"||item.sendParam == "cost_bill"||item.sendParam == "bill_overdue"||item.sendParam == "successful_payment"||item.sendParam == "fees_bill"? rent :
                                                                       item.sendParam == 'preferential_msg' ? preferential :
                                                                           social}/>
                                                        <Text style={{fontSize:14}}>{item.sendTitle}</Text>
                                                    </View>

                                                    <Text style={{marginTop:5,color:"grey"}}>{setDate(item.createTime)}</Text>

                                                </View>



                                                <View style={{flex:2,marginLeft:15,justifyContent:"center",padding:10}}>

                                                    <TouchableHighlight
                                                        underlayColor="#f0f0f0" onPress={()=>this.jumptoBtn(item)}
                                                    >
                                                        <Text style={{color:"grey"}}>{item.countent}
                                                            <Text style={{textDecorationLine:'underline',color:"#f17e3a"}}>点击查看详情</Text>
                                                        </Text>
                                                    </TouchableHighlight>

                                                    <TouchableHighlight  underlayColor={item.sendStatus==1 ? "#f0f0f0":'#fff'} onPress={()=>this.messageBtn(item)}><Text  style={{color:"#ef7f92",textAlign:"right"}}>标为已读</Text></TouchableHighlight>

                                                </View>
                                            </View>
                                        </View>


                                    )}
                                />
                            </View>
                        </View>
                        :
                        <View>
                            <View style={{height: Dimensions.get("window").height-130,padding:10}}>
                                <FlatList
                                    data={readData}  //列表的渲染数据源
                                    ListEmptyComponent={()=><View style={{marginTop:30,alignItems:"center"}}><Text>{this.state.aa?'暂无已读消息':'获取消息数据中'}</Text></View>} //列表没有数据时展示，箭头函数中可以写一个react组件
                                    getItemLayout={(data, index) => ( {length: 80, offset: 80 * index, index} )}
                                    initialNumToRender={10}  //首次渲染的条数
                                    // onEndReached={this.onEndReached}  //列表被滚动到距离内容最底部不足onEndReachedThreshold的距离时调用。
                                    onEndReachedThreshold={0.1} //定当距离内容最底部还有多远时触发onEndReached回调。注意此参数是一个比值而非像素单位。比如，0.5表示距离内容最底部的距离为当前列表可见长度的一半时触发。
                                    onRefresh={this.onRefresh} //下拉刷新
                                    refreshing={refreshing} //下拉刷新时候的正在加载的符号，设置为true显示，false隐藏。加载完成，需要设置为false
                                    keyExtractor={(item,index)=>`${index}`}
                                    renderItem={({item}) => (  //渲染列表的方式

                                        <View>
                                            <View style={{flexDirection:"row",backgroundColor:"#f6f8fa",marginBottom:5}}>

                                                <View style={{flex:1,alignItems:"center",justifyContent:"center",paddingLeft:10,paddingRight:10,marginTop:10,marginBottom:10,borderRightColor:"#e7e9ea",borderRightWidth:1}}>
                                                    <View  style={{alignItems:"center",flexDirection:"row",marginLeft:0}}>
                                                        <Image style={{height:20,width:20,marginRight:5}}

                                                               source={item.sendParam == 'notice_msg' ||item.sendParam == 'app_msg'? announcement :
                                                                   item.sendParam == "bill_msg" ||item.sendParam == "renting_bill"||item.sendParam == "cost_bill"||item.sendParam == "bill_overdue"||item.sendParam == "successful_payment"||item.sendParam == "fees_bill"? rent :
                                                                       item.sendParam == 'preferential_msg' ? preferential :
                                                                           social}/>
                                                        <Text style={{fontSize:14}}>{item.sendTitle}</Text>
                                                    </View>

                                                    <Text style={{marginTop:5,color:"grey"}}>{setDate(item.createTime)}</Text>

                                                </View>



                                                <View style={{flex:2,marginLeft:15,justifyContent:"center",padding:10}}>

                                                    <TouchableHighlight
                                                        underlayColor="#f0f0f0" onPress={()=>this.jumptoBtn(item)}
                                                    >
                                                        <Text style={{color:"grey"}}>{item.countent}
                                                            <Text style={{textDecorationLine:'underline',color:"#f17e3a"}}>点击查看详情</Text>
                                                        </Text>
                                                    </TouchableHighlight>

                                                </View>
                                            </View>
                                        </View>


                                    )}
                                />
                            </View>
                        </View>
                }


            </View>


        )

    }
}


const styles = StyleSheet.create({
    message:{
        flexDirection:"row",
    }
});

export default connect (
    state => ({reduxData: state.reduxData}),
    dispath => bindActionCreators({getData},dispath)
)(ReadMessage)

