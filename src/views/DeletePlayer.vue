<template>
  <div class="edit-player">
    <v-content>
      <v-container>
        <v-toolbar-title align="center">Player Edit</v-toolbar-title>
        <v-card-text>
          <v-form ref="form">
            <v-row>
              <v-col cols="12" sm="6" md="2" lg="6">
                <v-text-field disabled label="Player Name" v-model="name"></v-text-field>
              </v-col>
              <v-col cols="12" sm="6" md="2" lg="6">
                <v-text-field disabled label="Rank" v-model="rank"></v-text-field>
              </v-col>
              <v-col cols="12" sm="6" md="2" lg="6">
                <v-text-field disabled label="Alt Name" v-model="alt"></v-text-field>
              </v-col>
              <v-col cols="12" sm="6" md="2" lg="6">
                <v-text-field disabled label="Name Added" v-model="nameAdded"></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" sm="6" md="2" lg="6">
                <v-text-field disabled label="Scout Points" v-model.number="scout"></v-text-field>
              </v-col>
              <v-col cols="12" sm="6" md="2" lg="6">
                <v-text-field disabled label="Anti Points" v-model.number="anti"></v-text-field>
              </v-col>
              <v-col cols="12" sm="6" md="2" lg="6">
                <v-text-field disabled label="Host Points" v-model.number="host"></v-text-field>
              </v-col>
              <v-col cols="12" sm="6" md="2" lg="6">
                <v-text-field disabled label="Total Points" v-model.number="total"></v-text-field>
              </v-col>
            </v-row>

            <v-row>
              <v-col cols="12" sm="6" md="2" lg="6">
                <v-text-field disabled label="Vouch" v-model="vouch"></v-text-field>
              </v-col>
              <v-col cols="12" sm="6" md="2" lg="6">
                <v-text-field disabled label="Clan" v-model="clan"></v-text-field>
              </v-col>
              <v-col cols="12" sm="6" md="2" lg="6">
                <v-text-field disabled label="Comments" v-model="comments"></v-text-field>
              </v-col>
              <v-col cols="12" sm="6" md="12" lg="6">
                <v-text-field :rules="[rules.required]" label="Reason" v-model="reason"></v-text-field>
              </v-col>
            </v-row>
            <v-row align="center" justify="center">
              <v-btn text small class="error mr-5" @click="deletePlayer()">Delete Player</v-btn>
              <v-btn text small to="/member" class="primary">Return</v-btn>
            </v-row>
            <!-- <v-text-field disabled label="Player Name" v-model="name"></v-text-field>
                <v-text-field disabled label="Rank" v-model="rank"></v-text-field>
                <v-text-field disabled label="Alt Name" v-model="alt"></v-text-field>
                <v-text-field disabled label="Scout Points" v-model.number="scout"></v-text-field>
                <v-text-field disabled label="Anti Points" v-model.number="anti"></v-text-field>
                <v-text-field disabled label="Host Points" v-model.number="host"></v-text-field>
                <v-text-field disabled label="Total Points" v-model.number="total"></v-text-field>
                <v-text-field disabled label="Vouch" v-model="vouch"></v-text-field>
                <v-text-field disabled label="Name Added" v-model="nameAdded"></v-text-field>
                <v-text-field disabled label="Clan" v-model="clan"></v-text-field>
                <v-text-field disabled label="Comments" v-model="comments"></v-text-field>
                <v-text-field :rules="[rules.required]" label="Reason" v-model="reason"></v-text-field>
                <v-btn text small class="error mr-5" @click="deletePlayer()">Delete Player</v-btn>
            <v-btn text small to="/member" class="primary">Return</v-btn>-->
          </v-form>
        </v-card-text>
      </v-container>
    </v-content>
  </div>
</template>

<script>
import { db, tstp } from "../data/firebaseInit";
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
      comments: null,
      clan: null,
      dateAdded: null,
      nameAdded: null,
      vouch: null,
      reason: "",
      // ranks: [
      //   "Smiley",
      //   "1 Banana",
      //   "2 Banana",
      //   "3 Banana",
      //   "Bronze Star",
      //   "Silver Star",
      //   "Gold Star"
      // ],
      rules: {
        required: value => !!value || "Required."
      }
    };
  },
  beforeRouteEnter(to, from, next) {
    db.collection("members")
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
            vm.dateAdded = doc.data().dateAdded;
            vm.nameAdded = doc.data().nameAdded;
            vm.comments = doc.data().comments;
          });
        });
      });
  },
  watch: {
    $route: "fetchData"
  },
  methods: {
    fetchData() {
      db.collection("members")
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
            this.dateAdded = doc.data().dateAdded;
            this.nameAdded = doc.data().nameAdded;
            this.comments = doc.data().comments;
          });
        });
    },
    deletePlayer() {
      if (this.$refs.form.validate()) {
        db.collection("removedlog").add({
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
          dateAdded: this.dateAdded,
          reason: this.reason,
          comments: this.comments,
          time: tstp.fromDate(new Date())
        });
        db.collection("members")
          .where("name", "==", this.$route.params.name)
          .get()
          .then(querySnapshot => {
            querySnapshot.forEach(doc => {
              doc.ref.delete();
              this.$router.push("/removed");
            });
          });
      }
    }
  }
};
</script>

<style>
</style>