const mongoose = require('mongoose');
const User = require('./models/User');
const bcrypt = require('bcryptjs');

mongoose.connect('mongodb://localhost:27017/school_ceo_dashboard').then(async () => {
  const user = await User.findOne({ email: 'admin@school.edu' });
  console.log('User found:', !!user);
  if (user) {
    console.log('Password hash:', user.password);
    console.log('Compare bcrypt "admin123":', await bcrypt.compare('admin123', user.password));
    console.log('Compare user method:', await user.comparePassword('admin123'));
  } else {
    const allUsers = await User.find({}, 'email');
    console.log('All users:', allUsers);
  }
  process.exit(0);
}).catch(console.error);
