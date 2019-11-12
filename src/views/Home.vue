<template>
  <div class="home">
    <h3>Welcome to Site</h3>
    <template v-if="isAdmin">
      <h3>Add user to admin</h3>
      <div class="row">
        <form @submit.prevent="addAdmin()" class="col s12">
          <div class="row">
            <div class="input-field col s12">
              <input type="email" v-model="email" required />
              <label>Email</label>
            </div>
          </div>
          <button type="submit" class="btn">Submit</button>
          <router-link to="/members" class="btn grey">Cancel</router-link>
        </form>
      </div>
    </template>
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
