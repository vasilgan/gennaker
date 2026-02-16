import { Link, Outlet, useLocation } from 'react-router-dom';

export const Layout = (): JSX.Element => {
  const location = useLocation();

  return (
    <div className="app-shell">
      <header>
        <h1>COLREG Trainer</h1>
        <nav>
          <Link className={location.pathname === '/' ? 'active' : ''} to="/">Home</Link>
          <Link className={location.pathname === '/training' ? 'active' : ''} to="/training">Training</Link>
          <Link className={location.pathname === '/progress' ? 'active' : ''} to="/progress">Progress</Link>
        </nav>
      </header>
      <main>
        <Outlet />
      </main>
    </div>
  );
};
