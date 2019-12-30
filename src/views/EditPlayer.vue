<template>
  <div class="edit-player">
    <v-content>
      <v-container>
        <v-row align="center" justify="center">
          <v-col cols="12" sm="8" md="4">
            <v-toolbar-title align="center">Player Edit</v-toolbar-title>
            <v-card-text>
              <v-form>
                <v-text-field label="Player Name" v-model="name" required></v-text-field>
                <v-select label="Rank" v-model="rank" :items="ranks"></v-select>
                <v-text-field label="Alt Name" v-model="alt"></v-text-field>
                <v-text-field label="Scout Points" v-model.number="scout"></v-text-field>
                <v-text-field label="Anti Points" v-model.number="anti"></v-text-field>
                <v-text-field label="Host Points" v-model.number="host"></v-text-field>
                <v-text-field label="Total Points" v-model.number="total"></v-text-field>
                <v-text-field label="Vouch" v-model="vouch"></v-text-field>
                <v-textarea label="Comments" v-model="comments"></v-textarea>
                <v-btn text small class="success mr-5" @click="updatePlayer()">Update Player</v-btn>
                <v-btn text small to="/member" class="error">Cancel</v-btn>
              </v-form>
            </v-card-text>
          </v-col>
        </v-row>
      </v-container>
    </v-content>
  </div>
</template>

<script>
import { db, tstp } from "../data/firebaseInit";
import Datepicker from "vuejs-datepicker";
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
      // dateAdded: null,
      comments: "",
      ranks: [
        "Smiley",
        "1 Banana",
        "2 Banana",
        "3 Banana",
        "Bronze Star",
        "Silver Star",
        "Gold Star"
      ]
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
            this.comments = doc.data().comments;
          });
        });
    },
    updatePlayer() {
      db.collection("members")
        .where("name", "==", this.$route.params.name)
        .get()
        .then(querySnapshot => {
          querySnapshot.forEach(doc => {
            // var total = this.scout + this.anti + this.host + this.total;
            // console.log("before if: " + total);
            // if (this.scout === 0 && this.anti === 0 && this.host === 0) {
            //   total = this.total;
            //   console.log("first if: " + total);
            // }
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
                // dateAdded: this.dateAdded,
                comments: this.comments
              })
              .then(() => {
                this.$router.push("/member");
              });
          });
          // console.log(this.dateAdded);
        });
    }
  }
};
</script>

<style>
</style>