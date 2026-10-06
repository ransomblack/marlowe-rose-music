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
