document.querySelectorAll('a[href^="#"]').forEach(anchor => {

anchor.addEventListener("click", function(e){

e.preventDefault();

document.querySelector(
this.getAttribute("href")
).scrollIntoView({
behavior:"smooth"
});

});

});

const counters = document.querySelectorAll('.counter');

counters.forEach(counter => {

const updateCounter = () => {

const target = +counter.getAttribute('data-target');

const count = +counter.innerText;

const increment = target / 100;

if(count < target){

counter.innerText =
Math.ceil(count + increment);

setTimeout(updateCounter,20);

}else{

counter.innerText = target;

}

};

updateCounter();

});
