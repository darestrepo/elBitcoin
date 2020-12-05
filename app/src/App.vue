<template>
  <div id="app">
      
      <h1 class="my-5">elBITCOIN dashboard</h1>
     
        <input type="text"
         placeholder="buscar texto específico"
         v-model="filter" />
      
      <table class="table table-dark" >
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
    <tr v-for="(dato, index) in filtrarColumnas" :key="index">
      <td v-html="highlightMatches(dato.nombre)"></td>
      <td v-html="highlightMatches(dato.ciudad)"></td>
      <td v-html="highlightMatches(dato.pais)"></td>
      <td v-html="highlightMatches(dato.dni)"></td>
      <td v-html="highlightMatches(dato.email)"></td>
      <td v-html="highlightMatches(dato.date)"></td>
     
    </tr>
    
  </tbody>
</table>


  </div>
</template>

<script>


export default {
  name: 'App',
  components: {  },
  data() {
    return {
      filter:'',
      datos: []
    }
  },

  mounted(){
    this.traerBD();
  },

  methods: {

    traerBD() {
     const url = 'https://bitcoin-alejo3.herokuapp.com/datos/';
     this.axios.get(url)
      .then(res => this.datos = res.data.personas)
      .catch(error => console.log(error))
    },
    highlightMatches(text) {
      const matchExists = text
        .toLowerCase()
        .includes(this.filter.toLowerCase());
      if (!matchExists) return text;

      const re = new RegExp(this.filter, "ig");
      return text.replace(re, matchedText => `<strong>${matchedText}</strong>`);
    }
  },

  computed: {
      filtrarColumnas() {
        return this.datos.filter(datos => {
          const nombre = datos.nombre.toString().toLowerCase();
          const ciudad = datos.ciudad.toString().toLowerCase();
          const pais = datos.pais.toString().toLowerCase();
          const dni = datos.dni.toString().toLowerCase();
          const email = datos.email.toString().toLowerCase();
          const date = datos.date.toString().toLowerCase();
          const searchTerm = this.filter.toLowerCase();
  
          return (
            nombre.includes(searchTerm) || ciudad.includes(searchTerm) || pais.includes(searchTerm) || dni.includes(searchTerm) || email.includes(searchTerm) || date.includes(searchTerm)
          );
        });
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

input[type=text], select {
  width: 100%;
  padding: 12px 20px;
  margin: 8px 0;
  display: inline-block;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
  margin-top: 25px;
}
</style>
