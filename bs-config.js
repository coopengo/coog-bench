module.exports = {
  port: 3000,
  files: ['public/**'],
  serveStatic: ['public'],
  proxy: {
    target: 'localhost:8000'
  }
};
