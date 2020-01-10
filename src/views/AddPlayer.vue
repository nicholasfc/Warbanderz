<template>
  <div class="add_player">
    <v-content>
      <v-container class="fill-height" fluid>
        <v-row align="center" justify="center">
          <v-col cols="12" sm="8" md="4">
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
          </v-col>
        </v-row>
      </v-container>
    </v-content>
  </div>
</template>

<script>
import { db } from "../data/firebaseInit";
export default {
  name: "addplayer",
  data() {
    return {
      name: null,
      comments: "",
      alt: null,
      total: null,
      rank: null,
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
  methods: {
    onSubmit() {
      db.collection("members")
        .add({
          name: this.name,
          rank: this.rank,
          alt: this.alt,
          scout: 0,
          anti: 0,
          host: 0,
          total: this.total,
          vouch: this.vouch,
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