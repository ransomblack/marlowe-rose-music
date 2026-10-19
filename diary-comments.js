(()=>{"use strict";
const root=document.querySelector(".marlowe-comments");if(!root)return;
const entryId=root.dataset.entryId,base="https://tanpkisnsffagsxulqfy.supabase.co/functions/v1/";
const list=root.querySelector(".marlowe-comment-list"),form=root.querySelector("form"),status=root.querySelector(".marlowe-comment-status");
let token="";
window.marloweCommentVerified=value=>{token=value};
window.marloweCommentExpired=()=>{token=""};
const el=(tag,cls,txt)=>{const node=document.createElement(tag);if(cls)node.className=cls;if(txt!==undefined)node.textContent=txt;return node};
async function refresh(){
 try{
  const response=await fetch(base+"diary-comments-list?entry_id="+encodeURIComponent(entryId));
  if(!response.ok)throw Error("Could not load comments");
  const result=await response.json();list.replaceChildren();
  const comments=Array.isArray(result.comments)?result.comments:[];
  if(!comments.length){list.textContent="No comments yet. Be the first to leave one.";return}
  for(const comment of comments.filter(c=>!c.parent_id)){
   const item=el("article","marlowe-comment-item");
   item.append(el("strong","",comment.is_marlowe?"Marlowe Rose":comment.author_name),el("span","marlowe-comment-date"," · "+new Date(comment.created_at).toLocaleDateString()),el("p","",comment.comment_text));
   for(const reply of comments.filter(c=>c.parent_id===comment.id)){
    const nested=el("div","marlowe-comment-reply");
    nested.append(el("strong","",reply.is_marlowe?"Marlowe Rose":reply.author_name),el("p","",reply.comment_text));
    item.append(nested);
   }
   list.append(item);
  }
 }catch{list.textContent="Comments are temporarily unavailable."}
}
form.addEventListener("submit",async event=>{
 event.preventDefault();if(!token){status.textContent="Please complete the verification first.";return}
 const button=form.querySelector("button");button.disabled=true;status.textContent="Posting…";
 try{
  const response=await fetch(base+"diary-comment-submit",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({entry_id:entryId,author_name:form.elements.author_name.value,comment_text:form.elements.comment_text.value,turnstile_token:token})});
  const data=await response.json();if(!response.ok)throw Error(data.error||"Could not post comment");
  status.textContent="Your comment is published. Thank you!";form.elements.comment_text.value="";await refresh();
 }catch(error){status.textContent=error.message||"Could not post comment"}
 finally{button.disabled=false;token="";if(window.turnstile)window.turnstile.reset()}
});
refresh();
})();