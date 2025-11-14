

document.addEventListener('DOMContentLoaded', () => {
    const socket = io();

    socket.on('visitorCount', (count) => {
      const visitorCountElement = document.getElementById('visitor-count');
      if (visitorCountElement) {
        visitorCountElement.innerText = count;
      }
    });

    const pageTurnBtn = document.querySelectorAll('.nextprev-btn');

    pageTurnBtn.forEach((el, index) => {
        el.onclick = () => {

            const pageTurnId = el.getAttribute('data-page');
            const pageTurn = document.getElementById(pageTurnId);

            if(pageTurn.classList.contains('turn')){
                pageTurn.classList.remove('turn');

                setTimeout(() => {
                    pageTurn.style.zIndex = 2 - index;
                }, 500);

            }else{
                pageTurn.classList.add('turn');

                setTimeout(() => {
                    pageTurn.style.zIndex = 2 + index;
                }, 500);
            }
        }
    });


    // contact me button when click
    const pages = document.querySelectorAll('.book-page.page-right');
    const contactMeBtn = document.querySelector('.btn.contact-me');

    if (contactMeBtn) {
        contactMeBtn.onclick = () => {
            pages.forEach((page, index) => {
                setTimeout(() => {

                    page.classList.add('turn');
                    setTimeout(() => {
                        page.style.zIndex = 20 + index;
                    },500);
                }, (index + 1) * 200 + 100)
            });
        }
    }


    // create reverse index function
    let totalPages = pages.length;
    let pageNumber = 0;

    function reverseIndex() {
        pageNumber--;
        if(pageNumber < 0){
            pageNumber = totalPages - 1;
        }
    }


    // back profile button when click
    const backProfileBtn = document.querySelector('.back-profile');

    if (backProfileBtn) {
        backProfileBtn.onclick = () => {
            pages.forEach((_, index) => {
                setTimeout(() => {
                    reverseIndex();

                    pages[pageNumber].classList.remove('turn');

                    setTimeout(() => {
                        reverseIndex();
                        pages[pageNumber].style.zIndex = 10 + index;
                    }, 500)
                }, (index + 1) * 200 + 100)

            })
        }
    }


    // opening animation
    const coverRight = document.querySelector('.cover.cover-right');
    const pageLeft = document.querySelector('.book-page.page-left');


    // open animation (cover right animation)
    if (coverRight) {
        setTimeout(() => {
            coverRight.classList.add('turn');
        }, 2100);

        setTimeout(() => {
            coverRight.style.zIndex = -1;
        }, 2800);
    }


    pages.forEach((_, index) => {
        setTimeout(() => {
            reverseIndex();

            pages[pageNumber].classList.remove('turn');

            setTimeout(() => {
                reverseIndex();
                pages[pageNumber].style.zIndex = 10 + index;
            }, 500)
        }, (index + 1) * 200 + 2100)

    });

    async function loadProjects() {
      try {
        const response = await fetch('/api/projects');
        const projects = await response.json();
        const portfolioBox = document.getElementById('portfolio-box');

        if (portfolioBox) {
          portfolioBox.innerHTML = ''; // Clear existing content
          projects.forEach(project => {
            portfolioBox.innerHTML += `
              <div class="img-box">
                  <img src="${project.image_url}" alt="${project.name}">
              </div>
              <div class="info-box">
                  <div class="info-title">
                      <h3>${project.name}</h3>
                      <a href="${project.project_url}" target="_blank">Live Preview <i class="bx bx-link-external"></i></a>
                  </div>
                  <p>Tech Used: ${project.tech_used}</p>
                  <p>${project.description}</p>
              </div>
              <div class="btn-box">
                  <a href="${project.source_code_url}" class="btn" target="_blank">Source Code</a>
              </div>
            `;
          });
        }
      } catch (error) {
        console.error('Error loading projects:', error);
      }
    }

    loadProjects();

    const contactForm = document.getElementById('contact-form');

    if (contactForm) {
      contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(contactForm);
        const data = {
          full_name: formData.get('full_name'),
          email: formData.get('email'),
          message: formData.get('message'),
        };

        try {
          const response = await fetch('/api/contact', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
          });

          if (response.ok) {
            alert('Message sent successfully!');
            contactForm.reset();
          } else {
            alert('Error sending message.');
          }
        } catch (error) {
          console.error('Error sending message:', error);
          alert('Error sending message.');
        }
      });
    }
});