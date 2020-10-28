import React from 'react'
import { StyleSheet, View } from 'react-native'
import {
    Container,
    Button,
    Content,
    Text,
    H2,
    List,
    ListItem,
    Left,
    Right,
    Spinner
} from 'native-base'
import globalStyles from '../styles/global'
import { useNavigation } from '@react-navigation/native'
// * Apollo
import { gql, useQuery } from '@apollo/client'

const GET_PROJECTS = gql`
    query getProjects{
        getProjects{
            id
            name
        }
    }
`

const Projects = () => {
    const { data, loading } = useQuery(GET_PROJECTS)
    const navigation = useNavigation()
    return (
        <Container
            style={[globalStyles.container], { backgroundColor: '#e84347' }}
        >
            <Button
                rounded
                block
                style={globalStyles.btn}
                onPress={() => navigation.navigate('NewProject')}
            >
                <Text
                    style={globalStyles.btnText}
                >
                    New project
                </Text>
            </Button>
            {loading ?
                <Spinner color="white" />
                :
                <>
                    {data.getProjects.length > 0 ?
                        <>
                            <H2
                                style={globalStyles.subtitle}
                            >
                                Select a project
                            </H2>
                            <Content>
                                <List style={styles.content} >
                                    {data.getProjects.map(project => (
                                        <ListItem
                                            key={project.id}
                                            onPress={() => navigation.navigate('Project', project)}
                                        >
                                            <Left>
                                                <Text>{project.name}</Text>
                                            </Left>
                                            <Right>

                                            </Right>
                                        </ListItem>
                                    ))}
                                </List>
                            </Content>
                        </>
                        :
                        <H2 style={globalStyles.subtitle} >There are no projects</H2>
                    }
                </>
            }
        </Container>
    )
}

export default Projects

const styles = StyleSheet.create({
    content: {
        backgroundColor: '#FFF',
        marginHorizontal: '2.5%'
    }
})
