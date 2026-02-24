import { ThemeProvider } from "@monorepo/ui/theme-provider";

export const Providers = ({ children }: { children: React.ReactNode }) => {
  return <ThemeProvider>{children}</ThemeProvider>;
};
