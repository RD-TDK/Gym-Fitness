// src/pages/Approved.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Member.module.css';  // 和 Overviews 同用一份

const Approved = () => {
    const navigate = useNavigate();

    const handleConfirm = () => {
        // 确认后跳回首页
        navigate('/');
    };

    return (
        <div
            className={styles.headcontainer}
            style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center'
            }}
        >
            <div className={styles.nextoverview02}>
                <div
                    className={styles.topbarover}
                    style={{ width: '100%', justifyContent: 'center' }}
                >
                    <h2
                        className={styles.bar01}
                        style={{ fontSize: '2rem', textAlign: 'center', width: '100%' }}
                    >
                        Membership Pending
                    </h2>
                </div>

                <div className={styles.rightdownpart}>
                    <div className={styles.rightdownpart01}>
                        <p className={styles.rightdownhead1}>
                            Your membership has not been activated yet.<br />
                            Please contact the administrator to activate it.
                        </p>
                        <button
                            className={styles.fullWidthButton}
                            onClick={handleConfirm}
                        >
                            I know 确认
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Approved;