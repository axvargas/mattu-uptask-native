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
    View,
    Icon
} from 'native-base'
import globalStyles from '../styles/global'
import { useNavigation } from '@react-navigation/native'
import { useForm, Controller } from 'react-hook-form';

// * Apollo
import { gql, useMutation } from '@apollo/client'

const CREATE_USER = gql`
    mutation createUser($input: UserInput){
        createUser(input: $input){
            id
            name
            email
        }
    }
`

const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

const SignUp = () => {
    // * Apollo mutation
    const [createUser, { loading }] = useMutation(CREATE_USER)

    const navigation = useNavigation()

    const [visible, setVisible] = useState(false)
    const [visible1, setVisible1] = useState(false)
    const { control, handleSubmit, getValues, errors } = useForm({
        defaultValues: {
            name: '',
            email: '',
            password: '',
            passwordConfirmation: ''
        },
        mode: 'onSubmit'
    });
    const rules = {
        name: {
            required: "Type the name please",
            validate: (value) => value.trim() !== '' || "Type the name please"
        },
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
        },
        passwordConfirmation: {
            required: "Type the password confirmation please",
            validate: {
                matchesPreviousPassword: value => {
                    const { password } = getValues();
                    return password === value || "Passwords should match!";
                }
            }
        }
    }

    const nameRef = useRef()
    const emailRef = useRef()
    const passwordRef = useRef()
    const passwordConfirmationRef = useRef()

    const onSubmit = async (formData) => {
        try {
            const { data } = await createUser({
                variables: {
                    input: {
                        name: formData.name.trim(),
                        email: formData.email.trim(),
                        password: formData.password.trim()
                    }
                }
            })
            Toast.show({
                text: "User successfully created",
                buttonText: 'OK',
                duration: 5000,
            })
            navigation.navigate('SignIn')
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
        const { name, email, password, passwordConfirmation } = errors;
        if (name) {
            Toast.show({
                text: name.message,
                buttonText: 'OK',
                duration: 5000,
            })
        } else if (email) {
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
        } else if (passwordConfirmation) {
            Toast.show({
                text: passwordConfirmation.message,
                buttonText: 'OK',
                duration: 5000
            })
        }
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
                            name="name"
                            control={control}
                            // onFocus={() => {
                            //     nameRef.current.focus();
                            // }}
                            rules={rules.name}
                            render={({ onChange, onBlur, value }) => (
                                <Input
                                    placeholder="Name"
                                    onChangeText={(value) => {
                                        onChange(value)
                                    }}
                                    value={value}
                                    ref={nameRef}
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
                    <Item
                        inlineLabel
                        last
                        style={globalStyles.input}
                        rounded
                    >
                        <Controller
                            name="passwordConfirmation"
                            control={control}
                            // onFocus={() => {
                            //     passwordConfirmationRef.current.focus();
                            // }}
                            rules={rules.passwordConfirmation}
                            render={({ onChange, onBlur, value }) => (
                                <Input
                                    secureTextEntry={visible1 ? false : true}
                                    placeholder="Password Confirmation"
                                    onChangeText={(value) => {
                                        onChange(value)
                                    }}
                                    value={value}
                                    ref={passwordConfirmationRef}
                                />
                            )}
                        />
                        <Icon
                            type="MaterialCommunityIcons"
                            style={{ color: '#9b9b9b' }}
                            name={visible1 ? 'eye-off' : 'eye'}
                            onPress={() => setVisible1(!visible1)}
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
                        Sign up
                    </Text>
                </Button>
            </View>
        </Container>
    )
}

export default SignUp

const styles = StyleSheet.create({})
