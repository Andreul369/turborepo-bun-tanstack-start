import { ThemeProvider } from '@monorepo/ui/theme-provider';
import { TanStackQueryProvider } from './trpc-query-provider';

export const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <ThemeProvider>
      <TanStackQueryProvider>{children}</TanStackQueryProvider>
    </ThemeProvider>
  );
};
