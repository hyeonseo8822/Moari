import React from 'react';
import { Link } from 'react-router-dom';

function MainPage({ clubs }) {
  return (
    <div className="container">
      <h2>Club List</h2>
      {clubs.length === 0 ? (
        <p style={{ textAlign: 'center' }}>No clubs have been registered yet.</p>
      ) : (
        <div className="club-list">
          {clubs.map(club => (
            <Link to={`/club/${club.id}`} key={club.id} style={{ textDecoration: 'none', color: 'inherit' }}>
              <div className="club-card">
                <div className="club-card-image-container">
                  <img 
                    src={club.imageUrl || '/img/Pil.svg'} 
                    alt={club.name} 
                    className="club-card-image" 
                  />
                </div>
                <div className="club-card-content">
                  <h3>{club.name}</h3>
                  <p>{club.description}</p>
                  <div className="club-card-footer">
                    <p><strong>Interview:</strong> {club.interviewDate}</p>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default MainPage;
