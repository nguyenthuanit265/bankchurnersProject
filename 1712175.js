const mainApp = () => {
    var res = []
    d3.csv("BankChurners.csv", function (data) {
        // Custom data
        const dataGen = convertData(data)

        // Draw
        // genPieChart(dataGen)
        genBarChart(dataGen)
    });

}

const convertData = (data) => {
    console.log(data)
    const categoryCardObj = []
    const mapCategoryCard = new Map()
    data.forEach(e => {
        if (e.Card_Category === '') {
            e.Card_Category = 'Unknown'
        }
        if (!mapCategoryCard.has(e.Card_Category)) {
            mapCategoryCard.set(e.Card_Category, 1)
        } else {
            var countCard = mapCategoryCard.get(e.Card_Category)
            mapCategoryCard.set(e.Card_Category, countCard + 1)
        }
    });

    mapCategoryCard.forEach((value, key) => {
        console.log(key, value)
        let item = {
            categoryCard: key,
            numberOfCard: value
        }
        console.log(item)
        categoryCardObj.push(item)
    })
    return categoryCardObj
}

// 
const genPieChart = (details) => {
    const width = 928;
    const height = Math.min(width, 500);
    // const colors = d3.scaleOrdinal(d3.schemeDark2)
    const colors = d3.scaleOrdinal()
        .domain(["Blue", "Silver", "Platinum", "Gold", "Unknown"])
        .range(["#5DADE2", "#C0C0C0", "#a0a09e", "#FFD700", "#440f3c"])

    const svg = d3.select('body').append('svg')
        .attr('height', height)
        .attr('width', width)
    // .style('background', 'silver')
    const data = d3.pie().sort(null).value((d) => d.numberOfCard)(details);
    console.log(data)

    const segments = d3.arc()
        .innerRadius(0)
        .outerRadius(Math.min(width, height) / 2 - 1);

    const sections = svg.append("g").attr("transform", "translate(250,250)").selectAll("path").data(data)
    sections.enter().append("path").attr("d", segments).attr("fill",
        (d) => { return colors(d.data.categoryCard); });

    let content = d3.select("g").selectAll("text").data(data)
    content.enter().append("text").each(function (d) {
        let center = segments.centroid(d);
        console.log("center: ", center)
        d3.select(this).attr("x", center[0]).attr("y", center[1]).text(d.data.categoryCard)
    })

}



const genBarChart = (details) => {
    const width = 900;
    const height = 450;
    const margin = { top: 50, bottom: 50, left: 50, right: 50 };

    const svg = d3.select('#d3-container-categoryCard')
        .append('svg')
        .attr('width', width - margin.left - margin.right)
        .attr('height', height - margin.top - margin.bottom)
        .attr("viewBox", [0, 0, width, height]);

    const x = d3.scaleBand()
        .domain(d3.range(details.length))
        .range([margin.left, width - margin.right])
        .padding(0.1)

    const y = d3.scaleLinear()
        .domain([0, 500])
        .range([height - margin.bottom, margin.top])

    svg
        .append("g")
        .attr("fill", 'royalblue')
        .selectAll("rect")
        .data(details.sort((a, b) => d3.descending(a.numberOfCard, b.numberOfCard)))
        .enter().append('rect')
        .attr("x", (d, i) => x(i))
        .attr("y", d => y(d.numberOfCard))
        .attr('title', (d) => d.numberOfCard)
        .attr("class", "rect")
        .attr("height", d => y(0) - y(d.numberOfCard))
        .attr("width", x.bandwidth());


    svg.append("g").attr("transform", `translate(0,${height - margin.bottom})`)
        .call(d3.axisBottom(x).tickFormat(i => details[i].categoryCard))
        .attr("font-size", '20px');

    svg.append("g").attr("transform", `translate(${margin.left}, 0)`)
        .call(d3.axisLeft(y).ticks(null, details.format))
        .attr("font-size", '20px');
    svg.node();
}

mainApp();