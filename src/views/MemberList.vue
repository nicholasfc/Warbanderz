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
          <th>-</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(member, index) in members" :key="member.id">
          <td>
            <router-link :to="{ name: 'member', params: { name: member.name }}">{{member.name}}</router-link>
          </td>
          <td>{{member.rank}}</td>
          <td>{{member.alt}}</td>
          <td>
            {{member.scout}}
            <i class="fas fa-plus"></i>
          </td>
          <td>
            {{member.anti}}
            <i class="fas fa-plus"></i>
          </td>
          <td>
            {{member.host}}
            <i class="fas fa-plus" @click="addHost(index)"></i>
          </td>
          <td>{{member.total}}</td>
          <td>{{member.comments}}</td>
          <td>
            <router-link
              v-if="member.name"
              :to="{path: '/', name: 'edit', params: {name: member.name}}"
            >
              <i class="fas fa-edit"></i>
            </router-link>
            <i class="fas fa-trash"></i>
          </td>
        </tr>
      </tbody>
    </table>
    <!-- <div class="fixed-action-btn">
      <router-link to="/add" class="btn-floating btn-large red">
        <i class="fa fa-plus"></i>
      </i>
    </div>-->
  </div>
</template>

<script>
import { db, fv } from "../data/firebaseInit";
export default {
  name: "memberlist",
  data() {
    return {
      members: []
    };
  },
  methods: {
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
        });
    }
  },
  created() {
    db.collection("members")
      .orderBy("name")
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach(doc => {
          // console.log(doc.data());
          const data = {
            id: doc.id,
            name: doc.data().name,
            rank: doc.data().rank,
            alt: doc.data().alt,
            scout: doc.data().scout,
            anti: doc.data().anti,
            host: doc.data().host,
            total: doc.data().total,
            comments: doc.data().comments
          };
          this.members.push(data);
        });
      });
  }
};
</script>

<style>
</style>
