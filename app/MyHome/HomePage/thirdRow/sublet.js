import React, { Component } from 'react';
import {
    TouchableHighlight,
    StyleSheet,
    Text,
    Alert,
    Picker,
    View,
    Image,
    TextInput,

} from 'react-native';




import {WhiteSpace,DatePicker,List,Toast} from 'antd-mobile';

import axios from '../../../axios'
import Dimensions from 'Dimensions'
import moment from "moment/moment";

export default class Clean extends Component {

    constructor(props) {
        super(props);
        this.state = {
            data:{},
            status:"",
            keeping:"",
            flag:false,
        };
    }





    componentWillMount() {
        this.props.navigation.getParam = (name) => {
            let params = this.props.navigation && this.props.navigation.state && this.props.navigation.state.params || {};
            if(name) {
                return params[name];
            }
            return params;
        }
        const {getParam} = this.props.navigation;
        let datas = getParam("user")
        const data = datas.data;



        this.setState({
            status:data.status === "0" ? 0 : data.status == 1 ? 1
                : data.status == 3 ? 3:data.status == 4 ? 4 : 11,
            data,keeping:datas.keeping
        })

    }


    submitBtn = ()=> {

        let {flag} = this.state;

        if(flag){
            Toast.info('已提交申请，不可重复申请',1)
        }else{
            axios.post(`/self/submitRequisition`, {
                type: "2",
            })
                .then((response)=> {
                    console.log(response);

                    this.setState({
                        flag:true
                    })

                    Toast.info('申请成功，等待生成账单',1);

                })
                .catch(function (error) {
                    console.log(error);
                });
        }



    };



    refuse=()=>{
        if(this.state.flag){
            Toast.info('已提交申请，不可重复申请',1)
        }else{
            this.setState({
                flag:false,
                status: 11
            })
        }
    }

    render() {

        let {keeping,status,flag,data} = this.state;

        return (


            <View style={{backgroundColor:"#fff",height: Dimensions.get('window').height}}>
                {/*//status        状态（申请0、已确认1、生成账单2、已完成3、已拒绝4）*/}
                {
                    status==0 ?
                        (<View style={{alignItems:"center",marginTop:30}}>
                            <Text>
                                已提交申请，正在等待管家确认
                            </Text>
                        </View>) :
                        status==1 ?
                            (<View style={{alignItems:"center",marginTop:30}}>
                                <Text>
                                    已确认申请，正在等待生成账单
                                </Text>
                            </View>):

                                // status==4 ?
                                //     (<View style={{alignItems:"center",marginTop:30}}>
                                //         <Text>
                                //             已拒绝，拒绝理由:{data.reason?data.reason:'--'},(请联系公寓管家或到前台办理）
                                //         </Text>
                                //
                                //         <View style={{alignItems:"center",marginTop:30}}>
                                //             <TouchableHighlight underlayColor={flag ? "#fff" : "#367d80"} style={{padding:10,
                                //                 borderWidth:1,borderColor:"#fff",width:100,backgroundColor:flag ? "#fff" : "#54c6cc",
                                //                 borderRadius:10}} onPress={this.refuse}>
                                //                 <Text
                                //
                                //                     style={{fontSize:16,textAlign:"center",color:flag ? "#f0f0f0":"#fff"}}>
                                //                     确定
                                //                 </Text>
                                //             </TouchableHighlight>
                                //         </View>
                                //
                                //     </View>):
                                    (<View style={{padding:10, alignItems: 'center',}}>

                                        <View>
                                            <View>
                                                <Text>政策：</Text>
                                                <Text style={{color:"grey"}}>{keeping}</Text>
                                                {/*<WhiteSpace size="lg"/>*/}
                                                {/*<Text style={{color:"grey"}}>2.转租期间涉及到管家带人看房，请做好配合。</Text>*/}
                                                {/*<WhiteSpace size="lg"/>*/}
                                                {/*<Text style={{color:"grey"}}>2.申请转租，立即生效。转租成功后，需支付50%房租转租服务费。剩余房费和押金将在退款时候结算。</Text>*/}
                                                {/*<WhiteSpace size="lg"/>*/}

                                                <View style={{alignItems:"center"}}>
                                                    <TouchableHighlight underlayColor={flag ? "#fff" : "#367d80"} style={{padding:10,
                                                        borderWidth:1,borderColor:"#fff",width:100,backgroundColor:flag ? "#fff" : "#f17e3a",
                                                        borderRadius:10}} onPress={this.submitBtn }>
                                                        <Text

                                                            style={{fontSize:16,textAlign:"center",color:flag ? "#f0f0f0":"#fff"}}>
                                                            申请转租
                                                        </Text
>
                                                    </TouchableHighlight>
                                                </View>

                                            </View>
                                        </View>
                                    </View>)
                }



            </View>


        );
    }

}

