import { loginOperations as loginSagas } from './duck/login';
import { registerOperations as registerSagas } from './duck/register';
import { projectOperations as projectSaga } from './duck/project'
import { fileOperations as fileSaga } from './duck/file'
import { modelOperations as modelSaga } from './duck/model'

const runSagas = (sagaMiddleware) => {
    sagaMiddleware.run(loginSagas)
    sagaMiddleware.run(registerSagas)
    sagaMiddleware.run(projectSaga)
    sagaMiddleware.run(fileSaga)
    sagaMiddleware.run(modelSaga)
}

export {
    runSagas
}