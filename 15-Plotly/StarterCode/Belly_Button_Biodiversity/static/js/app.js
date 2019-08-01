

   // @TODO: Complete the following function that builds the metadata panel

  // Use `d3.json` to fetch the metadata for a sample
    // Use d3 to select the panel with id of `#sample-metadata`

    // Use `.html("") to clear any existing metadata

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.

    // BONUS: Build the Gauge Chart
    // buildGauge(data.WFREQ);


function buildMetadata(sample) {
  var meta_url = '/metadata/' + sample

  var select_sample = d3.select("#sample-metadata");
  select_sample.text(" ");

  // console.log(select_sample)

  d3.json(meta_url).then((sample_data) => {

    for(sdata in sample_data) {
      select_sample
      .append("p")
      .text(sdata + ": " + sample_data[sdata])
      // console.log(sample_data[sdata])
    }


  });


}

  // @TODO: Use `d3.json` to fetch the sample data for the plots

    // @TODO: Build a Bubble Chart using the sample data

    // @TODO: Build a Pie Chart
    // HINT: You will need to use slice() to grab the top 10 sample_values,
    // otu_ids, and labels (10 each).

function buildCharts(sample) {
  var samples_url = '/samples/' + sample

  d3.json(samples_url).then((graph_data) => {

    var combined = [];
    graph_data['otu_ids'].forEach((gsample, i) => {
      combined[i] = {"id": gsample, "label": graph_data['otu_labels'][i], "value": graph_data["sample_values"][i]}
      // console.log(combined)
      });

    var combined_sorted = combined.sort(function(a,b){return b.value - a.value});
    var top_10 = combined_sorted.slice(0,10)
    // console.log(top_10)

    var g_id = []
    var g_label = []
    var g_value = []

    top_10.forEach((item, i) => {
      
      g_id[i] = top_10[i]['id'];
      g_label[i] = top_10[i]['label'];
      g_value[i] = top_10[i]['value']

      var pieChart = {
        labels: g_id,
        values: g_value,
        hovertext: g_label,
        type: 'pie'
      };

      var data = [pieChart];
      var layout = {
        title: "Top 10",
      };

      Plotly.newPlot("pie", data, layout);

    });

    var bubbleChart = [{
      x: graph_data.otu_ids,
      y: graph_data.sample_values,
      mode: "markers",
      text: graph_data.otu_labels,
      marker: {
        color: graph_data.otu_ids,
        size: graph_data.sample_values
      }
    }];
    console.log(graph_data.otu_ids)
    console.log(graph_data.sample_values)
    console.log(graph_data.otu_labels)


    var layout_2 = {
      xaxis: {
        title: "OTU ID"
      }
    };

    Plotly.newPlot('bubble', bubbleChart, layout_2);
  });

}
    


  



function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
