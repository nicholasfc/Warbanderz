<template>
  <div id="nav">
    <nav>
      <div class="nav-wrapper">
        <router-link to="/" class="brand-logo">Home</router-link>
        <ul id="nav-mobile" class="right">
          <li v-if="isLoggedIn">
            <router-link to="/member">Member List</router-link>
          </li>
          <li v-if="isLoggedIn">
            <router-link to="/add">Add Player</router-link>
          </li>
          <li v-if="isLoggedIn">
            <router-link to="/wave">Add Wave</router-link>
          </li>
          <li v-if="!isLoggedIn">
            <router-link to="/login">Login</router-link>
          </li>
          <li v-if="!isLoggedIn">
            <router-link to="/register">Register</router-link>
          </li>
          <li v-if="isLoggedIn">
            <button @click="logout()" class="btn black">Logout</button>
          </li>
        </ul>
      </div>
    </nav>
  </div>
</template>

<script>
import firebase from "firebase/app";
export default {
  name: "Navbar",
  data() {
    return {
      isLoggedIn: false,
      currentUser: false
    };
  },
  created() {
    if (firebase.auth().currentUser) {
      this.isLoggedIn = true;
      this.currentUser = firebase.auth().currentUser.email;
    }
  },
  methods: {
    logout() {
      firebase
        .auth()
        .signOut()
        .then(() => {
          this.$router.push("/login");
        });
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
