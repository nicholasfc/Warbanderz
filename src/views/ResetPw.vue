<template>
  <div class="reset-pw">
    <v-content>
      <v-container class="fill-height" fluid>
        <v-row align="center" justify="center">
          <v-col cols="12" sm="8" md="4">
            <v-card>
              <v-toolbar flat>
                <v-toolbar-title>Reset Password</v-toolbar-title>
              </v-toolbar>
              <v-card-text>
                <v-form>
                  <v-text-field v-model="email" label="E-mail" required></v-text-field>
                  <v-btn text class="success" @click="sendEmail()">Send Email</v-btn>
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
export default {
  data() {
    return {
      email: ""
    };
  },
  methods: {
    sendEmail() {
      firebase
        .auth()
        .sendPasswordResetEmail(this.email)
        .then(() => {
          console.log(`Email sent to ${this.email}`);
        })
        .catch(err => console.log(err));
    }
  }
};
</script>

<style>
</style>