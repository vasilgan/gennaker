import { Link } from 'react-router-dom';

export const HomePage = (): JSX.Element => (
  <section>
    <h2>Тренажёр расхождения судов</h2>
    <p>5 вопросов за сессию: ответ, разбор, интервальные повторы и прогресс.</p>
    <div className="actions">
      <Link className="button" to="/training">Тренировка 5 минут</Link>
      <Link className="button secondary" to="/progress">Открыть прогресс</Link>
    </div>
  </section>
);
