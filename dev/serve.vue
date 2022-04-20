<script>
import Vue from 'vue';
import { VueFloatComponent } from '@/entry';

export default Vue.extend({
  name: 'ServeDev',
  components: {
    VueFloatComponent,
  }
});
</script>

<template>
  <div id="app">
    <VueFloatComponent/>
  </div>
</template>
