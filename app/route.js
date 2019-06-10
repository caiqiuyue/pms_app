import { createStackNavigator, SwitchNavigator } from 'react-navigation';
import WelcomePage from './main/WelcomePage';
import Home from './main/Tab/tab';
import Login from './main/Login/Login';
import Register from './main/Login/Register';
import FindPassword from './main/Login/findPassword';
import Repair from './MyHome/HomePage/firstRow/repair';
import Clean from './MyHome/HomePage/firstRow/clean';
import RepairHistory from './MyHome/HomePage/firstRow/repairHistory';
import CleanHistory from './MyHome/HomePage/firstRow/cleanHistory';
import Rent from './MyHome/HomePage/secondRow/rent';
import Electricity from './MyHome/HomePage/secondRow/electricity';
import RefondRent from './MyHome/HomePage/thirdRow/refundRent';
import ForRenewal from './MyHome/HomePage/thirdRow/forRenewal';
import Sublet from './MyHome/HomePage/thirdRow/sublet';
import ChangeRooms from './MyHome/HomePage/thirdRow/changeRooms';
import Jumpto from './MyHome/HomePage/jumpto';
import Water from './MyHome/HomePage/secondRow/water';
import AllBills from './MyHome/HomePage/secondRow/allBills';
import Bill from './MyHome/Mine/myBill';
import SelectItem from './MyHome/GoodSelect/select';
import SeeRoom from './MyHome/GoodSelect/seeRoom';
import Pay from './pay/pay';
import RealNamePay from './pay/realNamePay';
import AddBankCard from './pay/addBankCard';
import YiPay from './pay/yiPay';
import PayOk from './pay/payOk';
import UnBankCard from './pay/unBankCard';
import selectRom from './MyHome/GoodSelect/selectRom';
import determineRoom from './MyHome/GoodSelect/determineRoom';
import RefundRentDetail from './MyHome/HomePage/thirdRow/refundRentDetail';
import ForRenewalDetail from './MyHome/HomePage/thirdRow/forRenewalDetail';
import SubletDetail from './MyHome/HomePage/thirdRow/subletDetail';
import ChangeDetail from './MyHome/HomePage/thirdRow/changeRoomsDetail';
import Suggestions from './MyHome/HomePage/fourthRow/suggestions';
import Contract from './MyHome/Mine/contract';
import LiveKnow from './MyHome/Mine/liveKnow';
import YuE from './MyHome/Mine/yu_e';
import Wallet from './MyHome/Mine/wallet';
import MineYuYue from './MyHome/Mine/MineYuYue';
import LifeService from './MyHome/Mine/lifeService';
import Signature from './MyHome/Mine/signature';
import SelfService from './MyHome/Mine/selfService';
import FeedbackSuggestions from './MyHome/Mine/feedbackSuggestions';
import RealName from './MyHome/Mine/realName';
import BankCard from './MyHome/Mine/bankCard';
import ChangePhoneNum from './MyHome/Mine/changePhoneNum';
import Setup from './MyHome/Mine/setup';
import TopUp from './MyHome/Mine/topUp';
import TopUpUrl from './MyHome/Mine/topUpUrl';
import Withdrawalurl from './MyHome/Mine/withdrawalurl';
import WalletDetail from './MyHome/Mine/walletDetail';
import Withdrawal from './MyHome/Mine/withdrawal';
import Coupons from './MyHome/Mine/coupons';
import EmergencyContact from './MyHome/Mine/emergencyContact';
import WalletPay from './pay/walletPay';


//import MyHomeRoom from './MyHome/HomePage/homePage1';

// import AddBankCard from './pay/addBankCard';


const SimpleApp = createStackNavigator({
    UnBankCard:{
        screen: UnBankCard,
        navigationOptions: {
            headerTitle:'解绑卡',
            headerBackTitle:null,
            headerStyle: {
                backgroundColor: '#f17e3a'
            },
            headerTitleStyle: {
                color: '#fff'
            },
            headerTintColor:"#fff"
        }
    },
    Signature:{
        screen: Signature,
        navigationOptions: {
            headerTitle:'签合同',
            headerBackTitle:null,
            headerStyle: {
                backgroundColor: '#f17e3a'
            },
            headerTitleStyle: {
                color: '#fff'
            },
            headerTintColor:"#fff"
        }
    },
    Jumpto:{
        screen: Jumpto,
        navigationOptions: {
            headerTitle:'',
            headerBackTitle:null,
            headerStyle: {
                backgroundColor: '#f17e3a'
            },
            headerTitleStyle: {
                color: '#fff'
            },
            headerTintColor:"#fff"
        }
    },
    EmergencyContact:{
        screen: EmergencyContact,
        navigationOptions: {
            headerTitle:'紧急联系人',
            headerBackTitle:null,
            headerStyle: {
                backgroundColor: '#f17e3a'
            },
            headerTitleStyle: {
                color: '#fff'
            },
            headerTintColor:"#fff"
        }
    },
    Coupons:{
        screen: Coupons,
        navigationOptions: {
            headerTitle:'优惠券',
            headerBackTitle:null,
            headerStyle: {
                backgroundColor: '#f17e3a'
            },
            headerTitleStyle: {
                color: '#fff'
            },
            headerTintColor:"#fff"
        }
    },
    WalletDetail:{
        screen: WalletDetail,
        navigationOptions: {
            headerTitle:'钱包明细',
            headerBackTitle:null,
            headerStyle: {
                backgroundColor: '#f17e3a'
            },
            headerTitleStyle: {
                color: '#fff'
            },
            headerTintColor:"#fff"
        }
    },
    Withdrawalurl:{
        screen: Withdrawalurl,
        navigationOptions: {
            headerTitle:'提现',
            headerBackTitle:null,
            headerStyle: {
                backgroundColor: '#f17e3a'
            },
            headerTitleStyle: {
                color: '#fff'
            },
            headerTintColor:"#fff"
        }
    },
    TopUpUrl:{
        screen: TopUpUrl,
        navigationOptions: {
            headerTitle:'充值',
            headerBackTitle:null,
            headerStyle: {
                backgroundColor: '#f17e3a'
            },
            headerTitleStyle: {
                color: '#fff'
            },
            headerTintColor:"#fff"
        }
    },

    TopUp:{
        screen: TopUp,
        navigationOptions: {
            headerTitle:'充值',
            headerBackTitle:null,
            headerStyle: {
                backgroundColor: '#f17e3a'
            },
            headerTitleStyle: {
                color: '#fff'
            },
            headerTintColor:"#fff"
        }
    },

    Withdrawal:{
        screen: Withdrawal,
        navigationOptions: {
            headerTitle:'提现',
            headerBackTitle:null,
            headerStyle: {
                backgroundColor: '#f17e3a'
            },
            headerTitleStyle: {
                color: '#fff'
            },
            headerTintColor:"#fff"
        }
    },

    Wallet:{
        screen: Wallet,
        navigationOptions: {
            headerTitle:'钱包',
            headerBackTitle:null,
            headerStyle: {
                backgroundColor: '#f17e3a',borderColor:"#f00"
            },
            headerTitleStyle: {
                color: '#fff'
            },
            headerTintColor:"#fff"
        }
    },


    Sublet:{
        screen: Sublet,
        navigationOptions: {
            headerTitle:'转租申请单',
            headerBackTitle:null,
            headerStyle: {
                backgroundColor: '#f17e3a'
            },
            headerTitleStyle: {
                color: '#fff'
            },
            headerTintColor:"#fff"
        }
    },

    YiPay:{
        screen: YiPay,
        navigationOptions: {
            headerTitle:'银行卡支付',
            headerBackTitle:null,
            headerStyle: {
                backgroundColor: '#f17e3a'
            },
            headerTitleStyle: {
                color: '#fff'
            },
            headerTintColor:"#fff"
        }
    },

    WalletPay:{
        screen: WalletPay,
        navigationOptions: {
            headerTitle:'钱包支付',
            headerBackTitle:null,
            headerStyle: {
                backgroundColor: '#f17e3a'
            },
            headerTitleStyle: {
                color: '#fff'
            },
            headerTintColor:"#fff"
        }
    },

    AddBankCard:{
        screen: AddBankCard,
        navigationOptions: {
            headerTitle:'添加银行卡',
            headerBackTitle:null,
            headerStyle: {
                backgroundColor: '#f17e3a'
            },
            headerTitleStyle: {
                color: '#fff'
            },
            headerTintColor:"#fff"
        }
    },

    RealNamePay:{
        screen: RealNamePay,
        navigationOptions: {
            headerTitle:'实名认证',
            headerBackTitle:null,
            headerStyle: {
                backgroundColor: '#f17e3a'
            },
            headerTitleStyle: {
                color: '#fff'
            },
            headerTintColor:"#fff"
        }
    },

    BankCard:{
        screen: BankCard,
        navigationOptions: {
            headerTitle:'退款银行卡',
            headerBackTitle:null,
            headerStyle: {
                backgroundColor: '#f17e3a'
            },
            headerTitleStyle: {
                color: '#fff'
            },
            headerTintColor:"#fff"
        }
    },

    Setup:{
        screen: Setup,
        navigationOptions: {
            headerTitle:'设置',
            headerBackTitle:null,
            headerStyle: {
                backgroundColor: '#f17e3a'
            },
            headerTitleStyle: {
                color: '#fff'
            },
            headerTintColor:"#fff"
        }
    },

    ChangePhoneNum:{
        screen: ChangePhoneNum,
        navigationOptions: {
            headerTitle:'安全设置',
            headerBackTitle:null,
            headerStyle: {
                backgroundColor: '#f17e3a'
            },
            headerTitleStyle: {
                color: '#fff'
            },
            headerTintColor:"#fff"
        }
    },

    RealName:{
        screen: RealName,
        navigationOptions: {
            headerTitle:'实名认证',
            headerBackTitle:null,
            headerStyle: {
                backgroundColor: '#f17e3a'
            },
            headerTitleStyle: {
                color: '#fff'
            },
            headerTintColor:"#fff"
        }
    },

    SelfService:{
        screen: SelfService,
        navigationOptions: {
            headerTitle:'自助服务',
            headerBackTitle:null,
            headerStyle: {
                backgroundColor: '#f17e3a'
            },
            headerTitleStyle: {
                color: '#fff'
            },
            headerTintColor:"#fff"
        }
    },

    FeedbackSuggestions:{
        screen: FeedbackSuggestions,
        navigationOptions: {
            headerTitle:'反馈建议',
            headerBackTitle:null,
            headerStyle: {
                backgroundColor: '#f17e3a'
            },
            headerTitleStyle: {
                color: '#fff'
            },
            headerTintColor:"#fff"
        }
    },

    LifeService:{
        screen: LifeService,
        navigationOptions: {
            headerTitle:'生活服务',
            headerBackTitle:null,
            headerStyle: {
                backgroundColor: '#f17e3a'
            },
            headerTitleStyle: {
                color: '#fff'
            },
            headerTintColor:"#fff"
        }
    },

    MineYuYue:{
        screen: MineYuYue,
        navigationOptions: {
            headerTitle:'我的预约',
            headerBackTitle:null,
            headerStyle: {
                backgroundColor: '#f17e3a'
            },
            headerTitleStyle: {
                color: '#fff'
            },
            headerTintColor:"#fff"
        }
    },

    YuE:{
        screen: YuE,
        navigationOptions: {
            headerTitle:'我的余额',
            headerBackTitle:null,
            headerStyle: {
                backgroundColor: '#f17e3a'
            },
            headerTitleStyle: {
                color: '#fff'
            },
            headerTintColor:"#fff"
        }
    },


    LiveKnow:{
        screen: LiveKnow,
        navigationOptions: {
            headerTitle:'入住需知',
            headerBackTitle:null,
            headerStyle: {
                backgroundColor: '#f17e3a'
            },
            headerTitleStyle: {
                color: '#fff'
            },
            headerTintColor:"#fff"
        }
    },



    Contract:{
        screen: Contract,
        navigationOptions: {
            headerTitle:'我的合同',
            headerBackTitle:null,
            headerStyle: {
                backgroundColor: '#f17e3a'
            },
            headerTitleStyle: {
                color: '#fff'
            },
            headerTintColor:"#fff"
        }
    },

    Suggestions:{
        screen: Suggestions,
        navigationOptions: {
            headerTitle:'投诉建议',
            headerBackTitle:null,
            headerStyle: {
                backgroundColor: '#f17e3a'
            },
            headerTitleStyle: {
                color: '#fff'
            },
            headerTintColor:"#fff"
        }
    },

    ForRenewalDetail:{
        screen: ForRenewalDetail,
        navigationOptions: {
            headerTitle:'续租明细账单',
            headerBackTitle:null,
            headerStyle: {
                backgroundColor: '#f17e3a'
            },
            headerTitleStyle: {
                color: '#fff'
            },
            headerTintColor:"#fff"
        }
    },
    SubletDetail:{
        screen: SubletDetail,
        navigationOptions: {
            headerTitle:'转租明细账单',
            headerBackTitle:null,
            headerStyle: {
                backgroundColor: '#f17e3a'
            },
            headerTitleStyle: {
                color: '#fff'
            },
            headerTintColor:"#fff"
        }
    },
    ChangeDetail:{
        screen: ChangeDetail,
        navigationOptions: {
            headerTitle:'换房明细账单',
            headerBackTitle:null,
            headerStyle: {
                backgroundColor: '#f17e3a'
            },
            headerTitleStyle: {
                color: '#fff'
            },
            headerTintColor:"#fff"
        }
    },
    RefundRentDetail:{
        screen: RefundRentDetail,
        navigationOptions: {
            headerTitle:'退租明细账单',
            headerBackTitle:null,
            headerStyle: {
                backgroundColor: '#f17e3a'
            },
            headerTitleStyle: {
                color: '#fff'
            },
            headerTintColor:"#fff"
        }
    },
    determineRoom:{
        screen: determineRoom,
        navigationOptions: {
            headerTitle:'预定留房',
            headerBackTitle:null,
            headerStyle: {
                backgroundColor: '#f17e3a'
            },
            headerTitleStyle: {
                color: '#fff'
            },
            headerTintColor:"#fff"
        }
    },
    selectRom:{
        screen: selectRom,
        navigationOptions: {
            headerTitle:'预定房间',
            headerBackTitle:null,
            headerStyle: {
                backgroundColor: '#f17e3a'
            },
            headerTitleStyle: {
                color: '#fff'
            },
            headerTintColor:"#fff"
        }
    },
    Pay:{
        screen: Pay,
        navigationOptions: {
            headerTitle:'支付',
            headerBackTitle:null,
            headerStyle: {
                backgroundColor: '#f17e3a'
            },
            headerTitleStyle: {
                color: '#fff'
            },
            headerTintColor:"#fff"
        }
    },
    PayOk:{
        screen: PayOk,
        navigationOptions: {
            headerTitle:'确定支付',
            headerBackTitle:null,
            headerStyle: {
                backgroundColor: '#f17e3a'
            },
            headerTitleStyle: {
                color: '#fff'
            },
            headerTintColor:"#fff"
        }
    },
    SeeRoom:{
        screen: SeeRoom,
        navigationOptions: {
            headerTitle:'预约看房',
            headerBackTitle:null,
            headerStyle: {
                backgroundColor: '#f17e3a'
            },
            headerTitleStyle: {
                color: '#fff'
            },
            headerTintColor:"#fff"
        }
    },
    ChangeRooms:{
        screen: ChangeRooms,
        navigationOptions: {
            headerTitle:'换房申请单',
            headerBackTitle:null,
            headerStyle: {
                backgroundColor: '#f17e3a'
            },
            headerTitleStyle: {
                color: '#fff'
            },
            headerTintColor:"#fff"
        }
    },
    ForRenewal:{
        screen: ForRenewal,
        navigationOptions: {
            headerTitle:'续租申请单',
            headerBackTitle:null,
            headerStyle: {
                backgroundColor: '#f17e3a'
            },
            headerTitleStyle: {
                color: '#fff'
            },
            headerTintColor:"#fff"
        }
    },
    Home: {
        screen: Home,
        navigationOptions: {
            header: null,
        }
    },
    Repair:{
        screen: Repair,
        navigationOptions: {
            headerTitle:'预约维修',
            headerBackTitle:null,
            headerStyle: {
                backgroundColor: '#f17e3a'
            },
            headerTitleStyle: {
                color: '#fff'
            },
            headerTintColor:"#fff"
        }
    },
    Clean:{
        screen: Clean,
        navigationOptions: {
            headerTitle:'预约保洁',
            headerBackTitle:null,
            headerStyle: {
                backgroundColor: '#f17e3a'
            },
            headerTitleStyle: {
                color: '#fff'
            },
            headerTintColor:"#fff"
        }
    },
    RepairHistory:{
        screen: RepairHistory,
        navigationOptions: {
            headerTitle:'维修历史记录',
            headerBackTitle:null,
            headerStyle: {
                backgroundColor: '#f17e3a'
            },
            headerTitleStyle: {
                color: '#fff'
            },
            headerTintColor:"#fff"
        }
    },
    CleanHistory:{
        screen: CleanHistory,
        navigationOptions: {
            headerTitle:'保洁历史记录',
            headerBackTitle:null,
            headerStyle: {
                backgroundColor: '#f17e3a'
            },
            headerTitleStyle: {
                color: '#fff'
            },
            headerTintColor:"#fff"
        }
    },
    Rent:{
        screen: Rent,
        navigationOptions: {
            headerTitle:'在线缴租',
            headerBackTitle:null,
            headerStyle: {
                backgroundColor: '#f17e3a'
            },
            headerTitleStyle: {
                color: '#fff'
            },
            headerTintColor:"#fff"
        }
    },
    Electricity:{
        screen: Electricity,
        navigationOptions: {
            headerTitle:'电费',
            headerBackTitle:null,
            headerStyle: {
                backgroundColor: '#f17e3a'
            },
            headerTitleStyle: {
                color: '#fff'
            },
            headerTintColor:"#fff"
        }
    },
    Water:{
        screen: Water,
        navigationOptions: {
            headerTitle:'水费',
            headerBackTitle:null,
            headerStyle: {
                backgroundColor: '#f17e3a'
            },
            headerTitleStyle: {
                color: '#fff'
            },
            headerTintColor:"#fff"
        }
    },
    AllBills:{
        screen: AllBills,
        navigationOptions: {
            headerTitle:'全部',
            headerBackTitle:null,
            headerStyle: {
                backgroundColor: '#f17e3a'
            },
            headerTitleStyle: {
                color: '#fff'
            },
            headerTintColor:"#fff"
        }
    },
    Bill:{
        screen: Bill,
        navigationOptions: {
            headerTitle:'账单',
            headerBackTitle:null,
            headerStyle: {
                backgroundColor: '#f17e3a'
            },
            headerTitleStyle: {
                color: '#fff'
            },
            headerTintColor:"#fff"
        }
    },
    SelectItem:{
        screen: SelectItem,
        navigationOptions: {
            headerTitle:'优选详情',
            headerBackTitle:null,
            headerStyle: {
                backgroundColor: '#f17e3a'
            },
            headerTitleStyle: {
                color: '#fff'
            },
            headerTintColor:"#fff"
        }
    },
    RefondRent:{
        screen: RefondRent,
        navigationOptions: {
            headerTitle:'退租申请单',
            headerBackTitle:null,
            headerStyle: {
                backgroundColor: '#f17e3a'
            },
            headerTitleStyle: {
                color: '#fff'
            },
            headerTintColor:"#fff"
        }
    },
    // MyHomeRoom:{
    //     screen: MyHomeRoom,
    //     navigationOptions: {
    //         header: null,
    //     }
    // }

},{
    initialRouteName: 'Home'
});

const WelcomeHome = createStackNavigator({
    WelcomePage:{
        screen: WelcomePage,
        navigationOptions: {
            header: null,
        }
    }
});

const LoginHome = createStackNavigator({
    Login:{
        screen: Login,
        navigationOptions: {
            header: null,
        }
    },
    Register:{
        screen: Register,
        navigationOptions: {
            headerTitle:'注册',
            headerBackTitle:null,
            headerStyle: {
                backgroundColor: '#f17e3a'
            },
            headerTitleStyle: {
                color: '#fff'
            },
            headerTintColor:"#fff"

        }
    },
    FindPassword:{
        screen: FindPassword,
        navigationOptions: {
            headerTitle:'找回密码',
            headerBackTitle:null,
            headerStyle: {
                backgroundColor: '#f17e3a'
            },
            headerTitleStyle: {
                color: '#fff'
            },
            headerTintColor:"#fff"
        }
    }
});


export default SwitchNavigator(
    {
        WelcomeHome: WelcomeHome,
        SimpleApp: SimpleApp,
        LoginHome: LoginHome
    },
    {
        initialRouteName: 'WelcomeHome',
    }
);
