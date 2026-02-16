import { MODULE_ORDER } from '../../data/moduleOrder';
import { MODULES, QUESTIONS } from '../../data/questions';
import { countDueQuestions, getModuleAttempts, getModuleConfidence } from '../../domain/progress';
import { useAppState } from '../appState';

export const ProgressPage = (): JSX.Element => {
  const { userState } = useAppState();
  const due = countDueQuestions(userState, new Date());
  const hasBadge = userState.badges.includes('Coastal Ready');

  return (
    <section>
      <h2>Прогресс</h2>
      <p>XP: {userState.xp}</p>
      <p>На сегодня к повтору: {due}</p>
      {hasBadge && <div className="badge-banner">🏅 Badge unlocked: Coastal Ready</div>}
      <div className="grid">
        {MODULE_ORDER.map((moduleId) => {
          const module = MODULES.find((item) => item.id === moduleId);
          if (!module) {
            return null;
          }
          const confidence = getModuleConfidence(moduleId, QUESTIONS, userState);
          const attempts = getModuleAttempts(moduleId, QUESTIONS, userState);
          return (
            <article key={module.id} className="card">
              <h3>{module.title}</h3>
              <p>Confidence: {confidence === null ? 'Нет данных' : `${confidence}%`}</p>
              <p>Attempts: {attempts}</p>
              {attempts < 5 && <p>Недостаточно данных для бейджа.</p>}
            </article>
          );
        })}
      </div>
    </section>
  );
};
