// from data.js
var tableData = data;

// YOUR CODE HERE!
function createTable(filteredData) {
	tableBody = d3.select("tbody");

	tableBody.html("");

	for(var i = 0; i < filteredData.length; i++) {
		tableRow = tableBody.append("tr");
		
		tableRow.append("td").text(filteredData[i].datetime)
		tableRow.append("td").text(filteredData[i].city)
		tableRow.append("td").text(filteredData[i].state)
		tableRow.append("td").text(filteredData[i].country)
		tableRow.append("td").text(filteredData[i].shape)
		tableRow.append("td").text(filteredData[i].durationMinutes)
		tableRow.append("td").text(filteredData[i].comments)
	}
}

createTable(tableData)

// function filterClicked() {}


