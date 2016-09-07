var _ = require('lodash');
var mongoUri = process.env.MONGODB_URI || 'mongodb://localhost/carpooling';

var defaults = {
  db: {
    'secret': '^hr%ps}79TV2D&KJ',
    'database': mongoUri
  },
  mailer: {
    'service' : 'Mailgun',
    'user'  : 'postmaster@sandbox2a6fe67649af4a019f16d6a46c7a60c1.mailgun.org',
    'pass'  : '2fd912caedf6f773d61c777ab375f322',
    'from'  : 'carpooling@nearsoft.com',
    'default' : 'vcastrejon@nearsoft.com'
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
  },
  firebase: {
    apiKey: "AIzaSyCI7KqudvtYvEZAKNX-b3iHdu67_FbfvRc",
    authDomain: "rideasone-d96cf.firebaseapp.com",
    storageBucket: "rideasone-d96cf.appspot.com",
    databaseURL: "https://rideasone-d96cf.firebaseio.com",
    serviceAccount: {
      "type": "service_account",
      "project_id": "rideasone-d96cf",
      "private_key_id": "e50029c5e6c283fede788f4f589963923e46b802",
      "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvwIBADANBgkqhkiG9w0BAQEFAASCBKkwggSlAgEAAoIBAQC40rSHPQ6Qi7rL\nCt7poOkwlj/Cp+V8e+5fDv9QAt5UXOCEXoiparBRPHeO6QL6/GSsd1TB9xYgYtOz\nHzjmPHdDk2XeIiaotqA2PyyXaJyPSyMc6yst+9yvjluG+mfuw0h/hlOcLhflpmf8\n6rciLoGC/mneZ47f1pp9UrvB8Kfqo72id8O9MCIFY1bLJoPjIajKBkAOOL/+b+4t\novLQhJpvfY9np3VTuMBo4DDaAn3bLem7uNqy3RdAlQPM+l+WsOg6J2ScZPhgUpM7\nLlJU/dQ/Bq5/RcENIa/fFGMQWLd9vpFuXb6jLhR6QtEpde3YXMcR5pATQWiKWU+C\nwYT2Qv0ZAgMBAAECggEBAImdMZfkqVyM/cdCz9lK23Y22UC5vJBkwob65rUPfbV4\n9h75OG5UpvXFvQumiXaRyO/1ZiGKNWply1T6sWYUrYSeUmIEMZ67ZC0f+ra9yJyV\nCI72t07k0lvQ9mtZNVu9AdUaElUeqOJwdcsGhNcpo3sCrZdQqjwWUS9xE6YC5zQ3\n9KpkwpsSpPpnrMKYllBrkjuQCmJ4UM4n3puuvhFg+nz4qmWrir8QbEvg64WuHJh4\nbS1+l2SxlrdPfgmksXialYYfb2kE7M2qeRx4u2iDTzRoyHu6h9dVy12HisjeAaeF\n0LWdkRMDRydD9Sekj12bF+25tI1jdBu8BKda/LOQHZECgYEA4/i5ZdABqrARiqVR\noUB3lan2dxT+RhiKnlJXPx0vXewXGrsr4IFocfskdxIhA0ZFpkJxBR3iqhnYN9FB\nUwy3V7fFXX9b9y7AAgf0RKxEb3gyUQrIPv/NCGzoaI8PAcmFxfnBPO8Di007xHe9\ni33riO5ur8tkrQeZX02RZJADyv0CgYEAz4vn9tbMv+zOWjl/c3UXTDQVxsnXQhS7\nAfPZ+Go4qTBndgqQR986oIfM98sSiOqivhFkDei+qhuT4oqVjWvgggKh4HT0c21U\nsGuxVQcFdHQw62TqBe6vJHzwAd5bZw4ZAwwoV1UM3hlSd5PgQA13o+vm9Uvtk1Lc\nj0bNLAcDW00CgYEAuiKtDcomcj1MNU4CNo0ylsqtaFGFw6nqFJbakbe8ow1PWA4X\nJznCE76g6W+t8MSBvdxl922NUqHDft+mXK73S/HKfiqs5kgPkhj4gtG9Ft6nBrCt\nC3NE72os4KJd+HGYfisMcjodRLIM6L9zzd9EXwt+6J5DV1vrCHuHCPrlfekCgYEA\nsAOa6gApDOur5WC18hjvdTUG8tvirqweHP3NcZvECdh/JeC3k/yBH/uLnOqgAXXc\nJw1gqVslt+ZDePDG/HTspdXNqyoE1o92L1hlwBKAUc7oXfnrbrSJ3IwIj80f/zo5\nhBgfblE25HTdN4Q1vpytRlueN5H5HeQ8IVaOUjRwaFECgYAQf+RI72jFBJxvIlCj\nJvnPepzOBTkUdluBHYXaRhplYpTJTJL6AX7oMGbPlspwAUBqDkZVjWArD1dNRtHr\nTnm0owLzg/djE1nJXceil4ztnCx6qKNTIE1LxUkKoTCd0aFs9YMkwV1maH2c08PC\n7E3xsCO3UBwz2YnotUt6GRhwVA==\n-----END PRIVATE KEY-----\n",
      "client_email": "rideasone-service@rideasone-d96cf.iam.gserviceaccount.com",
      "client_id": "105944406864658159685",
      "auth_uri": "https://accounts.google.com/o/oauth2/auth",
      "token_uri": "https://accounts.google.com/o/oauth2/token",
      "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
      "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/rideasone-service%40rideasone-d96cf.iam.gserviceaccount.com"
    },
    databaseAuthVariableOverride: {
      uid: "rideAsOne-service"
    }
  }
};

var overrides = {
  test: {
    db: {
      database: 'mongodb://localhost/carpooling-test'
    }
  },
  production: {
    firebase: {
      apiKey: "AIzaSyBPA6TkgY1Y589UXOmUWz8rUNcYntqmnns",
      authDomain: "vocal-etching-118719.firebaseapp.com",
      storageBucket: "vocal-etching-118719.appspot.com",
      databaseURL: "https://vocal-etching-118719.firebaseio.com",
      serviceAccount: {
        type: "service_account",
        project_id: "vocal-etching-118719",
        private_key_id: "242fdc403e17c4a13029bc9518510774b19ce786",
        private_key: "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCdO81P5CD7VEfy\n1e2ex05yXVAJuM5lW9o3MOSDrbYD2pujcSYSjdQkhZxtKF3FK83LFzm0TNB9pfJq\nn4pkCvYgrfc/Ukc1BgXfJhXWBCvnj6ehIU1hPBnTNyls91gd0sgFWXR8qle58jAW\nR0BSKDgemKAGx8cqeNNCL4Wqh1KwTki7nTFCKtxKYooQkLX2wVctFABqeyLiU8az\nQGkhtT7mOTleRnEkrgo2Y4bE6H/mvXxpl2JORqZpcIAEOJyCWemM/5vJ0FC6r5cc\nPzCEVN2BANJbXPCFBCFrG7sRA/g+EomjDyk5x0kgywWiz1kG6zeNNoFv6wRLZqpP\n9UNeCbppAgMBAAECggEAKWKuPdMMI1shvPc2Hk7ThSKuiICOQvuUSmaiH06/0+/c\ne36yyLtwFVTdwZWYaOeIuWYZmC2Hyyq8zffEU2TXN+7SX2Zmu7wkG4JIyRY8AC09\nsBm15lwNaBzi2H2aQe9TGqVbFd04TgdDRPnoIjfX3aXKqT44XCOFZ6xegG4yA5mN\nr5MRMXS9Pfk+XtMlkE4rQYLMClyTkTzaH04uH5vhM7Um+/gCSfmHVs97J9xSIY4U\nbSPY0i6Z208Rsff3gn3PGj5pqK+5zfWGtEKHYvSz7WJ8LV4QeXIkES1btEKuk4uv\n6Tt9KOBbdrfMu/H/M2Yy6BujT1XWbs37jLdW44H6KQKBgQDRnsd4kx0z5S9cu/dI\nDq81t14k56W4loUulrAIwIY698V1140cHHVxqIufORbigfTGjZ8senxlUZ4yyxlB\nWtQOAptM24+WWJmGjZBlWtfllx5ocSa5pcEUh0Msl4yFoIF9Pxrm3areRkRRWWwA\nW6nv5mpmDXlri201K5aN1QxEJwKBgQDABcLr/qjC3D5rzuwstITEDtWurOH4re08\nEWY82rpbOtijx8zMlouBbWtcaSEZ4Nkf1SOLmv0oKYcD7MmdbPUMmk7hRaxJCRUT\nSovVnhMNjMS9M9FFZLqdAI5eyFLePGqPXBj4D/xqgtvltadylu6sNO6qG1cf4PGt\nBXVry2dW7wKBgCNc1enRZ6vJjiPm0eCmGYjGVmuDaMGrIuypHyla0UpBYl5u7q8/\nXdC+zk8eIm4z3kdgvOmUAEhXbIjFGo2b9QooBmsA30hNyhiY6TMwEBv7UnXsIMxQ\n2jHMX9i1+E7StQWcD73Cx4CX+g5/N2kYDaMbC/gLbeBmtRWzNMLYnikhAoGAVeX9\n5V4dFlY54jZFdlYmkiHkuugBiiIb3uQVrSFXfhob8WAeoGKz82kEPumUciQgXNoW\ntYvWtZGmIT5ajn7APCwHH0TwphdXAzM0zJGTCluvYsf8VKOTy0oFZicM0veJ36me\nTdGw4+C4B9E0H9Ge4RAot5XVaqBQ3Ep11Yu/JacCgYEAgr3f1ehnT2wA/UIOs5Xv\nBuinnE5X1ru2+c0PmUp9wf2BOfWxCaKq4yNdHlxcfC6ivp8DtmWjb1aKZFPzPvjq\nFhIYC3y1uEMpNG/hk74CoAvXE6ZaUDkcGu9ae4XAy2j9PbZT9LefG6PgMswzCPd9\ns4zvCY+p7t7oR86CpuKS+GM=\n-----END PRIVATE KEY-----\n",
        client_email: "rideasone-server@vocal-etching-118719.iam.gserviceaccount.com",
        client_id: "109760018379562126322",
        auth_uri: "https://accounts.google.com/o/oauth2/auth",
        token_uri: "https://accounts.google.com/o/oauth2/token",
        auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
        client_x509_cert_url: "https://www.googleapis.com/robot/v1/metadata/x509/rideasone-server%40vocal-etching-118719.iam.gserviceaccount.com"
      },
      databaseAuthVariableOverride: {
        uid: "rideAsOne-service"
      }
    }

  }
};

module.exports = _.merge(defaults, overrides[process.env.NODE_ENV]);
