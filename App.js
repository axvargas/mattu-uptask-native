import 'react-native-gesture-handler'
import React from 'react'
import {
	StyleSheet,
	Text,
} from 'react-native'
import { Root } from 'native-base'
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import SignIn from './screens/SignIn';
import SignUp from './screens/SignUp';
import Projects from './screens/Projects';
import NewProject from './screens/NewProject';
import Project from './screens/Project';
const Stack = createStackNavigator();

const App = () => {
	return (
		<Root>
			<NavigationContainer>
				<Stack.Navigator
					initialRouteName="SignIn"
					screenOptions={{
						headerTitleAlign: 'center'
					}}
				>
					<Stack.Screen
						name="SignIn"
						component={SignIn}
						options={{
							title: "Sign in",
							headerShown: false
						}}
					/>
					<Stack.Screen
						name="SignUp"
						component={SignUp}
						options={{
							title: "Sign up",
							headerStyle: {
								backgroundColor: '#28303B'
							},
							headerTintColor: '#FFF',
							headerTitleStyle: {
								fontWeight: 'bold'
							}
						}}
					/>
					<Stack.Screen
						name="Projects"
						component={Projects}
						options={{
							title: "Projects",
							headerStyle: {
								backgroundColor: '#28303B'
							},
							headerTintColor: '#FFF',
							headerTitleStyle: {
								fontWeight: 'bold'
							},
							headerLeft: null
						}}
					/>
					<Stack.Screen
						name="NewProject"
						component={NewProject}
						options={{
							title: "Projects",
							headerStyle: {
								backgroundColor: '#28303B'
							},
							headerTintColor: '#FFF',
							headerTitleStyle: {
								fontWeight: 'bold'
							},
						}}
					/>
					<Stack.Screen
						name="Project"
						component={Project}
						options={({ route }) => ({
							title: route.params.name,
							headerStyle: {
								backgroundColor: '#28303B'
							},
							headerTintColor: '#FFF',
							headerTitleStyle: {
								fontWeight: 'bold'
							},
						})}
					/>
				</Stack.Navigator>
			</NavigationContainer>
		</Root>
	)
}

const styles = StyleSheet.create({

})

export default App
