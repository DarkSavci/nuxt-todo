<script setup lang="ts">
import type { FormError, FormSubmitEvent } from "#ui/types";

const state = useState("state", () => ({
  username: "",
  password: "",
}));

const validate = (state: any): FormError[] => {
  const errors: { path: string; message: string }[] = [];
  if (!state.username) errors.push({ path: "username", message: "Required" });
  if (!state.password) errors.push({ path: "password", message: "Required" });
  return errors;
};

async function onSubmit(event: FormSubmitEvent<any>) {
  const result = await useFetch("/api/auth/login", {
    method: "POST",
    body: {
      username: state.value.username,
      password: state.value.password,
    },
  });

  if (!result.error.value) {
    await navigateTo("/");
  }
}
</script>

<template>
  <section class="min-h-screen grid place-items-center">
    <UForm
      :validate="validate"
      :state="state"
      class="space-y-4 container max-w-lg"
      @submit="onSubmit"
    >
      <h1 class="text-xl font-semibold">Login</h1>

      <UFormGroup label="Username" name="username">
        <UInput v-model="state.username" />
      </UFormGroup>

      <UFormGroup label="Password" name="password">
        <UInput v-model="state.password" type="password" />
      </UFormGroup>

      <UButton type="submit"> Submit </UButton>
    </UForm>
  </section>
</template>
