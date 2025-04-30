import { createAppContainer } from "react-navigation"
import { createDrawerNavigator } from "react-navigation-drawer"
import { createStackNavigator } from 'react-navigation-stack'
import Home from '../screens/Logged/Home'
import Markets from '../screens/Logged/Markets'
import Trade from '../screens/Logged/Trade'
import Assets from '../screens/Logged/Assets'
import CopyTrade from '../screens/Logged/CopyTrade'
import CopyTradeSetting from '../screens/Logged/CopyTrade/Setting'
import OTC from '../screens/Logged/Assets/OTC'
import MOTC from '../screens/Logged/Assets/MOTC'
import Account from '../screens/Logged/Account'
import EditProfile from '../screens/Logged/Account/EditProfile'
import Settings from '../screens/Logged/Account/Settings'
import IDCard from '../screens/Logged/Account/IDCard'
import TradingView from '../screens/Logged/TradingView'
import Support from '../screens/Logged/Support'
import Chat from '../screens/Logged/Chat/Chat'
import ChatRoom from '../screens/Logged/Chat/ChatRoom'
import { LAYOUT } from "../constants"
import SideMenu from "./SideMenu"

/**
 * Home Navigator
 */
const Navigator = createStackNavigator(
	{
		HomeScreen: {
			screen: Home,
			navigationOptions: { headerShown: false },
		},
		MarketsScreen: {
			screen: Markets,
			navigationOptions: { headerShown: false },
		},
		TradeScreen: {
			screen: Trade,
			navigationOptions: { headerShown: false },
		},
		CopyTradeScreen: {
			screen: CopyTrade,
			navigationOptions: { headerShown: false },
		},
		CopyTradeSettingScreen: {
			screen: CopyTradeSetting,
			navigationOptions: { headerShown: false },
		},
		AssetsScreen: {
			screen: Assets,
			navigationOptions: { headerShown: false },
		},
		OTCScreen: {
			screen: OTC,
			navigationOptions: { headerShown: false },
		},
		MOTCScreen: {
			screen: MOTC,
			navigationOptions: { headerShown: false },
		},
		ChatScreen: {
			screen: Chat,
			navigationOptions: { headerShown: false },
		},
		ChatRoomScreen: {
			screen: ChatRoom,
			navigationOptions: { headerShown: false },
		},
		AccountScreen: {
			screen: Account,
			navigationOptions: { headerShown: false },
		},
		EditProfileScreen: {
			screen: EditProfile,
			navigationOptions: { headerShown: false },
		},
		SettingsScreen: {
			screen: Settings,
			navigationOptions: { headerShown: false },
		},
		IDCardScreen: {
			screen: IDCard,
			navigationOptions: { headerShown: false },
		},
		SupportScreen: {
			screen: Support,
			navigationOptions: { headerShown: false },
		},
		TradingView: {
			screen: TradingView,
			navigationOptions: { headerShown: false },
		}
	},
	{
		initialRouteName: 'HomeScreen'
	}
)

const RootStack = createDrawerNavigator({
	Home: {
		screen: Navigator,
	},
}, {
	contentComponent: SideMenu,
	drawerWidth: LAYOUT.window.width * .6,
	drawerOpenRoute: 'DrawerOpen',
	drawerCloseRoute: 'DrawerClose',
	drawerToggleRoute: 'DrawerToggle',
}
)

export default createAppContainer(RootStack)