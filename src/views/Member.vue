<template>
  <div id="view-member">
    <v-container>
      <v-row align="center" justify="center">
        <h3 class="headline font-weight-light">{{name}}</h3>
      </v-row>
      <v-row align="center" justify="center">
        <v-col cols="12" sm="6" md="2" lg="6">
          <v-text-field label="Rank" outlined readonly v-model="rank"></v-text-field>
        </v-col>
        <v-col cols="12" sm="6" md="2" lg="6">
          <v-text-field label="Alt" outlined readonly v-model="alt"></v-text-field>
        </v-col>
        <v-col cols="12" sm="6" md="2" lg="6">
          <v-text-field label="Vouch" outlined readonly v-model="vouch"></v-text-field>
        </v-col>
        <v-col cols="12" sm="6" md="2" lg="6">
          <v-text-field label="Name Added" outlined readonly v-model="nameAdded"></v-text-field>
        </v-col>
      </v-row>
      <v-row align="center" justify="center">
        <v-col cols="12" sm="6" md="2" lg="6">
          <v-text-field label="Scout" outlined readonly v-model="scout"></v-text-field>
        </v-col>
        <v-col cols="12" sm="6" md="2" lg="6">
          <v-text-field label="Anti" outlined readonly v-model="anti"></v-text-field>
        </v-col>
        <v-col cols="12" sm="6" md="2" lg="6">
          <v-text-field label="Host" outlined readonly v-model="host"></v-text-field>
        </v-col>
        <v-col cols="12" sm="6" md="2" lg="6">
          <v-text-field label="Total" outlined readonly v-model="total"></v-text-field>
        </v-col>
      </v-row>

      <v-row align="center" justify="center">
        <v-col cols="12" sm="6" md="2" lg="6">
          <v-text-field label="Date Added" outlined readonly v-model="dateAdded"></v-text-field>
        </v-col>
        <v-col cols="12" sm="6" md="2" lg="6">
          <v-text-field label="Clan" outlined readonly v-model="clan"></v-text-field>
        </v-col>
        <v-col cols="12" sm="6" md="2" lg="6">
          <v-text-field label="Comments" outlined readonly v-model="comments"></v-text-field>
        </v-col>
      </v-row>
      <v-row align="center" justify="center">
        <v-btn text outlined to="/member">Return</v-btn>
      </v-row>
    </v-container>

    <!-- <router-link to="/member" class="btn grey">Return</router-link>
    <router-link
      v-if="name && isAdmin"
      :to="{path: '/', name: 'edit', params: {name: name}}"
      class="btn grey"
    >Edit</router-link>
    <button v-if="isAdmin" @click="deletePlayer()" class="btn red">Delete</button>-->
  </div>
</template>


<script>
import { db } from "../data/firebaseInit";
import firebase from "firebase/app";
export default {
  name: "member",
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
      dateAdded: null,
      nameAdded: null,
      comments: null,
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
            vm.dateAdded = doc.data().dateAdded.toDate();
            vm.nameAdded = doc.data().nameAdded;
            vm.clan = doc.data().clan;
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
      if (confirm("Are you sure?")) {
        db.collection("members")
          .where("name", "==", this.$route.params.name)
          .get()
          .then(querySnapshot => {
            querySnapshot.forEach(doc => {
              doc.ref.delete();
              this.$router.push("/member");
            });
          });
      }
    }
  }
};
</script>

<style>
</style>