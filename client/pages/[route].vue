<script setup lang="ts">
const router = useRouter();
const { path } = useRoute();

const redirectIfPagePathIsInvalid = () => {
  const isPathValid = (path: string) => false;
  if (!isPathValid(path)) {
    router.push({ path: "/404" });
  }
};
redirectIfPagePathIsInvalid();
</script>