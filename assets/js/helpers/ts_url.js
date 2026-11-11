function ts_url(path = '') {
    return TS_BASE_PATH.replace(/\/$/, '') + '/' + path.replace(/^\/+/, '');
}