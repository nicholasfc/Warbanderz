<template>
  <div class="register">
    <v-content>
      <v-container class="fill-height" fluid>
        <v-row align="center" justify="center">
          <v-col cols="12" sm="8" md="4">
            <v-card>
              <v-toolbar flat>
                <v-toolbar-title>Register</v-toolbar-title>
              </v-toolbar>
              <v-card-text>
                <v-form>
                  <v-text-field v-model="name" label="RSN" required></v-text-field>
                  <v-text-field v-model="email" label="E-mail" required></v-text-field>

                  <v-text-field
                    id="password"
                    label="Password"
                    name="password"
                    type="password"
                    v-model="password"
                  />
                  <v-btn text class="success" @click="register()">Login</v-btn>
                </v-form>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
      <p align="center" justify="center">
        <router-link to="/resetpw">Forgot Password?</router-link>
      </p>
    </v-content>
  </div>
</template>

<script>
import firebase from "firebase/app";
import { db } from "../data/firebaseInit";
export default {
  name: "register",
  data() {
    return {
      email: "",
      password: "",
      name: ""
    };
  },
  methods: {
    register() {
      firebase
        .auth()
        .createUserWithEmailAndPassword(this.email, this.password)
        .then(
          user => {
            alert(`Account Created`);
            this.$router.push("/");
          },
          err => {
            alert(err.message);
          }
        );
      db.collection("users")
        .add({
          name: this.name,
          email: this.email,
          claims: null
        })
        .catch(err => console.log(err));
    }
  }
};
</script>
