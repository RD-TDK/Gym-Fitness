import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import api from '../../../api';
import styles from "../member/Member.module.css";
import fitlogo from '../../../../src/assets/logo-image.jpg';

const CreateSessionForm = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        centerId: '',
        sessionDatetime: '', // 使用 camelCase
        duration: 60,
        price: 50.00,
        goalDescription: '' // 同步修改 goal_description 为 camelCase
    });
    const [centers, setCenters] = useState([]);
    const trainerId = localStorage.getItem('trainerId');

    useEffect(() => {
        // 获取健身中心列表（需后端实现GET /api/centers）
        setCenters([
            { centerId: 4001, name: "Default Fitness Center", city: "New York" },
            { centerId: 4002, name: "Premium Fitness Center", city: "Los Angeles" }
        ]);

        /*const fetchCenters = async () => {
            try {
                const res = await api.get('/api/centers');
                setCenters(res.data);
            } catch (error) {
                console.error('Failed to fetch centers:', error);
            }
        };
        fetchCenters();*/
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                ...formData,
                trainerId: parseInt(trainerId),
                duration: parseInt(formData.duration),
                price: parseFloat(formData.price),
                sessionDatetime: new Date(formData.sessionDatetime).toISOString(),
                goalDescription: formData.goalDescription
            };

            const res = await api.post('/sessions', payload);
            console.log('Session created:', res);
            navigate('/myschedual01'); // 返回课程列表
        } catch (error) {
            console.error('Session creation failed:', error.response?.data);
            alert(`创建失败: ${error.response?.data?.message || '未知错误'}`);
        }
    };

    return (
        <div className={styles.mainaccountcreate}>
            <header className={styles.maintopbar}>
                <img src={fitlogo} alt="" className={styles.fitlogo}></img>
            </header>

            <div className={styles.maintopbar01}>
                <h2 className={styles.maintitle}>CREATE SESSION</h2>
            </div>

            <div className={styles.mainContent}>
                <div className={styles.rightSection} style={{ width: '100%', maxWidth: '600px', margin: '0 auto' }}>
                    <form onSubmit={handleSubmit}>
                        <div style={{ marginBottom: '1.5rem' }}>
                            <label style={{
                                display: 'block',
                                marginBottom: '0.5rem',
                                color: '#FFFFFF',
                                fontFamily: 'Poppins',
                                fontSize: '1rem'
                            }}>
                                Choose Center
                            </label>
                            <select
                                value={formData.centerId}
                                onChange={(e) => setFormData({...formData, centerId: e.target.value})}
                                style={{
                                    width: '100%',
                                    padding: '0.75rem',
                                    background: 'transparent',
                                    border: '1px solid #FFFFFF',
                                    color: '#FFFFFF',
                                    fontFamily: 'Pontano Sans',
                                    fontSize: '16px',
                                    borderRadius: '4px'
                                }}
                                required
                            >
                                <option value="">Select a center</option>
                                {centers.map(center => (
                                    <option key={center.centerId} value={center.centerId}>
                                        {center.name} - {center.city}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div style={{ marginBottom: '1.5rem' }}>
                            <label style={{
                                display: 'block',
                                marginBottom: '0.5rem',
                                color: '#FFFFFF',
                                fontFamily: 'Poppins',
                                fontSize: '1rem'
                            }}>
                                Session Date & Time
                            </label>
                            <input
                                type="datetime-local"
                                value={formData.sessionDatetime}
                                onChange={(e) => setFormData({...formData, sessionDatetime: e.target.value})}
                                min={new Date().toISOString().slice(0, 16)}
                                style={{
                                    width: '100%',
                                    padding: '0.75rem',
                                    background: 'transparent',
                                    border: '1px solid #FFFFFF',
                                    color: '#FFFFFF',
                                    fontFamily: 'Pontano Sans',
                                    fontSize: '16px',
                                    borderRadius: '4px'
                                }}
                                required
                            />
                        </div>

                        <div style={{ marginBottom: '1.5rem' }}>
                            <label style={{
                                display: 'block',
                                marginBottom: '0.5rem',
                                color: '#FFFFFF',
                                fontFamily: 'Poppins',
                                fontSize: '1rem'
                            }}>
                                Duration (minutes)
                            </label>
                            <input
                                type="number"
                                min="30"
                                max="180"
                                step="15"
                                value={formData.duration}
                                onChange={(e) => setFormData({...formData, duration: e.target.value})}
                                style={{
                                    width: '100%',
                                    padding: '0.75rem',
                                    background: 'transparent',
                                    border: '1px solid #FFFFFF',
                                    color: '#FFFFFF',
                                    fontFamily: 'Pontano Sans',
                                    fontSize: '16px',
                                    borderRadius: '4px'
                                }}
                                required
                            />
                        </div>

                        <div style={{ marginBottom: '1.5rem' }}>
                            <label style={{
                                display: 'block',
                                marginBottom: '0.5rem',
                                color: '#FFFFFF',
                                fontFamily: 'Poppins',
                                fontSize: '1rem'
                            }}>
                                Price (USD)
                            </label>
                            <input
                                type="number"
                                min="0"
                                step="5"
                                value={formData.price}
                                onChange={(e) => setFormData({...formData, price: e.target.value})}
                                style={{
                                    width: '100%',
                                    padding: '0.75rem',
                                    background: 'transparent',
                                    border: '1px solid #FFFFFF',
                                    color: '#FFFFFF',
                                    fontFamily: 'Pontano Sans',
                                    fontSize: '16px',
                                    borderRadius: '4px'
                                }}
                                required
                            />
                        </div>

                        <div style={{ marginBottom: '1.5rem' }}>
                            <label style={{
                                display: 'block',
                                marginBottom: '0.5rem',
                                color: '#FFFFFF',
                                fontFamily: 'Poppins',
                                fontSize: '1rem'
                            }}>
                                Session Objectives
                            </label>
                            <textarea
                                value={formData.goalDescription}
                                onChange={(e) => setFormData({...formData, goalDescription: e.target.value})}
                                maxLength="255"
                                style={{
                                    width: '100%',
                                    padding: '0.75rem',
                                    background: 'transparent',
                                    border: '1px solid #FFFFFF',
                                    color: '#FFFFFF',
                                    fontFamily: 'Pontano Sans',
                                    fontSize: '16px',
                                    borderRadius: '4px',
                                    minHeight: '100px',
                                    resize: 'vertical'
                                }}
                                required
                            />
                        </div>

                        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '2rem' }}>
                            <button
                                type="submit"
                                style={{
                                    background: '#F47521',
                                    border: 'none',
                                    color: 'white',
                                    padding: '0.75rem 2rem',
                                    borderRadius: '4px',
                                    fontSize: '1rem',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s',
                                    fontFamily: 'Poppins',
                                    fontWeight: '700'
                                }}
                            >
                                Create Session
                            </button>
                            <button
                                type="button"
                                onClick={() => navigate(-1)}
                                style={{
                                    background: 'transparent',
                                    border: '1px solid #F47521',
                                    color: '#F47521',
                                    padding: '0.75rem 2rem',
                                    borderRadius: '4px',
                                    fontSize: '1rem',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s',
                                    fontFamily: 'Poppins',
                                    fontWeight: '700'
                                }}
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default CreateSessionForm;