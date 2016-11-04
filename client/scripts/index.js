/*global $, jQuery, EJS, Handlebars, Router */
$(document).ready(function () {
  // Configuration
  const api = `http://localhost:3000/api`

  // jQuery objects
  let $description = $('#description')

  // Handlebars templates
  let $listOfBooks = $('#books-list-template').html()

  // ---------------------------------------------------------------------------

  // Get all data from server
  $.getJSON(`${api}/books`, (data) => {
    let test = Handlebars.compile($listOfBooks)
    $('#books-list-table').append(test(data))
  })

})