
/**
 * Homepage
 */
function index(req, res, next) {
  // res.send('Welcome!!!');
  res.render('home/index', {
    title: 'Welcome'
  });
}


export default { index };
