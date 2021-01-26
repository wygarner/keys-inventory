import React from 'react';
import Signup from './components/Signup'
import { AuthProvider } from './context/authContext';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import Dashboard from './components/Dashboard';
import Login from './components/Login';
import ForgotPassword from './components/ForgotPassword'
import PrivateRoute from './components/PrivateRoute';
import UpdateProfile from './components/UpdateProfile';
import { HeaderComponent, TitleComponent } from './styles/styles';
import InProgress from './components/InProgress';
import Recent from './components/Recent';


function App() {
  return (
    <div className="App" style={{display: 'flex', flexDirection: 'column', flex: 1}}>
      {/* <HeaderComponent>
        <TitleComponent>Keys</TitleComponent>
      </HeaderComponent> */}
      <Router>
        <AuthProvider>
          <Switch>
            <PrivateRoute path="/" component={Dashboard} exact />
            <PrivateRoute path="/in-progress" component={InProgress} exact />
            <PrivateRoute path="/recent" component={Recent} exact />
            <PrivateRoute path="/update-profile" component={UpdateProfile} exact />
            <Route path="/signup" component={Signup} />
            <Route path="/login" component={Login} />
            <Route path="/forgot-password" component={ForgotPassword} />
          </Switch>
        </AuthProvider>
      </Router>
    </div>
  );
}

export default App;
