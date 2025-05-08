// src/dashboardcomponents/pages/visitor/VisitorChoice.js
import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Visitor.module.css';

const VisitorChoice = () => (
    <div className={styles.wrapper}>
        <h2 className={styles.title}>Welcome! Choose Your Role</h2>

        <div className={styles.options}>
            <Link to="/member/signup"   className={styles.btn}>Become a Member</Link>
            <Link to="/trainer/signup"  className={styles.btn}>Become a Trainer</Link>
        </div>
    </div>
);

export default VisitorChoice;