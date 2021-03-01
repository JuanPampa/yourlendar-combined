import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";
import Application from './application/Application';
import UsersAuth from './users/UsersAuth';
import UsersRegister from './users/UsersRegister';
import TimeTableManager from './application/timetable/TimeTableManager';
class App extends React.Component {
  render() {
    // Using react router to handle different paths.
    return (
      <Router>
        <Switch>

          <Route path="/users/auth"><UsersAuth /></Route>
          <Route path="/users/register"><UsersRegister /></Route>
          <Route path="/timetable"><TimeTableManager /></Route>
          <Route path="/">
            <Application />
          </Route>

        </Switch>
      </Router>
    )
  };
}

export default App;
