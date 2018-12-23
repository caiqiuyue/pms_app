import React,{Component} from 'react';
import {View, Text, TouchableHighlight, Image, ScrollView, StyleSheet, Platform, CameraRoll,Alert} from 'react-native';
import Dimensions from 'Dimensions';
import {Toast} from 'antd-mobile';

import axios from "../../axios";

import RNFS from 'react-native-fs';
import moment from "moment/moment";

export default class Mine extends React.Component {
    constructor(props) {
        super(props);
        this.state={
            img:[{img:"http://47.95.116.56:8080/file_upload/images/app/convention/H10035_1.png"},
                {img:"http://47.95.116.56:8080/file_upload/images/app/convention/H10035_2.png"}]

        }

    }


    // 保存图片
    download=(uri)=> {
        if (!uri) return null;
        return new Promise((resolve, reject) => {
            let dirs = Platform.OS === 'ios' ? RNFS.LibraryDirectoryPath : RNFS.ExternalDirectoryPath; //外部文件，共享目录的绝对路径（仅限android）
            const downloadDest = `${dirs}/${((Math.random() * 10000000) | 0)}.jpg`;
            const url = uri;
            const options = {
                fromUrl: url,
                toFile: downloadDest,
                background: true,
                begin: (res) => {
                    console.log('begin', res);
                    console.log('contentLength:', res.contentLength / 1024 / 1024, 'M');
                },
            };
            try {
                const ret = RNFS.downloadFile(options);
                ret.promise.then(res => {
                    console.log('success', res);
                    console.log('file://' + downloadDest);
                    let promise = CameraRoll.saveToCameraRoll(downloadDest);
                    promise.then(function(result) {
                        //alert('保存成功');
                        Toast.info('保存成功',1)

                    }).catch(function(error) {
                        Toast.info('保存失败',1)
                    });
                    resolve(res);
                }).catch(err => {
                    console.log(err,'err');

                    reject(new Error(err))
                });
            } catch (e) {

                console.log(e,"e");


                reject(new Error(e))
            }

        })

    }


    comfirmSelected=(item)=>{

        this.download(item)
    };

    cancelSelected=()=>{

    };


    saveImg=(item)=>{
        
        console.log(item);

        Alert.alert('保存','确认保存吗？',
            [
                {text:"取消", onPress:this.cancelSelected},
                {text:"确认", onPress:()=>this.comfirmSelected(item)}
            ],
            { cancelable: false }
        );

    };





    render(){



        return (

            <ScrollView style={{backgroundColor:"#fff",}}>

                {
                    this.state.img.map((item,index)=>

                        <View key={index}>
                            <TouchableHighlight style={{marginBottom:10,paddingBottom:5,borderBottomColor:"#f0f0f0",borderBottomWidth:1}} underlayColor="transparent" onLongPress={()=>this.saveImg(item.img)}>
                                <View>
                                    <Image style={{flex:1,resizeMode:"stretch",width: Dimensions.get('window').width,
                                        height: Dimensions.get('window').height}}
                                           source={{uri:item.img,cache: 'force-cache'}}/>
                                </View>

                            </TouchableHighlight>
                        </View>
                    )
                }






            </ScrollView>







        )

    }
}



