<template>
    <title>Mediart - Studio</title>
    <NuxtLayout>
        <NuxtPage />
        <main class="w-screen h-dvh flex justify-center items-center">
        <div
            class="md:w-1/3 max-md:w-5/6 h-fit max-md:aspect-auto gap-3 flex flex-col relative items-center justify-center glassEffect p-8 py-16 aspect-square rounded-lg"
        >
            <h2 class="text-3xl">Studio</h2>
            <p class="text-center">This is the studio page.</p>
            <NuxtLink to="/">
            <img
                class="h-8 cursor-pointer"
                src="~/assets/mediart/mediartCompleto.webp"
                alt="Mediart Logo"
            />
            </NuxtLink>
        </div>
        </main>
    </NuxtLayout>
</template>