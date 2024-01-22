import './App.css';
import {Navigate, Route, Routes} from "react-router-dom";
import Admin from "./pages/Admin";
import Login from "./pages/Login";
import {useSelector} from "react-redux";

function PrivateRoute({ element, roles }) {
    const emp = useSelector(state => state.auth);
    if (!emp.empData) {
        // if not logged in
        return <Navigate to="/login"/>;
    }
    return element;

}

function App() {
  return (
    <div>
      <Routes>
        <Route path={'/login'} element={<Login/>}/>
        <Route path={'/*'}
               element={<PrivateRoute element={<Admin/>}/> }
        />
      </Routes>
    </div>
  );
}

export default App;
