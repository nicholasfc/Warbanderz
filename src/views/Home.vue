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
    <v-snackbar v-model="snackbar3">
      <span>RSN updated!</span>
      <v-btn color="blue" text @click="snackbar3 = false">Close</v-btn>
    </v-snackbar>
    <h3 class="font-weight-medium text-center pa-3 ma-3 display-1">Welcome to Warbanderz</h3>
    <v-divider></v-divider>
    <v-container class="fill-height" fluid>
      <v-row align="center" justify="center">
        <v-col cols="12" sm="8" md="4">
          <!-- QUICK LINKS FOR MEMBERS-->
          <v-content v-if="isMember && !isAdmin">
            <v-btn
              to="/member"
              color="blue-grey darken-3"
              class="mr-12 mt-12"
              dark
              x-large
            >Member List</v-btn>
            <v-btn to="/log" color="blue-grey darken-3" class="mt-12" dark x-large>Point Log</v-btn>
          </v-content>

          <!-- ADMIN PANEL FOR ROLES-->
          <v-content v-if="isAdmin">
            <template>
              <v-expansion-panels accordion>
                <v-expansion-panel>
                  <v-expansion-panel-header>Add Admin</v-expansion-panel-header>
                  <v-expansion-panel-content>
                    <v-form>
                      <v-text-field required label="Enter email to give admin role" v-model="email"></v-text-field>
                      <v-btn text class="success" @click="addAdmin()">Add Admin</v-btn>
                    </v-form>
                  </v-expansion-panel-content>
                </v-expansion-panel>
                <v-expansion-panel>
                  <v-expansion-panel-header>Add Member</v-expansion-panel-header>
                  <v-expansion-panel-content>
                    <v-form>
                      <v-text-field
                        required
                        label="Enter email to give member role"
                        v-model="email"
                      ></v-text-field>
                      <v-btn text class="success" @click="addMember()">Add Member</v-btn>
                    </v-form>
                  </v-expansion-panel-content>
                </v-expansion-panel>
                <!-- <v-expansion-panel>
                  <v-expansion-panel-header>Members</v-expansion-panel-header>
                  <v-expansion-panel-content>
                    <p v-for="user in users" :key="user.id" class="body-2">
                      <span class="font-weight-bold">{{user.name}}</span> -
                      <span class="font-weight-bold">{{user.email}}</span> -
                      <span class="font-weight-bold">{{user.claims}}</span>
                    </p>
                  </v-expansion-panel-content>
                </v-expansion-panel>-->
                <v-expansion-panel>
                  <v-expansion-panel-header>Add RSN</v-expansion-panel-header>
                  <v-expansion-panel-content>
                    <v-form>
                      <v-text-field required label="Enter RSN to update info" v-model="rsn"></v-text-field>
                      <v-btn text class="success" @click="addRsn()">Add RSN</v-btn>
                    </v-form>
                  </v-expansion-panel-content>
                </v-expansion-panel>
              </v-expansion-panels>
            </template>
          </v-content>
        </v-col>
      </v-row>
    </v-container>

    <!-- WARNING IF NO MEMBER ROLE -->
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
      snackbar2: false,
      snackbar3: false,
      rsn: null
      // users: []
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
    // db.collection("users")
    //   .orderBy("name", "desc")
    //   .get()
    //   .then(querySnapshot => {
    //     querySnapshot.forEach(doc => {
    //       const data = {
    //         id: doc.id,
    //         name: doc.data().name,
    //         email: doc.data().email,
    //         claims: doc.data().claims
    //       };
    //       this.users.push(data);
    //     });
    //   });
  },
  methods: {
    addAdmin() {
      const addAdminRole = fc.httpsCallable("addAdminRole");
      addAdminRole({ email: this.email }).then(result => {
        console.log(result);
        this.snackbar = true;
      });
      db.collection("users")
        .where("email", "==", this.email)
        .get()
        .then(querySnapshot => {
          querySnapshot.forEach(doc => {
            doc.ref.update({
              claims: "Admin/Member"
            });
          });
        });
    },
    addMember() {
      const addMemberRole = fc.httpsCallable("addMemberRole");
      addMemberRole({ email: this.email }).then(result => {
        console.log(result);
        this.snackbar2 = true;
      });
      db.collection("users")
        .where("email", "==", this.email)
        .get()
        .then(querySnapshot => {
          querySnapshot.forEach(doc => {
            doc.ref.update({
              claims: "Member"
            });
          });
        });
    },
    addRsn() {
      var user = firebase.auth().currentUser;
      // this.snackbar2 = true;
      user
        .updateProfile({
          displayName: this.rsn
        })
        .then(() => {
          console.log(user.displayName);
          this.snackbar3 = true;
        })
        .catch(err => console.log(err));
    }
  }
};
</script>
