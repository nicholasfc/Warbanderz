<template>
  <div id="view-member">
    <ul class="collection with-header">
      <li class="collection header">
        <h4>{{name}}</h4>
      </li>
      <li class="collection-item">Rank: {{rank}}</li>
      <li class="collection-item">Alt Name: {{alt}}</li>
      <li class="collection-item">Scout Points: {{scout}}</li>
      <li class="collection-item">Anti Points: {{anti}}</li>
      <li class="collection-item">Host Points: {{host}}</li>
      <li class="collection-item">Total Points: {{total}}</li>
      <li class="collection-item">Comments: {{comments}}</li>
    </ul>
    <router-link to="/member" class="btn grey">Return</router-link>
    <router-link
      v-if="name && isAdmin"
      :to="{path: '/', name: 'edit', params: {name: name}}"
      class="btn grey"
    >Edit</router-link>
    <button v-if="isAdmin" @click="deletePlayer()" class="btn red">Delete</button>
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
            //console.log(doc.data());
            this.name = doc.data().name;
            this.rank = doc.data().rank;
            this.alt = doc.data().alt;
            this.scout = doc.data().scout;
            this.anti = doc.data().anti;
            this.host = doc.data().host;
            this.total = doc.data().total;
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