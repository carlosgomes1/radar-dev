import React, { useEffect, useState } from 'react'
import { View, Text, Image, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native'
import MapView, { Marker, Callout } from 'react-native-maps'
import { requestPermissionsAsync, getCurrentPositionAsync } from 'expo-location'

import { MaterialIcons } from '@expo/vector-icons'

import api from '../../services/api'
import { connect, disconnect, subscribeToNewDevs } from '../../services/socket'
 
import styles from './styles'

function Main({ navigation }) {
    const [ devs, setDevs ] = useState([])
    const [ currentRegion, setCurrentRegion ] = useState(null)
    const [ techs, setTechs ] = useState([])

    useEffect( () => {
        async function loadInitialPosition() {
            const { granted } = await requestPermissionsAsync()

            if( granted ) {
                const { coords } = await getCurrentPositionAsync({
                    enableHighAccuracy: true
                })

            const { latitude, longitude } = coords

            setCurrentRegion({
                latitude,
                longitude,
                latitudeDelta: 0.04,
                longitudeDelta: 0.03,
            })

            }
        }

        loadInitialPosition()
    }, [currentRegion])

    useEffect(() => {
        subscribeToNewDevs(dev => setDevs([...devs, dev]))
    }, [devs])

    function setupWebSocket() {
        disconnect()

        const { latitude, longitude } = currentRegion

        connect(
            latitude,
            longitude,
            techs
        )
    }

    async function loadDevs() {
        const { latitude, longitude } = currentRegion

        try{
            if( techs.length === 0 ) {
                const response = await api.get('/devs')

                setDevs(response.data)
                setupWebSocket()
            } else {

            const response = await api.get('/search', {
                params: {
                    latitude,
                    longitude,
                    techs
                }
            })
    
            setDevs(response.data)
            setupWebSocket()
        }} catch( error ) {
            console.log('Não foi possível se conectar a api')
        }

        
    }

    function handleRegionChanged( region ) {
        setCurrentRegion(region)
    }

    if( !currentRegion ) {
        return null
    }

    return(
        <>
            <MapView 
                onRegionChangeComplete={ handleRegionChanged } 
                initialRegion={ currentRegion } 
                style={ styles.map }
            >
                {devs.map( dev => (
                    <Marker 
                        key={ dev._id }
                        coordinate={{ latitude: dev.location.coordinates[1], longitude: dev.location.coordinates[0] }}
                    >
                    <Image 
                        style={ styles.avatar } 
                        source={{ uri: dev.avatar_url }}
                    />

                    <Callout onPress={ () => {
                        navigation.navigate('Profile', { github_username: dev.github_username })
                    }}>
                        <View style={ styles.callout }>
                            <Text style={ styles.devName } > { dev.name } </Text>
                            <Text style={ styles.devBio }> { dev.bio } </Text>
                            <Text style={ styles.devTechs }> { dev.techs.join(', ') } </Text>
                        </View>
                    </Callout>
                </Marker>
                ))}
            </MapView>
            <KeyboardAvoidingView 
                behavior="padding" 
                style={ styles.searchView } 
                keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0}
            >
                    <TextInput 
                        style={ styles.searchInput }
                        placeholder="Buscar devs por tecnologia..."
                        placeholderTextColor="#999"
                        autoCapitalize="words"
                        autoCorrect={ false }
                        value={ techs }
                        onChangeText={ text => setTechs(text) }
                    />

                    <TouchableOpacity onPress={ loadDevs } style={ styles.loadButton }>
                        <MaterialIcons 
                            name="my-location" 
                            size={ 20 } 
                            color="#FFF" 
                        />
                    </TouchableOpacity>
            </KeyboardAvoidingView>
        </>
    )
}

export default Main