<template>
  <div>
    <v-snackbar v-model="snackbar">
      <span>Player Added!</span>
      <v-btn color="blue" text @click="snackbar = false">Close</v-btn>
    </v-snackbar>
    <h3 class="font-weight-medium text-center pa-3 ma-3 display-1">Member List</h3>
    <template v-if="isMember || isAdmin">
      <p
        v-for="log in logs"
        :key="log.id"
        class="body-2 text-right"
      >Last Point given @ {{log.time.toDate() | formatDate}}</p>
      <p>
        <v-simple-table fixed-header dark dense height="65vh">
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
                <th class="text-left title">Vouch</th>
                <!-- <th class="text-left title">Added</th> -->
                <th class="text-left title">Comments</th>
                <template v-if="isAdmin">
                  <th class="text-left"></th>
                </template>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(member, index) in members" :key="index">
                <td
                  :class="{
    'gold-star': member.rank === 'Gold Star',
    'silver-star': member.rank === 'Silver Star',
    'bronze-star': member.rank === 'Bronze Star',
  }"
                >
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
                  <v-icon dense color="success" @click="addHost(index)">mdi-plus</v-icon>
                  {{member.host}}
                  <v-icon dense color="error" @click="removeHost(index)">mdi-minus</v-icon>
                </td>
                <td>
                  <v-icon dense color="success" @click="addAnti(index)">mdi-plus</v-icon>
                  {{member.anti}}
                  <v-icon dense color="error" @click="removeAnti(index)">mdi-minus</v-icon>
                </td>
                <td
                  :class="{
                 'change-smiley': member.total >= 10 && member.rank === 'Smiley',
                 'change-1banana': member.total >= 50 && member.rank === '1 Banana',
                 'change-2banana': member.total >= 100 && member.rank === '2 Banana'
                }"
                >{{member.total}}</td>
                <td>{{member.vouch}}</td>
                <!-- <td>{{member.dateAdded}}</td> -->
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
      </p>
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
      members: [],
      logs: [],
      user: null
    };
  },
  filters: {
    formatDate: function(value) {
      if (value) {
        return moment(value).format("DD/MMM/YYYY HH:mm");
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

.gold-star {
  background-color: #fbc02d;
  /* background-color: #ffee58; */
}

.silver-star {
  /* background-color: #bdbdbd; */
  background-color: #616161;
}

.bronze-star {
  background-color: #f57c00;
  /* background-color: #cd7f32; */
}

.change-smiley,
.change-1banana,
.change-2banana {
  background-color: #00c853;
}
</style>