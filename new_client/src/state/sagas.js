import { loginOperations as loginSagas } from './duck/login';
import { registerOperations as registerSagas } from './duck/register';
import { projectOperations as projectSaga } from './duck/project'

const runSagas = (sagaMiddleware) => {
    sagaMiddleware.run(loginSagas)
    sagaMiddleware.run(registerSagas)
    sagaMiddleware.run(projectSaga)
}

export {
    runSagas
}