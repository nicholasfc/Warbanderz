<template>
  <div class="home">
    <v-snackbar v-model="snackbar">
      <span>{{this.email}} has admin role!</span>
      <v-btn color="blue" text @click="snackbar = false">Close</v-btn>
    </v-snackbar>
    <v-snackbar v-model="snackbar2">
      <span>{{this.email}} has member role!</span>
      <v-btn color="blue" text @click="snackbar2 = false">Close</v-btn>
    </v-snackbar>
    <h3 class="font-weight-medium text-center pa-3 ma-3 display-1">Welcome to Warbanderz</h3>
    <v-divider></v-divider>
    <v-container class="fill-height" fluid>
      <v-row align="center" justify="center">
        <v-col cols="12" sm="8" md="4">
          <v-content v-if="isAdmin">
            <v-tabs vertical>
              <v-tab>Admin</v-tab>
              <v-tab>Member</v-tab>
              <v-tab-item>
                <v-card-text>
                  <v-form>
                    <v-text-field required label="Enter email to give admin role" v-model="email"></v-text-field>
                    <v-btn text class="success" @click="addAdmin()">Add Admin</v-btn>
                  </v-form>
                </v-card-text>
              </v-tab-item>
              <v-tab-item>
                <v-card-text>
                  <v-form>
                    <v-text-field required label="Enter email to give member role" v-model="email"></v-text-field>
                    <v-btn text class="success" @click="addMember()">Add Member</v-btn>
                  </v-form>
                </v-card-text>
              </v-tab-item>
            </v-tabs>
          </v-content>
        </v-col>
      </v-row>
    </v-container>
    <v-content v-if="!isAdmin && !isMember">
      <p
        class="font-weight-medium text-center pa-3 ma-3 display-1"
      >Please Contact a Gold Star to get access!</p>
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
      isAdmin: false,
      isMember: false,
      snackbar: false,
      snackbar2: false
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
  },
  methods: {
    addAdmin() {
      const addAdminRole = fc.httpsCallable("addAdminRole");
      addAdminRole({ email: this.email }).then(result => {
        console.log(result);
        this.snackbar = true;
      });
    },
    addMember() {
      const addMemberRole = fc.httpsCallable("addMemberRole");
      addMemberRole({ email: this.email }).then(result => {
        console.log(result);
        this.snackbar2 = true;
      });
    }
  }
};
</script>
