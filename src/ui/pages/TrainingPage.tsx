import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { QUESTIONS } from '../../data/questions';
import { Question } from '../../data/types';
import { selectSessionQuestions } from '../../domain/session';
import { useAppState } from '../appState';

const buildSessionIds = (anchor: Date, questions: Question[], userState: ReturnType<typeof useAppState>['userState']): string[] =>
  selectSessionQuestions(questions, userState, anchor, 5).map((q) => q.id);

export const TrainingPage = (): JSX.Element => {
  const navigate = useNavigate();
  const { userState, answerQuestion } = useAppState();
  const [sessionIds, setSessionIds] = useState<string[]>(() => buildSessionIds(new Date(), QUESTIONS, userState));
  const [index, setIndex] = useState(0);
  const [showReview, setShowReview] = useState(false);
  const [selectedChoice, setSelectedChoice] = useState<string | null>(null);

  const sessionQuestions = useMemo(
    () => sessionIds
      .map((id) => QUESTIONS.find((q) => q.id === id))
      .filter((q): q is Question => Boolean(q)),
    [sessionIds]
  );

  const current = sessionQuestions[index];

  if (!current) {
    return <p>Недостаточно вопросов в банке.</p>;
  }

  const isLast = index === sessionQuestions.length - 1;

  const submit = () => {
    if (!selectedChoice) return;
    const isCorrect = selectedChoice === current.correctChoiceId;
    answerQuestion(current.id, isCorrect);
    setShowReview(true);
  };

  const next = () => {
    setShowReview(false);
    setSelectedChoice(null);
    if (!isLast) {
      setIndex((x) => x + 1);
    }
  };

  const startNewTraining = () => {
    const nextAnchor = new Date();
    setSessionIds(buildSessionIds(nextAnchor, QUESTIONS, userState));
    setIndex(0);
    setShowReview(false);
    setSelectedChoice(null);
  };

  return (
    <section>
      <h2>Тренировка 5 минут</h2>
      <p>Вопрос {index + 1} / {sessionQuestions.length}</p>
      <article className="card">
        <h3>{current.prompt}</h3>
        {current.media && <img alt="question media" src={`data:image/svg+xml;utf8,${encodeURIComponent(current.media.src)}`} />}
        <div className="choices">
          {current.choices.map((choice) => (
            <label key={choice.id}>
              <input
                type="radio"
                name={`q-${current.id}`}
                checked={selectedChoice === choice.id}
                onChange={() => setSelectedChoice(choice.id)}
                disabled={showReview}
              />
              {choice.text}
            </label>
          ))}
        </div>
        {!showReview ? (
          <button onClick={submit} disabled={!selectedChoice}>Ответить</button>
        ) : (
          <div className="review">
            <p className={selectedChoice === current.correctChoiceId ? 'good' : 'bad'}>
              {selectedChoice === current.correctChoiceId ? 'Верно' : 'Неверно'}
            </p>
            <p><strong>Правило:</strong> {current.explanation.ruleRefs.join(', ')}</p>
            <p>{current.explanation.why}</p>
            {current.explanation.commonMistake && <p><strong>Частая ошибка:</strong> {current.explanation.commonMistake}</p>}
            {current.explanation.realWorldAction && <p><strong>Практика:</strong> {current.explanation.realWorldAction}</p>}
            {!isLast ? (
              <button onClick={next}>Следующий</button>
            ) : (
              <div>
                <p>Сессия завершена.</p>
                <div className="actions">
                  <button onClick={startNewTraining}>Новая тренировка (5 мин)</button>
                  <button className="secondary" onClick={() => navigate('/progress')}>Перейти в прогресс</button>
                </div>
              </div>
            )}
          </div>
        )}
      </article>
    </section>
  );
};
