import {BrowserRouter,useHistory,Switch,Route,Redirect} from "react-router-dom";
import { AuthProvider } from "../contexts/AuthContext";
import "../styles/app.js.css";
import DashBoard from "./dashboard";
import Login from "./login";
import Register from "./register";
import Expenses from "./expenses";
import Reports from "./reports";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
      <Switch>
        <Route exact path="/">
          <Redirect to="dashboard"/>
        </Route>
        <Route exact path="/dashboard" component={DashBoard} history={useHistory()}/>
        <Route path="/login" component={Login} history={useHistory()}/>
        <Route path="/signup" component={Register} history={useHistory()}/>
        <Route path="/expenses" component={Expenses} history={useHistory()}/>
        <Route path="/reports" component={Reports} history={useHistory()}/>
      </Switch>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
