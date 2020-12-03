<template>
  <div id="app">
      
      <h1 class="my-5">elBITCOIN dashboard</h1>
      
      <table class="table table-dark" v-if="datos.length > 0">
  <thead>
    <tr>
      <th scope="col">Nombre</th>
      <th scope="col">Ciudad</th>
      <th scope="col">País</th>
      <th scope="col">DNI</th>
      <th scope="col">Email</th>
      <th scope="col">Fecha de registro</th>
      
    </tr>
  </thead>
  <tbody>
    <tr v-for="(dato, index) in datos" :key="index">
      <td>{{ dato.id }}</td>
      <td>{{ dato.title }}</td>
      <td>{{ dato.body }}</td>
     
    </tr>
    
  </tbody>
</table>


<div v-else>
  <p>No hay datos </p>
  </div>


  </div>
</template>

<script>


export default {
  name: 'App',
  components: {  },
  data() {
 return {
   mostrar: false,
   edad: 0,
   datos: []
}
},

mounted(){
  console.log("montado")
  this.getData();
},

methods: {
  getData() {
     const url = 'https://jsonplaceholder.typicode.com/posts';
     this.axios.get(url)
      .then(res => this.datos = res.data)
      .catch(error => console.log(error))
  }



}
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
