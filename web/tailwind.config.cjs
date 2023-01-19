/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [ // informar onde estão os arquivos na aplicação que terão algum tipo de css
    './src/**/*.tsx', // arquivos que terminarem com tsx dentro de qualquer pasta dentro da pasta src terão estilização
    './index.html'
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
