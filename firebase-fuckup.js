var FCM = require('fcm-push-notif');

var fcm = new FCM('AIzaSyAANPCvCuM_bSJPxIC3Ua8ClAdDeT7RuSA');

var message = {
	to: 'et5lKZUadEE:APA91bHbiUPmggkFRLN_Acj5KbDEGQwpyNVccu-NfunUHvGCK9KNps-R-DxkSKwFdogc_sAx2Kr4-aCvQ9j_O651jtNaP48-8TKnE9NcFDkNKe0KgaRJTCWdiGnQIQUdipNVLuI_3F9O',
	data: {
		algo: 'meh'
	},
	notification: {
		title: 'alalalla',
		body: 'body body body'
	}
};

fcm.send(message)
	.then(a => {console.log(a,'+++++++++');})
	.catch(e => {console.log(e, '--------');});
