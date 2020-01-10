<template>
  <v-dialog max-width="600px" v-model="dialog" v-if="isAdmin">
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
          <v-select label="Rank" v-model="rank" :items="ranks"></v-select>
          <v-text-field label="Alt Name" v-model="alt"></v-text-field>
          <v-text-field label="Total Points" v-model.number="total"></v-text-field>
          <v-text-field label="Vouch" v-model="vouch"></v-text-field>
          <v-text-field label="Comments" v-model="comments"></v-text-field>
          <v-btn text class="success" @click="onSubmit()">Add Player</v-btn>
        </v-form>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import { db, tstp } from "../data/firebaseInit";
import firebase from "firebase/app";
export default {
  data() {
    return {
      isAdmin: false,
      name: null,
      comments: "",
      rank: null,
      dialog: false,
      alt: null,
      total: null,
      vouch: null,
      ranks: [
        "Smiley",
        "Recruit",
        "Corporal",
        "Sergeant",
        "Bronze",
        "Silver",
        "Gold"
      ]
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
  submited: {
    name: "",
    comments: "",
    dialog: "",
    alt: "",
    total: "",
    vouch: "",
    rank: ""
  },
  methods: {
    onSubmit() {
      db.collection("members")
        .add({
          name: this.name,
          // rank: "Smiley",
          rank: this.rank,
          alt: this.alt,
          scout: 0,
          anti: 0,
          host: 0,
          total: this.total,
          vouch: this.vouch,
          // dateAdded: tstp.fromDate(new Date()),
          comments: this.comments
        })
        .then(() => {
          this.dialog = false;
          this.$emit("playerAdded");
        })
        .catch(err => console.log(err));

      this.name = "";
      this.alt = "";
      this.total = "";
      this.rank = "";
      this.vouch = "";
      this.comments = "";
    }
  }
};
</script>

<style>
</style>