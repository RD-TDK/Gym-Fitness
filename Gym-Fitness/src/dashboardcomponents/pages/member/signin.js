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
            const response = await api.post('/users/login', { email, password });
            const { token, targetPage } = response.data;
            localStorage.setItem('token', token);     // ⑤ 保存 token
            navigate(targetPage);                     // ⑥ 根据后端返回跳转
        } catch (err) {
            // Log the full response for debugging
            console.error('Login error response:', err.response);

            // Extract error data
            const data = err.response?.data;
            const errorMsg = typeof data === 'string'
              ? data
              : data?.message || data?.error || err.response?.statusText || '登录失败，请重试';

            setError(errorMsg);
        }
    };

    return (
        <div className={styles.maincontainer}>
            <header className={styles.maintopbar}>
                <img src={fitlogo} alt="" className={styles.fitlogo} />
                <button className={styles.topButton}>
                    <Link to="/createacc" className={styles.linktopbtn}>SIGNUP</Link>
                </button>
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

                        <Link to="/createacc" className={styles.forgotPassword}>
                            Forgot Password?
                        </Link>

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

                    <div className={styles.signupText}>
                        Don't have an account?{' '}
                        <Link to="/createacc" className={styles.signupLink}>
                            Signup
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
};

export default Signin;

//   return (
//     <div className={styles.maincontainer}>
//       <header className={styles.maintopbar}>
//         <img src={fitlogo} alt="" className={styles.fitlogo}></img>
//    <button className={styles.topButton} >  <Link to="/createacc" className={styles.linktopbtn}>SIGNUP</Link > </button>
//       </header>
//
//       <div className={styles.maintopbar01} >
//       <h2 className={styles.maintitle}>SIGNIN TO YOUR ACCOUNT</h2>
//
//       </div>
//
//       <div className={styles.mainContent}>
//         {/* Left Side Image & Text */}
//         <div className={styles.leftSection}>
//           <img src={fitimage} alt="Fitness Models" className={styles.signinimage} />
//         </div>
//
//         {/* Right Side Form */}
//         <div className={styles.rightSection}>
//           <div className={styles.signInAsSection}>
//             <h3 className={styles.signInAsTitle}>Sign In As</h3>
//             {/* <div className={styles.signInAsOptions}>
//               <Link to="/signin" className={styles.option}>Member</Link>
//               <Link to="/login" className={styles.option}>Personal Trainer</Link>
//               <Link to="/signup" className={styles.option}>Admin</Link>
//             </div> */}
//           </div>
//
//           <input
//             type="email"
//             placeholder="Email Id"
//             className={styles.sigininput}
//           />
//
//           <div className={styles.passwordContainer}>
//             <input
//               type= 'password'
//               placeholder="Password"
//               className={styles.siginpassword}
//             />
//             <img src={eye} alt="eye"></img>
//
//           </div>
//
//           <Link to="/createacc" className={styles.forgotPassword}>Forgot Password?</Link>
//
//           <button className={styles.signInButton}> <Link to="/overviews" className={styles.signInLink}>Sign In</Link>  </button>
//
//           {/* <div className={styles.nextdivider}>
//             <hr className={styles.signhr} />
//             <span className={styles.signTexts}>Or sign in with</span>
//             <hr className={styles.signhr} />
//           </div> */}
//
//           {/* <div className={styles.socialButtonsEnd}>
//         <div className={styles.socialbtn2}>  < img src={google} alt=""  className={styles.icon} />  <Link to="/" className={styles.socialBtn}> Google</Link> </div>
//         <div className={styles.socialbtn2}>    <img src={facebook} alt="" className={styles.icon} /> <Link to="/" className={styles.socialBtn}> Facebook</Link> </div>
//           </div> */}
//
//           <div className={styles.signupText}>
//             Don't have an account? <Link to="/createacc" className={styles.signupLink}>Signup</Link>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }
//
// export default signin