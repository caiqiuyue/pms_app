import React, { Component } from 'react';
import {
    TouchableHighlight,Keyboard,
    StyleSheet,
    Text,
    Alert,
    Picker,
    View,
    Image,
    TextInput,
    ScrollView

} from 'react-native';


import {WhiteSpace,DatePicker,List,Toast} from 'antd-mobile';

import axios from '../../../axios'
import ScoreAction from './ScoreAction'
import Dimensions from 'Dimensions'
import moment from 'moment'
import selectIcon from '../../../pay/selectIcon.png'
import s1 from '../../GoodSelect/style/234.png'



const CustomChildren = props => {
    return (
        <TouchableHighlight style={{}} underlayColor="transparent" onPress={props.onClick}>

            <View style={{flexDirection:"row",width:"100%",borderColor:"#ccc",borderWidth:1,borderRadius:5,overflow:'hidden'}}>
                <View style={{flex:3,padding:8}}><Text style={{color:"grey"}}>{props.extra}</Text></View>
                <View style={{flex:1,padding:8,backgroundColor:'#f7f7f7',alignItems:"center",justifyContent:"center",}}><Image style={{height:10,width:15}} source={s1}/></View>
            </View>
        </TouchableHighlight>
    )
};



export default class Clean extends Component {

    constructor(props) {
        super(props);
        this.state = {
            noOneStatus:[
                {
                    value:"是",
                    flag:false
                },
                {
                    value:"否",
                    flag:false
                },


            ],
            date:"",
            text:"",

            evaluationText:"",
            code:3,
            starCode:0,
            flag:false,
            params:{},
            count:1,
            status:null,
            noOneStr:null,
            padd:0


        };
    }





    focus=()=>{

        this.setState({
            padd:Dimensions.get('window').height/2+100
        })

    }



    componentWillMount() {
        this.props.navigation.getParam = (name) => {
            let params = this.props.navigation && this.props.navigation.state && this.props.navigation.state.params || {};
            if(name) {
                return params[name];
            }
            return params;
        }


        let {code} = this.state;
        const {getParam} = this.props.navigation;
        const datas = getParam("user");
        let param = datas.data;

        this.setState({
            date:new Date(),
            params:param,
            count:datas.count,

        });


        console.log(param);
        if(param && param.length !== 0){
            let status = param[0].status;
            this.setState({
                status:param[0].status

            });

            if (status == "0" || status == "1") {
                this.setState({
                    code: 2
                })
            } else if (status == "3") {
                this.setState({
                    code: 3
                })
            } else{
                this.setState({
                    code: 1
                })
            }
        }else {
            this.setState({
                code: 1
            })
        }

    }


    //星星评价
    handelGetScore=(code)=>{
        this.setState({
            starCode:code
        })
    }


    noRepeat=()=>{
        Toast.info('已提交申请，不可重复提交',1);
    }

    //提交保洁单
    submitBtn = ()=> {

        Date.prototype.Format = function (fmt) { //author: meizz
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
        }

        let {date,text,flag,noOneStr} = this.state;

        
        if(date==""){
            Toast.info("请选择保洁时间", 1);
            return
        }
        if(text.trim()==""){
            Toast.info("请输入保洁内容", 1);
            return
        }


        if(noOneStr==null){
            Toast.info("请选择是否可无人进入保洁", 1);
            return
        }

        if(date=="" && text.trim()==""){
            Toast.info("请输入保洁内容和保洁日期", 1);

        }else{

            this.setState({
                flag:true
            },()=> {

                axios.post(`/tenant/submitCleanup`, {
                    content: text,
                    aboutDate: moment(date).format('YYYY-MM-DD HH:mm:ss'),
                    noPerson: noOneStr,


                })
                    .then((response) => {
                        Toast.info(response.data.message, 1);
                        console.log(response);

                        this.setState({
                            flag:response.data.code==0?true:false
                        })


                    })
                    .catch((error) =>{
                        console.log(error);
                        this.setState({
                            flag:false
                        })
                    });


            })





        }

    };

    //无人是否可进
    noOneStatus=(item)=>{

        let {noOneStatus} = this.state;

        noOneStatus.map((_item)=>{
            if(_item.value==item.value){
                _item.flag=!item.flag;
            }else {
                _item.flag = false
            }

        })

        this.setState({
            noOneStatus
        },()=>{
            if(item.flag){
                this.setState({
                    noOneStr:item.value=='是'?0:1
                })
            }else {
                this.setState({
                    noOneStr:item.value==null
                })
            }
        })

    }

    cancelSelected=()=>{

    };


    //历史记录
    showHistory=()=>{
        const { navigate } = this.props.navigation;
        navigate('CleanHistory',{ history: "" });

    };

    comfirmSelected=()=>{
        //撤销保洁服务
        const {getParam} = this.props.navigation;
        const param = getParam("user");
        const { navigate } = this.props.navigation;


        axios.post(`/tenant/submitCleanup`, {
            cleanupId: param.data[0].cleanupId,
            status:"2"


        })
            .then( (response)=> {
                console.log(response);
                Toast.info(response.data.message, 1);
                this.setState({
                    flag:true
                })


            })
            .catch(function (error) {
                console.log(error);
            });




    }
    //撤销
    undoBtn=()=>{

        if(this.state.flag){
            Toast.info('已提交申请，不可重复提交',1)
        }else{

            Alert.alert('撤销','确认撤销吗？',
                [
                    {text:"取消", onPress:this.cancelSelected},
                    {text:"确认", onPress:this.comfirmSelected}
                ],
                { cancelable: false }
            );
        }



    }


    setDates = (date)=>{
        console.log(moment(date).format("HH"));
        if(moment(date).format("HH")>18){
            Toast.info('预约保洁最晚不超过18点')
            return
        }
        this.setState({
            date
        })
    }



    //评价
    evaluationBtn = ()=> {
        const {getParam} = this.props.navigation;
        const param = getParam("user");
        let {evaluationText,starCode} = this.state;
        const { navigate } = this.props.navigation;

        if(this.state.flag){
            Toast.info('已提交评价，不可重复提交',1)
        }else{


            if(starCode==0){
                Toast.info('请点亮星星进行评价',1)
                return
            }

            axios.post(`/tenant/submitCleanup`, {
                cleanupId: param.data[0].cleanupId,
                star:starCode,
                evaluate:evaluationText,
                status:"4"


            })
                .then( (response) =>{
                    console.log(response);
                    Toast.info(response.data.message, 1);
                    this.setState({
                        flag:true
                    })




                })
                .catch(function (error) {
                    console.log(error);
                });
        }




    };


    render() {
        //获取个人保洁历史

        

        //选择保洁日期
        const nowTimeStamp = Date.now();
        const now = new Date(nowTimeStamp);
        const utcNow = new Date(now.getTime() + (now.getTimezoneOffset() * 60000));
        let minDate = new Date(nowTimeStamp);
        const maxDate = new Date(nowTimeStamp + 1e7);
        if (minDate.getDate() !== maxDate.getDate()) {
            minDate = new Date(maxDate.getFullYear(), maxDate.getMonth(), maxDate.getDate());
        }

        function formatDate(date) {
            const pad = n => n < 10 ? `0${n}` : n;
            const dateStr = `${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
            const timeStr = `${pad(date.getHours())}:00`;
            return `${dateStr} ${timeStr}`;
        }




        let {flag,params} = this.state;

        return (

            <View style={{ alignItems: 'center',backgroundColor:"#fff",height: Dimensions.get('window').height,}}>


                    <ScrollView showsVerticalScrollIndicator={false}>
                        <View  style={{paddingBottom:this.state.padd}}>
                            <View  style={{backgroundColor:"#fff"}}>
                                <WhiteSpace size="xl"/>

                                {
                                    this.state.code == 1 ? (
                                // 预约保洁
                                <View>
                                    <View>
                                        <View style={{borderLeftWidth:2,borderLeftColor:"#60a9f8",paddingLeft:5}}><Text>保洁政策：</Text></View>
                                        <WhiteSpace size="lg"/>
                                        <Text style={{color:"grey"}}>一个月免费保洁两次，超过按次收费</Text>

                                        <View style={{marginTop:10,marginBottom:10,height:2,backgroundColor:"#f0f0f0"}} />
                                        <View style={{borderLeftWidth:2,borderLeftColor:"#60a9f8",paddingLeft:5}}>
                                            <Text>本月第{this.state.count}次保洁</Text>
                                        </View>
                                        <View style={{marginTop:10,marginBottom:10,height:2,backgroundColor:"#f0f0f0"}} />

                                        <View style={{borderLeftWidth:2,borderLeftColor:"#60a9f8",paddingLeft:5}}><Text>无人可进房间保洁:</Text></View>
                                        <WhiteSpace size="lg"/>
                                        <View style={{flexDirection:"row",flexWrap:"wrap"}}>

                                            {
                                                this.state.noOneStatus.map((item,index)=>
                                                    <TouchableHighlight
                                                        onPress={()=>{this.noOneStatus(item)}} key={index} underlayColor="transparent">
                                                        <View style={{flexDirection:"row",marginRight:15,alignItems:"center"}}>
                                                            <View style={{backgroundColor:item.flag ? "#f17e3a" :'#fff',marginRight:5,
                                                                width:20,height:20,borderRadius:10,borderColor:"#ccc",borderWidth:1,overflow:"hidden"}} >
                                                                <Image style={{width:20,height:20}} source={selectIcon}/>
                                                            </View>
                                                            <Text>{item.value}</Text>

                                                        </View>
                                                    </TouchableHighlight>
                                                )
                                            }



                                        </View>
                                        <View style={{marginTop:10,marginBottom:10,height:2,backgroundColor:"#f0f0f0"}} />



                                        <View style={{borderLeftWidth:2,borderLeftColor:"#60a9f8",paddingLeft:5}}><Text>请选择保洁日期:</Text></View>
                                        <WhiteSpace size="lg"/>
                                        <View>
                                            <DatePicker
                                                value={this.state.date}
                                                extra=""
                                                format={val => formatDate(val)}
                                                minDate={minDate}
                                                onChange={date => this.setDates(date)}
                                            >
                                                <CustomChildren></CustomChildren>
                                            </DatePicker>
                                        </View>
                                        <WhiteSpace size="lg"/>
                                    </View>


                                    <View>
                                        <View>
                                            <TextInput
                                                underlineColorAndroid="transparent"
                                                multiline={true}
                                                style={{height: 90,width:300,
                                                    borderColor:"grey",borderWidth:1,padding: 0,
                                                    borderRadius:5}}
                                                placeholder="请填写保洁内容"
                                                onFocus={this.focus}
                                                onChangeText={(text) => this.setState({text})}
                                            />

                                        </View>





                                        <View style={{alignItems:"center",marginTop:30}}>

                                            {
                                                flag?<TouchableHighlight underlayColor={"#fff"} style={{padding:8,
                                                        borderWidth:1,borderColor:"#000",width:100,backgroundColor:"#fff",
                                                        borderRadius:5}} onPress={this.noRepeat }>
                                                        <Text

                                                            style={{textAlign:"center",color:"#f0f0f0"}}>
                                                            确定
                                                        </Text>
                                                    </TouchableHighlight>
                                                    :
                                                    <TouchableHighlight underlayColor={"#fff"} style={{alignItems:"center",padding:8,
                                                        borderWidth:1,borderColor:"#fff",backgroundColor:"#f17e3a",width:100,
                                                        borderRadius:5}} onPress={this.submitBtn }>
                                                        <Text
                                                            style={{textAlign:"center",color:"#fff"}}>
                                                            确定
                                                        </Text>
                                                    </TouchableHighlight>
                                            }


                                        </View>

                                    </View>
                                </View>
                                        ) : this.state.code == 2 ? (

                                // 等待保洁
                                <View style={{padding:10}}>

                                    {
                                        this.state.status == "0" ?
                                    (<View>

                                        <Text>「等待接受请求」</Text>
                                        <WhiteSpace size="xl"/>
                                    </View>):
                                    (<View>
                                        <Text>{`保洁人员已经接受请求，将于${params[0].comeDate}上门保洁。`}</Text>
                                        {/*<Text>保洁人员已经接受请求，将于上门保洁。</Text>*/}
                                        <WhiteSpace size="xl"/>
                                        <Text>「等待上门保洁」</Text>
                                        <WhiteSpace size="xl"/>
                                        <Text style={{color:"red"}}>管家留言:{params[0].operationMsg}</Text>
                                    </View>)
                                    }



                                    <View  style={{alignItems:"center"}}>

                                        <TouchableHighlight underlayColor={flag ? "#fff" : "#367d80"} style={{padding:10,
                                            borderWidth:1,borderColor:flag ? "#000" : "#fff",width:100,backgroundColor:flag ? "#fff" : "#f17e3a",
                                            borderRadius:10}} onPress={this.undoBtn }>
                                            <Text

                                                style={{fontSize:16,textAlign:"center",color:flag ? "#f0f0f0":"#fff"}}>
                                                撤销
                                            </Text>
                                        </TouchableHighlight>



                                    </View>

                                </View>
                                    ) : (

                                // 待评价
                                <View>
                                    {params[0].butlerMsg?<Text style={{fontSize:16}}>管家留言:{params[0].butlerMsg}</Text>:null}
                                    <Text style={{fontSize:16,marginTop:10}}>保洁已经完成，请对结果进行评价</Text>

                                    <WhiteSpace size="xl"/>
                                        {/*星星评价*/}
                                        <ScoreAction scoreCode={0} disabled={false} handleGetScore={this.handelGetScore}/>

                                    <WhiteSpace size="lg"/>
                                    <View>
                                        <View>
                                            <TextInput
                                                multiline={false}
                                                style={{height: 90,width:300,
                                                    borderColor:"grey",borderWidth:1,
                                                    borderRadius:5}}

                                                placeholder="请填写评价内容"
                                                onChangeText={(evaluationText) => this.setState({evaluationText})}
                                            />

                                        </View>
                                        <WhiteSpace size="lg"/>

                                        <View style={{alignItems:"center"}}>

                                            <TouchableHighlight underlayColor={flag ? "#fff" : "#367d80"} style={{padding:10,
                                                borderWidth:1,borderColor:flag ? "#000" : "#fff",width:100,backgroundColor:flag ? "#fff" : "#f17e3a",
                                                borderRadius:10}} onPress={this.evaluationBtn }>
                                                <Text

                                                    style={{fontSize:16,textAlign:"center",color:flag ? "#f0f0f0":"#fff"}}>
                                                    确定
                                                </Text>
                                            </TouchableHighlight>

                                            {/*<TouchableHighlight underlayColor={"#f0f0f0"} style={{padding:10,*/}
                                                {/*borderWidth:1,borderColor:"grey",width:100,*/}
                                                {/*borderRadius:10}} onPress={this.evaluationBtn }>*/}
                                                {/*<Text*/}

                                                    {/*style={{fontSize:16,textAlign:"center",color:"#000"}}>*/}
                                                    {/*确定*/}
                                                {/*</Text>*/}
                                            {/*</TouchableHighlight>*/}
                                        </View>

                                    </View>

                                </View>
                                    )
                                }
                            </View>
                        </View>
                    </ScrollView>

            </View>
        );
    }







}

const styles = StyleSheet.create({
    container: {
        // flex: 1,
        justifyContent: 'center',

    },
    innerContainer: {
        borderRadius: 10,
        //alignItems: 'center',
    },
    starIcon:{
        width:20,
        height:20
    },
    dashItem: {
        height: 1,
        width: 1,
        marginRight: 2,
    }
});
