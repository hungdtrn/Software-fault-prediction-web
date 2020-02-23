import { Redirect } from 'react-router-dom'
import { Login, Register, Home, Project, Algorithm, AccountDetail } from '../views/pages';
import { withAuthentication } from '../views/enhancers'


const generalRoutes = [
    {
        path: "/login",
        component: Login,
        exact: true
    },
    {
        path: "/register",
        component: Register,
        exact: true
    },
    {
        path: "/",
        component: withAuthentication(Home),
    },
]

const userRouters = [
    {
        path: "/projects",
        component: Project,
        name: "Project",
        icon: "github",
        default: true,
    },
    {
        path: "/detail",
        component: AccountDetail,
        name: "Account",
        icon: "user"
    }
]

const adminRoutes = [
    {
        path: "/algorithms",
        component: Algorithm,
        name: "Algorithm",
        icon: "codepen",
        default: true
    },
    {
        path: "/detail",
        component: AccountDetail,
        name: "Account",
        icon: "user"
    }
]

export {
    generalRoutes,
    userRouters,
    adminRoutes
}