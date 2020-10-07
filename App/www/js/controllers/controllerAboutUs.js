angular.module('starter').controller('aboutUsCtrl', function( $scope, InfoFactories) {
    $scope.selectedClient = InfoFactories.getClientSelected();
  $scope.selectedClient.aboutInfo =  {
    title: "GPP d.o.o. - Gradski prijevoz putnika, društvo s ograničenom odgovornošću",
    infoList : [{
       label: "Adresa",
       value: "Cara Hadrijana 1, 31000 Osijek"
    },{
       label: "MB",
       value: "3026132"
    },{
        label: "OIB",
        value: "96779488329"
     },{
        label: "CL",
        value: "0800 7555"
     }]
}
})