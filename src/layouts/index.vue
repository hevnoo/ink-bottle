<template>
  <div class="wrapper">
    <div style="height: 60px"></div>
    <nav class="nav">
      <Header></Header>
    </nav>
    <main>
      <router-view></router-view>
      <Footer></Footer>
    </main>
  </div>
</template>

<script setup lang="ts">
import Header from "./modules/header.vue";
import Footer from "./modules/footer.vue";
import SldeBar from "./modules/sidebar.vue";
</script>

<style scoped lang="scss">
.wrapper {
  // width: 100%;
  // height: 100vh;

  .nav {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 60px;
    z-index: 10;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #fff;
    // border-bottom: 1px solid rgba(0, 0, 0, 0.1);
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  }
}
</style>
