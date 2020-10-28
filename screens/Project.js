import React, { useRef } from 'react'
import { StyleSheet, View } from 'react-native'
import {
    Container,
    Button,
    Content,
    Text,
    H2,
    List,
    Item,
    Input,
    Form,
    Toast,
    Spinner
} from 'native-base'

import globalStyles from '../styles/global'
import { useNavigation } from '@react-navigation/native'
import { useForm, Controller } from 'react-hook-form'
import Task from '../components/Task'
// * Apollo
import { gql, useQuery, useMutation } from '@apollo/client'

const GET_TASKS = gql`
    query getTasksByProject($projectId: ID!){
        getTasksByProject(projectId: $projectId){
            id
            name
            project
            status
            creator
            createdAt
        }
    }
`

const CREATE_TASK = gql`
    mutation createTask($input: TaskInput){
        createTask(input: $input){
            id
            name
            project
            status
            creator
            createdAt
        }
    }
`

const rules = {
    name: {
        required: "Type the name of the task please",
        validate: (value) => value.trim() !== '' || "Type the name of the task please",
    }
}

const Project = ({ route }) => {
    const project = route.params

    // * Apollo mutation
    const { data, loading } = useQuery(GET_TASKS, {
        variables: {
            projectId: project.id
        }
    })
    const [createTask] = useMutation(CREATE_TASK, {
        update(cache, { data: { createTask } }) {
            try {
                const { getTasksByProject } = cache.readQuery({
                    query: GET_TASKS,
                    variables: {
                        projectId: project.id
                    }
                })
                if (getTasksByProject) {
                    cache.writeQuery({
                        query: GET_TASKS,
                        variables: {
                            projectId: project.id
                        },
                        data: {
                            getTasksByProject: [...getTasksByProject, createTask]
                        }
                    })
                }
            } catch (error) {
                console.log("Nothing in cache")
                cache.writeQuery({
                    query: GET_TASKS,
                    variables: {
                        projectId: project.id
                    }
                })
            }
        }
    })
    const navigation = useNavigation()

    const { control, handleSubmit, errors, formState, reset } = useForm({
        defaultValues: {
            name: '',
        },
        mode: 'onChange'
    })
    const nameRef = useRef()

    const onSubmit = async (formData) => {
        try {
            const { data } = await createTask({
                variables: {
                    input: {
                        name: formData.name.trim(),
                        project: project.id
                    }
                }
            })
            reset()
            Toast.show({
                text: "Task successfully created",
                buttonText: 'OK',
                duration: 5000,
            })
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
        <Container style={[globalStyles.container], { backgroundColor: '#e84347' }}>
            <Form style={{ marginHorizontal: '2.5%', marginTop: 20 }}>
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
                                placeholder="Name of the task"
                                onChangeText={(value) => {
                                    onChange(value)
                                }}
                                value={value}
                                ref={nameRef}
                            />
                        )}
                    />
                </Item>
                <Button
                    rounded
                    block
                    style={{ backgroundColor: '#28303b' }}
                    onPress={handleSubmit(onSubmit, onError)}
                    disabled={!formState.isValid}
                >
                    <Text
                        style={globalStyles.btnText}
                    >
                        Add new task
                </Text>
                </Button>
            </Form>
            {loading ?
                <Spinner color="white" />
                :
                <>
                    {data.getTasksByProject.length > 0 ?
                        <>
                            <H2
                                style={globalStyles.subtitle}
                            >
                                Tasks
                            </H2>
                            <Content>
                                <List style={styles.content}>
                                    {data.getTasksByProject.map(task => (
                                        <Task key={task.id} task={task} projectId={project.id} />
                                    ))}
                                </List>
                            </Content>
                        </>
                        :
                        <H2 style={globalStyles.subtitle} >There are no tasks</H2>
                    }
                </>
            }
        </Container>
    )
}

export default Project

const styles = StyleSheet.create({
    content: {
        backgroundColor: '#FFF',
        marginHorizontal: '2.5%'
    }
})
