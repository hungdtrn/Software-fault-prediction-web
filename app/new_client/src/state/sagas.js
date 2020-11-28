import { loginOperations as loginSagas } from './duck/login';
import { registerOperations as registerSagas } from './duck/register';
import { projectOperations as projectSaga } from './duck/project'
import { fileOperations as fileSaga } from './duck/file'
import { modelOperations as modelSaga } from './duck/model'
import { userOperations as userSaga } from './duck/user'

const runSagas = (sagaMiddleware) => {
    sagaMiddleware.run(loginSagas)
    sagaMiddleware.run(registerSagas)
    sagaMiddleware.run(projectSaga)
    sagaMiddleware.run(fileSaga)
    sagaMiddleware.run(modelSaga)
    sagaMiddleware.run(userSaga)
}

export {
    runSagas
}