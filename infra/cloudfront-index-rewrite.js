function handler(event) {
  var request = event.request;
  var hostHeader = request.headers['host'];
  var host = hostHeader ? hostHeader.value : '';

  if (host === 'archive.origemite.com') {
    return {
      statusCode: 301,
      statusDescription: 'Moved Permanently',
      headers: {
        location: {value: 'https://origemite.com' + request.uri},
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
