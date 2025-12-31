export function json(res, data, status = 200) {
  res.status(status).json(data);
}

export function error(res, message = "", status = 400) {
  json(res, { success: false, error: message }, status);
}
