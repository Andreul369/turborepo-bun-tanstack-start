import { getLocale, locales, setLocale } from '@monorepo/i18n/runtime';
import { t } from '@monorepo/i18n/utils';
import { Button } from '@monorepo/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@monorepo/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@monorepo/ui/dropdown-menu';
import { createFileRoute } from '@tanstack/react-router';
import { toast } from 'sonner';
import { ThemeToggle } from '@/components/theme-toggle';

export const Route = createFileRoute('/')({ component: App });

function App() {
  return (
    <div className="flex flex-col w-full items-center p-6 gap-4">
      <Card>
        <CardHeader>
          <CardTitle>
            {t('common.welcome')} to the website!
            <ThemeToggle />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p>Welcome to the website</p>
          <Button onClick={() => toast.success('The button was clicked')}>
            Click me to see Sonner
          </Button>
        </CardContent>
        <CardFooter>
          <DropdownMenu>
            <DropdownMenuTrigger render={<Button variant="outline" />}>
              Open Dropdown Menu
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuGroup>
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuItem>Profile</DropdownMenuItem>
                <DropdownMenuItem>Billing</DropdownMenuItem>
                <DropdownMenuSeparator />
              </DropdownMenuGroup>
              <DropdownMenuGroup>
                <DropdownMenuItem>Team</DropdownMenuItem>
                <DropdownMenuItem>Subscription</DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </CardFooter>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Hello World</CardTitle>
        </CardHeader>
        <CardContent>
          {locales.map((locale) => (
            <Button
              key={locale}
              onClick={() => setLocale(locale)}
              data-active-locale={locale === getLocale()}
              className="capitalize data-[active-locale=true]:bg-accent data-[active-locale=true]:text-white"
            >
              {locale}
            </Button>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
