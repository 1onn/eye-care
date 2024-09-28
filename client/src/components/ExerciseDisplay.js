import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import gfm from 'remark-gfm';
import Heading from './Heading';
import Footer from './Footer';
import './CSS/BlogDisplay.css';

function ExerciseDisplay() {
  const { exerciseId } = useParams();
  const [exercise, setExercise] = useState(null);

  useEffect(() => {
    const fetchExercise = async () => {
      try {
        const response = await fetch(`/api/exercises/${exerciseId}`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setExercise(data);
      } catch (error) {
        console.error('Error fetching exercise:', error);
      }
    };

    fetchExercise();
  }, [exerciseId]);

  if (!exercise) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <Heading />
      <h1>{exercise.ex_title}</h1>
      <div className="blog-display">
            <div>
                <img src={`data:image/jpg;base64,${exercise.ex_pic}`} alt={exercise.ex_title} className="blog-image" />
            </div>
            <div>
                <ReactMarkdown plugins={[gfm]} children={exercise.ex_description} />
            </div>
      </div>
      <Footer />
    </div>
  );
}

export default ExerciseDisplay;
