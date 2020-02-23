import { loginOperations as loginSagas } from './duck/login';
import { registerOperations as registerSagas } from './duck/register';


const runSagas = (sagaMiddleware) => {
    sagaMiddleware.run(loginSagas)
    sagaMiddleware.run(registerSagas)
}

export {
    runSagas
}