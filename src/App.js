import './App.css';
import Banks from './Components/Banks';
import Details from './Components/Details';
import { BrowserRouter as Router, Switch,Route,Redirect } from "react-router-dom"

function App() {
  return (
    <>
    <Router>
      <Switch>
      <Route path="/favourites" exact component={Banks}/>
      
      <Route exact path="/"  render={() => <Redirect to="/all-banks" />}/>
  
    <Route path="/all-banks" exact component={Banks}/>
    <Route path="/bank-details" component={Details}/>
    
    </Switch>
    </Router>
    {/* <Banks/> */}
    </>
  );
}

export default App;
