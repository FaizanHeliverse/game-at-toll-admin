import { Route, Switch } from "react-router-dom";
import Signin from './components/Signin/Signin';
// import Sidebar from './components/Sidebar/Sidebar'
// import Header from './components/Header/Header'
import Admin from './components/Admin/Admin'
import AdminView from "./components/AdminView/AdminView";
function App() {
  return (
    <>
           <main>
        <Switch>
          <Route path="/" exact>
           {/* <Sidebar/>
           <Header/> */}
           <Admin/>
          </Route>
          <Route exact path="/signin">
            <Signin />
          </Route>
          <Route exact path="/admin">
            <AdminView />
          </Route>
        </Switch>
      </main>
    </>
  );
}

export default App;
