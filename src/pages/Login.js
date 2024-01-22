
import '../assets/css/login.css';
import {Link, useNavigate} from "react-router-dom";
import {useEffect, useRef, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {loginSuccess, loginFail} from "../actions/authActions";
import empService from "../services/emp-service";


const Login = () => {
    const dispatch = useDispatch();
    const emp = useSelector(state => state.auth);

    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const emailRef = useRef(null);
    const [message, setMessage] = useState("");
    const [isLogin, setIsLogin] = useState(false);

    const handleChangeUsername = (e) => {
        setUsername(e.target.value);
    };
    const handleChangePassword = (e) => {
        setPassword(e.target.value);
    };
    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const data = await empService.login(username, password);
            if (data && data.token && data.permissions && data.permissions.length > 0) {
                const firstPermission = data.permissions[0].prefix;
                dispatch(loginSuccess(data));
                navigate(`/${firstPermission}`);
            }
            else {
                dispatch(loginFail('Login failed.'))
                setMessage('Login failed.')
            }
        }catch (error){
            const resMessage =
                (error.response && error.response.data && error.response.data.message) ||
                error.message ||
                error.toString();
            setMessage(resMessage);
        }
    }

    const checkLogin = () => {
        if(emp && emp.empData){
            setIsLogin(true);
        }
    }
    if(isLogin){
        navigate('/')
    }

    useEffect(() => {
        emailRef.current.focus();
        checkLogin()
    }, [])
    return(
        <>
            <section className="login">
                <div className="login_box">
                    <div className="left">
                        {/*<div className="top_link"><Link to="/"><i className="bi bi-arrow-left-circle"></i> Return home</Link></div>*/}
                        <div className="contact">
                            <form onSubmit={handleLogin}>
                                <h3>LOG IN</h3>
                                <input type="text"
                                       placeholder="Username..."
                                       name="username"
                                       value={username}
                                       onChange={handleChangeUsername}
                                       required
                                       ref={emailRef}
                                />
                                <input type="password"
                                       placeholder="Password..."
                                       name="password"
                                       value={password}
                                       onChange={handleChangePassword}
                                       required
                                />
                                <button className="submit">LOG IN</button>
                            </form>
                            <br/>
                        </div>
                    </div>
                    <div className="right">

                    </div>
                </div>
            </section>
        </>
    )
}

export default Login;