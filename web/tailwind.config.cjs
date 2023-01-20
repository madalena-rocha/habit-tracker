/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [ // informar onde estão os arquivos na aplicação que terão algum tipo de css
    './src/**/*.tsx', // arquivos que terminarem com tsx dentro de qualquer pasta dentro da pasta src terão estilização
    './index.html'
  ],
  theme: {
    extend: {
      // adicionando cor ao leque de cores do tailwind
      colors: {
        background: '#09090A'
      },

      // configurando o grid para ter 7 linhas
      gridTemplateRows: {
        7: 'repeat(7, minmax(0, 1fr))'
      },
    },
  },
  plugins: [],
}
