 function MindMap(svgID, data) {

     this.nodes = data.nodes;
     this.currentTargetElement = null;
     this.nodes[0]["fx"] = window.innerWidth / 2;
     this.nodes[0]["fy"] = (window.innerHeight - 250) / 2;

     // Empty the DOM element
     d3.selectAll("#" + svgID + " > *").remove();

     this.connections = data.connections;
     this.svg = document.getElementById(svgID);

     this.editable = true;
     this.simulation = null;
    //  let firstTime = true;
     let parent = this;

     // methods
     var prepareNodes = function () {
         const render = (node) => {
             node.uid = uuid.v4();
             node.html = nodeTemplate(node);

             const dimensions = getDimensions(node.html, {}, "mindmap-node");
             node.width = dimensions.width;
             node.height = dimensions.height;
         };

         parent.nodes.forEach((node, i) => render(node, i));
    }

     /**
      * Add new class to nodes, attach drag behavior,
      * and start simulation.
      */
     parent.prepareEditor = function (svg, conns, nodes) {
         nodes
             .attr("class", "mindmap-node mindmap-node--editable")
             .attr("id", d => d.uid)
             .on("dbclick", node => {
                 node.fx = null;
                 node.fy = null;
             })
             .on("click", (d, i) => {
                 parent.nodeClickEvent(d3NodeClick(d, i), d);
             });

         nodes.call(d3Drag(parent.simulation, svg, nodes));

         // Tick the simulation 100 times
         for (let i = 0; i < 100; i += 1) {
             parent.simulation.tick();
         }

         setTimeout(() => {
             parent.simulation.alphaTarget(0.5).on("tick", () => onTick(conns, nodes));
         }, 200);
     }

     /**
      * Render mind map unsing D3
      */
     parent.renderMap = function () {

         // Create force simulation to position nodes that have
         // no coordinate, and add it to the component state
         parent.simulation = d3.forceSimulation()
             .force("link", d3.forceLink().id(node => node.id))
             .force("charge", d3.forceManyBody())
             .force("collide", d3.forceCollide().radius(200))

         const svg = d3.select(parent.svg);

         // Clear the SVG in case there's stuff already there.
         svg.selectAll("*").remove();

         // Add subnode group
         svg.append("g").attr("id", "mindmap-subnodes");

         prepareNodes();

         // Bind data to SVG elements and set all the properties to render them
         const connections = d3Connections(svg, parent.connections);
         const {
             nodes
         } = d3Nodes(svg, parent.nodes);

         parent.nodes.forEach(node => {
            if("vlSpec" in node && node["vlSpec"] != null){
                vegaEmbed(document.getElementById("visContainer-" + node.id), node.vlSpec, vegaOptMode);
            }
         });
         nodes.append("title").text(node => node.uid);

         // Bind nodes and connections to the simulation
         parent.simulation
             .nodes(parent.nodes)
             .force("link")
             .links(parent.connections);

         if (parent.editable) {
             parent.prepareEditor(svg, connections, nodes);
         }

         // Tick the simulation 100 times
         for (let i = 0; i < 100; i += 1) {
             parent.simulation.tick();
         }
         onTick(connections, nodes);

        //  if (firstTime) { // Call it only once when the app loads; let the user take over thereafter!
        //      svg
        //          // .attr("viewBox", getViewBox(nodes.data())) // Keep this commented to avoid centering the nodes and losing their manual positioning.
        //          .call(d3PanZoom(svg))
        //          .on("dbClick.zoom", null);

        //      firstTime = false;
        //  }

     }

     /**
      * node mouse click events
      */
     parent.nodeClickEvent = function (event, node) {
         switch (event) {
             case "add":
                 parent.addNewNode(node);
                 break;
             case "remove":
                 parent.removeNode(node);
                 break;
             case "click":
                 parent.clickNode(node);
                 break;
         }
     }

     /**
      * click on node text
      */
     parent.clickNode = function (d) {
         console.log("node clicked: " + d.text);
     }

    $("#processQueryBtn").click(function(){
        let newQuery = $("#queryBox").val();
        if(!newQuery || newQuery.trim().length === 0){
            console.log("Your query is incorrect/incomplete.");
        }else{
            $('#queryModal').modal('hide');
            let target = parent.currentTargetElement;
            let dialog = target.id != "ROOT"; // If clicked node is not the root, then it is a follow-up query!
             $.post("/analyze_query", {
                     "query": newQuery,
                     "dialog": dialog,
                     "dialog_id": target.dialog_id,
                     "query_id": target.query_id
                 })
                 .done(function (response_string) {

                     var response = JSON.parse(response_string);
                     for (var i = 0; i < response['visList'].length; i++) {
                         var obj = response['visList'][0];
                         if (JSON.stringify(obj['encoding']) != "{}") {


                                obj["vlSpec"]['width'] = globalConfig.vegaMainChartSize.width;
                                obj["vlSpec"]['height'] = globalConfig.vegaMainChartSize.height;

                                const nodeId = uuid.v4();
                                parent.nodes.push({
                                    id: nodeId,
                                    text: newQuery,
                                    fx: target.fx,
                                    fy: target.fy + 150,
                                    vlSpec: obj["vlSpec"],
                                    dialog_id: response["dialogId"],
                                    query_id: response["queryId"]
                                });
                                parent.connections.push({
                                    source: target.id,
                                    target: nodeId
                                });
                                parent.renderMap();

                             // container for Vis
                             vegaEmbed(document.getElementById("visContainer-" + nodeId), obj["vlSpec"], vegaOptMode);
                         }
                         // Just take the first, best visualization!
                         break;
                     }

                 });
        }
    });

     /**
      * add new child nodes
      */
     parent.addNewNode = function (target) {
        console.log(target);
        //  var newQuery = prompt("Enter query", "");
        parent.currentTargetElement = target;
        // $('#queryModal').modal('show');
        $("#queryModal").modal({backdrop: 'static', keyboard: false});
     }
     /**
      * remove a node: not needed for this demo application as it is EDA.
      */
     parent.removeNode = function (target) {
         console.log("request to delete node: " + target.text);
         $.post("/flushConversation", {
            "dialog_id": target.dialog_id,
            "query_id": target.query_id
        })
        .done(function (response) {
            console.log(parent.nodes);
            console.log(parent.connections);
            console.log(response);

         // TODO: Check with Rishab -- this function errs in NL4DV.
         // TODO: Figure out how to actually delete the node (along with all it's children) from the UI.

        });
     }

     /**
      * edit node text
      */
     parent.editNode = function (d) {
         var nodeTitle = prompt("node text", d.text);
         if (nodeTitle != null) {
             d.text = nodeTitle;
             parent.renderMap();
         }
     }

     return {
         renderMap: parent.renderMap
     }
 }
