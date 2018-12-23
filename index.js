import {AppRegistry, AsyncStorage,NativeAppEventEmitter} from 'react-native';
import React, { Component } from 'react';
import { Provider } from 'react-redux';
import configureStore from './app/components/store/ConfigureStore';
import Root from './app/route';
import Storage from "react-native-storage";
import CodePush from "react-native-code-push";
global.storage = new Storage({
    // 最大容量，默认值1000条数据循环存储
    size: 1000,
    // 存储引擎：对于RN使用AsyncStorage，对于web使用window.localStorage
    // 如果不指定则数据只会保存在内存中，重启后即丢失
    storageBackend: AsyncStorage,
    // 数据过期时间，默认一整天（1000 * 3600 * 24 毫秒），设为null则永不过期
    defaultExpires: null,
    // 读写时在内存中缓存数据。默认启用。
    enableCache: true,
});


import * as wechat from 'react-native-wechat'

import JPushModule from 'jpush-react-native'



const store = configureStore();
class App extends Component {


    componentDidMount (){
        wechat.registerApp('wx2e31892a85dcf51e');


        // CodePush.sync({
        //     deploymentKey: 'KpzQxC50jA2j1AQ1cavPnkZF7wfe4ksvOXqog',
        //     updateDialog: {
        //         optionalIgnoreButtonLabel: '稍后',
        //         optionalInstallButtonLabel: '后台更新',
        //         optionalUpdateMessage: '有新版本了，是否更新？',
        //         title: '更新提示'
        //     },
        //     installMode: CodePush.InstallMode.IMMEDIATE
        // });
        CodePush.sync();

        CodePush.allowRestart();//在加载完了可以允许重启

        JPushModule.initPush();



    }

    render() {
        return (
            <Provider store={store}>
                <Root />
            </Provider>
        )
    }
}



AppRegistry.registerComponent('MyPmsApp', () => App);




