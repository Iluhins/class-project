var common = require('./common');
const fileUpload = require('express-fileupload');

exports.create = function (app, connection) {
    
    app.get('/api/utils/languages', function (req, res) {
        connection.query('SELECT * FROM languages ORDER BY name', function (err, results) {
            if (err) {
                res.json(common.getSqlErrorObject(err, req));
                return;
            }
            res.json(common.getSuccessObject(results, req));
        });

    });

    app.get('/api/utils/services', function (req, res) {
        connection.query('SELECT * FROM service ORDER BY name', function (err, results) {
            if (err) {
                res.json(common.getSqlErrorObject(err, req));
                return;
            }

            res.json(common.getSuccessObject(results, req));

        });

    });

    app.get('/api/utils/companyTypes', function (req, res) {
        connection.query('SELECT * FROM companyTypes', function (err, results) {
            if (err) {
                res.json(common.getSqlErrorObject(err, req));
                return;
            }

            res.json(common.getSuccessObject(results, req));

        });

    });

    app.post('/api/utils/languages', function (req, res) {
        var newName = (req.body.name || '').trim();
        if (!newName) {
            return { success: false, errMessage: 'New Language name is required.' };
        }
        connection.query('INSERT INTO languages(name) VALUES ("' + newName + '")', function (err, results) {
            if (err) {
                res.json(common.getSqlErrorObject(err, req));
                return;
            }
            res.json(common.getSuccessObject({ ...req.body, id: results.insertId }, req));
        });

    });

    app.post('/api/utils/services', function (req, res) {
        var newName = (req.body.name || '').trim();
        if (!newName) {
            return { success: false, errMessage: 'New Service name is required.' };
        }
        connection.query('INSERT INTO service(name) VALUES ("' + newName + '")', function (err, results) {
            if (err) {
                res.json(common.getSqlErrorObject(err, req));
                return;
            }
            res.json(common.getSuccessObject({ ...req.body, id: results.insertId }, req));
        });

    });
    app.delete('/api/utils/languages', function (req, res) {
        var languageId = req.query.id;
        if (!languageId) {
            return;
        }
        connection.query('DELETE FROM languages WHERE id=' + languageId, function (delErr) {
            if (delErr) {
                res.json(common.getSqlErrorObject(delErr, req));
                return;
            }
            connection.query('SELECT * FROM languages', function (selectErr, results) {
                if (selectErr) {
                    res.json(common.getSqlErrorObject(selectErr, req));
                    return;
                }
                res.json(common.getSuccessObject(results, req));
            });

        });

    });

    app.delete('/api/utils/services', function (req, res) {
        var languageId = req.query.id;
        if (!languageId) {
            return;
        }
        connection.query('DELETE FROM services WHERE id=' + languageId, function (delErr) {
            if (delErr) {
                res.json(common.getSqlErrorObject(delErr, req));
                return;
            }
            connection.query('SELECT * FROM services', function (selectErr, results) {
                if (selectErr) {
                    res.json(common.getSqlErrorObject(selectErr, req));
                    return;
                }
                res.json(common.getSuccessObject(results, req));
            });

        });

    });
    app.use(fileUpload());
    app.post('/api/utils/uploadImage', function (req, res) {
        if (Object.keys(req.files).length == 0) {
            res.json(common.getErrorObject('No files were uploaded.', req));
            return;
        }
        // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
        let file = req.files.file;
        var time = new Date();
        // Use the mv() method to place the file somewhere on your server
        var name = req.files.file.name;
        var creatorString = '_by_' + (common.getLoggedUserName(req) || 'unlogged') + '_'; 
        var filePath = 'uploadedImages/' + name.substring(0, name.lastIndexOf('.')) + creatorString + time.getTime() + name.slice(name.lastIndexOf('.'));
        file.mv(filePath, function (err) {
            if (err) {
                res.json(common.getErrorObject('Cannot save file on the server.', req));
                return;
            }
            var rootFilePath = '/' + filePath;
            connection.query('INSERT INTO images (url) VALUES ("' + rootFilePath + '");', function (insertErr, results) {
                if (insertErr) {
                    res.json(common.getSqlErrorObject(insertErr, req));
                    return;
                }
                res.json(common.getSuccessObject({imageID: results.insertId, url: rootFilePath}, req));
            
            });
        });
    });

};

