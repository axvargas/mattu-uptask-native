import { ApolloClient } from '@apollo/client'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { createHttpLink } from 'apollo-link-http'
import { Platform } from 'react-native'
import { setContext } from 'apollo-link-context'
import AsyncStorage from '@react-native-community/async-storage'

const uri = Platform.OS === 'ios' ? 'http://localhost:4000/' : 'http://10.0.2.2:4000/'
// 'http://192.168.100.12:4000/'
const httpLink = createHttpLink({
    uri
})

const authLink = setContext(async (_, { headers }) => {
    // * Read token storaged
    const token = await AsyncStorage.getItem('token')
    return {
        headers: {
            ...headers,
            authorization: token ? `Bearer ${token}` : ''
        }
    }
})
const client = new ApolloClient({
    cache: new InMemoryCache(),
    link: authLink.concat(httpLink),
    connectToDevTools: true,
})

export default client