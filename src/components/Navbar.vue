<template>
  <div class="navbar">
    <nav>
      <v-toolbar text dark>
        <v-app-bar-nav-icon @click.stop="drawer = !drawer" v-if="isLoggedIn"></v-app-bar-nav-icon>
        <v-toolbar-title>
          <router-link to="/" class="text-uppercase link">Warbanderz</router-link>
        </v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn text class="primary" @click="logout()">
          <span>Sign Out</span>
          <v-icon right>mdi-logout</v-icon>
        </v-btn>
      </v-toolbar>
      <v-navigation-drawer v-model="drawer" absolute temporary dark>
        <v-list dense>
          <v-list-item link href="/member" v-if="isLoggedIn">
            <v-list-item-content>
              <v-list-item-title>Member List</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item link href="/add" v-if="isLoggedIn && isAdmin">
            <v-list-item-content>
              <v-list-item-title>Add Member</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item link href="/log" v-if="isLoggedIn">
            <v-list-item-content>
              <v-list-item-title>Points Log</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item link href="/removed" v-if="isLoggedIn && isAdmin">
            <v-list-item-content>
              <v-list-item-title>Removed Members</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-navigation-drawer>
    </nav>

    <!-- <v-toolbar dark dense flat>
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
    </v-toolbar>-->
  </div>
</template>

<script>
import firebase from "firebase/app";
export default {
  name: "Navbar",
  data() {
    return {
      isLoggedIn: false,
      isAdmin: false,
      drawer: null
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
/* h3 {
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
} */
.link {
  text-decoration: none;
}
</style>
