const mongoose = require('mongoose');
const Acronym = require('./models/acronym');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/acronyms_db', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB');
    // Seed data
    const acronyms = [
      { acronym: '2B', definition: 'To be' },
      { acronym: '2EZ', definition: 'Too easy' },
      { acronym: '2G2BT', definition: 'Too good to be true' },
      { acronym: 'LOL', definition: 'Laugh out loud' },
      { acronym: 'BRB', definition: 'Be right back' },
      { acronym: 'OMG', definition: 'Oh my God' },
      { acronym: 'IMO', definition: 'In my opinion' },
      { acronym: 'TBH', definition: 'To be honest' },
    ];
    return Acronym.insertMany(acronyms);
  })
  .then(() => {
    console.log('Seeded data');
    // Disconnect from MongoDB
    return mongoose.disconnect();
  })
  .then(() => {
    console.log('Disconnected from MongoDB');
    process.exit(0);
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });