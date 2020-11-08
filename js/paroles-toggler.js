function paroleTogglerManager () {
    function paroleToggler(event) {
        const parolesDiv = document.getElementById('paroles');
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