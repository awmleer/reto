module.exports = {
  external: [
    'react',
  ],
  input: 'lib/es/index.js',
  output: {
    name: 'reto',
    globals: {
      react: 'React'
    },
    file: 'lib/umd/reto.js',
    format: 'umd'
  }
}
