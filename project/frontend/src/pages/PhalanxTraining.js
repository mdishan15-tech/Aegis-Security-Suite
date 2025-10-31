import React, { useState, useEffect } from 'react';
import { BookOpen, CheckCircle, XCircle, AlertTriangle, Award, TrendingUp, Clock, Target } from 'lucide-react';
import { phalanxService } from '../services/api';
import { getCurrentUTCTime } from '../utils/timeUtils';
import AnimatedCard from '../components/common/AnimatedCard';

const PhalanxTraining = () => {
  const [modules, setModules] = useState([]);
  const [activeModule, setActiveModule] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [userProgress, setUserProgress] = useState({
    completed: 0,
    totalScore: 85,
    accuracy: 85
  });

  useEffect(() => {
    loadTrainingModules();
  }, []);

  const loadTrainingModules = async () => {
    try {
      const { data } = await phalanxService.getTrainingModules();
      setModules(data.modules || []);
      
      // Calculate progress
      const completed = data.modules.filter(m => m.completed).length;
      const total = data.modules.length;
      setUserProgress(prev => ({
        ...prev,
        completed: Math.round((completed / total) * 100)
      }));
    } catch (error) {
      console.error('Failed to load modules:', error);
    }
  };

  const startModule = async (module) => {
    try {
      const { data } = await phalanxService.startSimulation(module.id);
      setActiveModule(data.module);
      setCurrentQuestion(0);
      setScore(0);
      setShowResults(false);
      setSelectedAnswer(null);
    } catch (error) {
      console.error('Failed to start module:', error);
    }
  };

  const handleAnswer = (answerIndex) => {
    setSelectedAnswer(answerIndex);
  };

  const submitAnswer = async () => {
    if (selectedAnswer === null) return;

    const isCorrect = activeModule.scenarios[currentQuestion].correct === selectedAnswer;
    
    if (isCorrect) {
      setScore(prev => prev + 1);
    }

    if (currentQuestion < activeModule.scenarios.length - 1) {
      setTimeout(() => {
        setCurrentQuestion(prev => prev + 1);
        setSelectedAnswer(null);
      }, 1000);
    } else {
      // Module completed
      try {
        const { data } = await phalanxService.submitAnswer(activeModule.id, selectedAnswer);
        setTimeout(() => {
          setShowResults(true);
        }, 1000);
      } catch (error) {
        console.error('Failed to submit:', error);
      }
    }
  };

  const closeModule = () => {
    setActiveModule(null);
    setShowResults(false);
    loadTrainingModules();
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Beginner': return 'text-green-500 bg-green-500/10 border-green-500/20';
      case 'Intermediate': return 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20';
      case 'Advanced': return 'text-red-500 bg-red-500/10 border-red-500/20';
      default: return 'text-gray-500 bg-gray-500/10 border-gray-500/20';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 mt-16">
      {!activeModule ? (
        <>
          {/* Training Progress Header */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <AnimatedCard delay={0}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm mb-1">Completion</p>
                  <p className="text-3xl font-bold text-blue-500">{userProgress.completed}%</p>
                </div>
                <Target className="text-blue-500" size={40} />
              </div>
            </AnimatedCard>

            <AnimatedCard delay={100}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm mb-1">Accuracy</p>
                  <p className="text-3xl font-bold text-green-500">{userProgress.accuracy}%</p>
                </div>
                <TrendingUp className="text-green-500" size={40} />
              </div>
            </AnimatedCard>

            <AnimatedCard delay={200}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm mb-1">Completed</p>
                  <p className="text-3xl font-bold">{modules.filter(m => m.completed).length}</p>
                </div>
                <CheckCircle className="text-green-500" size={40} />
              </div>
            </AnimatedCard>

            <AnimatedCard delay={300}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm mb-1">Total Score</p>
                  <p className="text-3xl font-bold text-yellow-500">{userProgress.totalScore}</p>
                </div>
                <Award className="text-yellow-500" size={40} />
              </div>
            </AnimatedCard>
          </div>

          {/* Progress Bar */}
          <AnimatedCard className="mb-8" delay={400}>
            <div className="flex items-center gap-4 mb-4">
              <BookOpen className="text-blue-500" size={32} />
              <div className="flex-1">
                <h3 className="text-xl font-bold">Training Progress</h3>
                <p className="text-gray-400">Last active: {getCurrentUTCTime()}</p>
              </div>
            </div>
            
            <div className="mb-2">
              <div className="flex justify-between text-sm mb-2">
                <span>Overall Progress</span>
                <span className="font-semibold">{userProgress.completed}%</span>
              </div>
              <div className="w-full h-3 bg-gray-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-500"
                  style={{ width: `${userProgress.completed}%` }}
                />
              </div>
            </div>
          </AnimatedCard>

          {/* Available Modules */}
          <AnimatedCard delay={500}>
            <h3 className="text-2xl font-bold mb-6">Training Modules</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {modules.map((module, index) => (
                <div 
                  key={module.id} 
                  className="bg-gray-800 p-6 rounded-lg hover:bg-gray-700 transition-all group cursor-pointer animate-fade-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-12 h-12 rounded-lg ${
                        module.completed ? 'bg-green-500/20' : 'bg-blue-500/20'
                      } flex items-center justify-center`}>
                        {module.completed ? (
                          <CheckCircle className="text-green-500" size={24} />
                        ) : (
                          <BookOpen className="text-blue-500" size={24} />
                        )}
                      </div>
                      <div>
                        <h4 className="font-bold text-lg group-hover:text-blue-500 transition-colors">
                          {module.title}
                        </h4>
                        <div className="flex items-center gap-2 mt-1">
                          <Clock size={14} className="text-gray-400" />
                          <span className="text-sm text-gray-400">{module.duration}</span>
                        </div>
                      </div>
                    </div>
                    <span className={`text-xs px-3 py-1 rounded-full border ${getDifficultyColor(module.difficulty)}`}>
                      {module.difficulty}
                    </span>
                  </div>
                  
                  <p className="text-gray-400 text-sm mb-4">{module.description}</p>
                  
                  <button
                    onClick={() => startModule(module)}
                    className={`w-full px-4 py-3 rounded-lg font-semibold transition-colors ${
                      module.completed
                        ? 'bg-gray-700 text-white hover:bg-gray-600'
                        : 'bg-blue-500 text-white hover:bg-blue-600'
                    }`}
                  >
                    {module.completed ? 'Retake Training' : 'Start Training'}
                  </button>
                </div>
              ))}
            </div>
          </AnimatedCard>

          {/* Recent Activity */}
          <AnimatedCard className="mt-8" delay={600}>
            <h3 className="text-xl font-bold mb-6">Recent Activity</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 bg-gray-800 rounded-lg">
                <CheckCircle className="text-green-500 flex-shrink-0" size={24} />
                <div>
                  <p className="font-semibold">Successfully completed "Password Security" module</p>
                  <p className="text-sm text-gray-400">{getCurrentUTCTime()}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <div className="text-xs px-2 py-1 bg-green-500/20 text-green-500 rounded">Score: 95%</div>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4 p-4 bg-gray-800 rounded-lg">
                <Award className="text-yellow-500 flex-shrink-0" size={24} />
                <div>
                  <p className="font-semibold">Achieved "Security Expert" badge</p>
                  <p className="text-sm text-gray-400">{getCurrentUTCTime()}</p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-4 bg-gray-800 rounded-lg">
                <XCircle className="text-red-500 flex-shrink-0" size={24} />
                <div>
                  <p className="font-semibold">Failed attempt on phishing identification</p>
                  <p className="text-sm text-gray-400">{getCurrentUTCTime()}</p>
                  <p className="text-xs text-gray-500 mt-1">Recommended: Review phishing detection basics</p>
                </div>
              </div>
            </div>
          </AnimatedCard>
        </>
      ) : (
        /* Active Training Module */
        <div className="max-w-4xl mx-auto">
          {!showResults ? (
            <AnimatedCard>
              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold">{activeModule.title}</h2>
                  <span className={`text-sm px-3 py-1 rounded-full border ${getDifficultyColor(activeModule.difficulty)}`}>
                    {activeModule.difficulty}
                  </span>
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-400">
                  <span>Question {currentQuestion + 1} of {activeModule.scenarios.length}</span>
                  <span>•</span>
                  <span>Score: {score}/{activeModule.scenarios.length}</span>
                </div>
                <div className="w-full h-2 bg-gray-800 rounded-full mt-4 overflow-hidden">
                  <div
                    className="h-full bg-blue-500 rounded-full transition-all duration-300"
                    style={{ width: `${((currentQuestion + 1) / activeModule.scenarios.length) * 100}%` }}
                  />
                </div>
              </div>

              {activeModule.scenarios[currentQuestion] && (
                <>
                  <div className="bg-gray-800 p-6 rounded-lg mb-6">
                    <h3 className="text-lg font-semibold mb-4">
                      {activeModule.scenarios[currentQuestion].question}
                    </h3>
                    <div className="space-y-3">
                      {activeModule.scenarios[currentQuestion].options.map((option, index) => (
                        <button
                          key={index}
                          onClick={() => handleAnswer(index)}
                          disabled={selectedAnswer !== null}
                          className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                            selectedAnswer === index
                              ? index === activeModule.scenarios[currentQuestion].correct
                                ? 'border-green-500 bg-green-500/20'
                                : 'border-red-500 bg-red-500/20'
                              : selectedAnswer !== null && index === activeModule.scenarios[currentQuestion].correct
                              ? 'border-green-500 bg-green-500/20'
                              : 'border-gray-700 hover:border-gray-600 hover:bg-gray-700'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                              selectedAnswer === index
                                ? index === activeModule.scenarios[currentQuestion].correct
                                  ? 'border-green-500 bg-green-500'
                                  : 'border-red-500 bg-red-500'
                                : selectedAnswer !== null && index === activeModule.scenarios[currentQuestion].correct
                                ? 'border-green-500 bg-green-500'
                                : 'border-gray-600'
                            }`}>
                              {selectedAnswer !== null && index === activeModule.scenarios[currentQuestion].correct && (
                                <CheckCircle size={16} className="text-white" />
                              )}
                              {selectedAnswer === index && index !== activeModule.scenarios[currentQuestion].correct && (
                                <XCircle size={16} className="text-white" />
                              )}
                            </div>
                            <span>{option}</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <button
                      onClick={closeModule}
                      className="px-6 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
                    >
                      Exit Training
                    </button>
                    <button
                      onClick={submitAnswer}
                      disabled={selectedAnswer === null}
                      className="flex-1 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
                    >
                      {currentQuestion < activeModule.scenarios.length - 1 ? 'Next Question' : 'Complete Training'}
                    </button>
                  </div>
                </>
              )}
            </AnimatedCard>
          ) : (
            /* Results Screen */
            <AnimatedCard>
              <div className="text-center py-8">
                <div className={`w-24 h-24 rounded-full mx-auto mb-6 flex items-center justify-center ${
                  (score / activeModule.scenarios.length) >= 0.7 
                    ? 'bg-green-500/20' 
                    : 'bg-red-500/20'
                }`}>
                  {(score / activeModule.scenarios.length) >= 0.7 ? (
                    <CheckCircle className="text-green-500" size={48} />
                  ) : (
                    <XCircle className="text-red-500" size={48} />
                  )}
                </div>
                
                <h2 className="text-3xl font-bold mb-4">
                  {(score / activeModule.scenarios.length) >= 0.7 ? 'Congratulations!' : 'Keep Learning!'}
                </h2>
                
                <p className="text-xl text-gray-400 mb-8">
                  You scored {score} out of {activeModule.scenarios.length} 
                  ({Math.round((score / activeModule.scenarios.length) * 100)}%)
                </p>

                <div className="grid grid-cols-3 gap-4 mb-8">
                  <div className="bg-gray-800 p-4 rounded-lg">
                    <p className="text-3xl font-bold text-blue-500">{activeModule.scenarios.length}</p>
                    <p className="text-sm text-gray-400">Questions</p>
                  </div>
                  <div className="bg-gray-800 p-4 rounded-lg">
                    <p className="text-3xl font-bold text-green-500">{score}</p>
                    <p className="text-sm text-gray-400">Correct</p>
                  </div>
                  <div className="bg-gray-800 p-4 rounded-lg">
                    <p className="text-3xl font-bold text-red-500">{activeModule.scenarios.length - score}</p>
                    <p className="text-sm text-gray-400">Incorrect</p>
                  </div>
                </div>

                <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-6 mb-8">
                  <p className="text-blue-500 font-semibold mb-2">
                    {(score / activeModule.scenarios.length) >= 0.7 
                      ? 'Excellent work! You demonstrated strong security awareness.'
                      : 'Review the material and try again to improve your score.'}
                  </p>
                  <p className="text-gray-400 text-sm">
                    Continue training to enhance your cybersecurity knowledge.
                  </p>
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={() => startModule(activeModule)}
                    className="flex-1 px-6 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    Retake Module
                  </button>
                  <button
                    onClick={closeModule}
                    className="flex-1 px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-semibold"
                  >
                    Continue Training
                  </button>
                </div>
              </div>
            </AnimatedCard>
          )}
        </div>
      )}
    </div>
  );
};

export default PhalanxTraining;