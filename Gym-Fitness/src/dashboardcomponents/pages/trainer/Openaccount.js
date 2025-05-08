import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../../api';
import styles from "./Trainer.module.css";
import { Link } from 'react-router-dom';
import fitimage from '../../../../src/assets/signup-image.png';
import fitlogo from '../../../../src/assets/logo-image.jpg';
import eye from '../../../../src/assets/password-hide.png';
// import google from '../../../../src/assets/google.png';
// import facebook from '../../../../src/assets/icons-facebook.png';


const Openaccount = () => {
  const [specialty, setSpecialty] = useState('');
  const [experience, setExperience] = useState('');
  const [certification, setCertification] = useState('');
  const [bio, setBio] = useState('');
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState('');
  const navigate = useNavigate();

  const handlePhotoChange = e => {
    const file = e.target.files[0];
    if (file) {
      setPhotoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setPhotoPreview(reader.result);
      reader.readAsDataURL(file);
    } else {
      setPhotoFile(null);
      setPhotoPreview('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('specialty', specialty);
      formData.append('experience', experience);
      formData.append('certification', certification);
      formData.append('bio', bio);
      if (photoFile) {
        formData.append('photo', photoFile);
      }

      await api.post('/trainers/register', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      navigate('/overviews1');
    } catch (err) {
      console.error('Trainer registration error:', err);
    }
  };

  return (
    <div className={styles.mainaccountcreate}>
      <header className={styles.maintopbar}>
        <img src={fitlogo} alt="" className={styles.fitlogo}></img>
      </header>

      <div className={styles.maintopbar01}>
        <h2 className={styles.maintitle}>BECOME A TRAINER</h2>
      </div>

      <div className={styles.mainContent}>
        {/* Left Side Image & Text */}
        <div className={styles.leftSection}>
          <img src={fitimage} alt="Fitness Models" className={styles.signinimage} />
        </div>

        {/* Right Side Form */}
        <div className={styles.rightSection}>
          <h3 className={styles.maintitle}>Become a Trainer</h3>
          <form onSubmit={handleSubmit} className={styles.formSection}>
            <label className={styles.uploadLabel}>
              Upload your image
              <input
                type="file"
                accept="image/*"
                className={styles.fileInputHidden}
                onChange={handlePhotoChange}
              />
            </label>
            {photoPreview && (
              <img
                src={photoPreview}
                alt="Trainer Preview"
                className={styles.imagePreview}
              />
            )}
            <input
              type="text"
              placeholder="Specialty"
              className={styles.sigininput}
              value={specialty}
              onChange={e => setSpecialty(e.target.value)}
              required
            />
            <input
              type="number"
              placeholder="Years of Experience"
              className={styles.sigininput}
              min="0"
              step="1"
              value={experience}
              onChange={e => setExperience(e.target.value)}
              required
            />
            <input
              type="text"
              placeholder="Certification"
              className={styles.sigininput}
              value={certification}
              onChange={e => setCertification(e.target.value)}
              required
            />
            <textarea
              placeholder="Bio"
              className={styles.sigininput}
              value={bio}
              onChange={e => setBio(e.target.value)}
              required
            />
            <button type="submit" className={styles.signInButton}>
              Sign Up as Trainer
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Openaccount