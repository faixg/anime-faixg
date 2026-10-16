const animeData = [
  {id:1,title:"Атака титанов",english:"Attack on Titan",year:2013,episodes:"4 сезона",rating:9.1,genres:["Экшен","Драма"],glyph:"進",label:"THE WALL",bg:"#21151d",glow:"#d52d56",description:"Человечество прячется за огромными стенами, пытаясь выжить в мире, где за их пределами бродят титаны. История о свободе, страхе и цене правды."},
  {id:2,title:"Берсерк",english:"Berserk",year:1997,episodes:"25 серий",rating:8.7,genres:["Экшен","Фэнтези","Драма"],glyph:"烙",label:"DARK FANTASY",bg:"#17141d",glow:"#8740a8",description:"Мрачное тёмное фэнтези о наёмнике Гатсе, судьбе и борьбе человека с жестоким миром. В этом демо карточка представлена как стилизованная заглушка."},
  {id:3,title:"Магическая битва",english:"Jujutsu Kaisen",year:2020,episodes:"2 сезона",rating:8.6,genres:["Экшен","Сёнэн"],glyph:"呪",label:"CURSED ENERGY",bg:"#101a2c",glow:"#3867ff",description:"Юдзи Итадори оказывается втянут в мир проклятий и магов после опасной встречи с древним артефактом. Динамичные сражения, команда и тёмная атмосфера."},
  {id:4,title:"Ван-Пис",english:"One Piece",year:1999,episodes:"1000+ серий",rating:9.0,genres:["Приключения","Сёнэн"],glyph:"海",label:"THE GRAND LINE",bg:"#10252c",glow:"#2cb7c4",description:"Монки Д. Луффи и его команда отправляются в большое путешествие по морям в поисках легендарного сокровища. История о дружбе, мечтах и свободе."},
  {id:5,title:"Вайолет Эвергарден",english:"Violet Evergarden",year:2018,episodes:"13 серий",rating:8.5,genres:["Драма"],glyph:"愛",label:"LETTERS & FEELINGS",bg:"#26202d",glow:"#b28ae5",description:"Бывшая солдатка учится понимать чувства людей, работая автором писем. Тихая, эмоциональная история о памяти, словах и поиске себя."},
  {id:6,title:"Клинок, рассекающий демонов",english:"Demon Slayer",year:2019,episodes:"4 сезона",rating:8.7,genres:["Экшен","Фэнтези","Сёнэн"],glyph:"滅",label:"BLADE OF DESTINY",bg:"#291819",glow:"#ed713e",description:"Тандзиро вступает в отряд охотников на демонов, чтобы защитить людей и помочь своей сестре. Яркие бои, сильные эмоции и японский фольклор."},
  {id:7,title:"Поднятие уровня в одиночку",english:"Solo Leveling",year:2024,episodes:"2 сезона",rating:8.8,genres:["Экшен","Фэнтези"],glyph:"影",label:"LEVEL UP",bg:"#101629",glow:"#4c71ff",description:"В мире охотников Сон Джин-у получает необычную возможность становиться сильнее после каждого испытания. История роста, риска и силы воли."},
  {id:8,title:"Охотник х Охотник",english:"Hunter × Hunter",year:2011,episodes:"148 серий",rating:9.0,genres:["Приключения","Сёнэн"],glyph:"狩",label:"HUNTER EXAM",bg:"#14251e",glow:"#44ba82",description:"Гон отправляется на экзамен охотников, чтобы найти отца. На пути его ждут друзья, непростые испытания и большой мир, полный тайн."}
];
const $ = s => document.querySelector(s);
const grid = $("#animeGrid"), favGrid = $("#favoritesGrid");
let favorites = new Set(JSON.parse(localStorage.getItem("animeFaixgFavorites") || "[]"));
let activeGenre = "all", searchText = "", sortMode = "featured", modalAnime = null, toastTimer;
const safeText = value => String(value).replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
function cardMarkup(a){
  const saved = favorites.has(a.id);
  return `<article class="anime-card" data-id="${a.id}" tabindex="0" role="button" aria-label="Подробнее: ${safeText(a.title)}">
    <div class="poster" style="--poster-bg:${a.bg};--poster-glow:${a.glow}">
      <span class="poster-glyph">${a.glyph}</span><span class="poster-label">${a.label}</span><span class="poster-number">AF / ${String(a.id).padStart(2,"0")}</span>
      <button class="favorite-btn ${saved?"saved":""}" data-fav="${a.id}" aria-label="${saved?"Убрать из избранного":"Добавить в избранное"}">${saved?"♥":"♡"}</button>
    </div>
    <div class="card-body"><div class="card-topline"><span class="card-year">${a.year} · ${a.episodes}</span><span class="rating">★ ${a.rating.toFixed(1)}</span></div>
      <h3 class="card-title" title="${safeText(a.title)}">${safeText(a.title)}</h3>
      <div class="card-tags">${a.genres.slice(0,2).map(g=>`<span class="tag">${g}</span>`).join("")}</div>
      <div class="card-bottom"><b>Открыть описание</b><span class="card-arrow">↗</span></div>
    </div></article>`;
}
function getFiltered(){
  let items = animeData.filter(a => (activeGenre==="all" || a.genres.includes(activeGenre)) && (a.title+" "+a.english).toLowerCase().includes(searchText.toLowerCase()));
  if(sortMode==="rating") items.sort((a,b)=>b.rating-a.rating);
  else if(sortMode==="az") items.sort((a,b)=>a.title.localeCompare(b.title,"ru"));
  else items.sort((a,b)=>Number(favorites.has(b.id))-Number(favorites.has(a.id)) || a.id-b.id);
  return items;
}
function render(){
  const items=getFiltered();
  grid.innerHTML=items.map(cardMarkup).join("");
  $("#resultsLabel").textContent=`${items.length} ${items.length===1?"тайтл":items.length>=2&&items.length<=4?"тайтла":"тайтлов"}`;
  $("#emptyState").classList.toggle("hidden",items.length!==0);
  $("#animeGrid").classList.toggle("hidden",items.length===0);
  const favs=animeData.filter(a=>favorites.has(a.id));
  favGrid.innerHTML=favs.map(cardMarkup).join("");
  $("#favoritesEmpty").classList.toggle("hidden",favs.length>0);
  $("#favoritesGrid").classList.toggle("hidden",favs.length===0);
  $("#favCount").textContent=favorites.size;
}
function toast(message){const el=$("#toast");el.textContent=message;el.classList.add("show");clearTimeout(toastTimer);toastTimer=setTimeout(()=>el.classList.remove("show"),2200)}
function toggleFavorite(id){
  if(favorites.has(id)){favorites.delete(id);toast("Удалено из избранного");}
  else {favorites.add(id);toast("Добавлено в избранное ♥");}
  localStorage.setItem("animeFaixgFavorites",JSON.stringify([...favorites]));render();
  if(modalAnime&&modalAnime.id===id) updateModalFavorite();
}
function openModal(id){
  const a=animeData.find(x=>x.id===id);if(!a)return;modalAnime=a;
  $("#modalArt").style.setProperty("--poster-bg",a.bg);$("#modalArt").style.setProperty("--poster-glow",a.glow);$("#modalArt").innerHTML=`<span>${a.glyph}</span>`;
  $("#modalTags").innerHTML=a.genres.map(g=>`<span class="tag">${g}</span>`).join("");
  $("#modalTitle").textContent=a.title;$("#modalMeta").textContent=`★ ${a.rating.toFixed(1)}  ·  ${a.year}  ·  ${a.episodes}  ·  ${a.english}`;
  $("#modalDescription").textContent=a.description;updateModalFavorite();
  $("#animeModal").classList.remove("hidden");document.body.style.overflow="hidden";$("#modalClose").focus();
}
function updateModalFavorite(){if(!modalAnime)return;const saved=favorites.has(modalAnime.id);$("#modalFavorite").textContent=saved?"♥ Убрать из избранного":"♡ Добавить в избранное";}
function closeModal(){$("#animeModal").classList.add("hidden");document.body.style.overflow="";modalAnime=null}
function resetFilters(){activeGenre="all";searchText="";sortMode="featured";$("#searchInput").value="";$("#genreSelect").value="all";$("#sortSelect").value="featured";document.querySelectorAll(".chip").forEach(c=>c.classList.toggle("active",c.dataset.genre==="all"));render()}
$("#searchInput").addEventListener("input",e=>{searchText=e.target.value;render()});
$("#genreSelect").addEventListener("change",e=>{activeGenre=e.target.value;document.querySelectorAll(".chip").forEach(c=>c.classList.toggle("active",c.dataset.genre===activeGenre));render()});
$("#sortSelect").addEventListener("change",e=>{sortMode=e.target.value;render()});
$("#genreChips").addEventListener("click",e=>{const chip=e.target.closest("[data-genre]");if(!chip)return;activeGenre=chip.dataset.genre;$("#genreSelect").value=activeGenre;document.querySelectorAll(".chip").forEach(c=>c.classList.toggle("active",c===chip));render()});
document.addEventListener("click",e=>{
  const fav=e.target.closest("[data-fav]");if(fav){e.stopPropagation();toggleFavorite(Number(fav.dataset.fav));return}
  const card=e.target.closest(".anime-card");if(card){openModal(Number(card.dataset.id));return}
  if(e.target.dataset.close==="true")closeModal();
});
document.addEventListener("keydown",e=>{
  if(e.key==="Escape")closeModal();
  if((e.metaKey||e.ctrlKey)&&e.key.toLowerCase()==="k"){e.preventDefault();$("#searchInput").focus()}
  if((e.key==="Enter"||e.key===" ")&&e.target.matches(".anime-card")){e.preventDefault();openModal(Number(e.target.dataset.id))}
});
$("#modalClose").addEventListener("click",closeModal);
$("#modalFavorite").addEventListener("click",()=>{if(modalAnime)toggleFavorite(modalAnime.id)});
$("#randomBtn").addEventListener("click",()=>{const items=getFiltered();const chosen=items[Math.floor(Math.random()*items.length)];if(chosen)openModal(chosen.id);else toast("Сначала сбрось фильтры")});
$("#resetBtn").addEventListener("click",resetFilters);
$("#themeBtn").addEventListener("click",()=>{document.body.classList.toggle("alt-accent");toast(document.body.classList.contains("alt-accent")?"Фиолетовый акцент включён":"Красный акцент включён")});
$("#mobileMenuBtn").addEventListener("click",()=>{const nav=$("#mobileNav"),open=nav.classList.toggle("open");$("#mobileMenuBtn").setAttribute("aria-expanded",String(open));$("#mobileMenuBtn").textContent=open?"×":"☰"});
$("#mobileNav").addEventListener("click",e=>{if(e.target.closest("a")){$("#mobileNav").classList.remove("open");$("#mobileMenuBtn").setAttribute("aria-expanded","false");$("#mobileMenuBtn").textContent="☰"}});
render();
