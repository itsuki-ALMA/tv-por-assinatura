// src/app/layout.tsx
import MuiProvider from '../theme/MuiProvider';
import CustomAppBar from '../components/AppBar';

export const metadata = {
  title: 'Sistema TV por Assinatura - ACME',
  description: 'Projeto de TV com Next.js + MUI',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>
        <MuiProvider>
          <CustomAppBar />
          {children}
        </MuiProvider>
      </body>
    </html>
  );
}
