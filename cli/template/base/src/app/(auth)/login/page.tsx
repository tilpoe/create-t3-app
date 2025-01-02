import { LoginForm } from "~/components/auth/login-form";
import { Card } from "~/components/ui/card";

export default async function LoginPage() {
  return (
    <div className="flex h-screen w-full items-center justify-center px-4">
      <Card className="mx-auto w-full max-w-sm">
        <Card.Heading>
          <Card.Header>
            <Card.Title className="text-2xl">Login</Card.Title>
          </Card.Header>
        </Card.Heading>
        <Card.Content>
          <LoginForm />
        </Card.Content>
      </Card>
    </div>
  );
}
