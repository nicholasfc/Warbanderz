<template>
  <div>
    <h3>Member List</h3>
    <table class="striped centered">
      <thead>
        <tr>
          <th>Name</th>
          <th>Rank</th>
          <th>Alt</th>
          <th>Scout</th>
          <th>Anti</th>
          <th>Host</th>
          <th>Total</th>
          <th>Comments</th>
          <template v-if="isAdmin">
            <th>-</th>
          </template>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(member, index) in members" :key="index">
          <td>
            <router-link :to="{ name: 'member', params: { name: member.name }}">{{member.name}}</router-link>
          </td>
          <td>{{member.rank}}</td>
          <td>{{member.alt}}</td>
          <td>
            {{member.scout}}
            <i class="fas fa-plus" @click="addScout(index)"></i>
          </td>
          <td>
            {{member.anti}}
            <i class="fas fa-plus" @click="addAnti(index)"></i>
          </td>
          <td>
            {{member.host}}
            <i class="fas fa-plus" @click="addHost(index)"></i>
          </td>
          <td>{{member.total}}</td>
          <td>{{member.comments}}</td>
          <template v-if="isAdmin">
            <td>
              <router-link
                v-if="member.name"
                :to="{path: '/', name: 'edit', params: {name: member.name}}"
              >
                <i class="fas fa-edit"></i>
              </router-link>
              <i class="fas fa-trash" @click="deletePlayer(index)"></i>
            </td>
          </template>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import { db, fv, tstp } from "../data/firebaseInit";
import firebase from "firebase/app";
export default {
  data() {
    return {
      isAdmin: false,
      members: []
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
    this.fetchDb();
  },
  methods: {
    fetchDb() {
      const members = [];
      db.collection("members")
        .orderBy("name")
        .onSnapshot(snap => {
          snap.forEach(doc => {
            let newPlayer = doc.data();
            newPlayer.id = doc.id;
            members.push(newPlayer);
          });
          this.members = members;
        });
    },
    addHost(index) {
      db.collection("members")
        .where("name", "==", this.members[index].name)
        .get()
        .then(querySnapshot => {
          querySnapshot.forEach(doc => {
            doc.ref.update({
              host: fv.increment(1),
              total: fv.increment(1)
            });
          });
        })
        .then(() => this.fetchDb());
      db.collection("pointLog").add({
        name: this.members[index].name,
        time: tstp.fromDate(new Date()),
        pointField: "host"
      });
    },
    addScout(index) {
      db.collection("members")
        .where("name", "==", this.members[index].name)
        .get()
        .then(querySnapshot => {
          querySnapshot.forEach(doc => {
            doc.ref.update({
              scout: fv.increment(1),
              total: fv.increment(1)
            });
          });
        })
        .then(() => this.fetchDb());
      db.collection("pointLog").add({
        name: this.members[index].name,
        time: tstp.fromDate(new Date()),
        pointField: "scout"
      });
    },
    addAnti(index) {
      db.collection("members")
        .where("name", "==", this.members[index].name)
        .get()
        .then(querySnapshot => {
          querySnapshot.forEach(doc => {
            doc.ref.update({
              anti: fv.increment(1),
              total: fv.increment(1)
            });
          });
        })
        .then(() => this.fetchDb());
      db.collection("pointLog").add({
        name: this.members[index].name,
        time: tstp.fromDate(new Date()),
        pointField: "anti"
      });
    },
    deletePlayer(index) {
      if (confirm("Are you sure?")) {
        db.collection("members")
          .where("name", "==", this.members[index].name)
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