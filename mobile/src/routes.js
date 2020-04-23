import React from 'react'

import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'

import Main from './pages/Main'
import Profile from './pages/Profile'

const AppStack = createStackNavigator()

export default function Routes() {
    return(
        <NavigationContainer>

            <AppStack.Navigator screenOptions={{
                headerStyle: { backgroundColor: '#7D40E7' },
                headerTintColor: '#FFF',
                headerBackTitleVisible: null
            }}>

                <AppStack.Screen name="Main" component={ Main } options={{ title: 'DevRadar' }} />
                <AppStack.Screen name="Profile" component={ Profile } options={{ title: 'Perfil no Github' }} />

            </AppStack.Navigator>

        </NavigationContainer>
    )
}

