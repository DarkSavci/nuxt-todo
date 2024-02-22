import type { User } from "lucia";
import { useUser } from "~/composables/useUser";

export default defineNuxtRouteMiddleware(async () => {
    const user = useUser();
    const { data } = await useFetch("/api/auth/user");
    if (data.value) {
        user.value = data.value as User;
    }
});