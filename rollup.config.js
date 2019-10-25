module.exports = {
  external: [
    'react',
  ],
  input: 'lib/index.js',
  output: {
    name: 'reto',
    globals: {
      react: 'React'
    },
    file: 'lib/umd/reto.js',
    format: 'umd'
  }
}
