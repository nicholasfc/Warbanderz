<template>
  <div class="point-log">
    <v-content>
      <v-row align="center" justify="center">
        <v-col cols="12" sm="8" md="4">
          <v-toolbar-title align="center">Point Log</v-toolbar-title>
          <v-card-text align="center">
            <p
              v-for="log in logs"
              :key="log.id"
            >{{log.name}} got {{log.pointField}} point {{log.addRemove}} @ {{log.time.toDate() | formatDate}}</p>
          </v-card-text>
        </v-col>
      </v-row>
    </v-content>
  </div>

  <!-- <h3>Point Log</h3>
    <p
      v-for="log in logs"
      :key="log.id"
    >{{log.name}} got {{log.pointField}} point {{log.addRemove}} @ {{log.time.toDate() | formatDate}}</p>
  </div>-->
</template>

<script>
import moment from "moment";
import { db } from "../data/firebaseInit";
import firebase from "firebase/app";
export default {
  data() {
    return {
      logs: []
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
    db.collection("pointLog")
      .orderBy("time", "desc")
      .limit(25)
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach(doc => {
          const data = {
            id: doc.id,
            name: doc.data().name,
            pointField: doc.data().pointField,
            time: doc.data().time,
            addRemove: doc.data().addRemove
          };
          this.logs.push(data);
        });
      });
  }
};
</script>

<style>
</style>