<template>
  <div class="add-player">
    <h3>Add player</h3>

    <div class="row">
      <form @submit.prevent="onSubmit()" class="col s12">
        <div class="row">
          <div class="input-field col s12">
            <input type="text" v-model="name" required />
            <label>Player Name</label>
          </div>
        </div>
        <div class="row">
          <div class="input-field col s12">
            <input type="text" v-model="comments" />
            <label>Comments</label>
          </div>
        </div>
        <button type="submit" class="btn">Submit</button>
        <router-link to="/members" class="btn grey">Cancel</router-link>
      </form>
    </div>
  </div>
</template>

<script>
import { db } from "../data/firebaseInit";
export default {
  name: "addplayer",
  data() {
    return {
      name: null,
      comments: ""
    };
  },
  methods: {
    onSubmit() {
      db.collection("members")
        .add({
          name: this.name,
          rank: "Smiley",
          alt: "",
          scout: 0,
          anti: 0,
          host: 0,
          total: 0,
          comments: this.comments
        })
        .then(docRef => {
          this.$router.push("/member");
        })
        .catch(err => console.log(err));
    }
  }
};
</script>

<style>
</style>