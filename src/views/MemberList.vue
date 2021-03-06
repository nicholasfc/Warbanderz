<template>
  <div>
    <v-snackbar v-model="snackbar">
      <span>Player Added!</span>
      <v-btn color="blue" text @click="snackbar = false">Close</v-btn>
    </v-snackbar>
    <h3 class="font-weight-regular text-center pa-1 ma-1 display-1">Member List</h3>
    <template v-if="isMember || isAdmin">
      <p
        v-for="log in logs"
        :key="log.id"
        class="body-2 text-right pr-4 removed-margin"
      >Last Point given @ {{log.time.toDate() | formatDate}}</p>
      <v-simple-table fixed-header dark dense height="70vh">
        <template v-slot:default>
          <thead>
            <tr>
              <th class="text-left title">Name</th>
              <th class="text-left title">Rank</th>
              <th class="text-left title">Alt</th>
              <th class="text-left title">Scout</th>
              <th class="text-left title">Host</th>
              <th class="text-left title">Anti</th>
              <th class="text-left title">Total</th>
              <th class="text-left title">Comments</th>
              <th class="text-left title">Date Added</th>
              <!-- Purge Column not being used -->
              <th class="text-left title" v-if="purge === true">Active</th>
             
              <template v-if="isAdmin">
                <th class="text-left title">Admin</th>
              </template>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(member, index) in members" :key="index">
              <td
                :class="{
                  'gold-star': member.rank === 'Gold',
                  'silver-star': member.rank === 'Silver',
                  'bronze-star': member.rank === 'Bronze',
                }"
              >
                <router-link
                  class="nameField"
                  :to="{ name: 'member', params: { name: member.name }}"
                >{{member.name}}</router-link>
              </td>
              <td>{{member.rank}}</td>
              <td>{{member.alt}}</td>
              <td>
                <v-icon dense color="success" @click="addScout(index)">mdi-plus</v-icon>
                {{member.scout}}
                <v-icon
                  dense
                  color="error"
                  @click="removeScout(index)"
                  v-if="member.scout !== 0"
                >mdi-minus</v-icon>
              </td>
              <td>
                <v-icon dense color="success" @click="addHost(index)">mdi-plus</v-icon>
                {{member.host}}
                <v-icon
                  dense
                  color="error"
                  @click="removeHost(index)"
                  v-if="member.host !== 0"
                >mdi-minus</v-icon>
              </td>
              <td>
                <v-icon dense color="success" @click="addAnti(index)">mdi-plus</v-icon>
                {{member.anti}}
                <v-icon
                  dense
                  color="error"
                  @click="removeAnti(index)"
                  v-if="member.anti !== 0"
                >mdi-minus</v-icon>
              </td>
              <td
                :class="{
                 'change-smiley': member.total >= 10 && member.rank === 'Smiley',
                 'change-1banana': member.total >= 50 && member.rank === 'Recruit',
                 'change-2banana': member.total >= 100 && member.rank === 'Corporal'
                }"
              >{{member.total}}</td>
              <td>{{member.comments}}</td>
              <td v-if="member.dateAdded">{{member.dateAdded.toDate() | formatDate2}}</td>
              <td v-else>-</td>
              <!-- Purge Column currently not being used-->
              <td v-if="purge === true">
                <v-icon dense color="success" @click="addActive(index)">mdi-check</v-icon>
                {{member.active}}
                <v-icon dense color="error" @click="removeActive(index)">mdi-close</v-icon>
              </td>
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
import moment from "moment";
export default {
  components: { Popup },
  data() {
    return {
      isAdmin: false,
      isMember: false,
      snackbar: false,
      menu2: false,
      members: [],
      logs: [],
      user: null,
      purge: null
    };
  },
  filters: {
    formatDate: function(value) {
      if (value) {
        return moment(value).format("DD/MMM/YYYY HH:mm");
      }
    },
    formatDate2: function(value) {
      if (value) {
        return moment(value).format("DD/MMM/YYYY");
      }
    }
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
      db.collection("variables_table")
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach(doc => {
          const data = {
            purge: doc.data().purge,
          };
          this.purge = data.purge;
        });
      });
    this.fetchDb();
    var user = firebase.auth().currentUser.displayName;
  },
  methods: {
    fetchDb() {
      db.collection("members")
        .orderBy("name")
        .onSnapshot(snap => {
          const members = [];
          snap.forEach(doc => {
            let newPlayer = doc.data();
            newPlayer.id = doc.id;
            members.push(newPlayer);
          });
          this.members = members;
          this.user = firebase.auth().currentUser.displayName;
        });
      db.collection("pointLog")
        .orderBy("time", "desc")
        .limit(1)
        .onSnapshot(snap => {
          const logs = [];
          snap.forEach(doc => {
            let newLog = doc.data();
            newLog.id = doc.id;
            logs.push(newLog);
          });
          this.logs = logs;
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
        addRemove: "added",
        byWho: this.user
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
        addRemove: "added",
        byWho: this.user
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
        addRemove: "added",
        byWho: this.user
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
        addRemove: "removed",
        byWho: this.user
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
        pointField: "anti",
        addRemove: "removed",
        byWho: this.user
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
        pointField: "scout",
        addRemove: "removed",
        byWho: this.user
      });
    },
    addActive(index) {
      db.collection("members")
        .where("name", "==", this.members[index].name)
        .get()
        .then(querySnapshot => {
          querySnapshot.forEach(doc => {
            doc.ref.update({
              active: "Yes"
            });
          });
        })
        .then(() => this.fetchDb());
    },
    removeActive(index) {
      db.collection("members")
        .where("name", "==", this.members[index].name)
        .get()
        .then(querySnapshot => {
          querySnapshot.forEach(doc => {
            doc.ref.update({
              active: ""
            });
          });
        })
        .then(() => this.fetchDb());
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
  color: #eceff1;
}

.nameField {
  color: inherit;
  text-decoration: inherit;
}

.removed-margin {
  margin-bottom: 4px;
}

.gold-star {
  background-color: #d4af37;
}

.silver-star {
  background-color: #969c9f;
}

.bronze-star {
  background-color: #d4660c;
}

.change-smiley,
.change-1banana,
.change-2banana {
  background-color: #00c853;
}
</style>