const selectElement = document.querySelectorAll('.selectCustom');
const confirmBtn = document.getElementById('confirm-btn')

selectElement.forEach(select => {
    const applyOptionStyling = () => {
        const selectedOption = select.options[select.selectedIndex];
        if (selectedOption.value === "0") {
            select.classList.add('select-text-color');
        } else {
            select.classList.remove('select-text-color');
        }
    };

    const optionRequired = () => {

    }

    confirmBtn.addEventListener('click', optionRequired)
    select.addEventListener('change', applyOptionStyling);

    applyOptionStyling();
});

selectClass = document.querySelectorAll('.select')

selectClass.forEach(select => {
    select.addEventListener('click', () => {
        select.classList.toggle('caret-rotate')
    })
})

const descriptionGuide = document.querySelector('.description-guide');
function hideDescriptionGuide() {
    descriptionGuide.classList.add('hide')
}

function activeDescriptionGuide() {
    descriptionGuide.classList.remove('hide')
}

