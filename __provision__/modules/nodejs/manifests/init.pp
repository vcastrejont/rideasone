class nodejs {
	exec { 'add-repository':
		command => 'curl -sL https://deb.nodesource.com/setup_5.x | sudo -E bash -',
		path => '/usr/bin'
	}

	package { 'nodejs':
		ensure => installed,
		require => Exec['add-repository']
	}

	exec { 'install bower':
		command => 'npm install -g bower',
		path => '/usr/bin',
		require => Package['nodejs']
	}

}
