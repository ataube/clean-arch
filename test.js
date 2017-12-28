(async () => {
  var main = require('./src/main.js');
  var domain = main({ appName: 'cleanarch', dbUrl: 'postgres://postgresql@localhost:5432/cleanarch' });

  try {
    domain.eventBus.on('PRODUCT_CREATED', (p) => {
      console.log('>>> PRODUCT_CREATED:', p);
    })

    await domain.connect();
    await domain.useCases.createProductUseCase({ sku: 'ABC-123', brand: 'brand1', description: 'my desc' });
    process.exit(0)

  } catch(e) {
    console.log('err', e);
  }

})()

