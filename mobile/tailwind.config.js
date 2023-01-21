/** @type {import('tailwindcss').Config} */
module.exports = {
  // definindo as extensões de arquivo e os diretórios onde será utilizado o tailwind
  content: [
    "./App.{js,jsx,ts,tsx}",
    // dentro da pasta src, dentro de qualquer pasta, arquivos que terminem com js, jsx, ts e tsx
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  // extendendo o tema que o tailwind oferece
  theme: {
    extend: {
      // adicionando uma cor com o token de background
      colors: {
        background: '#09090a',
      },
      fontFamily: {
        regular: 'Inter_400Regular',
        semibold: 'Inter_600SemiBold',
        bold: 'Inter_700Bold',
        extrabold: 'Inter_800ExtraBold'
      }
    },
  },
  plugins: [],
}
