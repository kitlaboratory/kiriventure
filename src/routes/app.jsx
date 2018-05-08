import Dash from '../containers/Dash/Dash.jsx';
import Pages from '../containers/Pages/Pages.jsx';

var appRoutes = [
    { path: "/auth/login-page", name: "Auth", component: Pages },
    { path: "/", name: "Home", component: Dash }
];

export default appRoutes;
