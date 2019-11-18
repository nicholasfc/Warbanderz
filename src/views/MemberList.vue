<template>
  <div>
    <h3 class="font-weight-medium text-center">Member List</h3>
    <v-simple-table fixed-header>
      <template v-slot:default>
        <thead>
          <tr>
            <th class="text-left">Name</th>
            <th class="text-left">Rank</th>
            <th class="text-left">Alt</th>
            <th class="text-left">Scout</th>
            <th class="text-left">Anti</th>
            <th class="text-left">Host</th>
            <th class="text-left">Total</th>
            <th class="text-left">Comments</th>
            <template v-if="isAdmin">
              <th class="text-left">-</th>
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
              <v-icon @click="removeScout(index)">mdi-minus</v-icon>
              {{member.scout}}
              <v-icon @click="addScout(index)">mdi-plus</v-icon>
            </td>
            <td>
              <v-icon @click="removeAnti(index)">mdi-minus</v-icon>
              {{member.anti}}
              <v-icon @click="addAnti(index)">mdi-plus</v-icon>
            </td>
            <td>
              <v-icon @click="removeHost(index)">mdi-minus</v-icon>
              {{member.host}}
              <v-icon @click="addHost(index)">mdi-plus</v-icon>
            </td>
            <td>{{member.total}}</td>
            <td>{{member.comments}}</td>
            <template v-if="isAdmin">
              <td>
                <router-link
                  v-if="member.name"
                  :to="{path: '/', name: 'edit', params: {name: member.name}}"
                >
                  <v-icon>mdi-pencil</v-icon>
                </router-link>
                <router-link :to="{ path:'/', name: 'delete', params: { name: member.name }}">
                  <v-icon>mdi-delete</v-icon>
                </router-link>
              </td>
            </template>
          </tr>
        </tbody>
      </template>
    </v-simple-table>
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
        pointField: "host",
        addRemove: "added"
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
        pointField: "scout",
        addRemove: "added"
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
        pointField: "anti",
        addRemove: "added"
      });
    },
    removeHost(index) {
      db.collection("members")
        .where("name", "==", this.members[index].name)
        .get()
        .then(querySnapshot => {
          querySnapshot.forEach(doc => {
            doc.ref.update({
              host: fv.increment(-1),
              total: fv.increment(-1)
            });
          });
        })
        .then(() => this.fetchDb());
      db.collection("pointLog").add({
        name: this.members[index].name,
        time: tstp.fromDate(new Date()),
        pointField: "host",
        addRemove: "removed"
      });
    },
    removeAnti(index) {
      db.collection("members")
        .where("name", "==", this.members[index].name)
        .get()
        .then(querySnapshot => {
          querySnapshot.forEach(doc => {
            doc.ref.update({
              anti: fv.increment(-1),
              total: fv.increment(-1)
            });
          });
        })
        .then(() => this.fetchDb());
      db.collection("pointLog").add({
        name: this.members[index].name,
        time: tstp.fromDate(new Date()),
        pointField: "host",
        addRemove: "removed"
      });
    },
    removeScout(index) {
      db.collection("members")
        .where("name", "==", this.members[index].name)
        .get()
        .then(querySnapshot => {
          querySnapshot.forEach(doc => {
            doc.ref.update({
              scout: fv.increment(-1),
              total: fv.increment(-1)
            });
          });
        })
        .then(() => this.fetchDb());
      db.collection("pointLog").add({
        name: this.members[index].name,
        time: tstp.fromDate(new Date()),
        pointField: "host",
        addRemove: "removed"
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