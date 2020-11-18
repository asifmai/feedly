const mongoose = require('mongoose');

module.exports = () => new Promise(async (resolve, reject) => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useFindAndModify: false,
      useUnifiedTopology: true,
    });

    // mongoose.set('debug', true);
    console.log('MongoDB Connected...');
    
    resolve(true);
  } catch (error) {
    console.log('MongoDB Connection Error: ', error);
    reject(error);
  }
});