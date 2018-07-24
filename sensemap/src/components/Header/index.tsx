import * as React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Menu, Icon, Dropdown } from 'semantic-ui-react';
import Breadcrumb from './Breadcrumb';
import Submenu from './Submenu';
import * as R from '../../types/routes';
import './index.css';
import { actions, ActionProps, mapDispatch } from '../../types';
const logo = require('./logo.png');

type StateFromProps = {
};

// tslint:disable:no-any
type Props = StateFromProps & ActionProps & RouteComponentProps<any>;

/**
 * The header contains a main menu with a submenu.
 *
 * It extends the normal React component instead of the pure component so the
 * breadcrumb component will rerender properly after updates.
 */
class Header extends React.Component<Props> {
  render() {
    return (
      <div className="sense-header">
        <Menu inverted>
          <Menu.Item as={Link} to={R.index}>
            <img src={logo} />
          </Menu.Item>
          <Menu.Item
            as="a"
            href="https://about.sense.tw/"
            target="_blank"
            rel="noopener noreferrer"
          >
            About
          </Menu.Item>
          <Menu.Item
            as={Link}
            to={R.mapList}
          >
            Dashboard
          </Menu.Item>
          <Menu.Menu position="right">
            <Menu.Item>
              <Icon name="question circle outline" size="large" />
            </Menu.Item>
            <Menu.Item>
              <Dropdown
                item
                icon={
                  <div>
                    <Icon name="user circle" size="large" />
                    &nbsp;
                    <Icon name="triangle down" />
                  </div>
                }
              >
                <Dropdown.Menu>
                  <Dropdown.Item
                    as={Link}
                    to={R.settings}
                  >
                    Settings
                  </Dropdown.Item>
                  <Dropdown.Item
                    as={Link}
                    to={R.login}
                  >
                    Login
                  </Dropdown.Item>
                  <Dropdown.Item
                    onClick={(e) => {
                      actions.account.logoutRequest(this.props.history);
                    }}
                  >
                    Logout
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </Menu.Item>
          </Menu.Menu>
        </Menu>
        <div className="sense-header__submenu">
          <Breadcrumb />
          <Submenu />
        </div>
      </div>
    );
  }
}

export default connect<StateFromProps, ActionProps>(
  (state: Props) => state,
  mapDispatch({actions})
)(withRouter(Header));