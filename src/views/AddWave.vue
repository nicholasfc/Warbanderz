<template>
  <div class="add-wave">
    <h3>Add Wave</h3>
    <div class="row">
      <form @submit.prevent="addwave()" class="col s12">
        <div class="row">
          <div class="input-field col s12">
            <input type="text" v-model="host" />
            <label class="active">Host</label>
          </div>
        </div>

        <div class="form-group" v-for="(scout,k) in inputs" :key="k">
          <input type="text" class="form-control" v-model="scout.name" />
          <span>
            <i
              class="fas fa-minus-circle"
              @click="remove(k)"
              v-show="k || ( !k && inputs.length > 1)"
            ></i>
            <i class="fas fa-plus-circle" @click="add(k)" v-show="k == inputs.length-1"></i>
          </span>
        </div>

        <button type="submit" class="btn">Submit</button>
        <router-link to="/member" class="btn grey">Cancel</router-link>
      </form>
    </div>
  </div>
</template>

<script>
import { db, fv } from "../data/firebaseInit";
export default {
  data() {
    return {
      host: null,
      inputs: [
        {
          scout: ""
        }
      ]
    };
  },
  methods: {
    add(index) {
      this.inputs.push({ name: "" });
    },
    remove(index) {
      this.inputs.splice(index, 1);
    },
    addwave() {
      this.addhost();
      db.collection("members")
        .where("name", "==", this.scout)
        .get()
        .then(querySnapshot => {
          querySnapshot.forEach(doc => {
            doc.ref.update({
              scout: fv.increment(1),
              total: fv.increment(1)
            });
          });
        });
    },
    addhost() {
      db.collection("members")
        .where("name", "==", this.host)
        .get()
        .then(querySnapshot => {
          querySnapshot.forEach(doc => {
            doc.ref.update({
              host: fv.increment(1),
              total: fv.increment(1)
            });
          });
        });
    }
  }
};
</script>

<style>
</style>