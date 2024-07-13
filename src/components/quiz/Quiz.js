import React, { useState, useRef } from 'react';
import jsPDF from 'jspdf';
import axios from 'axios';


const CreateMCQs = () => {
  const [showResult, setShowResult] = useState(false);
  const [result, setResult] = useState({
    score: 0,
    correctAnswers: 0,
    wrongAnswers: 0,
  });

  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [form, setForm] = useState({
    subject: '',
    no_of_mcqs: '',
    level: '',
  });
  const [loading, setLoading] = useState(false); // Add loading state
  const [viewMode, setViewMode] = useState('form'); // New state to manage view mode

  const quizRef = useRef(null);

  const addLeadingZero = (number) => (number > 9 ? number : `0${number}`);

  const downloadQuizAsPDF = () => {
    const doc = new jsPDF();
    let yPos = 10;

    questions.forEach((q, index) => {
      doc.setFontSize(12);

      if (yPos + 50 > doc.internal.pageSize.height) {
        doc.addPage();
        yPos = 10;
      }

      doc.text(10, yPos, `Question ${index + 1}: ${q.mcq}`);
      yPos += 10;

      Object.keys(q.options).forEach((key, idx) => {
        yPos += 7;
        doc.text(15, yPos, `${key}. ${q.options[key]}`);
      });

      yPos += 15;
    });

    doc.save('quiz.pdf');
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: value,
    });
  };

  const fetchQuestions = async () => {
    setLoading(true); // Start loading
    try {
      const response = await axios.post(
        'https://shark-app-bmbbb.ondigitalocean.app/api/general',
        form,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.data) {
        const questionsArray = Object.keys(response.data).map((key) => ({
          id: key,
          ...response.data[key],
          selectedAnswer: '', // Initialize selectedAnswer for each question
          isAnswered: false,
          isCorrect: null, // Track if the answer is correct
        }));

        setQuestions(questionsArray);
        setShowResult(false);
        setCurrentQuestionIndex(0);
        setViewMode('buttons'); // Change view mode to show buttons
      } else {
        console.error('No questions found in response:', response.data);
      }
    } catch (error) {
      console.error('Error fetching questions:', error);
    } finally {
      setLoading(false); // Stop loading
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchQuestions();
  };

  const handleAnswerSelection = (questionId, selectedOption) => {
    const updatedQuestions = questions.map((q) =>
      q.id === questionId
        ? {
            ...q,
            selectedAnswer: selectedOption,
            isAnswered: true,
            isCorrect: selectedOption === q.correct,
          }
        : q
    );

    setQuestions(updatedQuestions);
  };

  const calculateResult = () => {
    let correctCount = 0;
    questions.forEach((q) => {
      if (q.selectedAnswer === q.correct) {
        correctCount++;
      }
    });

    const wrongCount = questions.length - correctCount;
    setResult({
      score: correctCount,
      correctAnswers: correctCount,
      wrongAnswers: wrongCount,
    });

    setShowResult(true);
  };

  const resetQuiz = () => {
    setForm({
      text: '',
      subject: '',
      no_of_mcqs: '',
      level: '',
    });
    setQuestions([]);
    setResult({
      score: 0,
      correctAnswers: 0,
      wrongAnswers: 0,
    });
    setShowResult(false);
    setViewMode('form'); // Reset view mode to form
  };

  const allQuestionsAnswered = questions.every((q) => q.isAnswered || !q.isAnswered);

  return (
    <div className="bg-gradient-to-r from-gray-300 to-slate-200 min-h-screen flex items-center justify-center">
      <div className="quiz-container max-w-screen-sm mx-auto bg-white rounded-lg shadow-lg p-8 relative" ref={quizRef}  style={{ width: '780px' }}>
        {!showResult ? (
          <div >
            {viewMode === 'form' ? (
              <form onSubmit={handleSubmit} className="mb-8">
                <div className="mb-4">
                  <label className="block text-gray-700 font-semibold mb-2">Subject:</label>
                  <input
                    type="text"
                    name="subject"
                    value={form.subject}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring focus:border-blue-300"
                    placeholder='Enter Your Subject Name'
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700">Number of MCQs:</label>
                  <select
                    name="no_of_mcqs"
                    value={form.no_of_mcqs}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded"
                    required
                  >
                    <option value="">Select number of MCQs</option>
                    <option value="2">2</option>
                    <option value="5">5</option>
                    <option value="10">10</option>
                    <option value="15">15</option>
                    <option value="20">20</option>
                  </select>
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 font-semibold mb-2">Level:</label>
                  <input
                    type="text"
                    name="level"
                    value={form.level}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring focus:border-blue-300"
                    placeholder='Enter Your Level'
                    required
                  />
                </div>
                <div className="mb-4">
                  <button
                    type="submit"
                    className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg shadow-lg outline-none border-none flex items-center justify-center"
                    disabled={loading} // Disable button when loading
                  >
                    {loading ? (
                      <svg
                        className="animate-spin h-5 w-5 text-white mr-3"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8v8H4z"
                        ></path>
                      </svg>
                    ) : (
                      'Generate MCQ\'s'
                    )}
                  </button>
                </div>
              </form>
            ) : (
              <div>
                {viewMode === 'buttons' ? (
                  <div>
                  <div className="flex justify-between mb-4">
                    <button
                      onClick={downloadQuizAsPDF}
                      className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg shadow-lg outline-none border-none flex items-center justify-center"
                    >
                      <i className="fa-solid fa-arrow-down me-2" />

                      Download PDF
                    </button>
                    <button
                      onClick={() => setViewMode('quiz')}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow-lg outline-none border-none flex items-center justify-center"
                    >
                      Solve MCQ's
                    </button>
                  
                  </div>
                  <div>
                    {questions.map((question, index) => (
                  <div key={question.id} className=" p-4 rounded-lg ">
                    <p className="font-bold">Q{index + 1}:<span className='ms-1'>{question.mcq}</span></p>

                    <ul className=" space-y-1 mt-2">
                      {Object.keys(question.options).map((key) => (
                        <li
                          key={key}>
                          {key}. {question.options[key]}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
                  </div>
                  </div>
                ) : (
                  <div>
                    {questions.length > 0 && (
                      <div >
                        <div className="flex justify-between items-center mb-4">
                          <h3 className="text-lg font-bold mb-4">
                            Question {addLeadingZero(currentQuestionIndex + 1)}
                          </h3>
                          <p className="text-gray-700">
                            {currentQuestionIndex + 1}/{questions.length}
                          </p>
                        </div>
                        <p className="mb-4">{questions[currentQuestionIndex].mcq}</p>
                        {Object.entries(questions[currentQuestionIndex].options).map(([key, value]) => (
                          <button
                            key={key}
                            onClick={() =>
                              handleAnswerSelection(
                                questions[currentQuestionIndex].id,
                                key
                              )
                            }
                            className={`block w-full text-left px-4 py-2 mb-2 border rounded-lg ${
                              questions[currentQuestionIndex].selectedAnswer === key
                                ? questions[currentQuestionIndex].isCorrect
                                  ? 'bg-green-500 text-white'
                                  : 'bg-red-500 text-white'
                                : 'bg-gray-200 text-gray-800'
                            } ${questions[currentQuestionIndex].isAnswered ? 'cursor-not-allowed' : ''}`}
                            disabled={questions[currentQuestionIndex].isAnswered}
                          >
                            {`${key}: ${value}`}
                          </button>
                        ))}
                        {questions[currentQuestionIndex].isAnswered && !questions[currentQuestionIndex].isCorrect && (
                          <div className="text-red-500 mt-2">
                            Correct Answer: {questions[currentQuestionIndex].correct}
                          </div>
                        )}
                        <div className="flex justify-between mt-4">
                          <button
                            onClick={() =>
                              setCurrentQuestionIndex((prevIndex) => prevIndex - 1)
                            }
                            className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg shadow-lg outline-none border-none"
                            hidden={currentQuestionIndex === 0}
                          >
                      <i className="fa-solid fa-arrow-left me-2" />

                            Previous
                          </button>
                          {currentQuestionIndex < questions.length - 1 ? (
                            <button
                              onClick={() =>
                                setCurrentQuestionIndex((prevIndex) => prevIndex + 1)
                              }
                              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg outline-none border-none"
                            >
                              Next
                              <i className="fa-solid fa-arrow-right ms-2" />

                            </button>
                          ) : (
                            <button
                              onClick={calculateResult}
                              className={`bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg outline-none border-none ${
                                !allQuestionsAnswered ? 'opacity-50 cursor-not-allowed' : ''
                              }`}
                              disabled={!allQuestionsAnswered}
                            >
                              Submit MCQ's
                            </button>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        ) : (
          <div>
            <div className=' h-96'>
            <h2 className="text-5xl font-bold mb-4 text-center">MCQ's Result</h2>
            <p className="mt-10 text-center text-3xl">Total Score:<span className='text-blue-600'> {result.score}</span></p>
            <p className="mt-10 text-3xl text-center mb-2">Correct Answers: <span className='text-green-700'> {result.correctAnswers}</span></p>
            <p className="mb-2 mt-10 text-3xl text-center">Wrong Answers: <span className='text-red-500'> {result.wrongAnswers}</span></p>
            <div className=' text-center mt-12'>
            <button
              onClick={resetQuiz}
              className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg shadow-lg outline-none border-none  "
            >
              <i className="fa-solid fa-arrow-rotate-left me-2" />

              Reset MCQ's
            </button>
          </div>
          </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreateMCQs;
