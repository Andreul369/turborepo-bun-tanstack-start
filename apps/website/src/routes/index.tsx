import { Card, CardContent, CardHeader, CardTitle } from '@monorepo/ui/card';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/')({ component: App });

function App() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Hello World</CardTitle>
      </CardHeader>
      <CardContent>
        <p>Welcome to the website</p>
      </CardContent>
    </Card>
  );
}
