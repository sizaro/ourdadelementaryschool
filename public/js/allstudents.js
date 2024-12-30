'use strict';

// Get references to the search bar, button, and profile container
let studentSearchInput = document.querySelector("#studentSearchInput");
let searchButton = document.querySelector("#searchButton");
let studentProfileContainer = document.querySelector("#studentProfileContainer");

// Add an event listener for the search button click
searchButton.addEventListener("click", function () {
    let studentQuery = studentSearchInput.value.trim();

    if (studentQuery.length > 0) {
        console.log(`Searching for student: ${studentQuery}`);

        let searchURL = `/dashboard/studentssearch/search?query=${encodeURIComponent(studentQuery)}`;

        fetch(searchURL)
            .then(function (response) {
                if (response.ok) {
                    return response.json();
                }
                throw Error("Network response was not OK");
            })
            .then(function (data) {
                console.log(data);
                displayStudentProfile(data);
            })
            .catch(function (error) {
                console.log('There was a problem: ', error.message);
            });
    } else {
        studentProfileContainer.innerHTML = "<p>Please enter a search term.</p>";
    }
});

function displayStudentProfile(studentData) {
    if (studentData && Object.keys(studentData).length > 0) {
        studentProfileContainer.innerHTML = `
            <h2>${studentData.name}</h2>
            <p><strong>ID:</strong> ${studentData.id}</p>
            <p><strong>Grade:</strong> ${studentData.grade}</p>
            <p><strong>Class:</strong> ${studentData.class}</p>
            <p><strong>Date of Birth:</strong> ${studentData.dob}</p>
            <p><strong>Parent Contact:</strong> ${studentData.parent_contact}</p>
        `;
    } else {
        studentProfileContainer.innerHTML = "<p>No student found matching your query.</p>";
    }
}
