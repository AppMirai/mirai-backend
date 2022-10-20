const swaggerAutogen = require('swagger-autogen')()

const outputFile = './swagger_output.json'
const endpointsFiles = ['./src/routes/index.js']

const doc = {
    info: {
        version: '1.0.0',
        title: 'Mirai Restful API',
    },
    host: '20.89.56.97:5000',
    basePath: '/api',
    schemes: ['http'],
};

swaggerAutogen(outputFile, endpointsFiles, doc)