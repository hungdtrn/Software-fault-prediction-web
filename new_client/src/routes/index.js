import { Redirect } from 'react-router-dom'
import { Login, Register, Home, Project, Algorithm, 
        AccountDetail, NoMatch, ProjectForm } from '../views/pages';
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
        component: withAuthentication(Home)    
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
    },
    {
        path: "*",
        component: NoMatch,
    },
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
    },
    {
        path: "*",
        component: NoMatch,
    },
]

const projectRoutes = [
    {
        path: "/projects/create",
        component: ProjectForm,
    }
]

export {
    generalRoutes,
    userRouters,
    adminRoutes,
    projectRoutes,
}