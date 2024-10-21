import React from 'react';
import { BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import FlightBooking from './pages/FlightBooking';
import NotFound from './pages/NotFound';


function App() {

  return (
    <Router>
      <Switch>
        <Route path="/landing"><FlightBooking /></Route>
        <Route component={NotFound} /> {/* Catch-all route for 404 */}
      </Switch>
    </Router>
  )
}

export default App