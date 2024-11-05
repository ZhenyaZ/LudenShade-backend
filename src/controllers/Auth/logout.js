function Logout(req, res) {
  res.header('Access-Control-Allow-Credentials', 'true').clearCookie('refreshToken', {
    httpOnly: true,
  });
  res.header('Access-Control-Allow-Credentials', 'true').clearCookie('accessToken', {
    httpOnly: true,
  });
  res
    .header('Access-Control-Allow-Credentials', 'true')
    .header('Access-Control-Allow-Origin', process.env.URI)
    .status(200)
    .send({ message: 'Logout successful' });
}

module.exports = Logout;
