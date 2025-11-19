import React from 'react';
import { Link } from 'react-router-dom';

function MyPage({ clubs, currentUser }) {
  if (!currentUser) {
    return (
      <div className="container">
        <h2>My Page</h2>
        <p style={{ textAlign: 'center' }}>Please <Link to="/login">login</Link> to see your clubs.</p>
      </div>
    );
  }

  const myClubs = clubs.filter(club => club.userId === currentUser.id);

  return (
    <div className="container">
      <h2>My Registered Clubs</h2>
      {myClubs.length === 0 ? (
        <p style={{ textAlign: 'center' }}>You haven't registered any clubs yet. <Link to="/register">Register one now!</Link></p>
      ) : (
        <div className="club-list">
          {myClubs.map(club => (
            <Link to={`/club/${club.id}`} key={club.id} style={{ textDecoration: 'none', color: 'inherit' }}>
              <div className="club-card">
                <div className="club-card-image-container">
                  <img 
                    src={club.imageUrl || 'https://via.placeholder.com/400x300.png?text=Moari'} 
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

export default MyPage;
