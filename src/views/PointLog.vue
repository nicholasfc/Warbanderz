<template>
  <div class="point-log">
    <v-content>
      <v-row align="center" justify="center">
        <v-col cols="12" sm="8" md="4" lg="12">
          <h3 class="font-weight-regular text-center pa-1 ma-1 display-1">Point Log</h3>
          <v-card-text align="center">
            <p v-for="log in logs" :key="log.id" class="body-2">
              <span class="font-weight-bold">{{log.name}}</span>
              got
              <span class="font-weight-bold">{{log.pointField}}</span> point
              <span class="font-weight-bold">{{log.addRemove}}</span>
              @ {{log.time.toDate() | formatDate}} by {{log.byWho}}
            </p>
          </v-card-text>
        </v-col>
      </v-row>
    </v-content>
    <v-container>
      <v-row align="center" justify="center">
        <v-col cols="12" sm="8" md="4">
          <v-toolbar-title align="center">Search Points</v-toolbar-title>
          <v-card-text>
            <v-form>
              <v-text-field label="Player Name" v-model="name" required></v-text-field>
              <v-btn text small class="success mr-5" @click="searchPlayer()">Search Player</v-btn>
            </v-form>
          </v-card-text>
        </v-col>
      </v-row>
    </v-container>
    <v-container>
      <v-row align="center" justify="center">
        <v-col cols="12" sm="8" md="4" lg="12">
          <v-card-text align="center">
            <p v-for="log in searched" :key="log.id" class="body-2">
              <span class="font-weight-bold">{{log.name}}</span>
              got
              <span class="font-weight-bold">{{log.pointField}}</span> point
              <span class="font-weight-bold">{{log.addRemove}}</span>
              @ {{log.time.toDate() | formatDate}} by {{log.byWho}}
            </p>
          </v-card-text>
        </v-col>
      </v-row>
    </v-container>
    <v-content></v-content>
    <v-content v-if="!isAdmin && !isMember">
      <p
        class="font-weight-medium text-center pa-3 ma-3 display-1"
      >Please Contact a Gold Star to get access!</p>
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
      logs: [],
      isMember: false,
      isAdmin: false,
      searched: [],
      name: ""
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
            addRemove: doc.data().addRemove,
            byWho: doc.data().byWho
          };
          this.logs.push(data);
        });
      });
  },
  methods: {
    searchPlayer() {
      db.collection("pointLog")
        .where("name", "==", this.name)
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
              addRemove: doc.data().addRemove,
              byWho: doc.data().byWho
            };
            this.searched.push(data);
          });
        });
    }
  }
};
</script>

<style scoped>
h3 {
  text-decoration: underline;
  color: #eceff1;
}
</style>