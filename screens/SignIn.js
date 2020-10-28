import React, { useState, useRef } from 'react'
import { StyleSheet } from 'react-native'
import {
    Container,
    Button,
    Text,
    H1,
    Input,
    Form,
    Item,
    Toast,
    Icon,
    View
} from 'native-base'
import globalStyles from '../styles/global'
import { useNavigation } from '@react-navigation/native'
import { useForm, Controller } from 'react-hook-form'
import AsyncStorage from '@react-native-community/async-storage'

// * Apollo
import { gql, useMutation } from '@apollo/client'

const AUTHENTICATE_USER = gql`
    mutation authenticateUser($input: AuthenticateUserInput){
        authenticateUser(input: $input){
            token
        }
    }
`


const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
const rules = {
    email: {
        required: "Type the email please",
        validate: (value) => value.trim() !== '' || "Type the email please",
        pattern: {
            value: emailRegex,
            message: "Type a valid email please"
        }
    },
    password: {
        required: "Type the password please",
        validate: (value) => value.trim() !== '' || "Type the password please",
        minLength: {
            value: 6,
            message: "Minimun 6 character length"
        }
    }
}
const SignIn = () => {
    // * Apollo mutation
    const [authenticateUser, { client, loading }] = useMutation(AUTHENTICATE_USER)

    const navigation = useNavigation()
    const [visible, setVisible] = useState(false)
    const { control, handleSubmit, errors } = useForm({
        defaultValues: {
            email: '',
            password: '',
        },
        mode: 'onSubmit'
    })
    const emailRef = useRef()
    const passwordRef = useRef()

    const onSubmit = async (formData) => {
        client.clearStore()
        await AsyncStorage.removeItem('token')
        try {
            const { data } = await authenticateUser({
                variables: {
                    input: {
                        email: formData.email.trim(),
                        password: formData.password.trim()
                    }
                }
            })
            const { token } = data.authenticateUser
            await AsyncStorage.setItem('token', token)
            Toast.show({
                text: "Successfully signed in",
                buttonText: 'OK',
                duration: 5000,
            })
            navigation.navigate('Projects')
        } catch (error) {
            console.log(error)
            Toast.show({
                text: error.message,
                buttonText: 'OK',
                duration: 5000,
            })
        }
    }

    const onError = (errors) => {
        const { email, password } = errors;
        if (email) {
            Toast.show({
                text: email.message,
                buttonText: 'OK',
                duration: 5000
            })
        } else if (password) {
            Toast.show({
                text: password.message,
                buttonText: 'OK',
                duration: 5000
            })
        }
        // navigation.navigate('SignUp')
    }

    return (
        <Container
            style={[globalStyles.container, { backgroundColor: '#e84347' }]}
        >
            <View
                style={globalStyles.content}
            >
                <H1 style={globalStyles.title}>Mattu upTask</H1>
                <Form>
                    <Item
                        inlineLabel
                        last
                        style={globalStyles.input}
                        rounded
                    >
                        <Controller
                            name="email"
                            control={control}
                            // onFocus={() => {
                            //     emailRef.current.focus();
                            // }}
                            rules={rules.email}
                            render={({ onChange, onBlur, value }) => (
                                <Input
                                    autoCompleteType="email"
                                    placeholder="Email"
                                    onChangeText={(value) => {
                                        onChange(value.toLowerCase().trim())
                                    }}
                                    value={value}
                                    ref={emailRef}
                                />
                            )}
                        />
                    </Item>
                    <Item
                        inlineLabel
                        last
                        style={globalStyles.input}
                        rounded
                    >
                        <Controller
                            name="password"
                            control={control}
                            // onFocus={() => {
                            //     passwordRef.current.focus();
                            // }}
                            rules={rules.password}
                            render={({ onChange, onBlur, value }) => (
                                <Input
                                    secureTextEntry={visible ? false : true}
                                    placeholder="Password"
                                    onChangeText={(value) => {
                                        onChange(value)
                                    }}
                                    value={value}
                                    ref={passwordRef}
                                />
                            )}
                        />
                        <Icon
                            type="MaterialCommunityIcons"
                            style={{ color: '#9b9b9b' }}
                            name={visible ? 'eye-off' : 'eye'}
                            onPress={() => setVisible(!visible)}
                        />
                    </Item>
                </Form>
                <Button
                    rounded
                    block
                    style={globalStyles.btn}
                    onPress={handleSubmit(onSubmit, onError)}
                >
                    <Text
                        style={globalStyles.btnText}
                    >
                        Sign in
                    </Text>
                </Button>
                <Text
                    style={globalStyles.link}
                    onPress={() => navigation.navigate('SignUp')}
                >
                    Sign up
                </Text>
            </View>
        </Container>
    )
}

export default SignIn

const styles = StyleSheet.create({})
