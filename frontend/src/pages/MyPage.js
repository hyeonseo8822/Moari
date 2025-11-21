import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function MyPage({ currentUser }) {
  const [myClubs, setMyClubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!currentUser) {
      setLoading(false);
      return;
    }

    const fetchMyClubs = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/clubs/user/${currentUser.uid}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setMyClubs(data);
      } catch (e) {
        setError(e);
      } finally {
        setLoading(false);
      }
    };

    fetchMyClubs();
  }, [currentUser]);

  if (!currentUser) {
    return (
      <div className="container">
        <h2>마이페이지</h2>
        <p style={{ textAlign: 'center' }}>당신의 동아리를 보려면 <Link to="/login">로그인</Link> 해주세요.</p>
      </div>
    );
  }

  if (loading) {
    return <div className="container"><h2>로딩 중...</h2></div>;
  }

  if (error) {
    return <div className="container"><h2>오류: {error.message}</h2></div>;
  }

  return (
    <div className="container">
      <h2>내가 등록한 동아리</h2>
      {myClubs.length === 0 ? (
        <p style={{ textAlign: 'center' }}>아직 등록한 동아리가 없습니다. <Link to="/register" className="accent-link">지금 등록해보세요!</Link></p>
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
                    <p><strong>면접일:</strong> {club.interviewDate}</p>
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
