import React, { useState } from 'react';
import './App.css';

import { Router, navigate } from '@reach/router';
import { CssBaseline, Box, Typography, BottomNavigation, BottomNavigationAction } from '@material-ui/core';
import { Home as HomeIcon, Assignment as ContestIcon, FlightTakeoff as TravelIcon, ContactMail as ContactIcon, PersonAdd as SignUpIcon, LockOpen as LoginIcon, Dashboard as DashboardIcon, AttachMoney as PaymentIcon } from '@material-ui/icons'

import Home from './pages/home';
import Contest from './pages/contest';
import Travel from './pages/travel';
import Contact from './pages/contact';
import SignUp from './pages/signup';
import Login from './pages/login';
import Dashboard from './pages/dashboard';
import Payment from './pages/payment';

/*
TODO: is EMCC 2021 even happening? Is it remote?
TODO: make styles for each component using material-ui styles
background for hero and nav should be rgb(140,0,0)
see http://exeter-math.appspot.com/ for more details
TODO: confirm all config values with Mr. Feng
TODO: invoices
*/

// begin authentication plumbing code
const userStatus = {
    NoUser: 'no-user',
    UserLoaded: 'user-loaded'
}

export const UserContext = React.createContext();

class PrivateRoute extends React.Component {
    static contextType = UserContext;

    render() {
        let { as: PrivateComponent, ...props } = this.props;
        return this.context.status === userStatus.NoUser ?
            <Box>
                <Typography variant='h5'>
                    Unable to show info. Please log in first.
                </Typography>
                <Login />
            </Box> :
            <PrivateComponent {...props} />;
    }
}
// end authentication plumbing code

const parseCurrentPageFromUrl = () => {
    const currentFullUrl = window.location.href.split('/')
    let currentPage = ''
    // we are on the home page (with or without a final slash)
    if (currentFullUrl.length === 3 || (currentFullUrl.length === 4 && currentFullUrl[3] === ''))
        currentPage = ''
    // last character is a slash
    else if (currentFullUrl[currentFullUrl.length - 1] === '')
        currentPage = currentFullUrl[currentFullUrl.length - 2];
    // last character is not a slash
    else
        currentPage = currentFullUrl[currentFullUrl.length - 1];
    return currentPage;
}

const EMCCNav = () => {
    // EMCCNav state must be equal to the "value" prop of
    // the BottomNavigationAction that we want to highlight
    // aka the current page
    const currentPage = parseCurrentPageFromUrl();
    const [currentUrl, setUrl] = useState('/' + currentPage);
    const handleButtonClicked = (_, newUrl) => {
        navigate(newUrl);
        setUrl(newUrl);
    }

    return (
        <BottomNavigation value={currentUrl} showLabels onChange={handleButtonClicked}>
            <BottomNavigationAction label='Home' value='/' icon={<HomeIcon />} />
            <BottomNavigationAction label='Contest' value='/contest' icon={<ContestIcon />} />
            <BottomNavigationAction label='Travel' value='/travel' icon={<TravelIcon />} />
            <BottomNavigationAction label='Contact' value='/contact' icon={<ContactIcon />} />
            <BottomNavigationAction label='Sign Up' value='/signup' icon={<SignUpIcon />} />
            <BottomNavigationAction label='Login' value='/login' icon={<LoginIcon />} />
            <BottomNavigationAction label='Dashboard' value='/dashboard' icon={<DashboardIcon />} />
            <BottomNavigationAction label='Payment' value='/payment' icon={<PaymentIcon />} />
        </BottomNavigation>
    );
}

const App = () => {
    return (
        <div className="App">
            <CssBaseline />
            <UserContext.Provider value={{ status: userStatus.NoUser, user: null, password: null }}>
                <EMCCNav />
                <Router>
                    <Home path='/' />
                    <Contest path='/contest' />
                    <Travel path='/travel' />
                    <Contact path='/contact' />
                    <Login path='/login' />
                    <SignUp path='/signup' />
                    <PrivateRoute as={Dashboard} path='/dashboard' />
                    <Payment path='/payment' />
                </Router>
            </UserContext.Provider>
        </div >
    );
}

export default App;
