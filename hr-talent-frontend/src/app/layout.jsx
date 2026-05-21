import './globals.css';
import Navbar from '../components/Navbar';

export const metadata = {
  title: 'HR Talent — Sistema de Evaluación RRHH',
  description: 'Gestión de candidatos, vacantes y evaluaciones',
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>
        <Navbar />
        <main>{children}</main>
      </body>
    </html>
  );
}
