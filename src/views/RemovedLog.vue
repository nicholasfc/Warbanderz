<template>
  <div class="removed-log">
    <h3 class="font-weight-regular text-center pa-1 ma-1 display-1">Removed Players</h3>
    <template>
      <v-simple-table fixed-header dark dense height="80vh">
        <template v-slot:default>
          <thead>
            <tr>
              <th class="text-left title">Name(Added)</th>
              <th class="text-left title">Rank</th>
              <th class="text-left title">Alt</th>
              <th class="text-left title">Points - (A,H,S)</th>
              <th class="text-left title">Vouch</th>
              <th class="text-left title">Clan</th>
              <th class="text-left title">Reason</th>
              <th class="text-left title">Comments</th>
              <th class="text-left title">Date Added</th>
              <th class="text-left title">Date Deleted</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(member, index) in removeds" :key="index">
              <td>{{member.name}}({{member.nameAdded}})</td>
              <td>{{member.rank}}</td>
              <td>{{member.alt}}</td>
              <td>{{member.total}} - ({{member.anti}}, {{member.host}}, {{member.scout}})</td>
              <td>{{member.vouch}}</td>
              <td>{{member.clan}}</td>
              <td>{{member.reason}}</td>
              <td>{{member.comments}}</td>
              <td v-if="member.dateAdded">{{member.dateAdded.toDate() | formatDate}}</td>
              <td v-else>-</td>
              <td>{{member.time.toDate() | formatDate}}</td>
              <td>
                <router-link
                  v-if="member.name"
                  :to="{path: '/', name: 'editremoved', params: {name: member.name}}"
                >
                  <v-icon color="light-blue darken-4" dense>mdi-pencil</v-icon>
                </router-link>
                <v-icon color="error" @click="deleteRow(index)">mdi-delete</v-icon>
              </td>
            </tr>
          </tbody>
        </template>
      </v-simple-table>
    </template>
  </div>
</template>

<script>
import moment from "moment";
import { db } from "../data/firebaseInit";
import firebase from "firebase/app";
export default {
  data() {
    return {
      removeds: []
    };
  },
  filters: {
    formatDate: function(value) {
      if (value) {
        return moment(value).format("DD/MMM/YYYY");
      }
    }
  },
  created() {
    this.fetchDb();
  },
  methods: {
    fetchDb() {
      db.collection("removedlog")
        .orderBy("name")
        .onSnapshot(snap => {
          const removeds = [];
          snap.forEach(doc => {
            let newPlayer = doc.data();
            newPlayer.id = doc.id;
            removeds.push(newPlayer);
          });
          this.removeds = removeds;
        });
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

<style scoped>
h3 {
  text-decoration: underline !important;
  color: #eceff1;
}
</style>