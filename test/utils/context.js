module.exports = function () {
  let done;
  let res;
  const p = new Promise((resolve, reject) => (done = () => resolve(res)));
  p.done = done;
  p.log = console.log;
  Object.defineProperty(p, 'res', { set(val) { res = val; } });
  return p;
};
