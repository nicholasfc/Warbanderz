<template>
  <div>
    <v-toolbar dark dense flat>
      <v-toolbar-title>
        <router-link to="/">Warbanderz</router-link>
      </v-toolbar-title>
      <v-spacer></v-spacer>

      <v-toolbar-items>
        <v-btn text v-if="isLoggedIn">
          <router-link to="/member">Member list</router-link>
        </v-btn>
        <v-btn text v-if="isLoggedIn && isAdmin">
          <router-link to="/add">Add Player</router-link>
        </v-btn>
        <v-btn text v-if="isLoggedIn && isAdmin">
          <router-link to="/log">Points Log</router-link>
        </v-btn>
        <v-btn text v-if="isLoggedIn && isAdmin">
          <router-link to="/removed">Removed Log</router-link>
        </v-btn>
        <v-btn text v-if="!isLoggedIn">
          <router-link to="/login">Login</router-link>
        </v-btn>
        <v-btn text v-if="!isLoggedIn">
          <router-link to="/register">Register</router-link>
        </v-btn>
        <v-btn color="red" tile depressed v-if="isLoggedIn" @click="logout()">Logout</v-btn>
      </v-toolbar-items>
    </v-toolbar>
  </div>
</template>

<script>
import firebase from "firebase/app";
export default {
  name: "Navbar",
  data() {
    return {
      isLoggedIn: false,
      isAdmin: false
    };
  },
  created() {
    firebase
      .auth()
      .currentUser.getIdTokenResult()
      .then(idTokenResult => {
        if (idTokenResult.claims.admin) {
          this.isAdmin = true;
        }
      });
    if (firebase.auth().currentUser) {
      this.isLoggedIn = true;
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
