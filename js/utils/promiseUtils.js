function getContextWebInformation(url) {
    return new Promise((resolve, reject) => {
        $.ajax({
            url: url + "/_api/contextinfo",
            method: "POST",
            headers: {
                "ACCEPT": "application/json;odata=verbose",
                "content-type": "application/json;odata=verbose"
            },
            success: function (data) {
                resolve(data.d.GetContextWebInformation.FormDigestValue)
            },
            error: function (response, errorCode, errorMessage) {
                reject("Could not complete list permission call: " + errorMessage);
            }
        })
    });
}

function getListInfoPromise(listTitle) {
    return new Promise((resolve, reject) => {
        $.ajax({
            url: spo.getSiteUrl() + "/_api/web/lists/getbytitle('" + listTitle + "')?$select=*,Effectivebasepermissions,DefaultView&$expand=Fields,Fields/doctype,Views,DefaultView,DefaultView/ViewFields,DefaultView/Fields,Views/ViewFields",
            type: "GET",
            dataType: "json",
            success: function (response) {
                resolve(response)
            },
            failure: function (response) {
                reject(response);
            },
            error: function (response) {
                reject(response);
            },
        })
    });
}

function removePromiseListItem(url, listname, id) {
    var formDigestValue = "";
    var item = "";
    var etag = "";

    var context = getContextWebInformation(url)
        .then(data => {
            formDigestValue = data;
        });

    var listItem = getPromiseListItem(url, listname, id)
        .then(data => {
            etag = data.d.__metadata.etag;
        });

    return Promise.all([listItem, context])
        .then(data => {
            return new Promise((resolve, reject) => {
                $.ajax({
                    url: encodeURI(url + '/_api/web/lists/getbytitle(\'' + listname + '\')/items(' + id + ')/recycle()'),
                    // url: data.d.__metadata.uri + '/recycle()',
                    type: "POST",
                    headers: {
                        "Accept": "application/json;odata=verbose",
                        "X-Http-Method": "DELETE",
                        "X-RequestDigest": formDigestValue,
                        "If-Match": etag
                    },
                    success: function (data) {
                        resolve(data);
                    },
                    failure: function (data) {
                        reject(data);
                    },
                    error: function (data) {
                        reject(data);
                    }
                });
            })

        })
}

function getPromiseListItems(url, listname, query) {
    // Executing our items via an ajax request
    return new Promise((resolve, reject) => {
        $.ajax({
            url: url + "/_api/web/lists/getbytitle('" + listname + "')/items" + query,
            method: "GET",
            headers: {
                "Accept": "application/json; odata=verbose"
            },
            success: function (data) {
                resolve(data); // Returns JSON collection of the results
            },
            error: function (data) {
                reject(data);
            }
        });
    });
}

function getPromiseListItem(url, listname, id) {
    return new Promise((resolve, reject) => {
        $.ajax({
            url: encodeURI(url + "/_api/web/lists/getbytitle('" + listname + "')/items(" + id + ")"),
            method: "GET",
            headers: {
                "Accept": "application/json; odata=verbose"
            },
            success: function (data) {
                resolve(data);
            },
            failure: function (data) {
                reject(data);
            },
            error: function (data) {
                reject(data);
            }
        });
    });
}



function updatePromiseListItem(url, listname, id, metadata) {
    var formDigestValue = "";
    var item = "";
    var etag = "";
    var files = [];

    var context = getContextWebInformation(url)
        .then(data => {
            formDigestValue = data;
        });

    var listItem = getPromiseListItem(url, listname, id)
        .then(data => {
            if (metadata['Attachments']) {
                files = metadata['Attachments'];
                delete metadata['Attachments'];
            }
            // Eliminar key 'Id'
            if (metadata['Id']) {
                delete metadata['Id'];
            }
            // Eliminar key 'ID'
            if (metadata['ID']) {
                delete metadata['ID'];
            }

            // Prepping our update
            item = $.extend({
                "__metadata": {
                    "type": data.d.__metadata.type
                }
            }, metadata);

            etag = data.d.__metadata.etag;
        });

    return Promise.all([listItem, context])
        .then(data => {
            return new Promise((resolve, reject) => {
                $.ajax({
                    // url: data.d.__metadata.uri,
                    url: url + '/_api/web/lists/getbytitle(\'' + listname + '\')/items(' + id + ')',
                    type: "POST",
                    contentType: "application/json;odata=verbose",
                    data: JSON.stringify(item),
                    headers: {
                        "Accept": "application/json;odata=verbose",
                        "X-RequestDigest": formDigestValue,
                        "X-HTTP-Method": "MERGE",
                        "If-Match": etag
                    },
                    success: function (data) {
                        resolve(data)
                    },
                    failure: function (data) {
                        reject(data);
                    },
                    error: function (data) {
                        reject(data);
                    }
                });
            });
        })
        .then(data => {
            if (files) {
                files = files.filter(function (file) {
                    return (file instanceof File);
                });

                return getContextWebInformation(url)
                    .then(digest => {
                        return secuencializador(url, listname, id, files, formDigestValue)
                    })
                    .then(c => {
                        return Promise.resolve(data);
                    })
                    .catch(error => {
                        return Promise.reject(error);
                    })
            } else {
                return Promise.resolve(data);
            }
        })
}

function addPromiseListItem(url, listname, metadata) {
    var formDigestValue = "";
    var fullName = "";
    var item = "";

    var context = getContextWebInformation(url)
        .then(data => {
            formDigestValue = data;
        });

    var nombre = new Promise((resolve, reject) => {
        $.ajax({
            url: url + "/_api/web/lists/getbytitle('" + listname + "')/ListItemEntityTypeFullName",
            type: "GET",
            headers: {
                "Accept": "application/json;odata=verbose"
            },
            success: function (data) {
                fullName = data.d.ListItemEntityTypeFullName;
                resolve(data)
            },
            error: function (error) {
                reject(error);
            }
        });
    });

    return Promise.all([context, nombre]).then(c => {
        var item = $.extend({
            "__metadata": {
                "type": fullName
            }
        }, metadata);

        return new Promise((resolve, reject) => {
            $.ajax({
                url: url + "/_api/web/lists/getbytitle('" + listname + "')/items",
                type: "POST",
                contentType: "application/json;odata=verbose",
                data: JSON.stringify(item),
                headers: {
                    "Accept": "application/json;odata=verbose",
                    "X-RequestDigest": formDigestValue
                },
                success: function (data) {
                    // Returns the newly created list item information
                    resolve(data);
                },
                failure: function (data) {
                    reject(data);
                },
                error: function (data) {
                    reject(data);
                }
            });

        });
    });
}

function uploadPromiseAttachmentItem(url, listname, id, buffer, filename, digest) {
    var self = this;
    return new Promise((resolve, reject) => {
        $.ajax({
            url: encodeURI(url + "/_api/web/lists/getbytitle('" + listname + "')/items(" + id + ")/AttachmentFiles/add(FileName='" + filename + "')"),
            method: 'POST',
            data: buffer,
            processData: false,
            headers: {
                "Accept": "application/json; odata=verbose",
                "content-type": "application/json; odata=verbose",
                "X-RequestDigest": digest,
                //"content-length": buffer.byteLength
            },
            success: function (response) {
                return resolve(response);
            },
            failure: function (response) {
                return reject(response)
            },
            error: function (response) {
                return reject(response)
            }
        });
    });
}

function uploadAttachments(url, listname, id, file, digest) {
    return new Promise((resolve, reject) => {
        var reader = new FileReader();
        reader.onload = function (e) {
            var filename = file.name;
            var buffer = e.target.result;
            uploadPromiseAttachmentItem(url, listname, id, buffer, filename, digest)
                .then(data => {
                    resolve(data);
                })
                .catch(error => {
                    reject(error);
                })
        }
        reader.readAsArrayBuffer(file);
    })
}

function getUserLoginName(url, userId) {
    return new Promise((resolve, reject) => {
        $.ajax({
            url: url + "/_api/web/getuserbyid(" + userId + ")",
            type: "GET",
            async: false,
            headers: {
                "ACCEPT": "application/json;odata=verbose"
            },
            success: function (data) {
                resolve(data.d.LoginName)
            },
            error: function (error) {
                reject(error)
            }

        });
    })

}

function checkUserInGroup(url, userId, groupName) {
    return getUsersInGroup(url, groupName).then(c =>{
        return Promise.resolve(c.d.results.filter(d => d.Id === userId).length >= 1? true : false)
    })
}

function getUsersInGroup(url, groupName) {
    return new Promise((resolve, reject) => {
        $.ajax({
            url: encodeURI(url + "/_api/web/sitegroups/getbyname('" + groupName + "')/users"),
            type: "GET",
            contentType: "application/json;odata=verbose",
            headers: {
                "Accept": "application/json; odata=verbose",
                "content-type": "application/json; odata=verbose"
            },
            success: function (data) {
                resolve(data);
            },
            failure: function (data) {
                reject(data);
            },
            error: function (data) {
                reject(data);
            }
        });
    })
}

function UserToGroup(url, groupName, loginName, digest) {
    return new Promise((resolve, reject) => {
        $.ajax({
            url: encodeURI(url + "/_api/web/sitegroups/getbyname('" + groupName + "')/users"),
            type: "POST",
            contentType: "application/json;odata=verbose",
            headers: {
                "Accept": "application/json; odata=verbose",
                "content-type": "application/json; odata=verbose",
                "X-RequestDigest": digest,
                //"content-length": buffer.byteLength
            },
            data: JSON.stringify({
                '__metadata': {
                    'type': 'SP.User'
                },
                'LoginName': loginName
            }),
            success: function (data) {
                resolve(data);
            },
            failure: function (data) {
                reject(data);
            },
            error: function (data) {
                reject(data);
            }
        });
    })
}

function UserOffGroup(url, groupName, loginName, digest) {
    return new Promise((resolve, reject) => {
        $.ajax({
            url: encodeURI(url + "/_api/web/sitegroups/getbyname('" + groupName + "')/users/removeByLoginName"),
            type: "POST",
            contentType: "application/json;odata=verbose",
            headers: {
                "Accept": "application/json; odata=verbose",
                "content-type": "application/json; odata=verbose",
                "X-RequestDigest": digest,
                //"content-length": buffer.byteLength
            },
            data: JSON.stringify({
                'loginName': loginName
            }),
            success: function (data) {
                resolve(data);
            },
            failure: function (data) {
                reject(data);
            },
            error: function (data) {
                reject(data);
            }
        });
    })
}

function addUserToGroup(url, userId, groupName) {
    return new Promise((resolve, reject) => {
            var username = getUserLoginName(url, userId);
            var dig = getContextWebInformation(url);

            return Promise.all([username, dig])
                .then(args => {
                    UserToGroup(url, groupName, args[0], args[1])
                })
                .then(c => {
                    resolve(true)
                })
                .catch(error => {
                    reject(error)
                })
        })
        .catch(error => {

        })
}

function removeUserInGroup(url, userId, groupName) {
    return new Promise((resolve, reject) => {
            var username = getUserLoginName(url, userId);
            var dig = getContextWebInformation(url);

            return Promise.all([username, dig])
                .then(args => {
                    UserOffGroup(url, groupName, args[0], args[1])
                })
                .then(c => {
                    resolve(true)
                })
                .catch(error => {
                    reject(error)
                })
        })
        .catch(error => {

        })
}

function secuencializador(url, listname, Id, files, digest) {
    var p = Promise.resolve(); // Q() in q

    files.forEach(file => {
        p = p.then(() => uploadAttachments(url, listname, Id, file, digest));
    });

    return p;
}

function savePromiseListItem(url, listname, metadata) {
    var self = this;
    var files = [];

    // Eliminar key 'Attachments'
    if (metadata['Attachments']) {
        files = metadata['Attachments'];
        delete metadata['Attachments'];
    }

    // agregar el campo title si existe LinkTitle
    if (metadata['LinkTitle']) {
        metadata['Title'] = metadata['LinkTitle'];
    }

    // agregar el campo title si existe LinkFilename
    if (metadata['LinkFilename']) {
        metadata['Title'] = metadata['LinkFilename'];
    }

    // Eliminar key 'Id'
    if (metadata['Id']) {
        delete metadata['Id'];
    }

    // Eliminar key 'ID'
    if (metadata['ID']) {
        delete metadata['ID'];
    }

    return addPromiseListItem(url, listname, metadata)
        .then(data => {
            if (files) {
                files = files.filter(function (file) {
                    return (file instanceof File);
                });

                return getContextWebInformation(url)
                    .then(digest => {
                        return secuencializador(url, listname, data.d.Id, files, digest)
                    })
                    .then(c => {
                        return Promise.resolve(data);
                    })
                    .catch(error => {
                        return Promise.reject(error);
                    })
            } else {
                return Promise.resolve(data);
            }
        })
}

function getFileValueToBlobPromise(site, foldername, filename){
    return new Promise((resolve, reject) =>{
        var url = site + "/_api/web/GetFileByServerRelativeUrl('" + spo.getServerRelativeUrl() + foldername + "/" + filename + "')/openbinarystream";
        var xhr = new window.XMLHttpRequest();
        xhr.open("GET", url, true);
        //Now set response type
        xhr.responseType = 'arraybuffer';
        xhr.addEventListener('load', function () {
            if (xhr.status === 200) {
                var data = new Uint8Array(xhr.response);
                return resolve(new Blob([data]))
            }
        });
        xhr.addEventListener('error', function () {
            return reject()
        })
        xhr.send();
    })
}

function getContentFileUrl(url) {
    return new Promise((resolve, reject) => {
        var xhr = new XMLHttpRequest();
        xhr.open("GET", url, true);
        xhr.responseType = 'arraybuffer';
        xhr.addEventListener('load', function () {
            if (xhr.status === 200) {
                var data = new Uint8Array(xhr.response);
                var arr = new Array();
                for (var i = 0; i != data.length; ++i) arr[i] = String.fromCharCode(data[i]);

                return resolve(arr.join(""))
            }
        })
        xhr.addEventListener('error', function () {
            return reject()
        })
        xhr.send();
    })
}

function chunker(array, chunkSize) {
    var that = array;
    return Array(Math.ceil(that.length / chunkSize)).fill().map(function (_, i) {
        return that.slice(i * chunkSize, i * chunkSize + chunkSize);
    });
}


//
function listTemplate(item){
    var self = this;
    var subitems = '';
    var defaults = {
        id: generateUUID(),
        href: '#',
        title: '',
        after: '',
        media: '',
        header: '',
        footer: '',
        cssClass: '',
        onNewtab: false,
        f7view: '.view-main',
        panelClose: true,
        externalLink: false,
        collapsable: true,
        options: []
    },

    item = item || {};
    for (var def in defaults) {
        if (typeof item[def] === 'undefined') {
            item[def] = defaults[def];
        }
    }

    for (var k = 0; k < item.options.length; k++){
        subitems += listTemplate(item.options[k]);
    }

    return `
        <li id="` + item.id + `" class="` + item.cssClass + ` ` + (item.options.length > 0 ? 'accordion-item' : '') + `">
            <a href="#" ` + (item.onNewtab ? 'target="_blank"' : '') + `data-view="` + item.f7view + `" class="item-link item-content ` + (item.panelClose ? 'panel-close' : '') + ` ` + (item.externalLink ? 'external' : '') + `">
                <div class="item-media">` + item.media + `</div>
                <div class="item-inner">
                    <div class="item-title">
                        <div class="item-header">` + item.header + `</div>
                        ` + item.title + `
                        <div class="item-footer">` + item.footer + `</div>
                    </div>
                    <div class="item-after">` + item.after + `</div>
                </div>
            </a>
            ` + (item.options.length > 0 ? '<div class="accordion-item-content"><div class="list accordion-list"><ul class="">' + subitems + '</ul></div></div>' : '') + `
        </li>
    `
}

function blockTemplate(block){
    var self = this;
    var lists = '';
    var defaults = {
        header: '',
        footer: '',
        options: [],
        inset: false,
        collapsable: true
    },

    block = block || {};
    for (var def in defaults) {
        if (typeof block[def] === 'undefined') {
            block[def] = defaults[def];
        }
    }
    
    for (var k = 0; k < block.options.length; k++){
        lists += listTemplate(block.options[k]);
    }

    return `
        ` + (block.header ? '<div class="block-title">' + block.header + '</div>' : '') + `
        <div class="list ` + (block.collapsable ? 'accordion-list' : '') + ` ` + (block.inset ? 'inset' : '') + `">
            <ul class="">` + lists + `</ul>
            ` + (block.footer ? '<div class="block-footer">' + block.footer + '</div>' : '') + `
        </div>
    `
}
