var ZipCodes = require('zipcodes');
exports.filterLawyers = function (languageID, serviceID, zip, rad) {
    var SQLquery;
    if (languageID && serviceID && languageID.length && serviceID.length) {
        SQLquery = 'SELECT lawyers.id, lawyers.name, lawyers.email, lawyers.zip FROM lawyers ' + 
        'INNER JOIN (SELECT * FROM lawyer_language WHERE lawyer_language.languageID IN (' + languageID + ')) AS lawyer_language ON lawyers.id = lawyer_language.lawyerID ' + 
        'INNER JOIN (SELECT * FROM lawyer_service WHERE lawyer_service.serviceID IN (' + serviceID+')) AS lawyer_service ON lawyers.id=lawyer_service.lawyerID';
    } else if (languageID&&languageID.length){
        SQLquery = 'SELECT lawyers.id, lawyers.name, lawyers.email, lawyers.zip FROM lawyers ' +
        'INNER JOIN (SELECT * FROM lawyer_language WHERE lawyer_language.languageID IN (' + languageID + ")) AS lawyer_language ON lawyers.id = lawyer_language.lawyerID";                  
    } else if (serviceID&&serviceID.length){
        SQLquery = 'SELECT lawyers.id, lawyers.name, lawyers.email, lawyers.zip FROM lawyers ' +
        'INNER JOIN (SELECT * FROM lawyer_service WHERE lawyer_service.serviceID IN (' + serviceID + ")) AS lawyer_service ON lawyers.id = lawyer_service.lawyerID ";                  
    
    } else {
        SQLquery = 'SELECT id, name, email, zip FROM lawyers'; 
    }
    if(zip && rad){
        var zips = ZipCodes.radius(zip, rad);
        if (zips.length){
        SQLquery += " WHERE lawyers.zip IN (" + zips + ")";
        }
    }
    SQLquery += " GROUP BY lawyers.id;";
    console.log(SQLquery);
    return SQLquery;
}