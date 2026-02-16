import { Navigate, Route, Routes } from 'react-router-dom';
import { Layout } from './ui/components/Layout';
import { HomePage } from './ui/pages/HomePage';
import { ProgressPage } from './ui/pages/ProgressPage';
import { TrainingPage } from './ui/pages/TrainingPage';

const App = (): JSX.Element => (
  <Routes>
    <Route path="/" element={<Layout />}>
      <Route index element={<HomePage />} />
      <Route path="training" element={<TrainingPage />} />
      <Route path="progress" element={<ProgressPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Route>
  </Routes>
);

export default App;
