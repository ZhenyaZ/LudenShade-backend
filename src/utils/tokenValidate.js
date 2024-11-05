const jsonwebtoken = require('jsonwebtoken');

module.exports = async (req, res, next) => {
  let newAccessToken;

  const refreshToken = jsonwebtoken.verify(req.cookies.refreshToken, process.env.JWT_REFRESH_KEY, (err, decoded) => {
    if (err && !res.finished) {
      switch (err.name) {
        case 'TokenExpiredError':
          return res
            .header('Access-Control-Allow-Origin', process.env.URI)
            .status(401)
            .send({ error: 'Session expired, please login again', type: 'tokenError' })
            .end();

        case 'JsonWebTokenError':
          return res
            .header('Access-Control-Allow-Origin', process.env.URI)
            .status(401)
            .send({ error: 'Invalid token, please login again', type: 'tokenError' })
            .end();
      }
    } else {
      return decoded;
    }
  });

  const accessToken = jsonwebtoken.verify(req.cookies.accessToken, process.env.JWT_ACCESS_KEY, (err, decoded) => {
    if (err) {
      if (!res.finished) {
        switch (err.name) {
          case 'TokenExpiredError':
            newAccessToken = jsonwebtoken.sign({ user_login: req.query.user_login }, process.env.JWT_ACCESS_KEY, {
              expiresIn: 900,
            });
            res
              .header('Access-Control-Allow-Origin', process.env.URI)
              .cookie('accessToken', newAccessToken, {
                httpOnly: true,
                secure: true,
                maxAge: 24 * 60 * 60 * 1000,
                sameSite: 'None',
              })
              .status(200)
              .send({ message: 'Please retry your request', type: 'refresh' })
              .end();

          case 'JsonWebTokenError':
            if (!res.finished) {
              return res
                .header('Access-Control-Allow-Origin', process.env.URI)
                .status(401)
                .send({ error: 'Invalid Access token, please login again', type: 'tokenError' })
                .end();
            }
        }
      }
    } else {
      return decoded;
    }
  });
  if (accessToken && refreshToken && accessToken.user_login === refreshToken.user_login) {
    next();
  } else {
    return;
  }
};
