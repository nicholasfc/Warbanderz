<template>
  <div class="edit-player">
    <v-content>
      <v-container>
        <v-toolbar-title align="center">Player Edit</v-toolbar-title>
        <v-card-text>
          <v-form>
            <v-row>
              <v-col cols="12" sm="6" md="2" lg="6">
                <v-text-field label="Player Name" v-model="name" required></v-text-field>
              </v-col>
              <v-col cols="12" sm="6" md="2" lg="6">
                <v-select label="Rank" v-model="rank" :items="ranks"></v-select>
              </v-col>
              <v-col cols="12" sm="6" md="2" lg="6">
                <v-text-field label="Alt Name" v-model="alt"></v-text-field>
              </v-col>
              <v-col cols="12" sm="6" md="2" lg="6">
                <v-text-field label="Name Added" v-model="nameAdded"></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" sm="6" md="2" lg="6">
                <v-text-field label="Scout Points" v-model.number="scout"></v-text-field>
              </v-col>
              <v-col cols="12" sm="6" md="2" lg="6">
                <v-text-field label="Anti Points" v-model.number="anti"></v-text-field>
              </v-col>
              <v-col cols="12" sm="6" md="2" lg="6">
                <v-text-field label="Host Points" v-model.number="host"></v-text-field>
              </v-col>
              <v-col cols="12" sm="6" md="2" lg="6">
                <v-text-field label="Total Points" v-model.number="total"></v-text-field>
              </v-col>
            </v-row>

            <v-row>
              <v-col cols="12" sm="6" md="2" lg="6">
                <v-text-field label="Vouch" v-model="vouch"></v-text-field>
              </v-col>
              <v-col cols="12" sm="6" md="2" lg="6">
                <v-text-field label="Clan" v-model="clan"></v-text-field>
              </v-col>
              <v-col cols="12" sm="6" md="2" lg="6">
                <v-text-field label="Comments" v-model="comments"></v-text-field>
              </v-col>
              <v-col cols="12" sm="6" md="2" lg="6">
                <v-text-field label="Reason" v-model="reason"></v-text-field>
              </v-col>
            </v-row>
            <v-row align="center" justify="center">
              <v-btn text small class="success mr-5" @click="updatePlayer()">Update Player</v-btn>
              <v-btn text small to="/removed" class="error">Cancel</v-btn>
            </v-row>
            <!-- <v-text-field label="Player Name" v-model="name" required></v-text-field>
                <v-select label="Rank" v-model="rank" :items="ranks"></v-select>
                <v-text-field label="Alt Name" v-model="alt"></v-text-field>
                <v-text-field label="Scout Points" v-model.number="scout"></v-text-field>
                <v-text-field label="Host Points" v-model.number="host"></v-text-field>
                <v-text-field label="Anti Points" v-model.number="anti"></v-text-field>
                <v-text-field label="Total Points" v-model.number="total"></v-text-field>
                <v-text-field label="Vouch" v-model="vouch"></v-text-field>
                <v-text-field label="Clan" v-model="clan"></v-text-field>
                <v-text-field label="Name Added" v-model="nameAdded"></v-text-field>
                <v-text-field label="Reason" v-model="reason"></v-text-field>
                <v-textarea label="Comments" v-model="comments"></v-textarea>
                <v-btn text small class="success mr-5" @click="updatePlayer()">Update Player</v-btn>
            <v-btn text small to="/removed" class="error">Cancel</v-btn>-->
          </v-form>
        </v-card-text>
      </v-container>
    </v-content>
  </div>
</template>

<script>
import { db, tstp } from "../data/firebaseInit";
import moment from "moment";
export default {
  data() {
    return {
      name: null,
      rank: null,
      alt: null,
      scout: null,
      anti: null,
      host: null,
      total: null,
      vouch: null,
      clan: null,
      comments: null,
      nameAdded: null,
      reason: null,
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
  beforeRouteEnter(to, from, next) {
    db.collection("removedlog")
      .where("name", "==", to.params.name)
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach(doc => {
          next(vm => {
            vm.name = doc.data().name;
            vm.rank = doc.data().rank;
            vm.alt = doc.data().alt;
            vm.scout = doc.data().scout;
            vm.anti = doc.data().anti;
            vm.host = doc.data().host;
            vm.total = doc.data().total;
            vm.vouch = doc.data().vouch;
            vm.clan = doc.data().clan;
            vm.nameAdded = doc.data().nameAdded;
            vm.comments = doc.data().comments;
            vm.reason = doc.data().reason;
          });
        });
      });
  },
  watch: {
    $route: "fetchData"
  },
  methods: {
    fetchData() {
      db.collection("removedlog")
        .where("name", "==", this.$route.params.name)
        .get()
        .then(querySnapshot => {
          querySnapshot.forEach(doc => {
            this.name = doc.data().name;
            this.rank = doc.data().rank;
            this.alt = doc.data().alt;
            this.scout = doc.data().scout;
            this.anti = doc.data().anti;
            this.host = doc.data().host;
            this.total = doc.data().total;
            this.vouch = doc.data().vouch;
            this.clan = doc.data().clan;
            this.nameAdded = doc.data().nameAdded;
            this.reason = doc.data().reason;
            this.comments = doc.data().comments;
          });
        });
    },
    updatePlayer() {
      db.collection("removedlog")
        .where("name", "==", this.$route.params.name)
        .get()
        .then(querySnapshot => {
          querySnapshot.forEach(doc => {
            doc.ref
              .update({
                name: this.name,
                rank: this.rank,
                alt: this.alt,
                scout: this.scout,
                anti: this.anti,
                host: this.host,
                total: this.total,
                vouch: this.vouch,
                clan: this.clan,
                nameAdded: this.nameAdded,
                comments: this.comments,
                reason: this.reason
              })
              .then(() => {
                this.$router.push("/removed");
              });
          });
        });
    }
  }
};
</script>

<style>
</style>