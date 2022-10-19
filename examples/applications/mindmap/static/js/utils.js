const getDimensions = (html, style, classname) => {
    const el = document.createElement("span");
    const dimensions = {};
  
    // Set display: inline-block so that the size of el
    // will depend on the size of its children.
    el.style.display = "inline-block";
  
    // Hide the element (it will be added to the page for a short time).
    el.style.visibility = "hidden";
  
    el.className = classname;
    el.innerHTML = html;
  
    // Apply CSS rules.
    Object.keys(style).forEach(rule => {
      el.style[rule] = style[rule];
    });
    document.body.append(el);
    //@ts-ignore
    dimensions.width = el.offsetWidth;
    //@ts-ignore
    dimensions.height = el.offsetHeight;
  
    //el.remove()
    return dimensions;
  };
  
  /*
   * Return the dimensions of an SVG viewport calculated from
   * some given nodes.
   */
  const getViewBox = nodes => {
    const Xs = [];
    const Ys = [];
  
    nodes.forEach(node => {
      const x = node.x || node.fx;
      const y = node.y || node.fy;
  
      if (x) {
        Xs.push(x);
      }
  
      if (y) {
        Ys.push(y);
      }
    });
  
    if (Xs.length === 0 || Ys.length === 0) {
      return "0 0 0 0";
    }
  
    // Find the smallest coordinates...
    const min = [Math.min(...Xs) - 150, Math.min(...Ys) - 150];
  
    // ...and the biggest ones.
    const max = [Math.max(...Xs) - min[0] + 150, Math.max(...Ys) - min[1] + 150];
  
    return `${min.join(" ")} ${max.join(" ")}`;
  };

/**
 * Bind data to a <TAG> (e.g., "path"), inside a G element, inside the given root element.
 * Root is a D3 selection, data is an object or array, tag is a string.
 */
const bindData = (root, data) =>
  root
    .append("g")
    .selectAll("path")
    .data(data)
    .enter()
    .append("path");

/**
 * Bind connections to PATH tags on the given SVG
 */
const d3Connections = function(svg, connections){
  return bindData(svg, connections).attr("class", "mindmap-connection");
}

/* eslint-disable no-param-reassign */
/**
 * Bind rodes to FOREIGNOBJECT tags on the given SVG,
 * and set dimensions and html.
 */
const d3Nodes = (svg, nodes) => {
  const selection = svg
    .append("g")
    .selectAll("foreignObject")
    .data(nodes)
    .enter();

  const d3nodes = selection
    .append("foreignObject")
    .attr("class", "mindmap-node")
    .style("width", node => node.id == "ROOT" ? node.width : 300)
    .style("height", node => node.height)
    .style("overflow", "visible")
    // .attr("width", node => node.width + 4)
    // .attr("height", node => node.height)
    .html(node => node.html);

  return {
    nodes: d3nodes
  };
};

/**
 * Callback for forceSimulation tick event.
 */
const onTick = (conns, nodes) => {
  const d = function(conn){
    return [
      "M",
      conn.source.x,
      ",",
      conn.source.y,
      " ",
      "C",
      (conn.source.x + conn.target.x) / 2,
      ",",
      conn.source.y,
      " ",
      (conn.source.x + conn.target.x) / 2,
      ",",
      conn.target.y,
      " ",
      conn.target.x,
      ",",
      conn.target.y
    ].join("");
  }
  
  // Set the connections path.
  conns.attr("d", d);

  // Set nodes position.
  nodes
    .attr("x", node => node.x - node.width / 2)
    .attr("y", node => node.y - node.height / 2);
};

/*
 * Return drag behavior to use on d3.selection.call().
 */
const d3Drag = (simulation, svg, nodes) => {
  const dragStart = node => {
    if (!d3.event.active) {
      simulation.alphaTarget(0.2).restart();
    }

    node.fx = node.x;
    node.fy = node.y;
  };

  const dragged = node => {
    node.fx = d3.event.x;
    node.fy = d3.event.y;
  };

  const dragEnd = () => {
    if (!d3.event.active) {
      simulation.alphaTarget(0);
    }
  };

  return d3.drag()
    .on("start", dragStart)
    .on("drag", dragged)
    .on("end", dragEnd);
};

/*
 * Return pan and zoom behavior to use on d3.selection.call().
 */
const d3PanZoom = el =>
  d3.zoom()
  // .scaleExtent([0.3, 5])
  .scaleExtent([1]) // Disable Zoom, because Vega-lite chart also seems to be zooming in-out with the node container. 
  .on("zoom", () =>
    el.selectAll("svg > g").attr("transform", d3.event.transform)
  );

/*
 * d3 node click event
 */
const d3NodeClick = (d, i) => {
  d3.event.stopPropagation();
  let target = d3.event.target;

  switch (target.className) {
    case "fas fa-plus-circle":
      return "add";
    case "fas fa-trash-alt":
      return "remove";
    case "node-text":
      return "click";
  }
};

const nodeTemplate = (node) => {
  if(node.id == 'ROOT'){
    return `
      <div class="node-body">
        <div class="options">
          <div class="option add-item"><i class="fas fa-plus-circle"></i></div>
        </div>
        <span id="node-${node.id}" class="node-text">${node.text || ''}</span>
        <div style="width: 100%; text-align: center;" id="visContainer-${node.id}"></div>
      </div>`;
  }else{
    return `
    <div class="node-body">
      <div class="options">
        <div class="option add-item"><i class="fas fa-plus-circle"></i></div>
        <div class="option remove-item"><i class="fas fa-trash-alt"></i></div>
      </div>
      <span id="node-${node.id}" class="node-text">${node.text || ''}</span>
      <div style="width: 100%; text-align: center;" id="visContainer-${node.id}"></div>
    </div>`;    
  }
  
}