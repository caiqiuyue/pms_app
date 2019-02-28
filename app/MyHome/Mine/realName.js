import React,{Component} from 'react';
import {
    View, CameraRoll, Text, TouchableHighlight, Image, ScrollView, StyleSheet, Platform,
    DeviceEventEmitter
} from 'react-native';
import none from './style/none.jpeg'
import axios from "axios";
import Dimensions from "Dimensions";
import ImagePicker from 'react-native-image-picker';
import {Toast} from 'antd-mobile';

export default class Mine extends React.Component {
    constructor(props) {
        super(props);
        this.state={
            uri1:'',
            uri2:'',
            flag:false,
            tokenKey:'',
            url:'',
            datas:{}
        }

    }


    componentWillMount(){


        const {getParam} = this.props.navigation;
        let datas = getParam("user");
        let data = datas.cardImg



        console.log(data[0],'data[0]');

        this.setState({
            datas
        })

        if(data.length>0){
            this.setState({
                uri1:data[0],
                uri2:data[1],

            })
        }



        //读取
        storage.load({
            key: 'url',
            // autoSync(默认为true)意味着在没有找到数据或数据过期时自动调用相应的sync方法
            autoSync: false
        }).then(ret => {
            this.setState({
                url:ret.url
            })
        }).catch(err => {
            //如果没有找到数据且没有sync方法，
            //或者有其他异常，则在catch中返回
            console.warn(err.message);
            switch (err.name) {
                case 'NotFoundError':
                    break;
                case 'ExpiredError':
                    break;
            }
        });

        //读取
        storage.load({
            key: 'tokenKey',
            // autoSync(默认为true)意味着在没有找到数据或数据过期时自动调用相应的sync方法
            autoSync: false
        }).then(ret => {
            this.setState({
                tokenKey:ret.tokenKey
            })
        }).catch(err => {
            //如果没有找到数据且没有sync方法，
            //或者有其他异常，则在catch中返回
            console.warn(err.message);
            switch (err.name) {
                case 'NotFoundError':
                    break;
                case 'ExpiredError':
                    break;
            }
        });

    }


    componentWillUnmount(){



        console.log(this.state.url,'this.state.url',this.state.tokenKey,'this.state.tokenKey');

        axios.post(`${this.state.url}/contract/getMyContract`, {
            tokenKey:this.state.tokenKey,

        })
            .then((response) =>{
                console.log(response,'合同');

                if (response.data.data) {

                    if(response.data.data.status!=2){
                        DeviceEventEmitter.emit('tab','realName');
                    }else {
                        axios.post(`${this.state.url}/tenant/getCostBill`, {
                            type:null,
                            tokenKey:this.state.tokenKey,

                        })
                            .then((response) =>{
                                console.log(response);
                                if(response.data.code==0){

                                    response.data.data.map(item=>{
                                        if(item.feeCode== "100101"){
                                            const { navigate } = this.props.navigation;
                                            navigate('AllBills',{ user:"" });
                                        }
                                    })


                                }
                            })

                            .catch(function (error) {
                                console.log(error);
                            });
                    }

                }else if(response.data.message=='用户是纸质合同，没有电子合同'){
                    axios.post(`${this.state.url}/tenant/getCostBill`, {
                        type:null,
                        tokenKey:this.state.tokenKey,

                    })
                        .then((response) =>{
                            console.log(response);
                            if(response.data.code==0){

                                response.data.data.map(item=>{
                                    if(item.feeCode== "100101"){
                                        const { navigate } = this.props.navigation;
                                        navigate('AllBills',{ user:"" });
                                    }
                                })


                            }
                        })

                        .catch(function (error) {
                            console.log(error);
                        });
                }



            })
            .catch(function (error) {
                console.log(error);

            });




    }

    //上传图片
    uploadPic = (item) => {

        const options = {
            title: '选择图片',
            cancelButtonTitle: '取消',
            takePhotoButtonTitle: '拍照',
            chooseFromLibraryButtonTitle: '选择照片',
            cameraType: 'back',
            mediaType: 'photo',
            videoQuality: 'high',
            durationLimit: 10,
            maxWidth: 600,
            maxHeight: 400,
            quality: 1,
            angle: 0,
            allowsEditing: false,
            noData: false,
            storageOptions: {
                skipBackup: true
            }
        };

        ImagePicker.showImagePicker(options, (response) => {
            console.log('Response = ', response);


            if (response.didCancel) {
                console.log('User cancelled photo picker');
            }
            else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
            }
            else if (response.customButton) {
                console.log('User tapped custom button: ', response.customButton);
            }
            else {

                console.log(response.data);

                if(item==1){
                    this.setState({
                        uri1: `data:image/png;base64,${response.data}`
                    });



                }else {
                    this.setState({
                        uri2: `data:image/png;base64,${response.data}`
                    });
                }


            }
        });

    }

    submitBtn=()=>{

        let {uri1,uri2,tokenKey,url,datas} = this.state;


        if(uri1.indexOf('http://47.95.116.56:8080')!=-1){

            Toast.info('请上传身份证正面照',1)
            return
        }

        if(uri2.indexOf('http://47.95.116.56:8080')!=-1){

            Toast.info('请上传身份证反面照',1)
            return
        }

        if(uri1==''||uri2==''){
            Toast.info('请上传照片',1)

            return
        }else{


            if(this.state.flag){

                Toast.info('已上传，不可重复上传',1)

            }else{

                axios.post('https://47.95.116.56:8443/file_upload/addCardFiles', {
                    idCard1:uri1,
                    idCard2:uri2,
                })
                    .then( (response)=> {
                        console.log(response);

                        if(response.data.code==0){

                            Toast.info('验证通过,您已上传成功',2)
                            datas.name = response.data.cardName
                            datas.cardCode = response.data.idCard
                            datas.cardAddress = response.data.addressWords;

                            let a = response.data.addressWords+''

                            this.setState({
                                flag:true,datas
                            })
                            let mag = response.data.msg;
                            axios.post(`${url}/my/saveMyCardMsg`, {
                                tokenKey:tokenKey,
                                msg:mag,
                                idCard: response.data.idCard,
                                cardSex: response.data.cardSex,
                                addressWords: a,
                                cardName: response.data.cardName,


                            })
                                .then( (response)=> {
                                    console.log(response);
                                    if(response.data.code==1){
                                        Toast.info(response.data.message,1)

                                    }

                                })
                                .catch(function (error) {
                                    console.log(error);

                                });
                        }else if(response.data.code==1){
                            Toast.info(response.data.msg==''?response.data:response.data.msg,1);
                        }

                    })
                    .catch(function (error) {
                        console.log(error);
                    });
            }


        }



    };


    render(){

        let{flag} = this.state;
        return (

            <View style={{height:Dimensions.get("window").height,backgroundColor:"#fff",}}>
                <ScrollView>
                    <View style={{flex:1,
                        ...Platform.select({
                            android:{
                                paddingBottom:100,
                            },
                            ios:{
                                paddingBottom:50,
                            }
                        }),
                        }}>


                        <View style={{padding:20}}>

                            <View style={{height:210,borderWidth:5,borderColor:"#f0f0f0"}}>
                                <Image style={{height:200,width:"100%",resizeMode:"contain"}}
                                       source={this.state.uri1=='' ? none : {uri:this.state.uri1}}
                                       />
                            </View>

                            <View style={{alignItems:"center"}}>
                                <TouchableHighlight onPress={()=>{this.uploadPic(1)}} underlayColor="#f0f0f0" style={{marginTop:10,marginBottom:20,width:"50%",padding:5,borderRadius:5,borderWidth:1,borderColor:"#666",alignItems:"center"}}>
                                    <Text style={{}}>请上传身份证正面照</Text>
                                </TouchableHighlight>
                            </View>




                            <View style={{height:210,borderWidth:5,borderColor:"#f0f0f0"}}>
                                <Image style={{height:200,width:"100%",resizeMode:"contain"}}
                                       source={this.state.uri2=='' ? none : {uri:this.state.uri2}}
                                />
                            </View>

                            <View style={{alignItems:"center"}}>

                                <TouchableHighlight onPress={()=>{this.uploadPic(2)}} underlayColor="#f0f0f0"  style={{marginTop:10,marginBottom:20,width:"50%",padding:5,borderRadius:5,borderWidth:1,borderColor:"#666",alignItems:"center"}}>
                                    <Text style={{}}>请上传身份证反面照</Text>
                                </TouchableHighlight>
                            </View>


                            {this.state.datas.cardCode&&
                            <View style={{padding:10}}>
                                <Text>姓名:{this.state.datas.name}</Text>
                                <Text>身份证号:{this.state.datas.cardCode}</Text>
                                <Text>住址:{this.state.datas.cardAddress}</Text>
                            </View>}

                            <View style={{alignItems:"center",marginBottom:30}}>

                                <TouchableHighlight underlayColor={flag ? "#fff" : "#367d80"} style={{padding:10,
                                    borderWidth:1,borderColor:flag ? "#000" : "#fff",width:'100%',backgroundColor:flag ? "#fff" : "#ef813a",
                                    borderRadius:10}} onPress={this.submitBtn }>
                                    <Text

                                        style={{fontSize:16,textAlign:"center",color:flag ? "#f0f0f0":"#fff"}}>
                                        确定
                                    </Text>
                                </TouchableHighlight>

                            </View>


                        </View>
                    </View>
                </ScrollView>
            </View>

        )

    }
}


const styles = StyleSheet.create({
    img: {
        height:20,
        width:20,
    },

    img2: {
        height:12,
        width:12
    },

    imgView:{
        marginRight:10
    }
    

});

