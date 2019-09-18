module.exports = {
  external: [
    'react',
    'reflect-metadata',
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
