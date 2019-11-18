<template>
  <div class="home">
    <h3 class="font-weight-medium text-center pa-3 ma-3 display-1">Welcome to Warbanderz</h3>
    <v-divider></v-divider>
    <v-content v-if="isAdmin">
      <v-container class="fill-height" fluid>
        <v-row align="center" justify="center">
          <v-col cols="12" sm="8" md="4">
            <v-card>
              <v-toolbar flat>
                <v-toolbar-title>Add Admin Role</v-toolbar-title>
              </v-toolbar>
              <v-card-text>
                <v-form>
                  <v-text-field required label="Player Name" v-model="email"></v-text-field>
                  <v-btn text class="success" @click="addAdmin()">Add Admin</v-btn>
                </v-form>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-content>
  </div>
</template>

<script>
import firebase from "firebase/app";
import { db, fc } from "../data/firebaseInit";
export default {
  name: "home",
  data() {
    return {
      email: null,
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
  },
  methods: {
    addAdmin() {
      const addAdminRole = fc.httpsCallable("addAdminRole");
      addAdminRole({ email: this.email }).then(result => {
        console.log(result);
      });
    }
  }
};
</script>
