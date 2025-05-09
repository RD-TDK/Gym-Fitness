import React , { useState }from "react";
import styles from "./Member.module.css";
import fitimage from '../../../../src/assets/signup-image.png';
import fitlogo from '../../../../src/assets/logo-image.jpg';
import eye from '../../../../src/assets/password-hide.png';
// import google from '../../../../src/assets/google.png';
// import facebook from '../../../../src/assets/icons-facebook.png';
import { useNavigate, Link } from "react-router-dom";
import api from '../../../api';



const Signin = () => {
    // ② 用于存储表单输入和错误信息
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();               // ③ 用于登录后路由跳转

    // ④ 提交处理函数：调用后端 login 接口
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const { data } = await api.post('/users/login', { email, password });
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            navigate(data.targetPage);                // ⑥ 根据后端返回跳转
        } catch (err) {
            // Log the full response for debugging
            console.error('Login error response:', err.response);

            // Extract error data
            const data = err.response?.data;
            const errorMsg = typeof data === 'string'
              ? data
              : data?.message || data?.error || err.response?.statusText || 'Login failed. Please try again';

            setError(errorMsg);
        }
    };

    return (
        <div className={styles.maincontainer}>
            <header className={styles.maintopbar}>
                <img src={fitlogo} alt="" className={styles.fitlogo} />
            </header>

            <h2 className={styles.maintitle}>SIGNIN TO YOUR ACCOUNT</h2>

            <div className={styles.mainContent}>
                <div className={styles.leftSection}>
                    <img
                        src={fitimage}
                        alt="Fitness Models"
                        className={styles.signinimage}
                    />
                </div>

                {/* —— 关键改动 —— */}
                <div className={styles.rightSection}>
                    <form onSubmit={handleSubmit}>           {/* A. 将原来零散的 inputs 和 button 包成 <form> */}
                        <input
                            type="email"
                            placeholder="Email Id"
                            className={styles.sigininput}
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            required
                        />

                        <div className={styles.passwordContainer}>
                            <input
                                type="password"
                                placeholder="Password"
                                className={styles.siginpassword}
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                required
                            />
                            <img src={eye} alt="eye" />
                        </div>


                        <button
                            type="submit"
                            className={styles.signInButton}
                        >
                            Sign In
                        </button>

                        {error && (
                            <p className={styles.errorText}>
                                {error}
                            </p>
                        )}
                    </form>
                    {/* —— 关键改动结束 —— */}

                </div>
            </div>
        </div>
    )
};

export default Signin;