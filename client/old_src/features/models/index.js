import { connect } from 'react-redux'

import sagas from './sagas'
import reducers from './reducers'
import actions from './actions'

import StaticModelDetail from './components/modelDetail'
import StaticModelList from './components/modelList'
import StaticModelForm from './components/modelForm'

import { requestFindAll, requestCreate, requestFindById } from './actions'

const ModelList = connect(
    (state, props) => {
        return {
            models: state.model.models
        }
    },
    (dispatch, props) => {
        return {
            findAll: () => dispatch(requestFindAll())
        }
    }) (StaticModelList)

const ModelDetail = connect(
    (state, props) => {
        return {
            loading: state.model.loading,
            model: state.model.selectedModel,
        }
    },
    (dispatch, props) => {
        return {
            findById: (id) => dispatch(requestFindById(id))
        }
    },
) (StaticModelDetail)


const ModelForm = connect(
    (state, props) => {
        return {
            loading: state.model.loading,
            error: state.model.error,
            modelId: state.model.modelId
        }
    },
    (dispatch, props) => {
        return {
            create: (model) => dispatch(requestCreate(model)) 
        }
    },
) (StaticModelForm)

export default {
    containers: {
        ModelList,
        ModelDetail,
        ModelForm,
    },
    actions,
    sagas,
    reducers
}
