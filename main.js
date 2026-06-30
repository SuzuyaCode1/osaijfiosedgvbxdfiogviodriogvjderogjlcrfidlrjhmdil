document.addEventListener('DOMContentLoaded',function(){
  const toggle = document.getElementById('nav-toggle');
  const nav = document.getElementById('nav');
  toggle.addEventListener('click',()=>{
    nav.classList.toggle('open');
  });

  // Smooth scroll for internal links
  document.querySelectorAll('a[href^="#"]').forEach(a=>{
    a.addEventListener('click',function(e){
      const href = this.getAttribute('href');
      if(href.length>1){
        e.preventDefault();
        const el = document.querySelector(href);
        if(el) el.scrollIntoView({behavior:'smooth',block:'start'});
        nav.classList.remove('open');
      }
    });
  });

  // Likes / Dislikes functionality
  const getKey = (type,id) => `portfolio_${type}_${id}`;

  const updateCounts = (id)=>{
    const likeBtn = document.querySelector(`.like-btn[data-id="${id}"]`);
    const dislikeBtn = document.querySelector(`.dislike-btn[data-id="${id}"]`);
    if(!likeBtn || !dislikeBtn) return;
    const likes = parseInt(localStorage.getItem(getKey('likes',id)) || '0',10);
    const dislikes = parseInt(localStorage.getItem(getKey('dislikes',id)) || '0',10);
    likeBtn.querySelector('.vote-count').textContent = likes;
    dislikeBtn.querySelector('.vote-count').textContent = dislikes;
    // active state if user previously liked/disliked
    if(localStorage.getItem(getKey('user_vote',id)) === 'like'){
      likeBtn.classList.add('active');
      dislikeBtn.classList.remove('active');
    } else if(localStorage.getItem(getKey('user_vote',id)) === 'dislike'){
      dislikeBtn.classList.add('active');
      likeBtn.classList.remove('active');
    } else {
      likeBtn.classList.remove('active');
      dislikeBtn.classList.remove('active');
    }
  };

  const allIds = new Set();
  document.querySelectorAll('.like-btn, .dislike-btn').forEach(btn=> allIds.add(btn.dataset.id));
  allIds.forEach(id=> updateCounts(id));

  document.body.addEventListener('click', e=>{
    const like = e.target.closest('.like-btn');
    const dislike = e.target.closest('.dislike-btn');
    if(like){
      const id = like.dataset.id;
      const userVoteKey = getKey('user_vote',id);
      const likesKey = getKey('likes',id);
      const dislikesKey = getKey('dislikes',id);
      const prev = localStorage.getItem(userVoteKey);
      if(prev === 'like'){
        // undo like
        localStorage.setItem(likesKey, Math.max(0, parseInt(localStorage.getItem(likesKey)||'0',10)-1));
        localStorage.removeItem(userVoteKey);
      } else {
        // add like, remove dislike if existed
        localStorage.setItem(likesKey, parseInt(localStorage.getItem(likesKey)||'0',10)+1);
        if(prev === 'dislike'){
          localStorage.setItem(dislikesKey, Math.max(0, parseInt(localStorage.getItem(dislikesKey)||'0',10)-1));
        }
        localStorage.setItem(userVoteKey,'like');
      }
      updateCounts(id);
    }
    if(dislike){
      const id = dislike.dataset.id;
      const userVoteKey = getKey('user_vote',id);
      const likesKey = getKey('likes',id);
      const dislikesKey = getKey('dislikes',id);
      const prev = localStorage.getItem(userVoteKey);
      if(prev === 'dislike'){
        // undo dislike
        localStorage.setItem(dislikesKey, Math.max(0, parseInt(localStorage.getItem(dislikesKey)||'0',10)-1));
        localStorage.removeItem(userVoteKey);
      } else {
        // add dislike, remove like if existed
        localStorage.setItem(dislikesKey, parseInt(localStorage.getItem(dislikesKey)||'0',10)+1);
        if(prev === 'like'){
          localStorage.setItem(likesKey, Math.max(0, parseInt(localStorage.getItem(likesKey)||'0',10)-1));
        }
        localStorage.setItem(userVoteKey,'dislike');
      }
      updateCounts(id);
    }
  });

  // Reveal animation for work cards using IntersectionObserver
  const observer = new IntersectionObserver((entries)=>{
    entries.forEach(entry=>{
      if(entry.isIntersecting){
        entry.target.classList.add('revealed');
      }
    });
  },{threshold:0.15});
  document.querySelectorAll('.work-card').forEach(card=> observer.observe(card));

  // small click animation for vote buttons
  document.querySelectorAll('.vote-btn').forEach(btn=>{
    btn.addEventListener('click',()=>{
      btn.animate([{transform:'scale(1)'},{transform:'scale(1.06)'},{transform:'scale(1)'}],{duration:220,easing:'ease-out'});
    });
  });
});
