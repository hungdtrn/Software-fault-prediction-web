import { connect } from 'react-redux'

import StaticLoginForm from './components/loginForm'
import StaticRegisterForm from './components/registerForm'

import { requestLogin, requestRegister, clearError } from './actions'
import reducers from './reducers'
import sagas from './sagas'

const mapDispatchToLogin = (dispatch, props) => {
    return {
        login: (e) => dispatch(requestLogin(e)),
        clearError: () => dispatch(clearError())
    }
}

const mapDispatchToRegister = (dispatch, props) => {
    return {
        register: (e) => dispatch(requestRegister(e)),
    }
}

const mapStateToLogin = (state, props) => {
    return {
        accessToken: state.auth.accessToken,
        loading: state.auth.loading,
        error: state.auth.error
    }
}

const mapStateToRegister = (state, props) => {
    return {
        loading: state.auth.loading,
        error: state.auth.error,
        accessToken: state.auth.accessToken,

    }
}

const LoginForm = connect(
    mapStateToLogin,
    mapDispatchToLogin,
)(StaticLoginForm)

const RegisterForm = connect(
    mapStateToRegister,
    mapDispatchToRegister,
)(StaticRegisterForm)

export default {
    reducers: reducers,
    sagas: sagas,
    containers: {
        LoginForm,
        RegisterForm
    }
}