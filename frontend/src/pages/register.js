import React, { useState, useContext, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { NotificationContext } from '../context/NotificationContext';
import { auth } from '../firebase';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import SimpleMdeReact from "react-simplemde-editor";
import "easymde/dist/easymde.min.css";
import { WithContext as ReactTags } from 'react-tag-input'; // Import ReactTags

function ClubRegistrationPage() {
  const navigate = useNavigate();
  const { showNotification } = useContext(NotificationContext);
  const [name, setName] = useState('');
  const [oneLineIntro, setOneLineIntro] = useState(''); // New state for one-line intro
  const [description, setDescription] = useState('');
  const [interviewDate, setInterviewDate] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState('');
  const [currentUser, setCurrentUser] = useState(null);
  const [tags, setTags] = useState([]); // New state for tags
  const [clubLink, setClubLink] = useState(''); // New state for club link

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      setCurrentUser(user);
    });
    return () => unsubscribe();
  }, []);

  const handleImageChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setImageFile(null);
      setImagePreviewUrl('');
    }
  };

  const handleDeleteTag = (i) => {
    setTags(tags.filter((tag, index) => index !== i));
  };

  const handleAdditionTag = (tag) => {
    setTags([...tags, tag]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!name || !oneLineIntro || !description || !interviewDate || tags.length === 0 || !clubLink) { // Validate new field
      showNotification('모든 필드를 채워주세요.', 'error');
      return;
    }

    if (!currentUser) {
        showNotification('동아리 등록을 위해 로그인해야 합니다.', 'error');
        navigate('/login');
        return;
    }

    const formattedInterviewDate = interviewDate.toISOString().split('T')[0];

    let imageUrlToUpload = '';
    if (imageFile) {
      imageUrlToUpload = imagePreviewUrl;
    } else {
      imageUrlToUpload = '/img/Pil.svg';
    }

    try {
        const response = await fetch('http://localhost:5000/api/clubs/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name,
                oneLineIntro, // Include one-line intro
                description,
                interviewDate: formattedInterviewDate,
                imageUrl: imageUrlToUpload,
                userId: currentUser.uid,
                tags: tags.map(tag => tag.text), // Send only tag text
                clubLink, // Include club link
            }),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || '동아리 등록 중 알 수 없는 오류가 발생했습니다.');
        }

        showNotification('동아리가 성공적으로 등록되었습니다!', 'success');
        navigate('/');
    } catch (error) {
        console.error("Club Registration Error:", error);
        showNotification(error.message, 'error');
    }
  };

  const mdeOptions = useMemo(() => {
    return {
      spellChecker: false,
      hideIcons: ["guide", "fullscreen", "side-by-side"],
      autofocus: false, // Set autofocus to false
    };
  }, []);

  return (
    <div className="container">
      <h2>동아리 등록</h2>
      <div className="form-container">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="clubName">동아리 이름</label>
            <input
              type="text"
              id="clubName"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="oneLineIntro">한 줄 소개</label>
            <input
              type="text"
              id="oneLineIntro"
              value={oneLineIntro}
              onChange={(e) => setOneLineIntro(e.target.value)}
              maxLength="100" // Limit to 100 characters
              placeholder="동아리를 한 줄로 소개해주세요 (최대 100자)"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="tags">태그</label>
            <ReactTags
              tags={tags}
              handleDelete={handleDeleteTag}
              handleAddition={handleAdditionTag}
              // Removed autocomplete prop as it's deprecated
              placeholder="태그를 입력하고 Enter를 누르세요"
              classNames={{
                tags: 'react-tags',
                tagInput: 'react-tags__input',
                tagInputField: 'react-tags__inputField',
                selected: 'react-tags__selected',
                tag: 'react-tags__tag',
                suggestions: 'react-tags__suggestions',
                activeSuggestion: 'react-tags__activeSuggestion'
              }}
              tagComponent={({ tag, index, onDelete }) => (
                <span key={index} className="react-tags__tag" onClick={() => onDelete(index)}>
                  {tag.text}
                </span>
              )}
              removeComponent={() => <></>} // Explicitly hide the remove component
              // Props to control behavior
              minQueryLength={0}
              autoFocus={false} // Changed from autofocus to autoFocus
              allowUnique={true}
              delimiters={[]} // Remove default delimiters like Enter, Tab, Comma
              maxTags={10} // Optional: Limit the number of tags
            />
          </div>
          <div className="form-group">
            <label htmlFor="description">동아리 설명</label>
            <SimpleMdeReact
              value={description}
              onChange={setDescription}
              options={mdeOptions}
            />
          </div>
          <div className="form-group">
            <label htmlFor="clubLink">동아리 신청 링크</label>
            <input
              type="url" // Use type="url" for link validation
              id="clubLink"
              value={clubLink}
              onChange={(e) => setClubLink(e.target.value)}
              placeholder="https://yourclub.com/apply"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="interviewDate">면접 날짜</label>
            <DatePicker
              id="interviewDate"
              selected={interviewDate}
              onChange={(date) => setInterviewDate(date)}
              dateFormat="yyyy-MM-dd"
              className="react-datepicker-custom-input"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="image">동아리 대표 이미지</label>
            <label htmlFor="image" className="file-input-label">
              파일 선택
            </label>
            <input
              type="file"
              id="image"
              accept="image/*"
              onChange={handleImageChange}
              className="file-input-hidden"
            />
            {imagePreviewUrl && (
              <div className="image-preview-container">
                <img src={imagePreviewUrl} alt="Selected club preview" className="image-preview" />
              </div>
            )}
          </div>
          <button type="submit" className="submit-btn">동아리 등록</button>
        </form>
      </div>
    </div>
  );
}

export default ClubRegistrationPage;
