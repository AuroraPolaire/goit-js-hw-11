let t=0,e=0;window.addEventListener("scroll",(function(){const o=document.querySelector(".form__container"),n=o.offsetHeight,i=window.pageYOffset,s=e-i;t=Math.min(0,Math.max(-n,t+s)),o.style.position=i>=n?"fixed":0===i?"absolute":o.style.position,o.style.transform=`translateY(${"fixed"===o.style.position?t:0}px)`,e=i}));
//# sourceMappingURL=index.fb5a8ab2.js.map
