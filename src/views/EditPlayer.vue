<template>
  <div class="edit-player">
    <h3>Edit Player</h3>

    <div class="row">
      <form @submit.prevent="updatePlayer()" class="col s12">
        <div class="row">
          <div class="input-field col s12">
            <input type="text" v-model="name" />
            <label class="active">Player Name</label>
          </div>
        </div>
        <div class="row">
          <div class="input-field col s12">
            <input type="text" v-model="rank" />
            <label class="active">Rank</label>
          </div>
        </div>
        <div class="row">
          <div class="input-field col s12">
            <input type="text" v-model="alt" />
            <label class="active">Alt Name</label>
          </div>
        </div>
        <div class="row">
          <div class="input-field col s12">
            <input type="number" v-model.number="scout" />
            <label class="active">Scout Points</label>
          </div>
        </div>
        <div class="row">
          <div class="input-field col s12">
            <input type="number" v-model.number="anti" />
            <label class="active">Anti Points</label>
          </div>
        </div>
        <div class="row">
          <div class="input-field col s12">
            <input type="number" v-model.number="host" />
            <label class="active">Host Points</label>
          </div>
        </div>
        <div class="row">
          <div class="input-field col s12">
            <input type="number" v-model.number="total" />
            <label class="active">Total Points</label>
          </div>
        </div>
        <div class="row">
          <div class="input-field col s12">
            <input type="text" v-model="comments" />
            <label class="active">Comments</label>
          </div>
        </div>
        <button type="submit" class="btn">Submit</button>
        <router-link to="/member" class="btn grey">Cancel</router-link>
      </form>
    </div>
  </div>
</template>

<script>
import { db } from "../data/firebaseInit";
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
      comments: ""
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
            doc.ref
              .update({
                name: this.name,
                rank: this.rank,
                alt: this.alt,
                scout: this.scout,
                anti: this.anti,
                host: this.host,
                total: this.total,
                comments: this.comments
              })
              .then(() => {
                this.$router.push({
                  name: "member",
                  params: { name: this.name }
                });
              });
          });
        });
    }
  }
};
</script>

<style>
</style>

<!--
<div class="input-field col s12">
          <select v-model="rank">
            <option value disabled selected>Choose your rank</option>
            <option value="Smiley">Smiley</option>
            <option value="1 banana">1 Banana</option>
            <option value="2 banana">2 Banana</option>
            <option value="3 banana">3 Banana</option>
            <option value="bronze star">Bronze Star</option>
            <option value="silver star">Silver Star</option>
            <option value="gold star">Gold Star</option>
          </select>
          <label class="active">Rank</label>
        </div>





        <div class="row">
          <div class="input-field col s12">
            <input type="text" v-model="rank" />
            <label class="active">Rank</label>
          </div>
        </div>
-->