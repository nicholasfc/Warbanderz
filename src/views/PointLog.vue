<template>
  <div class="point-log">
    <v-content>
      <v-row align="center" justify="center">
        <v-col cols="12" sm="8" md="4">
          <h3 class="font-weight-medium text-center pa-3 ma-3 display-1">Point Log</h3>
          <v-card-text align="center">
            <p
              v-for="log in logs"
              :key="log.id"
              class="body-2"
            >{{log.name}} got {{log.pointField}} point {{log.addRemove}} @ {{log.time.toDate() | formatDate}}</p>
          </v-card-text>
        </v-col>
      </v-row>
    </v-content>
  </div>
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

<style scoped>
h3 {
  text-decoration: underline;
}
</style>