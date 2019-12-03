<template>
  <div>
    <v-snackbar v-model="snackbar">
      <span>Player Added!</span>
      <v-btn color="blue" text @click="snackbar = false">Close</v-btn>
    </v-snackbar>
    <h3 class="font-weight-medium text-center pa-3 ma-3 display-1">Member List</h3>
    <template v-if="isMember || isAdmin">
      <v-simple-table fixed-header height="70vh">
        <template v-slot:default>
          <thead>
            <tr>
              <th class="text-left title">Name</th>
              <th class="text-left title">Rank</th>
              <th class="text-left title">Alt</th>
              <th class="text-left title">Scout</th>
              <th class="text-left title">Anti</th>
              <th class="text-left title">Host</th>
              <th class="text-left title">Total</th>
              <th class="text-left title">Comments</th>
              <template v-if="isAdmin">
                <th class="text-left"></th>
              </template>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(member, index) in members" :key="index">
              <td>
                {{member.name}}
                <!-- <router-link :to="{ name: 'member', params: { name: member.name }}">{{member.name}}</router-link> -->
              </td>
              <td>{{member.rank}}</td>
              <td>{{member.alt}}</td>
              <td>
                <v-icon dense color="success" @click="addScout(index)">mdi-plus</v-icon>
                {{member.scout}}
                <v-icon dense color="error" @click="removeScout(index)">mdi-minus</v-icon>
              </td>
              <td>
                <v-icon dense color="success" @click="addAnti(index)">mdi-plus</v-icon>
                {{member.anti}}
                <v-icon dense color="error" @click="removeAnti(index)">mdi-minus</v-icon>
              </td>
              <td>
                <v-icon dense color="success" @click="addHost(index)">mdi-plus</v-icon>
                {{member.host}}
                <v-icon dense color="error" @click="removeHost(index)">mdi-minus</v-icon>
              </td>
              <td>{{member.total}}</td>
              <td>{{member.comments}}</td>
              <template v-if="isAdmin">
                <td>
                  <router-link
                    v-if="member.name"
                    :to="{path: '/', name: 'edit', params: {name: member.name}}"
                  >
                    <v-icon color="light-blue darken-4" dense>mdi-pencil</v-icon>
                  </router-link>
                  <router-link :to="{ path:'/', name: 'delete', params: { name: member.name }}">
                    <v-icon dense color="error">mdi-delete</v-icon>
                  </router-link>
                </td>
              </template>
            </tr>
          </tbody>
        </template>
      </v-simple-table>
      <Popup @playerAdded="snackbar = true" />
    </template>
    <v-content v-if="!isAdmin && !isMember">
      <p
        class="font-weight-medium text-center pa-3 ma-3 display-1"
      >Please Contact a Gold Star to get access!</p>
    </v-content>
  </div>
</template>

<script>
import { db, fv, tstp } from "../data/firebaseInit";
import firebase from "firebase/app";
import Popup from "../components/Popup";
export default {
  components: { Popup },
  data() {
    return {
      isAdmin: false,
      isMember: false,
      snackbar: false,
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
        } else if (idTokenResult.claims.member) {
          this.isMember = true;
        }
      });
    this.fetchDb();
  },
  methods: {
    fetchDb() {
      db.collection("members")
        .orderBy("name")
        .get()
        .then(querySnapshot => {
          const members = [];
          querySnapshot.forEach(doc => {
            members.push(doc.data());
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

<style scoped>
h3 {
  text-decoration: underline;
  color: #37474f;
}
</style>