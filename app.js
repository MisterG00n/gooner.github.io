/* Shared helpers. NOTE: no network requests (fetch/XHR) anywhere in this project. */
const SESSION_KEY = "demoSession"; // stores only a flag + display name, never a password
const DEMO_USER = "demo", DEMO_PASS = "demo123"; // public demo credentials, compared locally only

function isLoggedIn(){ try{ return sessionStorage.getItem(SESSION_KEY)==="1"; }catch(e){ return false; } }
function logout(){ try{ sessionStorage.removeItem(SESSION_KEY); }catch(e){} location.href="index.html"; }

/* Real login page (login.html) */
function initRealLogin(){
  const f=document.getElementById("loginForm"); if(!f) return;
  f.addEventListener("submit",e=>{
    e.preventDefault();
    const u=f.user.value.trim(), p=f.pass.value;
    f.pass.value="";                       // clear password immediately
    if(u===DEMO_USER && p===DEMO_PASS){
      try{ sessionStorage.setItem(SESSION_KEY,"1"); }catch(e){}
      location.href="dashboard.html";
    } else {
      document.getElementById("err").textContent="Sai tên đăng nhập hoặc mật khẩu (thử: demo / demo123).";
    }
  });
}

/* Dashboard guard */
function guardDashboard(){ if(!isLoggedIn()) location.replace("login.html"); }

/* Fake phishing page (phish-demo.html): the password is NEVER read, sent, or stored. */
function initPhishDemo(){
  const f=document.getElementById("phishForm"); if(!f) return;
  const modal=document.getElementById("warn");
  f.addEventListener("submit",e=>{
    e.preventDefault();
    f.reset();                              // wipe whatever was typed, without ever reading it
    modal.classList.add("open");
    modal.querySelector("button").focus();
  });
  document.getElementById("closeWarn").addEventListener("click",()=>modal.classList.remove("open"));
  document.addEventListener("keydown",e=>{ if(e.key==="Escape") modal.classList.remove("open"); });
}

/* URL / HTTPS quiz (quiz.html) */
const QUIZ=[
 {url:"https://login.safebank.example/signin",ok:true,why:"Tên miền gốc đúng (safebank.example), giao thức HTTPS, không ký tự lạ."},
 {url:"https://safebank.example.login-verify.top/signin",ok:false,why:"Tên miền thật là login-verify.top; 'safebank.example' chỉ là tên miền phụ đánh lừa."},
 {url:"http://safebank.example/signin",ok:false,why:"Dùng HTTP (không mã hóa): trình duyệt sẽ báo 'Không bảo mật'. Không nhập mật khẩu."},
 {url:"https://safebank-secure.example/signin",ok:false,why:"Thêm '-secure' tạo tên miền khác hoàn toàn. Hãy so khớp chính xác với tên miền chính thức."},
 {url:"https://safebаnk.example/signin",ok:false,why:"Chữ 'а' là ký tự Cyrillic trông giống chữ 'a' (homograph). Trình duyệt có thể hiển thị dạng xn--."},
 {url:"https://www.safebank.example/account",ok:true,why:"Tên miền con hợp lệ của safebank.example, dùng HTTPS."},
 {url:"https://safebank.example@203.0.113.9/signin",ok:false,why:"Phần trước '@' là thông tin người dùng; máy chủ thật là 203.0.113.9."}
];
function initQuiz(){
  const box=document.getElementById("quiz"); if(!box) return;
  let score=0, done=0;
  QUIZ.forEach((q,i)=>{
    const d=document.createElement("div"); d.className="quiz-q panel";
    const bar=document.createElement("div"); bar.className="url-bar"; bar.textContent=q.url; bar.style.background="var(--paper)"; bar.style.color="var(--ink)";
    const row=document.createElement("div"); row.className="row";
    const fb=document.createElement("div");
    [["An toàn",true],["Đáng ngờ",false]].forEach(([label,val])=>{
      const b=document.createElement("button"); b.className="btn ghost"; b.textContent=label;
      b.onclick=()=>{
        if(d.dataset.done) return; d.dataset.done="1"; done++;
        const right=(val===q.ok); if(right) score++;
        fb.className="fb "+(right?"ok":"bad");
        fb.textContent=(right?"Chính xác. ":"Chưa đúng. ")+q.why;
        row.querySelectorAll("button").forEach(x=>x.disabled=true);
        if(done===QUIZ.length) document.getElementById("score").textContent=`Kết quả: ${score}/${QUIZ.length} câu đúng.`;
      };
      row.appendChild(b);
    });
    d.append(bar,row,fb); box.appendChild(d);
  });
}
document.addEventListener("DOMContentLoaded",()=>{initRealLogin();initPhishDemo();initQuiz();
  if(document.body.dataset.guard) guardDashboard();
  const lo=document.getElementById("logoutBtn"); if(lo) lo.addEventListener("click",logout);});
