import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function ClubRegistrationPage({ addClub }) {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [interviewDate, setInterviewDate] = useState('');
  const [image, setImage] = useState(null);

  const handleImageChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      setImage(event.target.files[0]);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!name || !description || !interviewDate) {
      alert('Please fill out all fields.');
      return;
    }

    if (image) {
      const reader = new FileReader();
      reader.onloadend = () => {
        addClub({ name, description, interviewDate, imageUrl: reader.result });
        alert('Club registered successfully!');
        navigate('/');
      };
      reader.readAsDataURL(image);
    } else {
      addClub({ name, description, interviewDate, imageUrl: '/img/Pil.svg' });
      alert('Club registered successfully!');
      navigate('/');
    }
  };

  return (
    <div className="container">
      <h2>Register a New Club</h2>
      <div className="form-container">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="clubName">Club Name</label>
            <input
              type="text"
              id="clubName"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              rows="4"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            ></textarea>
          </div>
          <div className="form-group">
            <label htmlFor="interviewDate">Interview Date</label>
            <input
              type="date"
              id="interviewDate"
              value={interviewDate}
              onChange={(e) => setInterviewDate(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="image">Club Image</label>
            <input
              type="file"
              id="image"
              accept="image/*"
              onChange={handleImageChange}
            />
          </div>
          <button type="submit" className="submit-btn">Register Club</button>
        </form>
      </div>
    </div>
  );
}

export default ClubRegistrationPage;
