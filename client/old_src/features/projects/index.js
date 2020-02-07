import { connect } from 'react-redux'

import sagas from './sagas'
import reducers from './reducers'

import StaticProjectDetail from './components/projectDetail'
import StaticProjectList from './components/projectList'
import StaticProjectForm from './components/projectForm'

import { requestFindAll, requestCreate, requestFindById } from './actions'

const ProjectList = connect(
    (state, props) => {
        return {
            projects: state.project.projects
        }
    },
    (dispatch, props) => {
        return {
            findAll: () => dispatch(requestFindAll())
        }
    }) (StaticProjectList)

const ProjectDetail = connect(
    (state, props) => {
        return {
            loading: state.project.loading,
            project: state.project.selectedProject,
        }
    },
    (dispatch, props) => {
        return {
            findById: (id) => dispatch(requestFindById(id))
        }
    },
) (StaticProjectDetail)


const ProjectForm = connect(
    (state, props) => {
        return {
            loading: state.project.loading,
            error: state.project.error,
            projectId: state.project.projectId
        }
    },
    (dispatch, props) => {
        return {
            create: (project) => dispatch(requestCreate(project)) 
        }
    },
) (StaticProjectForm)

export default {
    containers: {
        ProjectList,
        ProjectDetail,
        ProjectForm,
    },
    sagas,
    reducers
}
