import { Redirect } from 'react-router-dom'
import { Login, Register, Home, Project, Algorithm, 
        AccountDetail, NoMatch, ProjectForm, ProjectDetail,
        FileDetail, Model, ModelForm } from '../views/pages';
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


const projectRoutes = [
    {
        path: "/projects/create",
        component: ProjectForm,
    },
    {
        path: "/projects/:projectId/files",
        component: ProjectDetail,
        exact: true,
    },
    {
        path: "/projects/:projectId/files/:fileId",
        component: FileDetail,
    },
]

const adminRoutes = [
    {
        path: "/models",
        component: Model,
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

const modelRoutes = [
    {
        path: "/models/create",
        component: ModelForm,
    }
]

export {
    generalRoutes,
    userRouters,
    projectRoutes,
    adminRoutes,
    modelRoutes
}