package com.mypmsapp;

import com.facebook.react.ReactActivity;
import com.yunpeng.alipay.AlipayPackage;
import cn.jpush.reactnativejpush.JPushPackage;

import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import java.util.Arrays;
import java.util.List;

public class MainActivity extends ReactActivity {

    /**
     * Returns the name of the main component registered from JavaScript.
     * This is used to schedule rendering of the component.
     */
    @Override
    protected String getMainComponentName() {
        return "MyPmsApp";
    };

//    @Override
    protected List<ReactPackage> getPackages() {
        return Arrays.<ReactPackage>asList(
                new MainReactPackage(),
                new AlipayPackage() // <--- ADD HERE
        );
    }





}
