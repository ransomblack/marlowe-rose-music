const menu=document.querySelector('.menu-button');const nav=document.querySelector('.nav');menu?.addEventListener('click',()=>{const open=nav.classList.toggle('open');menu.setAttribute('aria-expanded',open)});document.querySelectorAll('.nav a').forEach(a=>a.addEventListener('click',()=>nav.classList.remove('open')));const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting)e.target.classList.add('visible')}),{threshold:.12});document.querySelectorAll('.reveal').forEach(el=>io.observe(el));

const leavePageForm = document.querySelector('#leave-page-form');
if (leavePageForm) {
  const status = document.querySelector('#leave-page-status');
  const button = leavePageForm.querySelector('button[type="submit"]');

  leavePageForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const message = leavePageForm.querySelector('textarea[name="message"]');
    if (!message.value.trim()) {
      status.textContent = 'Write a little something before you leave the page.';
      message.focus();
      return;
    }

    button.disabled = true;
    button.textContent = 'leaving your page…';
    status.textContent = 'Sending…';

    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: new FormData(leavePageForm)
      });
      const result = await response.json();

      if (!response.ok || !result.success) throw new Error(result.message || 'Submission failed');

      leavePageForm.reset();
      status.textContent = 'Your page has been left. 🌹';
      button.textContent = 'page left ✓';
      setTimeout(() => {
        button.textContent = 'leave a page →';
        button.disabled = false;
      }, 3500);
    } catch (error) {
      status.textContent = 'That page didn’t make it through. Please try again.';
      button.textContent = 'leave a page →';
      button.disabled = false;
    }
  });
}


const albumLightbox = document.querySelector('#album-lightbox');
if (albumLightbox) {
  const lightboxImage = albumLightbox.querySelector('figure img');
  const lightboxCaption = albumLightbox.querySelector('figcaption');
  const closeLightbox = () => {
    albumLightbox.hidden = true;
    document.body.classList.remove('lightbox-open');
    lightboxImage.src = '';
  };
  document.querySelectorAll('.album-photo-button').forEach(button => {
    button.addEventListener('click', () => {
      lightboxImage.src = button.dataset.albumImage;
      lightboxImage.alt = button.dataset.albumCaption || 'Marlowe Rose photo';
      lightboxCaption.textContent = button.dataset.albumCaption || '';
      albumLightbox.hidden = false;
      document.body.classList.add('lightbox-open');
    });
  });
  albumLightbox.querySelector('.album-lightbox-close').addEventListener('click', closeLightbox);
  albumLightbox.querySelector('.album-lightbox-backdrop').addEventListener('click', closeLightbox);
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && !albumLightbox.hidden) closeLightbox();
  });
}

const scrapbook=document.querySelector('#scrapbook');
if(scrapbook){
 const cover=document.querySelector('#scrapbook-cover'), openBook=document.querySelector('#scrapbook-open'), scroll=document.querySelector('#album-scroll'), prev=document.querySelector('.book-prev'), next=document.querySelector('.book-next'), count=document.querySelector('.book-page-count'), close=document.querySelector('.close-book');
 const pages=[...scroll.querySelectorAll('.scrap-page')];
 const perView=()=>window.innerWidth<=800?1:2;
 const update=()=>{const page=Math.round(scroll.scrollLeft/(scroll.clientWidth/perView()))+1; const spread=Math.ceil(page/perView()); const total=Math.ceil(pages.length/perView()); count.textContent=spread+' / '+total;};
 cover.addEventListener('click',()=>{scrapbook.classList.add('open');openBook.setAttribute('aria-hidden','false');setTimeout(update,50)});
 close.addEventListener('click',()=>{scrapbook.classList.remove('open');openBook.setAttribute('aria-hidden','true');scroll.scrollLeft=0});
 next.addEventListener('click',()=>scroll.scrollBy({left:scroll.clientWidth,behavior:'smooth'}));
 prev.addEventListener('click',()=>scroll.scrollBy({left:-scroll.clientWidth,behavior:'smooth'}));
 scroll.addEventListener('scroll',()=>requestAnimationFrame(update)); window.addEventListener('resize',update);
}

function initScrapbook(shellId,coverId,openId,scrollId,closeSelector,prevSelector,nextSelector,countSelector){
 const shell=document.querySelector(shellId); if(!shell)return;
 const cover=document.querySelector(coverId),open=document.querySelector(openId),scroll=document.querySelector(scrollId),close=document.querySelector(closeSelector),prev=document.querySelector(prevSelector),next=document.querySelector(nextSelector),count=document.querySelector(countSelector),pages=[...scroll.querySelectorAll('.scrap-page')];
 const perView=()=>window.innerWidth<=800?1:2;
 const update=()=>{const p=Math.round(scroll.scrollLeft/(scroll.clientWidth/perView()))+1;count.textContent=Math.ceil(p/perView())+' / '+Math.ceil(pages.length/perView());};
 cover.addEventListener('click',()=>{shell.classList.add('open');open.setAttribute('aria-hidden','false');setTimeout(update,50)});
 close.addEventListener('click',()=>{shell.classList.remove('open');open.setAttribute('aria-hidden','true');scroll.scrollLeft=0});
 next.addEventListener('click',()=>scroll.scrollBy({left:scroll.clientWidth,behavior:'smooth'}));prev.addEventListener('click',()=>scroll.scrollBy({left:-scroll.clientWidth,behavior:'smooth'}));scroll.addEventListener('scroll',()=>requestAnimationFrame(update));window.addEventListener('resize',update);
}
initScrapbook('#community-scrapbook','#community-cover','#community-open','#community-scroll','.close-community-book','.community-prev','.community-next','.community-page-count');

const photoToggle=document.querySelector('#leave-photo-toggle'),photoPanel=document.querySelector('#photo-submit-panel'),photoForm=document.querySelector('#photo-submit-form');
if(photoToggle&&photoPanel){photoToggle.addEventListener('click',()=>{photoPanel.hidden=!photoPanel.hidden;photoToggle.textContent=photoPanel.hidden?'leave a photo →':'close form ×';if(!photoPanel.hidden)photoPanel.scrollIntoView({behavior:'smooth',block:'start'});});}
if(photoForm){
  const button=photoForm.querySelector('button[type=submit]');
  const successCard=document.querySelector('#photo-success-card');
  const error=document.querySelector('#photo-form-error');

  photoForm.addEventListener('submit',()=>{
    button.disabled=true;
    button.textContent='sending…';
    if(successCard)successCard.hidden=true;
  });

  document.addEventListener('basinjsFormSuccess',event=>{
    if(event.detail.form!==photoForm)return;
    photoForm.reset();
    photoPanel.hidden=true;
    photoToggle.textContent='leave a photo →';
    button.textContent='send my photo →';
    button.disabled=false;
    if(successCard){
      successCard.hidden=false;
      successCard.scrollIntoView({behavior:'smooth',block:'center'});
      setTimeout(()=>{
        successCard.hidden=true;
        photoToggle.scrollIntoView({behavior:'smooth',block:'center'});
      },5000);
    }
  });

  document.addEventListener('basinjsFormError',event=>{
    if(event.detail.form!==photoForm)return;
    button.textContent='send my photo →';
    button.disabled=false;
    photoToggle.textContent='close form ×';
    if(error)error.style.display='block';
  });
}
