const http = require('http');

function req(path, method='GET', body=null, token=null){
  const options = {
    hostname: 'localhost',
    port: 4000,
    path,
    method,
    headers: {
      'Content-Type': 'application/json'
    }
  };
  if (token) options.headers['Authorization'] = `Bearer ${token}`;
  return new Promise((resolve, reject)=>{
    const r = http.request(options, res=>{
      let data='';
      res.on('data', chunk=>data+=chunk);
      res.on('end', ()=>{
        try{ const json = JSON.parse(data); resolve({status:res.statusCode, body:json}); }
        catch(e){ resolve({status:res.statusCode, body:data}); }
      });
    });
    r.on('error', reject);
    if (body) r.write(JSON.stringify(body));
    r.end();
  });
}

(async()=>{
  try{
    console.log('Checking root');
    console.log(await req('/'));

    const user = { username: 'smoketest_node', email: 'smoketest_node@example.com', password: 'Password123!' };
    console.log('Registering...');
    let reg = await req('/api/auth/register','POST', user);
    if (reg.status !== 200){
      console.log('Register failed, trying login...', reg.status, reg.body);
      const login = await req('/api/auth/login','POST', { email: user.email, password: user.password });
      if (login.status !== 200) throw new Error('Login failed: '+ JSON.stringify(login));
      token = login.body.token;
    } else {
      token = reg.body.token;
    }
    console.log('Token obtained:', typeof token === 'string');

    console.log('Creating post...');
    const post = await req('/api/posts','POST',{title:'SmokeTest Node Post', content:'Created by smoke_test.js', tags:['smoke','node']}, token);
    console.log('Post create result:', post.status, post.body);
    const postId = post.body._id || (post.body && post.body.post && post.body.post._id);
    if (!postId) throw new Error('No post id returned');

    console.log('Fetching post...');
    const fetched = await req('/api/posts/'+postId);
    console.log('Fetched:', fetched.status, fetched.body);

    console.log('SMOKE TEST SUCCESS');
  }catch(err){
    console.error('SMOKE TEST ERROR', err);
    process.exit(1);
  }
})();
