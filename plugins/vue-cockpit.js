import Axios from 'axios';
import Vue from 'vue';
import CockpitApi from '~/cockpit/cockpitClient'

const cockpitInstance = new CockpitApi({
  host: process.env.apiUrl || process.env.APIURL,
  token: process.env.apiKey || process.env.APIKEY,
  axios: Axios
});

Vue.use(cockpitInstance)

export default function (ctx, inject) {
  inject('cockpit', cockpitInstance)
}