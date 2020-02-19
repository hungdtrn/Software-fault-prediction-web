import { loginOperations as loginSagas } from './duck/login';


const runSagas = (sagaMiddleware) => {
    sagaMiddleware.run(loginSagas)
}

export {
    runSagas
}