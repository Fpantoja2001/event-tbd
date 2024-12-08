const startTime = performance.now();

const eventWrapper = document.getElementById('eventlist_wrapper');

// Fetch the event data from the server
fetch('http://localhost:3000/api/event/getAll')
    .then((response) => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then((events) => {
        // Ensure events is an array, fallback to empty array if not available
        const eventData = events || [];

        // Extract unique categories from the event data
        const categories = [...new Set(eventData.map((event) => event.eventCategory))];

        categories.forEach((e) => {
            // Make the div for the category
            const cat = document.createElement('div');
            cat.className = `category`;

            const cat_top = document.createElement('div');
            cat_top.className = "column_heading";
            const catText = document.createTextNode(e);

            const button_all = document.createElement('button');
            button_all.className = 'button_all';
            button_all.appendChild(document.createTextNode("See All"));

            cat_top.appendChild(catText);
            cat_top.appendChild(button_all);

            let button_l, button_r;
            const eventsInCategory = eventData.filter((i) => i.eventCategory === e);
            if (eventsInCategory.length >= 5) {
                button_l = document.createElement('button');
                button_l.className = 'button_l';
                button_l.appendChild(document.createTextNode("< Left"));

                button_r = document.createElement('button');
                button_r.className = 'button_r';
                button_r.appendChild(document.createTextNode("Right >"));

                cat_top.appendChild(button_l);
                cat_top.appendChild(button_r);
            }

            const column = document.createElement('scroll');
            column.className = 'category_scroll';
            column.setAttribute("id", "category_scroll");

            const columnscroll = document.createElement('div');
            columnscroll.className = 'columns scrollable_column';

            // Append the events to their corresponding category
            eventsInCategory.forEach((i) => {
                const newevent = document.createElement('div');
                const a = document.createElement('a');
                a.href = `../event-details/index.html?eventid=${i.eventid}`;
                a.appendChild(newevent);

                a.className = 'column is-one-fifth bordered-column';

                const imgeClass = document.createElement('div');
                imgeClass.className = 'event_image image is-2by1';
                const nameClass = document.createElement('div');
                nameClass.className = 'event_name';

                const eventName = document.createTextNode(i.eventName);
                nameClass.appendChild(eventName);

                const eventDate = document.createTextNode(new Date(i.eventDate).toLocaleDateString());
                nameClass.appendChild(eventDate);

                const eventImg = document.createElement('img');
                eventImg.className = 'event_image';
                eventImg.src = '../event/image.jpg';
                imgeClass.appendChild(eventImg);

                newevent.appendChild(imgeClass);
                newevent.appendChild(nameClass);
                columnscroll.appendChild(a);
            });

            column.appendChild(columnscroll);
            cat.appendChild(cat_top);
            cat.appendChild(column);
            eventWrapper.appendChild(cat);
        });

        // Add scroll functionality
        document.querySelectorAll('.scrollable_column').forEach((scrollContainer) => {
            scrollContainer.addEventListener('wheel', (event) => {
                event.preventDefault(); // Prevents scrolling vertically
                scrollContainer.scrollBy({
                    left: event.deltaY * 4, // Adjust the multiplier to control scroll speed
                    behavior: 'smooth',    // Enables smooth scrolling
                });
            });
        });

        document.querySelectorAll('.category').forEach((category) => {
            const scrollContainer = category.querySelector('.scrollable_column');
            const scrollLeftButton = category.querySelector('.button_l');
            const scrollRightButton = category.querySelector('.button_r');

            // Function to scroll left
            if (scrollLeftButton) {
                scrollLeftButton.addEventListener('click', () => {
                    scrollContainer.scrollBy({
                        left: -400, // Adjust this value to control scroll amount
                        behavior: 'smooth',
                    });
                });
            }
            // Function to scroll right
            if (scrollRightButton) {
                scrollRightButton.addEventListener('click', () => {
                    scrollContainer.scrollBy({
                        left: 400, // Adjust this value to control scroll amount
                        behavior: 'smooth',
                    });
                });
            }
        });
    })
    .catch((error) => {
        console.error('Error fetching events:', error);
    });

// Calculate the time it takes for this script to run
const endTime = performance.now();
const timeDiff = endTime - startTime;
console.log(`Time taken: ${timeDiff} ms`);
