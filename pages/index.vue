<script setup lang="ts">
const route = useRoute();
const user = useUser();

const date: Date = new Date();
</script>

<template>
  <div>
    <Todo
      id="123"
      userId="123"
      content="Yoooo todo"
      status="completed"
      createdAt="2021-10-10T10:10:10Z"
    />
  </div>
</template>
