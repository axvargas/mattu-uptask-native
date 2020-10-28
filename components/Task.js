import React from 'react'
import { StyleSheet, Text, Alert } from 'react-native'
import {
    Right,
    Left,
    ListItem,
    Icon,
    Toast
} from 'native-base'

// * Apollo
import { gql, useMutation } from '@apollo/client'

const UPDATE_TASK = gql`
    mutation updateTask($id: ID!, $input: TaskInput, $status: Boolean){
        updateTask(id: $id, input: $input, status: $status){
            id
            name
            project
            status
        }
    }
`

const DELETE_TASK = gql`
    mutation deleteTask($id: ID!){
        deleteTask(id: $id)
    }
`

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
const Task = ({ task, projectId }) => {
    const [updateTask] = useMutation(UPDATE_TASK)
    const [deleteTask] = useMutation(DELETE_TASK, {
        update(cache) {
            try {
                const { getTasksByProject } = cache.readQuery({
                    query: GET_TASKS,
                    variables: {
                        projectId: projectId
                    }
                })
                cache.writeQuery({
                    query: GET_TASKS,
                    variables: {
                        projectId: projectId
                    },
                    data: {
                        getTasksByProject: getTasksByProject.filter(actualTask => actualTask.id !== task.id)
                    }
                })
            } catch (error) {
                console.log("Nothing in cache")
                cache.writeQuery({
                    query: GET_TASKS,
                    variables: {
                        projectId: projectId
                    }
                })
            }

        }
    })
    const changeStatus = async () => {
        try {
            const { data } = await updateTask({
                variables: {
                    id: task.id,
                    input: {
                        name: task.name
                    },
                    status: !task.status
                }
            })
            Toast.show({
                text: "Task status changed",
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

    const confirmDeleteTask = async () => {
        try {
            const { data } = await deleteTask({
                variables: {
                    id: task.id,
                }
            })
            Toast.show({
                text: "Task successfully deleted",
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

    const showDeleteDialog = () => {
        Alert.alert(
            "Delete task",
            "Do you want to delete this task",
            [
                {
                    text: 'Cancel',
                    style: 'cancel'
                },
                {
                    text: 'OK',
                    onPress: () => confirmDeleteTask()
                }
            ],
            { cancelable: false }
        )
    }
    return (
        <>
            <ListItem
                onPress={() => changeStatus()}
                onLongPress={() => showDeleteDialog()}
            >
                <Left>
                    <Text>{task.name}</Text>
                </Left>
                <Right>
                    {task.status ?
                        <Icon
                            style={[styles.icon, styles.complete]}
                            name="ios-checkmark-circle"
                        />
                        :
                        <Icon
                            style={[styles.icon, styles.incomplete]}
                            name="ios-checkmark-circle"
                        />
                    }
                </Right>
            </ListItem>
        </>
    )
}

export default Task

const styles = StyleSheet.create({
    icon: {
        fontSize: 28
    },
    complete: {
        color: '#28303b'
    },
    incomplete: {
        color: '#e1e1e1'
    }
})
