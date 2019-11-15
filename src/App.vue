<template>
  <v-app>
    <Navbar :key="$route.fullPath" />
    <router-view />
  </v-app>
</template>

<script>
import Navbar from "./components/Navbar";

export default {
  name: "App",

  components: {
    Navbar
  },

  data: () => ({
    //
  })
};
</script>
