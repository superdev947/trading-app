import { createAppContainer } from "react-navigation"
import { createStackNavigator } from 'react-navigation-stack'
import SignIn from '../screens/Guest/SignIn'
import SignUp from '../screens/Guest/SignUp'
import TwoStepVerify from '../screens/Guest/TwoStepVerify'
import ResetPassword from '../screens/Guest/ResetPassword'

/**
 * Guest Navigator
 */
const Navigator = createStackNavigator(
	{
		SignInScreen: {
			screen: SignIn,
			navigationOptions: { headerShown: false },
		},
		SignUpScreen: {
			screen: SignUp,
			navigationOptions: { headerShown: false },
		},
		TwoStepVerifyScreen: {
			screen: TwoStepVerify,
			navigationOptions: { headerShown: false },
		},
		ResetPasswordScreen: {
			screen: ResetPassword,
			navigationOptions: { headerShown: false },
		}
	},
	{
		initialRouteName: 'SignInScreen'
	}
)

export default createAppContainer(Navigator)