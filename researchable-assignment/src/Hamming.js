import React from "react"
import { scaleLinear, max, axisLeft, axisBottom, select } from "d3"
import * as d3 from 'd3'

//https://jsfiddle.net/matehu/w7h81xz2/
//https://users.cecs.anu.edu.au/~jks/Hamming.html
//https://www.cnblogs.com/littleSpill/p/10836530.html

import './Hamming.css';

function hammingDistance(numA, numB) {

    var stringA = numA.toString()
    var stringB = numB.toString()

    let result = 0

    if (stringA.length === stringB.length) {



        for (let i = 0; i < stringA.length; i++) {
            if ((stringA)[i] !== (stringB)[i]) {
                result++
            }
        }

        return result

    } else {
        throw new Error('Strings do not have equal length')
    }
}


class HammingDistancePlot extends React.Component{
	constructor(props) {
    	super(props)

    	if (localStorage.getItem("numbers")===null) {
    		this.state = {list: [], value: "", };
    	} else {
    		var retrievedData = localStorage.getItem("numbers");
    		var numbers = JSON.parse(retrievedData);
    		let list = numbers.map(i=>parseInt(i))

    		this.state = {list: list, value: "", };
    	}

    	

    	this.handleSubmit = this.handleSubmit.bind(this);
    	this.handleChange = this.handleChange.bind(this);
  	}

  	componentDidMount(){

        const script = document.createElement("script"); //Add the script for fork button

        script.src = "https://buttons.github.io/buttons.js";
        script.async = true;

        document.body.appendChild(script);

        this.plot_hamming()
    }

    handleSubmit(event) {


    	if (!isNaN(parseInt(this.state.value)) && this.state.value.length === 5) {

    		if (parseInt(this.state.value) > 99999 || parseInt(this.state.value) < 0) {
    			alert('invalid number');
    		} else {
    			// alert('A name was submitted: ' + this.state.value);
    			// this.state.numbers.push(parseInt(this.state.value))

    			var int_value = parseInt(this.state.value)

    			if (localStorage.getItem("numbers") === null) {
    				var numbers = []
    				numbers.push(this.state.value)
    				localStorage.setItem("numbers", JSON.stringify(numbers));

    			} else {
    				var retrievedData = localStorage.getItem("numbers");
    				var numbers = JSON.parse(retrievedData);
    				if (!numbers.includes(this.state.value)) {
    					numbers.push(this.state.value)
    				}
    				
    				localStorage.setItem("numbers", JSON.stringify(numbers));

    			}

    			
				// alert('what?' + numbers.length)
    			
    		}

    	} else {

    		if (this.state.value === 'clear') {
    			localStorage.clear()
    			alert('numbers clear')
    		} else {
    			alert('Please input a 5-digit integer');
    		}
    		
    	}

    	
  	}

  	handleChange(event) {
    	this.setState({value: event.target.value});
    }

  	plot_hamming() {

  		var hamming_numbers = this.state.list

  		var center = []

  		for (var i = 0; i <= hamming_numbers.length - 1; i++) {
  			for (var j = i+1; j <= hamming_numbers.length - 1; j++) {
  				center.push([hamming_numbers[i], hamming_numbers[j]])
  			}
  		}

  		
  		var colors = ["slateblue", "green", "steelblue", "pink", "orange", "yellow"]

  		const margin = { top: 20, right: 20, bottom: 20, left: 20 };
    	const width = 800 - margin.left - margin.right;
    	const height = 750 - margin.top - margin.bottom;
    	var padding = {top:30,right:30,bottom:100,left:100};

  		var svg = d3.select("#body")                    
                    .append("svg")                      
                    .attr("width",width)                
                    .attr("height",height)  

        var xAxisWidth = 600; 
        var yAxisWidth = 600;           

        var xScale = d3.scale.linear()                          
                    .domain([0,100000])
                    .range([0,xAxisWidth])

        var yScale = d3.scale.linear()                          
                    .domain([0,100000])
                    .range([0,yAxisWidth])

        var xAxis = d3.svg.axis()                       
                        .scale(xScale)                  
                        .orient("bottom")

        yScale.range([yAxisWidth,0])

        var yAxis = d3.svg.axis()                      
                        .scale(yScale)                  
                        .orient("left")


        svg.append("g")                          
            .attr("class","axis")               
            .attr("transform","translate("+padding.left+","+(height-padding.bottom)+")")  
            .attr("fill", "white")
            .call(xAxis)
            .selectAll("text")  
            .style("text-anchor", "end")
            .attr("dx", "-1.5em")
            .attr("dy", "0em")
            .attr("transform", "rotate(-65)" ); 


              


        svg.append("g")                                
            .attr("class","axis")                      
            .attr("transform","translate("+padding.left+","+(height-padding.bottom-yAxisWidth+")"))  
            .attr("fill", "white")  
            .call(yAxis)
            .selectAll("text")  
            .style("text-anchor", "end")
            .attr("dx", "-2.0em")
            .attr("dy", "0.1em")

        
        var circle = svg.selectAll("circle")
        				.data(center)
        				.enter()
        				.append("circle")
        				.attr("fill", function(d, idx) {

        					let distance = hammingDistance(d[0], d[1])
        					return colors[distance]
        				})
        				.attr("cx", function(d){
        					return xScale(d[0]) + padding.left
        				})
        				.attr("cy", function(d) {
        					return ((yScale(d[1])) + padding.right - margin.bottom )
        				})
        				.attr("r", 15)
        				.on("mouseenter", function(d, i) {
        					d3.select(this)
        					  .transition()
        					  .duration(300)
        					  .attr("opacity", 0.6)
        					  .attr("r", 20)


        					const x = padding.left + xScale(d[0])
        					const y = (yScale(d[1])) + padding.right - margin.bottom




        					var line = svg.append('line')
			        					   .attr("id", "horizentalLine")
			        					   .attr("x1", padding.left)
			        					   .attr("y1", y)
			        					   .attr("x2", x)
			        					   .attr("y2", y)
			        					   .attr("stroke", "white")

        					var line2 = svg.append("line")
        									.attr("id", "verticalLine")
        									.attr("x1", x)
        									.attr("y1", y)
        									.attr("x2", x)
        									.attr("y2", height - padding.bottom)
        									.attr("stroke", "white")


        				

        					svg.append("text")
        						.attr("id", "xLabel")
    							.attr("class", "x label")
    							.attr("text-anchor", "end")
    							.attr("x", -width + padding.bottom + margin.bottom + margin.top)
					    		.attr("y", x) //From padding.left to height because of the rotation 
					    		.attr("transform", "rotate(-90)")
					    		.attr("fill", "yellow")
					    		.attr("font-size", "12px")
					    		.text(d[0].toString());

					    	svg.append("text")
					    		.attr("id", "yLabel")
    							.attr("class", "y label")
					    		.attr("text-anchor", "end")
					    		.attr("y", y) // height - padding.bottm - padding.top -> padding.bottom
					    		.attr("x", padding.left - margin.left)
					    		.attr("fill", "yellow")
					    		.attr("font-size", "12px")
					    		.text(d[1].toString()); 

					    	
        				}).on("mouseleave", function(){
        					d3.select(this)
        					  .transition()
        					  .duration(300)
        					  .attr("opacity", 1)
        					  .attr("r", 15)


        					 svg.selectAll("#xLabel").remove()
        					 svg.select("#yLabel").remove()
				        	 svg.select("#horizentalLine").remove()
				        	 svg.select("#verticalLine").remove()
        				})



		        for (var i = 0; i <= center.length - 1; i++) {

		        	var k = hammingDistance(center[i][0], center[i][1])

		        	svg.append("text")
		        			.attr("class", "value")
		        			.attr("text-anchor", "middle")
		        			.attr("x", padding.left + xScale(center[i][0]))
		        			.attr("y", yScale(center[i][1]) + padding.right - margin.bottom + 4)
		        			.text(k)

		        	
		        	
		        }                                                                     

   	}

  	render() {

  		return(
  				<>
  				
  				<div id="body" className="Hamming">
  					<h3 className="PlotTitle">This is the hamming distance plot</h3>

  				</div>

  				<form onSubmit={this.handleSubmit} className="numberInput">
        			<label>
         		 	5-digit Number:  
          			<input type="text" value={this.state.value} onChange={this.handleChange} />
		        	</label>
		        	<input type="submit" value="Submit" />
		      	</form>



                
                <div class="container" id="forkButton">
                    <a class="github-button" href="https://github.com/GeneralZYQ/researchable-assignment-code" data-icon="octicon-repo-forked" aria-label="Fork ntkme/github-buttons on GitHub">
                    Fork
                    </a>
                </div>
  				</>

  				
  				 
  			)
  	}

}

export default HammingDistancePlot;