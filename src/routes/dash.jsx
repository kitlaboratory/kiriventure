import Dashboard from '../views/Dashboard/Dashboard.jsx';
import Department from '../views/Department/Department.jsx';
import Calendar from '../views/Calendar/Calendar.jsx';
import Credo from '../views/Credo/Credo.jsx';
import pageRoute from './pages.jsx';
import ManageDep from '../views/Department/Manage.jsx';
import {getDepartments} from '../firebase/database';


let deptartmentRoute = [
    { path: '/departments/manage', name: "Manage Department", mini: "MD", component: ManageDep }
];

var dashRoutes = [
    { path: "/dashboard", name: "Dashboard", icon: "pe-7s-graph", component: Dashboard },
    { path: "/credo", name: "Credo", icon: "pe-7s-date", component: Credo },
    { collapse: true, path: "/departments", name: "Department", state: "openDep", icon: "pe-7s-graph1", views: deptartmentRoute},
    { path: "/calendar", name: "Calendar", icon: "pe-7s-date", component: Calendar },
    { path: "/auth", name: "Auth", icon:"pe-7s-gift",state: "openPages", views:pageRoute},
    { redirect: true, path: "/", pathTo: "/dashboard", name: "Dashboard" }
];

export const AuthenticatedRoute = () => {

    getDepartments().then(response => {
        response.map((item, key) => {
            deptartmentRoute.push({path: '/departments/'+item.id, name: item.name, mini: item.name[0].toUpperCase(), component: Department});
            return "";
        });
    }).catch(error => console.log(error));
    return(
        [
            { path: "/dashboard", name: "Dashboard", icon: "pe-7s-graph", component: Dashboard },
            { path: "/credo", name: "Credo", icon: "pe-7s-date", component: Credo },
            { collapse: true, path: "/departments", name: "Department", state: "openDep", icon: "pe-7s-graph1", views: deptartmentRoute},
            { redirect: true, path: "/", pathTo: "/dashboard", name: "Dashboard" }
        ]
    );
}

export const NonAuthenticateRoute = () => [
    { path: "/auth", name: "Auth", icon:"pe-7s-gift",state: "openPages", views:pageRoute},
    { redirect: true, path: "/", pathTo: "/auth/login-page", name: "Login" }
];

// eslint-disable-next-line
var ManagerRoute = [
    { path: "/dashboard", name: "Dashboard", icon: "pe-7s-graph", component: Dashboard },
    { path: "/dashobard/departmentid", name: "Activity", component: Department},
    { redirect: true, path: "/", pathTo: "/dashboard", name: "Dashboard" }
]

export default dashRoutes;