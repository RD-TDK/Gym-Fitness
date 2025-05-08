// src/dashboardcomponents/pages/member/Createacc.js
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../../api';             // axios 实例，baseURL=/api 自动加前缀
import styles from './Member.module.css';
import fitlogo from '../../../../src/assets/logo-image.jpg';

export default function Createacc() {
    const [planType, setPlanType] = useState('BASIC');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user'));
    console.log('当前用户 id:', user.userId);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            // 调用后端 /api/memberships/register
            await api.post('/memberships/register', { planType });
            // 注册成功后跳到会员首页
            navigate('/overviews');
        } catch (err) {
            console.error('会员注册失败:', err.response);
            const data = err.response?.data;
            const msg = typeof data === 'string'
                ? data
                : data?.message || '注册会员失败，请重试';
            setError(msg);
        }
    };

    return (
        <div className={styles.mainaccountcreate}>
            <header className={styles.maintopbar}>
                <img src={fitlogo} alt="Logo" className={styles.fitlogo} />
            </header>

            <div className={styles.maintopbar01}>
                <h2 className={styles.maintitle}>Become a Member</h2>
            </div>
            {/* —— 套餐卡片展示 —— */}
            <div className={styles.planCards}>
                <div
                    className={`${styles.planCard} ${planType === 'BASIC' ? styles.planCardSelected : ''}`}
                    onClick={() => setPlanType('BASIC')}
                >
                    <h3>Basic</h3>
                    <p>Access to gym equipment and group classes.</p>
                    <p><strong>$19.99/mo</strong></p>
                </div>
                <div
                    className={`${styles.planCard} ${planType === 'PREMIUM' ? styles.planCardSelected : ''}`}
                    onClick={() => setPlanType('PREMIUM')}
                >
                    <h3>Premium</h3>
                    <p>Includes Basic, plus one personal training session each month.</p>
                    <p><strong>$39.99/mo</strong></p>
                </div>
                <div
                    className={`${styles.planCard} ${planType === 'GOLD' ? styles.planCardSelected : ''}`}
                    onClick={() => setPlanType('GOLD')}
                >
                    <h3>Gold</h3>
                    <p>All Premium benefits, plus unlimited personal training.</p>
                    <p><strong>$59.99/mo</strong></p>
                </div>
            </div>

            <div className={styles.memberWrapper}>
            <form onSubmit={handleSubmit} className={styles.rightSection}>
                <button type="submit" className={`${styles.signInButton} ${styles.fullWidthButton}`}>
                    Sign Up as Member
                </button>
                {error && <p className={styles.errorText}>{error}</p>}
            </form>
        </div>

        </div>
    );
}
