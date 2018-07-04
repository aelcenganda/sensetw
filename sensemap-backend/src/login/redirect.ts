import { context } from '../context';

export function passLoggedIn() {
  return (req, res, next) => {
    if (!!req.user) {
      if (req.query.next) {
        return res.redirect(req.query.next);
      } else {
        return res.redirect('/login-success');
      }
    }
    return next();
  };
}

export function requireLoggedIn() {
  return (req, res, next) => {
    const { env } = context({ req });
    if (!req.user) {
      return res.redirect(`/login?next=${encodeURIComponent(env.PUBLIC_URL + req.originalUrl)}`);
    }
    return next();
  };
}