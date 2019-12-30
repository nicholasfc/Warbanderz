<template>
  <div class="removed-log">
    <h3 class="font-weight-medium text-center pa-3 ma-3 display-1">Removed Players</h3>
    <template>
      <v-simple-table fixed-header dark dense height="80vh">
        <template v-slot:default>
          <thead>
            <tr>
              <th class="text-left title">Name</th>
              <th class="text-left title">Rank</th>
              <th class="text-left title">Alt</th>
              <th class="text-left title">Points - (A,H,S)</th>
              <th class="text-left title">Vouch</th>
              <th class="text-left title">Reason</th>
              <th class="text-left title">Date</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(member, index) in removeds" :key="index">
              <td>{{member.name}}</td>
              <td>{{member.rank}}</td>
              <td>{{member.alt}}</td>
              <td>{{member.total}} - ({{member.anti}}, {{member.host}}, {{member.scout}})</td>
              <td>{{member.vouch}}</td>
              <td>{{member.reason}}</td>
              <td>{{member.time.toDate() | formatDate}}</td>
              <td>
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
    db.collection("removedlog")
      .orderBy("name")
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach(doc => {
          const data = {
            id: doc.id,
            name: doc.data().name,
            rank: doc.data().rank,
            alt: doc.data().alt,
            total: doc.data().total,
            anti: doc.data().anti,
            scout: doc.data().scout,
            host: doc.data().host,
            reason: doc.data().reason,
            time: doc.data().time
          };
          this.removeds.push(data);
        });
      });
  },
  methods: {
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