class LM_DesignGenie:

    def __init__(self, nl4dv_instance):
        # nl4dv instance
        self.nl4dv_instance = nl4dv_instance
        self.prompt = """
            # These charts may be provided in SVG, PDF, PNG, or JPG formats. I want to style a given visualization (Input), either through plain text suggestions or along with uploaded images of example charts as context. Your task consists of two parts:

            ## Part 1 - Internal Style Extraction (No Output)
            Consider you are specialized in extracting design aspects (i.e., all layouts and styling) from images of charts. For each uploaded chart image, extract all visual properties which includes and is not limited to:
            - Fill color, stroke color, fill opacity, and stroke opacity of marks
            - Mark type and shape (e.g., bar, line, point, circle, square, text)
            - Axis properties including:
                - Axis font (title and labels), font size, font style, font weight
                - Axis label angle, label alignment, label color, label opacity, label overlap strategy, and label padding
                - Axis title text, title alignment, title anchor, title color, title padding
                - Axis ticks: visibility, color, size, width, opacity, count, and position (tickBand)
                - Explicit tick values if present
            - Gridline properties: visibility, color, opacity, stroke width, dash pattern, dash offset, band position, and scale reference
            - Legend properties including:
                - Layout orientation (orient), direction (vertical/horizontal)
                - Legend title text, font, font size, font color, and title padding
                - Legend background fill color and border stroke color
                - Legend padding and corner radius
                - Legend label color and explicit legend values
            - Chart title properties:
                - Title text and subtitle text
                - Title and subtitle font, font size, font style, font weight, and color
                - Title and subtitle alignment, anchor, orientation, and subtitle padding
            - Chart size: width and height in pixels
            - Chart background and view (plotting area) fill and stroke colors

            Refer to the below JSON schema or the Vega-Lite documentation at https://vega.github.io/vega-lite/docs/ for details on the above design aspects. Extract every design aspect visible in the chart images; we will use them later in Part 2.
            
            For specific properties, refer to the following URLS:
            
            Marks:
            https://vega.github.io/vega-lite/docs/mark.html
            
            Axis: 
            https://vega.github.io/vega-lite/docs/axis.html

            Encodings:
            https://vega.github.io/vega-lite/docs/encoding.html

            Legends:
            https://vega.github.io/vega-lite/docs/legend.html

            Titles and subtitles:
            https://vega.github.io/vega-lite/docs/title.html

            Chart size and background:
            https://vega.github.io/vega-lite/docs/size.html
            https://vega.github.io/vega-lite/docs/config.html#background
            
            {
                "encoding": {
                    "x": {
                    "description": "Horizontal position of marks.",
                    "example": {
                        "field": "year",
                        "type": "temporal",
                        "scale": "paddingInner: 0.1"
                    }
                    },
                    "y": {
                    "description": "Vertical position of marks.",
                    "example": {
                        "field": "sales",
                        "type": "quantitative"
                    }
                    },
                    "stack": {
                    "description": "Controls stacking of marks. Use 'zero' (default) to stack, 'none' for grouped bar charts, and 'normalize' to stack to 100%.",
                    "example": "none"
                    },
                    "size": {
                    "description": "Size of marks (area, width, or length depending on mark type).",
                    "example": {
                        "field": "population",
                        "type": "quantitative"
                    }
                    },
                    "shape": {
                    "description": "Shape of point marks.",
                    "example": {
                        "field": "type",
                        "type": "nominal"
                    }
                    },
                    "angle": {
                    "description": "Rotation angle of point and text marks.",
                    "example": {
                        "field": "direction",
                        "type": "quantitative"
                    }
                    },
                    "fill": {
                    "description": "Fill color of marks.",
                    "example": {
                        "field": "region",
                        "type": "nominal"
                    }
                    },
                    "stroke": {
                    "description": "Stroke color of marks.",
                    "example": {
                        "field": "border",
                        "type": "nominal"
                    }
                    },
                    "fillOpacity": {
                    "description": "Fill opacity of marks.",
                    "example": {
                        "value": 0.5
                    }
                    },
                    "strokeOpacity": {
                    "description": "Stroke opacity of marks.",
                    "example": {
                        "value": 0.8
                    }
                    },
                    "text": {
                    "description": "Text content for text marks.",
                    "example": {
                        "field": "label",
                        "type": "nominal"
                    }
                    }
                },
                "mark": {
                    "type": {
                    "description": "The mark type to use (e.g., 'bar', 'line', 'point', 'area', 'circle', 'square', 'tick', 'rect', 'rule', 'text', 'geoshape', 'boxplot', 'errorbar', 'errorband').",
                    "example": "bar"
                    },
                    "fill": {
                    "description": "Default fill color. Has higher precedence than 'color'.",
                    "example": "#4682b4"
                    },
                    "stroke": {
                    "description": "Default stroke color. Has higher precedence than 'color'.",
                    "example": "#000000"
                    },
                    "fillOpacity": {
                    "description": "Fill opacity (value between 0 and 1).",
                    "example": 0.5
                    },
                    "strokeOpacity": {
                    "description": "Stroke opacity (value between 0 and 1).",
                    "example": 0.8
                    },
                    "strokeWidth": {
                    "description": "Stroke width in pixels.",
                    "example": 3
                    }
                },
                "chart size": {
                    "width": {
                    "description": "Width of the visualization in pixels.",
                    "example": 400
                    },
                    "height": {
                    "description": "Height of the visualization in pixels.",
                    "example": 300
                    }
                },
                "legend": {
                    "orient": {
                    "description": "Orientation/position of the legend ('left', 'right', 'top', 'bottom', 'none').",
                    "example": "right"
                    },
                    "direction": {
                    "description": "Direction of legend items ('vertical' or 'horizontal').",
                    "example": "vertical"
                    },
                    "title": {
                    "description": "Title for the legend.",
                    "example": "Category"
                    },
                    "fillColor": {
                    "description": "Background fill color for the full legend.",
                    "example": "#f9f9f9"
                    },
                    "strokeColor": {
                    "description": "Border stroke color for the full legend.",
                    "example": "#cccccc"
                    },
                    "padding": {
                    "description": "Padding between the border and content of the legend group.",
                    "example": 10
                    },
                    "cornerRadius": {
                    "description": "Corner radius for the full legend.",
                    "example": 4
                    },
                    "values": {
                    "description": "Explicitly set visible legend values.",
                    "example": [
                        "A",
                        "B",
                        "C"
                    ]
                    },
                    "titleFont": {
                    "description": "Font of the legend title.",
                    "example": "Arial"
                    },
                    "titleFontSize": {
                    "description": "Font size of the legend title.",
                    "example": 14
                    },
                    "titleColor": {
                    "description": "Color of the legend title.",
                    "example": "#333333"
                    },
                    "titlePadding": {
                    "description": "Padding between the legend title and legend content.",
                    "example": 8
                    },
                    "labelColor": {
                    "description": "Font color of legend items (labels).",
                    "example": "#333333"
                    }
                },
                "axis": {
                    "orient": {
                    "description": "Position of the axis ('top', 'bottom', 'left', 'right').",
                    "example": "bottom"
                    },
                    "title": {
                    "description": "Title for the axis.",
                    "example": "Year"
                    },
                    "titleAlign": {
                    "description": "Horizontal text alignment of axis titles.",
                    "example": "center"
                    },
                    "titleAnchor": {
                    "description": "Text anchor position for placing axis titles.",
                    "example": "middle"
                    },
                    "titleFont": {
                    "description": "Font of the axis title.",
                    "example": "Arial"
                    },
                    "titleFontSize": {
                    "description": "Font size of the axis title.",
                    "example": 14
                    },
                    "titleFontStyle": {
                    "description": "Font style of the axis title.",
                    "example": "italic"
                    },
                    "titleFontWeight": {
                    "description": "Font weight of the axis title.",
                    "example": "bold"
                    },
                    "titleColor": {
                    "description": "Color of the axis title.",
                    "example": "#333333"
                    },
                    "titlePadding": {
                    "description": "Padding between the axis title and axis.",
                    "example": 10
                    },
                    "ticks": {
                    "description": "Whether to show ticks on the axis.",
                    "example": true
                    },
                    "tickColor": {
                    "description": "Color of axis ticks.",
                    "example": "#444444"
                    },
                    "tickSize": {
                    "description": "Length in pixels of axis ticks.",
                    "example": 6
                    },
                    "tickWidth": {
                    "description": "Stroke width in pixels of axis ticks.",
                    "example": 1
                    },
                    "tickOpacity": {
                    "description": "Opacity of axis ticks (from 0 to 1).",
                    "example": 0.8
                    },
                    "tickCount": {
                    "description": "A desired number of ticks for continuous axes (not guaranteed).",
                    "example": 10
                    },
                    "tickBand": {
                    "description": "Position of ticks for band scales ('center' or 'extent').",
                    "example": "center"
                    },
                    "values": {
                    "description": "Explicitly set the tick values on the axis.",
                    "example": [
                        2000,
                        2005,
                        2010,
                        2015,
                        2020
                    ]
                    },
                    "labels": {
                    "description": "Whether to display axis tick labels.",
                    "example": true
                    },
                    "labelAngle": {
                    "description": "Rotation angle of axis tick labels in degrees.",
                    "example": 45
                    },
                    "labelAlign": {
                    "description": "Horizontal text alignment of axis labels.",
                    "example": "center"
                    },
                    "labelColor": {
                    "description": "Color of axis tick labels.",
                    "example": "#333333"
                    },
                    "labelFont": {
                    "description": "Font name for axis tick labels.",
                    "example": "Arial"
                    },
                    "labelFontSize": {
                    "description": "Font size in pixels for axis tick labels.",
                    "example": 12
                    },
                    "labelFontStyle": {
                    "description": "Font style for axis tick labels.",
                    "example": "italic"
                    },
                    "labelFontWeight": {
                    "description": "Font weight for axis tick labels.",
                    "example": "bold"
                    },
                    "labelOpacity": {
                    "description": "Opacity of axis tick labels.",
                    "example": 1
                    },
                    "labelOverlap": {
                    "description": "Strategy to reduce label overlap.",
                    "example": "greedy"
                    },
                    "labelPadding": {
                    "description": "Padding in pixels between axis and label.",
                    "example": 4
                    }
                },
                "grid": {
                    "show": {
                    "description": "Whether to display grid lines for the axis.",
                    "example": true
                    },
                    "color": {
                    "description": "Color of the grid lines.",
                    "example": "#dddddd"
                    },
                    "opacity": {
                    "description": "Opacity of the grid lines (0 to 1).",
                    "example": 0.3
                    },
                    "width": {
                    "description": "Stroke width of the grid lines in pixels.",
                    "example": 1
                    },
                    "dash": {
                    "description": "Dash pattern for the grid lines (e.g., [4,2] for dashed lines).",
                    "example": [
                        4,
                        2
                    ]
                    },
                    "dashOffset": {
                    "description": "Offset in pixels for dash pattern start.",
                    "example": 0
                    },
                    "bandPosition": {
                    "description": "For band scales, position of grid lines in each band (0-1, e.g., 0.5 = center).",
                    "example": 0.5
                    },
                    "scale": {
                    "description": "Name of the scale the grid lines are based on (useful in dual-axis charts).",
                    "example": "y"
                    }
                },
                "title": {
                    "text": {
                    "description": "Main title text for the chart.",
                    "example": "A Simple Bar Chart"
                    },
                    "subtitle": {
                    "description": "Subtitle text for the chart.",
                    "example": "Data from 2020"
                    },
                    "anchor": {
                    "description": "Anchor position for the title ('start', 'middle', 'end').",
                    "example": "start"
                    },
                    "align": {
                    "description": "Horizontal text alignment for title text.",
                    "example": "center"
                    },
                    "color": {
                    "description": "Text color for title text.",
                    "example": "#222222"
                    },
                    "font": {
                    "description": "Font name for title text.",
                    "example": "Arial"
                    },
                    "fontSize": {
                    "description": "Font size in pixels for title text.",
                    "example": 18
                    },
                    "fontStyle": {
                    "description": "Font style for title text.",
                    "example": "italic"
                    },
                    "fontWeight": {
                    "description": "Font weight for title text.",
                    "example": "bold"
                    },
                    "orient": {
                    "description": "Default title orientation.",
                    "example": "top"
                    },
                    "subtitleColor": {
                    "description": "Text color for subtitle text.",
                    "example": "#666666"
                    },
                    "subtitleFont": {
                    "description": "Font name for subtitle text.",
                    "example": "Arial"
                    },
                    "subtitleFontSize": {
                    "description": "Font size in pixels for subtitle text.",
                    "example": 14
                    },
                    "subtitleFontStyle": {
                    "description": "Font style for subtitle text.",
                    "example": "italic"
                    },
                    "subtitleFontWeight": {
                    "description": "Font weight for subtitle text.",
                    "example": "normal"
                    },
                    "subtitlePadding": {
                    "description": "Padding in pixels between title and subtitle text.",
                    "example": 6
                    }
                },
                "config": {
                    "background": {
                    "description": "CSS color property for the chart background.",
                    "example": "#ffffff"
                    },
                    "view": {
                    "fill": {
                        "description": "Background color for the chart's plotting area (view rectangle).",
                        "example": "#eeeeee"
                    },
                    "stroke": {
                        "description": "Border color of the chart's plotting area (view rectangle). This controls the chart border color.",
                        "example": "#000000"
                    }
                }
            }

            ## Part 2 - Transform a Visualization (Input) into a Design-Aware Visualization (Output) based on Example Charts (uploaded in Part 1) and corresponding User Instructions.
            After completing the extraction in Part 1, read the user's natural language instructions describing which styles to extract (or not) from which charts and how to combine or apply them into the input visualization. Examples of such instructions include:

            - "Use everything (i.e., all designs (styling and layout) from this chart)."
            - "Use the font style (size, family, and weight) of axis labels."
            - "Use the gridline style."
            - "Use the legend layout and styling but place it on the left instead."

            ### Main requirements:
            - Apply all instructions to the input visualization (available in the 'vlSpec' property value) and generate a new Vega-Lite chart specification under a new property called 'vlSpec_design', and insert it at the same level as 'vlSpec' in the output JSON.
            - Ensure a complete, correct Vega-Lite specification with valid properties.
            - Note, you are only applying design aspects (i.e., styles, layouts, and positions) into the output visualization; you are NOT supposed to use any content (e.g., data or texts of titles, subtitles, labels) from the charts that are uploaded as design context. For example, if an instruction is to extract style and layout of the title, you must extract only those, but come up with an intuitive title based on the visualization encodings and the actual dataset.
            - There may be more than one chart uploaded along with corresponding natural language instructions; these will be available in a sequence of chart-text pairs, i.e., chart 1-text 1-chart 2-text 2-chart 3-text 3 and so on. You must process these accordingly but still generate exactly one design-aware visualization as output.
            - Insert a new property called "design_checklist", at the same level as 'vlSpec' in the output JSON, with a copy of the input design context amd instructions provided by the user, i.e., the example charts and/or natural language-based 'text' instructions. This is essentially a structured list of items that the user asked. You can follow the below syntax (note: this is only an example): 

                "design_checklist": [{
                        "type": "chart",
                        "name": "chart 1",
                        "content": ["Use everything except legend's styling."]
                    },
                    {
                        "type": "chart",
                        "name": "chart 2",
                        "content": ["Use legend's styling."]
                    },
                    {
                        "type": "text",
                        "text": ["Do not include a legend title."]
                    }
                ]

            - Insert a new property called "design_successlist", at the same level as 'vlSpec' in the output JSON, with a structured record of all design aspects you extracted from the uploaded example charts and/or applied to the input chart. Follow the below syntax:

                "design_successlist": {
                    { "type": "chart", "name": "chart 1", "content": ["Used font styles.", "Used axes styles."] },
                    { "type": "chart", "name": "chart 2", "content": ["Used legend layout and style."] },
                    { "type": "text", "content": ["Removed chart title.", "Removed ticks on both axes."] },
                }

            - In the input visualization, the design elements including title, subtitle, legend, axes labels, ticks, backgrounds, etc, are generally Vega-Lite defaults and no special setting was done on them; thus, feel free to modify these based on user's design instructions without hesitation. However, don't add new design aspects, unless explicitly asked.
            - Note that not all design aspects can be extracted or applied. This may be because of visualization design principles, e.g., if a correlation task is being visualized, then a scatterplot is a correct choice; a user's instruction to change to a barchart is not correct, and should not be considered. Additionally, conflicts may arise when trying to modify the input visualization's design based on user's natural language instructions to modify this design. For example, if chart 1's instructions ask adding a title but chart 2's instructions ask removing one, then it is a conflict. Another conflict could arise when the example chart has only blue-colored marks but the input visualization has two types of mark colors (each color corresponding to one category). In such scenarios, try your best to resolve the conflicts WITHOUT compromising the intent and effectiveness of the input visualization. If a conflict cannot be resolved, do NOT override the input visualization's design; instead, Insert a new property called "design_failurelist", at the same level as 'vlSpec' in the output JSON, with a record of what design aspects could not be extracted or applied due to conflicts or errors. Follow the below syntax:

                "design_failurelist": {
                    { "type": "chart", "name": "chart 1", "content": ["Could not use color scheme."] },
                    { "type": "text", "content": ["Cannot change to bar chart."] }
                }

            - Ensure that the 'design_successlist' will keep a record of all successfully extracted and applied designs and the 'design_failurelist' will keep a record of all associated errors and conflicts.

            ### Additional requirements:
            - Generate exactly one, valid Vega-Lite JSON specification.
            - For any style properties not mentioned in the user's instructions, use Vega-Lite's default values.
            - Strictly select and apply only the extracted styles explicitly requested by the user.
            - Use "data": { "values": [] } as a placeholder if the actual data is unknown.
            - Do not hallucinate or infer any properties that are not visible in the chart images or not extracted in Part 1. You can only add properties if they are necessary for the properties listed in Part 1.

            # Final Output
            - Output a consolidated JSON including the input specification comprising dataset and query information, output specification comprising attributeList, taskMap, and visList, and the new design-focused properties 'vlSpec_design', 'design_checklist', 'design_successlist', and 'design_failurelist'. You are supposed to put all of these properties at the same nesting level in the output JSON. Do not miss any single property and always stay consistent with the output format.
            - Do not output intermediate extraction data or explanations.
        }
        """
