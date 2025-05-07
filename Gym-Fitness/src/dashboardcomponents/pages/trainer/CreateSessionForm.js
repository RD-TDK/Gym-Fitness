import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import api from '../../../api';
import styles from "./Trainer.module.css";

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
            { centerId: 4001, name: "默认健身中心", city: "北京" },
            { centerId: 4002, name: "测试健身中心", city: "上海" }
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
        <div className={styles.sessionFormContainer}>
            <h2>Create Course</h2>
            <form onSubmit={handleSubmit}>
                <div className={styles.formGroup}>
                    <label>Choose Center:</label>
                    <select
                        value={formData.centerId}
                        onChange={(e) => setFormData({...formData, centerId: e.target.value})}
                        required
                    >
                        <option value="">Please choose center</option>
                        {centers.map(center => (
                            <option key={center.centerId} value={center.centerId}>
                                {center.name} - {center.city}
                            </option>
                        ))}
                    </select>
                </div>

                <div className={styles.formGroup}>
                    <label>Session Datetime:</label>
                    <input
                        type="datetime-local"
                        value={formData.sessionDatetime}
                        onChange={(e) => setFormData({...formData, sessionDatetime: e.target.value})}
                        min={new Date().toISOString().slice(0, 16)}
                        required
                    />
                </div>

                <div className={styles.formGroup}>
                    <label>Duration（minute）:</label>
                    <input
                        type="number"
                        min="30"
                        max="180"
                        step="15"
                        value={formData.duration}
                        onChange={(e) => setFormData({...formData, duration: e.target.value})}
                        required
                    />
                </div>

                <div className={styles.formGroup}>
                    <label>Price（USD）:</label>
                    <input
                        type="number"
                        min="0"
                        step="5"
                        value={formData.price}
                        onChange={(e) => setFormData({...formData, price: e.target.value})}
                        required
                    />
                </div>

                <div className={styles.formGroup}>
                    <label>课程目标描述:</label>
                    <textarea
                        value={formData.goalDescription}
                        onChange={(e) => setFormData({...formData, goalDescription: e.target.value})}
                        maxLength="255"
                    />
                </div>

                <div className={styles.formActions}>
                    <button type="button" onClick={() => navigate(-1)}>取消</button>
                    <button type="submit">创建课程</button>
                </div>
            </form>
        </div>
    );
};

export default CreateSessionForm;