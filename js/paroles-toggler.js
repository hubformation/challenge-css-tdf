window.onload = function () {
    function paroleToggler(event) {
        const parolesDiv = document.getElementById('paroles');
        console.log(Array.from(parolesDiv.classList).join(','))
        if (parolesDiv.classList.contains('hidden')) {
            event.target.innerHTML = 'Garder seulement le début';
            parolesDiv.classList.remove('hidden');
        }
        else {
            event.target.innerHTML = 'Montrer les paroles complètes';
            parolesDiv.classList.add('hidden');
        }
        event.stopPropagation();
    }
    const parolesTogglerBtn = document.getElementById('parolesTogglerBtn');
    parolesTogglerBtn.addEventListener('click', paroleToggler);
}