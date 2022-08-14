let files = [];
let currSection = "";
let host_url = 'http://localhost:3000/';

const loadContent = async () => {
    files = [];

    let courses_sections = ["data-science", "drawing", "aws", "excel", "js", "python", "web-dev"];
    
    for(let section of courses_sections){
        let response = await fetch(host_url + section);
        files.push(await response.json());
    }

    const container = document.querySelector('.courses-cards');

    container.innerHTML = '';

    for(let file of files){
        file.courses.forEach(element => {
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

const changeSection = async () => {
    let input_form = [...document.querySelector('.courses-radio').children];

    for(let lebel of input_form){
        for(let child of lebel.children){
            if(child.tagName == "INPUT" && child.checked){
                if(currSection.length == 0 || currSection != child.value){
                    if(child.value == 'all'){
                        loadContent();
                    }else{
                        let response = await fetch(host_url + child.value);
                        let file = await response.json();
                        const container = document.querySelector('.courses-cards');

                        container.innerHTML = '';

                        file.courses.forEach(element => {
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
                    currSection = child.value;
                }
            }
        }        
    }
}

window.addEventListener('DOMContentLoaded', () => loadContent());