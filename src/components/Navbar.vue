<template>
  <div class="navbar">
    <nav>
      <v-toolbar flat text dark dense color="blue-grey darken-3">
        <!-- LOGO-->
        <v-toolbar-title class="d-none d-sm-flex hidden-xs-and-down">
          <router-link to="/" class="text-uppercase link navBar">Warbanderz</router-link>
        </v-toolbar-title>
        <v-toolbar-title class="hidden-sm-and-up">
          <router-link to="/" class="text-uppercase link navBar">Wbz</router-link>
        </v-toolbar-title>
        <v-spacer></v-spacer>

        <!-- NORMAL MENU -->

        <v-toolbar-items class="d-sm-none d-md-flex hidden-sm-and-down">
          <v-btn text to="/member" v-if="isLoggedIn">Member List</v-btn>
          <v-btn text to="/add" v-if="isLoggedIn && isAdmin">Add Member</v-btn>
          <v-btn text to="/log" v-if="isLoggedIn">Point Log</v-btn>
          <v-btn text to="/removed" v-if="isLoggedIn && isAdmin">Removed Members</v-btn>
        </v-toolbar-items>

        <!-- DROPDOWN MENU FOR MOBILE -->
        <v-toolbar-items class="hidden-md-and-up">
          <v-menu offset-y v-if="isLoggedIn && isMember || isAdmin">
            <template v-slot:activator="{ on }">
              <v-btn text dark v-on="on" class>
                <v-icon left>mdi-menu-down</v-icon>Menu
              </v-btn>
            </template>
            <v-list dark color="blue-grey darken-3">
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
          </v-menu>
        </v-toolbar-items>

        <!-- LOGOUT BUTTON-->
        <v-divider vertical v-if="isLoggedIn"></v-divider>
        <v-toolbar-items>
          <v-btn text class="red darken-1" v-if="isLoggedIn" @click="logout()">
            <span>Sign Out</span>
            <v-icon right>mdi-logout</v-icon>
          </v-btn>
        </v-toolbar-items>
      </v-toolbar>
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
      isAdmin: false,
      isMember: false
    };
  },
  created() {
    firebase
      .auth()
      .currentUser.getIdTokenResult()
      .then(idTokenResult => {
        if (idTokenResult.claims.admin) {
          this.isAdmin = true;
        } else if (idTokenResult.claims.member) {
          this.isMember = true;
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

<style scoped>
.navBar {
  text-decoration: none;
}
</style>
