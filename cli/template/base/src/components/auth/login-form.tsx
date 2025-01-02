"use client";

import { useForm } from "@tanstack/react-form";

import { Alert, AlertDescription } from "~/components/ui/alert";
import { Button } from "~/components/ui/button";
import { Form } from "~/components/ui/form";
import { TextField } from "~/components/ui/textfield";
import { useAction } from "~/lib/actions/hooks";
import { signInWithPasswordAction } from "~/server/actions/auth";

export const LoginForm = () => {
  /* --------------------------------- actions -------------------------------- */
  const signIn = useAction(signInWithPasswordAction, {
    debug: true,
  });

  /* ---------------------------------- logic --------------------------------- */
  const form = useForm({
    defaultValues: {
      email: "til.poehnitzsch@gmail.com",
      password: "test",
    },
    onSubmit({ value: credentials }) {
      signIn.execute(credentials);
    },
  });

  /* --------------------------------- render --------------------------------- */
  return (
    <Form className="grid gap-4" handleSubmit={form.handleSubmit}>
      {signIn.result.serverError?.message && (
        <Alert type="error" className="mb-4">
          <AlertDescription>
            {signIn.result.serverError.message}
          </AlertDescription>
        </Alert>
      )}
      <form.Field
        name="email"
        children={({ state, handleChange }) => (
          <TextField
            isRequired
            type="email"
            name="email"
            label="E-Mail-Adresse"
            onChange={handleChange}
            value={state.value}
          />
        )}
      />
      <form.Field
        name="password"
        children={({ state, handleChange }) => (
          <TextField
            isRequired
            name="password"
            label="Passwort"
            type="password"
            onChange={handleChange}
            value={state.value}
          />
        )}
      />
      <Button isPending={signIn.isExecuting} className="w-full" type="submit">
        Login
      </Button>
    </Form>
  );
};
