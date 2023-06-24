/*
    File: multitable.js
    GUI Assignment: Creating a Multiplication Table with JS - With Validation, Sliders, and Tabs
    Ethan Rosenbaum, UML Computer Science, ethan_rosenbaum@student.uml.edu    
    
    Copyright (c) 2023 by Ethan. All Rights reserved. May be
    freely copied or excerpted for educational purposes with credit to the author.

    Header taken from HW assignment 1 example by Wenjin Zhou.
*/

/*
 *
 *
 * Tabs
 * 
 */
var tabCount = 0;

$(document).ready(function() {
    $( "#multitable_tabs" ).tabs({
        event: "click"
    });
} );

// https://stackoverflow.com/questions/16678953/jquery-ui-tabs-dynamically-add-tab
function saveTable() {
    if (!$("#multitable_form").valid) {
        return;
    }

    var xmin  = Number(document.getElementById("xrangelow").value);
    var xmax  = Number(document.getElementById("xrangehi").value);
    var ymin  = Number(document.getElementById("yrangelow").value);
    var ymax  = Number(document.getElementById("yrangehi").value);    

    // Flip inputs if need be
    if (xmin > xmax) {
        var swap = xmin;
        xmin = xmax;
        xmax = swap;
    }

    if (ymin > ymax) {
        var swap = ymin;
        ymin = ymax;
        ymax = swap;
    }

    // Get our tabs object to manipulate
    var tabs = $("#multitable_tabs").tabs();

    // Create the tab name and the tab ID (ID can't have spaces so can't reuse name)
    var tabName = "(" + xmin + "," + xmax + ") x (" + ymin + "," + ymax + ")";
    var tabId = "(" + xmin + "," + xmax + ")-x-(" + ymin + "," + ymax + ")-" + tabCount;

    // Create the list element
    var li = $("<li><a href='#" + tabId + "'>"+ tabName + "</a><input type='checkbox'></li>");
    li.appendTo(tabs.find('ul'));

    var currentTable = document.getElementById("multitable").innerHTML;
    var newDiv = $("<div></div>");
    newDiv.attr('id', tabId);
    newDiv.html(currentTable);
    newDiv.appendTo(tabs);

    tabs.tabs("refresh");
    tabCount++;

}

// See https://stackoverflow.com/questions/1581751/removing-dynamic-jquery-ui-tabs.
//
// Had to use a bit of a different strategy to get the checkboxes and trace up the DOM
// tree to get to the link, parse out the ID, and then use that to target the panel.
function removeTabs() {
    var checkboxes =  document.querySelectorAll('input[type=checkbox]:checked');
    for(var x of checkboxes) {
        // https://www.w3schools.com/jsref/prop_element_previouselementsibling.asp
        var a = x.previousElementSibling;
        var tabId = a.attributes['href'].value.replace("#", "");

        // Remove the panel and refresh the widget
        var div = document.getElementById(tabId);
        div.remove();
        console.log(div);
        $( "#multitable_tabs" ).tabs("refresh");

        // Kill the link/tab header.
        a.closest('li').remove();
    }

}

/*
 * Handlers for save and remove buttons.
 */
$("#addTab").click(function () {
    saveTable();
});

$("#removeTabs").click(function () {
    removeTabs();
});


/*
 *
 * Beginning of jquery form input validations
 * 
 */

// https://www.sitepoint.com/basic-jquery-form-validation-tutorial/
$(function () {
    $("#multitable_form").validate({
        rules: {
            minimum_x_value: {
                required: true,
                range: [-50, 50],
                number: true
            },
            maximum_x_value:{
                required: true,
                range: [-50, 50],
                number: true
            },
            minimum_y_value:{
                required: true,
                range: [-50, 50],
                number: true
            },
            maximum_y_value:{
                required: true,
                range: [-50, 50],
                number: true
            }

        }, // End of 'rules'
        messages: {
            minimum_x_value: {
                required: "<br\>Please enter a minimum X (column) value",
                range: "<br\>Please enter a number between -50 and 50",
                number: "<br\>Please enter a number between -50 and 50"
            },
            maximum_x_value:{
                required: "<br\>Please enter a maximum X (column) value",
                range: "<br\>Please enter a number between -50 and 50",
                number: "<br\>Please enter a number between -50 and 50"
            },
            minimum_y_value:{
                required: "<br\>Please enter a minimum Y (row) value",
                range: "<br\>Please enter a number between -50 and 50",
                number: "<br\>Please enter a number between -50 and 50"
            },
            maximum_y_value:{
                required: "<br\>Please enter a maximum Y (row) value",
                range: "<br\>Please enter a number between -50 and 50",
                number: "<br\>Please enter a number between -50 and 50"
            }
        }, // End of 'messages'
        submitHandler: function(form) {
            return createTable();
        }
    });

});

/*

    Slider set-up and bindings to text inputs:
    https://stackoverflow.com/questions/36865066/jquery-slider-with-textbox-input
    https://jqueryui.com/slider/#hotelrooms
*/

// input xrangelow
$( function() {
    var el = $("#xrangelow").val();

    $("#sliderxlow").slider({
        range: "min",
        value: el,
        step: 1,
        min: -50,
        max: 50,
        slide: function( event, ui ) {
            
            // Update the slider - guaranteed to be a valid value.
            $( "#xrangelow" ).val( ui.value );
            
            // This will hide the error message from previous
            // invalid input.
            if ($("#xrangelow").valid()){}
        },
        change: function( event, ui ) {
            createTable();
        }
    });

});
$("#xrangelow").on('change', function () {
    var value = this.value;
    console.log(value);
    
    // Verify the text input is valid - do NOT update if invalid.
    if (!$("#xrangelow").valid()){
        return false;
    }
    
    $("#sliderxlow").slider("value", Number(value));
});

// input xrangehi
$( function() {
    var el = $("#xrangehi").val();

    $("#sliderxhi").slider({
        range: "min",
        value: el,
        step: 1,
        min: -50,
        max: 50,
        slide: function( event, ui ) {
            $( "#xrangehi" ).val( ui.value );

            // This will hide the error message from previous
            // invalid input.
            if ($("#xrangehi").valid()){}
        },
        change: function( event, ui ) {
            createTable();
        }
    });

});
$("#xrangehi").on('change', function () {
    var value = this.value;
    console.log(value);
    
    // Verify the text input is valid - do NOT update if invalid.
    if (!$("#xrangehi").valid()){
        return false;
    }

    $("#sliderxhi").slider("value", Number(value));
});

//
// Slider set-up for input yrangelow
//
$( function() {
    var el = $("#yrangelow").val();

    $("#sliderylow").slider({
        range: "min",
        value: el,
        step: 1,
        min: -50,
        max: 50,
        slide: function( event, ui ) {
            $( "#yrangelow" ).val( ui.value );

            // This will hide the error message from previous
            // invalid input.
            if ($("#yrangelow").valid()){}
        },
        change: function( event, ui ) {
            createTable();
        },
    });

});

//
// Text input change event handler to update slider value
//
$("#yrangelow").on('change', function () {
    var value = this.value;
    console.log(value);

    // Verify the text input is valid - do NOT update if invalid.
    if (!$("#yrangelow").valid()){
        return false;
    }
    
    $("#sliderylow").slider("value", Number(value));
});

// input yrangehi
$( function() {
    var el = $("#yrangehi").val();

    $("#slideryhi").slider({
        range: "min",
        value: el,
        step: 1,
        min: -50,
        max: 50,
        slide: function( event, ui ) {
            $( "#yrangehi" ).val( ui.value );

            // This will hide the error message from previous
            // invalid input.
            if ($("#yrangehi").valid()){}
        },
        change: function( event, ui ) {
            createTable();
        }
    });

});

//
// Text input change event handler to update slider value
//
$("#yrangehi").on('change', function () {
    var value = this.value;
    console.log(value);

    // Verify the text input is valid - do NOT update if invalid.
    if (!$("#yrangehi").valid()){
        return false;
    }

    $("#slideryhi").slider("value", Number(value));
});



/*
    createTable()
    
    Main driver function which is executed on form submission.
    This uses DOM methods to generate a table following validation of the form inputs.

    Params:
        None.

    Returns:
        false - prevents form resubmission. (See comment at return statements.)
*/
function createTable() {
    var statusMsg = "";

    var xmin  = Number(document.getElementById("xrangelow").value);
    var xmax  = Number(document.getElementById("xrangehi").value);
    var ymin  = Number(document.getElementById("yrangelow").value);
    var ymax  = Number(document.getElementById("yrangehi").value);    

    //
    // All good inputs
    //

    // Flip inputs if need be
    if (xmin > xmax) {
        var swap = xmin;
        xmin = xmax;
        xmax = swap;
        statusMsg += "<p>Swapped column minimum and maximum inputs.</p>";
    }

    if (ymin > ymax) {
        var swap = ymin;
        ymin = ymax;
        ymax = swap;
        statusMsg += "<p>Swapped row minimum and maximum inputs.</p>";
    }

    document.getElementById("status").innerHTML = statusMsg;

    //
    // Code heavily influenced by:
    // https://www.valentinog.com/blog/html-table/
    //

    // Get the div element which will hold the table then clear contents.
    var multitableDiv = document.getElementById("multitable");
    multitableDiv.innerHTML = "";
    
    // Create the new table element.
    var multitable = document.createElement('TABLE');

    // Create the first row - all table headers with X-MIN -> X-MAX values.
    var columnHeaders = multitable.insertRow();
    columnHeaders.appendChild(document.createElement("th"));

    for (let index = xmin; index <= xmax; index++) {
        let th = document.createElement("th");
        let thText = document.createTextNode(index);
        th.appendChild(thText);
        columnHeaders.appendChild(th);
    }

    // Create the rest of the table:
    // <th>Y-VAL</th><td></td><td></td><td></td> etc...
    for (let i = ymin; i <= ymax; i++) {
        let row = multitable.insertRow();

        // Create the header for the row
        let th = document.createElement("th");  
        let thText = document.createTextNode(i);
        th.appendChild(thText);
        row.appendChild(th);

        // Generate the multiples
        for (let j = xmin; j <= xmax; j++) {
            let cell = row.insertCell();
            let val  = document.createTextNode(i * j);
            cell.appendChild(val);
            
        }
    }

    // Put the table into the div.
    multitableDiv.appendChild(multitable);

    // See:
    //    https://stackoverflow.com/questions/21617060/content-disappears-immediately-after-form-submitted-and-function-runs
    return false
}

/*
    Function resets form and creates the table on load.
    The form reset call prevents bad data from tanking the load on refresh.

    https://stackoverflow.com/questions/16452699/how-to-reset-a-form-using-jquery-with-reset-method

*/
$('document').ready( function() {
    $("#multitable_form").trigger("reset");
    if ($("#multitable_form").valid()) {
        createTable();
    }
});