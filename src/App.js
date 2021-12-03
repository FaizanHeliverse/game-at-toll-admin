import { Route, Switch } from "react-router-dom";
import Signin from './components/Signup/Signin';

function App() {
  return (
    <>
           <main>
        <Switch>
          <Route path="/" exact>
            DASHBOARD
          </Route>
          <Route exact path="/signin">
            <Signin />
          </Route>
        </Switch>
      </main>
    </>
  );
}

export default App;
