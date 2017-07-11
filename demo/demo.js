var getAuthorization = function (options, callback) {

    // 方法一（推荐）
    var method = (options.method || 'get').toLowerCase();
    var pathname = options.pathname || '/';
    var url = '../server/auth.php?method=' + method + '&pathname=' + pathname;
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.onload = function (e) {
        callback(e.target.responseText);
    };
    xhr.send();

    // // 方法二（适用于前端调试）
    // var authorization = COS.getAuthorization({
    //     SecretId: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
    //     SecretKey: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
    //     method: (options.method || 'get').toLowerCase(),
    //     pathname: options.pathname || '/',
    // });
    // callback(authorization);

};

var cos = new COS({
    AppId: config.AppId,
    ChunkParallelLimit: 1,
    getAuthorization: getAuthorization
});

var pre = document.querySelector('.result');
var logger = function (text, color) {
    if (typeof text === 'object') {
        try {
            text = JSON.stringify(text);
        } catch (e) {
        }
    }
    var div = document.createElement('div');
    div.innerText = text;
    color && (div.style.color = color);
    pre.append(div);
    pre.style.display = 'block';
    pre.scrollTop = pre.scrollHeight;
};
console._log = console.log;
console._error = console.error;
console.log = function (text) {
    console._log.apply(console._log, arguments);
    logger(text);
};
console.error = function (text) {
    console._error.apply(console._error, arguments);
    logger(text, 'red');
};

function getService() {
    cos.getService(function (err, data) {
        console.log(err || data);
    });
}

function getAuth() {
    var AppId = config.AppId;
    var Bucket = config.Bucket;
    if (config.Bucket.indexOf('-') > -1) {
        var arr = config.Bucket.split('-');
        Bucket = arr[0];
        AppId = arr[1];
    }
    var key = '1.png';
    getAuthorization({
        method: 'get',
        pathname: '/' + key
    }, function (auth) {
        console.log('http://' + Bucket + '-' + AppId + '.' + config.Region + '.myqcloud.com' + '/' + key + '?sign=' + encodeURIComponent(auth));
    });
}

function putBucket() {
    cos.putBucket({
        Bucket: 'testnew',
        Region: config.Region
    }, function (err, data) {
        console.log(err || data);
    });
}

function getBucket() {
    cos.getBucket({
        Bucket: config.Bucket,
        Region: config.Region
    }, function (err, data) {
        console.log(err || data);
    });
}

function headBucket() {
    cos.headBucket({
        Bucket: config.Bucket,
        Region: config.Region
    }, function (err, data) {
        console.log(err || data);
    });
}

function putBucketAcl() {
    cos.putBucketAcl({
        Bucket: config.Bucket,
        Region: config.Region,
        // GrantFullControl: 'uin="1001", uin="1002"',
        // GrantWrite: 'uin="1001", uin="1002"',
        // GrantRead: 'uin="1001", uin="1002"',
        // ACL: 'public-read-write',
        // ACL: 'public-read',
        // ACL: 'private',
        AccessControlPolicy: {
            "Owner": {
                "ID": 'qcs::cam::uin/10001:uin/10001' // 10001 是 QQ 号
            },
            "Grants": [{
                "Grantee": {
                    "ID": "qcs::cam::uin/10002:uin/10002", // 10002 是 QQ 号
                },
                "Permission": "READ"
            }]
        }
    }, function (err, data) {
        console.log(err || data);
    });
}

function getBucketAcl() {
    cos.getBucketAcl({
        Bucket: config.Bucket,
        Region: config.Region
    }, function (err, data) {
        console.log(err || data);
    });
}

function putBucketCors() {
    cos.putBucketCors({
        Bucket: config.Bucket,
        Region: config.Region,
        CORSConfiguration: {
            "CORSRules": [{
                "AllowedOrigin": ["*"],
                "AllowedMethod": ["GET", "POST", "PUT", "DELETE", "HEAD"],
                "AllowedHeader": ["origin", "accept", "content-type", "authorzation"],
                "ExposeHeader": ["ETag"],
                "MaxAgeSeconds": "600"
            }]
        }
    }, function (err, data) {
        console.log(err || data);
    });
}

function getBucketCors() {
    cos.getBucketCors({
        Bucket: config.Bucket,
        Region: config.Region
    }, function (err, data) {
        console.log(err || data);
    });
}

function deleteBucketCors() {
    cos.deleteBucketCors({
        Bucket: config.Bucket,
        Region: config.Region
    }, function (err, data) {
        console.log(err || data);
    });
}

function putBucketTagging() {
    cos.putBucketTagging({
        Bucket: config.Bucket,
        Region: config.Region,
        Tagging: {
            "Tags": [
                {"Key": "k1", "Value": "v1"},
                {"Key": "k2", "Value": "v2"}
            ]
        }
    }, function (err, data) {
        console.log(err || data);
    });
}

function getBucketTagging() {
    cos.getBucketTagging({
        Bucket: config.Bucket,
        Region: config.Region
    }, function (err, data) {
        console.log(err || data);
    });
}

function deleteBucketTagging() {
    cos.deleteBucketTagging({
        Bucket: config.Bucket,
        Region: config.Region
    }, function (err, data) {
        console.log(err || data);
    });
}

function putBucketPolicy() {
    var AppId = config.AppId;
    var Bucket = config.Bucket;
    if (config.Bucket.indexOf('-') > -1) {
        var arr = config.Bucket.split('-');
        Bucket = arr[0];
        AppId = arr[1];
    }
    cos.putBucketPolicy({
        Policy: {
            "version": "2.0",
            "principal": {"qcs": ["qcs::cam::uin/10001:uin/10001"]}, // 这里的 10001 是 QQ 号
            "statement": [
                {
                    "effect": "allow",
                    "action": [
                        "name/cos:GetBucket",
                        "name/cos:PutObject",
                        "name/cos:PostObject",
                        "name/cos:PutObjectCopy",
                        "name/cos:InitiateMultipartUpload",
                        "name/cos:UploadPart",
                        "name/cos:UploadPartCopy",
                        "name/cos:CompleteMultipartUpload",
                        "name/cos:AbortMultipartUpload",
                        "name/cos:AppendObject"
                    ],
                    // "resource": ["qcs::cos:cn-south:uid/1250000000:test-1250000000.cn-south.myqcloud.com//1250000000/test/*"] // 1250000000 是 appid
                    "resource": ["qcs::cos:" + config.Region + ":uid/" + AppId + ":" + Bucket + "-" + AppId + "." + config.Region + ".myqcloud.com//" + AppId + "/" + Bucket + "/*"] // 1250000000 是 appid
                }
            ]
        },
        Bucket: config.Bucket,
        Region: config.Region
    }, function (err, data) {
        console.log(err || data);
    });
}

function getBucketPolicy() {
    cos.getBucketPolicy({
        Bucket: config.Bucket,
        Region: config.Region
    }, function (err, data) {
        console.log(err || data);
    });
}

function getBucketLocation() {
    cos.getBucketLocation({
        Bucket: config.Bucket,
        Region: config.Region
    }, function (err, data) {
        console.log(err || data);
    });
}

function putBucketLifecycle() {
    cos.putBucketLifecycle({
        Bucket: config.Bucket,
        Region: config.Region,
        LifecycleConfiguration: {
            "Rules": [{
                'ID': 1,
                'Filter': {
                    'Prefix': 'test123',
                },
                'Status': 'Enabled',
                'Transition': {
                    'Date': '2016-10-31T00:00:00+08:00',
                    'StorageClass': 'Standard_IA'
                }
            }]
        }
    }, function (err, data) {
        console.log(err || data);
    });
}

function getBucketLifecycle() {
    cos.getBucketLifecycle({
        Bucket: config.Bucket,
        Region: config.Region
    }, function (err, data) {
        console.log(err || data);
    });
}

function deleteBucketLifecycle() {
    cos.deleteBucketLifecycle({
        Bucket: config.Bucket,
        Region: config.Region
    }, function (err, data) {
        console.log(err || data);
    });
}

function deleteBucket() {
    cos.deleteBucket({
        Bucket: 'testnew',
        Region: config.Region
    }, function (err, data) {
        console.log(err || data);
    });
}

function putObject() {
    // 创建测试文件
    var filename = '1mb.zip';
    var blob = util.createFile({size: 1024 * 1024});
    // 调用方法
    cos.putObject({
        Bucket: config.Bucket, /* 必须 */
        Region: config.Region,
        Key: filename, /* 必须 */
        onProgress: function (progressData) {
            console.log(JSON.stringify(progressData));
        },
        Body: blob
    }, function (err, data) {
        console.log(err || data);
    });
}

function putObjectCopy() {
    var AppId = config.AppId;
    var Bucket = config.Bucket;
    if (config.Bucket.indexOf('-') > -1) {
        var arr = config.Bucket.split('-');
        Bucket = arr[0];
        AppId = arr[1];
    }
    cos.putObjectCopy({
        Bucket: config.Bucket,
        Region: config.Region,
        Key: '1mb.copy.zip',
        CopySource: Bucket + '-' + AppId + '.' + config.Region + '.myqcloud.com/1mb.zip',
    }, function (err, data) {
        console.log(err || data);
    });
}

function getObject() {
    cos.getObject({
        Bucket: config.Bucket,
        Region: config.Region,
        Key: '1mb.zip'
    }, function (err, data) {
        console.log(err || data);
    });
}

function headObject() {
    cos.headObject({
        Bucket: config.Bucket,
        Region: config.Region,
        Key: '1mb.zip'
    }, function (err, data) {
        console.log(err || data);
    });
}

function putObjectAcl() {
    cos.putObjectAcl({
        Bucket: config.Bucket,
        Region: config.Region,
        Key: '1mb.zip',
        // GrantFullControl: 'uin="1001", uin="1002"',
        // GrantWrite: 'uin="1001", uin="1002"',
        // GrantRead: 'uin="1001", uin="1002"',
        // ACL: 'public-read-write',
        // ACL: 'public-read',
        // ACL: 'private',
        AccessControlPolicy: {
            "Owner": {
                "ID": 'qcs::cam::uin/10001:uin/10001' // 10001 是 QQ 号
            },
            "Grants": [{
                "Grantee": {
                    "ID": "qcs::cam::uin/10002:uin/10002", // 10002 是 QQ 号
                },
                "Permission": "READ"
            }]
        }
    }, function (err, data) {
        console.log(err || data);
    });
}

function getObjectAcl() {
    cos.getObjectAcl({
        Bucket: config.Bucket,
        Region: config.Region,
        Key: '1mb.zip'
    }, function (err, data) {
        console.log(err || data);
    });
}

function deleteObject() {
    cos.deleteObject({
        Bucket: config.Bucket,
        Region: config.Region,
        Key: '1mb.zip'
    }, function (err, data) {
        console.log(err || data);
    });
}

function deleteMultipleObject() {
    cos.deleteMultipleObject({
        Bucket: config.Bucket,
        Region: config.Region,
        Objects: [
            {Key: '1mb.zip'},
            {Key: '3mb.zip'},
        ]
    }, function (err, data) {
        console.log(err || data);
    });
}

function abortUploadTask() {
    cos.abortUploadTask({
        Bucket: config.Bucket, /* 必须 */
        Region: config.Region, /* 必须 */
        // 格式1，删除单个上传任务
        // Level: 'task',
        // Key: '10mb.zip',
        // UploadId: '14985543913e4e2642e31db217b9a1a3d9b3cd6cf62abfda23372c8d36ffa38585492681e3',
        // 格式2，删除单个文件所有未完成上传任务
        Level: 'file',
        Key: '10mb.zip',
        // 格式3，删除 Bucket 下所有未完成上传任务
        // Level: 'bucket',
    }, function (err, data) {
        console.log(err || data);
    });
}

var TaskId;
function sliceUploadFile() {
    var blob = util.createFile({size: 1024 * 1024 * 10});
    cos.sliceUploadFile({
        Bucket: config.Bucket, /* 必须 */
        Region: config.Region,
        Key: '10mb.zip', /* 必须 */
        Body: blob,
        TaskReady: function (tid) {
            TaskId = tid;
        },
        onHashProgress: function (progressData) {
            console.log(JSON.stringify(progressData));
        },
        onProgress: function (progressData) {
            console.log(JSON.stringify(progressData));
        },
    }, function (err, data) {
        console.log(err || data);
    });
}

function cancelTask() {
    sliceUploadFile();
    setTimeout(function () {
        cos.cancelTask(TaskId);
        console.log('canceled');
    }, 2000);
}

function pauseTask() {
    sliceUploadFile();
    setTimeout(function () {
        cos.pauseTask(TaskId);
        console.log('paused');
        restartTask();
    }, 2000);
}

function restartTask() {
    setTimeout(function () {
        cos.restartTask(TaskId);
        console.log('restart');
    }, 4000);
}

// getService();
// getAuth();
// putBucket();
// getBucket();
// headBucket();
// putBucketAcl();
// getBucketAcl();
// putBucketCors();
// getBucketCors();
// deleteBucketCors();
// putBucketTagging();
// getBucketTagging();
// deleteBucketTagging();
// putBucketPolicy();
// getBucketPolicy();
// getBucketLocation();
// getBucketLifecycle();
// putBucketLifecycle();
// deleteBucketLifecycle();
// deleteBucket();
// putObject();
// putObjectCopy();
// getObject();
// headObject();
// putObjectAcl();
// getObjectAcl();
// deleteObject();
// deleteMultipleObject();
// abortUploadTask();
// sliceUploadFile();
// cancelTask();
// pauseTask();
// restartTask();


(function () {
    var list = [
        // 'getService',
        'getAuth',
        // 'putBucket',
        'getBucket',
        'headBucket',
        // 'putBucketAcl',
        // 'getBucketAcl',
        // 'putBucketCors',
        // 'getBucketCors',
        // 'deleteBucketCors',
        // 'putBucketTagging',
        // 'getBucketTagging',
        // 'deleteBucketTagging',
        // 'putBucketPolicy',
        // 'getBucketPolicy',
        // 'getBucketLocation',
        // 'getBucketLifecycle',
        // 'putBucketLifecycle',
        // 'deleteBucketLifecycle',
        'deleteBucket',
        'putObject',
        'putObjectCopy',
        'getObject',
        'headObject',
        // 'putObjectAcl',
        // 'getObjectAcl',
        'deleteObject',
        // 'deleteMultipleObject',
        // 'abortUploadTask',
        'sliceUploadFile',
        'cancelTask',
        'pauseTask',
        'restartTask',
    ];
    var container = document.querySelector('.main');
    var html = [];
    list.forEach(function (name) {
        html.push('<a href="javascript:void(0)">' + name + '</a>');
    });
    container.innerHTML = html.join('');
    container.onclick = function (e) {
        if (e.target.tagName === 'A') {
            var name = e.target.innerText.trim();
            window[name]();
        }
    };
})();
