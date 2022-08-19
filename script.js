const hostURL = 'https://api.jsonbin.io/v3/b/62fa3b83a1610e6386ff2396/';
const coursesSections = ["data-science", "drawing", "aws", "excel", "js", "python", "web-dev"];
let sectionObject = {}, currentSection = '', lastSearchedWord = '', coursesPerRow = 1;

const loadCourses = async () => {
    fetch(hostURL).then(response => response.json())
    .then(jsonFile => {
        for(const section of coursesSections){
            sectionObject[section] = jsonFile['record'][section];
        }
        changeSection(false);
    });
}

function changeSection(resize){
    const inputForm = [...document.querySelector('.courses-radio').children];
    const searchBarValue = document.querySelector('.bar').value.toLowerCase();
    let section = '';
    let coursesToLoad = [];
    for(const label of inputForm){
        for(const child of label.children){
            if(child.tagName == "INPUT" && child.checked){
                coursesToLoad = sectionObject[child.value]['courses'].filter((course) => {
                    return course['title'].toLowerCase().includes(searchBarValue);
                });
                section = child.value;
            }
        }
    }
    if(lastSearchedWord == searchBarValue && currentSection == section && !resize)
        return;
    changeSectionHeader(section);
    currentSection = section;
    lastSearchedWord = searchBarValue;
    const carousel = document.querySelector('#coursesCarousel .carousel-inner');
    carousel.innerHTML = '';
    const coursesRows = createRows(coursesToLoad);
    carousel.innerHTML += coursesRows;
}

function createRows(coursesToLoad){
    if(!coursesToLoad.length)
        return ``;
    const numberOfRows = Math.ceil(coursesToLoad.length / coursesPerRow);
    let coursesRows = ``;
    let currentCourse = 0;
    for(let rowIndex = 0; rowIndex < numberOfRows; rowIndex++){
        let row = ``;
        for(let courseIndex = currentCourse; courseIndex < Math.min(coursesToLoad.length, currentCourse + coursesPerRow); courseIndex++){
            row += createCourse(coursesToLoad[courseIndex]);
        }
        currentCourse += coursesPerRow;
        coursesRows += `
        <div class="carousel-item`;
        if(!rowIndex){
            coursesRows += ` active `;
        }
        coursesRows += `">`;
        coursesRows += `
            <div class="row">
        `
        coursesRows += row;
        coursesRows += `
            </div>
        </div>`;
    }
    return coursesRows;
}

function createCourse(course){
    let instructors = ``;
    course['instructors'].forEach((instructor) => {
        instructors += ' ' + instructor['name'] + ',';
    });
    instructors = instructors.slice(0, -1);
    return `
    <div class="col-sm-12 col-md-6 col-lg-4 col-xl-3 d-flex align-items-stretch">
        <article class="card h-100 d-inline-block shadow">
            <figure class="img-wrapper">
                <img src="${course.image}" alt="" class="d-block w-100 h-100">
            </figure>
            <section class="card-body">
                <h3 class="course-title">
                    ${course.title}
                </h3>
                <p class="course-instructors">
                    ${instructors}
                </p>
                <section class="course-rating-container">
                    <p class="course-rating">${course.rating.toPrecision(2)}</p>
                    ${getRating(course.rating.toPrecision(2))}

                </section>
                <p class="course-price">
                    $${course.price}
                </p>
            </section>
        </article>
    </div>
    `
}

function getRating(rating){
    let courseRating = ``, star = 0;
    for(star = 0; star < Math.floor(rating); star++){
        courseRating += `
            <i class="fa-solid fa-star stars"></i>
        `;
    }
    if(!Number.isInteger(rating)){
        star++;
        courseRating += `
            <i class="stars fa-regular fa-star-half-stroke"></i>
        `;
    }
    while(star < rating){
        star++;
        courseRating += `
        <i class="fa-light fa-star"></i>
        `
    }
    return courseRating;
}

function changeSectionHeader(section){
    const buttonValue = {
        'python':'Python',
        'drawing': 'Drawing',
        'aws': 'AWS Certification',
        'excel': 'Excel',
        'js': 'JavaScript',
        'data-science': 'Data Science',
        'web-dev': 'Web Development'
    }
    const header = document.querySelector('.courses-section-header');
    header.innerHTML = sectionObject[section].header;
    const description = document.querySelector('.courses-section-description');
    description.innerHTML = sectionObject[section].description;
    const exploreButton = document.querySelector('.explore');
    exploreButton.innerHTML = 'Explore ' + buttonValue[section];
}

function checkMediaQuery(){
    let result = 1;
    if(window.matchMedia('(min-width: 1200px)').matches){
        result = 4;
    }else if(window.matchMedia('(min-width: 991px)').matches){
        result = 3;
    }else if(window.matchMedia('(min-width: 768px)').matches){
        result = 2;
    } 
    return result;
}

window.addEventListener('DOMContentLoaded', () => {
    coursesPerRow = checkMediaQuery();
    loadCourses();
});

window.addEventListener('resize', () => {
    const newNumberPerRow = checkMediaQuery();
    console.log(newNumberPerRow)
    if(newNumberPerRow != coursesPerRow){
        coursesPerRow = newNumberPerRow;
        changeSection(true);
        console.log('changed')
    }
});
