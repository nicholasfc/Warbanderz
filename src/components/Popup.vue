<template>
  <v-dialog max-width="600px" v-model="dialog">
    <template v-slot:activator="{ on }">
      <v-icon color="green" x-large bottom right v-on="on">mdi-plus-circle</v-icon>
    </template>

    <v-card>
      <v-toolbar flat>
        <v-toolbar-title>Add Player</v-toolbar-title>
      </v-toolbar>
      <v-card-text>
        <v-form>
          <v-text-field required label="Player Name" v-model="name"></v-text-field>
          <v-text-field label="Comments" v-model="comments"></v-text-field>
          <v-btn text class="success" @click="onSubmit()">Add Player</v-btn>
        </v-form>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import { db } from "../data/firebaseInit";
export default {
  data() {
    return {
      name: null,
      comments: "",
      dialog: false
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
        .then(() => {
          this.dialog = false;
          this.$emit("playerAdded");
        })
        .catch(err => console.log(err));
    }
  }
};
</script>

<style>
</style>