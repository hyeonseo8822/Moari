import React from 'react';
import { useParams } from 'react-router-dom';

function ClubDetailPage({ clubs }) {
  const { id } = useParams();
  const club = clubs.find(c => c.id === parseInt(id));

  if (!club) {
    return <div>Club not found</div>;
  }

  return (
    <div className="container">
      <div className="club-detail">
        {club.imageUrl && (
          <div className="club-image-container">
            <img src={club.imageUrl} alt={club.name} className="club-image" />
          </div>
        )}
        <h2>{club.name}</h2>
        <p>{club.description}</p>
        <p><strong>Interview Date:</strong> {club.interviewDate}</p>
      </div>
    </div>
  );
}

export default ClubDetailPage;
