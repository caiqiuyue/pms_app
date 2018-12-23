import React, { Component } from 'react';
import {
    TouchableHighlight,
    StyleSheet,
    Text,
    SectionList,
    View,
    Image,
    Modal,
    TextInput


} from 'react-native';

import {WhiteSpace,List,DatePicker} from 'antd-mobile';
import axios from "../../axios";
import screening from "./style/screening.jpg";
import water from "../../MyHome/HomePage/style/7.png";
import electric from "../../MyHome/HomePage/style/6.png";
import rent from "../../MyHome/HomePage/style/5.png";
import fee from "../../MyHome/HomePage/style/fee.png";
import close from "./style/close.jpg";
import Dimensions from 'Dimensions';
import moment from 'moment'

const setDate = (date) => {
    let newDate = new Date();
    let num = moment(newDate).valueOf() - moment(date).valueOf();

    if(moment(num).dayOfYear() > 10) {
        return moment(date).format('YYYY-MM-DD');
    } else {
        return `${moment(num).dayOfYear()}天前`
    }
}




export default class myBill extends Component {

    constructor(props) {
        super(props);

        this.state = {
            refreshing: true,
            dataSource: [],
            sections: [],
            date:null,
            animationType: 'none',//none slide fade
            modalVisible: false,//模态场景是否可见
            transparent: true,//是否透明显示
            startNum: 0,
            endNum: 99999,
            totalIn:0,
            totalOut:0,

            data: [{
                status: false,
                id: 1,
                name: '房租',
                type:"100000"
            },{
                status: false,
                id: 2,
                name: '电费',
                type:"200002"
            },{
                status: false,
                id: 3,
                name: '水费',
                type:"200001"
            },{
                status: false,
                id: 4,
                name: '押金',
                type:"100101"
            },{
                status: false,
                id: 5,
                name: '其他',
                type:"123456"
            }]
        }}



    Format =  (fmt)=> { //author: meizz
        let o = {
            "M+": this.getMonth() + 1, //月份
            "d+": this.getDate(), //日
            "h+": this.getHours(), //小时
            "m+": this.getMinutes(), //分
            "s+": this.getSeconds(), //秒
            "q+": Math.floor((this.getMonth() + 3) / 3), //季度
            "S": this.getMilliseconds() //毫秒
        };
        if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
        for (let k in o)
            if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        return fmt;
        //yyyy-MM-dd hh:mm:ss
    };

    componentWillMount(){

        axios.post(`/tenant/getMyBill`, {

        })
            .then((response) =>{
                console.log(response);
                if(response.data.code == 0) {
                    let param = response.data.data && JSON.parse(response.data.data) || [];
                    let sections = param.map(item => {
                        item.data = item.list;
                        return item;
                    });

                    console.log(sections,'sections')

                    if(param){
                        this.setState({
                            refreshing: false,
                            sections,
                            dataSource:param,
                            totalIn:response.data.totalIn,
                            totalOut:response.data.totalOut
                        })
                    }
                } else {
                    this.setState({
                        refreshing: false,
                        sections: []
                    })
                }
            })
            .catch((error) => {
                this.setState({
                    refreshing: false,
                    sections: []
                })
            });
    }

    //下拉刷新
    onRefresh = () => {
        this.setState({
            refreshing: true
        });


        axios.post(`/tenant/getMyBill`, {

        })
            .then((response) =>{
                console.log(response);
                if(response.data.code == 0) {
                    console.log(response.data.data)
                    let param = response.data.data && JSON.parse(response.data.data) || [];
                    let sections = param.map(item => {
                        item.data = item.list;
                        return item;
                    });

                    console.log(sections,'sections')

                    if(param){
                        this.setState({
                            refreshing: false,
                            sections,
                            dataSource:param,
                            totalIn:response.data.totalIn,
                            totalOut:response.data.totalOut
                        })
                    }
                } else {
                    this.setState({
                        refreshing: false,
                        sections: []
                    })
                }
            })
            .catch((error) => {
                this.setState({
                    refreshing: false,
                    sections: []
                })
            });
    };

    handelChange=(date)=>{
        console.log(date);
        this.setState({
            date
        })
    };


    _setModalVisible = (visible) => {
        this.setState({ modalVisible: visible });
    };


    handleOk = (item) => {
        const {data} = this.state;
        data.map(_item => {
            if(item.id == _item.id) {
                item.status = !item.status;
            }
        });
        this.setState({
            data
        })
    };

    handleStartChange = (text, type) => {
        console.log(text, type,"text, type");
        this.setState({
            [type]:text ? parseInt(text) : 0
        })
    };


    //筛选条件确定
    submitOk=()=>{
        let {startNum,endNum,date, data} = this.state;
        console.log(date,"点击确定打印的");
        this.setState({
            startNum:startNum > endNum ? endNum :startNum,
            endNum:startNum > endNum ? startNum :endNum,
            refreshing: true
        },()=>{console.log(this.state.startNum, this.state.endNum)});

        let types = [];
        data.map(item => {
            item.status && types.push(item.type);
        });

        axios.post(`/tenant/getMyBill`, {
            type:types.join(','),
            minAmount:startNum,
            maxAmount:endNum,
            date:date && moment(date).format("YYYY-MM")
        })
            .then((response) =>{
                console.log(response);
                if(response.data.code == 0) {
                    let param = response.data.data && JSON.parse(response.data.data) || [];
                    let sections = param.map(item => {
                        item.data = item.list;
                        return item;
                    });

                    console.log(sections,'sections')

                    if(param){
                        this.setState({
                            refreshing: false,
                            sections,
                            dataSource:param,
                            totalIn:response.data.totalIn,
                            totalOut:response.data.totalOut
                        })
                    }
                } else {
                    this.setState({
                        refreshing: false,
                        sections: []
                    })
                }
            })
            .catch((error) => {
                this.setState({
                    refreshing: false,
                    sections: []
                })
            });
        this._setModalVisible(false);
    };


    // 每一组中的数据
    renderSectionHeader = ({ section: { totalIn, totalOut, yearMonth } }) => {
        return (
            <View style={{padding:10, borderRadius:10, height: 58, backgroundColor:"#d9d9d9"}}>
                <Text>{yearMonth}月</Text>
                <View style={{marginTop:5,flexDirection:"row"}}>
                    <View><Text style={{color:"grey"}}>支出：{totalIn.toFixed(2)}</Text></View>
                    <View style={{marginLeft:20}}><Text style={{color:"grey"}}>收入：{totalOut.toFixed(2)}</Text></View>
                </View>
            </View>
        );
    };


    render() {

        const nowTimeStamp = Date.now();
        const now = new Date(nowTimeStamp);
        const utcNow = new Date(now.getTime() + (now.getTimezoneOffset() * 60000));
        let minDate = new Date(nowTimeStamp - 1e7);
        const maxDate = new Date(nowTimeStamp);
        if (minDate.getDate() !== maxDate.getDate()) {
            minDate = new Date(maxDate.getFullYear(), maxDate.getMonth(), maxDate.getDate());
        }

        formatDate =(date)=> {
            /* eslint no-confusing-arrow: 0 */
            const pad = n => n < 10 ? `0${n}` : n;
            const dateStr = `${date.getFullYear()}-${pad(date.getMonth() + 1)}`;
            return `${dateStr}>`;
        };


        //弹框
        let modalBackgroundStyle = {
            backgroundColor: this.state.transparent ? 'rgba(0, 0, 0, 0.5)' : 'red',
        };
        let innerContainerTransparentStyle = this.state.transparent
            ? { backgroundColor: '#fff', padding: 10 }
            : null;

        let {data,startNum, endNum,dataSource,refreshing} = this.state;

        return (

            <View>
                <View style={{}}>

                    <View  style={{padding:5,backgroundColor:"#fff",borderRadius:10,marginTop:5, height: 28}}>
                        <TouchableHighlight onPress={this._setModalVisible.bind(this,true)}>
                            <View style={{flexDirection:"row"}}>
                                <Text style={{color:"grey"}}>筛选</Text>
                                <Text style={{marginTop:8 ,marginLeft:10}}><Image style={{width:10,height:10}} source={screening}/></Text>
                                <Text style={{color:"grey",marginLeft:10}}>|</Text>
                                <Text style={{flex:1}}></Text>
                            </View>
                        </TouchableHighlight>

                    </View>

                    <View>


                        <Modal
                            animationType={this.state.animationType}
                            transparent={this.state.transparent}
                            visible={this.state.modalVisible}
                            onRequestClose={() => { this._setModalVisible(false) } }

                        >
                            <View style={[styles.container, modalBackgroundStyle]}>
                                <View style={[styles.innerContainer, innerContainerTransparentStyle]}>


                                    <View style={{flexDirection:"row",justifyContent:"space-around",alignItems:"center"}}>

                                        <View  style={{flex:1,alignItems:'center'}}><Text style={{fontSize:20}}>{""}</Text></View>

                                        <TouchableHighlight onPress={this._setModalVisible.bind(this,false) } style={{}}>
                                            <Image style={{height:30,width:30}} source={close}/>
                                        </TouchableHighlight>


                                    </View>


                                    <WhiteSpace size="xs"/>

                                    <View>
                                        <Text>费用项</Text>
                                        <WhiteSpace size="xs"/>
                                        <Text style={{height:1,backgroundColor:"#cccccc"}}></Text>
                                        <View style={{flexDirection:"row",marginTop:10,flexWrap:"wrap"}}>
                                            {
                                                data.map(item =>

                                                    <Text key={item.id}  onPress={() => this.handleOk(item)} style={{backgroundColor: item.status ? '#ccc' : "#fff",
                                                        borderColor:"#ccc",
                                                        borderWidth:1,
                                                        paddingLeft:15,
                                                        paddingRight:15,
                                                        paddingTop:5,
                                                        paddingBottom:5,
                                                        marginRight:20,
                                                        marginBottom:10}}>{item.name}
                                                    </Text>
                                                )
                                            }

                                        </View>


                                    </View>


                                    <View>
                                        <Text style={{marginTop:30}}>金额</Text>
                                        <WhiteSpace size="xs"/>
                                        <Text style={{height:1,backgroundColor:"#cccccc"}}></Text>


                                        <View style={{flexDirection:"row",marginTop:10}}>
                                            <TextInput
                                                placeholder="最低金额"
                                                keyboardType="numeric"
                                                maxLength={5}
                                                value={startNum}
                                                onChangeText={(text) => this.handleStartChange(text, 'startNum')}
                                                style={{width: 80, padding: 2, borderColor: "#ccc", borderWidth: 1}}
                                            />
                                            <Text style={{marginLeft:5,marginRight:5}}>
                                                ~
                                            </Text>
                                            <TextInput
                                                placeholder="最高金额"
                                                keyboardType="numeric"
                                                maxLength={5}
                                                value={endNum}
                                                onChangeText={(text) => this.handleStartChange(text, 'endNum')}
                                                style={{width: 80, padding: 2, borderColor: "#ccc", borderWidth: 1}}
                                            />
                                        </View>

                                    </View>

                                    <View>
                                        <Text style={{marginTop:30}}>月份</Text>
                                        <WhiteSpace size="xs"/>
                                        <Text style={{height:1,backgroundColor:"#cccccc"}}></Text>
                                        <View>
                                            <DatePicker
                                                mode="month"
                                                extra="全部>"
                                                format={val => formatDate(val)}
                                                value={this.state.date}
                                                maxDate={maxDate}
                                                onChange={this.handelChange}
                                                style={{fontSize:14}}
                                            >
                                                <List.Item><Text>请选择日期：</Text></List.Item>
                                            </DatePicker>
                                        </View>

                                    </View>




                                    <View style={{alignItems:"center"}}>
                                        <Text
                                            onPress={this.submitOk}
                                            style={{margin:20,borderColor:"#ccc",borderWidth:1,padding:5,borderRadius:5}}>
                                            确定
                                        </Text>
                                    </View>

                                </View>
                            </View>
                        </Modal>

                    </View>


                    <View style={{height: Dimensions.get("window").height - 110}}>
                        <SectionList
                            sections={this.state.sections}  //列表的渲染数据源
                            getItemLayout={(data, index) => ( {length: 80, offset: 80 * index, index} )}
                            initialNumToRender={7}  //首次渲染的条数
                            onEndReached={this.onEndReached}  //列表被滚动到距离内容最底部不足onEndReachedThreshold的距离时调用。
                            onEndReachedThreshold={0.1} //定当距离内容最底部还有多远时触发onEndReached回调。注意此参数是一个比值而非像素单位。比如，0.5表示距离内容最底部的距离为当前列表可见长度的一半时触发。
                            onRefresh={this.onRefresh} //下拉刷新
                            refreshing={refreshing} //下拉刷新时候的正在加载的符号，设置为true显示，false隐藏。加载完成，需要设置为false
                            keyExtractor={(item,index)=>`${index}`}
                            renderSectionHeader={this.renderSectionHeader}
                            stickySectionHeadersEnabled={true}
                            ListEmptyComponent={this.ListEmptyComponent}
                            renderItem={({item}) => (  //渲染列表的方式
                                <View>
                                    <View
                                        style={{flexDirection:"row",justifyContent: "space-around",
                                            alignItems: 'center',borderRadius:10,
                                            padding:5,backgroundColor:"#fff"}}>

                                        <View  style={{flex:2}}>
                                            <View style={{alignItems:"center"}}>
                                                <Image style={{height:20,width:20}} source={item.FEE_CODE=="100000" ? rent : item.FEE_CODE=="200001" ? water : item.FEE_CODE=="200002" ? electric : fee}/>
                                            </View>
                                            <WhiteSpace size="xs"/>
                                            <View  style={{alignItems:"center"}}>
                                                <Text style={{fontSize:12,color:"grey"}}>{setDate(item.CREATE_TIME)}</Text>
                                                <WhiteSpace size="xs"/>
                                                <Text style={{fontSize:12,color:"grey"}}>{moment(item.CREATE_TIME).format("hh:mm")}</Text>
                                            </View>
                                        </View>


                                        <View style={{flex:3,marginLeft:5,alignItems:"center"}}>
                                            <Text style={{fontSize:18}}>{item.FEE_NAME}</Text>
                                            <WhiteSpace size="xs"/>
                                            <Text style={{fontSize:12,color:"grey"}}>{moment(item.FROM_DATE).format('YYYY-MM-DD')}{item.FEE_CODE=='100000' && `～${moment(item.TO_DATE).format('YYYY-MM-DD')}`}</Text>
                                        </View>

                                        <View style={{flex:2,alignItems:"center"}}>
                                            <Text style={{fontSize:16}}>{item.capital_type}</Text>
                                        </View>

                                        <View style={{flex:3,alignItems:"center"}}>

                                            {
                                                item.RENT_PRICE >0 ? (<Text style={{fontSize:18,color:"blue"}}>+{item.RENT_PRICE.toFixed(2)}</Text>)
                                                    :(<Text style={{fontSize:18,color:"purple"}}>{item.RENT_PRICE.toFixed(2)}</Text>)
                                            }
                                            <WhiteSpace size="xs"/>

                                            <Text style={{color:item.RENT_PRICE >0 ?'blue':'purple'}}>{item.RENT_PRICE >0 ?'缴费' :'扣费'}</Text>



                                        </View>
                                    </View>
                                    <WhiteSpace size="xs"/>
                                </View>)
                            }
                        />
                    </View>

                </View>
            </View>
        )



    }

    ListEmptyComponent = () => (
        <View style={{alignItems:"center",marginTop:30,backgroundColor:"#fff",padding:50}}>
            <Text>
                暂无所有账单记录
            </Text>
        </View>
    )

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,
    },
    innerContainer: {
        borderRadius: 10,

    }
    ,

});



