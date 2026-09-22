export const themeStorageKey = "theme";

export const themeScript = `(function(){var t='system';try{var s=localStorage.getItem('${themeStorageKey}');if(s==='light'||s==='dark'||s==='system')t=s}catch(e){}var d=matchMedia('(prefers-color-scheme: dark)').matches;var r=t==='system'?(d?'dark':'light'):t;var e=document.documentElement;e.dataset.theme=t;e.classList.add(r);e.style.colorScheme=r})();`;
