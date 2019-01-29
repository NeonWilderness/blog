import Vue from 'vue';
import CockpitApi from '~/cockpit/cockpitClient';

export default function ({ app }, inject) {

  const cockpitInstance = new CockpitApi({
    host: process.env.apiUrl,
    token: process.env.apiKey,
    axios: app.$axios
  });

  inject('cockpit', cockpitInstance);

}