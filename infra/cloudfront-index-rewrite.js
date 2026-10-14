function querySuffix(querystring) {
  var parts = [];
  var key;
  var entry;
  var values;
  var i;

  for (key in querystring) {
    if (!Object.prototype.hasOwnProperty.call(querystring, key)) {
      continue;
    }
    entry = querystring[key];
    values = entry.multiValue ? entry.multiValue : [{value: entry.value}];
    for (i = 0; i < values.length; i++) {
      if (values[i].value === undefined || values[i].value === null) {
        continue;
      }
      parts.push(encodeURIComponent(key) + '=' + encodeURIComponent(values[i].value));
    }
  }

  return parts.length ? '?' + parts.join('&') : '';
}

function handler(event) {
  var request = event.request;
  var hostHeader = request.headers['host'];
  var host = hostHeader ? hostHeader.value : '';

  if (host === 'archive.origemite.com') {
    return {
      statusCode: 301,
      statusDescription: 'Moved Permanently',
      headers: {
        location: {value: 'https://origemite.com' + request.uri + querySuffix(request.querystring)},
      },
    };
  }

  var uri = request.uri;

  if (uri.endsWith('/')) {
    request.uri += 'index.html';
  } else if (uri.indexOf('.') === -1) {
    request.uri += '/index.html';
  }

  return request;
}
