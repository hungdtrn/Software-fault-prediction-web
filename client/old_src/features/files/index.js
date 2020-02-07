import { connect } from 'react-redux'

import sagas from './sagas'
import reducers from './reducers'
import { requestFindById, requestPredictById } from './actions'
import models from '../models'

import StaticFileTable from './components/fileTable'
import StaticFile from './components/file'

const FileDetail = connect(
    (state, props) => {
        return {
            loading: state.file.loading,
            error: state.file.error,
            selectedFile: {
                ...props.selectedFile,
                ...state.file.selectedFile
            },
            updatedFile: state.file.updatedFile,
            models: state.model.models
        }
    },
    (dispatch, props) => {
        return {
            findById: (fileId, projectId) => dispatch(requestFindById(fileId, projectId)), 
            findModel: () => dispatch(models.actions.requestFindAll()),
            predict: (fileId, modelId) => dispatch(requestPredictById(fileId, modelId))
        }
    }, 
) (StaticFile)

const FileTable = connect(
    null,
    null
) (StaticFileTable)

export default {
    containers: {
        FileDetail,
        FileTable
    },
    sagas,
    reducers
}