window.locale_en = {};

window.locale_en.register = {
	title: 'Complete registration',

};

window.locale_en.leftMenu = {
	menuTitle: 'User Profile',
	username: 'Username',
	editPassword: 'Change Password',
	menuDivider: 'Menu',
	home: 'Home',
	driveLicense: 'Driver License',
	settings: 'Settings',
	help: 'Help',
	reserveHistory: 'Bookings History',
	logout: 'Logout'
}

window.locale_en.sos = {
	title: 'SOS',
	info: 'SOS service is available H24. It is important request this service only for true emergency!',
	sendRequest: 'Send SOS',
	noInfo: 'Some information cannot be retrieved!'
}

window.locale_en.bookings = {
	title: 'Bookings',
	notFound: 'Your Bookings list is empty',
	pnr: 'PNR ',
	plate: 'Plate',
	color: 'Color',
	seats: 'Seats',
	externalClean: 'External',
	internalClean: 'Interior',
	get: 'Pick-Up',
	set: 'Return',
	delay: 'Delay',
	changeDriver: 'Driver Change',
	damage: 'Defect (vehicle returned to parking)',
	cleaness: 'Cleaness',
	noCoords: 'GPS coordinates cannot be retrieved! Try again later.',
	noYourCoords: 'GPS coordinates cannot be retrieved.',
	errorOpenCar: 'Vehicle cannot be opened, please try again!',
	humanCheckCarOpenTitle: 'Check',
	humanCheckCarOpenSubTitle: 'Please confirm vehicle status!',
	humanCheckCarOpenMessage: 'Please wait few seconds! If vehicle cannot be opened, try again.',
	humanCheckCarCloseMessage: 'Please wait few seconds! If vehicle cannot be closed, try again.',
	needCurrectPark: 'Vehicle must be placed into the parking area before being authorized to be closed.',
	needProximity: 'You must be near the vehicle to be authorized to open it.',
	damageHard: 'Damage (vehicle transferred to car mechanic)',
	openCar : 'Start Run',
	closeCar : 'End Run',
	cancelReservation: 'Delete',
	cancelConfirmTitle: 'Confirm deletion',
	cancelConfirmBody: 'Would you really delete selected booking?',
	gpsAlert: 'This app requires location to authorize the opening and closing vehicle features',
	tarif: 'Tariff',
	price: 'Price',
	orderPending: "Attention, this order waiting for approve"
}

window.locale_en.parking = {
	title: 'Chose parking',
	noparking: 'No parking found',
	placeholderSearch: 'Search',
	pickupDirection: 'Pick-up park is different than return park?'
};

window.locale_en.tabs = {
	reservations: 'Bookings',
	plafond: 'Plafond',
	park: 'Parkings',
	booking: 'Book',
	vehicles: 'Vehicles',
	settings: 'Settings',
	sos: 'SOS',
	notifications: 'Notifications'
};

window.locale_en.notifications = {
	title: 'Notifications',
	notFound: 'No notifications found...',
	failGetNotfications: "Server notifications cannot be retrieved."
};

window.locale_en.commons = {
	refresh: 'Update...',
	yes: 'Yes',
	no: 'No',
	back: 'Back',
	note: "Note",
	confirm: "Confirm",
	locationNotAviable: 'In order to use the "Start Race" / "End of Race" service available on our APP, it is necessary to allow geolocation of this smartphone. Otherwise you can not be enabled for the service.',
	retry: 'Try again',
	legalNotice: 'Copyright © 2016 Corporate Car Solutions Italia  All Rights Reserved',
	readMore: 'Read more...',
	search: 'Search...',
	select: 'Select',
	close: 'Close',
	attention: 'Warning',
	cancel: 'Cancel',
	save: 'Save',
	insert: 'Insert',
	alert: 'Alert',
	success: 'Success',
	error: 'Error',
	connectionProblem: 'We are experiencing connection problem!',
	successOperation: "Operation successfully completed",
	requestFail: "We have not been able to submit your request.",
	refuse: 'Refuse',
	accept: 'Accept',
	services: 'Services',
	bleSuccess: "Operation Complete Successfully!",
	bleConnection: 'Please enable bluetooth and retry',
	bleConnectionGenericError: 'There was an error contact help desk, errorCode: ',
	bleConnectionInvalidKey: 'Make sure you have placed the correct vehicle key in the key ring',
	bleConnectionAlreadyProcessedRequest: 'The request for opening has already been handled previously',
	bleConnectionNoKey: 'Make sure the vehicle key is in the key ring when closing the vehicle',

	plafond: "Plafond",
	currentPlafond: "Current plafond",
	chargePlafond: "Charge plafond",
	choosePlafond: "Choose a plafond value and continue",
	reservationTime: "Booking time",
	genericPlaceholder: "Select value",
	subscription: "Subscription",
	tarif: "Tariff",
	mandatoryField: "Fill in all required fields",
	register: "Register",
	emailAlreadyUsed: "Email already in use",
	usernameAlreadyUsed: "Username already in use",
	profileCreated: "Your profile is being verified. Proceed to activate the payment method",
	profileAlertModal1: "Profile waiting to be enabled",
	paymentModalContent: 'Dear Customer, for your protection, you will be asked to authorize a virtual platfond block in order to verify the validity of the data entered. <br><br> For to complete the registration procedure, a required by the bank, it is therefore necessary to press the “Proceed” button. <br>For info and support, contact us at our free number',
	noVehicols: "Sorry, but there are no vehicle available",
	oldDateAlert: "It's not possible to select an old date",
	futureDateAlert: "It's not possible to select a future date",
	selectTarif: "Please select a tariff",
	paymentMethodTitle: "Payment method"
};

window.locale_en.bookResume = {
	title : 'Book',
	parking: 'Parking',
	parkOpenedFrom: 'Opened from',
	parkOpenedTo: 'To',
	parkOpened24h: 'Opened H24',
	dateFrom : 'Pick-Up Date',
	dateTo: 'Return Date',
	cc: 'Fuel Card',
	cc_descr: 'If you need it, please select Fuel Card option',
	drivingRange: 'Driving Range',
	telepass: 'Telepass',
	telepass_descr: 'If you need it, please select Telepass option',
	vehicleType: 'Vehicle Type',
	confirm: 'Search vehicle',
	returnDateIsOut: 'Pick-Up Date does not fall within parking opening hours!',
	returnDateIsMajor: 'Pick-Up Date is greater than Return date!',
	returnDateNeedToBeMajor: 'Pick-Up Date must be higher than the current date !',
	isNotInTime: 'Return Date does not fall within the parking opening hours!',
	defineRange: 'You have not defined the Driving Range!',
	missingVehicleType: 'Select a Vehicle Type.',
	vehicleTypesNotFound: 'It was not possible to recover the Vehicles Types in this parking lot!',
	noDataFound: 'Some information could not be retrieved!',
	returnDateHaveToBe: 'Return Date must be within the ',
	wrongDates: 'Select the Pick-Up and Return date to continue.',
	wrongParking: 'Select parking before continuing.',
	pickupReturnlabel: "Pick-up/Return Parking",
	pickupPark : "Pick-up Parking",
	returnPark : "Return Parking",
	pickupStation : "Pickup stop",
	returnStation : "Return stop",
	dateStationFrom: "Departure Date",
	confirmStation: "Search",
	subscriptionIncompatible: "The reservation time is not compatible with your tariff",
	timeStationFrom: 'Departure time'
};

window.locale_en.map = {
	title: 'Booking details',
	carLocation: 'GPS Vehicle positions',
	get: 'Pick-Up',
	set: 'Return',
	goTo: 'Reach Vehicle',
	delete: 'Delete',
	confirmDeleteTitle: 'Confirm Delete',
	confirmDeleteInfo: 'Are you sure to delete the selected booking?',
	noCoordsFound: 'GPS vehicle coordinates are not available, please try again later!'
};

window.locale_en.confirmReservation = {
	title: 'Booking Confirm',
	back: 'Back',
	confirm: 'Confirm',
	wait: 'Please wait...',
	requestComplete: 'Booking Confirmed!',
	seats: "Seats",
	color: "Colour",
	incomplete: 'Warning!',
	park: 'Parking',
	selectPlace: "Insert 'Where'",
	selectDriveName: "Insert 'Driver Name'",
	dateFrom : 'Pick-Up Date',
	dateTo: 'Return Date',
	cc: 'Fuel Card',
	telepass: 'Telepass',
	pnr: 'PNR'
};

window.locale_en.vehicle = {
	title: 'Select Vehicle',
	notFound: 'Sorry, all vehicles are booked for the period you requested!',
	plate: 'Plate',
	select: 'Select',
	seats: 'Seats',
	color: 'Colour',
	vehicleType: 'Vehicle Type',
	model: 'Model',
	fuelType: 'Fuel Type',
	externalClean: 'External',
	internalClean: 'Internal',
	noVehiclesInThisMoment: 'No vehicle is currently available for the period requested by you.',
    labelCannotReserve: 'Your booking can not be accepted, as there is already a reservation in your name for the requested period.'
};

window.locale_en.login = {
	username: 'Username',
	password: 'Password',
	login: 'Login',
	forgotPassword: 'Forgotten Password?',
	retrievePassword: 'Recover Password',
	haveAccount: 'Login',
	email : 'Email',
	placeholderEmail: 'company@domain.it',
	companyCode: 'Verify Company Code',
	companyCodePlaceholder: 'Insert Company Code',
	companiesMissing: 'Company information could not be retrieved',
	retryCompanyCode: "Company Code does not, please enter it again!",
	result: 'Feedback Requested',
	dataWrong: 'Email/Password are wrong, '
};

window.locale_en.settings = {
	personalData: 'Personal Data',
	client: 'Client',
	title: 'Settings',
	check1: 'Reduced Picture',
	check1_descr: 'Show reduced vehicle images',
	editPassword: 'Modify Password',
	editPayment: "Edit payment method"
};

window.locale_en.driveLicense = {
	title: 'Driver License Data',
	license: 'Driver License',
	number: 'Driver License ID',
	issuingCountry: 'Place of Issue',
	issuingDate: 'Release Date',
	expiringDate : 'Expiration Dare',
	editLicense: 'Update Driver License Data',
	cancel: 'Cancel',
	save: 'Save',
	fieldMandatory: 'Driver license data are mandatory!',
	editSuccess: 'Driver license data modified!',
	editFail: "Driver license data could not be changed!"
};

window.locale_en.editPassword = {
	title: 'Modify Password',
	currentPassword: 'Insert current password',
	newPassword: 'Insert new password',
	repeatPassword: 'Confirm new password',
	cancel: 'Cancel',
	edit: 'Modify',
	mandatory: 'Insert all informations needed.',
	passwordNoMatch: 'New password does not match!',
	oldPasswordInvalid: 'Old password is wrong!',
	editSuccess: 'Password successfully changed.',
	editFail: 'Password cannot be changed!'
};

window.locale_en.contacts = {
	title: 'Contacts',
	email: 'Email',
	phone: 'Phone',
	time: 'Timetable',
	emailSubject: 'CCS Support request #'
};

window.locale_en.clientDetails = {
	title: 'Personal data',
	anagrafic: 'Registry',
	firstName: 'Name',
	lastName: 'Last Name',
	username: 'Username',
	badge: 'BadgeID',
	contacts: 'Contacts',
	email: 'Email',
	phone: 'Mobile',
	editContacts: 'Modify contacts',
	cancel: 'Cancel',
	save: 'Save',
	mandatory: 'Email is mandatory',
	editSuccess: 'Contacts modified!',
	editFail: 'Contacts cannot be modified!'
};

window.locale_en.actionSheet = {
	chageDriver: 'Driver Change',
	selectEmployee: 'Select employee',
	confirm: 'Confirm',
	cancel: 'Cancel',
	continue: 'Continue',
	segnalation: 'Alert',
	attention: 'Warning',
	damageInfo1: 'Raised the Damage Alert, only if you are sure, that the vehicle is not able to return to the parking lot and needs to be brought or transferred, to a repair workshop.',
	damageInfo2: 'The Damage Alert, therefore, imply the closure of the present race, so as to allow it to reserve another vehicle if desired. To close the present race, it is requested to communicate moreover',
	damageInfo3: 'Please note that once the damage alert will be sent, the vehicle will no longer be usable',
	totalKM: 'Total miles shown on the instrument panel.',
	noteWithDesc: 'Note (useful for the fault diagnosis)',
	needSupport: 'If the vehicle needs to be transferred to a repair workshop or not',
	note: 'Note',
	note2: 'Note',
	chooseDefectType: 'Choose fault type',
	fuelLevel: 'Select remaining fuel level',
	notesPlaceholder: 'Additional useful info',
	kmPlaceholder: 'Insert the mileage',
	mechaninc: 'Vehicle transferred to the repair workshop?',
	chooseAlertType: 'Select Fault Alert type...',
	driversNotFound: "The list of authorized employees could not be recovered. Try again!",
	cleanNotify: 'Vehicle clean status',
	selectCleanStatusInfo: 'Declare vehicle clean status',
	successAlertSent: 'Data successfully saved',
	failAlertSent: 'Report could not be saved. Try again!',
	delayNotify: 'Declare Delay',
	delayNotifyInfo: 'Hown late you will be?',
	successDelaySent: "Delay successfully communicated!",
	failDeilaySent: 'Delay could not be communicated. Try again!',
	damageSuccess: 'Damage successfully communicated!',
	damageError: 'Damage alert cannot be communicated. Try again!',
	changeDriverSuccess:'Requested driver change successfully communicated to ',
	changeDriverError: 'Driver Change cannot be applied. Try again!'
};


window.locale_en.gpp = {
	registrationTitle: "Your data",
	account: "Account",
	username: "Username",
	insertValue: "Insert a value",
	password: "Password",
	confirmPassword: "Confirm Password",
	email: "Email",
	confirmEmail: "Confirm Email",
	personalData: "Personal Data",
	firstName: "Name",
	lastName: "Surname",
	gender: "Gender",
	birthDate: "Date of birth",
	number: "Mobile",
	taxCode: "Tax Code",
	docType: "Document type",
	idIdentity: "Document Number",
	addressSection: "Address",
	address: "Address and number",
	zipCode: "Zip code",
	city: "City",
	country: "Country",
	proceed: "Proceed",
	registrationLicenseTitle: "Your license",
	license: "Driving license data",
	licenseNumber: "Number",
	issuer: "Released by",
	countryIssue: "Country of issue",
	licenseIssueDate: "Release date",
	licenseEndDate: "Expiry date",
	licenseUpload: "Upload driving license photo",
	frontPick: "Front document",
	backPick: "Retro document",
	uploadImage: "Upload image",
	termsTitle: "Terms and conditions",
	refuse: "Cancel",
	next: "Next",
	agree: "I accept",
	mandatoryFields: "Fill in all required fields",
	passwordRegex: "The password must contain a minimum of 8 characters and a maximum of 20, which must contain at least one capital letter and at least one number",
	passwordMatch: "Password fields do not match",
	emailMatch: "Email fields do not match",
	invalidZipCode: "The Zip code is incorrect",
	emailRegex: "Email field is incorrect",
	consentsMandatory: "Before proceeding, accept all consents",
	uploadMandatoryFiles: "Upload mandatory license images",
	imageUploaded: "Image uploaded"
}