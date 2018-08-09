import * as React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Switch,
} from 'react-router-dom';
import Analytics from '../Analytics';
import Header from '../Header';
import MapPage from '../MapPage';
import DashboardPage from '../DashboardPage';
import ImportPage from '../ImportPage';
import SignUpPage from '../SignupPage';
import SettingsPage from '../SettingsPage';
import TermsOfServicePage from '../TermsOfServicePage';
import LoginPage from '../LoginPage';
import { User } from '../../types';
import * as R from '../../types/routes';
import './index.css';

export interface StateFromProps {
  checked: boolean;
  authenticated: boolean;
  // tslint:disable:no-any
  user?: User;
}

export type Props = StateFromProps;

/**
 * The application entry point.
 *
 * It matches the index page with exact path so it will not leave the bid undefined.
 *
 * @see https://github.com/SenseTW/sensetw/issues/81
 */
export class App extends React.Component<Props> {
  render() {
    return (
      <Router basename={process.env.PUBLIC_URL}>
      { this.props.checked &&
          <div className="App">
            <Route render={(props) => <Analytics {...props} trackingId="UA-112380022-4" />} />
            <Header />
            <Switch>
              <Route exact path={R.index} component={DashboardPage} />
              <Route exact path={R.importer} component={ImportPage} />
              <Route exact path={R.settings} component={SettingsPage} />
              <Route exact path={R.mapList} component={DashboardPage} />
              <Route exact path={R.map} component={MapPage} />
              <Route path={R.submap} component={MapPage} />
              <Route path={R.signup} component={SignUpPage} />
              <Route path={R.login} component={LoginPage} />
              <Route path={R.termsOfService} component={TermsOfServicePage} />
            </Switch>
          </div>
      }
      </Router>
    );
  }
}

export default App;
