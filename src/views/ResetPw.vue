<template>
  <div class="container">
    <h3>reset pw page</h3>
    <div class="row">
      <form @submit.prevent="sendEmail()" class="col s12">
        <div class="row">
          <div class="input-field col s12">
            <input type="text" v-model="email" required />
            <label>Email</label>
          </div>
        </div>
        <button type="submit" class="btn">Submit</button>
      </form>
    </div>
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