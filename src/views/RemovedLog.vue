<template>
  <div class="container">
    <h3>Removed Log</h3>

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
            <input type="text" v-model="reason" />
            <label>Reason</label>
          </div>
        </div>
        <div class="row">
          <div class="input-field col s12">
            <input type="text" v-model="comments" />
            <label>Comments</label>
          </div>
        </div>
        <button type="submit" class="btn">Submit</button>
      </form>
    </div>
    <ul>
      <li v-for="(removed, index) in removeds" :key="index">
        {{removed.name}} - {{removed.reason}} - {{removed.comments}} -
        <i
          class="fas fa-trash"
          @click="deleteRow(index)"
        ></i>
      </li>
    </ul>
  </div>
</template>

<script>
import { db } from "../data/firebaseInit";
export default {
  data() {
    return {
      removeds: [],
      name: "",
      reason: "",
      comments: ""
    };
  },
  created() {
    this.fetchDb();
  },
  methods: {
    fetchDb() {
      const removeds = [];
      db.collection("removedlog").onSnapshot(snap => {
        snap.forEach(doc => {
          let newRemoved = doc.data();
          newRemoved.id = doc.id;
          removeds.push(newRemoved);
        });
        this.removeds = removeds;
      });
    },
    onSubmit() {
      db.collection("removedlog")
        .add({
          name: this.name,
          reason: this.reason,
          comments: this.comments
        })
        .then(() => this.fetchDb());
    },
    deleteRow(index) {
      if (confirm("Are you sure?")) {
        db.collection("removedlog")
          .where("name", "==", this.removeds[index].name)
          .get()
          .then(querySnapshot => {
            querySnapshot.forEach(doc => {
              doc.ref.delete();
            });
          })
          .then(() => this.fetchDb());
      }
    }
  }
};
</script>

<style>
</style>