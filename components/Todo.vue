<script setup lang="ts">
import type { Todo } from "~/lib/types";
const props = defineProps<Todo>();
</script>

<template>
  <div>sa {{ props.content }}</div>
</template>
