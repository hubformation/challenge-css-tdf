const template = themes => html`
	  <ul>
            ${themes.map(theme => html`
			<li><a href="${theme.urlCSS}">${theme.nomTheme}</a>
			  <span><span>par</span> <span>${theme.nomCreateur}</span></span>
			  </li>            
             `)}
       </ul>
`;

window.onload = () => {

      function switchTheme(event) {
            const target = document.getElementById('css');
            const src = event.target;
            console.log(target.href, "===>", src.href);
            target.href = src.href;
            event.preventDefault();

      }
      fetch("data/themes.json")
            .then(response => response.json())
            .then(themes => { 
                  const themesList = document.getElementById('liste-themes');
                  themesList.innerHTML = template(themes);
                  return themesList.querySelectorAll('ul li a');
            })
            .then(themeListLinks => {
                  for (link of themeListLinks) {
                        link.addEventListener('click',switchTheme);
                  }

            })
            .catch(error => { console.log(error) })
}
