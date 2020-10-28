import React, { useRef } from 'react'
import { StyleSheet, View } from 'react-native'
import {
    Container,
    Button,
    Content,
    Text,
    H2,
    Form,
    Item,
    Input,
    Toast
} from 'native-base'
import globalStyles from '../styles/global'
import { useNavigation } from '@react-navigation/native'
import { useForm, Controller } from 'react-hook-form'

// * Apollo
import { gql, useMutation } from '@apollo/client'

const GET_PROJECTS = gql`
    query getProjects{
        getProjects{
            id
            name
        }
    }
`

const CREATE_PROJECT = gql`
    mutation createProject($input: ProjectInput) {
        createProject(input: $input) {
            id
            name
        }
    }
`

const rules = {
    name: {
        required: "Type the name of the project please",
        validate: (value) => value.trim() !== '' || "Type the name of the project please",
    }
}

const NewProject = () => {

    // * Apollo mutation
    const [createProject, { loading }] = useMutation(CREATE_PROJECT, {
        update(cache, { data: { createProject } }) {
            try {
                console.log(createProject);
                console.log("cache ", cache.readQuery({ query: GET_PROJECTS }))
                const { getProjects } = cache.readQuery({ query: GET_PROJECTS })
                console.log("getProjects", getProjects);
                if (getProjects) {
                    cache.writeQuery({
                        query: GET_PROJECTS,
                        data: {
                            getProjects: [...getProjects, createProject]
                        }
                    })
                }
            } catch (error) {
                console.log("Nothing in cache")

                cache.writeQuery({
                    query: GET_PROJECTS,
                })
            }
        }
    })

    const navigation = useNavigation()

    const { control, handleSubmit, errors } = useForm({
        defaultValues: {
            name: '',
        },
        mode: 'onSubmit'
    })
    const nameRef = useRef()

    const onSubmit = async (formData) => {
        try {
            const { data } = await createProject({
                variables: {
                    input: {
                        name: formData.name.trim()
                    }
                }
            })
            Toast.show({
                text: "Project successfully created",
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
        const { name } = errors;
        if (name) {
            Toast.show({
                text: name.message,
                buttonText: 'OK',
                duration: 5000
            })
        }
    }
    return (
        <Container
            style={[globalStyles.container], { backgroundColor: '#e84347' }}
        >
            <View
                style={globalStyles.content}
            >
                <H2
                    style={globalStyles.subtitle}
                >
                    New project
                </H2>
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
                            //     emailRef.current.focus();
                            // }}
                            rules={rules.name}
                            render={({ onChange, onBlur, value }) => (
                                <Input
                                    autoCompleteType="name"
                                    placeholder="Name of the project"
                                    onChangeText={(value) => {
                                        onChange(value)
                                    }}
                                    value={value}
                                    ref={nameRef}
                                />
                            )}
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
                        Create project
                    </Text>
                </Button>
            </View>
        </Container>
    )
}

export default NewProject

const styles = StyleSheet.create({})
