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
  },
  jwtSecret: process.env.JWT_SECRET || 'weShouldAddAKeyToEnvironmentVariablesToMakeThisShitSecure',
  issuer: 'one.rideas.api',
  twitter: {
    key: 'jq5f1KwBuSUimnn78MskHlL5i',
    secret: 'aL1qpqo4g3oownskIzwz3XoWHQl4FMlvHeqop6bfX2oIYvv6pp'
  },
  facebook: {
    key: '1515943715378851',
    secret: 'e4fa56b2a2be6dbfa96994baf9660643'
  },
  google: {
    key: '764821343773-cjpf8lnubnnmjrupiu8oen4vsacgcq9n.apps.googleusercontent.com',
    secret: '5sAsJshpCHf_s4Tzk17_7nTK'
  }
};
