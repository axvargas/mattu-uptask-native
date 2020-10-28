import { StyleSheet } from 'react-native'

const globalStyles = StyleSheet.create({
    container: {
        flex: 1
    },
    content: {
        flexDirection: 'column',
        justifyContent: 'center',
        marginHorizontal: '2.5%',
        flex: 1
    },
    title: {
        textAlign: 'center',
        marginBottom: 20,
        fontSize: 32,
        fontWeight: 'bold',
        color: '#FFF'
    },
    subtitle: {
        textAlign: 'center',
        marginBottom: 20,
        fontSize: 24,
        fontWeight: 'bold',
        color: '#FFF',
        marginTop: 15
    },
    input: {
        backgroundColor: '#FFF',
        marginBottom: 20
    },
    btn: {
        backgroundColor: '#28303b',
        marginTop: 20
    },
    btnText: {
        textTransform: 'capitalize',
        fontWeight: 'bold',
        color: '#FFF',
        fontSize: 16,
    },
    link: {
        color: '#FFF',
        marginTop: 30,
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 16,
    }
})

export default globalStyles