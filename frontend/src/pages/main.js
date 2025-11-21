import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

function MainPage({ searchTerm }) { // Receive searchTerm as prop
  const [clubs, setClubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchClubs = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/clubs');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setClubs(data);
      } catch (e) {
        setError(e);
      } finally {
        setLoading(false);
      }
    };

    fetchClubs();
  }, []);

  const filteredClubs = clubs.filter(club => {
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    
    // Search by club name (priority)
    if (club.name.toLowerCase().includes(lowerCaseSearchTerm)) {
      return true;
    }
    
    // Search by tags (secondary)
    if (club.tags && club.tags.some(tag => tag.toLowerCase().includes(lowerCaseSearchTerm))) {
      return true;
    }

    return false;
  });

  if (loading) {
    return <div className="container"><h2>로딩 중...</h2></div>;
  }

  if (error) {
    return <div className="container"><h2>오류: {error.message}</h2></div>;
  }

  return (
    <div className="container">
      <h2>동아리 목록</h2>
      {filteredClubs.length === 0 ? ( // Use filteredClubs
        <p style={{ textAlign: 'center' }}>아직 등록된 동아리가 없습니다.</p>
      ) : (
        <div className="club-list">
          {filteredClubs.map(club => ( // Use filteredClubs
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
                  {club.oneLineIntro && <p className="club-one-line-intro">{club.oneLineIntro}</p>} {/* Display one-line intro */}
                  {club.tags && club.tags.length > 0 && (
                    <div className="club-tags-main">
                      {club.tags.map((tag, index) => (
                        <span key={index} className="club-tag-main">{tag}</span>
                      ))}
                    </div>
                  )}
                  {/* 면접일 removed as requested */}
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
