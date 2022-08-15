let files;
let currSection = "";
const hostURL = 'https://api.jsonbin.io/v3/b/62fa3b83a1610e6386ff2396/';

const loadContent = async () => {

    let coursesSections = ["data-science", "drawing", "aws", "excel", "js", "python", "web-dev"];
    
    let response = await fetch(hostURL);
    files = await response.json()

    const container = document.querySelector('.courses-cards');
    container.innerHTML = '';

    loadCourses(coursesSections, container);
} 

function loadCourses(coursesSection, container){
    container.innerHTML = '';

    for(let file of coursesSection){
        files['record'][file].courses.forEach(element => {
            let inst = '';

            element.instructors.forEach(instructor => {
                inst += instructor.name + ', ';
            });
            
            inst = inst.slice(0, -1);

            const child = `
            <article class="course-card">
            <!-- course image -->
            <figure>
                <img src="${element.image}">
            </figure>
            <!-- course info -->
            <section class="card-info">
                <!-- course title -->
                <h2>${element.title}</h2>

                <!-- author -->
                <p>${inst}</p>

                <!-- rating -->
                <section class="rating">
                    <p>${element.rating.toPrecision(2)}</p>
                    <i class="fa-solid fa-star stars"></i>
                    <i class="fa-solid fa-star stars"></i>
                    <i class="fa-solid fa-star stars"></i>
                    <i class="fa-solid fa-star stars"></i>
                    <i class="fa-regular fa-star-half-stroke stars"></i>
                </section>
                <!-- price -->
                <p class="price">$${element.price}</p>
            </section>
        </article>
            `;
            container.innerHTML += child;
        });
    }
}


// TODO: add the title and description when changing the section of the courses

const changeSection = async () => {
    let inputForm = [...document.querySelector('.courses-radio').children];
    let coursesSections = ["data-science", "drawing", "aws", "excel", "js", "python", "web-dev"]
    const container = document.querySelector('.courses-cards');

    for(const lebel of inputForm){
        for(const child of lebel.children){
            if(child.tagName == "INPUT" && child.checked){
                if(currSection.length == 0 || currSection != child.value){
                    if(child.value == 'all'){
                        loadCourses(coursesSections, container);
                    }else{
                        loadCourses([child.value], container);
                    }
                    currSection = child.value;
                }
            }
        }        
    }
}

function searchBar(){
    let bar = document.querySelector('.bar');
    let val = bar.value.toLowerCase();
    let container = document.querySelector('.courses-cards');

    for(let card of container.children){
        card.style.display = 'block';
    }

    if(val.length){
        for(let card of container.children){
            let currValue = card.querySelector('.card-info').getElementsByTagName('h2')[0].innerHTML.toLowerCase();
            if(currValue.includes(val))
                continue;
            card.style.display = 'none';
        }
    }

}

window.addEventListener('DOMContentLoaded', () => loadContent());