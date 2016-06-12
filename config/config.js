var mongoUri = process.env.MONGODB_URI || 'mongodb://localhost/carpooling'

module.exports = {
  db: {
    'secret': '^hr%ps}79TV2D&KJ',
    'database': mongoUri
  },
  mailer:{
    'service' : 'Mailgun',
    'user'    : 'postmaster@sandbox2a6fe67649af4a019f16d6a46c7a60c1.mailgun.org',
    'pass'    : '2fd912caedf6f773d61c777ab375f322',
    'from'    : 'carpooling@nearsoft.com',  
    'default' : 'vcastrejon@nearsoft.com' 
  }
};
