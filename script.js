const $ = (id) => document.getElementById(id);
const packageEl = $("package"), deliveryEl = $("delivery"), daysEl = $("days");
const startEl = $("startDate"), totalEl = $("total"), noteEl = $("discountNote");
const today = new Date();
const localISO = new Date(today.getTime() - today.getTimezoneOffset()*60000).toISOString().slice(0,10);
startEl.min = localISO;
$("year").textContent = new Date().getFullYear();

function calculate(){
  const days = Math.min(30, Math.max(1, Number(daysEl.value) || 0));
  daysEl.value = days;
  const rate = packageEl.value === "ps5_tv" ? 1000 : 700;
  const regular = rate * days;
  const freeDay = days >= 3 && regular >= 1800;
  const rental = regular - (freeDay ? rate : 0);
  const delivery = deliveryEl.value === "yes" ? 150 : 0;
  totalEl.textContent = (rental + delivery).toLocaleString("ru-RU") + " ₽";
  noteEl.textContent = freeDay ? "Акция применена: третий день бесплатно. Доставка считается отдельно." : "Третий день бесплатно при сумме аренды от 1 800 ₽ (без доставки).";
  return {days, rate, rental, delivery, total:rental+delivery, freeDay};
}
[packageEl, deliveryEl, daysEl].forEach(el=>el.addEventListener("input",calculate));
calculate();

$("bookingForm").addEventListener("submit", (event)=>{
  event.preventDefault();
  const phone = $("phone").value.trim();
  const start = startEl.value;
  const {days,total,freeDay} = calculate();
  if(!start || start < localISO){ $("formStatus").textContent="Выбери сегодняшнюю или будущую дату начала аренды."; return; }
  const end = new Date(start+"T12:00:00");
  end.setDate(end.getDate()+days);
  const endText = end.toLocaleDateString("ru-RU");
  const packageName = packageEl.value === "ps5_tv" ? "PS5 + телевизор" : "PS5";
  const deliveryName = deliveryEl.value === "yes" ? "Доставка (+150 ₽)" : "Самовывоз";
  const message = `Здравствуйте! Хочу оставить заявку на аренду Play Station Sulim.%0AТелефон: ${encodeURIComponent(phone)}%0AКомплект: ${encodeURIComponent(packageName)}%0AНачало: ${encodeURIComponent(new Date(start+"T12:00:00").toLocaleDateString("ru-RU"))}%0Окончание: ${encodeURIComponent(endText)}%0AПолучение: ${encodeURIComponent(deliveryName)}%0AДней: ${days}%0AСтоимость: ${total} ₽${freeDay?" (третий день бесплатно)":""}%0AКомментарий: ${encodeURIComponent($("comment").value.trim())}`;
  $("formStatus").textContent="Откроется приложение SMS. Отправь подготовленное сообщение владельцу; заявка будет подтверждена только после ответа.";
  window.location.href = `sms:89380235066?body=${message}`;
});

$("menuToggle").addEventListener("click",()=> $("nav").classList.toggle("open"));
document.querySelectorAll(".nav a").forEach(a=>a.addEventListener("click",()=> $("nav").classList.remove("open")));
const observer = new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add("visible");observer.unobserve(entry.target)}}),{threshold:.12});
document.querySelectorAll(".reveal").forEach(el=>observer.observe(el));


// Background music: playback starts only after the visitor taps the control.
const music = $("siteMusic");
const musicToggle = $("musicToggle");
const musicLabel = $("musicToggle") ? $("musicLabel") : null;
if (music && musicToggle) {
  music.volume = 0.72;
  musicToggle.addEventListener("click", async () => {
    if (music.paused) {
      try {
        await music.play();
        musicToggle.classList.add("is-playing");
        musicToggle.setAttribute("aria-pressed", "true");
        musicLabel.textContent = "Выключить музыку";
      } catch (error) {
        musicLabel.textContent = "Нажми ещё раз";
      }
    } else {
      music.pause();
      musicToggle.classList.remove("is-playing");
      musicToggle.setAttribute("aria-pressed", "false");
      musicLabel.textContent = "Включить музыку";
    }
  });
}
