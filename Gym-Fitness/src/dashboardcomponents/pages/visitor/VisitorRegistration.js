import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../../api';
import styles from './VisitorRegistration.module.css';
import fitlogo from '../../../../src/assets/logo-image.jpg';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

export default function VisitorRegistration() {
    // 表单状态
    const [form, setForm] = useState({
        name: '',
        gender: '',
        email: '',
        phoneNumber: '',
        address: '',
        birthday: null,
        password: '',
        confirmPassword: '',
        verificationCode: ''
    });
    const [error, setError] = useState('');
    const [codeSent, setCodeSent] = useState(false);
    const navigate = useNavigate();

    // 公共修改函数
    const onChange = (key) => (e) =>
        setForm({ ...form, [key]: e.target.value });

    // 发送验证码
    const handleSendCode = async () => {
        try {
            await api.post('/users/sendVerificationCode', null, {
                params: { email: form.email }
            });
            setCodeSent(true);
        } catch (err) {
            setError(err.response?.data || '验证码发送失败');
        }
    };

    // 提交注册
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (form.password !== form.confirmPassword) {
            setError('两次密码不一致');
            return;
        }
        try {
            // Format birthday as yyyy-MM-dd, not ISO with time
            const payload = {
                ...form,
                birthday: form.birthday
                    ? form.birthday.toISOString().split('T')[0]
                    : null
            };
            await api.post('/users/register', payload);
            // 注册成功回到登录页
            navigate('/signin');
        } catch (err) {
            const msg = err.response?.data?.message || '注册失败';
            setError(msg);
        }
    };

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <img src={fitlogo} alt="Logo" className={styles.logo} />
                <Link to="/signin" className={styles.topLink}>
                    Already has a account?
                </Link>
            </header>

            <h2 className={styles.title}>SIGN UP </h2>

            <form onSubmit={handleSubmit} className={styles.form}>
                <input
                    type="text"
                    placeholder="Full Name"
                    value={form.name}
                    onChange={onChange('name')}
                    className={styles.input}
                    required
                />
                <select
                    value={form.gender}
                    onChange={onChange('gender')}
                    className={styles.input}
                    required
                >
                    <option value="">Select Gender</option>
                    <option value="MALE">Male</option>
                    <option value="FEMALE">Female</option>
                    <option value="OTHER">Other</option>
                </select>
                <input
                    type="email"
                    placeholder="Email"
                    value={form.email}
                    onChange={onChange('email')}
                    className={styles.input}
                    required
                />
                {/* 发送验证码按钮 */}
                <div className={styles.codeRow}>
                    <input
                        type="text"
                        placeholder="Verification Code"
                        value={form.verificationCode}
                        onChange={onChange('verificationCode')}
                        className={styles.inputFlex}
                        required
                    />
                    <button
                        type="button"
                        className={styles.codeBtn}
                        onClick={handleSendCode}
                        disabled={!form.email}
                    >
                        {codeSent ? 'Resend' : 'Send Code'}
                    </button>
                </div>
                <input
                    type="tel"
                    placeholder="Phone Number"
                    value={form.phoneNumber}
                    onChange={onChange('phoneNumber')}
                    className={styles.input}
                    required
                />
                <input
                    type="text"
                    placeholder="Address"
                    value={form.address}
                    onChange={onChange('address')}
                    className={styles.input}
                    required
                />
                <DatePicker
                    selected={form.birthday}
                    onChange={date => setForm({ ...form, birthday: date })}
                    placeholderText="Date of Birth"
                    className={styles.input}
                    wrapperClassName={styles.dateWrapper}
                    dateFormat="yyyy/MM/dd"
                    isClearable
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={form.password}
                    onChange={onChange('password')}
                    className={styles.input}
                    required
                />
                <input
                    type="password"
                    placeholder="Confirm Password"
                    value={form.confirmPassword}
                    onChange={onChange('confirmPassword')}
                    className={styles.input}
                    required
                />
                <button type="submit" className={styles.button}>
                    CREATE ACCOUNT
                </button>
                {error && <p className={styles.error}>{error}</p>}
            </form>
        </div>
    );
}