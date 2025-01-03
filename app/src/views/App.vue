<template>
  <div class="h-screen w-full flex">
    <Navbar />
    <main class="w-full flex flex-col overflow-x-hidden lg:pb-0 pb-14">
      <NotificationBanner />
      <router-view class="flex-1" />
      <Footer class="lg:block hidden" />
    </main>
  </div>
</template>
