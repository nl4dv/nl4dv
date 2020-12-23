queryMap = {
  "fullyspecified-attributes-tasks-vis": [
    {
      "queryId": 1,
      "query": "show me a scatter plot of budget and gross for romantic comedy movies released between 1990 and 2000",
      "output": {
        "status": "SUCCESS",
        "debug": {
          "execution_durations": {
            "clean_query": 0.020389795303344727,
            "extract_attributes": 2.7125611305236816,
            "extract_vis_type": 0.0000438690185546875,
            "extract_tasks": 1.2303800582885742,
            "get_vis_list": 0.00020194053649902344,
            "total": 3.9635767936706543
          }
        },
        "query_raw": "show me a scatter plot of budget and gross for romantic comedy movies released between 1990 and 2000",
        "query": "show me a scatter plot of budget and gross for romantic comedy movies released between 1990 and 2000",
        "dataset": "https://raw.githubusercontent.com/nl4dv/nl4dv/master/examples/assets/data/movies-w-year.csv",
        "alias": "https://raw.githubusercontent.com/nl4dv/nl4dv/master/examples/assets/aliases/movies-w-year.json",
        "visList": [
          {
            "score": 7.3,
            "scoreObj": {
              "by_attributes": 1.8,
              "by_task": 2.5,
              "by_vis": 1
            },
            "confidenceObj": {
              "Worldwide Gross": 1,
              "Production Budget": 1
            },
            "attributes": [
              "Worldwide Gross",
              "Production Budget"
            ],
            "queryPhrase": "scatter plot",
            "visType": "scatterplot",
            "tasks": [
              "filter",
              "correlation"
            ],
            "inferenceType": "explicit",
            "vlSpec": {
              "$schema": "https://vega.github.io/schema/vega-lite/v4.json",
              "mark": {
                "type": "point",
                "tooltip": true
              },
              "encoding": {
                "x": {
                  "field": "Worldwide Gross",
                  "type": "quantitative",
                  "aggregate": null,
                  "axis": {
                    "format": "s"
                  }
                },
                "y": {
                  "field": "Production Budget",
                  "type": "quantitative",
                  "aggregate": null,
                  "axis": {
                    "format": "s"
                  }
                },
                "tooltip": {
                  "field": "Title"
                }
              },
              "transform": [
                {
                  "filter": {
                    "field": "Release Year",
                    "range": [
                      "1990/01/01",
                      "2000/01/01"
                    ]
                  }
                },
                {
                  "filter": {
                    "field": "Genre",
                    "oneOf": [
                      "Romantic Comedy"
                    ]
                  }
                }
              ],
              "data": {
                "url": "https://raw.githubusercontent.com/nl4dv/nl4dv/master/examples/assets/data/movies-w-year.csv",
                "format": {
                  "type": "csv"
                }
              }
            }
          }
        ],
        "attributeMap": {
          "Worldwide Gross": {
            "name": "Worldwide Gross",
            "queryPhrase": [
              "gross"
            ],
            "inferenceType": "explicit",
            "matchScore": 0.9,
            "metric": [
              "attribute_similarity_match"
            ],
            "isLabel": false,
            "encode": true,
            "isAmbiguous": false,
            "ambiguity": [],
            "meta": {
              "score": 100,
              "threshold": 85,
              "alias": null,
              "ambiguity": {},
              "confidence": 100
            }
          },
          "Production Budget": {
            "name": "Production Budget",
            "queryPhrase": [
              "budget"
            ],
            "inferenceType": "explicit",
            "matchScore": 0.9,
            "metric": [
              "attribute_similarity_match"
            ],
            "isLabel": false,
            "encode": true,
            "isAmbiguous": false,
            "ambiguity": [],
            "meta": {
              "score": 100,
              "threshold": 85,
              "alias": null,
              "ambiguity": {},
              "confidence": 100
            }
          },
          "Release Year": {
            "name": "Release Year",
            "queryPhrase": [
              "released"
            ],
            "inferenceType": "explicit",
            "matchScore": 0.9,
            "metric": [
              "attribute_similarity_match"
            ],
            "isLabel": false,
            "encode": false,
            "isAmbiguous": false,
            "ambiguity": [],
            "meta": {
              "score": 100,
              "threshold": 85,
              "alias": null,
              "ambiguity": {},
              "confidence": 100
            }
          },
          "Genre": {
            "name": "Genre",
            "queryPhrase": [
              "romantic comedy"
            ],
            "inferenceType": "implicit",
            "matchScore": 0.5,
            "metric": [
              "attribute_domain_value_match"
            ],
            "isLabel": false,
            "isAmbiguous": false,
            "ambiguity": [],
            "encode": false,
            "meta": {
              "score": null,
              "threshold": null,
              "alias": null,
              "ambiguity": {
                "romantic comedy": [
                  "Romantic Comedy"
                ]
              },
              "confidence": 100
            }
          }
        },
        "taskMap": {
          "filter": [
            {
              "task": "filter",
              "queryPhrase": "between",
              "operator": "RANGE",
              "values": [
                "1990/01/01",
                "2000/01/01"
              ],
              "matchScore": 1,
              "attributes": [
                "Release Year"
              ],
              "inferenceType": "explicit",
              "isAttrAmbiguous": false,
              "isValueAmbiguous": false,
              "meta": {
                "value_ambiguity_type": null
              }
            },
            {
              "task": "filter",
              "queryPhrase": [
                "romantic comedy"
              ],
              "operator": "IN",
              "values": [
                "Romantic Comedy"
              ],
              "matchScore": 1,
              "attributes": [
                "Genre"
              ],
              "inferenceType": "explicit",
              "isAttrAmbiguous": false,
              "isValueAmbiguous": false,
              "meta": {
                "value_ambiguity_type": null
              }
            }
          ],
          "correlation": [
            {
              "task": "correlation",
              "queryPhrase": [],
              "operator": null,
              "values": null,
              "matchScore": 0.5,
              "attributes": [
                "Worldwide Gross",
                "Production Budget"
              ],
              "inferenceType": "implicit",
              "isAttrAmbiguous": false,
              "isValueAmbiguous": false,
              "meta": {
                "value_ambiguity_type": null
              }
            }
          ]
        },
        "followUpQuery": false,
        "contextObj": null
      }
    },
    {
      "queryId": 2,
      "query": "show me the budget and gross for adventure movies released since 2000/1/1 as a scatterplot",
      "output": {
        "status": "SUCCESS",
        "debug": {
          "execution_durations": {
            "clean_query": 0.011708974838256836,
            "extract_attributes": 0.9343299865722656,
            "extract_vis_type": 0.00005316734313964844,
            "extract_tasks": 1.0489559173583984,
            "get_vis_list": 0.00020074844360351562,
            "total": 1.995248794555664
          }
        },
        "query_raw": "show me the budget and gross for adventure movies released since 2000/1/1 as a scatterplot",
        "query": "show me the budget and gross for adventure movies released since 2000/1/1 as a scatterplot",
        "dataset": "https://raw.githubusercontent.com/nl4dv/nl4dv/master/examples/assets/data/movies-w-year.csv",
        "alias": "https://raw.githubusercontent.com/nl4dv/nl4dv/master/examples/assets/aliases/movies-w-year.json",
        "visList": [
          {
            "score": 7.3,
            "scoreObj": {
              "by_attributes": 1.8,
              "by_task": 2.5,
              "by_vis": 1
            },
            "confidenceObj": {
              "Worldwide Gross": 1,
              "Production Budget": 1
            },
            "attributes": [
              "Worldwide Gross",
              "Production Budget"
            ],
            "queryPhrase": "scatterplot",
            "visType": "scatterplot",
            "tasks": [
              "filter",
              "correlation"
            ],
            "inferenceType": "explicit",
            "vlSpec": {
              "$schema": "https://vega.github.io/schema/vega-lite/v4.json",
              "mark": {
                "type": "point",
                "tooltip": true
              },
              "encoding": {
                "x": {
                  "field": "Worldwide Gross",
                  "type": "quantitative",
                  "aggregate": null,
                  "axis": {
                    "format": "s"
                  }
                },
                "y": {
                  "field": "Production Budget",
                  "type": "quantitative",
                  "aggregate": null,
                  "axis": {
                    "format": "s"
                  }
                },
                "tooltip": {
                  "field": "Title"
                }
              },
              "transform": [
                {
                  "filter": "lower(datum[\"Release Year\"]) > \"2000/01/01\""
                },
                {
                  "filter": {
                    "field": "Genre",
                    "oneOf": [
                      "Adventure"
                    ]
                  }
                }
              ],
              "data": {
                "url": "https://raw.githubusercontent.com/nl4dv/nl4dv/master/examples/assets/data/movies-w-year.csv",
                "format": {
                  "type": "csv"
                }
              }
            }
          }
        ],
        "attributeMap": {
          "Worldwide Gross": {
            "name": "Worldwide Gross",
            "queryPhrase": [
              "gross"
            ],
            "inferenceType": "explicit",
            "matchScore": 0.9,
            "metric": [
              "attribute_similarity_match"
            ],
            "isLabel": false,
            "encode": true,
            "isAmbiguous": false,
            "ambiguity": [],
            "meta": {
              "score": 100,
              "threshold": 85,
              "alias": null,
              "ambiguity": {},
              "confidence": 100
            }
          },
          "Production Budget": {
            "name": "Production Budget",
            "queryPhrase": [
              "budget"
            ],
            "inferenceType": "explicit",
            "matchScore": 0.9,
            "metric": [
              "attribute_similarity_match"
            ],
            "isLabel": false,
            "encode": true,
            "isAmbiguous": false,
            "ambiguity": [],
            "meta": {
              "score": 100,
              "threshold": 85,
              "alias": null,
              "ambiguity": {},
              "confidence": 100
            }
          },
          "Release Year": {
            "name": "Release Year",
            "queryPhrase": [
              "released"
            ],
            "inferenceType": "explicit",
            "matchScore": 0.9,
            "metric": [
              "attribute_similarity_match"
            ],
            "isLabel": false,
            "encode": false,
            "isAmbiguous": false,
            "ambiguity": [],
            "meta": {
              "score": 100,
              "threshold": 85,
              "alias": null,
              "ambiguity": {},
              "confidence": 100
            }
          },
          "Genre": {
            "name": "Genre",
            "queryPhrase": [
              "adventure"
            ],
            "inferenceType": "implicit",
            "matchScore": 0.5,
            "metric": [
              "attribute_domain_value_match"
            ],
            "isLabel": false,
            "isAmbiguous": false,
            "ambiguity": [],
            "encode": false,
            "meta": {
              "score": null,
              "threshold": null,
              "alias": null,
              "ambiguity": {
                "adventure": [
                  "Adventure"
                ]
              },
              "confidence": 100
            }
          }
        },
        "taskMap": {
          "filter": [
            {
              "task": "filter",
              "queryPhrase": "since",
              "operator": "GT",
              "values": [
                "2000/01/01"
              ],
              "matchScore": 1,
              "attributes": [
                "Release Year"
              ],
              "inferenceType": "explicit",
              "isAttrAmbiguous": false,
              "isValueAmbiguous": false,
              "meta": {
                "value_ambiguity_type": null
              }
            },
            {
              "task": "filter",
              "queryPhrase": [
                "adventure"
              ],
              "operator": "IN",
              "values": [
                "Adventure"
              ],
              "matchScore": 1,
              "attributes": [
                "Genre"
              ],
              "inferenceType": "explicit",
              "isAttrAmbiguous": false,
              "isValueAmbiguous": false,
              "meta": {
                "value_ambiguity_type": null
              }
            }
          ],
          "correlation": [
            {
              "task": "correlation",
              "queryPhrase": [],
              "operator": null,
              "values": null,
              "matchScore": 0.5,
              "attributes": [
                "Worldwide Gross",
                "Production Budget"
              ],
              "inferenceType": "implicit",
              "isAttrAmbiguous": false,
              "isValueAmbiguous": false,
              "meta": {
                "value_ambiguity_type": null
              }
            }
          ]
        },
        "followUpQuery": false,
        "contextObj": null
      }
    },
    {
      "queryId": 3,
      "query": "what was the total gross of the Harry Potter franchise as a barchart?",
      "output": {
        "status": "SUCCESS",
        "debug": {
          "execution_durations": {
            "clean_query": 0.004517793655395508,
            "extract_attributes": 0.5713860988616943,
            "extract_vis_type": 0.00002574920654296875,
            "extract_tasks": 0.9957571029663086,
            "get_vis_list": 0.00023293495178222656,
            "total": 1.5719196796417236
          }
        },
        "query_raw": "what was the total gross of the Harry Potter franchise as a barchart?",
        "query": "what was the total gross of the harry potter franchise as a barchart ?",
        "dataset": "https://raw.githubusercontent.com/nl4dv/nl4dv/master/examples/assets/data/movies-w-year.csv",
        "alias": "https://raw.githubusercontent.com/nl4dv/nl4dv/master/examples/assets/aliases/movies-w-year.json",
        "visList": [
          {
            "score": 4.9,
            "scoreObj": {
              "by_attributes": 0.9,
              "by_task": 2,
              "by_vis": 1
            },
            "confidenceObj": {
              "Worldwide Gross": 1
            },
            "attributes": [
              "Worldwide Gross"
            ],
            "queryPhrase": "barchart",
            "visType": "barchart",
            "tasks": [
              "derived_value",
              "filter"
            ],
            "inferenceType": "explicit",
            "vlSpec": {
              "$schema": "https://vega.github.io/schema/vega-lite/v4.json",
              "mark": {
                "type": "bar",
                "tooltip": true
              },
              "encoding": {
                "x": {
                  "field": "Worldwide Gross",
                  "type": "quantitative",
                  "aggregate": "sum",
                  "axis": {
                    "format": "s"
                  }
                }
              },
              "transform": [
                {
                  "filter": {
                    "field": "Title",
                    "oneOf": [
                      "Harry Potter and the Order of the Phoenix",
                      "Harry Potter and the Half-Blood Prince",
                      "Harry Potter and the Prisoner of Azkaban",
                      "Harry Potter and the Goblet of Fire",
                      "Harry Potter and the Chamber of Secrets"
                    ]
                  }
                }
              ],
              "data": {
                "url": "https://raw.githubusercontent.com/nl4dv/nl4dv/master/examples/assets/data/movies-w-year.csv",
                "format": {
                  "type": "csv"
                }
              }
            }
          }
        ],
        "attributeMap": {
          "Worldwide Gross": {
            "name": "Worldwide Gross",
            "queryPhrase": [
              "gross"
            ],
            "inferenceType": "explicit",
            "matchScore": 0.9,
            "metric": [
              "attribute_similarity_match"
            ],
            "isLabel": false,
            "encode": true,
            "isAmbiguous": false,
            "ambiguity": [],
            "meta": {
              "score": 100,
              "threshold": 85,
              "alias": null,
              "ambiguity": {},
              "confidence": 100
            }
          },
          "Title": {
            "name": "Title",
            "queryPhrase": [
              "harry potter"
            ],
            "inferenceType": "implicit",
            "matchScore": 0.5,
            "metric": [
              "attribute_domain_value_match"
            ],
            "isLabel": true,
            "isAmbiguous": false,
            "ambiguity": [],
            "encode": false,
            "meta": {
              "score": null,
              "threshold": null,
              "alias": null,
              "ambiguity": {
                "harry potter": [
                  "Harry Potter and the Order of the Phoenix",
                  "Harry Potter and the Half-Blood Prince",
                  "Harry Potter and the Prisoner of Azkaban",
                  "Harry Potter and the Goblet of Fire",
                  "Harry Potter and the Chamber of Secrets"
                ]
              },
              "confidence": 100
            }
          }
        },
        "taskMap": {
          "derived_value": [
            {
              "task": "derived_value",
              "queryPhrase": "total",
              "operator": "SUM",
              "values": [],
              "matchScore": 1,
              "attributes": [
                "Worldwide Gross"
              ],
              "inferenceType": "explicit",
              "isAttrAmbiguous": false,
              "isValueAmbiguous": false,
              "meta": {
                "value_ambiguity_type": null
              }
            }
          ],
          "filter": [
            {
              "task": "filter",
              "queryPhrase": [
                "harry potter"
              ],
              "operator": "IN",
              "values": [
                "Harry Potter and the Order of the Phoenix",
                "Harry Potter and the Half-Blood Prince",
                "Harry Potter and the Prisoner of Azkaban",
                "Harry Potter and the Goblet of Fire",
                "Harry Potter and the Chamber of Secrets"
              ],
              "matchScore": 1,
              "attributes": [
                "Title"
              ],
              "inferenceType": "explicit",
              "isAttrAmbiguous": false,
              "isValueAmbiguous": true,
              "meta": {
                "value_ambiguity_type": "domain_value"
              }
            }
          ]
        },
        "followUpQuery": false,
        "contextObj": null
      }
    },
    {
      "queryId": 4,
      "query": "show me distribution of gross as a strip plot",
      "output": {
        "status": "SUCCESS",
        "debug": {
          "execution_durations": {
            "clean_query": 0.002777099609375,
            "extract_attributes": 0.3132050037384033,
            "extract_vis_type": 0.00002002716064453125,
            "extract_tasks": 1.0496878623962402,
            "get_vis_list": 0.00024890899658203125,
            "total": 1.3659389019012451
          }
        },
        "query_raw": "show me distribution of gross as a strip plot",
        "query": "show me distribution of gross as a strip plot",
        "dataset": "https://raw.githubusercontent.com/nl4dv/nl4dv/master/examples/assets/data/movies-w-year.csv",
        "alias": "https://raw.githubusercontent.com/nl4dv/nl4dv/master/examples/assets/aliases/movies-w-year.json",
        "visList": [
          {
            "score": 3.9,
            "scoreObj": {
              "by_attributes": 0.9,
              "by_task": 1,
              "by_vis": 1
            },
            "confidenceObj": {
              "Worldwide Gross": 1
            },
            "attributes": [
              "Worldwide Gross"
            ],
            "queryPhrase": "strip plot",
            "visType": "stripplot",
            "tasks": [
              "distribution"
            ],
            "inferenceType": "explicit",
            "vlSpec": {
              "$schema": "https://vega.github.io/schema/vega-lite/v4.json",
              "mark": {
                "type": "tick",
                "tooltip": true
              },
              "encoding": {
                "x": {
                  "field": "Worldwide Gross",
                  "type": "quantitative",
                  "aggregate": null,
                  "axis": {
                    "format": "s"
                  }
                },
                "tooltip": {
                  "field": "Title"
                }
              },
              "transform": [],
              "data": {
                "url": "https://raw.githubusercontent.com/nl4dv/nl4dv/master/examples/assets/data/movies-w-year.csv",
                "format": {
                  "type": "csv"
                }
              }
            }
          }
        ],
        "attributeMap": {
          "Worldwide Gross": {
            "name": "Worldwide Gross",
            "queryPhrase": [
              "gross"
            ],
            "inferenceType": "explicit",
            "matchScore": 0.9,
            "metric": [
              "attribute_similarity_match"
            ],
            "isLabel": false,
            "encode": true,
            "isAmbiguous": false,
            "ambiguity": [],
            "meta": {
              "score": 100,
              "threshold": 85,
              "alias": null,
              "ambiguity": {},
              "confidence": 100
            }
          }
        },
        "taskMap": {
          "distribution": [
            {
              "task": "distribution",
              "queryPhrase": "distribution",
              "operator": null,
              "values": [],
              "matchScore": 1,
              "attributes": [
                "Worldwide Gross"
              ],
              "inferenceType": "explicit",
              "isAttrAmbiguous": false,
              "isValueAmbiguous": false,
              "meta": {
                "value_ambiguity_type": null
              }
            }
          ]
        },
        "followUpQuery": false,
        "contextObj": null
      }
    },
    {
      "queryId": 5,
      "query": "visualize the distribution of budget as a histogram",
      "output": {
        "status": "SUCCESS",
        "debug": {
          "execution_durations": {
            "clean_query": 0.002341032028198242,
            "extract_attributes": 0.17005705833435059,
            "extract_vis_type": 0.0000152587890625,
            "extract_tasks": 1.0460360050201416,
            "get_vis_list": 0.0002357959747314453,
            "total": 1.2186851501464844
          }
        },
        "query_raw": "visualize the distribution of budget as a histogram",
        "query": "visualize the distribution of budget as a histogram",
        "dataset": "https://raw.githubusercontent.com/nl4dv/nl4dv/master/examples/assets/data/movies-w-year.csv",
        "alias": "https://raw.githubusercontent.com/nl4dv/nl4dv/master/examples/assets/aliases/movies-w-year.json",
        "visList": [
          {
            "score": 3.9,
            "scoreObj": {
              "by_attributes": 0.9,
              "by_task": 1,
              "by_vis": 1
            },
            "confidenceObj": {
              "Production Budget": 1
            },
            "attributes": [
              "Production Budget"
            ],
            "queryPhrase": "histogram",
            "visType": "histogram",
            "tasks": [
              "distribution"
            ],
            "inferenceType": "explicit",
            "vlSpec": {
              "$schema": "https://vega.github.io/schema/vega-lite/v4.json",
              "mark": {
                "type": "bar",
                "tooltip": true
              },
              "encoding": {
                "x": {
                  "field": "Production Budget",
                  "type": "quantitative",
                  "aggregate": null,
                  "bin": true,
                  "axis": {
                    "format": "s"
                  }
                },
                "y": {
                  "field": "Production Budget",
                  "type": "quantitative",
                  "aggregate": "count",
                  "axis": {
                    "format": "s"
                  }
                }
              },
              "transform": [],
              "data": {
                "url": "https://raw.githubusercontent.com/nl4dv/nl4dv/master/examples/assets/data/movies-w-year.csv",
                "format": {
                  "type": "csv"
                }
              }
            }
          }
        ],
        "attributeMap": {
          "Production Budget": {
            "name": "Production Budget",
            "queryPhrase": [
              "budget"
            ],
            "inferenceType": "explicit",
            "matchScore": 0.9,
            "metric": [
              "attribute_similarity_match"
            ],
            "isLabel": false,
            "encode": true,
            "isAmbiguous": false,
            "ambiguity": [],
            "meta": {
              "score": 100,
              "threshold": 85,
              "alias": null,
              "ambiguity": {},
              "confidence": 100
            }
          }
        },
        "taskMap": {
          "distribution": [
            {
              "task": "distribution",
              "queryPhrase": "distribution",
              "operator": null,
              "values": [],
              "matchScore": 1,
              "attributes": [
                "Production Budget"
              ],
              "inferenceType": "explicit",
              "isAttrAmbiguous": false,
              "isValueAmbiguous": false,
              "meta": {
                "value_ambiguity_type": null
              }
            }
          ]
        },
        "followUpQuery": false,
        "contextObj": null
      }
    },
    {
      "queryId": 6,
      "query": "total budget across genres as a piechart",
      "output": {
        "status": "SUCCESS",
        "debug": {
          "execution_durations": {
            "clean_query": 0.0033028125762939453,
            "extract_attributes": 0.23618793487548828,
            "extract_vis_type": 0.000025033950805664062,
            "extract_tasks": 1.0069429874420166,
            "get_vis_list": 0.00026988983154296875,
            "total": 1.2467286586761475
          }
        },
        "query_raw": "total budget across genres as a piechart",
        "query": "total budget across genres as a piechart",
        "dataset": "https://raw.githubusercontent.com/nl4dv/nl4dv/master/examples/assets/data/movies-w-year.csv",
        "alias": "https://raw.githubusercontent.com/nl4dv/nl4dv/master/examples/assets/aliases/movies-w-year.json",
        "visList": [
          {
            "score": 5.9,
            "scoreObj": {
              "by_attributes": 1.9,
              "by_task": 1,
              "by_vis": 1
            },
            "confidenceObj": {
              "Production Budget": 1,
              "Genre": 1
            },
            "attributes": [
              "Production Budget",
              "Genre"
            ],
            "queryPhrase": "piechart",
            "visType": "piechart",
            "tasks": [
              "derived_value"
            ],
            "inferenceType": "explicit",
            "vlSpec": {
              "$schema": "https://vega.github.io/schema/vega-lite/v4.json",
              "mark": {
                "type": "arc",
                "tooltip": true
              },
              "encoding": {
                "theta": {
                  "field": "Production Budget",
                  "type": "quantitative",
                  "aggregate": "sum"
                },
                "color": {
                  "field": "Genre",
                  "type": "nominal",
                  "aggregate": null
                }
              },
              "transform": [],
              "data": {
                "url": "https://raw.githubusercontent.com/nl4dv/nl4dv/master/examples/assets/data/movies-w-year.csv",
                "format": {
                  "type": "csv"
                }
              }
            }
          }
        ],
        "attributeMap": {
          "Genre": {
            "name": "Genre",
            "queryPhrase": [
              "genres"
            ],
            "inferenceType": "explicit",
            "matchScore": 1,
            "metric": [
              "attribute_exact_match"
            ],
            "isLabel": false,
            "encode": true,
            "isAmbiguous": false,
            "ambiguity": [],
            "meta": {
              "score": 100,
              "threshold": 85,
              "alias": null,
              "ambiguity": {},
              "confidence": 100
            }
          },
          "Production Budget": {
            "name": "Production Budget",
            "queryPhrase": [
              "budget"
            ],
            "inferenceType": "explicit",
            "matchScore": 0.9,
            "metric": [
              "attribute_similarity_match"
            ],
            "isLabel": false,
            "encode": true,
            "isAmbiguous": false,
            "ambiguity": [],
            "meta": {
              "score": 100,
              "threshold": 85,
              "alias": null,
              "ambiguity": {},
              "confidence": 100
            }
          }
        },
        "taskMap": {
          "derived_value": [
            {
              "task": "derived_value",
              "queryPhrase": "total",
              "operator": "SUM",
              "values": [],
              "matchScore": 1,
              "attributes": [
                "Production Budget"
              ],
              "inferenceType": "explicit",
              "isAttrAmbiguous": false,
              "isValueAmbiguous": false,
              "meta": {
                "value_ambiguity_type": null
              }
            },
            {
              "task": "derived_value",
              "queryPhrase": "total",
              "operator": "SUM",
              "values": [],
              "matchScore": 1,
              "attributes": [
                "Genre"
              ],
              "inferenceType": "explicit",
              "isAttrAmbiguous": false,
              "isValueAmbiguous": true,
              "meta": {
                "value_ambiguity_type": "datatype"
              }
            }
          ]
        },
        "followUpQuery": false,
        "contextObj": null
      }
    },
    {
      "queryId": 7,
      "query": "show me an area chart of how comedy movies evolved over the years",
      "output": {
        "status": "SUCCESS",
        "debug": {
          "execution_durations": {
            "clean_query": 0.003905057907104492,
            "extract_attributes": 0.3851909637451172,
            "extract_vis_type": 0.000024080276489257812,
            "extract_tasks": 1.0013761520385742,
            "get_vis_list": 0.00018310546875,
            "total": 1.3906793594360352
          }
        },
        "query_raw": "show me an area chart of how comedy movies evolved over the years",
        "query": "show me an area chart of how comedy movies evolved over the years",
        "dataset": "https://raw.githubusercontent.com/nl4dv/nl4dv/master/examples/assets/data/movies-w-year.csv",
        "alias": "https://raw.githubusercontent.com/nl4dv/nl4dv/master/examples/assets/aliases/movies-w-year.json",
        "visList": [
          {
            "score": 3.9,
            "scoreObj": {
              "by_attributes": 0.9,
              "by_task": 1,
              "by_vis": 1
            },
            "confidenceObj": {
              "Release Year": 1
            },
            "attributes": [
              "Release Year"
            ],
            "queryPhrase": "area chart",
            "visType": "areachart",
            "tasks": [
              "filter",
              "trend"
            ],
            "inferenceType": "explicit",
            "vlSpec": {
              "$schema": "https://vega.github.io/schema/vega-lite/v4.json",
              "mark": {
                "type": "area",
                "tooltip": true
              },
              "encoding": {
                "x": {
                  "field": "Release Year",
                  "type": "temporal",
                  "aggregate": null
                },
                "y": {
                  "field": "Release Year",
                  "type": "temporal",
                  "aggregate": "count"
                }
              },
              "transform": [
                {
                  "filter": {
                    "field": "Genre",
                    "oneOf": [
                      "Black Comedy",
                      "Romantic Comedy",
                      "Comedy"
                    ]
                  }
                }
              ],
              "data": {
                "url": "https://raw.githubusercontent.com/nl4dv/nl4dv/master/examples/assets/data/movies-w-year.csv",
                "format": {
                  "type": "csv"
                }
              }
            }
          }
        ],
        "attributeMap": {
          "Release Year": {
            "name": "Release Year",
            "queryPhrase": [
              "years"
            ],
            "inferenceType": "explicit",
            "matchScore": 0.9,
            "metric": [
              "attribute_similarity_match"
            ],
            "isLabel": false,
            "encode": true,
            "isAmbiguous": false,
            "ambiguity": [],
            "meta": {
              "score": 100,
              "threshold": 85,
              "alias": null,
              "ambiguity": {},
              "confidence": 100
            }
          },
          "Genre": {
            "name": "Genre",
            "queryPhrase": [
              "comedy"
            ],
            "inferenceType": "implicit",
            "matchScore": 0.5,
            "metric": [
              "attribute_domain_value_match"
            ],
            "isLabel": false,
            "isAmbiguous": false,
            "ambiguity": [],
            "encode": false,
            "meta": {
              "score": null,
              "threshold": null,
              "alias": null,
              "ambiguity": {
                "comedy": [
                  "Black Comedy",
                  "Romantic Comedy",
                  "Comedy"
                ]
              },
              "confidence": 100
            }
          }
        },
        "taskMap": {
          "filter": [
            {
              "task": "filter",
              "queryPhrase": [
                "comedy"
              ],
              "operator": "IN",
              "values": [
                "Black Comedy",
                "Romantic Comedy",
                "Comedy"
              ],
              "matchScore": 1,
              "attributes": [
                "Genre"
              ],
              "inferenceType": "explicit",
              "isAttrAmbiguous": false,
              "isValueAmbiguous": true,
              "meta": {
                "value_ambiguity_type": "domain_value"
              }
            }
          ],
          "trend": [
            {
              "task": "trend",
              "queryPhrase": [],
              "operator": null,
              "values": null,
              "matchScore": 0.5,
              "attributes": [
                "Release Year"
              ],
              "inferenceType": "implicit",
              "isAttrAmbiguous": false,
              "isValueAmbiguous": false,
              "meta": {
                "value_ambiguity_type": null
              }
            }
          ]
        },
        "followUpQuery": false,
        "contextObj": null
      }
    },
    {
      "queryId": 8,
      "query": "create a stripplot showing average gross across genres",
      "output": {
        "status": "SUCCESS",
        "debug": {
          "execution_durations": {
            "clean_query": 0.005448818206787109,
            "extract_attributes": 0.5455880165100098,
            "extract_vis_type": 0.000033855438232421875,
            "extract_tasks": 0.9924850463867188,
            "get_vis_list": 0.0002970695495605469,
            "total": 1.5438528060913086
          }
        },
        "query_raw": "create a stripplot showing average gross across genres",
        "query": "create a stripplot showing average gross across genres",
        "dataset": "https://raw.githubusercontent.com/nl4dv/nl4dv/master/examples/assets/data/movies-w-year.csv",
        "alias": "https://raw.githubusercontent.com/nl4dv/nl4dv/master/examples/assets/aliases/movies-w-year.json",
        "visList": [
          {
            "score": 4.9,
            "scoreObj": {
              "by_attributes": 1.9,
              "by_task": 1,
              "by_vis": 0
            },
            "confidenceObj": {
              "Worldwide Gross": 1,
              "Genre": 1
            },
            "attributes": [
              "Worldwide Gross",
              "Genre"
            ],
            "queryPhrase": "stripplot",
            "visType": "stripplot",
            "tasks": [
              "derived_value"
            ],
            "inferenceType": "explicit",
            "vlSpec": {
              "$schema": "https://vega.github.io/schema/vega-lite/v4.json",
              "mark": {
                "type": "tick",
                "tooltip": true
              },
              "encoding": {
                "y": {
                  "field": "Worldwide Gross",
                  "type": "quantitative",
                  "aggregate": null,
                  "axis": {
                    "format": "s"
                  }
                },
                "x": {
                  "field": "Genre",
                  "type": "nominal",
                  "aggregate": null
                },
                "tooltip": {
                  "field": "Title"
                }
              },
              "transform": [],
              "data": {
                "url": "https://raw.githubusercontent.com/nl4dv/nl4dv/master/examples/assets/data/movies-w-year.csv",
                "format": {
                  "type": "csv"
                }
              }
            }
          }
        ],
        "attributeMap": {
          "Genre": {
            "name": "Genre",
            "queryPhrase": [
              "genres"
            ],
            "inferenceType": "explicit",
            "matchScore": 1,
            "metric": [
              "attribute_exact_match"
            ],
            "isLabel": false,
            "encode": true,
            "isAmbiguous": false,
            "ambiguity": [],
            "meta": {
              "score": 100,
              "threshold": 85,
              "alias": null,
              "ambiguity": {},
              "confidence": 100
            }
          },
          "Worldwide Gross": {
            "name": "Worldwide Gross",
            "queryPhrase": [
              "gross"
            ],
            "inferenceType": "explicit",
            "matchScore": 0.9,
            "metric": [
              "attribute_similarity_match"
            ],
            "isLabel": false,
            "encode": true,
            "isAmbiguous": false,
            "ambiguity": [],
            "meta": {
              "score": 100,
              "threshold": 85,
              "alias": null,
              "ambiguity": {},
              "confidence": 100
            }
          }
        },
        "taskMap": {
          "derived_value": [
            {
              "task": "derived_value",
              "queryPhrase": "average",
              "operator": "AVG",
              "values": [],
              "matchScore": 1,
              "attributes": [
                "Worldwide Gross"
              ],
              "inferenceType": "explicit",
              "isAttrAmbiguous": false,
              "isValueAmbiguous": false,
              "meta": {
                "value_ambiguity_type": null
              }
            }
          ]
        },
        "followUpQuery": false,
        "contextObj": null
      }
    },
    {
      "queryId": 9,
      "query": "average production budget of different movie types over the years as a linechart",
      "output": {
        "status": "SUCCESS",
        "debug": {
          "execution_durations": {
            "clean_query": 0.0055408477783203125,
            "extract_attributes": 0.5368521213531494,
            "extract_vis_type": 0.000032901763916015625,
            "extract_tasks": 1.0341053009033203,
            "get_vis_list": 0.00048732757568359375,
            "total": 1.5770184993743896
          }
        },
        "query_raw": "average production budget of different movie types over the years as a linechart",
        "query": "average production budget of different movie types over the years as a linechart",
        "dataset": "https://raw.githubusercontent.com/nl4dv/nl4dv/master/examples/assets/data/movies-w-year.csv",
        "alias": "https://raw.githubusercontent.com/nl4dv/nl4dv/master/examples/assets/aliases/movies-w-year.json",
        "visList": [
          {
            "score": 7.8,
            "scoreObj": {
              "by_attributes": 2.8,
              "by_task": 1,
              "by_vis": 1
            },
            "confidenceObj": {
              "Production Budget": 1,
              "Creative Type": 1,
              "Release Year": 1
            },
            "attributes": [
              "Production Budget",
              "Creative Type",
              "Release Year"
            ],
            "queryPhrase": "linechart",
            "visType": "linechart",
            "tasks": [
              "derived_value"
            ],
            "inferenceType": "explicit",
            "vlSpec": {
              "$schema": "https://vega.github.io/schema/vega-lite/v4.json",
              "mark": {
                "type": "line",
                "tooltip": true
              },
              "encoding": {
                "y": {
                  "field": "Production Budget",
                  "type": "quantitative",
                  "aggregate": "mean",
                  "axis": {
                    "format": "s"
                  }
                },
                "color": {
                  "field": "Creative Type",
                  "type": "nominal",
                  "aggregate": null
                },
                "x": {
                  "field": "Release Year",
                  "type": "temporal",
                  "aggregate": null
                }
              },
              "transform": [],
              "data": {
                "url": "https://raw.githubusercontent.com/nl4dv/nl4dv/master/examples/assets/data/movies-w-year.csv",
                "format": {
                  "type": "csv"
                }
              }
            }
          },
          {
            "score": 7.8,
            "scoreObj": {
              "by_attributes": 2.8,
              "by_task": 1,
              "by_vis": 1
            },
            "confidenceObj": {
              "Production Budget": 1,
              "Creative Type": 1,
              "Release Year": 1
            },
            "attributes": [
              "Production Budget",
              "Creative Type",
              "Release Year"
            ],
            "queryPhrase": "linechart",
            "visType": "linechart",
            "tasks": [
              "derived_value"
            ],
            "inferenceType": "explicit",
            "vlSpec": {
              "$schema": "https://vega.github.io/schema/vega-lite/v4.json",
              "mark": {
                "type": "line",
                "tooltip": true
              },
              "encoding": {
                "y": {
                  "field": "Production Budget",
                  "type": "quantitative",
                  "aggregate": "mean",
                  "axis": {
                    "format": "s"
                  }
                },
                "column": {
                  "field": "Creative Type",
                  "type": "nominal",
                  "aggregate": null
                },
                "x": {
                  "field": "Release Year",
                  "type": "temporal",
                  "aggregate": null
                },
                "color": {
                  "field": "Creative Type",
                  "type": "nominal",
                  "aggregate": null
                }
              },
              "transform": [],
              "data": {
                "url": "https://raw.githubusercontent.com/nl4dv/nl4dv/master/examples/assets/data/movies-w-year.csv",
                "format": {
                  "type": "csv"
                }
              }
            }
          }
        ],
        "attributeMap": {
          "Production Budget": {
            "name": "Production Budget",
            "queryPhrase": [
              "production budget"
            ],
            "inferenceType": "explicit",
            "matchScore": 1,
            "metric": [
              "attribute_exact_match"
            ],
            "isLabel": false,
            "encode": true,
            "isAmbiguous": false,
            "ambiguity": [],
            "meta": {
              "score": 100,
              "threshold": 85,
              "alias": null,
              "ambiguity": {},
              "confidence": 100
            }
          },
          "Release Year": {
            "name": "Release Year",
            "queryPhrase": [
              "years"
            ],
            "inferenceType": "explicit",
            "matchScore": 0.9,
            "metric": [
              "attribute_similarity_match"
            ],
            "isLabel": false,
            "encode": true,
            "isAmbiguous": false,
            "ambiguity": [],
            "meta": {
              "score": 100,
              "threshold": 85,
              "alias": null,
              "ambiguity": {},
              "confidence": 100
            }
          },
          "Creative Type": {
            "name": "Creative Type",
            "queryPhrase": [
              "types"
            ],
            "inferenceType": "explicit",
            "matchScore": 0.9,
            "metric": [
              "attribute_similarity_match"
            ],
            "isLabel": false,
            "encode": true,
            "isAmbiguous": false,
            "ambiguity": [],
            "meta": {
              "score": 100,
              "threshold": 85,
              "alias": null,
              "ambiguity": {},
              "confidence": 100
            }
          }
        },
        "taskMap": {
          "derived_value": [
            {
              "task": "derived_value",
              "queryPhrase": "average",
              "operator": "AVG",
              "values": [],
              "matchScore": 1,
              "attributes": [
                "Production Budget"
              ],
              "inferenceType": "explicit",
              "isAttrAmbiguous": false,
              "isValueAmbiguous": false,
              "meta": {
                "value_ambiguity_type": null
              }
            }
          ]
        },
        "followUpQuery": false,
        "contextObj": null
      }
    },
    {
      "queryId": 10,
      "query": "show movies whose production budget equals 200M as a barchart",
      "output": {
        "status": "SUCCESS",
        "debug": {
          "execution_durations": {
            "clean_query": 0.005064964294433594,
            "extract_attributes": 0.45332789421081543,
            "extract_vis_type": 0.0000362396240234375,
            "extract_tasks": 0.9711008071899414,
            "get_vis_list": 0.00019669532775878906,
            "total": 1.4297266006469727
          }
        },
        "query_raw": "show movies whose production budget equals 200M as a barchart",
        "query": "show movies whose production budget equals 200000000 as a barchart",
        "dataset": "https://raw.githubusercontent.com/nl4dv/nl4dv/master/examples/assets/data/movies-w-year.csv",
        "alias": "https://raw.githubusercontent.com/nl4dv/nl4dv/master/examples/assets/aliases/movies-w-year.json",
        "visList": [
          {
            "score": 2,
            "scoreObj": {
              "by_attributes": 0,
              "by_task": 1,
              "by_vis": 1
            },
            "confidenceObj": {
              "Title": 0
            },
            "attributes": [
              "Title"
            ],
            "queryPhrase": "barchart",
            "visType": "barchart",
            "tasks": [
              "filter",
              "distribution"
            ],
            "inferenceType": "explicit",
            "vlSpec": {
              "$schema": "https://vega.github.io/schema/vega-lite/v4.json",
              "mark": {
                "type": "bar",
                "tooltip": true
              },
              "encoding": {
                "x": {
                  "field": "Title",
                  "type": "nominal",
                  "aggregate": null
                },
                "y": {
                  "field": "Title",
                  "type": "nominal",
                  "aggregate": "count"
                }
              },
              "transform": [
                {
                  "filter": "lower(datum[\"Production Budget\"]) == 200000000.0"
                }
              ],
              "data": {
                "url": "https://raw.githubusercontent.com/nl4dv/nl4dv/master/examples/assets/data/movies-w-year.csv",
                "format": {
                  "type": "csv"
                }
              }
            }
          }
        ],
        "attributeMap": {
          "Production Budget": {
            "name": "Production Budget",
            "queryPhrase": [
              "production budget"
            ],
            "inferenceType": "explicit",
            "matchScore": 1,
            "metric": [
              "attribute_exact_match"
            ],
            "isLabel": false,
            "encode": false,
            "isAmbiguous": false,
            "ambiguity": [],
            "meta": {
              "score": 100,
              "threshold": 85,
              "alias": null,
              "ambiguity": {},
              "confidence": 100
            }
          },
          "Title": {
            "name": "Title",
            "queryPhrase": null,
            "inferenceType": "implicit",
            "matchScore": 0,
            "metric": [
              "label_attribute"
            ],
            "isLabel": true,
            "isAmbiguous": false,
            "ambiguity": [],
            "encode": true,
            "meta": {
              "score": null,
              "threshold": null,
              "alias": null,
              "ambiguity": {}
            }
          }
        },
        "taskMap": {
          "filter": [
            {
              "task": "filter",
              "queryPhrase": "equals",
              "operator": "EQ",
              "values": [
                200000000
              ],
              "matchScore": 1,
              "attributes": [
                "Production Budget"
              ],
              "inferenceType": "explicit",
              "isAttrAmbiguous": false,
              "isValueAmbiguous": false,
              "meta": {
                "value_ambiguity_type": null
              }
            }
          ],
          "distribution": [
            {
              "task": "distribution",
              "queryPhrase": [],
              "operator": null,
              "values": null,
              "matchScore": 0.5,
              "attributes": [
                "Production Budget"
              ],
              "inferenceType": "implicit",
              "isAttrAmbiguous": false,
              "isValueAmbiguous": false,
              "meta": {
                "value_ambiguity_type": null
              }
            }
          ]
        },
        "followUpQuery": false,
        "contextObj": null
      }
    }
  ],
  "underspecified-attributes-tasks": [
    {
      "queryId": 11,
      "query": "show me a distribution of goals",
      "output": {
        "status": "SUCCESS",
        "debug": {
          "execution_durations": {
            "clean_query": 0.0016570091247558594,
            "extract_attributes": 0.2115020751953125,
            "extract_vis_type": 0.000014066696166992188,
            "extract_tasks": 1.0414478778839111,
            "get_vis_list": 0.000347137451171875,
            "total": 1.2549681663513184
          }
        },
        "query_raw": "show me a distribution of goals",
        "query": "show me a distribution of goals",
        "dataset": "https://raw.githubusercontent.com/nl4dv/nl4dv/master/examples/assets/data/euro.csv",
        "alias": "https://raw.githubusercontent.com/nl4dv/nl4dv/master/examples/assets/aliases/euro.json",
        "visList": [
          {
            "score": 3,
            "scoreObj": {
              "by_attributes": 1,
              "by_task": 1,
              "by_vis": 0
            },
            "confidenceObj": {
              "Goals": 1
            },
            "attributes": [
              "Goals"
            ],
            "queryPhrase": null,
            "visType": null,
            "tasks": [
              "distribution"
            ],
            "inferenceType": "implicit",
            "vlSpec": {
              "$schema": "https://vega.github.io/schema/vega-lite/v4.json",
              "mark": {
                "type": "bar",
                "tooltip": true
              },
              "encoding": {
                "x": {
                  "field": "Goals",
                  "type": "quantitative",
                  "aggregate": null,
                  "bin": true,
                  "axis": {
                    "format": "s"
                  }
                },
                "y": {
                  "field": "Goals",
                  "type": "quantitative",
                  "aggregate": "count",
                  "axis": {
                    "format": "s"
                  }
                }
              },
              "transform": [],
              "data": {
                "url": "https://raw.githubusercontent.com/nl4dv/nl4dv/master/examples/assets/data/euro.csv",
                "format": {
                  "type": "csv"
                }
              }
            }
          },
          {
            "score": 3,
            "scoreObj": {
              "by_attributes": 1,
              "by_task": 1,
              "by_vis": 0
            },
            "confidenceObj": {
              "Goals": 1
            },
            "attributes": [
              "Goals"
            ],
            "queryPhrase": null,
            "visType": null,
            "tasks": [
              "distribution"
            ],
            "inferenceType": "implicit",
            "vlSpec": {
              "$schema": "https://vega.github.io/schema/vega-lite/v4.json",
              "mark": {
                "type": "tick",
                "tooltip": true
              },
              "encoding": {
                "x": {
                  "field": "Goals",
                  "type": "quantitative",
                  "aggregate": null,
                  "axis": {
                    "format": "s"
                  }
                },
                "tooltip": {
                  "field": "Name"
                }
              },
              "transform": [],
              "data": {
                "url": "https://raw.githubusercontent.com/nl4dv/nl4dv/master/examples/assets/data/euro.csv",
                "format": {
                  "type": "csv"
                }
              }
            }
          },
          {
            "score": 3,
            "scoreObj": {
              "by_attributes": 1,
              "by_task": 1,
              "by_vis": 0
            },
            "confidenceObj": {
              "Goals": 1
            },
            "attributes": [
              "Goals"
            ],
            "queryPhrase": null,
            "visType": null,
            "tasks": [
              "distribution"
            ],
            "inferenceType": "implicit",
            "vlSpec": {
              "$schema": "https://vega.github.io/schema/vega-lite/v4.json",
              "mark": {
                "type": "boxplot",
                "tooltip": true
              },
              "encoding": {
                "x": {
                  "field": "Goals",
                  "type": "quantitative",
                  "aggregate": null,
                  "axis": {
                    "format": "s"
                  }
                },
                "tooltip": {
                  "field": "Name"
                }
              },
              "transform": [],
              "data": {
                "url": "https://raw.githubusercontent.com/nl4dv/nl4dv/master/examples/assets/data/euro.csv",
                "format": {
                  "type": "csv"
                }
              }
            }
          }
        ],
        "attributeMap": {
          "Goals": {
            "name": "Goals",
            "queryPhrase": [
              "goals"
            ],
            "inferenceType": "explicit",
            "matchScore": 1,
            "metric": [
              "attribute_exact_match"
            ],
            "isLabel": false,
            "encode": true,
            "isAmbiguous": false,
            "ambiguity": [],
            "meta": {
              "score": 100,
              "threshold": 85,
              "alias": null,
              "ambiguity": {},
              "confidence": 100
            }
          }
        },
        "taskMap": {
          "distribution": [
            {
              "task": "distribution",
              "queryPhrase": "distribution",
              "operator": null,
              "values": [],
              "matchScore": 1,
              "attributes": [
                "Goals"
              ],
              "inferenceType": "explicit",
              "isAttrAmbiguous": false,
              "isValueAmbiguous": false,
              "meta": {
                "value_ambiguity_type": null
              }
            }
          ]
        },
        "followUpQuery": false,
        "contextObj": null
      }
    },
    {
      "queryId": 12,
      "query": "correlate goals and salary",
      "output": {
        "status": "SUCCESS",
        "debug": {
          "execution_durations": {
            "clean_query": 0.0014262199401855469,
            "extract_attributes": 0.23684906959533691,
            "extract_vis_type": 0.000014781951904296875,
            "extract_tasks": 1.0720570087432861,
            "get_vis_list": 0.0002009868621826172,
            "total": 1.3105480670928955
          }
        },
        "query_raw": "correlate goals and salary",
        "query": "correlate goals and salary",
        "dataset": "https://raw.githubusercontent.com/nl4dv/nl4dv/master/examples/assets/data/euro.csv",
        "alias": "https://raw.githubusercontent.com/nl4dv/nl4dv/master/examples/assets/aliases/euro.json",
        "visList": [
          {
            "score": 5,
            "scoreObj": {
              "by_attributes": 2,
              "by_task": 1,
              "by_vis": 0
            },
            "confidenceObj": {
              "Salary": 1,
              "Goals": 1
            },
            "attributes": [
              "Salary",
              "Goals"
            ],
            "queryPhrase": null,
            "visType": null,
            "tasks": [
              "correlation"
            ],
            "inferenceType": "implicit",
            "vlSpec": {
              "$schema": "https://vega.github.io/schema/vega-lite/v4.json",
              "mark": {
                "type": "point",
                "tooltip": true
              },
              "encoding": {
                "x": {
                  "field": "Salary",
                  "type": "quantitative",
                  "aggregate": null,
                  "axis": {
                    "format": "s"
                  }
                },
                "y": {
                  "field": "Goals",
                  "type": "quantitative",
                  "aggregate": null,
                  "axis": {
                    "format": "s"
                  }
                },
                "tooltip": {
                  "field": "Name"
                }
              },
              "transform": [],
              "data": {
                "url": "https://raw.githubusercontent.com/nl4dv/nl4dv/master/examples/assets/data/euro.csv",
                "format": {
                  "type": "csv"
                }
              }
            }
          }
        ],
        "attributeMap": {
          "Salary": {
            "name": "Salary",
            "queryPhrase": [
              "salary"
            ],
            "inferenceType": "explicit",
            "matchScore": 1,
            "metric": [
              "attribute_exact_match"
            ],
            "isLabel": false,
            "encode": true,
            "isAmbiguous": false,
            "ambiguity": [],
            "meta": {
              "score": 100,
              "threshold": 85,
              "alias": null,
              "ambiguity": {},
              "confidence": 100
            }
          },
          "Goals": {
            "name": "Goals",
            "queryPhrase": [
              "goals"
            ],
            "inferenceType": "explicit",
            "matchScore": 1,
            "metric": [
              "attribute_exact_match"
            ],
            "isLabel": false,
            "encode": true,
            "isAmbiguous": false,
            "ambiguity": [],
            "meta": {
              "score": 100,
              "threshold": 85,
              "alias": null,
              "ambiguity": {},
              "confidence": 100
            }
          }
        },
        "taskMap": {
          "correlation": [
            {
              "task": "correlation",
              "queryPhrase": "correlate",
              "operator": null,
              "values": [],
              "matchScore": 1,
              "attributes": [
                "Salary",
                "Goals"
              ],
              "inferenceType": "explicit",
              "isAttrAmbiguous": false,
              "isValueAmbiguous": false,
              "meta": {
                "value_ambiguity_type": null
              }
            }
          ]
        },
        "followUpQuery": false,
        "contextObj": null
      }
    },
    {
      "queryId": 13,
      "query": "show me players with salaries more than 60M",
      "output": {
        "status": "SUCCESS",
        "debug": {
          "execution_durations": {
            "clean_query": 0.002276897430419922,
            "extract_attributes": 0.27007508277893066,
            "extract_vis_type": 0.00002002716064453125,
            "extract_tasks": 1.258342981338501,
            "get_vis_list": 0.00026607513427734375,
            "total": 1.5309810638427734
          }
        },
        "query_raw": "show me players with salaries more than 60M",
        "query": "show me players with salaries more than 60000000",
        "dataset": "https://raw.githubusercontent.com/nl4dv/nl4dv/master/examples/assets/data/euro.csv",
        "alias": "https://raw.githubusercontent.com/nl4dv/nl4dv/master/examples/assets/aliases/euro.json",
        "visList": [
          {
            "score": 1,
            "scoreObj": {
              "by_attributes": 0,
              "by_task": 1,
              "by_vis": 0
            },
            "confidenceObj": {
              "Name": 0
            },
            "attributes": [
              "Name"
            ],
            "queryPhrase": null,
            "visType": null,
            "tasks": [
              "filter",
              "distribution"
            ],
            "inferenceType": "implicit",
            "vlSpec": {
              "$schema": "https://vega.github.io/schema/vega-lite/v4.json",
              "mark": {
                "type": "bar",
                "tooltip": true
              },
              "encoding": {
                "x": {
                  "field": "Name",
                  "type": "nominal",
                  "aggregate": null
                },
                "y": {
                  "field": "Name",
                  "type": "nominal",
                  "aggregate": "count"
                }
              },
              "transform": [
                {
                  "filter": "lower(datum[\"Salary\"]) > 60000000.0"
                }
              ],
              "data": {
                "url": "https://raw.githubusercontent.com/nl4dv/nl4dv/master/examples/assets/data/euro.csv",
                "format": {
                  "type": "csv"
                }
              }
            }
          }
        ],
        "attributeMap": {
          "Salary": {
            "name": "Salary",
            "queryPhrase": [
              "salaries"
            ],
            "inferenceType": "explicit",
            "matchScore": 1,
            "metric": [
              "attribute_exact_match"
            ],
            "isLabel": false,
            "encode": false,
            "isAmbiguous": false,
            "ambiguity": [],
            "meta": {
              "score": 100,
              "threshold": 85,
              "alias": null,
              "ambiguity": {},
              "confidence": 100
            }
          },
          "Name": {
            "name": "Name",
            "queryPhrase": null,
            "inferenceType": "implicit",
            "matchScore": 0,
            "metric": [
              "label_attribute"
            ],
            "isLabel": true,
            "isAmbiguous": false,
            "ambiguity": [],
            "encode": true,
            "meta": {
              "score": null,
              "threshold": null,
              "alias": null,
              "ambiguity": {}
            }
          }
        },
        "taskMap": {
          "filter": [
            {
              "task": "filter",
              "queryPhrase": "more",
              "operator": "GT",
              "values": [
                60000000
              ],
              "matchScore": 1,
              "attributes": [
                "Salary"
              ],
              "inferenceType": "explicit",
              "isAttrAmbiguous": false,
              "isValueAmbiguous": false,
              "meta": {
                "value_ambiguity_type": null
              }
            }
          ],
          "distribution": [
            {
              "task": "distribution",
              "queryPhrase": [],
              "operator": null,
              "values": null,
              "matchScore": 0.5,
              "attributes": [
                "Salary"
              ],
              "inferenceType": "implicit",
              "isAttrAmbiguous": false,
              "isValueAmbiguous": false,
              "meta": {
                "value_ambiguity_type": null
              }
            }
          ]
        },
        "followUpQuery": false,
        "contextObj": null
      }
    },
    {
      "queryId": 14,
      "query": "which player from France has scored the highest goals",
      "output": {
        "status": "SUCCESS",
        "debug": {
          "execution_durations": {
            "clean_query": 0.004693031311035156,
            "extract_attributes": 0.6879837512969971,
            "extract_vis_type": 0.000025987625122070312,
            "extract_tasks": 1.2696211338043213,
            "get_vis_list": 0.00035190582275390625,
            "total": 1.9626758098602295
          }
        },
        "query_raw": "which player from France has scored the highest goals",
        "query": "which player from france has scored the highest goals",
        "dataset": "https://raw.githubusercontent.com/nl4dv/nl4dv/master/examples/assets/data/euro.csv",
        "alias": "https://raw.githubusercontent.com/nl4dv/nl4dv/master/examples/assets/aliases/euro.json",
        "visList": [
          {
            "score": 4,
            "scoreObj": {
              "by_attributes": 1,
              "by_task": 2,
              "by_vis": 0
            },
            "confidenceObj": {
              "Goals": 1,
              "Name": 0
            },
            "attributes": [
              "Goals",
              "Name"
            ],
            "queryPhrase": null,
            "visType": null,
            "tasks": [
              "find_extremum",
              "filter"
            ],
            "inferenceType": "implicit",
            "vlSpec": {
              "$schema": "https://vega.github.io/schema/vega-lite/v4.json",
              "mark": {
                "type": "bar",
                "tooltip": true
              },
              "encoding": {
                "y": {
                  "field": "Goals",
                  "type": "quantitative",
                  "aggregate": "mean",
                  "axis": {
                    "format": "s"
                  }
                },
                "x": {
                  "field": "Name",
                  "type": "nominal",
                  "aggregate": null,
                  "sort": "-y"
                }
              },
              "transform": [
                {
                  "filter": {
                    "field": "Country",
                    "oneOf": [
                      "France"
                    ]
                  }
                }
              ],
              "data": {
                "url": "https://raw.githubusercontent.com/nl4dv/nl4dv/master/examples/assets/data/euro.csv",
                "format": {
                  "type": "csv"
                }
              }
            }
          },
          {
            "score": 4,
            "scoreObj": {
              "by_attributes": 1,
              "by_task": 2,
              "by_vis": 0
            },
            "confidenceObj": {
              "Goals": 1,
              "Name": 0
            },
            "attributes": [
              "Goals",
              "Name"
            ],
            "queryPhrase": null,
            "visType": null,
            "tasks": [
              "find_extremum",
              "filter"
            ],
            "inferenceType": "implicit",
            "vlSpec": {
              "$schema": "https://vega.github.io/schema/vega-lite/v4.json",
              "mark": {
                "type": "tick",
                "tooltip": true
              },
              "encoding": {
                "y": {
                  "field": "Goals",
                  "type": "quantitative",
                  "aggregate": null,
                  "axis": {
                    "format": "s"
                  }
                },
                "x": {
                  "field": "Name",
                  "type": "nominal",
                  "aggregate": null,
                  "sort": "-y"
                },
                "tooltip": {
                  "field": "Name"
                }
              },
              "transform": [
                {
                  "filter": {
                    "field": "Country",
                    "oneOf": [
                      "France"
                    ]
                  }
                }
              ],
              "data": {
                "url": "https://raw.githubusercontent.com/nl4dv/nl4dv/master/examples/assets/data/euro.csv",
                "format": {
                  "type": "csv"
                }
              }
            }
          }
        ],
        "attributeMap": {
          "Goals": {
            "name": "Goals",
            "queryPhrase": [
              "goals"
            ],
            "inferenceType": "explicit",
            "matchScore": 1,
            "metric": [
              "attribute_exact_match"
            ],
            "isLabel": false,
            "encode": true,
            "isAmbiguous": false,
            "ambiguity": [],
            "meta": {
              "score": 100,
              "threshold": 85,
              "alias": null,
              "ambiguity": {},
              "confidence": 100
            }
          },
          "Country": {
            "name": "Country",
            "queryPhrase": [
              "france"
            ],
            "inferenceType": "implicit",
            "matchScore": 0.5,
            "metric": [
              "attribute_domain_value_match"
            ],
            "isLabel": false,
            "isAmbiguous": false,
            "ambiguity": [],
            "encode": false,
            "meta": {
              "score": null,
              "threshold": null,
              "alias": null,
              "ambiguity": {
                "france": [
                  "France"
                ]
              },
              "confidence": 100
            }
          },
          "Name": {
            "name": "Name",
            "queryPhrase": null,
            "inferenceType": "implicit",
            "matchScore": 0,
            "metric": [
              "label_attribute"
            ],
            "isLabel": true,
            "isAmbiguous": false,
            "ambiguity": [],
            "encode": true,
            "meta": {
              "score": null,
              "threshold": null,
              "alias": null,
              "ambiguity": {}
            }
          }
        },
        "taskMap": {
          "find_extremum": [
            {
              "task": "find_extremum",
              "queryPhrase": "highest",
              "operator": "MAX",
              "values": [],
              "matchScore": 1,
              "attributes": [
                "Goals"
              ],
              "inferenceType": "explicit",
              "isAttrAmbiguous": false,
              "isValueAmbiguous": false,
              "meta": {
                "value_ambiguity_type": null
              }
            }
          ],
          "filter": [
            {
              "task": "filter",
              "queryPhrase": [
                "france"
              ],
              "operator": "IN",
              "values": [
                "France"
              ],
              "matchScore": 1,
              "attributes": [
                "Country"
              ],
              "inferenceType": "explicit",
              "isAttrAmbiguous": false,
              "isValueAmbiguous": false,
              "meta": {
                "value_ambiguity_type": null
              }
            }
          ]
        },
        "followUpQuery": false,
        "contextObj": null
      }
    },
    {
      "queryId": 15,
      "query": "countries with the highest mean salary",
      "output": {
        "status": "SUCCESS",
        "debug": {
          "execution_durations": {
            "clean_query": 0.002180814743041992,
            "extract_attributes": 0.3602292537689209,
            "extract_vis_type": 0.000018835067749023438,
            "extract_tasks": 1.1691720485687256,
            "get_vis_list": 0.0003609657287597656,
            "total": 1.5319619178771973
          }
        },
        "query_raw": "countries with the highest mean salary",
        "query": "countries with the highest mean salary",
        "dataset": "https://raw.githubusercontent.com/nl4dv/nl4dv/master/examples/assets/data/euro.csv",
        "alias": "https://raw.githubusercontent.com/nl4dv/nl4dv/master/examples/assets/aliases/euro.json",
        "visList": [
          {
            "score": 6,
            "scoreObj": {
              "by_attributes": 2,
              "by_task": 2,
              "by_vis": 0
            },
            "confidenceObj": {
              "Salary": 1,
              "Country": 1
            },
            "attributes": [
              "Salary",
              "Country"
            ],
            "queryPhrase": null,
            "visType": null,
            "tasks": [
              "find_extremum",
              "derived_value"
            ],
            "inferenceType": "implicit",
            "vlSpec": {
              "$schema": "https://vega.github.io/schema/vega-lite/v4.json",
              "mark": {
                "type": "bar",
                "tooltip": true
              },
              "encoding": {
                "y": {
                  "field": "Salary",
                  "type": "quantitative",
                  "aggregate": "mean",
                  "axis": {
                    "format": "s"
                  }
                },
                "x": {
                  "field": "Country",
                  "type": "nominal",
                  "aggregate": null,
                  "sort": "-y"
                }
              },
              "transform": [],
              "data": {
                "url": "https://raw.githubusercontent.com/nl4dv/nl4dv/master/examples/assets/data/euro.csv",
                "format": {
                  "type": "csv"
                }
              }
            }
          }
        ],
        "attributeMap": {
          "Country": {
            "name": "Country",
            "queryPhrase": [
              "countries"
            ],
            "inferenceType": "explicit",
            "matchScore": 1,
            "metric": [
              "attribute_exact_match"
            ],
            "isLabel": false,
            "encode": true,
            "isAmbiguous": false,
            "ambiguity": [],
            "meta": {
              "score": 100,
              "threshold": 85,
              "alias": null,
              "ambiguity": {},
              "confidence": 100
            }
          },
          "Salary": {
            "name": "Salary",
            "queryPhrase": [
              "salary"
            ],
            "inferenceType": "explicit",
            "matchScore": 1,
            "metric": [
              "attribute_exact_match"
            ],
            "isLabel": false,
            "encode": true,
            "isAmbiguous": false,
            "ambiguity": [],
            "meta": {
              "score": 100,
              "threshold": 85,
              "alias": null,
              "ambiguity": {},
              "confidence": 100
            }
          }
        },
        "taskMap": {
          "find_extremum": [
            {
              "task": "find_extremum",
              "queryPhrase": "highest",
              "operator": "MAX",
              "values": [],
              "matchScore": 1,
              "attributes": [
                "Salary"
              ],
              "inferenceType": "explicit",
              "isAttrAmbiguous": false,
              "isValueAmbiguous": false,
              "meta": {
                "value_ambiguity_type": null
              }
            }
          ],
          "derived_value": [
            {
              "task": "derived_value",
              "queryPhrase": "mean",
              "operator": "AVG",
              "values": [],
              "matchScore": 1,
              "attributes": [
                "Salary"
              ],
              "inferenceType": "explicit",
              "isAttrAmbiguous": false,
              "isValueAmbiguous": false,
              "meta": {
                "value_ambiguity_type": null
              }
            }
          ]
        },
        "followUpQuery": false,
        "contextObj": null
      }
    },
    {
      "queryId": 16,
      "query": "players who scored between 5 and 10 goals and whose age is not more than 25",
      "output": {
        "status": "SUCCESS",
        "debug": {
          "execution_durations": {
            "clean_query": 0.007302045822143555,
            "extract_attributes": 0.8165831565856934,
            "extract_vis_type": 0.0000457763671875,
            "extract_tasks": 1.1452171802520752,
            "get_vis_list": 0.00016999244689941406,
            "total": 1.969318151473999
          }
        },
        "query_raw": "players who scored between 5 and 10 goals and whose age is not more than 25",
        "query": "players who scored between 5 and 10 goals and whose age is not more than 25",
        "dataset": "https://raw.githubusercontent.com/nl4dv/nl4dv/master/examples/assets/data/euro.csv",
        "alias": "https://raw.githubusercontent.com/nl4dv/nl4dv/master/examples/assets/aliases/euro.json",
        "visList": [
          {
            "score": 2,
            "scoreObj": {
              "by_attributes": 0,
              "by_task": 2,
              "by_vis": 0
            },
            "confidenceObj": {
              "Name": 0
            },
            "attributes": [
              "Name"
            ],
            "queryPhrase": null,
            "visType": null,
            "tasks": [
              "filter",
              "correlation"
            ],
            "inferenceType": "implicit",
            "vlSpec": {
              "$schema": "https://vega.github.io/schema/vega-lite/v4.json",
              "mark": {
                "type": "bar",
                "tooltip": true
              },
              "encoding": {
                "x": {
                  "field": "Name",
                  "type": "nominal",
                  "aggregate": null
                },
                "y": {
                  "field": "Name",
                  "type": "nominal",
                  "aggregate": "count"
                }
              },
              "transform": [
                {
                  "filter": "lower(datum[\"Age\"]) < 25.0"
                },
                {
                  "filter": {
                    "field": "Goals",
                    "range": [
                      5,
                      10
                    ]
                  }
                }
              ],
              "data": {
                "url": "https://raw.githubusercontent.com/nl4dv/nl4dv/master/examples/assets/data/euro.csv",
                "format": {
                  "type": "csv"
                }
              }
            }
          }
        ],
        "attributeMap": {
          "Age": {
            "name": "Age",
            "queryPhrase": [
              "age"
            ],
            "inferenceType": "explicit",
            "matchScore": 1,
            "metric": [
              "attribute_exact_match"
            ],
            "isLabel": false,
            "encode": false,
            "isAmbiguous": false,
            "ambiguity": [],
            "meta": {
              "score": 100,
              "threshold": 85,
              "alias": null,
              "ambiguity": {},
              "confidence": 100
            }
          },
          "Goals": {
            "name": "Goals",
            "queryPhrase": [
              "goals"
            ],
            "inferenceType": "explicit",
            "matchScore": 1,
            "metric": [
              "attribute_exact_match"
            ],
            "isLabel": false,
            "encode": false,
            "isAmbiguous": false,
            "ambiguity": [],
            "meta": {
              "score": 100,
              "threshold": 85,
              "alias": null,
              "ambiguity": {},
              "confidence": 100
            }
          },
          "Name": {
            "name": "Name",
            "queryPhrase": null,
            "inferenceType": "implicit",
            "matchScore": 0,
            "metric": [
              "label_attribute"
            ],
            "isLabel": true,
            "isAmbiguous": false,
            "ambiguity": [],
            "encode": true,
            "meta": {
              "score": null,
              "threshold": null,
              "alias": null,
              "ambiguity": {}
            }
          }
        },
        "taskMap": {
          "filter": [
            {
              "task": "filter",
              "queryPhrase": "not more",
              "operator": "LT",
              "values": [
                25
              ],
              "matchScore": 1,
              "attributes": [
                "Age"
              ],
              "inferenceType": "explicit",
              "isAttrAmbiguous": false,
              "isValueAmbiguous": false,
              "meta": {
                "value_ambiguity_type": null
              }
            },
            {
              "task": "filter",
              "queryPhrase": "between",
              "operator": "RANGE",
              "values": [
                5,
                10
              ],
              "matchScore": 1,
              "attributes": [
                "Goals"
              ],
              "inferenceType": "explicit",
              "isAttrAmbiguous": false,
              "isValueAmbiguous": false,
              "meta": {
                "value_ambiguity_type": null
              }
            }
          ],
          "correlation": [
            {
              "task": "correlation",
              "queryPhrase": [],
              "operator": null,
              "values": null,
              "matchScore": 0.5,
              "attributes": [
                "Age",
                "Goals"
              ],
              "inferenceType": "implicit",
              "isAttrAmbiguous": false,
              "isValueAmbiguous": false,
              "meta": {
                "value_ambiguity_type": null
              }
            }
          ]
        },
        "followUpQuery": false,
        "contextObj": null
      }
    },
    {
      "queryId": 17,
      "query": "show me spain players under the age of 30 but with more than 5 goals",
      "output": {
        "status": "SUCCESS",
        "debug": {
          "execution_durations": {
            "clean_query": 0.004721879959106445,
            "extract_attributes": 0.6496798992156982,
            "extract_vis_type": 0.00003719329833984375,
            "extract_tasks": 1.1491057872772217,
            "get_vis_list": 0.00016570091247558594,
            "total": 1.8037104606628418
          }
        },
        "query_raw": "show me spain players under the age of 30 but with more than 5 goals",
        "query": "show me spain players under the age of 30 but with more than 5 goals",
        "dataset": "https://raw.githubusercontent.com/nl4dv/nl4dv/master/examples/assets/data/euro.csv",
        "alias": "https://raw.githubusercontent.com/nl4dv/nl4dv/master/examples/assets/aliases/euro.json",
        "visList": [
          {
            "score": 3,
            "scoreObj": {
              "by_attributes": 0,
              "by_task": 3,
              "by_vis": 0
            },
            "confidenceObj": {
              "Name": 0
            },
            "attributes": [
              "Name"
            ],
            "queryPhrase": null,
            "visType": null,
            "tasks": [
              "filter",
              "correlation"
            ],
            "inferenceType": "implicit",
            "vlSpec": {
              "$schema": "https://vega.github.io/schema/vega-lite/v4.json",
              "mark": {
                "type": "bar",
                "tooltip": true
              },
              "encoding": {
                "x": {
                  "field": "Name",
                  "type": "nominal",
                  "aggregate": null
                },
                "y": {
                  "field": "Name",
                  "type": "nominal",
                  "aggregate": "count"
                }
              },
              "transform": [
                {
                  "filter": "lower(datum[\"Age\"]) < 30.0"
                },
                {
                  "filter": "lower(datum[\"Goals\"]) > 5.0"
                },
                {
                  "filter": {
                    "field": "Country",
                    "oneOf": [
                      "Spain"
                    ]
                  }
                }
              ],
              "data": {
                "url": "https://raw.githubusercontent.com/nl4dv/nl4dv/master/examples/assets/data/euro.csv",
                "format": {
                  "type": "csv"
                }
              }
            }
          }
        ],
        "attributeMap": {
          "Age": {
            "name": "Age",
            "queryPhrase": [
              "age"
            ],
            "inferenceType": "explicit",
            "matchScore": 1,
            "metric": [
              "attribute_exact_match"
            ],
            "isLabel": false,
            "encode": false,
            "isAmbiguous": false,
            "ambiguity": [],
            "meta": {
              "score": 100,
              "threshold": 85,
              "alias": null,
              "ambiguity": {},
              "confidence": 100
            }
          },
          "Goals": {
            "name": "Goals",
            "queryPhrase": [
              "goals"
            ],
            "inferenceType": "explicit",
            "matchScore": 1,
            "metric": [
              "attribute_exact_match"
            ],
            "isLabel": false,
            "encode": false,
            "isAmbiguous": false,
            "ambiguity": [],
            "meta": {
              "score": 100,
              "threshold": 85,
              "alias": null,
              "ambiguity": {},
              "confidence": 100
            }
          },
          "Country": {
            "name": "Country",
            "queryPhrase": [
              "spain"
            ],
            "inferenceType": "implicit",
            "matchScore": 0.5,
            "metric": [
              "attribute_domain_value_match"
            ],
            "isLabel": false,
            "isAmbiguous": false,
            "ambiguity": [],
            "encode": false,
            "meta": {
              "score": null,
              "threshold": null,
              "alias": null,
              "ambiguity": {
                "spain": [
                  "Spain"
                ]
              },
              "confidence": 100
            }
          },
          "Name": {
            "name": "Name",
            "queryPhrase": null,
            "inferenceType": "implicit",
            "matchScore": 0,
            "metric": [
              "label_attribute"
            ],
            "isLabel": true,
            "isAmbiguous": false,
            "ambiguity": [],
            "encode": true,
            "meta": {
              "score": null,
              "threshold": null,
              "alias": null,
              "ambiguity": {}
            }
          }
        },
        "taskMap": {
          "filter": [
            {
              "task": "filter",
              "queryPhrase": "under",
              "operator": "LT",
              "values": [
                30
              ],
              "matchScore": 1,
              "attributes": [
                "Age"
              ],
              "inferenceType": "explicit",
              "isAttrAmbiguous": false,
              "isValueAmbiguous": false,
              "meta": {
                "value_ambiguity_type": null
              }
            },
            {
              "task": "filter",
              "queryPhrase": "more",
              "operator": "GT",
              "values": [
                5
              ],
              "matchScore": 1,
              "attributes": [
                "Goals"
              ],
              "inferenceType": "explicit",
              "isAttrAmbiguous": false,
              "isValueAmbiguous": false,
              "meta": {
                "value_ambiguity_type": null
              }
            },
            {
              "task": "filter",
              "queryPhrase": [
                "spain"
              ],
              "operator": "IN",
              "values": [
                "Spain"
              ],
              "matchScore": 1,
              "attributes": [
                "Country"
              ],
              "inferenceType": "explicit",
              "isAttrAmbiguous": false,
              "isValueAmbiguous": false,
              "meta": {
                "value_ambiguity_type": null
              }
            }
          ],
          "correlation": [
            {
              "task": "correlation",
              "queryPhrase": [],
              "operator": null,
              "values": null,
              "matchScore": 0.5,
              "attributes": [
                "Age",
                "Goals"
              ],
              "inferenceType": "implicit",
              "isAttrAmbiguous": false,
              "isValueAmbiguous": false,
              "meta": {
                "value_ambiguity_type": null
              }
            }
          ]
        },
        "followUpQuery": false,
        "contextObj": null
      }
    },
    {
      "queryId": 18,
      "query": "show me club wise median salary for spain, portugal and germany players.",
      "output": {
        "status": "SUCCESS",
        "debug": {
          "execution_durations": {
            "clean_query": 0.009228229522705078,
            "extract_attributes": 1.3340740203857422,
            "extract_vis_type": 0.00005888938903808594,
            "extract_tasks": 1.2452499866485596,
            "get_vis_list": 0.0003287792205810547,
            "total": 2.588939905166626
          }
        },
        "query_raw": "show me club wise median salary for spain, portugal and germany players.",
        "query": "show me club wise median salary for spain , portugal and germany players .",
        "dataset": "https://raw.githubusercontent.com/nl4dv/nl4dv/master/examples/assets/data/euro.csv",
        "alias": "https://raw.githubusercontent.com/nl4dv/nl4dv/master/examples/assets/aliases/euro.json",
        "visList": [
          {
            "score": 6,
            "scoreObj": {
              "by_attributes": 2,
              "by_task": 2,
              "by_vis": 0
            },
            "confidenceObj": {
              "Salary": 1,
              "Club": 1
            },
            "attributes": [
              "Salary",
              "Club"
            ],
            "queryPhrase": null,
            "visType": null,
            "tasks": [
              "derived_value",
              "filter"
            ],
            "inferenceType": "implicit",
            "vlSpec": {
              "$schema": "https://vega.github.io/schema/vega-lite/v4.json",
              "mark": {
                "type": "bar",
                "tooltip": true
              },
              "encoding": {
                "y": {
                  "field": "Salary",
                  "type": "quantitative",
                  "aggregate": "median",
                  "axis": {
                    "format": "s"
                  }
                },
                "x": {
                  "field": "Club",
                  "type": "nominal",
                  "aggregate": null
                }
              },
              "transform": [
                {
                  "filter": {
                    "field": "Country",
                    "oneOf": [
                      "Spain",
                      "Portugal",
                      "Germany"
                    ]
                  }
                }
              ],
              "data": {
                "url": "https://raw.githubusercontent.com/nl4dv/nl4dv/master/examples/assets/data/euro.csv",
                "format": {
                  "type": "csv"
                }
              }
            }
          }
        ],
        "attributeMap": {
          "Club": {
            "name": "Club",
            "queryPhrase": [
              "club"
            ],
            "inferenceType": "explicit",
            "matchScore": 1,
            "metric": [
              "attribute_exact_match"
            ],
            "isLabel": false,
            "encode": true,
            "isAmbiguous": false,
            "ambiguity": [],
            "meta": {
              "score": 100,
              "threshold": 85,
              "alias": null,
              "ambiguity": {},
              "confidence": 100
            }
          },
          "Salary": {
            "name": "Salary",
            "queryPhrase": [
              "salary"
            ],
            "inferenceType": "explicit",
            "matchScore": 1,
            "metric": [
              "attribute_exact_match"
            ],
            "isLabel": false,
            "encode": true,
            "isAmbiguous": false,
            "ambiguity": [],
            "meta": {
              "score": 100,
              "threshold": 85,
              "alias": null,
              "ambiguity": {},
              "confidence": 100
            }
          },
          "Country": {
            "name": "Country",
            "queryPhrase": [
              "spain",
              "portugal",
              "germany"
            ],
            "inferenceType": "implicit",
            "matchScore": 0.5,
            "metric": [
              "attribute_domain_value_match"
            ],
            "isLabel": false,
            "isAmbiguous": false,
            "ambiguity": [],
            "encode": false,
            "meta": {
              "score": null,
              "threshold": null,
              "alias": null,
              "ambiguity": {
                "spain": [
                  "Spain"
                ],
                "portugal": [
                  "Portugal"
                ],
                "germany": [
                  "Germany"
                ]
              },
              "confidence": 100
            }
          }
        },
        "taskMap": {
          "derived_value": [
            {
              "task": "derived_value",
              "queryPhrase": "median",
              "operator": "MEDIAN",
              "values": [],
              "matchScore": 1,
              "attributes": [
                "Salary"
              ],
              "inferenceType": "explicit",
              "isAttrAmbiguous": false,
              "isValueAmbiguous": false,
              "meta": {
                "value_ambiguity_type": null
              }
            }
          ],
          "filter": [
            {
              "task": "filter",
              "queryPhrase": [
                "spain",
                "portugal",
                "germany"
              ],
              "operator": "IN",
              "values": [
                "Spain",
                "Portugal",
                "Germany"
              ],
              "matchScore": 1,
              "attributes": [
                "Country"
              ],
              "inferenceType": "explicit",
              "isAttrAmbiguous": false,
              "isValueAmbiguous": false,
              "meta": {
                "value_ambiguity_type": null
              }
            }
          ]
        },
        "followUpQuery": false,
        "contextObj": null
      }
    },
    {
      "queryId": 19,
      "query": "show me salaries of left footed players who play as a forward.",
      "output": {
        "status": "SUCCESS",
        "debug": {
          "execution_durations": {
            "clean_query": 0.0063190460205078125,
            "extract_attributes": 1.134469985961914,
            "extract_vis_type": 0.00003600120544433594,
            "extract_tasks": 1.2870001792907715,
            "get_vis_list": 0.0002543926239013672,
            "total": 2.428079605102539
          }
        },
        "query_raw": "show me salaries of left footed players who play as a forward.",
        "query": "show me salaries of left footed players who play as a forward .",
        "dataset": "https://raw.githubusercontent.com/nl4dv/nl4dv/master/examples/assets/data/euro.csv",
        "alias": "https://raw.githubusercontent.com/nl4dv/nl4dv/master/examples/assets/aliases/euro.json",
        "visList": [
          {
            "score": 4.5,
            "scoreObj": {
              "by_attributes": 1,
              "by_task": 2.5,
              "by_vis": 0
            },
            "confidenceObj": {
              "Salary": 1
            },
            "attributes": [
              "Salary"
            ],
            "queryPhrase": null,
            "visType": null,
            "tasks": [
              "filter",
              "distribution"
            ],
            "inferenceType": "implicit",
            "vlSpec": {
              "$schema": "https://vega.github.io/schema/vega-lite/v4.json",
              "mark": {
                "type": "bar",
                "tooltip": true
              },
              "encoding": {
                "x": {
                  "field": "Salary",
                  "type": "quantitative",
                  "aggregate": null,
                  "bin": true,
                  "axis": {
                    "format": "s"
                  }
                },
                "y": {
                  "field": "Salary",
                  "type": "quantitative",
                  "aggregate": "count",
                  "axis": {
                    "format": "s"
                  }
                }
              },
              "transform": [
                {
                  "filter": {
                    "field": "Foot",
                    "oneOf": [
                      "Left"
                    ]
                  }
                },
                {
                  "filter": {
                    "field": "Position",
                    "oneOf": [
                      "Forward"
                    ]
                  }
                }
              ],
              "data": {
                "url": "https://raw.githubusercontent.com/nl4dv/nl4dv/master/examples/assets/data/euro.csv",
                "format": {
                  "type": "csv"
                }
              }
            }
          },
          {
            "score": 4.5,
            "scoreObj": {
              "by_attributes": 1,
              "by_task": 2.5,
              "by_vis": 0
            },
            "confidenceObj": {
              "Salary": 1
            },
            "attributes": [
              "Salary"
            ],
            "queryPhrase": null,
            "visType": null,
            "tasks": [
              "filter",
              "distribution"
            ],
            "inferenceType": "implicit",
            "vlSpec": {
              "$schema": "https://vega.github.io/schema/vega-lite/v4.json",
              "mark": {
                "type": "tick",
                "tooltip": true
              },
              "encoding": {
                "x": {
                  "field": "Salary",
                  "type": "quantitative",
                  "aggregate": null,
                  "axis": {
                    "format": "s"
                  }
                },
                "tooltip": {
                  "field": "Name"
                }
              },
              "transform": [
                {
                  "filter": {
                    "field": "Foot",
                    "oneOf": [
                      "Left"
                    ]
                  }
                },
                {
                  "filter": {
                    "field": "Position",
                    "oneOf": [
                      "Forward"
                    ]
                  }
                }
              ],
              "data": {
                "url": "https://raw.githubusercontent.com/nl4dv/nl4dv/master/examples/assets/data/euro.csv",
                "format": {
                  "type": "csv"
                }
              }
            }
          },
          {
            "score": 4.5,
            "scoreObj": {
              "by_attributes": 1,
              "by_task": 2.5,
              "by_vis": 0
            },
            "confidenceObj": {
              "Salary": 1
            },
            "attributes": [
              "Salary"
            ],
            "queryPhrase": null,
            "visType": null,
            "tasks": [
              "filter",
              "distribution"
            ],
            "inferenceType": "implicit",
            "vlSpec": {
              "$schema": "https://vega.github.io/schema/vega-lite/v4.json",
              "mark": {
                "type": "boxplot",
                "tooltip": true
              },
              "encoding": {
                "x": {
                  "field": "Salary",
                  "type": "quantitative",
                  "aggregate": null,
                  "axis": {
                    "format": "s"
                  }
                },
                "tooltip": {
                  "field": "Name"
                }
              },
              "transform": [
                {
                  "filter": {
                    "field": "Foot",
                    "oneOf": [
                      "Left"
                    ]
                  }
                },
                {
                  "filter": {
                    "field": "Position",
                    "oneOf": [
                      "Forward"
                    ]
                  }
                }
              ],
              "data": {
                "url": "https://raw.githubusercontent.com/nl4dv/nl4dv/master/examples/assets/data/euro.csv",
                "format": {
                  "type": "csv"
                }
              }
            }
          }
        ],
        "attributeMap": {
          "Foot": {
            "name": "Foot",
            "queryPhrase": [
              "left"
            ],
            "inferenceType": "implicit",
            "matchScore": 0.5,
            "metric": [
              "attribute_exact_match",
              "attribute_domain_value_match"
            ],
            "isLabel": false,
            "isAmbiguous": false,
            "ambiguity": [],
            "encode": false,
            "meta": {
              "score": null,
              "threshold": null,
              "alias": null,
              "ambiguity": {
                "left": [
                  "Left"
                ]
              },
              "confidence": 100
            }
          },
          "Salary": {
            "name": "Salary",
            "queryPhrase": [
              "salaries"
            ],
            "inferenceType": "explicit",
            "matchScore": 1,
            "metric": [
              "attribute_exact_match"
            ],
            "isLabel": false,
            "encode": true,
            "isAmbiguous": false,
            "ambiguity": [],
            "meta": {
              "score": 100,
              "threshold": 85,
              "alias": null,
              "ambiguity": {},
              "confidence": 100
            }
          },
          "Position": {
            "name": "Position",
            "queryPhrase": [
              "forward"
            ],
            "inferenceType": "implicit",
            "matchScore": 0.5,
            "metric": [
              "attribute_domain_value_match"
            ],
            "isLabel": false,
            "isAmbiguous": false,
            "ambiguity": [],
            "encode": false,
            "meta": {
              "score": null,
              "threshold": null,
              "alias": null,
              "ambiguity": {
                "forward": [
                  "Forward"
                ]
              },
              "confidence": 100
            }
          }
        },
        "taskMap": {
          "filter": [
            {
              "task": "filter",
              "queryPhrase": [
                "left"
              ],
              "operator": "IN",
              "values": [
                "Left"
              ],
              "matchScore": 1,
              "attributes": [
                "Foot"
              ],
              "inferenceType": "explicit",
              "isAttrAmbiguous": false,
              "isValueAmbiguous": false,
              "meta": {
                "value_ambiguity_type": null
              }
            },
            {
              "task": "filter",
              "queryPhrase": [
                "forward"
              ],
              "operator": "IN",
              "values": [
                "Forward"
              ],
              "matchScore": 1,
              "attributes": [
                "Position"
              ],
              "inferenceType": "explicit",
              "isAttrAmbiguous": false,
              "isValueAmbiguous": false,
              "meta": {
                "value_ambiguity_type": null
              }
            }
          ],
          "distribution": [
            {
              "task": "distribution",
              "queryPhrase": [],
              "operator": null,
              "values": null,
              "matchScore": 0.5,
              "attributes": [
                "Salary"
              ],
              "inferenceType": "implicit",
              "isAttrAmbiguous": false,
              "isValueAmbiguous": false,
              "meta": {
                "value_ambiguity_type": null
              }
            }
          ]
        },
        "followUpQuery": false,
        "contextObj": null
      }
    },
    {
      "queryId": 20,
      "query": "find the correlation between player goals and salaries across player foot.",
      "output": {
        "status": "SUCCESS",
        "debug": {
          "execution_durations": {
            "clean_query": 0.01016998291015625,
            "extract_attributes": 0.8434219360351562,
            "extract_vis_type": 0.00004506111145019531,
            "extract_tasks": 1.1725449562072754,
            "get_vis_list": 0.00037288665771484375,
            "total": 2.026554822921753
          }
        },
        "query_raw": "find the correlation between player goals and salaries across player foot.",
        "query": "find the correlation between player goals and salaries across player foot .",
        "dataset": "https://raw.githubusercontent.com/nl4dv/nl4dv/master/examples/assets/data/euro.csv",
        "alias": "https://raw.githubusercontent.com/nl4dv/nl4dv/master/examples/assets/aliases/euro.json",
        "visList": [
          {
            "score": 7,
            "scoreObj": {
              "by_attributes": 3,
              "by_task": 1,
              "by_vis": 0
            },
            "confidenceObj": {
              "Salary": 1,
              "Goals": 1,
              "Foot": 1
            },
            "attributes": [
              "Salary",
              "Goals",
              "Foot"
            ],
            "queryPhrase": null,
            "visType": null,
            "tasks": [
              "correlation"
            ],
            "inferenceType": "implicit",
            "vlSpec": {
              "$schema": "https://vega.github.io/schema/vega-lite/v4.json",
              "mark": {
                "type": "point",
                "tooltip": true
              },
              "encoding": {
                "x": {
                  "field": "Salary",
                  "type": "quantitative",
                  "aggregate": null,
                  "axis": {
                    "format": "s"
                  }
                },
                "y": {
                  "field": "Goals",
                  "type": "quantitative",
                  "aggregate": null,
                  "axis": {
                    "format": "s"
                  }
                },
                "color": {
                  "field": "Foot",
                  "type": "nominal",
                  "aggregate": null
                },
                "tooltip": {
                  "field": "Name"
                }
              },
              "transform": [],
              "data": {
                "url": "https://raw.githubusercontent.com/nl4dv/nl4dv/master/examples/assets/data/euro.csv",
                "format": {
                  "type": "csv"
                }
              }
            }
          },
          {
            "score": 7,
            "scoreObj": {
              "by_attributes": 3,
              "by_task": 1,
              "by_vis": 0
            },
            "confidenceObj": {
              "Salary": 1,
              "Goals": 1,
              "Foot": 1
            },
            "attributes": [
              "Salary",
              "Goals",
              "Foot"
            ],
            "queryPhrase": null,
            "visType": null,
            "tasks": [
              "correlation"
            ],
            "inferenceType": "implicit",
            "vlSpec": {
              "$schema": "https://vega.github.io/schema/vega-lite/v4.json",
              "mark": {
                "type": "point",
                "tooltip": true
              },
              "encoding": {
                "x": {
                  "field": "Salary",
                  "type": "quantitative",
                  "aggregate": null,
                  "axis": {
                    "format": "s"
                  }
                },
                "y": {
                  "field": "Goals",
                  "type": "quantitative",
                  "aggregate": null,
                  "axis": {
                    "format": "s"
                  }
                },
                "column": {
                  "field": "Foot",
                  "type": "nominal",
                  "aggregate": null
                },
                "color": {
                  "field": "Foot",
                  "type": "nominal",
                  "aggregate": null
                },
                "tooltip": {
                  "field": "Name"
                }
              },
              "transform": [],
              "data": {
                "url": "https://raw.githubusercontent.com/nl4dv/nl4dv/master/examples/assets/data/euro.csv",
                "format": {
                  "type": "csv"
                }
              }
            }
          }
        ],
        "attributeMap": {
          "Foot": {
            "name": "Foot",
            "queryPhrase": [
              "foot"
            ],
            "inferenceType": "explicit",
            "matchScore": 1,
            "metric": [
              "attribute_exact_match"
            ],
            "isLabel": false,
            "encode": true,
            "isAmbiguous": false,
            "ambiguity": [],
            "meta": {
              "score": 100,
              "threshold": 85,
              "alias": null,
              "ambiguity": {},
              "confidence": 100
            }
          },
          "Salary": {
            "name": "Salary",
            "queryPhrase": [
              "salaries"
            ],
            "inferenceType": "explicit",
            "matchScore": 1,
            "metric": [
              "attribute_exact_match"
            ],
            "isLabel": false,
            "encode": true,
            "isAmbiguous": false,
            "ambiguity": [],
            "meta": {
              "score": 100,
              "threshold": 85,
              "alias": null,
              "ambiguity": {},
              "confidence": 100
            }
          },
          "Goals": {
            "name": "Goals",
            "queryPhrase": [
              "goals"
            ],
            "inferenceType": "explicit",
            "matchScore": 1,
            "metric": [
              "attribute_exact_match"
            ],
            "isLabel": false,
            "encode": true,
            "isAmbiguous": false,
            "ambiguity": [],
            "meta": {
              "score": 100,
              "threshold": 85,
              "alias": null,
              "ambiguity": {},
              "confidence": 100
            }
          }
        },
        "taskMap": {
          "correlation": [
            {
              "task": "correlation",
              "queryPhrase": "correlation",
              "operator": null,
              "values": [],
              "matchScore": 1,
              "attributes": [
                "Salary",
                "Goals"
              ],
              "inferenceType": "explicit",
              "isAttrAmbiguous": false,
              "isValueAmbiguous": false,
              "meta": {
                "value_ambiguity_type": null
              }
            }
          ]
        },
        "followUpQuery": false,
        "contextObj": null
      }
    },
    {
      "queryId": 21,
      "query": "show me a distribution of salaries across countries and player positions for right footed players.",
      "output": {
        "status": "SUCCESS",
        "debug": {
          "execution_durations": {
            "clean_query": 0.012674093246459961,
            "extract_attributes": 1.3612449169158936,
            "extract_vis_type": 0.00006508827209472656,
            "extract_tasks": 1.3272991180419922,
            "get_vis_list": 0.0004878044128417969,
            "total": 2.7017710208892822
          }
        },
        "query_raw": "show me a distribution of salaries across countries and player positions for right footed players.",
        "query": "show me a distribution of salaries across countries and player positions for right footed players .",
        "dataset": "https://raw.githubusercontent.com/nl4dv/nl4dv/master/examples/assets/data/euro.csv",
        "alias": "https://raw.githubusercontent.com/nl4dv/nl4dv/master/examples/assets/aliases/euro.json",
        "visList": [
          {
            "score": 8,
            "scoreObj": {
              "by_attributes": 3,
              "by_task": 2,
              "by_vis": 0
            },
            "confidenceObj": {
              "Salary": 1,
              "Position": 1,
              "Country": 1
            },
            "attributes": [
              "Salary",
              "Position",
              "Country"
            ],
            "queryPhrase": null,
            "visType": null,
            "tasks": [
              "distribution",
              "filter"
            ],
            "inferenceType": "implicit",
            "vlSpec": {
              "$schema": "https://vega.github.io/schema/vega-lite/v4.json",
              "mark": {
                "type": "tick",
                "tooltip": true
              },
              "encoding": {
                "y": {
                  "field": "Salary",
                  "type": "quantitative",
                  "aggregate": null,
                  "axis": {
                    "format": "s"
                  }
                },
                "x": {
                  "field": "Position",
                  "type": "nominal",
                  "aggregate": null
                },
                "color": {
                  "field": "Country",
                  "type": "nominal",
                  "aggregate": null
                },
                "tooltip": {
                  "field": "Name"
                }
              },
              "transform": [
                {
                  "filter": {
                    "field": "Foot",
                    "oneOf": [
                      "Right"
                    ]
                  }
                }
              ],
              "data": {
                "url": "https://raw.githubusercontent.com/nl4dv/nl4dv/master/examples/assets/data/euro.csv",
                "format": {
                  "type": "csv"
                }
              }
            }
          },
          {
            "score": 8,
            "scoreObj": {
              "by_attributes": 3,
              "by_task": 2,
              "by_vis": 0
            },
            "confidenceObj": {
              "Salary": 1,
              "Position": 1,
              "Country": 1
            },
            "attributes": [
              "Salary",
              "Position",
              "Country"
            ],
            "queryPhrase": null,
            "visType": null,
            "tasks": [
              "distribution",
              "filter"
            ],
            "inferenceType": "implicit",
            "vlSpec": {
              "$schema": "https://vega.github.io/schema/vega-lite/v4.json",
              "mark": {
                "type": "tick",
                "tooltip": true
              },
              "encoding": {
                "y": {
                  "field": "Salary",
                  "type": "quantitative",
                  "aggregate": null,
                  "axis": {
                    "format": "s"
                  }
                },
                "x": {
                  "field": "Position",
                  "type": "nominal",
                  "aggregate": null
                },
                "column": {
                  "field": "Country",
                  "type": "nominal",
                  "aggregate": null
                },
                "color": {
                  "field": "Country",
                  "type": "nominal",
                  "aggregate": null
                },
                "tooltip": {
                  "field": "Name"
                }
              },
              "transform": [
                {
                  "filter": {
                    "field": "Foot",
                    "oneOf": [
                      "Right"
                    ]
                  }
                }
              ],
              "data": {
                "url": "https://raw.githubusercontent.com/nl4dv/nl4dv/master/examples/assets/data/euro.csv",
                "format": {
                  "type": "csv"
                }
              }
            }
          },
          {
            "score": 8,
            "scoreObj": {
              "by_attributes": 3,
              "by_task": 2,
              "by_vis": 0
            },
            "confidenceObj": {
              "Salary": 1,
              "Position": 1,
              "Country": 1
            },
            "attributes": [
              "Salary",
              "Position",
              "Country"
            ],
            "queryPhrase": null,
            "visType": null,
            "tasks": [
              "distribution",
              "filter"
            ],
            "inferenceType": "implicit",
            "vlSpec": {
              "$schema": "https://vega.github.io/schema/vega-lite/v4.json",
              "mark": {
                "type": "tick",
                "tooltip": true
              },
              "encoding": {
                "y": {
                  "field": "Salary",
                  "type": "quantitative",
                  "aggregate": null,
                  "axis": {
                    "format": "s"
                  }
                },
                "x": {
                  "field": "Position",
                  "type": "nominal",
                  "aggregate": null
                },
                "size": {
                  "field": "Country",
                  "type": "nominal",
                  "aggregate": null
                },
                "tooltip": {
                  "field": "Name"
                }
              },
              "transform": [
                {
                  "filter": {
                    "field": "Foot",
                    "oneOf": [
                      "Right"
                    ]
                  }
                }
              ],
              "data": {
                "url": "https://raw.githubusercontent.com/nl4dv/nl4dv/master/examples/assets/data/euro.csv",
                "format": {
                  "type": "csv"
                }
              }
            }
          }
        ],
        "attributeMap": {
          "Foot": {
            "name": "Foot",
            "queryPhrase": [
              "right"
            ],
            "inferenceType": "implicit",
            "matchScore": 0.5,
            "metric": [
              "attribute_exact_match",
              "attribute_domain_value_match"
            ],
            "isLabel": false,
            "isAmbiguous": false,
            "ambiguity": [],
            "encode": false,
            "meta": {
              "score": null,
              "threshold": null,
              "alias": null,
              "ambiguity": {
                "right": [
                  "Right"
                ]
              },
              "confidence": 100
            }
          },
          "Position": {
            "name": "Position",
            "queryPhrase": [
              "positions"
            ],
            "inferenceType": "explicit",
            "matchScore": 1,
            "metric": [
              "attribute_exact_match"
            ],
            "isLabel": false,
            "encode": true,
            "isAmbiguous": false,
            "ambiguity": [],
            "meta": {
              "score": 100,
              "threshold": 85,
              "alias": null,
              "ambiguity": {},
              "confidence": 100
            }
          },
          "Country": {
            "name": "Country",
            "queryPhrase": [
              "countries"
            ],
            "inferenceType": "explicit",
            "matchScore": 1,
            "metric": [
              "attribute_exact_match"
            ],
            "isLabel": false,
            "encode": true,
            "isAmbiguous": false,
            "ambiguity": [],
            "meta": {
              "score": 100,
              "threshold": 85,
              "alias": null,
              "ambiguity": {},
              "confidence": 100
            }
          },
          "Salary": {
            "name": "Salary",
            "queryPhrase": [
              "salaries"
            ],
            "inferenceType": "explicit",
            "matchScore": 1,
            "metric": [
              "attribute_exact_match"
            ],
            "isLabel": false,
            "encode": true,
            "isAmbiguous": false,
            "ambiguity": [],
            "meta": {
              "score": 100,
              "threshold": 85,
              "alias": null,
              "ambiguity": {},
              "confidence": 100
            }
          }
        },
        "taskMap": {
          "distribution": [
            {
              "task": "distribution",
              "queryPhrase": "distribution",
              "operator": null,
              "values": [],
              "matchScore": 1,
              "attributes": [
                "Salary"
              ],
              "inferenceType": "explicit",
              "isAttrAmbiguous": false,
              "isValueAmbiguous": false,
              "meta": {
                "value_ambiguity_type": null
              }
            }
          ],
          "filter": [
            {
              "task": "filter",
              "queryPhrase": [
                "right"
              ],
              "operator": "IN",
              "values": [
                "Right"
              ],
              "matchScore": 1,
              "attributes": [
                "Foot"
              ],
              "inferenceType": "explicit",
              "isAttrAmbiguous": false,
              "isValueAmbiguous": false,
              "meta": {
                "value_ambiguity_type": null
              }
            }
          ]
        },
        "followUpQuery": false,
        "contextObj": null
      }
    },
    {
      "queryId": 22,
      "query": "show me a distribution of salaries across countries and player positions for right footed players and age greater than 30.",
      "output": {
        "status": "SUCCESS",
        "debug": {
          "execution_durations": {
            "clean_query": 0.02228093147277832,
            "extract_attributes": 2.0182809829711914,
            "extract_vis_type": 0.00010085105895996094,
            "extract_tasks": 1.278569221496582,
            "get_vis_list": 0.0005681514739990234,
            "total": 3.3198001384735107
          }
        },
        "query_raw": "show me a distribution of salaries across countries and player positions for right footed players and age greater than 30.",
        "query": "show me a distribution of salaries across countries and player positions for right footed players and age greater than 30 .",
        "dataset": "https://raw.githubusercontent.com/nl4dv/nl4dv/master/examples/assets/data/euro.csv",
        "alias": "https://raw.githubusercontent.com/nl4dv/nl4dv/master/examples/assets/aliases/euro.json",
        "visList": [
          {
            "score": 9,
            "scoreObj": {
              "by_attributes": 3,
              "by_task": 3,
              "by_vis": 0
            },
            "confidenceObj": {
              "Salary": 1,
              "Position": 1,
              "Country": 1
            },
            "attributes": [
              "Salary",
              "Position",
              "Country"
            ],
            "queryPhrase": null,
            "visType": null,
            "tasks": [
              "distribution",
              "filter"
            ],
            "inferenceType": "implicit",
            "vlSpec": {
              "$schema": "https://vega.github.io/schema/vega-lite/v4.json",
              "mark": {
                "type": "tick",
                "tooltip": true
              },
              "encoding": {
                "y": {
                  "field": "Salary",
                  "type": "quantitative",
                  "aggregate": null,
                  "axis": {
                    "format": "s"
                  }
                },
                "x": {
                  "field": "Position",
                  "type": "nominal",
                  "aggregate": null
                },
                "color": {
                  "field": "Country",
                  "type": "nominal",
                  "aggregate": null
                },
                "tooltip": {
                  "field": "Name"
                }
              },
              "transform": [
                {
                  "filter": "lower(datum[\"Age\"]) > 30.0"
                },
                {
                  "filter": {
                    "field": "Foot",
                    "oneOf": [
                      "Right"
                    ]
                  }
                }
              ],
              "data": {
                "url": "https://raw.githubusercontent.com/nl4dv/nl4dv/master/examples/assets/data/euro.csv",
                "format": {
                  "type": "csv"
                }
              }
            }
          },
          {
            "score": 9,
            "scoreObj": {
              "by_attributes": 3,
              "by_task": 3,
              "by_vis": 0
            },
            "confidenceObj": {
              "Salary": 1,
              "Position": 1,
              "Country": 1
            },
            "attributes": [
              "Salary",
              "Position",
              "Country"
            ],
            "queryPhrase": null,
            "visType": null,
            "tasks": [
              "distribution",
              "filter"
            ],
            "inferenceType": "implicit",
            "vlSpec": {
              "$schema": "https://vega.github.io/schema/vega-lite/v4.json",
              "mark": {
                "type": "tick",
                "tooltip": true
              },
              "encoding": {
                "y": {
                  "field": "Salary",
                  "type": "quantitative",
                  "aggregate": null,
                  "axis": {
                    "format": "s"
                  }
                },
                "x": {
                  "field": "Position",
                  "type": "nominal",
                  "aggregate": null
                },
                "column": {
                  "field": "Country",
                  "type": "nominal",
                  "aggregate": null
                },
                "color": {
                  "field": "Country",
                  "type": "nominal",
                  "aggregate": null
                },
                "tooltip": {
                  "field": "Name"
                }
              },
              "transform": [
                {
                  "filter": "lower(datum[\"Age\"]) > 30.0"
                },
                {
                  "filter": {
                    "field": "Foot",
                    "oneOf": [
                      "Right"
                    ]
                  }
                }
              ],
              "data": {
                "url": "https://raw.githubusercontent.com/nl4dv/nl4dv/master/examples/assets/data/euro.csv",
                "format": {
                  "type": "csv"
                }
              }
            }
          },
          {
            "score": 9,
            "scoreObj": {
              "by_attributes": 3,
              "by_task": 3,
              "by_vis": 0
            },
            "confidenceObj": {
              "Salary": 1,
              "Position": 1,
              "Country": 1
            },
            "attributes": [
              "Salary",
              "Position",
              "Country"
            ],
            "queryPhrase": null,
            "visType": null,
            "tasks": [
              "distribution",
              "filter"
            ],
            "inferenceType": "implicit",
            "vlSpec": {
              "$schema": "https://vega.github.io/schema/vega-lite/v4.json",
              "mark": {
                "type": "tick",
                "tooltip": true
              },
              "encoding": {
                "y": {
                  "field": "Salary",
                  "type": "quantitative",
                  "aggregate": null,
                  "axis": {
                    "format": "s"
                  }
                },
                "x": {
                  "field": "Position",
                  "type": "nominal",
                  "aggregate": null
                },
                "size": {
                  "field": "Country",
                  "type": "nominal",
                  "aggregate": null
                },
                "tooltip": {
                  "field": "Name"
                }
              },
              "transform": [
                {
                  "filter": "lower(datum[\"Age\"]) > 30.0"
                },
                {
                  "filter": {
                    "field": "Foot",
                    "oneOf": [
                      "Right"
                    ]
                  }
                }
              ],
              "data": {
                "url": "https://raw.githubusercontent.com/nl4dv/nl4dv/master/examples/assets/data/euro.csv",
                "format": {
                  "type": "csv"
                }
              }
            }
          }
        ],
        "attributeMap": {
          "Foot": {
            "name": "Foot",
            "queryPhrase": [
              "right"
            ],
            "inferenceType": "implicit",
            "matchScore": 0.5,
            "metric": [
              "attribute_exact_match",
              "attribute_domain_value_match"
            ],
            "isLabel": false,
            "isAmbiguous": false,
            "ambiguity": [],
            "encode": false,
            "meta": {
              "score": null,
              "threshold": null,
              "alias": null,
              "ambiguity": {
                "right": [
                  "Right"
                ]
              },
              "confidence": 100
            }
          },
          "Position": {
            "name": "Position",
            "queryPhrase": [
              "positions"
            ],
            "inferenceType": "explicit",
            "matchScore": 1,
            "metric": [
              "attribute_exact_match"
            ],
            "isLabel": false,
            "encode": true,
            "isAmbiguous": false,
            "ambiguity": [],
            "meta": {
              "score": 100,
              "threshold": 85,
              "alias": null,
              "ambiguity": {},
              "confidence": 100
            }
          },
          "Country": {
            "name": "Country",
            "queryPhrase": [
              "countries"
            ],
            "inferenceType": "explicit",
            "matchScore": 1,
            "metric": [
              "attribute_exact_match"
            ],
            "isLabel": false,
            "encode": true,
            "isAmbiguous": false,
            "ambiguity": [],
            "meta": {
              "score": 100,
              "threshold": 85,
              "alias": null,
              "ambiguity": {},
              "confidence": 100
            }
          },
          "Age": {
            "name": "Age",
            "queryPhrase": [
              "age"
            ],
            "inferenceType": "explicit",
            "matchScore": 1,
            "metric": [
              "attribute_exact_match"
            ],
            "isLabel": false,
            "encode": false,
            "isAmbiguous": false,
            "ambiguity": [],
            "meta": {
              "score": 100,
              "threshold": 85,
              "alias": null,
              "ambiguity": {},
              "confidence": 100
            }
          },
          "Salary": {
            "name": "Salary",
            "queryPhrase": [
              "salaries"
            ],
            "inferenceType": "explicit",
            "matchScore": 1,
            "metric": [
              "attribute_exact_match"
            ],
            "isLabel": false,
            "encode": true,
            "isAmbiguous": false,
            "ambiguity": [],
            "meta": {
              "score": 100,
              "threshold": 85,
              "alias": null,
              "ambiguity": {},
              "confidence": 100
            }
          }
        },
        "taskMap": {
          "distribution": [
            {
              "task": "distribution",
              "queryPhrase": "distribution",
              "operator": null,
              "values": [],
              "matchScore": 1,
              "attributes": [
                "Salary"
              ],
              "inferenceType": "explicit",
              "isAttrAmbiguous": false,
              "isValueAmbiguous": false,
              "meta": {
                "value_ambiguity_type": null
              }
            }
          ],
          "filter": [
            {
              "task": "filter",
              "queryPhrase": "greater",
              "operator": "GT",
              "values": [
                30
              ],
              "matchScore": 1,
              "attributes": [
                "Age"
              ],
              "inferenceType": "explicit",
              "isAttrAmbiguous": false,
              "isValueAmbiguous": false,
              "meta": {
                "value_ambiguity_type": null
              }
            },
            {
              "task": "filter",
              "queryPhrase": [
                "right"
              ],
              "operator": "IN",
              "values": [
                "Right"
              ],
              "matchScore": 1,
              "attributes": [
                "Foot"
              ],
              "inferenceType": "explicit",
              "isAttrAmbiguous": false,
              "isValueAmbiguous": false,
              "meta": {
                "value_ambiguity_type": null
              }
            }
          ]
        },
        "followUpQuery": false,
        "contextObj": null
      }
    }
  ],
  "underspecified-attributes-vis": [
    {
      "queryId": 23,
      "query": "create a histogram of mpg",
      "output": {
        "status": "SUCCESS",
        "debug": {
          "execution_durations": {
            "clean_query": 0.001558065414428711,
            "extract_attributes": 0.10659003257751465,
            "extract_vis_type": 0.000010013580322265625,
            "extract_tasks": 1.0255670547485352,
            "get_vis_list": 0.0002110004425048828,
            "total": 1.1339361667633057
          }
        },
        "query_raw": "create a histogram of mpg",
        "query": "create a histogram of mpg",
        "dataset": "https://raw.githubusercontent.com/nl4dv/nl4dv/master/examples/assets/data/cars-w-year.csv",
        "alias": "https://raw.githubusercontent.com/nl4dv/nl4dv/master/examples/assets/aliases/cars-w-year.json",
        "visList": [
          {
            "score": 3.5,
            "scoreObj": {
              "by_attributes": 1,
              "by_task": 0.5,
              "by_vis": 1
            },
            "confidenceObj": {
              "MPG": 1
            },
            "attributes": [
              "MPG"
            ],
            "queryPhrase": "histogram",
            "visType": "histogram",
            "tasks": [
              "distribution"
            ],
            "inferenceType": "explicit",
            "vlSpec": {
              "$schema": "https://vega.github.io/schema/vega-lite/v4.json",
              "mark": {
                "type": "bar",
                "tooltip": true
              },
              "encoding": {
                "x": {
                  "field": "MPG",
                  "type": "quantitative",
                  "aggregate": null,
                  "bin": true,
                  "axis": {
                    "format": "s"
                  }
                },
                "y": {
                  "field": "MPG",
                  "type": "quantitative",
                  "aggregate": "count",
                  "axis": {
                    "format": "s"
                  }
                }
              },
              "transform": [],
              "data": {
                "url": "https://raw.githubusercontent.com/nl4dv/nl4dv/master/examples/assets/data/cars-w-year.csv",
                "format": {
                  "type": "csv"
                }
              }
            }
          }
        ],
        "attributeMap": {
          "MPG": {
            "name": "MPG",
            "queryPhrase": [
              "mpg"
            ],
            "inferenceType": "explicit",
            "matchScore": 1,
            "metric": [
              "attribute_exact_match"
            ],
            "isLabel": false,
            "encode": true,
            "isAmbiguous": false,
            "ambiguity": [],
            "meta": {
              "score": 100,
              "threshold": 85,
              "alias": null,
              "ambiguity": {},
              "confidence": 100
            }
          }
        },
        "taskMap": {
          "distribution": [
            {
              "task": "distribution",
              "queryPhrase": [],
              "operator": null,
              "values": null,
              "matchScore": 0.5,
              "attributes": [
                "MPG"
              ],
              "inferenceType": "implicit",
              "isAttrAmbiguous": false,
              "isValueAmbiguous": false,
              "meta": {
                "value_ambiguity_type": null
              }
            }
          ]
        },
        "followUpQuery": false,
        "contextObj": null
      }
    },
    {
      "queryId": 24,
      "query": "visualize acceleration as a boxplot",
      "output": {
        "status": "SUCCESS",
        "debug": {
          "execution_durations": {
            "clean_query": 0.0018239021301269531,
            "extract_attributes": 0.06856870651245117,
            "extract_vis_type": 0.0000209808349609375,
            "extract_tasks": 1.0160939693450928,
            "get_vis_list": 0.00019931793212890625,
            "total": 1.0867068767547607
          }
        },
        "query_raw": "visualize acceleration as a boxplot",
        "query": "visualize acceleration as a boxplot",
        "dataset": "https://raw.githubusercontent.com/nl4dv/nl4dv/master/examples/assets/data/cars-w-year.csv",
        "alias": "https://raw.githubusercontent.com/nl4dv/nl4dv/master/examples/assets/aliases/cars-w-year.json",
        "visList": [
          {
            "score": 3.5,
            "scoreObj": {
              "by_attributes": 1,
              "by_task": 0.5,
              "by_vis": 1
            },
            "confidenceObj": {
              "Acceleration": 1
            },
            "attributes": [
              "Acceleration"
            ],
            "queryPhrase": "boxplot",
            "visType": "boxplot",
            "tasks": [
              "distribution"
            ],
            "inferenceType": "explicit",
            "vlSpec": {
              "$schema": "https://vega.github.io/schema/vega-lite/v4.json",
              "mark": {
                "type": "boxplot",
                "tooltip": true
              },
              "encoding": {
                "x": {
                  "field": "Acceleration",
                  "type": "quantitative",
                  "aggregate": null,
                  "axis": {
                    "format": "s"
                  }
                },
                "tooltip": {
                  "field": "Model"
                }
              },
              "transform": [],
              "data": {
                "url": "https://raw.githubusercontent.com/nl4dv/nl4dv/master/examples/assets/data/cars-w-year.csv",
                "format": {
                  "type": "csv"
                }
              }
            }
          }
        ],
        "attributeMap": {
          "Acceleration": {
            "name": "Acceleration",
            "queryPhrase": [
              "acceleration"
            ],
            "inferenceType": "explicit",
            "matchScore": 1,
            "metric": [
              "attribute_exact_match"
            ],
            "isLabel": false,
            "encode": true,
            "isAmbiguous": false,
            "ambiguity": [],
            "meta": {
              "score": 100,
              "threshold": 85,
              "alias": null,
              "ambiguity": {},
              "confidence": 100
            }
          }
        },
        "taskMap": {
          "distribution": [
            {
              "task": "distribution",
              "queryPhrase": [],
              "operator": null,
              "values": null,
              "matchScore": 0.5,
              "attributes": [
                "Acceleration"
              ],
              "inferenceType": "implicit",
              "isAttrAmbiguous": false,
              "isValueAmbiguous": false,
              "meta": {
                "value_ambiguity_type": null
              }
            }
          ]
        },
        "followUpQuery": false,
        "contextObj": null
      }
    },
    {
      "queryId": 25,
      "query": "show origin as a bar chart",
      "output": {
        "status": "SUCCESS",
        "debug": {
          "execution_durations": {
            "clean_query": 0.0020987987518310547,
            "extract_attributes": 0.22130513191223145,
            "extract_vis_type": 0.0000152587890625,
            "extract_tasks": 1.0492877960205078,
            "get_vis_list": 0.00014591217041015625,
            "total": 1.272852897644043
          }
        },
        "query_raw": "show origin as a bar chart",
        "query": "show origin as a bar chart",
        "dataset": "https://raw.githubusercontent.com/nl4dv/nl4dv/master/examples/assets/data/cars-w-year.csv",
        "alias": "https://raw.githubusercontent.com/nl4dv/nl4dv/master/examples/assets/aliases/cars-w-year.json",
        "visList": [
          {
            "score": 3.5,
            "scoreObj": {
              "by_attributes": 1,
              "by_task": 0.5,
              "by_vis": 1
            },
            "confidenceObj": {
              "Origin": 1
            },
            "attributes": [
              "Origin"
            ],
            "queryPhrase": "bar chart",
            "visType": "barchart",
            "tasks": [
              "distribution"
            ],
            "inferenceType": "explicit",
            "vlSpec": {
              "$schema": "https://vega.github.io/schema/vega-lite/v4.json",
              "mark": {
                "type": "bar",
                "tooltip": true
              },
              "encoding": {
                "x": {
                  "field": "Origin",
                  "type": "nominal",
                  "aggregate": null
                },
                "y": {
                  "field": "Origin",
                  "type": "nominal",
                  "aggregate": "count"
                }
              },
              "transform": [],
              "data": {
                "url": "https://raw.githubusercontent.com/nl4dv/nl4dv/master/examples/assets/data/cars-w-year.csv",
                "format": {
                  "type": "csv"
                }
              }
            }
          }
        ],
        "attributeMap": {
          "Origin": {
            "name": "Origin",
            "queryPhrase": [
              "origin"
            ],
            "inferenceType": "explicit",
            "matchScore": 1,
            "metric": [
              "attribute_exact_match"
            ],
            "isLabel": false,
            "encode": true,
            "isAmbiguous": false,
            "ambiguity": [],
            "meta": {
              "score": 100,
              "threshold": 85,
              "alias": null,
              "ambiguity": {},
              "confidence": 100
            }
          }
        },
        "taskMap": {
          "distribution": [
            {
              "task": "distribution",
              "queryPhrase": [],
              "operator": null,
              "values": null,
              "matchScore": 0.5,
              "attributes": [
                "Origin"
              ],
              "inferenceType": "implicit",
              "isAttrAmbiguous": false,
              "isValueAmbiguous": false,
              "meta": {
                "value_ambiguity_type": null
              }
            }
          ]
        },
        "followUpQuery": false,
        "contextObj": null
      }
    },
    {
      "queryId": 26,
      "query": "visualize hp and displacement as a scatterplot",
      "output": {
        "status": "SUCCESS",
        "debug": {
          "execution_durations": {
            "clean_query": 0.0019998550415039062,
            "extract_attributes": 0.11144399642944336,
            "extract_vis_type": 0.00001811981201171875,
            "extract_tasks": 1.0376789569854736,
            "get_vis_list": 0.0001819133758544922,
            "total": 1.151322841644287
          }
        },
        "query_raw": "visualize hp and displacement as a scatterplot",
        "query": "visualize hp and displacement as a scatterplot",
        "dataset": "https://raw.githubusercontent.com/nl4dv/nl4dv/master/examples/assets/data/cars-w-year.csv",
        "alias": "https://raw.githubusercontent.com/nl4dv/nl4dv/master/examples/assets/aliases/cars-w-year.json",
        "visList": [
          {
            "score": 5,
            "scoreObj": {
              "by_attributes": 1.5,
              "by_task": 0.5,
              "by_vis": 1
            },
            "confidenceObj": {
              "Displacement": 1,
              "Horsepower": 1
            },
            "attributes": [
              "Displacement",
              "Horsepower"
            ],
            "queryPhrase": "scatterplot",
            "visType": "scatterplot",
            "tasks": [
              "correlation"
            ],
            "inferenceType": "explicit",
            "vlSpec": {
              "$schema": "https://vega.github.io/schema/vega-lite/v4.json",
              "mark": {
                "type": "point",
                "tooltip": true
              },
              "encoding": {
                "x": {
                  "field": "Displacement",
                  "type": "quantitative",
                  "aggregate": null,
                  "axis": {
                    "format": "s"
                  }
                },
                "y": {
                  "field": "Horsepower",
                  "type": "quantitative",
                  "aggregate": null,
                  "axis": {
                    "format": "s"
                  }
                },
                "tooltip": {
                  "field": "Model"
                }
              },
              "transform": [],
              "data": {
                "url": "https://raw.githubusercontent.com/nl4dv/nl4dv/master/examples/assets/data/cars-w-year.csv",
                "format": {
                  "type": "csv"
                }
              }
            }
          }
        ],
        "attributeMap": {
          "Displacement": {
            "name": "Displacement",
            "queryPhrase": [
              "displacement"
            ],
            "inferenceType": "explicit",
            "matchScore": 1,
            "metric": [
              "attribute_exact_match"
            ],
            "isLabel": false,
            "encode": true,
            "isAmbiguous": false,
            "ambiguity": [],
            "meta": {
              "score": 100,
              "threshold": 85,
              "alias": null,
              "ambiguity": {},
              "confidence": 100
            }
          },
          "Horsepower": {
            "name": "Horsepower",
            "queryPhrase": [
              "hp"
            ],
            "matchScore": 0.5,
            "inferenceType": "explicit",
            "metric": [
              "attribute_synonym_match"
            ],
            "isLabel": false,
            "encode": true,
            "isAmbiguous": false,
            "ambiguity": [],
            "meta": {
              "score": 100,
              "threshold": 95,
              "alias": null,
              "ambiguity": {},
              "confidence": 100
            }
          }
        },
        "taskMap": {
          "correlation": [
            {
              "task": "correlation",
              "queryPhrase": [],
              "operator": null,
              "values": null,
              "matchScore": 0.5,
              "attributes": [
                "Displacement",
                "Horsepower"
              ],
              "inferenceType": "implicit",
              "isAttrAmbiguous": false,
              "isValueAmbiguous": false,
              "meta": {
                "value_ambiguity_type": null
              }
            }
          ]
        },
        "followUpQuery": false,
        "contextObj": null
      }
    },
    {
      "queryId": 27,
      "query": "show a linechart of horsepower over the years",
      "output": {
        "status": "SUCCESS",
        "debug": {
          "execution_durations": {
            "clean_query": 0.0022389888763427734,
            "extract_attributes": 0.14880704879760742,
            "extract_vis_type": 0.00002002716064453125,
            "extract_tasks": 1.0197999477386475,
            "get_vis_list": 0.0002338886260986328,
            "total": 1.1710999011993408
          }
        },
        "query_raw": "show a linechart of horsepower over the years",
        "query": "show a linechart of horsepower over the years",
        "dataset": "https://raw.githubusercontent.com/nl4dv/nl4dv/master/examples/assets/data/cars-w-year.csv",
        "alias": "https://raw.githubusercontent.com/nl4dv/nl4dv/master/examples/assets/aliases/cars-w-year.json",
        "visList": [
          {
            "score": 5,
            "scoreObj": {
              "by_attributes": 2,
              "by_task": 0,
              "by_vis": 1
            },
            "confidenceObj": {
              "Horsepower": 1,
              "Year": 1
            },
            "attributes": [
              "Horsepower",
              "Year"
            ],
            "queryPhrase": "linechart",
            "visType": "linechart",
            "tasks": [
              "trend"
            ],
            "inferenceType": "explicit",
            "vlSpec": {
              "$schema": "https://vega.github.io/schema/vega-lite/v4.json",
              "mark": {
                "type": "line",
                "tooltip": true
              },
              "encoding": {
                "y": {
                  "field": "Horsepower",
                  "type": "quantitative",
                  "aggregate": "mean",
                  "axis": {
                    "format": "s"
                  }
                },
                "x": {
                  "field": "Year",
                  "type": "temporal",
                  "aggregate": null
                }
              },
              "transform": [],
              "data": {
                "url": "https://raw.githubusercontent.com/nl4dv/nl4dv/master/examples/assets/data/cars-w-year.csv",
                "format": {
                  "type": "csv"
                }
              }
            }
          }
        ],
        "attributeMap": {
          "Horsepower": {
            "name": "Horsepower",
            "queryPhrase": [
              "horsepower"
            ],
            "inferenceType": "explicit",
            "matchScore": 1,
            "metric": [
              "attribute_exact_match"
            ],
            "isLabel": false,
            "encode": true,
            "isAmbiguous": false,
            "ambiguity": [],
            "meta": {
              "score": 100,
              "threshold": 85,
              "alias": null,
              "ambiguity": {},
              "confidence": 100
            }
          },
          "Year": {
            "name": "Year",
            "queryPhrase": [
              "years"
            ],
            "inferenceType": "explicit",
            "matchScore": 1,
            "metric": [
              "attribute_exact_match"
            ],
            "isLabel": false,
            "encode": true,
            "isAmbiguous": false,
            "ambiguity": [],
            "meta": {
              "score": 100,
              "threshold": 85,
              "alias": null,
              "ambiguity": {},
              "confidence": 100
            }
          }
        },
        "taskMap": {
          "trend": [
            {
              "task": "trend",
              "queryPhrase": [],
              "operator": null,
              "values": null,
              "matchScore": 0.5,
              "attributes": [
                "Horsepower",
                "Year"
              ],
              "inferenceType": "implicit",
              "isAttrAmbiguous": false,
              "isValueAmbiguous": false,
              "meta": {
                "value_ambiguity_type": null
              }
            }
          ]
        },
        "followUpQuery": false,
        "contextObj": null
      }
    },
    {
      "queryId": 28,
      "query": "show a scatterplot of acceleration and mpg across origins",
      "output": {
        "status": "SUCCESS",
        "debug": {
          "execution_durations": {
            "clean_query": 0.004311084747314453,
            "extract_attributes": 0.2223827838897705,
            "extract_vis_type": 0.000025272369384765625,
            "extract_tasks": 1.0758881568908691,
            "get_vis_list": 0.00038623809814453125,
            "total": 1.3029935359954834
          }
        },
        "query_raw": "show a scatterplot of acceleration and mpg across origins",
        "query": "show a scatterplot of acceleration and mpg across origins",
        "dataset": "https://raw.githubusercontent.com/nl4dv/nl4dv/master/examples/assets/data/cars-w-year.csv",
        "alias": "https://raw.githubusercontent.com/nl4dv/nl4dv/master/examples/assets/aliases/cars-w-year.json",
        "visList": [
          {
            "score": 7.5,
            "scoreObj": {
              "by_attributes": 3,
              "by_task": 0.5,
              "by_vis": 1
            },
            "confidenceObj": {
              "MPG": 1,
              "Acceleration": 1,
              "Origin": 1
            },
            "attributes": [
              "MPG",
              "Acceleration",
              "Origin"
            ],
            "queryPhrase": "scatterplot",
            "visType": "scatterplot",
            "tasks": [
              "correlation"
            ],
            "inferenceType": "explicit",
            "vlSpec": {
              "$schema": "https://vega.github.io/schema/vega-lite/v4.json",
              "mark": {
                "type": "point",
                "tooltip": true
              },
              "encoding": {
                "x": {
                  "field": "MPG",
                  "type": "quantitative",
                  "aggregate": null,
                  "axis": {
                    "format": "s"
                  }
                },
                "y": {
                  "field": "Acceleration",
                  "type": "quantitative",
                  "aggregate": null,
                  "axis": {
                    "format": "s"
                  }
                },
                "color": {
                  "field": "Origin",
                  "type": "nominal",
                  "aggregate": null
                },
                "tooltip": {
                  "field": "Model"
                }
              },
              "transform": [],
              "data": {
                "url": "https://raw.githubusercontent.com/nl4dv/nl4dv/master/examples/assets/data/cars-w-year.csv",
                "format": {
                  "type": "csv"
                }
              }
            }
          },
          {
            "score": 7.5,
            "scoreObj": {
              "by_attributes": 3,
              "by_task": 0.5,
              "by_vis": 1
            },
            "confidenceObj": {
              "MPG": 1,
              "Acceleration": 1,
              "Origin": 1
            },
            "attributes": [
              "MPG",
              "Acceleration",
              "Origin"
            ],
            "queryPhrase": "scatterplot",
            "visType": "scatterplot",
            "tasks": [
              "correlation"
            ],
            "inferenceType": "explicit",
            "vlSpec": {
              "$schema": "https://vega.github.io/schema/vega-lite/v4.json",
              "mark": {
                "type": "point",
                "tooltip": true
              },
              "encoding": {
                "x": {
                  "field": "MPG",
                  "type": "quantitative",
                  "aggregate": null,
                  "axis": {
                    "format": "s"
                  }
                },
                "y": {
                  "field": "Acceleration",
                  "type": "quantitative",
                  "aggregate": null,
                  "axis": {
                    "format": "s"
                  }
                },
                "column": {
                  "field": "Origin",
                  "type": "nominal",
                  "aggregate": null
                },
                "color": {
                  "field": "Origin",
                  "type": "nominal",
                  "aggregate": null
                },
                "tooltip": {
                  "field": "Model"
                }
              },
              "transform": [],
              "data": {
                "url": "https://raw.githubusercontent.com/nl4dv/nl4dv/master/examples/assets/data/cars-w-year.csv",
                "format": {
                  "type": "csv"
                }
              }
            }
          }
        ],
        "attributeMap": {
          "MPG": {
            "name": "MPG",
            "queryPhrase": [
              "mpg"
            ],
            "inferenceType": "explicit",
            "matchScore": 1,
            "metric": [
              "attribute_exact_match"
            ],
            "isLabel": false,
            "encode": true,
            "isAmbiguous": false,
            "ambiguity": [],
            "meta": {
              "score": 100,
              "threshold": 85,
              "alias": null,
              "ambiguity": {},
              "confidence": 100
            }
          },
          "Acceleration": {
            "name": "Acceleration",
            "queryPhrase": [
              "acceleration"
            ],
            "inferenceType": "explicit",
            "matchScore": 1,
            "metric": [
              "attribute_exact_match"
            ],
            "isLabel": false,
            "encode": true,
            "isAmbiguous": false,
            "ambiguity": [],
            "meta": {
              "score": 100,
              "threshold": 85,
              "alias": null,
              "ambiguity": {},
              "confidence": 100
            }
          },
          "Origin": {
            "name": "Origin",
            "queryPhrase": [
              "origins"
            ],
            "inferenceType": "explicit",
            "matchScore": 1,
            "metric": [
              "attribute_exact_match"
            ],
            "isLabel": false,
            "encode": true,
            "isAmbiguous": false,
            "ambiguity": [],
            "meta": {
              "score": 100,
              "threshold": 85,
              "alias": null,
              "ambiguity": {},
              "confidence": 100
            }
          }
        },
        "taskMap": {
          "correlation": [
            {
              "task": "correlation",
              "queryPhrase": [],
              "operator": null,
              "values": null,
              "matchScore": 0.5,
              "attributes": [
                "MPG",
                "Acceleration"
              ],
              "inferenceType": "implicit",
              "isAttrAmbiguous": false,
              "isValueAmbiguous": false,
              "meta": {
                "value_ambiguity_type": null
              }
            }
          ]
        },
        "followUpQuery": false,
        "contextObj": null
      }
    },
    {
      "queryId": 29,
      "query": "show an area chart of how acceleration has evolved over the years across origin",
      "output": {
        "status": "SUCCESS",
        "debug": {
          "execution_durations": {
            "clean_query": 0.007758140563964844,
            "extract_attributes": 0.38724493980407715,
            "extract_vis_type": 0.000031948089599609375,
            "extract_tasks": 1.090451955795288,
            "get_vis_list": 0.0005097389221191406,
            "total": 1.4859967231750488
          }
        },
        "query_raw": "show an area chart of how acceleration has evolved over the years across origin",
        "query": "show an area chart of how acceleration has evolved over the years across origin",
        "dataset": "https://raw.githubusercontent.com/nl4dv/nl4dv/master/examples/assets/data/cars-w-year.csv",
        "alias": "https://raw.githubusercontent.com/nl4dv/nl4dv/master/examples/assets/aliases/cars-w-year.json",
        "visList": [
          {
            "score": 7,
            "scoreObj": {
              "by_attributes": 3,
              "by_task": 0,
              "by_vis": 1
            },
            "confidenceObj": {
              "Acceleration": 1,
              "Origin": 1,
              "Year": 1
            },
            "attributes": [
              "Acceleration",
              "Origin",
              "Year"
            ],
            "queryPhrase": "area chart",
            "visType": "areachart",
            "tasks": [
              "trend"
            ],
            "inferenceType": "explicit",
            "vlSpec": {
              "$schema": "https://vega.github.io/schema/vega-lite/v4.json",
              "mark": {
                "type": "area",
                "tooltip": true
              },
              "encoding": {
                "y": {
                  "field": "Acceleration",
                  "type": "quantitative",
                  "aggregate": "mean",
                  "axis": {
                    "format": "s"
                  }
                },
                "color": {
                  "field": "Origin",
                  "type": "nominal",
                  "aggregate": null
                },
                "x": {
                  "field": "Year",
                  "type": "temporal",
                  "aggregate": null
                }
              },
              "transform": [],
              "data": {
                "url": "https://raw.githubusercontent.com/nl4dv/nl4dv/master/examples/assets/data/cars-w-year.csv",
                "format": {
                  "type": "csv"
                }
              }
            }
          },
          {
            "score": 7,
            "scoreObj": {
              "by_attributes": 3,
              "by_task": 0,
              "by_vis": 1
            },
            "confidenceObj": {
              "Acceleration": 1,
              "Origin": 1,
              "Year": 1
            },
            "attributes": [
              "Acceleration",
              "Origin",
              "Year"
            ],
            "queryPhrase": "area chart",
            "visType": "areachart",
            "tasks": [
              "trend"
            ],
            "inferenceType": "explicit",
            "vlSpec": {
              "$schema": "https://vega.github.io/schema/vega-lite/v4.json",
              "mark": {
                "type": "area",
                "tooltip": true
              },
              "encoding": {
                "y": {
                  "field": "Acceleration",
                  "type": "quantitative",
                  "aggregate": "mean",
                  "axis": {
                    "format": "s"
                  }
                },
                "column": {
                  "field": "Origin",
                  "type": "nominal",
                  "aggregate": null
                },
                "x": {
                  "field": "Year",
                  "type": "temporal",
                  "aggregate": null
                },
                "color": {
                  "field": "Origin",
                  "type": "nominal",
                  "aggregate": null
                }
              },
              "transform": [],
              "data": {
                "url": "https://raw.githubusercontent.com/nl4dv/nl4dv/master/examples/assets/data/cars-w-year.csv",
                "format": {
                  "type": "csv"
                }
              }
            }
          }
        ],
        "attributeMap": {
          "Acceleration": {
            "name": "Acceleration",
            "queryPhrase": [
              "acceleration"
            ],
            "inferenceType": "explicit",
            "matchScore": 1,
            "metric": [
              "attribute_exact_match"
            ],
            "isLabel": false,
            "encode": true,
            "isAmbiguous": false,
            "ambiguity": [],
            "meta": {
              "score": 100,
              "threshold": 85,
              "alias": null,
              "ambiguity": {},
              "confidence": 100
            }
          },
          "Year": {
            "name": "Year",
            "queryPhrase": [
              "years"
            ],
            "inferenceType": "explicit",
            "matchScore": 1,
            "metric": [
              "attribute_exact_match"
            ],
            "isLabel": false,
            "encode": true,
            "isAmbiguous": false,
            "ambiguity": [],
            "meta": {
              "score": 100,
              "threshold": 85,
              "alias": null,
              "ambiguity": {},
              "confidence": 100
            }
          },
          "Origin": {
            "name": "Origin",
            "queryPhrase": [
              "origin"
            ],
            "inferenceType": "explicit",
            "matchScore": 1,
            "metric": [
              "attribute_exact_match"
            ],
            "isLabel": false,
            "encode": true,
            "isAmbiguous": false,
            "ambiguity": [],
            "meta": {
              "score": 100,
              "threshold": 85,
              "alias": null,
              "ambiguity": {},
              "confidence": 100
            }
          }
        },
        "taskMap": {
          "trend": [
            {
              "task": "trend",
              "queryPhrase": [],
              "operator": null,
              "values": null,
              "matchScore": 0.5,
              "attributes": [
                "Acceleration",
                "Origin",
                "Year"
              ],
              "inferenceType": "implicit",
              "isAttrAmbiguous": false,
              "isValueAmbiguous": false,
              "meta": {
                "value_ambiguity_type": null
              }
            }
          ]
        },
        "followUpQuery": false,
        "contextObj": null
      }
    },
    {
      "queryId": 30,
      "query": "visualize origin and cylinders as a barchart",
      "output": {
        "status": "SUCCESS",
        "debug": {
          "execution_durations": {
            "clean_query": 0.0021560192108154297,
            "extract_attributes": 0.11019396781921387,
            "extract_vis_type": 0.00001811981201171875,
            "extract_tasks": 1.0315728187561035,
            "get_vis_list": 0.00029015541076660156,
            "total": 1.1442310810089111
          }
        },
        "query_raw": "visualize origin and cylinders as a barchart",
        "query": "visualize origin and cylinders as a barchart",
        "dataset": "https://raw.githubusercontent.com/nl4dv/nl4dv/master/examples/assets/data/cars-w-year.csv",
        "alias": "https://raw.githubusercontent.com/nl4dv/nl4dv/master/examples/assets/aliases/cars-w-year.json",
        "visList": [
          {
            "score": 5.5,
            "scoreObj": {
              "by_attributes": 2,
              "by_task": 0.5,
              "by_vis": 1
            },
            "confidenceObj": {
              "Cylinders": 1,
              "Origin": 1
            },
            "attributes": [
              "Cylinders",
              "Origin"
            ],
            "queryPhrase": "barchart",
            "visType": "barchart",
            "tasks": [
              "derived_value"
            ],
            "inferenceType": "explicit",
            "vlSpec": {
              "$schema": "https://vega.github.io/schema/vega-lite/v4.json",
              "mark": {
                "type": "bar",
                "tooltip": true
              },
              "encoding": {
                "y": {
                  "field": "Cylinders",
                  "type": "quantitative",
                  "aggregate": "mean",
                  "axis": {
                    "format": "s"
                  }
                },
                "x": {
                  "field": "Origin",
                  "type": "nominal",
                  "aggregate": null
                }
              },
              "transform": [],
              "data": {
                "url": "https://raw.githubusercontent.com/nl4dv/nl4dv/master/examples/assets/data/cars-w-year.csv",
                "format": {
                  "type": "csv"
                }
              }
            }
          }
        ],
        "attributeMap": {
          "Cylinders": {
            "name": "Cylinders",
            "queryPhrase": [
              "cylinders"
            ],
            "inferenceType": "explicit",
            "matchScore": 1,
            "metric": [
              "attribute_exact_match"
            ],
            "isLabel": false,
            "encode": true,
            "isAmbiguous": false,
            "ambiguity": [],
            "meta": {
              "score": 100,
              "threshold": 85,
              "alias": null,
              "ambiguity": {},
              "confidence": 100
            }
          },
          "Origin": {
            "name": "Origin",
            "queryPhrase": [
              "origin"
            ],
            "inferenceType": "explicit",
            "matchScore": 1,
            "metric": [
              "attribute_exact_match"
            ],
            "isLabel": false,
            "encode": true,
            "isAmbiguous": false,
            "ambiguity": [],
            "meta": {
              "score": 100,
              "threshold": 85,
              "alias": null,
              "ambiguity": {},
              "confidence": 100
            }
          }
        },
        "taskMap": {
          "derived_value": [
            {
              "task": "derived_value",
              "queryPhrase": [],
              "operator": "AVG",
              "values": null,
              "matchScore": 0.5,
              "attributes": [
                "Cylinders"
              ],
              "inferenceType": "implicit",
              "isAttrAmbiguous": false,
              "isValueAmbiguous": false,
              "meta": {
                "value_ambiguity_type": null
              }
            }
          ]
        },
        "followUpQuery": false,
        "contextObj": null
      }
    },
    {
      "queryId": 31,
      "query": "visualize origin and cylinders as a scatter plot",
      "output": {
        "status": "SUCCESS",
        "debug": {
          "execution_durations": {
            "clean_query": 0.003748178482055664,
            "extract_attributes": 0.21617984771728516,
            "extract_vis_type": 0.0000209808349609375,
            "extract_tasks": 1.0387241840362549,
            "get_vis_list": 0.0003108978271484375,
            "total": 1.258984088897705
          }
        },
        "query_raw": "visualize origin and cylinders as a scatter plot",
        "query": "visualize origin and cylinders as a scatter plot",
        "dataset": "https://raw.githubusercontent.com/nl4dv/nl4dv/master/examples/assets/data/cars-w-year.csv",
        "alias": "https://raw.githubusercontent.com/nl4dv/nl4dv/master/examples/assets/aliases/cars-w-year.json",
        "visList": [
          {
            "score": 4.5,
            "scoreObj": {
              "by_attributes": 2,
              "by_task": -0.5,
              "by_vis": 1
            },
            "confidenceObj": {
              "Cylinders": 1,
              "Origin": 1
            },
            "attributes": [
              "Cylinders",
              "Origin"
            ],
            "queryPhrase": "scatter plot",
            "visType": "scatterplot",
            "tasks": [
              "derived_value"
            ],
            "inferenceType": "explicit",
            "vlSpec": {
              "$schema": "https://vega.github.io/schema/vega-lite/v4.json",
              "mark": {
                "type": "point",
                "tooltip": true
              },
              "encoding": {
                "y": {
                  "field": "Cylinders",
                  "type": "quantitative",
                  "aggregate": null,
                  "axis": {
                    "format": "s"
                  }
                },
                "x": {
                  "field": "Origin",
                  "type": "nominal",
                  "aggregate": null
                },
                "tooltip": {
                  "field": "Model"
                }
              },
              "transform": [],
              "data": {
                "url": "https://raw.githubusercontent.com/nl4dv/nl4dv/master/examples/assets/data/cars-w-year.csv",
                "format": {
                  "type": "csv"
                }
              }
            }
          }
        ],
        "attributeMap": {
          "Cylinders": {
            "name": "Cylinders",
            "queryPhrase": [
              "cylinders"
            ],
            "inferenceType": "explicit",
            "matchScore": 1,
            "metric": [
              "attribute_exact_match"
            ],
            "isLabel": false,
            "encode": true,
            "isAmbiguous": false,
            "ambiguity": [],
            "meta": {
              "score": 100,
              "threshold": 85,
              "alias": null,
              "ambiguity": {},
              "confidence": 100
            }
          },
          "Origin": {
            "name": "Origin",
            "queryPhrase": [
              "origin"
            ],
            "inferenceType": "explicit",
            "matchScore": 1,
            "metric": [
              "attribute_exact_match"
            ],
            "isLabel": false,
            "encode": true,
            "isAmbiguous": false,
            "ambiguity": [],
            "meta": {
              "score": 100,
              "threshold": 85,
              "alias": null,
              "ambiguity": {},
              "confidence": 100
            }
          }
        },
        "taskMap": {
          "derived_value": [
            {
              "task": "derived_value",
              "queryPhrase": [],
              "operator": "AVG",
              "values": null,
              "matchScore": 0.5,
              "attributes": [
                "Cylinders"
              ],
              "inferenceType": "implicit",
              "isAttrAmbiguous": false,
              "isValueAmbiguous": false,
              "meta": {
                "value_ambiguity_type": null
              }
            }
          ]
        },
        "followUpQuery": false,
        "contextObj": null
      }
    }
  ],
  "underspecified-attributes": [
    {
      "queryId": 32,
      "query": "Origin",
      "output": {
        "status": "SUCCESS",
        "debug": {
          "execution_durations": {
            "clean_query": 0.0007150173187255859,
            "extract_attributes": 0.02973484992980957,
            "extract_vis_type": 0.000010967254638671875,
            "extract_tasks": 0.9808707237243652,
            "get_vis_list": 0.00015425682067871094,
            "total": 1.0114858150482178
          }
        },
        "query_raw": "Origin",
        "query": "origin",
        "dataset": "https://raw.githubusercontent.com/nl4dv/nl4dv/master/examples/assets/data/cars-w-year.csv",
        "alias": "https://raw.githubusercontent.com/nl4dv/nl4dv/master/examples/assets/aliases/cars-w-year.json",
        "visList": [
          {
            "score": 2.5,
            "scoreObj": {
              "by_attributes": 1,
              "by_task": 0.5,
              "by_vis": 0
            },
            "confidenceObj": {
              "Origin": 1
            },
            "attributes": [
              "Origin"
            ],
            "queryPhrase": null,
            "visType": null,
            "tasks": [
              "distribution"
            ],
            "inferenceType": "implicit",
            "vlSpec": {
              "$schema": "https://vega.github.io/schema/vega-lite/v4.json",
              "mark": {
                "type": "bar",
                "tooltip": true
              },
              "encoding": {
                "x": {
                  "field": "Origin",
                  "type": "nominal",
                  "aggregate": null
                },
                "y": {
                  "field": "Origin",
                  "type": "nominal",
                  "aggregate": "count"
                }
              },
              "transform": [],
              "data": {
                "url": "https://raw.githubusercontent.com/nl4dv/nl4dv/master/examples/assets/data/cars-w-year.csv",
                "format": {
                  "type": "csv"
                }
              }
            }
          }
        ],
        "attributeMap": {
          "Origin": {
            "name": "Origin",
            "queryPhrase": [
              "origin"
            ],
            "inferenceType": "explicit",
            "matchScore": 1,
            "metric": [
              "attribute_exact_match"
            ],
            "isLabel": false,
            "encode": true,
            "isAmbiguous": false,
            "ambiguity": [],
            "meta": {
              "score": 100,
              "threshold": 85,
              "alias": null,
              "ambiguity": {},
              "confidence": 100
            }
          }
        },
        "taskMap": {
          "distribution": [
            {
              "task": "distribution",
              "queryPhrase": [],
              "operator": null,
              "values": null,
              "matchScore": 0.5,
              "attributes": [
                "Origin"
              ],
              "inferenceType": "implicit",
              "isAttrAmbiguous": false,
              "isValueAmbiguous": false,
              "meta": {
                "value_ambiguity_type": null
              }
            }
          ]
        },
        "followUpQuery": false,
        "contextObj": null
      }
    },
    {
      "queryId": 33,
      "query": "Visualize mpg",
      "output": {
        "status": "SUCCESS",
        "debug": {
          "execution_durations": {
            "clean_query": 0.0011172294616699219,
            "extract_attributes": 0.03433108329772949,
            "extract_vis_type": 0.000014066696166992188,
            "extract_tasks": 1.0055277347564697,
            "get_vis_list": 0.00023698806762695312,
            "total": 1.041227102279663
          }
        },
        "query_raw": "Visualize mpg",
        "query": "visualize mpg",
        "dataset": "https://raw.githubusercontent.com/nl4dv/nl4dv/master/examples/assets/data/cars-w-year.csv",
        "alias": "https://raw.githubusercontent.com/nl4dv/nl4dv/master/examples/assets/aliases/cars-w-year.json",
        "visList": [
          {
            "score": 2.5,
            "scoreObj": {
              "by_attributes": 1,
              "by_task": 0.5,
              "by_vis": 0
            },
            "confidenceObj": {
              "MPG": 1
            },
            "attributes": [
              "MPG"
            ],
            "queryPhrase": null,
            "visType": null,
            "tasks": [
              "distribution"
            ],
            "inferenceType": "implicit",
            "vlSpec": {
              "$schema": "https://vega.github.io/schema/vega-lite/v4.json",
              "mark": {
                "type": "bar",
                "tooltip": true
              },
              "encoding": {
                "x": {
                  "field": "MPG",
                  "type": "quantitative",
                  "aggregate": null,
                  "bin": true,
                  "axis": {
                    "format": "s"
                  }
                },
                "y": {
                  "field": "MPG",
                  "type": "quantitative",
                  "aggregate": "count",
                  "axis": {
                    "format": "s"
                  }
                }
              },
              "transform": [],
              "data": {
                "url": "https://raw.githubusercontent.com/nl4dv/nl4dv/master/examples/assets/data/cars-w-year.csv",
                "format": {
                  "type": "csv"
                }
              }
            }
          },
          {
            "score": 2.5,
            "scoreObj": {
              "by_attributes": 1,
              "by_task": 0.5,
              "by_vis": 0
            },
            "confidenceObj": {
              "MPG": 1
            },
            "attributes": [
              "MPG"
            ],
            "queryPhrase": null,
            "visType": null,
            "tasks": [
              "distribution"
            ],
            "inferenceType": "implicit",
            "vlSpec": {
              "$schema": "https://vega.github.io/schema/vega-lite/v4.json",
              "mark": {
                "type": "tick",
                "tooltip": true
              },
              "encoding": {
                "x": {
                  "field": "MPG",
                  "type": "quantitative",
                  "aggregate": null,
                  "axis": {
                    "format": "s"
                  }
                },
                "tooltip": {
                  "field": "Model"
                }
              },
              "transform": [],
              "data": {
                "url": "https://raw.githubusercontent.com/nl4dv/nl4dv/master/examples/assets/data/cars-w-year.csv",
                "format": {
                  "type": "csv"
                }
              }
            }
          },
          {
            "score": 2.5,
            "scoreObj": {
              "by_attributes": 1,
              "by_task": 0.5,
              "by_vis": 0
            },
            "confidenceObj": {
              "MPG": 1
            },
            "attributes": [
              "MPG"
            ],
            "queryPhrase": null,
            "visType": null,
            "tasks": [
              "distribution"
            ],
            "inferenceType": "implicit",
            "vlSpec": {
              "$schema": "https://vega.github.io/schema/vega-lite/v4.json",
              "mark": {
                "type": "boxplot",
                "tooltip": true
              },
              "encoding": {
                "x": {
                  "field": "MPG",
                  "type": "quantitative",
                  "aggregate": null,
                  "axis": {
                    "format": "s"
                  }
                },
                "tooltip": {
                  "field": "Model"
                }
              },
              "transform": [],
              "data": {
                "url": "https://raw.githubusercontent.com/nl4dv/nl4dv/master/examples/assets/data/cars-w-year.csv",
                "format": {
                  "type": "csv"
                }
              }
            }
          }
        ],
        "attributeMap": {
          "MPG": {
            "name": "MPG",
            "queryPhrase": [
              "mpg"
            ],
            "inferenceType": "explicit",
            "matchScore": 1,
            "metric": [
              "attribute_exact_match"
            ],
            "isLabel": false,
            "encode": true,
            "isAmbiguous": false,
            "ambiguity": [],
            "meta": {
              "score": 100,
              "threshold": 85,
              "alias": null,
              "ambiguity": {},
              "confidence": 100
            }
          }
        },
        "taskMap": {
          "distribution": [
            {
              "task": "distribution",
              "queryPhrase": [],
              "operator": null,
              "values": null,
              "matchScore": 0.5,
              "attributes": [
                "MPG"
              ],
              "inferenceType": "implicit",
              "isAttrAmbiguous": false,
              "isValueAmbiguous": false,
              "meta": {
                "value_ambiguity_type": null
              }
            }
          ]
        },
        "followUpQuery": false,
        "contextObj": null
      }
    },
    {
      "queryId": 34,
      "query": "Show mpg across origins",
      "output": {
        "status": "SUCCESS",
        "debug": {
          "execution_durations": {
            "clean_query": 0.0020728111267089844,
            "extract_attributes": 0.1390821933746338,
            "extract_vis_type": 0.0000171661376953125,
            "extract_tasks": 0.9987459182739258,
            "get_vis_list": 0.00026917457580566406,
            "total": 1.1401872634887695
          }
        },
        "query_raw": "Show mpg across origins",
        "query": "show mpg across origins",
        "dataset": "https://raw.githubusercontent.com/nl4dv/nl4dv/master/examples/assets/data/cars-w-year.csv",
        "alias": "https://raw.githubusercontent.com/nl4dv/nl4dv/master/examples/assets/aliases/cars-w-year.json",
        "visList": [
          {
            "score": 4.5,
            "scoreObj": {
              "by_attributes": 2,
              "by_task": 0.5,
              "by_vis": 0
            },
            "confidenceObj": {
              "MPG": 1,
              "Origin": 1
            },
            "attributes": [
              "MPG",
              "Origin"
            ],
            "queryPhrase": null,
            "visType": null,
            "tasks": [
              "derived_value"
            ],
            "inferenceType": "implicit",
            "vlSpec": {
              "$schema": "https://vega.github.io/schema/vega-lite/v4.json",
              "mark": {
                "type": "bar",
                "tooltip": true
              },
              "encoding": {
                "y": {
                  "field": "MPG",
                  "type": "quantitative",
                  "aggregate": "mean",
                  "axis": {
                    "format": "s"
                  }
                },
                "x": {
                  "field": "Origin",
                  "type": "nominal",
                  "aggregate": null
                }
              },
              "transform": [],
              "data": {
                "url": "https://raw.githubusercontent.com/nl4dv/nl4dv/master/examples/assets/data/cars-w-year.csv",
                "format": {
                  "type": "csv"
                }
              }
            }
          }
        ],
        "attributeMap": {
          "MPG": {
            "name": "MPG",
            "queryPhrase": [
              "mpg"
            ],
            "inferenceType": "explicit",
            "matchScore": 1,
            "metric": [
              "attribute_exact_match"
            ],
            "isLabel": false,
            "encode": true,
            "isAmbiguous": false,
            "ambiguity": [],
            "meta": {
              "score": 100,
              "threshold": 85,
              "alias": null,
              "ambiguity": {},
              "confidence": 100
            }
          },
          "Origin": {
            "name": "Origin",
            "queryPhrase": [
              "origins"
            ],
            "inferenceType": "explicit",
            "matchScore": 1,
            "metric": [
              "attribute_exact_match"
            ],
            "isLabel": false,
            "encode": true,
            "isAmbiguous": false,
            "ambiguity": [],
            "meta": {
              "score": 100,
              "threshold": 85,
              "alias": null,
              "ambiguity": {},
              "confidence": 100
            }
          }
        },
        "taskMap": {
          "derived_value": [
            {
              "task": "derived_value",
              "queryPhrase": [],
              "operator": "AVG",
              "values": null,
              "matchScore": 0.5,
              "attributes": [
                "MPG"
              ],
              "inferenceType": "implicit",
              "isAttrAmbiguous": false,
              "isValueAmbiguous": false,
              "meta": {
                "value_ambiguity_type": null
              }
            }
          ]
        },
        "followUpQuery": false,
        "contextObj": null
      }
    },
    {
      "queryId": 35,
      "query": "Weight and acceleration",
      "output": {
        "status": "SUCCESS",
        "debug": {
          "execution_durations": {
            "clean_query": 0.0009140968322753906,
            "extract_attributes": 0.060997962951660156,
            "extract_vis_type": 0.000012159347534179688,
            "extract_tasks": 0.99003005027771,
            "get_vis_list": 0.0002028942108154297,
            "total": 1.0521571636199951
          }
        },
        "query_raw": "Weight and acceleration",
        "query": "weight and acceleration",
        "dataset": "https://raw.githubusercontent.com/nl4dv/nl4dv/master/examples/assets/data/cars-w-year.csv",
        "alias": "https://raw.githubusercontent.com/nl4dv/nl4dv/master/examples/assets/aliases/cars-w-year.json",
        "visList": [
          {
            "score": 4.5,
            "scoreObj": {
              "by_attributes": 2,
              "by_task": 0.5,
              "by_vis": 0
            },
            "confidenceObj": {
              "Weight": 1,
              "Acceleration": 1
            },
            "attributes": [
              "Weight",
              "Acceleration"
            ],
            "queryPhrase": null,
            "visType": null,
            "tasks": [
              "correlation"
            ],
            "inferenceType": "implicit",
            "vlSpec": {
              "$schema": "https://vega.github.io/schema/vega-lite/v4.json",
              "mark": {
                "type": "point",
                "tooltip": true
              },
              "encoding": {
                "x": {
                  "field": "Weight",
                  "type": "quantitative",
                  "aggregate": null,
                  "axis": {
                    "format": "s"
                  }
                },
                "y": {
                  "field": "Acceleration",
                  "type": "quantitative",
                  "aggregate": null,
                  "axis": {
                    "format": "s"
                  }
                },
                "tooltip": {
                  "field": "Model"
                }
              },
              "transform": [],
              "data": {
                "url": "https://raw.githubusercontent.com/nl4dv/nl4dv/master/examples/assets/data/cars-w-year.csv",
                "format": {
                  "type": "csv"
                }
              }
            }
          }
        ],
        "attributeMap": {
          "Weight": {
            "name": "Weight",
            "queryPhrase": [
              "weight"
            ],
            "inferenceType": "explicit",
            "matchScore": 1,
            "metric": [
              "attribute_exact_match"
            ],
            "isLabel": false,
            "encode": true,
            "isAmbiguous": false,
            "ambiguity": [],
            "meta": {
              "score": 100,
              "threshold": 85,
              "alias": null,
              "ambiguity": {},
              "confidence": 100
            }
          },
          "Acceleration": {
            "name": "Acceleration",
            "queryPhrase": [
              "acceleration"
            ],
            "inferenceType": "explicit",
            "matchScore": 1,
            "metric": [
              "attribute_exact_match"
            ],
            "isLabel": false,
            "encode": true,
            "isAmbiguous": false,
            "ambiguity": [],
            "meta": {
              "score": 100,
              "threshold": 85,
              "alias": null,
              "ambiguity": {},
              "confidence": 100
            }
          }
        },
        "taskMap": {
          "correlation": [
            {
              "task": "correlation",
              "queryPhrase": [],
              "operator": null,
              "values": null,
              "matchScore": 0.5,
              "attributes": [
                "Weight",
                "Acceleration"
              ],
              "inferenceType": "implicit",
              "isAttrAmbiguous": false,
              "isValueAmbiguous": false,
              "meta": {
                "value_ambiguity_type": null
              }
            }
          ]
        },
        "followUpQuery": false,
        "contextObj": null
      }
    },
    {
      "queryId": 36,
      "query": "Create a visualization with miles per gallon and horsepower",
      "output": {
        "status": "SUCCESS",
        "debug": {
          "execution_durations": {
            "clean_query": 0.004347801208496094,
            "extract_attributes": 0.21956896781921387,
            "extract_vis_type": 0.000028133392333984375,
            "extract_tasks": 1.0187568664550781,
            "get_vis_list": 0.000270843505859375,
            "total": 1.2429726123809814
          }
        },
        "query_raw": "Create a visualization with miles per gallon and horsepower",
        "query": "create a visualization with miles per gallon and horsepower",
        "dataset": "https://raw.githubusercontent.com/nl4dv/nl4dv/master/examples/assets/data/cars-w-year.csv",
        "alias": "https://raw.githubusercontent.com/nl4dv/nl4dv/master/examples/assets/aliases/cars-w-year.json",
        "visList": [
          {
            "score": 4.3,
            "scoreObj": {
              "by_attributes": 1.8,
              "by_task": 0.5,
              "by_vis": 0
            },
            "confidenceObj": {
              "Horsepower": 1,
              "MPG": 1
            },
            "attributes": [
              "Horsepower",
              "MPG"
            ],
            "queryPhrase": null,
            "visType": null,
            "tasks": [
              "correlation"
            ],
            "inferenceType": "implicit",
            "vlSpec": {
              "$schema": "https://vega.github.io/schema/vega-lite/v4.json",
              "mark": {
                "type": "point",
                "tooltip": true
              },
              "encoding": {
                "x": {
                  "field": "Horsepower",
                  "type": "quantitative",
                  "aggregate": null,
                  "axis": {
                    "format": "s"
                  }
                },
                "y": {
                  "field": "MPG",
                  "type": "quantitative",
                  "aggregate": null,
                  "axis": {
                    "format": "s"
                  }
                },
                "tooltip": {
                  "field": "Model"
                }
              },
              "transform": [],
              "data": {
                "url": "https://raw.githubusercontent.com/nl4dv/nl4dv/master/examples/assets/data/cars-w-year.csv",
                "format": {
                  "type": "csv"
                }
              }
            }
          }
        ],
        "attributeMap": {
          "Horsepower": {
            "name": "Horsepower",
            "queryPhrase": [
              "horsepower"
            ],
            "inferenceType": "explicit",
            "matchScore": 1,
            "metric": [
              "attribute_exact_match"
            ],
            "isLabel": false,
            "encode": true,
            "isAmbiguous": false,
            "ambiguity": [],
            "meta": {
              "score": 100,
              "threshold": 85,
              "alias": null,
              "ambiguity": {},
              "confidence": 100
            }
          },
          "MPG": {
            "name": "MPG",
            "queryPhrase": [
              "miles per gallon"
            ],
            "inferenceType": "explicit",
            "matchScore": 0.8,
            "metric": "attribute_alias_exact_match",
            "isLabel": false,
            "encode": true,
            "isAmbiguous": false,
            "ambiguity": [],
            "meta": {
              "score": 100,
              "threshold": 85,
              "alias": "miles per gallon",
              "ambiguity": {},
              "confidence": 100
            }
          }
        },
        "taskMap": {
          "correlation": [
            {
              "task": "correlation",
              "queryPhrase": [],
              "operator": null,
              "values": null,
              "matchScore": 0.5,
              "attributes": [
                "Horsepower",
                "MPG"
              ],
              "inferenceType": "implicit",
              "isAttrAmbiguous": false,
              "isValueAmbiguous": false,
              "meta": {
                "value_ambiguity_type": null
              }
            }
          ]
        },
        "followUpQuery": false,
        "contextObj": null
      }
    },
    {
      "queryId": 37,
      "query": "Displacement Cylinders Acceleration",
      "output": {
        "status": "SUCCESS",
        "debug": {
          "execution_durations": {
            "clean_query": 0.0017819404602050781,
            "extract_attributes": 0.08335995674133301,
            "extract_vis_type": 0.000031948089599609375,
            "extract_tasks": 0.9954190254211426,
            "get_vis_list": 0.0002849102020263672,
            "total": 1.0808777809143066
          }
        },
        "query_raw": "Displacement Cylinders Acceleration",
        "query": "displacement cylinders acceleration",
        "dataset": "https://raw.githubusercontent.com/nl4dv/nl4dv/master/examples/assets/data/cars-w-year.csv",
        "alias": "https://raw.githubusercontent.com/nl4dv/nl4dv/master/examples/assets/aliases/cars-w-year.json",
        "visList": [
          {
            "score": 6.5,
            "scoreObj": {
              "by_attributes": 3,
              "by_task": 0.5,
              "by_vis": 0
            },
            "confidenceObj": {
              "Cylinders": 1,
              "Displacement": 1,
              "Acceleration": 1
            },
            "attributes": [
              "Cylinders",
              "Displacement",
              "Acceleration"
            ],
            "queryPhrase": null,
            "visType": null,
            "tasks": [
              "correlation"
            ],
            "inferenceType": "implicit",
            "vlSpec": {
              "$schema": "https://vega.github.io/schema/vega-lite/v4.json",
              "mark": {
                "type": "point",
                "tooltip": true
              },
              "encoding": {
                "x": {
                  "field": "Cylinders",
                  "type": "quantitative",
                  "aggregate": null,
                  "axis": {
                    "format": "s"
                  }
                },
                "y": {
                  "field": "Displacement",
                  "type": "quantitative",
                  "aggregate": null,
                  "axis": {
                    "format": "s"
                  }
                },
                "color": {
                  "field": "Acceleration",
                  "type": "quantitative",
                  "aggregate": null
                },
                "tooltip": {
                  "field": "Model"
                }
              },
              "transform": [],
              "data": {
                "url": "https://raw.githubusercontent.com/nl4dv/nl4dv/master/examples/assets/data/cars-w-year.csv",
                "format": {
                  "type": "csv"
                }
              }
            }
          },
          {
            "score": 6.5,
            "scoreObj": {
              "by_attributes": 3,
              "by_task": 0.5,
              "by_vis": 0
            },
            "confidenceObj": {
              "Cylinders": 1,
              "Displacement": 1,
              "Acceleration": 1
            },
            "attributes": [
              "Cylinders",
              "Displacement",
              "Acceleration"
            ],
            "queryPhrase": null,
            "visType": null,
            "tasks": [
              "correlation"
            ],
            "inferenceType": "implicit",
            "vlSpec": {
              "$schema": "https://vega.github.io/schema/vega-lite/v4.json",
              "mark": {
                "type": "point",
                "tooltip": true
              },
              "encoding": {
                "x": {
                  "field": "Cylinders",
                  "type": "quantitative",
                  "aggregate": null,
                  "axis": {
                    "format": "s"
                  }
                },
                "y": {
                  "field": "Displacement",
                  "type": "quantitative",
                  "aggregate": null,
                  "axis": {
                    "format": "s"
                  }
                },
                "size": {
                  "field": "Acceleration",
                  "type": "quantitative",
                  "aggregate": null
                },
                "tooltip": {
                  "field": "Model"
                }
              },
              "transform": [],
              "data": {
                "url": "https://raw.githubusercontent.com/nl4dv/nl4dv/master/examples/assets/data/cars-w-year.csv",
                "format": {
                  "type": "csv"
                }
              }
            }
          }
        ],
        "attributeMap": {
          "Cylinders": {
            "name": "Cylinders",
            "queryPhrase": [
              "cylinders"
            ],
            "inferenceType": "explicit",
            "matchScore": 1,
            "metric": [
              "attribute_exact_match"
            ],
            "isLabel": false,
            "encode": true,
            "isAmbiguous": false,
            "ambiguity": [],
            "meta": {
              "score": 100,
              "threshold": 85,
              "alias": null,
              "ambiguity": {},
              "confidence": 100
            }
          },
          "Displacement": {
            "name": "Displacement",
            "queryPhrase": [
              "displacement"
            ],
            "inferenceType": "explicit",
            "matchScore": 1,
            "metric": [
              "attribute_exact_match"
            ],
            "isLabel": false,
            "encode": true,
            "isAmbiguous": false,
            "ambiguity": [],
            "meta": {
              "score": 100,
              "threshold": 85,
              "alias": null,
              "ambiguity": {},
              "confidence": 100
            }
          },
          "Acceleration": {
            "name": "Acceleration",
            "queryPhrase": [
              "acceleration"
            ],
            "inferenceType": "explicit",
            "matchScore": 1,
            "metric": [
              "attribute_exact_match"
            ],
            "isLabel": false,
            "encode": true,
            "isAmbiguous": false,
            "ambiguity": [],
            "meta": {
              "score": 100,
              "threshold": 85,
              "alias": null,
              "ambiguity": {},
              "confidence": 100
            }
          }
        },
        "taskMap": {
          "correlation": [
            {
              "task": "correlation",
              "queryPhrase": [],
              "operator": null,
              "values": null,
              "matchScore": 0.5,
              "attributes": [
                "Cylinders",
                "Displacement"
              ],
              "inferenceType": "implicit",
              "isAttrAmbiguous": false,
              "isValueAmbiguous": false,
              "meta": {
                "value_ambiguity_type": null
              }
            }
          ]
        },
        "followUpQuery": false,
        "contextObj": null
      }
    },
    {
      "queryId": 38,
      "query": "Show me acceleration and horsepower across origins",
      "output": {
        "status": "SUCCESS",
        "debug": {
          "execution_durations": {
            "clean_query": 0.003061056137084961,
            "extract_attributes": 0.1777782440185547,
            "extract_vis_type": 0.000028133392333984375,
            "extract_tasks": 1.0754890441894531,
            "get_vis_list": 0.0003502368927001953,
            "total": 1.256706714630127
          }
        },
        "query_raw": "Show me acceleration and horsepower across origins",
        "query": "show me acceleration and horsepower across origins",
        "dataset": "https://raw.githubusercontent.com/nl4dv/nl4dv/master/examples/assets/data/cars-w-year.csv",
        "alias": "https://raw.githubusercontent.com/nl4dv/nl4dv/master/examples/assets/aliases/cars-w-year.json",
        "visList": [
          {
            "score": 6.5,
            "scoreObj": {
              "by_attributes": 3,
              "by_task": 0.5,
              "by_vis": 0
            },
            "confidenceObj": {
              "Horsepower": 1,
              "Acceleration": 1,
              "Origin": 1
            },
            "attributes": [
              "Horsepower",
              "Acceleration",
              "Origin"
            ],
            "queryPhrase": null,
            "visType": null,
            "tasks": [
              "correlation"
            ],
            "inferenceType": "implicit",
            "vlSpec": {
              "$schema": "https://vega.github.io/schema/vega-lite/v4.json",
              "mark": {
                "type": "point",
                "tooltip": true
              },
              "encoding": {
                "x": {
                  "field": "Horsepower",
                  "type": "quantitative",
                  "aggregate": null,
                  "axis": {
                    "format": "s"
                  }
                },
                "y": {
                  "field": "Acceleration",
                  "type": "quantitative",
                  "aggregate": null,
                  "axis": {
                    "format": "s"
                  }
                },
                "color": {
                  "field": "Origin",
                  "type": "nominal",
                  "aggregate": null
                },
                "tooltip": {
                  "field": "Model"
                }
              },
              "transform": [],
              "data": {
                "url": "https://raw.githubusercontent.com/nl4dv/nl4dv/master/examples/assets/data/cars-w-year.csv",
                "format": {
                  "type": "csv"
                }
              }
            }
          },
          {
            "score": 6.5,
            "scoreObj": {
              "by_attributes": 3,
              "by_task": 0.5,
              "by_vis": 0
            },
            "confidenceObj": {
              "Horsepower": 1,
              "Acceleration": 1,
              "Origin": 1
            },
            "attributes": [
              "Horsepower",
              "Acceleration",
              "Origin"
            ],
            "queryPhrase": null,
            "visType": null,
            "tasks": [
              "correlation"
            ],
            "inferenceType": "implicit",
            "vlSpec": {
              "$schema": "https://vega.github.io/schema/vega-lite/v4.json",
              "mark": {
                "type": "point",
                "tooltip": true
              },
              "encoding": {
                "x": {
                  "field": "Horsepower",
                  "type": "quantitative",
                  "aggregate": null,
                  "axis": {
                    "format": "s"
                  }
                },
                "y": {
                  "field": "Acceleration",
                  "type": "quantitative",
                  "aggregate": null,
                  "axis": {
                    "format": "s"
                  }
                },
                "column": {
                  "field": "Origin",
                  "type": "nominal",
                  "aggregate": null
                },
                "color": {
                  "field": "Origin",
                  "type": "nominal",
                  "aggregate": null
                },
                "tooltip": {
                  "field": "Model"
                }
              },
              "transform": [],
              "data": {
                "url": "https://raw.githubusercontent.com/nl4dv/nl4dv/master/examples/assets/data/cars-w-year.csv",
                "format": {
                  "type": "csv"
                }
              }
            }
          }
        ],
        "attributeMap": {
          "Horsepower": {
            "name": "Horsepower",
            "queryPhrase": [
              "horsepower"
            ],
            "inferenceType": "explicit",
            "matchScore": 1,
            "metric": [
              "attribute_exact_match"
            ],
            "isLabel": false,
            "encode": true,
            "isAmbiguous": false,
            "ambiguity": [],
            "meta": {
              "score": 100,
              "threshold": 85,
              "alias": null,
              "ambiguity": {},
              "confidence": 100
            }
          },
          "Acceleration": {
            "name": "Acceleration",
            "queryPhrase": [
              "acceleration"
            ],
            "inferenceType": "explicit",
            "matchScore": 1,
            "metric": [
              "attribute_exact_match"
            ],
            "isLabel": false,
            "encode": true,
            "isAmbiguous": false,
            "ambiguity": [],
            "meta": {
              "score": 100,
              "threshold": 85,
              "alias": null,
              "ambiguity": {},
              "confidence": 100
            }
          },
          "Origin": {
            "name": "Origin",
            "queryPhrase": [
              "origins"
            ],
            "inferenceType": "explicit",
            "matchScore": 1,
            "metric": [
              "attribute_exact_match"
            ],
            "isLabel": false,
            "encode": true,
            "isAmbiguous": false,
            "ambiguity": [],
            "meta": {
              "score": 100,
              "threshold": 85,
              "alias": null,
              "ambiguity": {},
              "confidence": 100
            }
          }
        },
        "taskMap": {
          "correlation": [
            {
              "task": "correlation",
              "queryPhrase": [],
              "operator": null,
              "values": null,
              "matchScore": 0.5,
              "attributes": [
                "Horsepower",
                "Acceleration"
              ],
              "inferenceType": "implicit",
              "isAttrAmbiguous": false,
              "isValueAmbiguous": false,
              "meta": {
                "value_ambiguity_type": null
              }
            }
          ]
        },
        "followUpQuery": false,
        "contextObj": null
      }
    },
    {
      "queryId": 39,
      "query": "Visualize car weight and number of cylinders over the years",
      "output": {
        "status": "SUCCESS",
        "debug": {
          "execution_durations": {
            "clean_query": 0.003350973129272461,
            "extract_attributes": 0.20775079727172852,
            "extract_vis_type": 0.000026226043701171875,
            "extract_tasks": 1.0739059448242188,
            "get_vis_list": 0.0002999305725097656,
            "total": 1.2853338718414307
          }
        },
        "query_raw": "Visualize car weight and number of cylinders over the years",
        "query": "visualize car weight and number of cylinders over the years",
        "dataset": "https://raw.githubusercontent.com/nl4dv/nl4dv/master/examples/assets/data/cars-w-year.csv",
        "alias": "https://raw.githubusercontent.com/nl4dv/nl4dv/master/examples/assets/aliases/cars-w-year.json",
        "visList": [
          {
            "score": 6.5,
            "scoreObj": {
              "by_attributes": 3,
              "by_task": 0.5,
              "by_vis": 0
            },
            "confidenceObj": {
              "Cylinders": 1,
              "Weight": 1,
              "Year": 1
            },
            "attributes": [
              "Cylinders",
              "Weight",
              "Year"
            ],
            "queryPhrase": null,
            "visType": null,
            "tasks": [
              "correlation"
            ],
            "inferenceType": "implicit",
            "vlSpec": {
              "$schema": "https://vega.github.io/schema/vega-lite/v4.json",
              "mark": {
                "type": "point",
                "tooltip": true
              },
              "encoding": {
                "x": {
                  "field": "Cylinders",
                  "type": "quantitative",
                  "aggregate": null,
                  "axis": {
                    "format": "s"
                  }
                },
                "y": {
                  "field": "Weight",
                  "type": "quantitative",
                  "aggregate": null,
                  "axis": {
                    "format": "s"
                  }
                },
                "color": {
                  "field": "Year",
                  "type": "temporal",
                  "aggregate": null
                },
                "tooltip": {
                  "field": "Model"
                }
              },
              "transform": [],
              "data": {
                "url": "https://raw.githubusercontent.com/nl4dv/nl4dv/master/examples/assets/data/cars-w-year.csv",
                "format": {
                  "type": "csv"
                }
              }
            }
          },
          {
            "score": 6.5,
            "scoreObj": {
              "by_attributes": 3,
              "by_task": 0.5,
              "by_vis": 0
            },
            "confidenceObj": {
              "Cylinders": 1,
              "Weight": 1,
              "Year": 1
            },
            "attributes": [
              "Cylinders",
              "Weight",
              "Year"
            ],
            "queryPhrase": null,
            "visType": null,
            "tasks": [
              "correlation"
            ],
            "inferenceType": "implicit",
            "vlSpec": {
              "$schema": "https://vega.github.io/schema/vega-lite/v4.json",
              "mark": {
                "type": "point",
                "tooltip": true
              },
              "encoding": {
                "x": {
                  "field": "Cylinders",
                  "type": "quantitative",
                  "aggregate": null,
                  "axis": {
                    "format": "s"
                  }
                },
                "y": {
                  "field": "Weight",
                  "type": "quantitative",
                  "aggregate": null,
                  "axis": {
                    "format": "s"
                  }
                },
                "size": {
                  "field": "Year",
                  "type": "temporal",
                  "aggregate": null
                },
                "tooltip": {
                  "field": "Model"
                }
              },
              "transform": [],
              "data": {
                "url": "https://raw.githubusercontent.com/nl4dv/nl4dv/master/examples/assets/data/cars-w-year.csv",
                "format": {
                  "type": "csv"
                }
              }
            }
          }
        ],
        "attributeMap": {
          "Cylinders": {
            "name": "Cylinders",
            "queryPhrase": [
              "cylinders"
            ],
            "inferenceType": "explicit",
            "matchScore": 1,
            "metric": [
              "attribute_exact_match"
            ],
            "isLabel": false,
            "encode": true,
            "isAmbiguous": false,
            "ambiguity": [],
            "meta": {
              "score": 100,
              "threshold": 85,
              "alias": null,
              "ambiguity": {},
              "confidence": 100
            }
          },
          "Weight": {
            "name": "Weight",
            "queryPhrase": [
              "weight"
            ],
            "inferenceType": "explicit",
            "matchScore": 1,
            "metric": [
              "attribute_exact_match"
            ],
            "isLabel": false,
            "encode": true,
            "isAmbiguous": false,
            "ambiguity": [],
            "meta": {
              "score": 100,
              "threshold": 85,
              "alias": null,
              "ambiguity": {},
              "confidence": 100
            }
          },
          "Year": {
            "name": "Year",
            "queryPhrase": [
              "years"
            ],
            "inferenceType": "explicit",
            "matchScore": 1,
            "metric": [
              "attribute_exact_match"
            ],
            "isLabel": false,
            "encode": true,
            "isAmbiguous": false,
            "ambiguity": [],
            "meta": {
              "score": 100,
              "threshold": 85,
              "alias": null,
              "ambiguity": {},
              "confidence": 100
            }
          }
        },
        "taskMap": {
          "correlation": [
            {
              "task": "correlation",
              "queryPhrase": [],
              "operator": null,
              "values": null,
              "matchScore": 0.5,
              "attributes": [
                "Cylinders",
                "Weight"
              ],
              "inferenceType": "implicit",
              "isAttrAmbiguous": false,
              "isValueAmbiguous": false,
              "meta": {
                "value_ambiguity_type": null
              }
            }
          ]
        },
        "followUpQuery": false,
        "contextObj": null
      }
    },
    {
      "queryId": 40,
      "query": "Create a chart showing mpg across origin over years",
      "output": {
        "status": "SUCCESS",
        "debug": {
          "execution_durations": {
            "clean_query": 0.005825042724609375,
            "extract_attributes": 0.29856324195861816,
            "extract_vis_type": 0.00003719329833984375,
            "extract_tasks": 1.0550272464752197,
            "get_vis_list": 0.0010449886322021484,
            "total": 1.3604977130889893
          }
        },
        "query_raw": "Create a chart showing mpg across origin over years",
        "query": "create a chart showing mpg across origin over years",
        "dataset": "https://raw.githubusercontent.com/nl4dv/nl4dv/master/examples/assets/data/cars-w-year.csv",
        "alias": "https://raw.githubusercontent.com/nl4dv/nl4dv/master/examples/assets/aliases/cars-w-year.json",
        "visList": [
          {
            "score": 6,
            "scoreObj": {
              "by_attributes": 3,
              "by_task": 0,
              "by_vis": 0
            },
            "confidenceObj": {
              "MPG": 1,
              "Origin": 1,
              "Year": 1
            },
            "attributes": [
              "MPG",
              "Origin",
              "Year"
            ],
            "queryPhrase": null,
            "visType": null,
            "tasks": [
              "trend"
            ],
            "inferenceType": "implicit",
            "vlSpec": {
              "$schema": "https://vega.github.io/schema/vega-lite/v4.json",
              "mark": {
                "type": "line",
                "tooltip": true
              },
              "encoding": {
                "y": {
                  "field": "MPG",
                  "type": "quantitative",
                  "aggregate": "mean",
                  "axis": {
                    "format": "s"
                  }
                },
                "color": {
                  "field": "Origin",
                  "type": "nominal",
                  "aggregate": null
                },
                "x": {
                  "field": "Year",
                  "type": "temporal",
                  "aggregate": null
                }
              },
              "transform": [],
              "data": {
                "url": "https://raw.githubusercontent.com/nl4dv/nl4dv/master/examples/assets/data/cars-w-year.csv",
                "format": {
                  "type": "csv"
                }
              }
            }
          },
          {
            "score": 6,
            "scoreObj": {
              "by_attributes": 3,
              "by_task": 0,
              "by_vis": 0
            },
            "confidenceObj": {
              "MPG": 1,
              "Origin": 1,
              "Year": 1
            },
            "attributes": [
              "MPG",
              "Origin",
              "Year"
            ],
            "queryPhrase": null,
            "visType": null,
            "tasks": [
              "trend"
            ],
            "inferenceType": "implicit",
            "vlSpec": {
              "$schema": "https://vega.github.io/schema/vega-lite/v4.json",
              "mark": {
                "type": "line",
                "tooltip": true
              },
              "encoding": {
                "y": {
                  "field": "MPG",
                  "type": "quantitative",
                  "aggregate": "mean",
                  "axis": {
                    "format": "s"
                  }
                },
                "column": {
                  "field": "Origin",
                  "type": "nominal",
                  "aggregate": null
                },
                "x": {
                  "field": "Year",
                  "type": "temporal",
                  "aggregate": null
                },
                "color": {
                  "field": "Origin",
                  "type": "nominal",
                  "aggregate": null
                }
              },
              "transform": [],
              "data": {
                "url": "https://raw.githubusercontent.com/nl4dv/nl4dv/master/examples/assets/data/cars-w-year.csv",
                "format": {
                  "type": "csv"
                }
              }
            }
          },
          {
            "score": 6,
            "scoreObj": {
              "by_attributes": 3,
              "by_task": 0,
              "by_vis": 0
            },
            "confidenceObj": {
              "MPG": 1,
              "Origin": 1,
              "Year": 1
            },
            "attributes": [
              "MPG",
              "Origin",
              "Year"
            ],
            "queryPhrase": null,
            "visType": null,
            "tasks": [
              "trend"
            ],
            "inferenceType": "implicit",
            "vlSpec": {
              "$schema": "https://vega.github.io/schema/vega-lite/v4.json",
              "mark": {
                "type": "bar",
                "tooltip": true
              },
              "encoding": {
                "y": {
                  "field": "MPG",
                  "type": "quantitative",
                  "aggregate": "mean",
                  "axis": {
                    "format": "s"
                  }
                },
                "x": {
                  "field": "Origin",
                  "type": "nominal",
                  "aggregate": null
                },
                "column": {
                  "field": "Year",
                  "type": "temporal",
                  "aggregate": null
                },
                "color": {
                  "field": "Origin",
                  "type": "nominal",
                  "aggregate": null
                }
              },
              "transform": [],
              "data": {
                "url": "https://raw.githubusercontent.com/nl4dv/nl4dv/master/examples/assets/data/cars-w-year.csv",
                "format": {
                  "type": "csv"
                }
              }
            }
          },
          {
            "score": 6,
            "scoreObj": {
              "by_attributes": 3,
              "by_task": 0,
              "by_vis": 0
            },
            "confidenceObj": {
              "MPG": 1,
              "Origin": 1,
              "Year": 1
            },
            "attributes": [
              "MPG",
              "Origin",
              "Year"
            ],
            "queryPhrase": null,
            "visType": null,
            "tasks": [
              "trend"
            ],
            "inferenceType": "implicit",
            "vlSpec": {
              "$schema": "https://vega.github.io/schema/vega-lite/v4.json",
              "mark": {
                "type": "tick",
                "tooltip": true
              },
              "encoding": {
                "y": {
                  "field": "MPG",
                  "type": "quantitative",
                  "aggregate": null,
                  "axis": {
                    "format": "s"
                  }
                },
                "color": {
                  "field": "Origin",
                  "type": "nominal",
                  "aggregate": null
                },
                "x": {
                  "field": "Year",
                  "type": "temporal",
                  "aggregate": null
                },
                "tooltip": {
                  "field": "Model"
                }
              },
              "transform": [],
              "data": {
                "url": "https://raw.githubusercontent.com/nl4dv/nl4dv/master/examples/assets/data/cars-w-year.csv",
                "format": {
                  "type": "csv"
                }
              }
            }
          },
          {
            "score": 6,
            "scoreObj": {
              "by_attributes": 3,
              "by_task": 0,
              "by_vis": 0
            },
            "confidenceObj": {
              "MPG": 1,
              "Origin": 1,
              "Year": 1
            },
            "attributes": [
              "MPG",
              "Origin",
              "Year"
            ],
            "queryPhrase": null,
            "visType": null,
            "tasks": [
              "trend"
            ],
            "inferenceType": "implicit",
            "vlSpec": {
              "$schema": "https://vega.github.io/schema/vega-lite/v4.json",
              "mark": {
                "type": "tick",
                "tooltip": true
              },
              "encoding": {
                "y": {
                  "field": "MPG",
                  "type": "quantitative",
                  "aggregate": null,
                  "axis": {
                    "format": "s"
                  }
                },
                "column": {
                  "field": "Origin",
                  "type": "nominal",
                  "aggregate": null
                },
                "x": {
                  "field": "Year",
                  "type": "temporal",
                  "aggregate": null
                },
                "color": {
                  "field": "Origin",
                  "type": "nominal",
                  "aggregate": null
                },
                "tooltip": {
                  "field": "Model"
                }
              },
              "transform": [],
              "data": {
                "url": "https://raw.githubusercontent.com/nl4dv/nl4dv/master/examples/assets/data/cars-w-year.csv",
                "format": {
                  "type": "csv"
                }
              }
            }
          },
          {
            "score": 6,
            "scoreObj": {
              "by_attributes": 3,
              "by_task": 0,
              "by_vis": 0
            },
            "confidenceObj": {
              "MPG": 1,
              "Origin": 1,
              "Year": 1
            },
            "attributes": [
              "MPG",
              "Origin",
              "Year"
            ],
            "queryPhrase": null,
            "visType": null,
            "tasks": [
              "trend"
            ],
            "inferenceType": "implicit",
            "vlSpec": {
              "$schema": "https://vega.github.io/schema/vega-lite/v4.json",
              "mark": {
                "type": "tick",
                "tooltip": true
              },
              "encoding": {
                "y": {
                  "field": "MPG",
                  "type": "quantitative",
                  "aggregate": null,
                  "axis": {
                    "format": "s"
                  }
                },
                "x": {
                  "field": "Origin",
                  "type": "nominal",
                  "aggregate": null
                },
                "column": {
                  "field": "Year",
                  "type": "temporal",
                  "aggregate": null
                },
                "color": {
                  "field": "Origin",
                  "type": "nominal",
                  "aggregate": null
                },
                "tooltip": {
                  "field": "Model"
                }
              },
              "transform": [],
              "data": {
                "url": "https://raw.githubusercontent.com/nl4dv/nl4dv/master/examples/assets/data/cars-w-year.csv",
                "format": {
                  "type": "csv"
                }
              }
            }
          }
        ],
        "attributeMap": {
          "MPG": {
            "name": "MPG",
            "queryPhrase": [
              "mpg"
            ],
            "inferenceType": "explicit",
            "matchScore": 1,
            "metric": [
              "attribute_exact_match"
            ],
            "isLabel": false,
            "encode": true,
            "isAmbiguous": false,
            "ambiguity": [],
            "meta": {
              "score": 100,
              "threshold": 85,
              "alias": null,
              "ambiguity": {},
              "confidence": 100
            }
          },
          "Year": {
            "name": "Year",
            "queryPhrase": [
              "years"
            ],
            "inferenceType": "explicit",
            "matchScore": 1,
            "metric": [
              "attribute_exact_match"
            ],
            "isLabel": false,
            "encode": true,
            "isAmbiguous": false,
            "ambiguity": [],
            "meta": {
              "score": 100,
              "threshold": 85,
              "alias": null,
              "ambiguity": {},
              "confidence": 100
            }
          },
          "Origin": {
            "name": "Origin",
            "queryPhrase": [
              "origin"
            ],
            "inferenceType": "explicit",
            "matchScore": 1,
            "metric": [
              "attribute_exact_match"
            ],
            "isLabel": false,
            "encode": true,
            "isAmbiguous": false,
            "ambiguity": [],
            "meta": {
              "score": 100,
              "threshold": 85,
              "alias": null,
              "ambiguity": {},
              "confidence": 100
            }
          }
        },
        "taskMap": {
          "trend": [
            {
              "task": "trend",
              "queryPhrase": [],
              "operator": null,
              "values": null,
              "matchScore": 0.5,
              "attributes": [
                "MPG",
                "Origin",
                "Year"
              ],
              "inferenceType": "implicit",
              "isAttrAmbiguous": false,
              "isValueAmbiguous": false,
              "meta": {
                "value_ambiguity_type": null
              }
            }
          ]
        },
        "followUpQuery": false,
        "contextObj": null
      }
    }
  ],
  "other-examples": {
    "cars-w-year": [
      {
        "queryId": 41,
        "query": "Bar chart of number of cars from each origin",
        "output": {
          "status": "SUCCESS",
          "debug": {
            "execution_durations": {
              "clean_query": 0.0030498504638671875,
              "extract_attributes": 0.2885870933532715,
              "extract_vis_type": 0.0000152587890625,
              "extract_tasks": 1.0777547359466553,
              "get_vis_list": 0.00012993812561035156,
              "total": 1.3695368766784668
            }
          },
          "query_raw": "Bar chart of number of cars from each origin",
          "query": "bar chart of number of cars from each origin",
          "dataset": "https://raw.githubusercontent.com/nl4dv/nl4dv/master/examples/assets/data/cars-w-year.csv",
          "alias": "https://raw.githubusercontent.com/nl4dv/nl4dv/master/examples/assets/aliases/cars-w-year.json",
          "visList": [
            {
              "score": 3.5,
              "scoreObj": {
                "by_attributes": 1,
                "by_task": 0.5,
                "by_vis": 1
              },
              "confidenceObj": {
                "Origin": 1
              },
              "attributes": [
                "Origin"
              ],
              "queryPhrase": "bar chart",
              "visType": "barchart",
              "tasks": [
                "distribution"
              ],
              "inferenceType": "explicit",
              "vlSpec": {
                "$schema": "https://vega.github.io/schema/vega-lite/v4.json",
                "mark": {
                  "type": "bar",
                  "tooltip": true
                },
                "encoding": {
                  "x": {
                    "field": "Origin",
                    "type": "nominal",
                    "aggregate": null
                  },
                  "y": {
                    "field": "Origin",
                    "type": "nominal",
                    "aggregate": "count"
                  }
                },
                "transform": [],
                "data": {
                  "url": "https://raw.githubusercontent.com/nl4dv/nl4dv/master/examples/assets/data/cars-w-year.csv",
                  "format": {
                    "type": "csv"
                  }
                }
              }
            }
          ],
          "attributeMap": {
            "Origin": {
              "name": "Origin",
              "queryPhrase": [
                "origin"
              ],
              "inferenceType": "explicit",
              "matchScore": 1,
              "metric": [
                "attribute_exact_match"
              ],
              "isLabel": false,
              "encode": true,
              "isAmbiguous": false,
              "ambiguity": [],
              "meta": {
                "score": 100,
                "threshold": 85,
                "alias": null,
                "ambiguity": {},
                "confidence": 100
              }
            }
          },
          "taskMap": {
            "distribution": [
              {
                "task": "distribution",
                "queryPhrase": [],
                "operator": null,
                "values": null,
                "matchScore": 0.5,
                "attributes": [
                  "Origin"
                ],
                "inferenceType": "implicit",
                "isAttrAmbiguous": false,
                "isValueAmbiguous": false,
                "meta": {
                  "value_ambiguity_type": null
                }
              }
            ]
          },
          "followUpQuery": false,
          "contextObj": null
        }
      },
      {
        "queryId": 42,
        "query": "Bar chart of average acceleration for cars with each number of cylinders in each place of origin. Color by origin. Separate into multiple charts by number of cylinders.",
        "output": {
          "status": "SUCCESS",
          "debug": {
            "execution_durations": {
              "clean_query": 0.03014993667602539,
              "extract_attributes": 1.4171531200408936,
              "extract_vis_type": 0.00009608268737792969,
              "extract_tasks": 1.507108211517334,
              "get_vis_list": 0.0003237724304199219,
              "total": 2.954831123352051
            }
          },
          "query_raw": "Bar chart of average acceleration for cars with each number of cylinders in each place of origin. Color by origin. Separate into multiple charts by number of cylinders.",
          "query": "bar chart of average acceleration for cars with each number of cylinders in each place of origin . color by origin . separate into multiple charts by number of cylinders .",
          "dataset": "https://raw.githubusercontent.com/nl4dv/nl4dv/master/examples/assets/data/cars-w-year.csv",
          "alias": "https://raw.githubusercontent.com/nl4dv/nl4dv/master/examples/assets/aliases/cars-w-year.json",
          "visList": [
            {
              "score": 8,
              "scoreObj": {
                "by_attributes": 3,
                "by_task": 1,
                "by_vis": 1
              },
              "confidenceObj": {
                "Cylinders": 1,
                "Acceleration": 1,
                "Origin": 1
              },
              "attributes": [
                "Cylinders",
                "Acceleration",
                "Origin"
              ],
              "queryPhrase": "bar chart",
              "visType": "barchart",
              "tasks": [
                "derived_value"
              ],
              "inferenceType": "explicit",
              "vlSpec": {
                "$schema": "https://vega.github.io/schema/vega-lite/v4.json",
                "mark": {
                  "type": "bar",
                  "tooltip": true
                },
                "encoding": {
                  "x": {
                    "field": "Cylinders",
                    "type": "quantitative",
                    "aggregate": null,
                    "axis": {
                      "format": "s"
                    }
                  },
                  "y": {
                    "field": "Acceleration",
                    "type": "quantitative",
                    "aggregate": "mean",
                    "axis": {
                      "format": "s"
                    }
                  },
                  "color": {
                    "field": "Origin",
                    "type": "nominal",
                    "aggregate": null
                  }
                },
                "transform": [],
                "data": {
                  "url": "https://raw.githubusercontent.com/nl4dv/nl4dv/master/examples/assets/data/cars-w-year.csv",
                  "format": {
                    "type": "csv"
                  }
                }
              }
            },
            {
              "score": 8,
              "scoreObj": {
                "by_attributes": 3,
                "by_task": 1,
                "by_vis": 1
              },
              "confidenceObj": {
                "Cylinders": 1,
                "Acceleration": 1,
                "Origin": 1
              },
              "attributes": [
                "Cylinders",
                "Acceleration",
                "Origin"
              ],
              "queryPhrase": "bar chart",
              "visType": "barchart",
              "tasks": [
                "derived_value"
              ],
              "inferenceType": "explicit",
              "vlSpec": {
                "$schema": "https://vega.github.io/schema/vega-lite/v4.json",
                "mark": {
                  "type": "bar",
                  "tooltip": true
                },
                "encoding": {
                  "x": {
                    "field": "Cylinders",
                    "type": "quantitative",
                    "aggregate": null,
                    "axis": {
                      "format": "s"
                    }
                  },
                  "y": {
                    "field": "Acceleration",
                    "type": "quantitative",
                    "aggregate": "mean",
                    "axis": {
                      "format": "s"
                    }
                  },
                  "column": {
                    "field": "Origin",
                    "type": "nominal",
                    "aggregate": null
                  },
                  "color": {
                    "field": "Origin",
                    "type": "nominal",
                    "aggregate": null
                  }
                },
                "transform": [],
                "data": {
                  "url": "https://raw.githubusercontent.com/nl4dv/nl4dv/master/examples/assets/data/cars-w-year.csv",
                  "format": {
                    "type": "csv"
                  }
                }
              }
            },
            {
              "score": 8,
              "scoreObj": {
                "by_attributes": 3,
                "by_task": 1,
                "by_vis": 1
              },
              "confidenceObj": {
                "Cylinders": 1,
                "Acceleration": 1,
                "Origin": 1
              },
              "attributes": [
                "Cylinders",
                "Acceleration",
                "Origin"
              ],
              "queryPhrase": "bar chart",
              "visType": "barchart",
              "tasks": [
                "derived_value"
              ],
              "inferenceType": "explicit",
              "vlSpec": {
                "$schema": "https://vega.github.io/schema/vega-lite/v4.json",
                "mark": {
                  "type": "bar",
                  "tooltip": true
                },
                "encoding": {
                  "y": {
                    "field": "Cylinders",
                    "type": "quantitative",
                    "aggregate": null,
                    "axis": {
                      "format": "s"
                    }
                  },
                  "color": {
                    "field": "Acceleration",
                    "type": "quantitative",
                    "aggregate": "mean"
                  },
                  "x": {
                    "field": "Origin",
                    "type": "nominal",
                    "aggregate": null
                  }
                },
                "transform": [],
                "data": {
                  "url": "https://raw.githubusercontent.com/nl4dv/nl4dv/master/examples/assets/data/cars-w-year.csv",
                  "format": {
                    "type": "csv"
                  }
                }
              }
            }
          ],
          "attributeMap": {
            "Cylinders": {
              "name": "Cylinders",
              "queryPhrase": [
                "cylinders"
              ],
              "inferenceType": "explicit",
              "matchScore": 1,
              "metric": [
                "attribute_exact_match"
              ],
              "isLabel": false,
              "encode": true,
              "isAmbiguous": false,
              "ambiguity": [],
              "meta": {
                "score": 100,
                "threshold": 85,
                "alias": null,
                "ambiguity": {},
                "confidence": 100
              }
            },
            "Acceleration": {
              "name": "Acceleration",
              "queryPhrase": [
                "acceleration"
              ],
              "inferenceType": "explicit",
              "matchScore": 1,
              "metric": [
                "attribute_exact_match"
              ],
              "isLabel": false,
              "encode": true,
              "isAmbiguous": false,
              "ambiguity": [],
              "meta": {
                "score": 100,
                "threshold": 85,
                "alias": null,
                "ambiguity": {},
                "confidence": 100
              }
            },
            "Origin": {
              "name": "Origin",
              "queryPhrase": [
                "origin"
              ],
              "inferenceType": "explicit",
              "matchScore": 1,
              "metric": [
                "attribute_exact_match"
              ],
              "isLabel": false,
              "encode": true,
              "isAmbiguous": false,
              "ambiguity": [],
              "meta": {
                "score": 100,
                "threshold": 85,
                "alias": null,
                "ambiguity": {},
                "confidence": 100
              }
            }
          },
          "taskMap": {
            "derived_value": [
              {
                "task": "derived_value",
                "queryPhrase": "average",
                "operator": "AVG",
                "values": [],
                "matchScore": 1,
                "attributes": [
                  "Acceleration"
                ],
                "inferenceType": "explicit",
                "isAttrAmbiguous": false,
                "isValueAmbiguous": false,
                "meta": {
                  "value_ambiguity_type": null
                }
              }
            ]
          },
          "followUpQuery": false,
          "contextObj": null
        }
      },
      {
        "queryId": 43,
        "query": "Scatterplot of displacement vs mpg. Color by origin.",
        "output": {
          "status": "SUCCESS",
          "debug": {
            "execution_durations": {
              "clean_query": 0.0028400421142578125,
              "extract_attributes": 0.15807890892028809,
              "extract_vis_type": 0.000019788742065429688,
              "extract_tasks": 1.0868070125579834,
              "get_vis_list": 0.0003211498260498047,
              "total": 1.2480669021606445
            }
          },
          "query_raw": "Scatterplot of displacement vs mpg. Color by origin.",
          "query": "scatterplot of displacement vs mpg . color by origin .",
          "dataset": "https://raw.githubusercontent.com/nl4dv/nl4dv/master/examples/assets/data/cars-w-year.csv",
          "alias": "https://raw.githubusercontent.com/nl4dv/nl4dv/master/examples/assets/aliases/cars-w-year.json",
          "visList": [
            {
              "score": 7.5,
              "scoreObj": {
                "by_attributes": 3,
                "by_task": 0.5,
                "by_vis": 1
              },
              "confidenceObj": {
                "MPG": 1,
                "Displacement": 1,
                "Origin": 1
              },
              "attributes": [
                "MPG",
                "Displacement",
                "Origin"
              ],
              "queryPhrase": "scatterplot",
              "visType": "scatterplot",
              "tasks": [
                "correlation"
              ],
              "inferenceType": "explicit",
              "vlSpec": {
                "$schema": "https://vega.github.io/schema/vega-lite/v4.json",
                "mark": {
                  "type": "point",
                  "tooltip": true
                },
                "encoding": {
                  "x": {
                    "field": "MPG",
                    "type": "quantitative",
                    "aggregate": null,
                    "axis": {
                      "format": "s"
                    }
                  },
                  "y": {
                    "field": "Displacement",
                    "type": "quantitative",
                    "aggregate": null,
                    "axis": {
                      "format": "s"
                    }
                  },
                  "color": {
                    "field": "Origin",
                    "type": "nominal",
                    "aggregate": null
                  },
                  "tooltip": {
                    "field": "Model"
                  }
                },
                "transform": [],
                "data": {
                  "url": "https://raw.githubusercontent.com/nl4dv/nl4dv/master/examples/assets/data/cars-w-year.csv",
                  "format": {
                    "type": "csv"
                  }
                }
              }
            },
            {
              "score": 7.5,
              "scoreObj": {
                "by_attributes": 3,
                "by_task": 0.5,
                "by_vis": 1
              },
              "confidenceObj": {
                "MPG": 1,
                "Displacement": 1,
                "Origin": 1
              },
              "attributes": [
                "MPG",
                "Displacement",
                "Origin"
              ],
              "queryPhrase": "scatterplot",
              "visType": "scatterplot",
              "tasks": [
                "correlation"
              ],
              "inferenceType": "explicit",
              "vlSpec": {
                "$schema": "https://vega.github.io/schema/vega-lite/v4.json",
                "mark": {
                  "type": "point",
                  "tooltip": true
                },
                "encoding": {
                  "x": {
                    "field": "MPG",
                    "type": "quantitative",
                    "aggregate": null,
                    "axis": {
                      "format": "s"
                    }
                  },
                  "y": {
                    "field": "Displacement",
                    "type": "quantitative",
                    "aggregate": null,
                    "axis": {
                      "format": "s"
                    }
                  },
                  "column": {
                    "field": "Origin",
                    "type": "nominal",
                    "aggregate": null
                  },
                  "color": {
                    "field": "Origin",
                    "type": "nominal",
                    "aggregate": null
                  },
                  "tooltip": {
                    "field": "Model"
                  }
                },
                "transform": [],
                "data": {
                  "url": "https://raw.githubusercontent.com/nl4dv/nl4dv/master/examples/assets/data/cars-w-year.csv",
                  "format": {
                    "type": "csv"
                  }
                }
              }
            }
          ],
          "attributeMap": {
            "MPG": {
              "name": "MPG",
              "queryPhrase": [
                "mpg"
              ],
              "inferenceType": "explicit",
              "matchScore": 1,
              "metric": [
                "attribute_exact_match"
              ],
              "isLabel": false,
              "encode": true,
              "isAmbiguous": false,
              "ambiguity": [],
              "meta": {
                "score": 100,
                "threshold": 85,
                "alias": null,
                "ambiguity": {},
                "confidence": 100
              }
            },
            "Displacement": {
              "name": "Displacement",
              "queryPhrase": [
                "displacement"
              ],
              "inferenceType": "explicit",
              "matchScore": 1,
              "metric": [
                "attribute_exact_match"
              ],
              "isLabel": false,
              "encode": true,
              "isAmbiguous": false,
              "ambiguity": [],
              "meta": {
                "score": 100,
                "threshold": 85,
                "alias": null,
                "ambiguity": {},
                "confidence": 100
              }
            },
            "Origin": {
              "name": "Origin",
              "queryPhrase": [
                "origin"
              ],
              "inferenceType": "explicit",
              "matchScore": 1,
              "metric": [
                "attribute_exact_match"
              ],
              "isLabel": false,
              "encode": true,
              "isAmbiguous": false,
              "ambiguity": [],
              "meta": {
                "score": 100,
                "threshold": 85,
                "alias": null,
                "ambiguity": {},
                "confidence": 100
              }
            }
          },
          "taskMap": {
            "correlation": [
              {
                "task": "correlation",
                "queryPhrase": [],
                "operator": null,
                "values": null,
                "matchScore": 0.5,
                "attributes": [
                  "MPG",
                  "Displacement"
                ],
                "inferenceType": "implicit",
                "isAttrAmbiguous": false,
                "isValueAmbiguous": false,
                "meta": {
                  "value_ambiguity_type": null
                }
              }
            ]
          },
          "followUpQuery": false,
          "contextObj": null
        }
      },
      {
        "queryId": 44,
        "query": "Bar chart of cylinders versus average mpg",
        "output": {
          "status": "SUCCESS",
          "debug": {
            "execution_durations": {
              "clean_query": 0.0035011768341064453,
              "extract_attributes": 0.2825899124145508,
              "extract_vis_type": 0.000024080276489257812,
              "extract_tasks": 1.0681920051574707,
              "get_vis_list": 0.00019216537475585938,
              "total": 1.354499340057373
            }
          },
          "query_raw": "Bar chart of cylinders versus average mpg",
          "query": "bar chart of cylinders versus average mpg",
          "dataset": "https://raw.githubusercontent.com/nl4dv/nl4dv/master/examples/assets/data/cars-w-year.csv",
          "alias": "https://raw.githubusercontent.com/nl4dv/nl4dv/master/examples/assets/aliases/cars-w-year.json",
          "visList": [
            {
              "score": 6,
              "scoreObj": {
                "by_attributes": 2,
                "by_task": 1,
                "by_vis": 1
              },
              "confidenceObj": {
                "MPG": 1,
                "Cylinders": 1
              },
              "attributes": [
                "MPG",
                "Cylinders"
              ],
              "queryPhrase": "bar chart",
              "visType": "barchart",
              "tasks": [
                "derived_value"
              ],
              "inferenceType": "explicit",
              "vlSpec": {
                "$schema": "https://vega.github.io/schema/vega-lite/v4.json",
                "mark": {
                  "type": "bar",
                  "tooltip": true
                },
                "encoding": {
                  "x": {
                    "field": "MPG",
                    "type": "quantitative",
                    "aggregate": "mean",
                    "axis": {
                      "format": "s"
                    }
                  },
                  "y": {
                    "field": "Cylinders",
                    "type": "quantitative",
                    "aggregate": null,
                    "axis": {
                      "format": "s"
                    }
                  }
                },
                "transform": [],
                "data": {
                  "url": "https://raw.githubusercontent.com/nl4dv/nl4dv/master/examples/assets/data/cars-w-year.csv",
                  "format": {
                    "type": "csv"
                  }
                }
              }
            }
          ],
          "attributeMap": {
            "MPG": {
              "name": "MPG",
              "queryPhrase": [
                "mpg"
              ],
              "inferenceType": "explicit",
              "matchScore": 1,
              "metric": [
                "attribute_exact_match"
              ],
              "isLabel": false,
              "encode": true,
              "isAmbiguous": false,
              "ambiguity": [],
              "meta": {
                "score": 100,
                "threshold": 85,
                "alias": null,
                "ambiguity": {},
                "confidence": 100
              }
            },
            "Cylinders": {
              "name": "Cylinders",
              "queryPhrase": [
                "cylinders"
              ],
              "inferenceType": "explicit",
              "matchScore": 1,
              "metric": [
                "attribute_exact_match"
              ],
              "isLabel": false,
              "encode": true,
              "isAmbiguous": false,
              "ambiguity": [],
              "meta": {
                "score": 100,
                "threshold": 85,
                "alias": null,
                "ambiguity": {},
                "confidence": 100
              }
            }
          },
          "taskMap": {
            "derived_value": [
              {
                "task": "derived_value",
                "queryPhrase": "average",
                "operator": "AVG",
                "values": [],
                "matchScore": 1,
                "attributes": [
                  "MPG"
                ],
                "inferenceType": "explicit",
                "isAttrAmbiguous": false,
                "isValueAmbiguous": false,
                "meta": {
                  "value_ambiguity_type": null
                }
              }
            ]
          },
          "followUpQuery": false,
          "contextObj": null
        }
      },
      {
        "queryId": 45,
        "query": "Show number of cars from each country",
        "output": {
          "status": "SUCCESS",
          "debug": {
            "execution_durations": {
              "clean_query": 0.0022978782653808594,
              "extract_attributes": 0.22944998741149902,
              "extract_vis_type": 0.000021219253540039062,
              "extract_tasks": 1.0274968147277832,
              "get_vis_list": 0.0001621246337890625,
              "total": 1.2594280242919922
            }
          },
          "query_raw": "Show number of cars from each country",
          "query": "show number of cars from each country",
          "dataset": "https://raw.githubusercontent.com/nl4dv/nl4dv/master/examples/assets/data/cars-w-year.csv",
          "alias": "https://raw.githubusercontent.com/nl4dv/nl4dv/master/examples/assets/aliases/cars-w-year.json",
          "visList": [
            {
              "score": 2.3,
              "scoreObj": {
                "by_attributes": 0.8,
                "by_task": 0.5,
                "by_vis": 0
              },
              "confidenceObj": {
                "Origin": 1
              },
              "attributes": [
                "Origin"
              ],
              "queryPhrase": null,
              "visType": null,
              "tasks": [
                "distribution"
              ],
              "inferenceType": "implicit",
              "vlSpec": {
                "$schema": "https://vega.github.io/schema/vega-lite/v4.json",
                "mark": {
                  "type": "bar",
                  "tooltip": true
                },
                "encoding": {
                  "x": {
                    "field": "Origin",
                    "type": "nominal",
                    "aggregate": null
                  },
                  "y": {
                    "field": "Origin",
                    "type": "nominal",
                    "aggregate": "count"
                  }
                },
                "transform": [],
                "data": {
                  "url": "https://raw.githubusercontent.com/nl4dv/nl4dv/master/examples/assets/data/cars-w-year.csv",
                  "format": {
                    "type": "csv"
                  }
                }
              }
            }
          ],
          "attributeMap": {
            "Origin": {
              "name": "Origin",
              "queryPhrase": [
                "country"
              ],
              "inferenceType": "explicit",
              "matchScore": 0.8,
              "metric": "attribute_alias_exact_match",
              "isLabel": false,
              "encode": true,
              "isAmbiguous": false,
              "ambiguity": [],
              "meta": {
                "score": 100,
                "threshold": 85,
                "alias": "country",
                "ambiguity": {},
                "confidence": 100
              }
            }
          },
          "taskMap": {
            "distribution": [
              {
                "task": "distribution",
                "queryPhrase": [],
                "operator": null,
                "values": null,
                "matchScore": 0.5,
                "attributes": [
                  "Origin"
                ],
                "inferenceType": "implicit",
                "isAttrAmbiguous": false,
                "isValueAmbiguous": false,
                "meta": {
                  "value_ambiguity_type": null
                }
              }
            ]
          },
          "followUpQuery": false,
          "contextObj": null
        }
      },
      {
        "queryId": 46,
        "query": "Graph to show the acceleration for cars from different countries segregated based on number of cylinders",
        "output": {
          "status": "SUCCESS",
          "debug": {
            "execution_durations": {
              "clean_query": 0.013363838195800781,
              "extract_attributes": 0.6613509654998779,
              "extract_vis_type": 0.00006318092346191406,
              "extract_tasks": 1.1578168869018555,
              "get_vis_list": 0.00034880638122558594,
              "total": 1.8329436779022217
            }
          },
          "query_raw": "Graph to show the acceleration for cars from different countries segregated based on number of cylinders",
          "query": "graph to show the acceleration for cars from different countries segregated based on number of cylinders",
          "dataset": "https://raw.githubusercontent.com/nl4dv/nl4dv/master/examples/assets/data/cars-w-year.csv",
          "alias": "https://raw.githubusercontent.com/nl4dv/nl4dv/master/examples/assets/aliases/cars-w-year.json",
          "visList": [
            {
              "score": 6.3,
              "scoreObj": {
                "by_attributes": 2.8,
                "by_task": 0.5,
                "by_vis": 0
              },
              "confidenceObj": {
                "Cylinders": 1,
                "Acceleration": 1,
                "Origin": 1
              },
              "attributes": [
                "Cylinders",
                "Acceleration",
                "Origin"
              ],
              "queryPhrase": null,
              "visType": null,
              "tasks": [
                "correlation"
              ],
              "inferenceType": "implicit",
              "vlSpec": {
                "$schema": "https://vega.github.io/schema/vega-lite/v4.json",
                "mark": {
                  "type": "point",
                  "tooltip": true
                },
                "encoding": {
                  "x": {
                    "field": "Cylinders",
                    "type": "quantitative",
                    "aggregate": null,
                    "axis": {
                      "format": "s"
                    }
                  },
                  "y": {
                    "field": "Acceleration",
                    "type": "quantitative",
                    "aggregate": null,
                    "axis": {
                      "format": "s"
                    }
                  },
                  "color": {
                    "field": "Origin",
                    "type": "nominal",
                    "aggregate": null
                  },
                  "tooltip": {
                    "field": "Model"
                  }
                },
                "transform": [],
                "data": {
                  "url": "https://raw.githubusercontent.com/nl4dv/nl4dv/master/examples/assets/data/cars-w-year.csv",
                  "format": {
                    "type": "csv"
                  }
                }
              }
            },
            {
              "score": 6.3,
              "scoreObj": {
                "by_attributes": 2.8,
                "by_task": 0.5,
                "by_vis": 0
              },
              "confidenceObj": {
                "Cylinders": 1,
                "Acceleration": 1,
                "Origin": 1
              },
              "attributes": [
                "Cylinders",
                "Acceleration",
                "Origin"
              ],
              "queryPhrase": null,
              "visType": null,
              "tasks": [
                "correlation"
              ],
              "inferenceType": "implicit",
              "vlSpec": {
                "$schema": "https://vega.github.io/schema/vega-lite/v4.json",
                "mark": {
                  "type": "point",
                  "tooltip": true
                },
                "encoding": {
                  "x": {
                    "field": "Cylinders",
                    "type": "quantitative",
                    "aggregate": null,
                    "axis": {
                      "format": "s"
                    }
                  },
                  "y": {
                    "field": "Acceleration",
                    "type": "quantitative",
                    "aggregate": null,
                    "axis": {
                      "format": "s"
                    }
                  },
                  "column": {
                    "field": "Origin",
                    "type": "nominal",
                    "aggregate": null
                  },
                  "color": {
                    "field": "Origin",
                    "type": "nominal",
                    "aggregate": null
                  },
                  "tooltip": {
                    "field": "Model"
                  }
                },
                "transform": [],
                "data": {
                  "url": "https://raw.githubusercontent.com/nl4dv/nl4dv/master/examples/assets/data/cars-w-year.csv",
                  "format": {
                    "type": "csv"
                  }
                }
              }
            }
          ],
          "attributeMap": {
            "Cylinders": {
              "name": "Cylinders",
              "queryPhrase": [
                "cylinders"
              ],
              "inferenceType": "explicit",
              "matchScore": 1,
              "metric": [
                "attribute_exact_match"
              ],
              "isLabel": false,
              "encode": true,
              "isAmbiguous": false,
              "ambiguity": [],
              "meta": {
                "score": 100,
                "threshold": 85,
                "alias": null,
                "ambiguity": {},
                "confidence": 100
              }
            },
            "Acceleration": {
              "name": "Acceleration",
              "queryPhrase": [
                "acceleration"
              ],
              "inferenceType": "explicit",
              "matchScore": 1,
              "metric": [
                "attribute_exact_match"
              ],
              "isLabel": false,
              "encode": true,
              "isAmbiguous": false,
              "ambiguity": [],
              "meta": {
                "score": 100,
                "threshold": 85,
                "alias": null,
                "ambiguity": {},
                "confidence": 100
              }
            },
            "Origin": {
              "name": "Origin",
              "queryPhrase": [
                "countries"
              ],
              "inferenceType": "explicit",
              "matchScore": 0.8,
              "metric": "attribute_alias_exact_match",
              "isLabel": false,
              "encode": true,
              "isAmbiguous": false,
              "ambiguity": [],
              "meta": {
                "score": 100,
                "threshold": 85,
                "alias": "country",
                "ambiguity": {},
                "confidence": 100
              }
            }
          },
          "taskMap": {
            "correlation": [
              {
                "task": "correlation",
                "queryPhrase": [],
                "operator": null,
                "values": null,
                "matchScore": 0.5,
                "attributes": [
                  "Cylinders",
                  "Acceleration"
                ],
                "inferenceType": "implicit",
                "isAttrAmbiguous": false,
                "isValueAmbiguous": false,
                "meta": {
                  "value_ambiguity_type": null
                }
              }
            ]
          },
          "followUpQuery": false,
          "contextObj": null
        }
      },
      {
        "queryId": 47,
        "query": "Visualize the distribution of models by weight",
        "output": {
          "status": "SUCCESS",
          "debug": {
            "execution_durations": {
              "clean_query": 0.0023260116577148438,
              "extract_attributes": 0.13748502731323242,
              "extract_vis_type": 0.00002193450927734375,
              "extract_tasks": 1.0660490989685059,
              "get_vis_list": 0.0002880096435546875,
              "total": 1.2061700820922852
            }
          },
          "query_raw": "Visualize the distribution of models by weight",
          "query": "visualize the distribution of models by weight",
          "dataset": "https://raw.githubusercontent.com/nl4dv/nl4dv/master/examples/assets/data/cars-w-year.csv",
          "alias": "https://raw.githubusercontent.com/nl4dv/nl4dv/master/examples/assets/aliases/cars-w-year.json",
          "visList": [
            {
              "score": 5,
              "scoreObj": {
                "by_attributes": 2,
                "by_task": 1,
                "by_vis": 0
              },
              "confidenceObj": {
                "Weight": 1,
                "Model": 1
              },
              "attributes": [
                "Weight",
                "Model"
              ],
              "queryPhrase": null,
              "visType": null,
              "tasks": [
                "distribution"
              ],
              "inferenceType": "implicit",
              "vlSpec": {
                "$schema": "https://vega.github.io/schema/vega-lite/v4.json",
                "mark": {
                  "type": "tick",
                  "tooltip": true
                },
                "encoding": {
                  "y": {
                    "field": "Weight",
                    "type": "quantitative",
                    "aggregate": null,
                    "axis": {
                      "format": "s"
                    }
                  },
                  "x": {
                    "field": "Model",
                    "type": "nominal",
                    "aggregate": null
                  },
                  "tooltip": {
                    "field": "Model"
                  }
                },
                "transform": [],
                "data": {
                  "url": "https://raw.githubusercontent.com/nl4dv/nl4dv/master/examples/assets/data/cars-w-year.csv",
                  "format": {
                    "type": "csv"
                  }
                }
              }
            }
          ],
          "attributeMap": {
            "Model": {
              "name": "Model",
              "queryPhrase": [
                "models"
              ],
              "inferenceType": "explicit",
              "matchScore": 1,
              "metric": [
                "attribute_exact_match"
              ],
              "isLabel": true,
              "encode": true,
              "isAmbiguous": false,
              "ambiguity": [],
              "meta": {
                "score": 100,
                "threshold": 85,
                "alias": null,
                "ambiguity": {},
                "confidence": 100
              }
            },
            "Weight": {
              "name": "Weight",
              "queryPhrase": [
                "weight"
              ],
              "inferenceType": "explicit",
              "matchScore": 1,
              "metric": [
                "attribute_exact_match"
              ],
              "isLabel": false,
              "encode": true,
              "isAmbiguous": false,
              "ambiguity": [],
              "meta": {
                "score": 100,
                "threshold": 85,
                "alias": null,
                "ambiguity": {},
                "confidence": 100
              }
            }
          },
          "taskMap": {
            "distribution": [
              {
                "task": "distribution",
                "queryPhrase": "distribution",
                "operator": null,
                "values": [],
                "matchScore": 1,
                "attributes": [
                  "Model"
                ],
                "inferenceType": "explicit",
                "isAttrAmbiguous": false,
                "isValueAmbiguous": false,
                "meta": {
                  "value_ambiguity_type": null
                }
              }
            ]
          },
          "followUpQuery": false,
          "contextObj": null
        }
      },
      {
        "queryId": 48,
        "query": "Visualize the general trend of car model weights over the years",
        "output": {
          "status": "SUCCESS",
          "debug": {
            "execution_durations": {
              "clean_query": 0.004559755325317383,
              "extract_attributes": 0.35525989532470703,
              "extract_vis_type": 0.000030994415283203125,
              "extract_tasks": 1.088252067565918,
              "get_vis_list": 0.0002713203430175781,
              "total": 1.4483740329742432
            }
          },
          "query_raw": "Visualize the general trend of car model weights over the years",
          "query": "visualize the general trend of car model weights over the years",
          "dataset": "https://raw.githubusercontent.com/nl4dv/nl4dv/master/examples/assets/data/cars-w-year.csv",
          "alias": "https://raw.githubusercontent.com/nl4dv/nl4dv/master/examples/assets/aliases/cars-w-year.json",
          "visList": [
            {
              "score": 4,
              "scoreObj": {
                "by_attributes": 2,
                "by_task": 0,
                "by_vis": 0
              },
              "confidenceObj": {
                "Weight": 1,
                "Year": 1
              },
              "attributes": [
                "Weight",
                "Year"
              ],
              "queryPhrase": null,
              "visType": null,
              "tasks": [
                "trend"
              ],
              "inferenceType": "implicit",
              "vlSpec": {
                "$schema": "https://vega.github.io/schema/vega-lite/v4.json",
                "mark": {
                  "type": "line",
                  "tooltip": true
                },
                "encoding": {
                  "y": {
                    "field": "Weight",
                    "type": "quantitative",
                    "aggregate": "mean",
                    "axis": {
                      "format": "s"
                    }
                  },
                  "x": {
                    "field": "Year",
                    "type": "temporal",
                    "aggregate": null
                  }
                },
                "transform": [],
                "data": {
                  "url": "https://raw.githubusercontent.com/nl4dv/nl4dv/master/examples/assets/data/cars-w-year.csv",
                  "format": {
                    "type": "csv"
                  }
                }
              }
            }
          ],
          "attributeMap": {
            "Model": {
              "name": "Model",
              "queryPhrase": [
                "model"
              ],
              "inferenceType": "explicit",
              "matchScore": 1,
              "metric": [
                "attribute_exact_match"
              ],
              "isLabel": true,
              "encode": false,
              "isAmbiguous": false,
              "ambiguity": [],
              "meta": {
                "score": 100,
                "threshold": 85,
                "alias": null,
                "ambiguity": {},
                "confidence": 100
              }
            },
            "Weight": {
              "name": "Weight",
              "queryPhrase": [
                "weights"
              ],
              "inferenceType": "explicit",
              "matchScore": 1,
              "metric": [
                "attribute_exact_match"
              ],
              "isLabel": false,
              "encode": true,
              "isAmbiguous": false,
              "ambiguity": [],
              "meta": {
                "score": 100,
                "threshold": 85,
                "alias": null,
                "ambiguity": {},
                "confidence": 100
              }
            },
            "Year": {
              "name": "Year",
              "queryPhrase": [
                "years"
              ],
              "inferenceType": "explicit",
              "matchScore": 1,
              "metric": [
                "attribute_exact_match"
              ],
              "isLabel": false,
              "encode": true,
              "isAmbiguous": false,
              "ambiguity": [],
              "meta": {
                "score": 100,
                "threshold": 85,
                "alias": null,
                "ambiguity": {},
                "confidence": 100
              }
            }
          },
          "taskMap": {
            "trend": [
              {
                "task": "trend",
                "queryPhrase": "trend",
                "operator": null,
                "values": [],
                "matchScore": 1,
                "attributes": [
                  "Weight"
                ],
                "inferenceType": "explicit",
                "isAttrAmbiguous": false,
                "isValueAmbiguous": true,
                "meta": {
                  "value_ambiguity_type": "datatype"
                }
              }
            ]
          },
          "followUpQuery": false,
          "contextObj": null
        }
      },
      {
        "queryId": 49,
        "query": "Plot count of models by grouped by origin",
        "output": {
          "status": "SUCCESS",
          "debug": {
            "execution_durations": {
              "clean_query": 0.003426074981689453,
              "extract_attributes": 0.3284008502960205,
              "extract_vis_type": 0.000029087066650390625,
              "extract_tasks": 1.081563949584961,
              "get_vis_list": 0.00017905235290527344,
              "total": 1.4135990142822266
            }
          },
          "query_raw": "Plot count of models by grouped by origin",
          "query": "plot count of models by grouped by origin",
          "dataset": "https://raw.githubusercontent.com/nl4dv/nl4dv/master/examples/assets/data/cars-w-year.csv",
          "alias": "https://raw.githubusercontent.com/nl4dv/nl4dv/master/examples/assets/aliases/cars-w-year.json",
          "visList": [
            {
              "score": 2.5,
              "scoreObj": {
                "by_attributes": 1,
                "by_task": 0.5,
                "by_vis": 0
              },
              "confidenceObj": {
                "Origin": 1
              },
              "attributes": [
                "Origin"
              ],
              "queryPhrase": null,
              "visType": null,
              "tasks": [
                "distribution"
              ],
              "inferenceType": "implicit",
              "vlSpec": {
                "$schema": "https://vega.github.io/schema/vega-lite/v4.json",
                "mark": {
                  "type": "bar",
                  "tooltip": true
                },
                "encoding": {
                  "x": {
                    "field": "Origin",
                    "type": "nominal",
                    "aggregate": null
                  },
                  "y": {
                    "field": "Origin",
                    "type": "nominal",
                    "aggregate": "count"
                  }
                },
                "transform": [],
                "data": {
                  "url": "https://raw.githubusercontent.com/nl4dv/nl4dv/master/examples/assets/data/cars-w-year.csv",
                  "format": {
                    "type": "csv"
                  }
                }
              }
            }
          ],
          "attributeMap": {
            "Model": {
              "name": "Model",
              "queryPhrase": [
                "models"
              ],
              "inferenceType": "explicit",
              "matchScore": 1,
              "metric": [
                "attribute_exact_match"
              ],
              "isLabel": true,
              "encode": false,
              "isAmbiguous": false,
              "ambiguity": [],
              "meta": {
                "score": 100,
                "threshold": 85,
                "alias": null,
                "ambiguity": {},
                "confidence": 100
              }
            },
            "Origin": {
              "name": "Origin",
              "queryPhrase": [
                "origin"
              ],
              "inferenceType": "explicit",
              "matchScore": 1,
              "metric": [
                "attribute_exact_match"
              ],
              "isLabel": false,
              "encode": true,
              "isAmbiguous": false,
              "ambiguity": [],
              "meta": {
                "score": 100,
                "threshold": 85,
                "alias": null,
                "ambiguity": {},
                "confidence": 100
              }
            }
          },
          "taskMap": {
            "distribution": [
              {
                "task": "distribution",
                "queryPhrase": [],
                "operator": null,
                "values": null,
                "matchScore": 0.5,
                "attributes": [
                  "Origin"
                ],
                "inferenceType": "implicit",
                "isAttrAmbiguous": false,
                "isValueAmbiguous": false,
                "meta": {
                  "value_ambiguity_type": null
                }
              }
            ]
          },
          "followUpQuery": false,
          "contextObj": null
        }
      },
      {
        "queryId": 50,
        "query": "Visualize distribution of models by number of cyclinders grouped by origin",
        "output": {
          "status": "SUCCESS",
          "debug": {
            "execution_durations": {
              "clean_query": 0.006489992141723633,
              "extract_attributes": 0.29680705070495605,
              "extract_vis_type": 0.00003719329833984375,
              "extract_tasks": 1.086751937866211,
              "get_vis_list": 0.000553131103515625,
              "total": 1.390639305114746
            }
          },
          "query_raw": "Visualize distribution of models by number of cyclinders grouped by origin",
          "query": "visualize distribution of models by number of cyclinders grouped by origin",
          "dataset": "https://raw.githubusercontent.com/nl4dv/nl4dv/master/examples/assets/data/cars-w-year.csv",
          "alias": "https://raw.githubusercontent.com/nl4dv/nl4dv/master/examples/assets/aliases/cars-w-year.json",
          "visList": [
            {
              "score": 6.9,
              "scoreObj": {
                "by_attributes": 2.9,
                "by_task": 1,
                "by_vis": 0
              },
              "confidenceObj": {
                "Cylinders": 1,
                "Model": 1,
                "Origin": 1
              },
              "attributes": [
                "Cylinders",
                "Model",
                "Origin"
              ],
              "queryPhrase": null,
              "visType": null,
              "tasks": [
                "distribution"
              ],
              "inferenceType": "implicit",
              "vlSpec": {
                "$schema": "https://vega.github.io/schema/vega-lite/v4.json",
                "mark": {
                  "type": "tick",
                  "tooltip": true
                },
                "encoding": {
                  "y": {
                    "field": "Cylinders",
                    "type": "quantitative",
                    "aggregate": null,
                    "axis": {
                      "format": "s"
                    }
                  },
                  "x": {
                    "field": "Model",
                    "type": "nominal",
                    "aggregate": null
                  },
                  "color": {
                    "field": "Origin",
                    "type": "nominal",
                    "aggregate": null
                  },
                  "tooltip": {
                    "field": "Model"
                  }
                },
                "transform": [],
                "data": {
                  "url": "https://raw.githubusercontent.com/nl4dv/nl4dv/master/examples/assets/data/cars-w-year.csv",
                  "format": {
                    "type": "csv"
                  }
                }
              }
            },
            {
              "score": 6.9,
              "scoreObj": {
                "by_attributes": 2.9,
                "by_task": 1,
                "by_vis": 0
              },
              "confidenceObj": {
                "Cylinders": 1,
                "Model": 1,
                "Origin": 1
              },
              "attributes": [
                "Cylinders",
                "Model",
                "Origin"
              ],
              "queryPhrase": null,
              "visType": null,
              "tasks": [
                "distribution"
              ],
              "inferenceType": "implicit",
              "vlSpec": {
                "$schema": "https://vega.github.io/schema/vega-lite/v4.json",
                "mark": {
                  "type": "tick",
                  "tooltip": true
                },
                "encoding": {
                  "y": {
                    "field": "Cylinders",
                    "type": "quantitative",
                    "aggregate": null,
                    "axis": {
                      "format": "s"
                    }
                  },
                  "x": {
                    "field": "Model",
                    "type": "nominal",
                    "aggregate": null
                  },
                  "column": {
                    "field": "Origin",
                    "type": "nominal",
                    "aggregate": null
                  },
                  "color": {
                    "field": "Origin",
                    "type": "nominal",
                    "aggregate": null
                  },
                  "tooltip": {
                    "field": "Model"
                  }
                },
                "transform": [],
                "data": {
                  "url": "https://raw.githubusercontent.com/nl4dv/nl4dv/master/examples/assets/data/cars-w-year.csv",
                  "format": {
                    "type": "csv"
                  }
                }
              }
            },
            {
              "score": 6.9,
              "scoreObj": {
                "by_attributes": 2.9,
                "by_task": 1,
                "by_vis": 0
              },
              "confidenceObj": {
                "Cylinders": 1,
                "Model": 1,
                "Origin": 1
              },
              "attributes": [
                "Cylinders",
                "Model",
                "Origin"
              ],
              "queryPhrase": null,
              "visType": null,
              "tasks": [
                "distribution"
              ],
              "inferenceType": "implicit",
              "vlSpec": {
                "$schema": "https://vega.github.io/schema/vega-lite/v4.json",
                "mark": {
                  "type": "tick",
                  "tooltip": true
                },
                "encoding": {
                  "y": {
                    "field": "Cylinders",
                    "type": "quantitative",
                    "aggregate": null,
                    "axis": {
                      "format": "s"
                    }
                  },
                  "x": {
                    "field": "Model",
                    "type": "nominal",
                    "aggregate": null
                  },
                  "size": {
                    "field": "Origin",
                    "type": "nominal",
                    "aggregate": null
                  },
                  "tooltip": {
                    "field": "Model"
                  }
                },
                "transform": [],
                "data": {
                  "url": "https://raw.githubusercontent.com/nl4dv/nl4dv/master/examples/assets/data/cars-w-year.csv",
                  "format": {
                    "type": "csv"
                  }
                }
              }
            }
          ],
          "attributeMap": {
            "Model": {
              "name": "Model",
              "queryPhrase": [
                "models"
              ],
              "inferenceType": "explicit",
              "matchScore": 1,
              "metric": [
                "attribute_exact_match"
              ],
              "isLabel": true,
              "encode": true,
              "isAmbiguous": false,
              "ambiguity": [],
              "meta": {
                "score": 100,
                "threshold": 85,
                "alias": null,
                "ambiguity": {},
                "confidence": 100
              }
            },
            "Origin": {
              "name": "Origin",
              "queryPhrase": [
                "origin"
              ],
              "inferenceType": "explicit",
              "matchScore": 1,
              "metric": [
                "attribute_exact_match"
              ],
              "isLabel": false,
              "encode": true,
              "isAmbiguous": false,
              "ambiguity": [],
              "meta": {
                "score": 100,
                "threshold": 85,
                "alias": null,
                "ambiguity": {},
                "confidence": 100
              }
            },
            "Cylinders": {
              "name": "Cylinders",
              "queryPhrase": [
                "cyclinders"
              ],
              "inferenceType": "explicit",
              "matchScore": 0.9,
              "metric": [
                "attribute_similarity_match"
              ],
              "isLabel": false,
              "encode": true,
              "isAmbiguous": false,
              "ambiguity": [],
              "meta": {
                "score": 95,
                "threshold": 85,
                "alias": null,
                "ambiguity": {},
                "confidence": 100
              }
            }
          },
          "taskMap": {
            "distribution": [
              {
                "task": "distribution",
                "queryPhrase": "distribution",
                "operator": null,
                "values": [],
                "matchScore": 1,
                "attributes": [
                  "Model"
                ],
                "inferenceType": "explicit",
                "isAttrAmbiguous": false,
                "isValueAmbiguous": false,
                "meta": {
                  "value_ambiguity_type": null
                }
              }
            ]
          },
          "followUpQuery": false,
          "contextObj": null
        }
      },
      {
        "queryId": 51,
        "query": "Visualize average accelaration based on number of cyclinders a model has summed across different origins",
        "output": {
          "status": "SUCCESS",
          "debug": {
            "execution_durations": {
              "clean_query": 0.017177104949951172,
              "extract_attributes": 0.5999820232391357,
              "extract_vis_type": 0.00007414817810058594,
              "extract_tasks": 1.1591269969940186,
              "get_vis_list": 0.00033402442932128906,
              "total": 1.7766942977905273
            }
          },
          "query_raw": "Visualize average accelaration based on number of cyclinders a model has summed across different origins",
          "query": "visualize average accelaration based on number of cyclinders a model has summed across different origins",
          "dataset": "https://raw.githubusercontent.com/nl4dv/nl4dv/master/examples/assets/data/cars-w-year.csv",
          "alias": "https://raw.githubusercontent.com/nl4dv/nl4dv/master/examples/assets/aliases/cars-w-year.json",
          "visList": [
            {
              "score": 6.8,
              "scoreObj": {
                "by_attributes": 2.8,
                "by_task": 1,
                "by_vis": 0
              },
              "confidenceObj": {
                "Cylinders": 1,
                "Acceleration": 1,
                "Origin": 1
              },
              "attributes": [
                "Cylinders",
                "Acceleration",
                "Origin"
              ],
              "queryPhrase": null,
              "visType": null,
              "tasks": [
                "derived_value"
              ],
              "inferenceType": "implicit",
              "vlSpec": {
                "$schema": "https://vega.github.io/schema/vega-lite/v4.json",
                "mark": {
                  "type": "point",
                  "tooltip": true
                },
                "encoding": {
                  "x": {
                    "field": "Cylinders",
                    "type": "quantitative",
                    "aggregate": null,
                    "axis": {
                      "format": "s"
                    }
                  },
                  "y": {
                    "field": "Acceleration",
                    "type": "quantitative",
                    "aggregate": "mean",
                    "axis": {
                      "format": "s"
                    }
                  },
                  "color": {
                    "field": "Origin",
                    "type": "nominal",
                    "aggregate": null
                  }
                },
                "transform": [],
                "data": {
                  "url": "https://raw.githubusercontent.com/nl4dv/nl4dv/master/examples/assets/data/cars-w-year.csv",
                  "format": {
                    "type": "csv"
                  }
                }
              }
            },
            {
              "score": 6.8,
              "scoreObj": {
                "by_attributes": 2.8,
                "by_task": 1,
                "by_vis": 0
              },
              "confidenceObj": {
                "Cylinders": 1,
                "Acceleration": 1,
                "Origin": 1
              },
              "attributes": [
                "Cylinders",
                "Acceleration",
                "Origin"
              ],
              "queryPhrase": null,
              "visType": null,
              "tasks": [
                "derived_value"
              ],
              "inferenceType": "implicit",
              "vlSpec": {
                "$schema": "https://vega.github.io/schema/vega-lite/v4.json",
                "mark": {
                  "type": "point",
                  "tooltip": true
                },
                "encoding": {
                  "x": {
                    "field": "Cylinders",
                    "type": "quantitative",
                    "aggregate": null,
                    "axis": {
                      "format": "s"
                    }
                  },
                  "y": {
                    "field": "Acceleration",
                    "type": "quantitative",
                    "aggregate": "mean",
                    "axis": {
                      "format": "s"
                    }
                  },
                  "column": {
                    "field": "Origin",
                    "type": "nominal",
                    "aggregate": null
                  },
                  "color": {
                    "field": "Origin",
                    "type": "nominal",
                    "aggregate": null
                  }
                },
                "transform": [],
                "data": {
                  "url": "https://raw.githubusercontent.com/nl4dv/nl4dv/master/examples/assets/data/cars-w-year.csv",
                  "format": {
                    "type": "csv"
                  }
                }
              }
            },
            {
              "score": 6.8,
              "scoreObj": {
                "by_attributes": 2.8,
                "by_task": 1,
                "by_vis": 0
              },
              "confidenceObj": {
                "Cylinders": 1,
                "Acceleration": 1,
                "Origin": 1
              },
              "attributes": [
                "Cylinders",
                "Acceleration",
                "Origin"
              ],
              "queryPhrase": null,
              "visType": null,
              "tasks": [
                "derived_value"
              ],
              "inferenceType": "implicit",
              "vlSpec": {
                "$schema": "https://vega.github.io/schema/vega-lite/v4.json",
                "mark": {
                  "type": "tick",
                  "tooltip": true
                },
                "encoding": {
                  "y": {
                    "field": "Cylinders",
                    "type": "quantitative",
                    "aggregate": null,
                    "axis": {
                      "format": "s"
                    }
                  },
                  "color": {
                    "field": "Acceleration",
                    "type": "quantitative",
                    "aggregate": "mean"
                  },
                  "x": {
                    "field": "Origin",
                    "type": "nominal",
                    "aggregate": null
                  }
                },
                "transform": [],
                "data": {
                  "url": "https://raw.githubusercontent.com/nl4dv/nl4dv/master/examples/assets/data/cars-w-year.csv",
                  "format": {
                    "type": "csv"
                  }
                }
              }
            }
          ],
          "attributeMap": {
            "Model": {
              "name": "Model",
              "queryPhrase": [
                "model"
              ],
              "inferenceType": "explicit",
              "matchScore": 1,
              "metric": [
                "attribute_exact_match"
              ],
              "isLabel": true,
              "encode": false,
              "isAmbiguous": false,
              "ambiguity": [],
              "meta": {
                "score": 100,
                "threshold": 85,
                "alias": null,
                "ambiguity": {},
                "confidence": 100
              }
            },
            "Origin": {
              "name": "Origin",
              "queryPhrase": [
                "origins"
              ],
              "inferenceType": "explicit",
              "matchScore": 1,
              "metric": [
                "attribute_exact_match"
              ],
              "isLabel": false,
              "encode": true,
              "isAmbiguous": false,
              "ambiguity": [],
              "meta": {
                "score": 100,
                "threshold": 85,
                "alias": null,
                "ambiguity": {},
                "confidence": 100
              }
            },
            "Cylinders": {
              "name": "Cylinders",
              "queryPhrase": [
                "cyclinders"
              ],
              "inferenceType": "explicit",
              "matchScore": 0.9,
              "metric": [
                "attribute_similarity_match"
              ],
              "isLabel": false,
              "encode": true,
              "isAmbiguous": false,
              "ambiguity": [],
              "meta": {
                "score": 95,
                "threshold": 85,
                "alias": null,
                "ambiguity": {},
                "confidence": 100
              }
            },
            "Acceleration": {
              "name": "Acceleration",
              "queryPhrase": [
                "accelaration"
              ],
              "inferenceType": "explicit",
              "matchScore": 0.9,
              "metric": [
                "attribute_similarity_match"
              ],
              "isLabel": false,
              "encode": true,
              "isAmbiguous": false,
              "ambiguity": [],
              "meta": {
                "score": 92,
                "threshold": 85,
                "alias": null,
                "ambiguity": {},
                "confidence": 100
              }
            }
          },
          "taskMap": {
            "derived_value": [
              {
                "task": "derived_value",
                "queryPhrase": "average",
                "operator": "AVG",
                "values": [],
                "matchScore": 1,
                "attributes": [
                  "Acceleration"
                ],
                "inferenceType": "explicit",
                "isAttrAmbiguous": false,
                "isValueAmbiguous": false,
                "meta": {
                  "value_ambiguity_type": null
                }
              }
            ]
          },
          "followUpQuery": false,
          "contextObj": null
        }
      },
      {
        "queryId": 52,
        "query": "Bar graph to show number of cars from different Origins",
        "output": {
          "status": "SUCCESS",
          "debug": {
            "execution_durations": {
              "clean_query": 0.004945278167724609,
              "extract_attributes": 0.4153480529785156,
              "extract_vis_type": 0.00002288818359375,
              "extract_tasks": 1.126542091369629,
              "get_vis_list": 0.00019097328186035156,
              "total": 1.5470492839813232
            }
          },
          "query_raw": "Bar graph to show number of cars from different Origins",
          "query": "bar graph to show number of cars from different origins",
          "dataset": "https://raw.githubusercontent.com/nl4dv/nl4dv/master/examples/assets/data/cars-w-year.csv",
          "alias": "https://raw.githubusercontent.com/nl4dv/nl4dv/master/examples/assets/aliases/cars-w-year.json",
          "visList": [
            {
              "score": 3.5,
              "scoreObj": {
                "by_attributes": 1,
                "by_task": 0.5,
                "by_vis": 1
              },
              "confidenceObj": {
                "Origin": 1
              },
              "attributes": [
                "Origin"
              ],
              "queryPhrase": "bar graph",
              "visType": "barchart",
              "tasks": [
                "distribution"
              ],
              "inferenceType": "explicit",
              "vlSpec": {
                "$schema": "https://vega.github.io/schema/vega-lite/v4.json",
                "mark": {
                  "type": "bar",
                  "tooltip": true
                },
                "encoding": {
                  "x": {
                    "field": "Origin",
                    "type": "nominal",
                    "aggregate": null
                  },
                  "y": {
                    "field": "Origin",
                    "type": "nominal",
                    "aggregate": "count"
                  }
                },
                "transform": [],
                "data": {
                  "url": "https://raw.githubusercontent.com/nl4dv/nl4dv/master/examples/assets/data/cars-w-year.csv",
                  "format": {
                    "type": "csv"
                  }
                }
              }
            }
          ],
          "attributeMap": {
            "Origin": {
              "name": "Origin",
              "queryPhrase": [
                "origins"
              ],
              "inferenceType": "explicit",
              "matchScore": 1,
              "metric": [
                "attribute_exact_match"
              ],
              "isLabel": false,
              "encode": true,
              "isAmbiguous": false,
              "ambiguity": [],
              "meta": {
                "score": 100,
                "threshold": 85,
                "alias": null,
                "ambiguity": {},
                "confidence": 100
              }
            }
          },
          "taskMap": {
            "distribution": [
              {
                "task": "distribution",
                "queryPhrase": [],
                "operator": null,
                "values": null,
                "matchScore": 0.5,
                "attributes": [
                  "Origin"
                ],
                "inferenceType": "implicit",
                "isAttrAmbiguous": false,
                "isValueAmbiguous": false,
                "meta": {
                  "value_ambiguity_type": null
                }
              }
            ]
          },
          "followUpQuery": false,
          "contextObj": null
        }
      },
      {
        "queryId": 53,
        "query": "Stacked bar chart to show number of cylinders on X Axis and count of cars  segregated country wise on Y Axis ",
        "output": {
          "status": "SUCCESS",
          "debug": {
            "execution_durations": {
              "clean_query": 0.024398088455200195,
              "extract_attributes": 1.2413268089294434,
              "extract_vis_type": 0.0000820159912109375,
              "extract_tasks": 1.3072710037231445,
              "get_vis_list": 0.0002887248992919922,
              "total": 2.573366641998291
            }
          },
          "query_raw": "Stacked bar chart to show number of cylinders on X Axis and count of cars  segregated country wise on Y Axis ",
          "query": "stacked bar chart to show number of cylinders on x axis and count of cars segregated country wise on y axis",
          "dataset": "https://raw.githubusercontent.com/nl4dv/nl4dv/master/examples/assets/data/cars-w-year.csv",
          "alias": "https://raw.githubusercontent.com/nl4dv/nl4dv/master/examples/assets/aliases/cars-w-year.json",
          "visList": [
            {
              "score": 5.3,
              "scoreObj": {
                "by_attributes": 1.8,
                "by_task": 0.5,
                "by_vis": 1
              },
              "confidenceObj": {
                "Cylinders": 1,
                "Origin": 1
              },
              "attributes": [
                "Cylinders",
                "Origin"
              ],
              "queryPhrase": "bar chart",
              "visType": "barchart",
              "tasks": [
                "derived_value"
              ],
              "inferenceType": "explicit",
              "vlSpec": {
                "$schema": "https://vega.github.io/schema/vega-lite/v4.json",
                "mark": {
                  "type": "bar",
                  "tooltip": true
                },
                "encoding": {
                  "y": {
                    "field": "Cylinders",
                    "type": "quantitative",
                    "aggregate": "mean",
                    "axis": {
                      "format": "s"
                    }
                  },
                  "x": {
                    "field": "Origin",
                    "type": "nominal",
                    "aggregate": null
                  }
                },
                "transform": [],
                "data": {
                  "url": "https://raw.githubusercontent.com/nl4dv/nl4dv/master/examples/assets/data/cars-w-year.csv",
                  "format": {
                    "type": "csv"
                  }
                }
              }
            }
          ],
          "attributeMap": {
            "Cylinders": {
              "name": "Cylinders",
              "queryPhrase": [
                "cylinders"
              ],
              "inferenceType": "explicit",
              "matchScore": 1,
              "metric": [
                "attribute_exact_match"
              ],
              "isLabel": false,
              "encode": true,
              "isAmbiguous": false,
              "ambiguity": [],
              "meta": {
                "score": 100,
                "threshold": 85,
                "alias": null,
                "ambiguity": {},
                "confidence": 100
              }
            },
            "Origin": {
              "name": "Origin",
              "queryPhrase": [
                "country"
              ],
              "inferenceType": "explicit",
              "matchScore": 0.8,
              "metric": "attribute_alias_exact_match",
              "isLabel": false,
              "encode": true,
              "isAmbiguous": false,
              "ambiguity": [],
              "meta": {
                "score": 100,
                "threshold": 85,
                "alias": "country",
                "ambiguity": {},
                "confidence": 100
              }
            }
          },
          "taskMap": {
            "derived_value": [
              {
                "task": "derived_value",
                "queryPhrase": [],
                "operator": "AVG",
                "values": null,
                "matchScore": 0.5,
                "attributes": [
                  "Cylinders"
                ],
                "inferenceType": "implicit",
                "isAttrAmbiguous": false,
                "isValueAmbiguous": false,
                "meta": {
                  "value_ambiguity_type": null
                }
              }
            ]
          },
          "followUpQuery": false,
          "contextObj": null
        }
      },
      {
        "queryId": 54,
        "query": "plot displacement by mpg', 'color by origin",
        "output": {
          "status": "SUCCESS",
          "debug": {
            "execution_durations": {
              "clean_query": 0.002290010452270508,
              "extract_attributes": 0.1282520294189453,
              "extract_vis_type": 0.0000209808349609375,
              "extract_tasks": 1.1043708324432373,
              "get_vis_list": 0.00037026405334472656,
              "total": 1.2353041172027588
            }
          },
          "query_raw": "plot displacement by mpg', 'color by origin",
          "query": "plot displacement by mpg ' , 'color by origin",
          "dataset": "https://raw.githubusercontent.com/nl4dv/nl4dv/master/examples/assets/data/cars-w-year.csv",
          "alias": "https://raw.githubusercontent.com/nl4dv/nl4dv/master/examples/assets/aliases/cars-w-year.json",
          "visList": [
            {
              "score": 6.5,
              "scoreObj": {
                "by_attributes": 3,
                "by_task": 0.5,
                "by_vis": 0
              },
              "confidenceObj": {
                "MPG": 1,
                "Displacement": 1,
                "Origin": 1
              },
              "attributes": [
                "MPG",
                "Displacement",
                "Origin"
              ],
              "queryPhrase": null,
              "visType": null,
              "tasks": [
                "correlation"
              ],
              "inferenceType": "implicit",
              "vlSpec": {
                "$schema": "https://vega.github.io/schema/vega-lite/v4.json",
                "mark": {
                  "type": "point",
                  "tooltip": true
                },
                "encoding": {
                  "x": {
                    "field": "MPG",
                    "type": "quantitative",
                    "aggregate": null,
                    "axis": {
                      "format": "s"
                    }
                  },
                  "y": {
                    "field": "Displacement",
                    "type": "quantitative",
                    "aggregate": null,
                    "axis": {
                      "format": "s"
                    }
                  },
                  "color": {
                    "field": "Origin",
                    "type": "nominal",
                    "aggregate": null
                  },
                  "tooltip": {
                    "field": "Model"
                  }
                },
                "transform": [],
                "data": {
                  "url": "https://raw.githubusercontent.com/nl4dv/nl4dv/master/examples/assets/data/cars-w-year.csv",
                  "format": {
                    "type": "csv"
                  }
                }
              }
            },
            {
              "score": 6.5,
              "scoreObj": {
                "by_attributes": 3,
                "by_task": 0.5,
                "by_vis": 0
              },
              "confidenceObj": {
                "MPG": 1,
                "Displacement": 1,
                "Origin": 1
              },
              "attributes": [
                "MPG",
                "Displacement",
                "Origin"
              ],
              "queryPhrase": null,
              "visType": null,
              "tasks": [
                "correlation"
              ],
              "inferenceType": "implicit",
              "vlSpec": {
                "$schema": "https://vega.github.io/schema/vega-lite/v4.json",
                "mark": {
                  "type": "point",
                  "tooltip": true
                },
                "encoding": {
                  "x": {
                    "field": "MPG",
                    "type": "quantitative",
                    "aggregate": null,
                    "axis": {
                      "format": "s"
                    }
                  },
                  "y": {
                    "field": "Displacement",
                    "type": "quantitative",
                    "aggregate": null,
                    "axis": {
                      "format": "s"
                    }
                  },
                  "column": {
                    "field": "Origin",
                    "type": "nominal",
                    "aggregate": null
                  },
                  "color": {
                    "field": "Origin",
                    "type": "nominal",
                    "aggregate": null
                  },
                  "tooltip": {
                    "field": "Model"
                  }
                },
                "transform": [],
                "data": {
                  "url": "https://raw.githubusercontent.com/nl4dv/nl4dv/master/examples/assets/data/cars-w-year.csv",
                  "format": {
                    "type": "csv"
                  }
                }
              }
            }
          ],
          "attributeMap": {
            "MPG": {
              "name": "MPG",
              "queryPhrase": [
                "mpg"
              ],
              "inferenceType": "explicit",
              "matchScore": 1,
              "metric": [
                "attribute_exact_match"
              ],
              "isLabel": false,
              "encode": true,
              "isAmbiguous": false,
              "ambiguity": [],
              "meta": {
                "score": 100,
                "threshold": 85,
                "alias": null,
                "ambiguity": {},
                "confidence": 100
              }
            },
            "Displacement": {
              "name": "Displacement",
              "queryPhrase": [
                "displacement"
              ],
              "inferenceType": "explicit",
              "matchScore": 1,
              "metric": [
                "attribute_exact_match"
              ],
              "isLabel": false,
              "encode": true,
              "isAmbiguous": false,
              "ambiguity": [],
              "meta": {
                "score": 100,
                "threshold": 85,
                "alias": null,
                "ambiguity": {},
                "confidence": 100
              }
            },
            "Origin": {
              "name": "Origin",
              "queryPhrase": [
                "origin"
              ],
              "inferenceType": "explicit",
              "matchScore": 1,
              "metric": [
                "attribute_exact_match"
              ],
              "isLabel": false,
              "encode": true,
              "isAmbiguous": false,
              "ambiguity": [],
              "meta": {
                "score": 100,
                "threshold": 85,
                "alias": null,
                "ambiguity": {},
                "confidence": 100
              }
            }
          },
          "taskMap": {
            "correlation": [
              {
                "task": "correlation",
                "queryPhrase": [],
                "operator": null,
                "values": null,
                "matchScore": 0.5,
                "attributes": [
                  "MPG",
                  "Displacement"
                ],
                "inferenceType": "implicit",
                "isAttrAmbiguous": false,
                "isValueAmbiguous": false,
                "meta": {
                  "value_ambiguity_type": null
                }
              }
            ]
          },
          "followUpQuery": false,
          "contextObj": null
        }
      },
      {
        "queryId": 55,
        "query": "Bar graph to show number of cylinders on X Axis and Average MPG on Y Axis",
        "output": {
          "status": "SUCCESS",
          "debug": {
            "execution_durations": {
              "clean_query": 0.011500120162963867,
              "extract_attributes": 0.6588349342346191,
              "extract_vis_type": 0.00004506111145019531,
              "extract_tasks": 1.2546417713165283,
              "get_vis_list": 0.00019693374633789062,
              "total": 1.9252188205718994
            }
          },
          "query_raw": "Bar graph to show number of cylinders on X Axis and Average MPG on Y Axis",
          "query": "bar graph to show number of cylinders on x axis and average mpg on y axis",
          "dataset": "https://raw.githubusercontent.com/nl4dv/nl4dv/master/examples/assets/data/cars-w-year.csv",
          "alias": "https://raw.githubusercontent.com/nl4dv/nl4dv/master/examples/assets/aliases/cars-w-year.json",
          "visList": [
            {
              "score": 6,
              "scoreObj": {
                "by_attributes": 2,
                "by_task": 1,
                "by_vis": 1
              },
              "confidenceObj": {
                "MPG": 1,
                "Cylinders": 1
              },
              "attributes": [
                "MPG",
                "Cylinders"
              ],
              "queryPhrase": "bar graph",
              "visType": "barchart",
              "tasks": [
                "derived_value"
              ],
              "inferenceType": "explicit",
              "vlSpec": {
                "$schema": "https://vega.github.io/schema/vega-lite/v4.json",
                "mark": {
                  "type": "bar",
                  "tooltip": true
                },
                "encoding": {
                  "x": {
                    "field": "MPG",
                    "type": "quantitative",
                    "aggregate": "mean",
                    "axis": {
                      "format": "s"
                    }
                  },
                  "y": {
                    "field": "Cylinders",
                    "type": "quantitative",
                    "aggregate": null,
                    "axis": {
                      "format": "s"
                    }
                  }
                },
                "transform": [],
                "data": {
                  "url": "https://raw.githubusercontent.com/nl4dv/nl4dv/master/examples/assets/data/cars-w-year.csv",
                  "format": {
                    "type": "csv"
                  }
                }
              }
            }
          ],
          "attributeMap": {
            "MPG": {
              "name": "MPG",
              "queryPhrase": [
                "mpg"
              ],
              "inferenceType": "explicit",
              "matchScore": 1,
              "metric": [
                "attribute_exact_match"
              ],
              "isLabel": false,
              "encode": true,
              "isAmbiguous": false,
              "ambiguity": [],
              "meta": {
                "score": 100,
                "threshold": 85,
                "alias": null,
                "ambiguity": {},
                "confidence": 100
              }
            },
            "Cylinders": {
              "name": "Cylinders",
              "queryPhrase": [
                "cylinders"
              ],
              "inferenceType": "explicit",
              "matchScore": 1,
              "metric": [
                "attribute_exact_match"
              ],
              "isLabel": false,
              "encode": true,
              "isAmbiguous": false,
              "ambiguity": [],
              "meta": {
                "score": 100,
                "threshold": 85,
                "alias": null,
                "ambiguity": {},
                "confidence": 100
              }
            }
          },
          "taskMap": {
            "derived_value": [
              {
                "task": "derived_value",
                "queryPhrase": "average",
                "operator": "AVG",
                "values": [],
                "matchScore": 1,
                "attributes": [
                  "MPG"
                ],
                "inferenceType": "explicit",
                "isAttrAmbiguous": false,
                "isValueAmbiguous": false,
                "meta": {
                  "value_ambiguity_type": null
                }
              }
            ]
          },
          "followUpQuery": false,
          "contextObj": null
        }
      },
      {
        "queryId": 56,
        "query": "Scatter plot to show horsepower on X axis and Acceleration on Y Axis",
        "output": {
          "status": "SUCCESS",
          "debug": {
            "execution_durations": {
              "clean_query": 0.007035255432128906,
              "extract_attributes": 0.40343594551086426,
              "extract_vis_type": 0.00003409385681152344,
              "extract_tasks": 1.167968988418579,
              "get_vis_list": 0.00018095970153808594,
              "total": 1.5786552429199219
            }
          },
          "query_raw": "Scatter plot to show horsepower on X axis and Acceleration on Y Axis",
          "query": "scatter plot to show horsepower on x axis and acceleration on y axis",
          "dataset": "https://raw.githubusercontent.com/nl4dv/nl4dv/master/examples/assets/data/cars-w-year.csv",
          "alias": "https://raw.githubusercontent.com/nl4dv/nl4dv/master/examples/assets/aliases/cars-w-year.json",
          "visList": [
            {
              "score": 5.5,
              "scoreObj": {
                "by_attributes": 2,
                "by_task": 0.5,
                "by_vis": 1
              },
              "confidenceObj": {
                "Horsepower": 1,
                "Acceleration": 1
              },
              "attributes": [
                "Horsepower",
                "Acceleration"
              ],
              "queryPhrase": "scatter plot",
              "visType": "scatterplot",
              "tasks": [
                "correlation"
              ],
              "inferenceType": "explicit",
              "vlSpec": {
                "$schema": "https://vega.github.io/schema/vega-lite/v4.json",
                "mark": {
                  "type": "point",
                  "tooltip": true
                },
                "encoding": {
                  "x": {
                    "field": "Horsepower",
                    "type": "quantitative",
                    "aggregate": null,
                    "axis": {
                      "format": "s"
                    }
                  },
                  "y": {
                    "field": "Acceleration",
                    "type": "quantitative",
                    "aggregate": null,
                    "axis": {
                      "format": "s"
                    }
                  },
                  "tooltip": {
                    "field": "Model"
                  }
                },
                "transform": [],
                "data": {
                  "url": "https://raw.githubusercontent.com/nl4dv/nl4dv/master/examples/assets/data/cars-w-year.csv",
                  "format": {
                    "type": "csv"
                  }
                }
              }
            }
          ],
          "attributeMap": {
            "Horsepower": {
              "name": "Horsepower",
              "queryPhrase": [
                "horsepower"
              ],
              "inferenceType": "explicit",
              "matchScore": 1,
              "metric": [
                "attribute_exact_match"
              ],
              "isLabel": false,
              "encode": true,
              "isAmbiguous": false,
              "ambiguity": [],
              "meta": {
                "score": 100,
                "threshold": 85,
                "alias": null,
                "ambiguity": {},
                "confidence": 100
              }
            },
            "Acceleration": {
              "name": "Acceleration",
              "queryPhrase": [
                "acceleration"
              ],
              "inferenceType": "explicit",
              "matchScore": 1,
              "metric": [
                "attribute_exact_match"
              ],
              "isLabel": false,
              "encode": true,
              "isAmbiguous": false,
              "ambiguity": [],
              "meta": {
                "score": 100,
                "threshold": 85,
                "alias": null,
                "ambiguity": {},
                "confidence": 100
              }
            }
          },
          "taskMap": {
            "correlation": [
              {
                "task": "correlation",
                "queryPhrase": [],
                "operator": null,
                "values": null,
                "matchScore": 0.5,
                "attributes": [
                  "Horsepower",
                  "Acceleration"
                ],
                "inferenceType": "implicit",
                "isAttrAmbiguous": false,
                "isValueAmbiguous": false,
                "meta": {
                  "value_ambiguity_type": null
                }
              }
            ]
          },
          "followUpQuery": false,
          "contextObj": null
        }
      },
      {
        "queryId": 57,
        "query": "Plot average MPG by number of cylinders",
        "output": {
          "status": "SUCCESS",
          "debug": {
            "execution_durations": {
              "clean_query": 0.0031261444091796875,
              "extract_attributes": 0.22193288803100586,
              "extract_vis_type": 0.000023126602172851562,
              "extract_tasks": 1.0438950061798096,
              "get_vis_list": 0.0002067089080810547,
              "total": 1.269183874130249
            }
          },
          "query_raw": "Plot average MPG by number of cylinders",
          "query": "plot average mpg by number of cylinders",
          "dataset": "https://raw.githubusercontent.com/nl4dv/nl4dv/master/examples/assets/data/cars-w-year.csv",
          "alias": "https://raw.githubusercontent.com/nl4dv/nl4dv/master/examples/assets/aliases/cars-w-year.json",
          "visList": [
            {
              "score": 5,
              "scoreObj": {
                "by_attributes": 2,
                "by_task": 1,
                "by_vis": 0
              },
              "confidenceObj": {
                "MPG": 1,
                "Cylinders": 1
              },
              "attributes": [
                "MPG",
                "Cylinders"
              ],
              "queryPhrase": null,
              "visType": null,
              "tasks": [
                "derived_value"
              ],
              "inferenceType": "implicit",
              "vlSpec": {
                "$schema": "https://vega.github.io/schema/vega-lite/v4.json",
                "mark": {
                  "type": "point",
                  "tooltip": true
                },
                "encoding": {
                  "x": {
                    "field": "MPG",
                    "type": "quantitative",
                    "aggregate": "mean",
                    "axis": {
                      "format": "s"
                    }
                  },
                  "y": {
                    "field": "Cylinders",
                    "type": "quantitative",
                    "aggregate": null,
                    "axis": {
                      "format": "s"
                    }
                  }
                },
                "transform": [],
                "data": {
                  "url": "https://raw.githubusercontent.com/nl4dv/nl4dv/master/examples/assets/data/cars-w-year.csv",
                  "format": {
                    "type": "csv"
                  }
                }
              }
            }
          ],
          "attributeMap": {
            "MPG": {
              "name": "MPG",
              "queryPhrase": [
                "mpg"
              ],
              "inferenceType": "explicit",
              "matchScore": 1,
              "metric": [
                "attribute_exact_match"
              ],
              "isLabel": false,
              "encode": true,
              "isAmbiguous": false,
              "ambiguity": [],
              "meta": {
                "score": 100,
                "threshold": 85,
                "alias": null,
                "ambiguity": {},
                "confidence": 100
              }
            },
            "Cylinders": {
              "name": "Cylinders",
              "queryPhrase": [
                "cylinders"
              ],
              "inferenceType": "explicit",
              "matchScore": 1,
              "metric": [
                "attribute_exact_match"
              ],
              "isLabel": false,
              "encode": true,
              "isAmbiguous": false,
              "ambiguity": [],
              "meta": {
                "score": 100,
                "threshold": 85,
                "alias": null,
                "ambiguity": {},
                "confidence": 100
              }
            }
          },
          "taskMap": {
            "derived_value": [
              {
                "task": "derived_value",
                "queryPhrase": "average",
                "operator": "AVG",
                "values": [],
                "matchScore": 1,
                "attributes": [
                  "MPG"
                ],
                "inferenceType": "explicit",
                "isAttrAmbiguous": false,
                "isValueAmbiguous": false,
                "meta": {
                  "value_ambiguity_type": null
                }
              }
            ]
          },
          "followUpQuery": false,
          "contextObj": null
        }
      },
      {
        "queryId": 58,
        "query": "create a stacked bar chart of the count of models by cylinder, group by origin",
        "output": {
          "status": "SUCCESS",
          "debug": {
            "execution_durations": {
              "clean_query": 0.010306119918823242,
              "extract_attributes": 0.4857962131500244,
              "extract_vis_type": 0.00003695487976074219,
              "extract_tasks": 1.2264928817749023,
              "get_vis_list": 0.0002601146697998047,
              "total": 1.7228922843933105
            }
          },
          "query_raw": "create a stacked bar chart of the count of models by cylinder, group by origin",
          "query": "create a stacked bar chart of the count of models by cylinder , group by origin",
          "dataset": "https://raw.githubusercontent.com/nl4dv/nl4dv/master/examples/assets/data/cars-w-year.csv",
          "alias": "https://raw.githubusercontent.com/nl4dv/nl4dv/master/examples/assets/aliases/cars-w-year.json",
          "visList": [
            {
              "score": 5.5,
              "scoreObj": {
                "by_attributes": 2,
                "by_task": 0.5,
                "by_vis": 1
              },
              "confidenceObj": {
                "Cylinders": 1,
                "Origin": 1
              },
              "attributes": [
                "Cylinders",
                "Origin"
              ],
              "queryPhrase": "bar chart",
              "visType": "barchart",
              "tasks": [
                "derived_value"
              ],
              "inferenceType": "explicit",
              "vlSpec": {
                "$schema": "https://vega.github.io/schema/vega-lite/v4.json",
                "mark": {
                  "type": "bar",
                  "tooltip": true
                },
                "encoding": {
                  "y": {
                    "field": "Cylinders",
                    "type": "quantitative",
                    "aggregate": "mean",
                    "axis": {
                      "format": "s"
                    }
                  },
                  "x": {
                    "field": "Origin",
                    "type": "nominal",
                    "aggregate": null
                  }
                },
                "transform": [],
                "data": {
                  "url": "https://raw.githubusercontent.com/nl4dv/nl4dv/master/examples/assets/data/cars-w-year.csv",
                  "format": {
                    "type": "csv"
                  }
                }
              }
            }
          ],
          "attributeMap": {
            "Model": {
              "name": "Model",
              "queryPhrase": [
                "models"
              ],
              "inferenceType": "explicit",
              "matchScore": 1,
              "metric": [
                "attribute_exact_match"
              ],
              "isLabel": true,
              "encode": false,
              "isAmbiguous": false,
              "ambiguity": [],
              "meta": {
                "score": 100,
                "threshold": 85,
                "alias": null,
                "ambiguity": {},
                "confidence": 100
              }
            },
            "Cylinders": {
              "name": "Cylinders",
              "queryPhrase": [
                "cylinder"
              ],
              "inferenceType": "explicit",
              "matchScore": 1,
              "metric": [
                "attribute_exact_match"
              ],
              "isLabel": false,
              "encode": true,
              "isAmbiguous": false,
              "ambiguity": [],
              "meta": {
                "score": 100,
                "threshold": 85,
                "alias": null,
                "ambiguity": {},
                "confidence": 100
              }
            },
            "Origin": {
              "name": "Origin",
              "queryPhrase": [
                "origin"
              ],
              "inferenceType": "explicit",
              "matchScore": 1,
              "metric": [
                "attribute_exact_match"
              ],
              "isLabel": false,
              "encode": true,
              "isAmbiguous": false,
              "ambiguity": [],
              "meta": {
                "score": 100,
                "threshold": 85,
                "alias": null,
                "ambiguity": {},
                "confidence": 100
              }
            }
          },
          "taskMap": {
            "derived_value": [
              {
                "task": "derived_value",
                "queryPhrase": [],
                "operator": "AVG",
                "values": null,
                "matchScore": 0.5,
                "attributes": [
                  "Cylinders"
                ],
                "inferenceType": "implicit",
                "isAttrAmbiguous": false,
                "isValueAmbiguous": false,
                "meta": {
                  "value_ambiguity_type": null
                }
              }
            ]
          },
          "followUpQuery": false,
          "contextObj": null
        }
      },
      {
        "queryId": 59,
        "query": "create a line graph of average horsepower by year grouped by origin",
        "output": {
          "status": "SUCCESS",
          "debug": {
            "execution_durations": {
              "clean_query": 0.0075190067291259766,
              "extract_attributes": 0.46459317207336426,
              "extract_vis_type": 0.00003600120544433594,
              "extract_tasks": 1.1428301334381104,
              "get_vis_list": 0.0006098747253417969,
              "total": 1.6155881881713867
            }
          },
          "query_raw": "create a line graph of average horsepower by year grouped by origin",
          "query": "create a line graph of average horsepower by year grouped by origin",
          "dataset": "https://raw.githubusercontent.com/nl4dv/nl4dv/master/examples/assets/data/cars-w-year.csv",
          "alias": "https://raw.githubusercontent.com/nl4dv/nl4dv/master/examples/assets/aliases/cars-w-year.json",
          "visList": [
            {
              "score": 8,
              "scoreObj": {
                "by_attributes": 3,
                "by_task": 1,
                "by_vis": 1
              },
              "confidenceObj": {
                "Horsepower": 1,
                "Origin": 1,
                "Year": 1
              },
              "attributes": [
                "Horsepower",
                "Origin",
                "Year"
              ],
              "queryPhrase": "line graph",
              "visType": "linechart",
              "tasks": [
                "derived_value"
              ],
              "inferenceType": "explicit",
              "vlSpec": {
                "$schema": "https://vega.github.io/schema/vega-lite/v4.json",
                "mark": {
                  "type": "line",
                  "tooltip": true
                },
                "encoding": {
                  "y": {
                    "field": "Horsepower",
                    "type": "quantitative",
                    "aggregate": "mean",
                    "axis": {
                      "format": "s"
                    }
                  },
                  "color": {
                    "field": "Origin",
                    "type": "nominal",
                    "aggregate": null
                  },
                  "x": {
                    "field": "Year",
                    "type": "temporal",
                    "aggregate": null
                  }
                },
                "transform": [],
                "data": {
                  "url": "https://raw.githubusercontent.com/nl4dv/nl4dv/master/examples/assets/data/cars-w-year.csv",
                  "format": {
                    "type": "csv"
                  }
                }
              }
            },
            {
              "score": 8,
              "scoreObj": {
                "by_attributes": 3,
                "by_task": 1,
                "by_vis": 1
              },
              "confidenceObj": {
                "Horsepower": 1,
                "Origin": 1,
                "Year": 1
              },
              "attributes": [
                "Horsepower",
                "Origin",
                "Year"
              ],
              "queryPhrase": "line graph",
              "visType": "linechart",
              "tasks": [
                "derived_value"
              ],
              "inferenceType": "explicit",
              "vlSpec": {
                "$schema": "https://vega.github.io/schema/vega-lite/v4.json",
                "mark": {
                  "type": "line",
                  "tooltip": true
                },
                "encoding": {
                  "y": {
                    "field": "Horsepower",
                    "type": "quantitative",
                    "aggregate": "mean",
                    "axis": {
                      "format": "s"
                    }
                  },
                  "column": {
                    "field": "Origin",
                    "type": "nominal",
                    "aggregate": null
                  },
                  "x": {
                    "field": "Year",
                    "type": "temporal",
                    "aggregate": null
                  },
                  "color": {
                    "field": "Origin",
                    "type": "nominal",
                    "aggregate": null
                  }
                },
                "transform": [],
                "data": {
                  "url": "https://raw.githubusercontent.com/nl4dv/nl4dv/master/examples/assets/data/cars-w-year.csv",
                  "format": {
                    "type": "csv"
                  }
                }
              }
            }
          ],
          "attributeMap": {
            "Horsepower": {
              "name": "Horsepower",
              "queryPhrase": [
                "horsepower"
              ],
              "inferenceType": "explicit",
              "matchScore": 1,
              "metric": [
                "attribute_exact_match"
              ],
              "isLabel": false,
              "encode": true,
              "isAmbiguous": false,
              "ambiguity": [],
              "meta": {
                "score": 100,
                "threshold": 85,
                "alias": null,
                "ambiguity": {},
                "confidence": 100
              }
            },
            "Year": {
              "name": "Year",
              "queryPhrase": [
                "year"
              ],
              "inferenceType": "explicit",
              "matchScore": 1,
              "metric": [
                "attribute_exact_match"
              ],
              "isLabel": false,
              "encode": true,
              "isAmbiguous": false,
              "ambiguity": [],
              "meta": {
                "score": 100,
                "threshold": 85,
                "alias": null,
                "ambiguity": {},
                "confidence": 100
              }
            },
            "Origin": {
              "name": "Origin",
              "queryPhrase": [
                "origin"
              ],
              "inferenceType": "explicit",
              "matchScore": 1,
              "metric": [
                "attribute_exact_match"
              ],
              "isLabel": false,
              "encode": true,
              "isAmbiguous": false,
              "ambiguity": [],
              "meta": {
                "score": 100,
                "threshold": 85,
                "alias": null,
                "ambiguity": {},
                "confidence": 100
              }
            }
          },
          "taskMap": {
            "derived_value": [
              {
                "task": "derived_value",
                "queryPhrase": "average",
                "operator": "AVG",
                "values": [],
                "matchScore": 1,
                "attributes": [
                  "Horsepower"
                ],
                "inferenceType": "explicit",
                "isAttrAmbiguous": false,
                "isValueAmbiguous": false,
                "meta": {
                  "value_ambiguity_type": null
                }
              }
            ]
          },
          "followUpQuery": false,
          "contextObj": null
        }
      },
      {
        "queryId": 60,
        "query": "show how horsepower varies each year by origin",
        "output": {
          "status": "SUCCESS",
          "debug": {
            "execution_durations": {
              "clean_query": 0.003511190414428711,
              "extract_attributes": 0.18811702728271484,
              "extract_vis_type": 0.000029087066650390625,
              "extract_tasks": 1.0781738758087158,
              "get_vis_list": 0.0006449222564697266,
              "total": 1.2704761028289795
            }
          },
          "query_raw": "show how horsepower varies each year by origin",
          "query": "show how horsepower varies each year by origin",
          "dataset": "https://raw.githubusercontent.com/nl4dv/nl4dv/master/examples/assets/data/cars-w-year.csv",
          "alias": "https://raw.githubusercontent.com/nl4dv/nl4dv/master/examples/assets/aliases/cars-w-year.json",
          "visList": [
            {
              "score": 6,
              "scoreObj": {
                "by_attributes": 3,
                "by_task": 0,
                "by_vis": 0
              },
              "confidenceObj": {
                "Horsepower": 1,
                "Origin": 1,
                "Year": 1
              },
              "attributes": [
                "Horsepower",
                "Origin",
                "Year"
              ],
              "queryPhrase": null,
              "visType": null,
              "tasks": [
                "trend"
              ],
              "inferenceType": "implicit",
              "vlSpec": {
                "$schema": "https://vega.github.io/schema/vega-lite/v4.json",
                "mark": {
                  "type": "line",
                  "tooltip": true
                },
                "encoding": {
                  "y": {
                    "field": "Horsepower",
                    "type": "quantitative",
                    "aggregate": "mean",
                    "axis": {
                      "format": "s"
                    }
                  },
                  "color": {
                    "field": "Origin",
                    "type": "nominal",
                    "aggregate": null
                  },
                  "x": {
                    "field": "Year",
                    "type": "temporal",
                    "aggregate": null
                  }
                },
                "transform": [],
                "data": {
                  "url": "https://raw.githubusercontent.com/nl4dv/nl4dv/master/examples/assets/data/cars-w-year.csv",
                  "format": {
                    "type": "csv"
                  }
                }
              }
            },
            {
              "score": 6,
              "scoreObj": {
                "by_attributes": 3,
                "by_task": 0,
                "by_vis": 0
              },
              "confidenceObj": {
                "Horsepower": 1,
                "Origin": 1,
                "Year": 1
              },
              "attributes": [
                "Horsepower",
                "Origin",
                "Year"
              ],
              "queryPhrase": null,
              "visType": null,
              "tasks": [
                "trend"
              ],
              "inferenceType": "implicit",
              "vlSpec": {
                "$schema": "https://vega.github.io/schema/vega-lite/v4.json",
                "mark": {
                  "type": "line",
                  "tooltip": true
                },
                "encoding": {
                  "y": {
                    "field": "Horsepower",
                    "type": "quantitative",
                    "aggregate": "mean",
                    "axis": {
                      "format": "s"
                    }
                  },
                  "column": {
                    "field": "Origin",
                    "type": "nominal",
                    "aggregate": null
                  },
                  "x": {
                    "field": "Year",
                    "type": "temporal",
                    "aggregate": null
                  },
                  "color": {
                    "field": "Origin",
                    "type": "nominal",
                    "aggregate": null
                  }
                },
                "transform": [],
                "data": {
                  "url": "https://raw.githubusercontent.com/nl4dv/nl4dv/master/examples/assets/data/cars-w-year.csv",
                  "format": {
                    "type": "csv"
                  }
                }
              }
            },
            {
              "score": 6,
              "scoreObj": {
                "by_attributes": 3,
                "by_task": 0,
                "by_vis": 0
              },
              "confidenceObj": {
                "Horsepower": 1,
                "Origin": 1,
                "Year": 1
              },
              "attributes": [
                "Horsepower",
                "Origin",
                "Year"
              ],
              "queryPhrase": null,
              "visType": null,
              "tasks": [
                "trend"
              ],
              "inferenceType": "implicit",
              "vlSpec": {
                "$schema": "https://vega.github.io/schema/vega-lite/v4.json",
                "mark": {
                  "type": "bar",
                  "tooltip": true
                },
                "encoding": {
                  "y": {
                    "field": "Horsepower",
                    "type": "quantitative",
                    "aggregate": "mean",
                    "axis": {
                      "format": "s"
                    }
                  },
                  "x": {
                    "field": "Origin",
                    "type": "nominal",
                    "aggregate": null
                  },
                  "column": {
                    "field": "Year",
                    "type": "temporal",
                    "aggregate": null
                  },
                  "color": {
                    "field": "Origin",
                    "type": "nominal",
                    "aggregate": null
                  }
                },
                "transform": [],
                "data": {
                  "url": "https://raw.githubusercontent.com/nl4dv/nl4dv/master/examples/assets/data/cars-w-year.csv",
                  "format": {
                    "type": "csv"
                  }
                }
              }
            },
            {
              "score": 6,
              "scoreObj": {
                "by_attributes": 3,
                "by_task": 0,
                "by_vis": 0
              },
              "confidenceObj": {
                "Horsepower": 1,
                "Origin": 1,
                "Year": 1
              },
              "attributes": [
                "Horsepower",
                "Origin",
                "Year"
              ],
              "queryPhrase": null,
              "visType": null,
              "tasks": [
                "trend"
              ],
              "inferenceType": "implicit",
              "vlSpec": {
                "$schema": "https://vega.github.io/schema/vega-lite/v4.json",
                "mark": {
                  "type": "tick",
                  "tooltip": true
                },
                "encoding": {
                  "y": {
                    "field": "Horsepower",
                    "type": "quantitative",
                    "aggregate": null,
                    "axis": {
                      "format": "s"
                    }
                  },
                  "color": {
                    "field": "Origin",
                    "type": "nominal",
                    "aggregate": null
                  },
                  "x": {
                    "field": "Year",
                    "type": "temporal",
                    "aggregate": null
                  },
                  "tooltip": {
                    "field": "Model"
                  }
                },
                "transform": [],
                "data": {
                  "url": "https://raw.githubusercontent.com/nl4dv/nl4dv/master/examples/assets/data/cars-w-year.csv",
                  "format": {
                    "type": "csv"
                  }
                }
              }
            },
            {
              "score": 6,
              "scoreObj": {
                "by_attributes": 3,
                "by_task": 0,
                "by_vis": 0
              },
              "confidenceObj": {
                "Horsepower": 1,
                "Origin": 1,
                "Year": 1
              },
              "attributes": [
                "Horsepower",
                "Origin",
                "Year"
              ],
              "queryPhrase": null,
              "visType": null,
              "tasks": [
                "trend"
              ],
              "inferenceType": "implicit",
              "vlSpec": {
                "$schema": "https://vega.github.io/schema/vega-lite/v4.json",
                "mark": {
                  "type": "tick",
                  "tooltip": true
                },
                "encoding": {
                  "y": {
                    "field": "Horsepower",
                    "type": "quantitative",
                    "aggregate": null,
                    "axis": {
                      "format": "s"
                    }
                  },
                  "column": {
                    "field": "Origin",
                    "type": "nominal",
                    "aggregate": null
                  },
                  "x": {
                    "field": "Year",
                    "type": "temporal",
                    "aggregate": null
                  },
                  "color": {
                    "field": "Origin",
                    "type": "nominal",
                    "aggregate": null
                  },
                  "tooltip": {
                    "field": "Model"
                  }
                },
                "transform": [],
                "data": {
                  "url": "https://raw.githubusercontent.com/nl4dv/nl4dv/master/examples/assets/data/cars-w-year.csv",
                  "format": {
                    "type": "csv"
                  }
                }
              }
            },
            {
              "score": 6,
              "scoreObj": {
                "by_attributes": 3,
                "by_task": 0,
                "by_vis": 0
              },
              "confidenceObj": {
                "Horsepower": 1,
                "Origin": 1,
                "Year": 1
              },
              "attributes": [
                "Horsepower",
                "Origin",
                "Year"
              ],
              "queryPhrase": null,
              "visType": null,
              "tasks": [
                "trend"
              ],
              "inferenceType": "implicit",
              "vlSpec": {
                "$schema": "https://vega.github.io/schema/vega-lite/v4.json",
                "mark": {
                  "type": "tick",
                  "tooltip": true
                },
                "encoding": {
                  "y": {
                    "field": "Horsepower",
                    "type": "quantitative",
                    "aggregate": null,
                    "axis": {
                      "format": "s"
                    }
                  },
                  "x": {
                    "field": "Origin",
                    "type": "nominal",
                    "aggregate": null
                  },
                  "column": {
                    "field": "Year",
                    "type": "temporal",
                    "aggregate": null
                  },
                  "color": {
                    "field": "Origin",
                    "type": "nominal",
                    "aggregate": null
                  },
                  "tooltip": {
                    "field": "Model"
                  }
                },
                "transform": [],
                "data": {
                  "url": "https://raw.githubusercontent.com/nl4dv/nl4dv/master/examples/assets/data/cars-w-year.csv",
                  "format": {
                    "type": "csv"
                  }
                }
              }
            }
          ],
          "attributeMap": {
            "Horsepower": {
              "name": "Horsepower",
              "queryPhrase": [
                "horsepower"
              ],
              "inferenceType": "explicit",
              "matchScore": 1,
              "metric": [
                "attribute_exact_match"
              ],
              "isLabel": false,
              "encode": true,
              "isAmbiguous": false,
              "ambiguity": [],
              "meta": {
                "score": 100,
                "threshold": 85,
                "alias": null,
                "ambiguity": {},
                "confidence": 100
              }
            },
            "Year": {
              "name": "Year",
              "queryPhrase": [
                "year"
              ],
              "inferenceType": "explicit",
              "matchScore": 1,
              "metric": [
                "attribute_exact_match"
              ],
              "isLabel": false,
              "encode": true,
              "isAmbiguous": false,
              "ambiguity": [],
              "meta": {
                "score": 100,
                "threshold": 85,
                "alias": null,
                "ambiguity": {},
                "confidence": 100
              }
            },
            "Origin": {
              "name": "Origin",
              "queryPhrase": [
                "origin"
              ],
              "inferenceType": "explicit",
              "matchScore": 1,
              "metric": [
                "attribute_exact_match"
              ],
              "isLabel": false,
              "encode": true,
              "isAmbiguous": false,
              "ambiguity": [],
              "meta": {
                "score": 100,
                "threshold": 85,
                "alias": null,
                "ambiguity": {},
                "confidence": 100
              }
            }
          },
          "taskMap": {
            "trend": [
              {
                "task": "trend",
                "queryPhrase": [],
                "operator": null,
                "values": null,
                "matchScore": 0.5,
                "attributes": [
                  "Horsepower",
                  "Origin",
                  "Year"
                ],
                "inferenceType": "implicit",
                "isAttrAmbiguous": false,
                "isValueAmbiguous": false,
                "meta": {
                  "value_ambiguity_type": null
                }
              }
            ]
          },
          "followUpQuery": false,
          "contextObj": null
        }
      },
      {
        "queryId": 61,
        "query": "Histogram of weight, bin width of 500, min x axis 1500, max x axis 5500",
        "output": {
          "status": "SUCCESS",
          "debug": {
            "execution_durations": {
              "clean_query": 0.017474889755249023,
              "extract_attributes": 0.7943878173828125,
              "extract_vis_type": 0.00008106231689453125,
              "extract_tasks": 1.2546329498291016,
              "get_vis_list": 0.00019669532775878906,
              "total": 2.0667734146118164
            }
          },
          "query_raw": "Histogram of weight, bin width of 500, min x axis 1500, max x axis 5500",
          "query": "histogram of weight , bin width of 500 , min x axis 1500 , max x axis 5500",
          "dataset": "https://raw.githubusercontent.com/nl4dv/nl4dv/master/examples/assets/data/cars-w-year.csv",
          "alias": "https://raw.githubusercontent.com/nl4dv/nl4dv/master/examples/assets/aliases/cars-w-year.json",
          "visList": [
            {
              "score": 3.5,
              "scoreObj": {
                "by_attributes": 1,
                "by_task": 0.5,
                "by_vis": 1
              },
              "confidenceObj": {
                "Weight": 1
              },
              "attributes": [
                "Weight"
              ],
              "queryPhrase": "histogram",
              "visType": "histogram",
              "tasks": [
                "distribution"
              ],
              "inferenceType": "explicit",
              "vlSpec": {
                "$schema": "https://vega.github.io/schema/vega-lite/v4.json",
                "mark": {
                  "type": "bar",
                  "tooltip": true
                },
                "encoding": {
                  "x": {
                    "field": "Weight",
                    "type": "quantitative",
                    "aggregate": null,
                    "bin": true,
                    "axis": {
                      "format": "s"
                    }
                  },
                  "y": {
                    "field": "Weight",
                    "type": "quantitative",
                    "aggregate": "count",
                    "axis": {
                      "format": "s"
                    }
                  }
                },
                "transform": [],
                "data": {
                  "url": "https://raw.githubusercontent.com/nl4dv/nl4dv/master/examples/assets/data/cars-w-year.csv",
                  "format": {
                    "type": "csv"
                  }
                }
              }
            }
          ],
          "attributeMap": {
            "Weight": {
              "name": "Weight",
              "queryPhrase": [
                "weight"
              ],
              "inferenceType": "explicit",
              "matchScore": 1,
              "metric": [
                "attribute_exact_match"
              ],
              "isLabel": false,
              "encode": true,
              "isAmbiguous": false,
              "ambiguity": [],
              "meta": {
                "score": 100,
                "threshold": 85,
                "alias": null,
                "ambiguity": {},
                "confidence": 100
              }
            }
          },
          "taskMap": {
            "distribution": [
              {
                "task": "distribution",
                "queryPhrase": [],
                "operator": null,
                "values": null,
                "matchScore": 0.5,
                "attributes": [
                  "Weight"
                ],
                "inferenceType": "implicit",
                "isAttrAmbiguous": false,
                "isValueAmbiguous": false,
                "meta": {
                  "value_ambiguity_type": null
                }
              }
            ]
          },
          "followUpQuery": false,
          "contextObj": null
        }
      },
      {
        "queryId": 62,
        "query": "Bar chart, x axis origin, y axis count of rows",
        "output": {
          "status": "SUCCESS",
          "debug": {
            "execution_durations": {
              "clean_query": 0.006846904754638672,
              "extract_attributes": 0.44959402084350586,
              "extract_vis_type": 0.00005078315734863281,
              "extract_tasks": 1.1529109477996826,
              "get_vis_list": 0.0001468658447265625,
              "total": 1.6095495223999023
            }
          },
          "query_raw": "Bar chart, x axis origin, y axis count of rows",
          "query": "bar chart , x axis origin , y axis count of rows",
          "dataset": "https://raw.githubusercontent.com/nl4dv/nl4dv/master/examples/assets/data/cars-w-year.csv",
          "alias": "https://raw.githubusercontent.com/nl4dv/nl4dv/master/examples/assets/aliases/cars-w-year.json",
          "visList": [
            {
              "score": 3.5,
              "scoreObj": {
                "by_attributes": 1,
                "by_task": 0.5,
                "by_vis": 1
              },
              "confidenceObj": {
                "Origin": 1
              },
              "attributes": [
                "Origin"
              ],
              "queryPhrase": "bar chart",
              "visType": "barchart",
              "tasks": [
                "distribution"
              ],
              "inferenceType": "explicit",
              "vlSpec": {
                "$schema": "https://vega.github.io/schema/vega-lite/v4.json",
                "mark": {
                  "type": "bar",
                  "tooltip": true
                },
                "encoding": {
                  "x": {
                    "field": "Origin",
                    "type": "nominal",
                    "aggregate": null
                  },
                  "y": {
                    "field": "Origin",
                    "type": "nominal",
                    "aggregate": "count"
                  }
                },
                "transform": [],
                "data": {
                  "url": "https://raw.githubusercontent.com/nl4dv/nl4dv/master/examples/assets/data/cars-w-year.csv",
                  "format": {
                    "type": "csv"
                  }
                }
              }
            }
          ],
          "attributeMap": {
            "Origin": {
              "name": "Origin",
              "queryPhrase": [
                "origin"
              ],
              "inferenceType": "explicit",
              "matchScore": 1,
              "metric": [
                "attribute_exact_match"
              ],
              "isLabel": false,
              "encode": true,
              "isAmbiguous": false,
              "ambiguity": [],
              "meta": {
                "score": 100,
                "threshold": 85,
                "alias": null,
                "ambiguity": {},
                "confidence": 100
              }
            }
          },
          "taskMap": {
            "distribution": [
              {
                "task": "distribution",
                "queryPhrase": [],
                "operator": null,
                "values": null,
                "matchScore": 0.5,
                "attributes": [
                  "Origin"
                ],
                "inferenceType": "implicit",
                "isAttrAmbiguous": false,
                "isValueAmbiguous": false,
                "meta": {
                  "value_ambiguity_type": null
                }
              }
            ]
          },
          "followUpQuery": false,
          "contextObj": null
        }
      },
      {
        "queryId": 63,
        "query": "Plot Year by AVG Weight",
        "output": {
          "status": "SUCCESS",
          "debug": {
            "execution_durations": {
              "clean_query": 0.002070188522338867,
              "extract_attributes": 0.13115286827087402,
              "extract_vis_type": 0.000018835067749023438,
              "extract_tasks": 1.059577226638794,
              "get_vis_list": 0.0002608299255371094,
              "total": 1.193079948425293
            }
          },
          "query_raw": "Plot Year by AVG Weight",
          "query": "plot year by avg weight",
          "dataset": "https://raw.githubusercontent.com/nl4dv/nl4dv/master/examples/assets/data/cars-w-year.csv",
          "alias": "https://raw.githubusercontent.com/nl4dv/nl4dv/master/examples/assets/aliases/cars-w-year.json",
          "visList": [
            {
              "score": 4,
              "scoreObj": {
                "by_attributes": 2,
                "by_task": 0,
                "by_vis": 0
              },
              "confidenceObj": {
                "Weight": 1,
                "Year": 1
              },
              "attributes": [
                "Weight",
                "Year"
              ],
              "queryPhrase": null,
              "visType": null,
              "tasks": [
                "trend"
              ],
              "inferenceType": "implicit",
              "vlSpec": {
                "$schema": "https://vega.github.io/schema/vega-lite/v4.json",
                "mark": {
                  "type": "line",
                  "tooltip": true
                },
                "encoding": {
                  "y": {
                    "field": "Weight",
                    "type": "quantitative",
                    "aggregate": "mean",
                    "axis": {
                      "format": "s"
                    }
                  },
                  "x": {
                    "field": "Year",
                    "type": "temporal",
                    "aggregate": null
                  }
                },
                "transform": [],
                "data": {
                  "url": "https://raw.githubusercontent.com/nl4dv/nl4dv/master/examples/assets/data/cars-w-year.csv",
                  "format": {
                    "type": "csv"
                  }
                }
              }
            }
          ],
          "attributeMap": {
            "Weight": {
              "name": "Weight",
              "queryPhrase": [
                "weight"
              ],
              "inferenceType": "explicit",
              "matchScore": 1,
              "metric": [
                "attribute_exact_match"
              ],
              "isLabel": false,
              "encode": true,
              "isAmbiguous": false,
              "ambiguity": [],
              "meta": {
                "score": 100,
                "threshold": 85,
                "alias": null,
                "ambiguity": {},
                "confidence": 100
              }
            },
            "Year": {
              "name": "Year",
              "queryPhrase": [
                "year"
              ],
              "inferenceType": "explicit",
              "matchScore": 1,
              "metric": [
                "attribute_exact_match"
              ],
              "isLabel": false,
              "encode": true,
              "isAmbiguous": false,
              "ambiguity": [],
              "meta": {
                "score": 100,
                "threshold": 85,
                "alias": null,
                "ambiguity": {},
                "confidence": 100
              }
            }
          },
          "taskMap": {
            "trend": [
              {
                "task": "trend",
                "queryPhrase": [],
                "operator": null,
                "values": null,
                "matchScore": 0.5,
                "attributes": [
                  "Weight",
                  "Year"
                ],
                "inferenceType": "implicit",
                "isAttrAmbiguous": false,
                "isValueAmbiguous": false,
                "meta": {
                  "value_ambiguity_type": null
                }
              }
            ]
          },
          "followUpQuery": false,
          "contextObj": null
        }
      },
      {
        "queryId": 64,
        "query": "Coloring by Orign, Plot Displacement by MPG",
        "output": {
          "status": "SUCCESS",
          "debug": {
            "execution_durations": {
              "clean_query": 0.003726959228515625,
              "extract_attributes": 0.17385172843933105,
              "extract_vis_type": 0.000025987625122070312,
              "extract_tasks": 1.0822029113769531,
              "get_vis_list": 0.00034117698669433594,
              "total": 1.2601487636566162
            }
          },
          "query_raw": "Coloring by Orign, Plot Displacement by MPG",
          "query": "coloring by orign , plot displacement by mpg",
          "dataset": "https://raw.githubusercontent.com/nl4dv/nl4dv/master/examples/assets/data/cars-w-year.csv",
          "alias": "https://raw.githubusercontent.com/nl4dv/nl4dv/master/examples/assets/aliases/cars-w-year.json",
          "visList": [
            {
              "score": 6.4,
              "scoreObj": {
                "by_attributes": 2.9,
                "by_task": 0.5,
                "by_vis": 0
              },
              "confidenceObj": {
                "MPG": 1,
                "Displacement": 1,
                "Origin": 1
              },
              "attributes": [
                "MPG",
                "Displacement",
                "Origin"
              ],
              "queryPhrase": null,
              "visType": null,
              "tasks": [
                "correlation"
              ],
              "inferenceType": "implicit",
              "vlSpec": {
                "$schema": "https://vega.github.io/schema/vega-lite/v4.json",
                "mark": {
                  "type": "point",
                  "tooltip": true
                },
                "encoding": {
                  "x": {
                    "field": "MPG",
                    "type": "quantitative",
                    "aggregate": null,
                    "axis": {
                      "format": "s"
                    }
                  },
                  "y": {
                    "field": "Displacement",
                    "type": "quantitative",
                    "aggregate": null,
                    "axis": {
                      "format": "s"
                    }
                  },
                  "color": {
                    "field": "Origin",
                    "type": "nominal",
                    "aggregate": null
                  },
                  "tooltip": {
                    "field": "Model"
                  }
                },
                "transform": [],
                "data": {
                  "url": "https://raw.githubusercontent.com/nl4dv/nl4dv/master/examples/assets/data/cars-w-year.csv",
                  "format": {
                    "type": "csv"
                  }
                }
              }
            },
            {
              "score": 6.4,
              "scoreObj": {
                "by_attributes": 2.9,
                "by_task": 0.5,
                "by_vis": 0
              },
              "confidenceObj": {
                "MPG": 1,
                "Displacement": 1,
                "Origin": 1
              },
              "attributes": [
                "MPG",
                "Displacement",
                "Origin"
              ],
              "queryPhrase": null,
              "visType": null,
              "tasks": [
                "correlation"
              ],
              "inferenceType": "implicit",
              "vlSpec": {
                "$schema": "https://vega.github.io/schema/vega-lite/v4.json",
                "mark": {
                  "type": "point",
                  "tooltip": true
                },
                "encoding": {
                  "x": {
                    "field": "MPG",
                    "type": "quantitative",
                    "aggregate": null,
                    "axis": {
                      "format": "s"
                    }
                  },
                  "y": {
                    "field": "Displacement",
                    "type": "quantitative",
                    "aggregate": null,
                    "axis": {
                      "format": "s"
                    }
                  },
                  "column": {
                    "field": "Origin",
                    "type": "nominal",
                    "aggregate": null
                  },
                  "color": {
                    "field": "Origin",
                    "type": "nominal",
                    "aggregate": null
                  },
                  "tooltip": {
                    "field": "Model"
                  }
                },
                "transform": [],
                "data": {
                  "url": "https://raw.githubusercontent.com/nl4dv/nl4dv/master/examples/assets/data/cars-w-year.csv",
                  "format": {
                    "type": "csv"
                  }
                }
              }
            }
          ],
          "attributeMap": {
            "MPG": {
              "name": "MPG",
              "queryPhrase": [
                "mpg"
              ],
              "inferenceType": "explicit",
              "matchScore": 1,
              "metric": [
                "attribute_exact_match"
              ],
              "isLabel": false,
              "encode": true,
              "isAmbiguous": false,
              "ambiguity": [],
              "meta": {
                "score": 100,
                "threshold": 85,
                "alias": null,
                "ambiguity": {},
                "confidence": 100
              }
            },
            "Displacement": {
              "name": "Displacement",
              "queryPhrase": [
                "displacement"
              ],
              "inferenceType": "explicit",
              "matchScore": 1,
              "metric": [
                "attribute_exact_match"
              ],
              "isLabel": false,
              "encode": true,
              "isAmbiguous": false,
              "ambiguity": [],
              "meta": {
                "score": 100,
                "threshold": 85,
                "alias": null,
                "ambiguity": {},
                "confidence": 100
              }
            },
            "Origin": {
              "name": "Origin",
              "queryPhrase": [
                "orign"
              ],
              "inferenceType": "explicit",
              "matchScore": 0.9,
              "metric": [
                "attribute_similarity_match"
              ],
              "isLabel": false,
              "encode": true,
              "isAmbiguous": false,
              "ambiguity": [],
              "meta": {
                "score": 91,
                "threshold": 85,
                "alias": null,
                "ambiguity": {},
                "confidence": 100
              }
            }
          },
          "taskMap": {
            "correlation": [
              {
                "task": "correlation",
                "queryPhrase": [],
                "operator": null,
                "values": null,
                "matchScore": 0.5,
                "attributes": [
                  "MPG",
                  "Displacement"
                ],
                "inferenceType": "implicit",
                "isAttrAmbiguous": false,
                "isValueAmbiguous": false,
                "meta": {
                  "value_ambiguity_type": null
                }
              }
            ]
          },
          "followUpQuery": false,
          "contextObj": null
        }
      },
      {
        "queryId": 65,
        "query": "show cars produced by diiferent origin in various cylinders",
        "output": {
          "status": "SUCCESS",
          "debug": {
            "execution_durations": {
              "clean_query": 0.0058481693267822266,
              "extract_attributes": 0.34821200370788574,
              "extract_vis_type": 0.00006198883056640625,
              "extract_tasks": 1.0889348983764648,
              "get_vis_list": 0.00030303001403808594,
              "total": 1.4433600902557373
            }
          },
          "query_raw": "show cars produced by diiferent origin in various cylinders",
          "query": "show cars produced by diiferent origin in various cylinders",
          "dataset": "https://raw.githubusercontent.com/nl4dv/nl4dv/master/examples/assets/data/cars-w-year.csv",
          "alias": "https://raw.githubusercontent.com/nl4dv/nl4dv/master/examples/assets/aliases/cars-w-year.json",
          "visList": [
            {
              "score": 4.5,
              "scoreObj": {
                "by_attributes": 2,
                "by_task": 0.5,
                "by_vis": 0
              },
              "confidenceObj": {
                "Cylinders": 1,
                "Origin": 1
              },
              "attributes": [
                "Cylinders",
                "Origin"
              ],
              "queryPhrase": null,
              "visType": null,
              "tasks": [
                "derived_value"
              ],
              "inferenceType": "implicit",
              "vlSpec": {
                "$schema": "https://vega.github.io/schema/vega-lite/v4.json",
                "mark": {
                  "type": "bar",
                  "tooltip": true
                },
                "encoding": {
                  "y": {
                    "field": "Cylinders",
                    "type": "quantitative",
                    "aggregate": "mean",
                    "axis": {
                      "format": "s"
                    }
                  },
                  "x": {
                    "field": "Origin",
                    "type": "nominal",
                    "aggregate": null
                  }
                },
                "transform": [],
                "data": {
                  "url": "https://raw.githubusercontent.com/nl4dv/nl4dv/master/examples/assets/data/cars-w-year.csv",
                  "format": {
                    "type": "csv"
                  }
                }
              }
            }
          ],
          "attributeMap": {
            "Cylinders": {
              "name": "Cylinders",
              "queryPhrase": [
                "cylinders"
              ],
              "inferenceType": "explicit",
              "matchScore": 1,
              "metric": [
                "attribute_exact_match"
              ],
              "isLabel": false,
              "encode": true,
              "isAmbiguous": false,
              "ambiguity": [],
              "meta": {
                "score": 100,
                "threshold": 85,
                "alias": null,
                "ambiguity": {},
                "confidence": 100
              }
            },
            "Origin": {
              "name": "Origin",
              "queryPhrase": [
                "origin"
              ],
              "inferenceType": "explicit",
              "matchScore": 1,
              "metric": [
                "attribute_exact_match"
              ],
              "isLabel": false,
              "encode": true,
              "isAmbiguous": false,
              "ambiguity": [],
              "meta": {
                "score": 100,
                "threshold": 85,
                "alias": null,
                "ambiguity": {},
                "confidence": 100
              }
            }
          },
          "taskMap": {
            "derived_value": [
              {
                "task": "derived_value",
                "queryPhrase": [],
                "operator": "AVG",
                "values": null,
                "matchScore": 0.5,
                "attributes": [
                  "Cylinders"
                ],
                "inferenceType": "implicit",
                "isAttrAmbiguous": false,
                "isValueAmbiguous": false,
                "meta": {
                  "value_ambiguity_type": null
                }
              }
            ]
          },
          "followUpQuery": false,
          "contextObj": null
        }
      },
      {
        "queryId": 66,
        "query": "Bar chart, x axis cylinders, y axis mean MPG",
        "output": {
          "status": "SUCCESS",
          "debug": {
            "execution_durations": {
              "clean_query": 0.007294178009033203,
              "extract_attributes": 0.4191012382507324,
              "extract_vis_type": 0.000029087066650390625,
              "extract_tasks": 1.1083440780639648,
              "get_vis_list": 0.00018525123596191406,
              "total": 1.5349538326263428
            }
          },
          "query_raw": "Bar chart, x axis cylinders, y axis mean MPG",
          "query": "bar chart , x axis cylinders , y axis mean mpg",
          "dataset": "https://raw.githubusercontent.com/nl4dv/nl4dv/master/examples/assets/data/cars-w-year.csv",
          "alias": "https://raw.githubusercontent.com/nl4dv/nl4dv/master/examples/assets/aliases/cars-w-year.json",
          "visList": [
            {
              "score": 6,
              "scoreObj": {
                "by_attributes": 2,
                "by_task": 1,
                "by_vis": 1
              },
              "confidenceObj": {
                "MPG": 1,
                "Cylinders": 1
              },
              "attributes": [
                "MPG",
                "Cylinders"
              ],
              "queryPhrase": "bar chart",
              "visType": "barchart",
              "tasks": [
                "derived_value"
              ],
              "inferenceType": "explicit",
              "vlSpec": {
                "$schema": "https://vega.github.io/schema/vega-lite/v4.json",
                "mark": {
                  "type": "bar",
                  "tooltip": true
                },
                "encoding": {
                  "x": {
                    "field": "MPG",
                    "type": "quantitative",
                    "aggregate": "mean",
                    "axis": {
                      "format": "s"
                    }
                  },
                  "y": {
                    "field": "Cylinders",
                    "type": "quantitative",
                    "aggregate": null,
                    "axis": {
                      "format": "s"
                    }
                  }
                },
                "transform": [],
                "data": {
                  "url": "https://raw.githubusercontent.com/nl4dv/nl4dv/master/examples/assets/data/cars-w-year.csv",
                  "format": {
                    "type": "csv"
                  }
                }
              }
            }
          ],
          "attributeMap": {
            "MPG": {
              "name": "MPG",
              "queryPhrase": [
                "mpg"
              ],
              "inferenceType": "explicit",
              "matchScore": 1,
              "metric": [
                "attribute_exact_match"
              ],
              "isLabel": false,
              "encode": true,
              "isAmbiguous": false,
              "ambiguity": [],
              "meta": {
                "score": 100,
                "threshold": 85,
                "alias": null,
                "ambiguity": {},
                "confidence": 100
              }
            },
            "Cylinders": {
              "name": "Cylinders",
              "queryPhrase": [
                "cylinders"
              ],
              "inferenceType": "explicit",
              "matchScore": 1,
              "metric": [
                "attribute_exact_match"
              ],
              "isLabel": false,
              "encode": true,
              "isAmbiguous": false,
              "ambiguity": [],
              "meta": {
                "score": 100,
                "threshold": 85,
                "alias": null,
                "ambiguity": {},
                "confidence": 100
              }
            }
          },
          "taskMap": {
            "derived_value": [
              {
                "task": "derived_value",
                "queryPhrase": "mean",
                "operator": "AVG",
                "values": [],
                "matchScore": 1,
                "attributes": [
                  "MPG"
                ],
                "inferenceType": "explicit",
                "isAttrAmbiguous": false,
                "isValueAmbiguous": false,
                "meta": {
                  "value_ambiguity_type": null
                }
              }
            ]
          },
          "followUpQuery": false,
          "contextObj": null
        }
      }
    ],
    "movies-w-year": [
      {
        "queryId": 67,
        "query": "show me budget, gross, running time, and type for romantic comedy movies released between 1990 and 2000",
        "output": {
          "status": "SUCCESS",
          "debug": {
            "execution_durations": {
              "clean_query": 0.017095088958740234,
              "extract_attributes": 1.3200979232788086,
              "extract_vis_type": 0.00010704994201660156,
              "extract_tasks": 1.2950279712677002,
              "get_vis_list": 0.00020313262939453125,
              "total": 2.63253116607666
            }
          },
          "query_raw": "show me budget, gross, running time, and type for romantic comedy movies released between 1990 and 2000",
          "query": "show me budget , gross , running time , and type for romantic comedy movies released between 1990 and 2000",
          "dataset": "https://raw.githubusercontent.com/nl4dv/nl4dv/master/examples/assets/data/movies-w-year.csv",
          "alias": "https://raw.githubusercontent.com/nl4dv/nl4dv/master/examples/assets/aliases/movies-w-year.json",
          "visList": [
            {
              "score": 5.699999999999999,
              "scoreObj": {
                "by_attributes": 3.6999999999999997,
                "by_task": 2,
                "by_vis": 0
              },
              "attributes": [
                "Running Time",
                "Worldwide Gross",
                "Production Budget",
                "Creative Type"
              ],
              "visType": "datatable",
              "queryPhrase": null,
              "tasks": [
                "filter",
                "trend"
              ],
              "inferenceType": "implicit",
              "vlSpec": {
                "$schema": "https://vega.github.io/schema/vega-lite/v4.json",
                "transform": [
                  {
                    "window": [
                      {
                        "op": "row_number",
                        "as": "row_number"
                      }
                    ]
                  }
                ],
                "hconcat": [
                  {
                    "width": 150,
                    "title": "Running Time",
                    "mark": "text",
                    "transform": [
                      {
                        "filter": {
                          "field": "Release Year",
                          "range": [
                            "1990/01/01",
                            "2000/01/01"
                          ]
                        }
                      },
                      {
                        "filter": {
                          "field": "Genre",
                          "oneOf": [
                            "Romantic Comedy"
                          ]
                        }
                      },
                      {
                        "filter": {
                          "field": "Release Year",
                          "range": [
                            "1990/01/01",
                            "2000/01/01"
                          ]
                        }
                      },
                      {
                        "filter": {
                          "field": "Genre",
                          "oneOf": [
                            "Romantic Comedy"
                          ]
                        }
                      },
                      {
                        "filter": {
                          "field": "Release Year",
                          "range": [
                            "1990/01/01",
                            "2000/01/01"
                          ]
                        }
                      },
                      {
                        "filter": {
                          "field": "Genre",
                          "oneOf": [
                            "Romantic Comedy"
                          ]
                        }
                      },
                      {
                        "filter": {
                          "field": "Release Year",
                          "range": [
                            "1990/01/01",
                            "2000/01/01"
                          ]
                        }
                      },
                      {
                        "filter": {
                          "field": "Genre",
                          "oneOf": [
                            "Romantic Comedy"
                          ]
                        }
                      }
                    ],
                    "encoding": {
                      "text": {
                        "field": "Running Time",
                        "type": "nominal"
                      },
                      "y": {
                        "field": "row_number",
                        "type": "ordinal",
                        "axis": null
                      }
                    }
                  },
                  {
                    "width": 150,
                    "title": "Worldwide Gross",
                    "mark": "text",
                    "transform": [
                      {
                        "filter": {
                          "field": "Release Year",
                          "range": [
                            "1990/01/01",
                            "2000/01/01"
                          ]
                        }
                      },
                      {
                        "filter": {
                          "field": "Genre",
                          "oneOf": [
                            "Romantic Comedy"
                          ]
                        }
                      },
                      {
                        "filter": {
                          "field": "Release Year",
                          "range": [
                            "1990/01/01",
                            "2000/01/01"
                          ]
                        }
                      },
                      {
                        "filter": {
                          "field": "Genre",
                          "oneOf": [
                            "Romantic Comedy"
                          ]
                        }
                      },
                      {
                        "filter": {
                          "field": "Release Year",
                          "range": [
                            "1990/01/01",
                            "2000/01/01"
                          ]
                        }
                      },
                      {
                        "filter": {
                          "field": "Genre",
                          "oneOf": [
                            "Romantic Comedy"
                          ]
                        }
                      }
                    ],
                    "encoding": {
                      "text": {
                        "field": "Worldwide Gross",
                        "type": "nominal"
                      },
                      "y": {
                        "field": "row_number",
                        "type": "ordinal",
                        "axis": null
                      }
                    }
                  },
                  {
                    "width": 150,
                    "title": "Production Budget",
                    "mark": "text",
                    "transform": [
                      {
                        "filter": {
                          "field": "Release Year",
                          "range": [
                            "1990/01/01",
                            "2000/01/01"
                          ]
                        }
                      },
                      {
                        "filter": {
                          "field": "Genre",
                          "oneOf": [
                            "Romantic Comedy"
                          ]
                        }
                      },
                      {
                        "filter": {
                          "field": "Release Year",
                          "range": [
                            "1990/01/01",
                            "2000/01/01"
                          ]
                        }
                      },
                      {
                        "filter": {
                          "field": "Genre",
                          "oneOf": [
                            "Romantic Comedy"
                          ]
                        }
                      }
                    ],
                    "encoding": {
                      "text": {
                        "field": "Production Budget",
                        "type": "nominal"
                      },
                      "y": {
                        "field": "row_number",
                        "type": "ordinal",
                        "axis": null
                      }
                    }
                  },
                  {
                    "width": 150,
                    "title": "Creative Type",
                    "mark": "text",
                    "transform": [
                      {
                        "filter": {
                          "field": "Release Year",
                          "range": [
                            "1990/01/01",
                            "2000/01/01"
                          ]
                        }
                      },
                      {
                        "filter": {
                          "field": "Genre",
                          "oneOf": [
                            "Romantic Comedy"
                          ]
                        }
                      }
                    ],
                    "encoding": {
                      "text": {
                        "field": "Creative Type",
                        "type": "nominal"
                      },
                      "y": {
                        "field": "row_number",
                        "type": "ordinal",
                        "axis": null
                      }
                    }
                  }
                ],
                "data": {
                  "url": "https://raw.githubusercontent.com/nl4dv/nl4dv/master/examples/assets/data/movies-w-year.csv",
                  "format": {
                    "type": "csv"
                  }
                }
              }
            }
          ],
          "attributeMap": {
            "Running Time": {
              "name": "Running Time",
              "queryPhrase": [
                "running time"
              ],
              "inferenceType": "explicit",
              "matchScore": 1,
              "metric": [
                "attribute_exact_match"
              ],
              "isLabel": false,
              "encode": true,
              "isAmbiguous": false,
              "ambiguity": [],
              "meta": {
                "score": 100,
                "threshold": 85,
                "alias": null,
                "ambiguity": {},
                "confidence": 100
              }
            },
            "Worldwide Gross": {
              "name": "Worldwide Gross",
              "queryPhrase": [
                "gross"
              ],
              "inferenceType": "explicit",
              "matchScore": 0.9,
              "metric": [
                "attribute_similarity_match"
              ],
              "isLabel": false,
              "encode": true,
              "isAmbiguous": false,
              "ambiguity": [],
              "meta": {
                "score": 100,
                "threshold": 85,
                "alias": null,
                "ambiguity": {},
                "confidence": 100
              }
            },
            "Production Budget": {
              "name": "Production Budget",
              "queryPhrase": [
                "budget"
              ],
              "inferenceType": "explicit",
              "matchScore": 0.9,
              "metric": [
                "attribute_similarity_match"
              ],
              "isLabel": false,
              "encode": true,
              "isAmbiguous": false,
              "ambiguity": [],
              "meta": {
                "score": 100,
                "threshold": 85,
                "alias": null,
                "ambiguity": {},
                "confidence": 100
              }
            },
            "Release Year": {
              "name": "Release Year",
              "queryPhrase": [
                "released"
              ],
              "inferenceType": "explicit",
              "matchScore": 0.9,
              "metric": [
                "attribute_similarity_match"
              ],
              "isLabel": false,
              "encode": false,
              "isAmbiguous": false,
              "ambiguity": [],
              "meta": {
                "score": 100,
                "threshold": 85,
                "alias": null,
                "ambiguity": {},
                "confidence": 100
              }
            },
            "Creative Type": {
              "name": "Creative Type",
              "queryPhrase": [
                "type"
              ],
              "inferenceType": "explicit",
              "matchScore": 0.9,
              "metric": [
                "attribute_similarity_match"
              ],
              "isLabel": false,
              "encode": true,
              "isAmbiguous": false,
              "ambiguity": [],
              "meta": {
                "score": 100,
                "threshold": 85,
                "alias": null,
                "ambiguity": {},
                "confidence": 100
              }
            },
            "Genre": {
              "name": "Genre",
              "queryPhrase": [
                "romantic comedy"
              ],
              "inferenceType": "implicit",
              "matchScore": 0.5,
              "metric": [
                "attribute_domain_value_match"
              ],
              "isLabel": false,
              "isAmbiguous": false,
              "ambiguity": [],
              "encode": false,
              "meta": {
                "score": null,
                "threshold": null,
                "alias": null,
                "ambiguity": {
                  "romantic comedy": [
                    "Romantic Comedy"
                  ]
                },
                "confidence": 100
              }
            }
          },
          "taskMap": {
            "filter": [
              {
                "task": "filter",
                "queryPhrase": "between",
                "operator": "RANGE",
                "values": [
                  "1990/01/01",
                  "2000/01/01"
                ],
                "matchScore": 1,
                "attributes": [
                  "Release Year"
                ],
                "inferenceType": "explicit",
                "isAttrAmbiguous": false,
                "isValueAmbiguous": false,
                "meta": {
                  "value_ambiguity_type": null
                }
              },
              {
                "task": "filter",
                "queryPhrase": [
                  "romantic comedy"
                ],
                "operator": "IN",
                "values": [
                  "Romantic Comedy"
                ],
                "matchScore": 1,
                "attributes": [
                  "Genre"
                ],
                "inferenceType": "explicit",
                "isAttrAmbiguous": false,
                "isValueAmbiguous": false,
                "meta": {
                  "value_ambiguity_type": null
                }
              }
            ],
            "trend": [
              {
                "task": "trend",
                "queryPhrase": [],
                "operator": null,
                "values": null,
                "matchScore": 0.5,
                "attributes": [
                  "Running Time",
                  "Worldwide Gross",
                  "Production Budget",
                  "Creative Type",
                  "Release Year"
                ],
                "inferenceType": "implicit",
                "isAttrAmbiguous": false,
                "isValueAmbiguous": false,
                "meta": {
                  "value_ambiguity_type": null
                }
              }
            ]
          },
          "followUpQuery": false,
          "contextObj": null
        }
      },
      {
        "queryId": 68,
        "query": "plot worldwide gross over release year split by genre",
        "output": {
          "status": "SUCCESS",
          "debug": {
            "execution_durations": {
              "clean_query": 0.0055522918701171875,
              "extract_attributes": 0.7052297592163086,
              "extract_vis_type": 0.00003314018249511719,
              "extract_tasks": 1.0618669986724854,
              "get_vis_list": 0.0007288455963134766,
              "total": 1.7734110355377197
            }
          },
          "query_raw": "plot worldwide gross over release year split by genre",
          "query": "plot worldwide gross over release year split by genre",
          "dataset": "https://raw.githubusercontent.com/nl4dv/nl4dv/master/examples/assets/data/movies-w-year.csv",
          "alias": "https://raw.githubusercontent.com/nl4dv/nl4dv/master/examples/assets/aliases/movies-w-year.json",
          "visList": [
            {
              "score": 6,
              "scoreObj": {
                "by_attributes": 3,
                "by_task": 0,
                "by_vis": 0
              },
              "confidenceObj": {
                "Worldwide Gross": 1,
                "Genre": 1,
                "Release Year": 1
              },
              "attributes": [
                "Worldwide Gross",
                "Genre",
                "Release Year"
              ],
              "queryPhrase": null,
              "visType": null,
              "tasks": [
                "trend"
              ],
              "inferenceType": "implicit",
              "vlSpec": {
                "$schema": "https://vega.github.io/schema/vega-lite/v4.json",
                "mark": {
                  "type": "line",
                  "tooltip": true
                },
                "encoding": {
                  "y": {
                    "field": "Worldwide Gross",
                    "type": "quantitative",
                    "aggregate": "mean",
                    "axis": {
                      "format": "s"
                    }
                  },
                  "color": {
                    "field": "Genre",
                    "type": "nominal",
                    "aggregate": null
                  },
                  "x": {
                    "field": "Release Year",
                    "type": "temporal",
                    "aggregate": null
                  }
                },
                "transform": [],
                "data": {
                  "url": "https://raw.githubusercontent.com/nl4dv/nl4dv/master/examples/assets/data/movies-w-year.csv",
                  "format": {
                    "type": "csv"
                  }
                }
              }
            },
            {
              "score": 6,
              "scoreObj": {
                "by_attributes": 3,
                "by_task": 0,
                "by_vis": 0
              },
              "confidenceObj": {
                "Worldwide Gross": 1,
                "Genre": 1,
                "Release Year": 1
              },
              "attributes": [
                "Worldwide Gross",
                "Genre",
                "Release Year"
              ],
              "queryPhrase": null,
              "visType": null,
              "tasks": [
                "trend"
              ],
              "inferenceType": "implicit",
              "vlSpec": {
                "$schema": "https://vega.github.io/schema/vega-lite/v4.json",
                "mark": {
                  "type": "line",
                  "tooltip": true
                },
                "encoding": {
                  "y": {
                    "field": "Worldwide Gross",
                    "type": "quantitative",
                    "aggregate": "mean",
                    "axis": {
                      "format": "s"
                    }
                  },
                  "column": {
                    "field": "Genre",
                    "type": "nominal",
                    "aggregate": null
                  },
                  "x": {
                    "field": "Release Year",
                    "type": "temporal",
                    "aggregate": null
                  },
                  "color": {
                    "field": "Genre",
                    "type": "nominal",
                    "aggregate": null
                  }
                },
                "transform": [],
                "data": {
                  "url": "https://raw.githubusercontent.com/nl4dv/nl4dv/master/examples/assets/data/movies-w-year.csv",
                  "format": {
                    "type": "csv"
                  }
                }
              }
            },
            {
              "score": 6,
              "scoreObj": {
                "by_attributes": 3,
                "by_task": 0,
                "by_vis": 0
              },
              "confidenceObj": {
                "Worldwide Gross": 1,
                "Genre": 1,
                "Release Year": 1
              },
              "attributes": [
                "Worldwide Gross",
                "Genre",
                "Release Year"
              ],
              "queryPhrase": null,
              "visType": null,
              "tasks": [
                "trend"
              ],
              "inferenceType": "implicit",
              "vlSpec": {
                "$schema": "https://vega.github.io/schema/vega-lite/v4.json",
                "mark": {
                  "type": "bar",
                  "tooltip": true
                },
                "encoding": {
                  "y": {
                    "field": "Worldwide Gross",
                    "type": "quantitative",
                    "aggregate": "mean",
                    "axis": {
                      "format": "s"
                    }
                  },
                  "x": {
                    "field": "Genre",
                    "type": "nominal",
                    "aggregate": null
                  },
                  "column": {
                    "field": "Release Year",
                    "type": "temporal",
                    "aggregate": null
                  },
                  "color": {
                    "field": "Genre",
                    "type": "nominal",
                    "aggregate": null
                  }
                },
                "transform": [],
                "data": {
                  "url": "https://raw.githubusercontent.com/nl4dv/nl4dv/master/examples/assets/data/movies-w-year.csv",
                  "format": {
                    "type": "csv"
                  }
                }
              }
            },
            {
              "score": 6,
              "scoreObj": {
                "by_attributes": 3,
                "by_task": 0,
                "by_vis": 0
              },
              "confidenceObj": {
                "Worldwide Gross": 1,
                "Genre": 1,
                "Release Year": 1
              },
              "attributes": [
                "Worldwide Gross",
                "Genre",
                "Release Year"
              ],
              "queryPhrase": null,
              "visType": null,
              "tasks": [
                "trend"
              ],
              "inferenceType": "implicit",
              "vlSpec": {
                "$schema": "https://vega.github.io/schema/vega-lite/v4.json",
                "mark": {
                  "type": "tick",
                  "tooltip": true
                },
                "encoding": {
                  "y": {
                    "field": "Worldwide Gross",
                    "type": "quantitative",
                    "aggregate": null,
                    "axis": {
                      "format": "s"
                    }
                  },
                  "color": {
                    "field": "Genre",
                    "type": "nominal",
                    "aggregate": null
                  },
                  "x": {
                    "field": "Release Year",
                    "type": "temporal",
                    "aggregate": null
                  },
                  "tooltip": {
                    "field": "Title"
                  }
                },
                "transform": [],
                "data": {
                  "url": "https://raw.githubusercontent.com/nl4dv/nl4dv/master/examples/assets/data/movies-w-year.csv",
                  "format": {
                    "type": "csv"
                  }
                }
              }
            },
            {
              "score": 6,
              "scoreObj": {
                "by_attributes": 3,
                "by_task": 0,
                "by_vis": 0
              },
              "confidenceObj": {
                "Worldwide Gross": 1,
                "Genre": 1,
                "Release Year": 1
              },
              "attributes": [
                "Worldwide Gross",
                "Genre",
                "Release Year"
              ],
              "queryPhrase": null,
              "visType": null,
              "tasks": [
                "trend"
              ],
              "inferenceType": "implicit",
              "vlSpec": {
                "$schema": "https://vega.github.io/schema/vega-lite/v4.json",
                "mark": {
                  "type": "tick",
                  "tooltip": true
                },
                "encoding": {
                  "y": {
                    "field": "Worldwide Gross",
                    "type": "quantitative",
                    "aggregate": null,
                    "axis": {
                      "format": "s"
                    }
                  },
                  "column": {
                    "field": "Genre",
                    "type": "nominal",
                    "aggregate": null
                  },
                  "x": {
                    "field": "Release Year",
                    "type": "temporal",
                    "aggregate": null
                  },
                  "color": {
                    "field": "Genre",
                    "type": "nominal",
                    "aggregate": null
                  },
                  "tooltip": {
                    "field": "Title"
                  }
                },
                "transform": [],
                "data": {
                  "url": "https://raw.githubusercontent.com/nl4dv/nl4dv/master/examples/assets/data/movies-w-year.csv",
                  "format": {
                    "type": "csv"
                  }
                }
              }
            },
            {
              "score": 6,
              "scoreObj": {
                "by_attributes": 3,
                "by_task": 0,
                "by_vis": 0
              },
              "confidenceObj": {
                "Worldwide Gross": 1,
                "Genre": 1,
                "Release Year": 1
              },
              "attributes": [
                "Worldwide Gross",
                "Genre",
                "Release Year"
              ],
              "queryPhrase": null,
              "visType": null,
              "tasks": [
                "trend"
              ],
              "inferenceType": "implicit",
              "vlSpec": {
                "$schema": "https://vega.github.io/schema/vega-lite/v4.json",
                "mark": {
                  "type": "tick",
                  "tooltip": true
                },
                "encoding": {
                  "y": {
                    "field": "Worldwide Gross",
                    "type": "quantitative",
                    "aggregate": null,
                    "axis": {
                      "format": "s"
                    }
                  },
                  "x": {
                    "field": "Genre",
                    "type": "nominal",
                    "aggregate": null
                  },
                  "column": {
                    "field": "Release Year",
                    "type": "temporal",
                    "aggregate": null
                  },
                  "color": {
                    "field": "Genre",
                    "type": "nominal",
                    "aggregate": null
                  },
                  "tooltip": {
                    "field": "Title"
                  }
                },
                "transform": [],
                "data": {
                  "url": "https://raw.githubusercontent.com/nl4dv/nl4dv/master/examples/assets/data/movies-w-year.csv",
                  "format": {
                    "type": "csv"
                  }
                }
              }
            }
          ],
          "attributeMap": {
            "Worldwide Gross": {
              "name": "Worldwide Gross",
              "queryPhrase": [
                "worldwide gross"
              ],
              "inferenceType": "explicit",
              "matchScore": 1,
              "metric": [
                "attribute_exact_match"
              ],
              "isLabel": false,
              "encode": true,
              "isAmbiguous": false,
              "ambiguity": [],
              "meta": {
                "score": 100,
                "threshold": 85,
                "alias": null,
                "ambiguity": {},
                "confidence": 100
              }
            },
            "Release Year": {
              "name": "Release Year",
              "queryPhrase": [
                "release year"
              ],
              "inferenceType": "explicit",
              "matchScore": 1,
              "metric": [
                "attribute_exact_match"
              ],
              "isLabel": false,
              "encode": true,
              "isAmbiguous": false,
              "ambiguity": [],
              "meta": {
                "score": 100,
                "threshold": 85,
                "alias": null,
                "ambiguity": {},
                "confidence": 100
              }
            },
            "Genre": {
              "name": "Genre",
              "queryPhrase": [
                "genre"
              ],
              "inferenceType": "explicit",
              "matchScore": 1,
              "metric": [
                "attribute_exact_match"
              ],
              "isLabel": false,
              "encode": true,
              "isAmbiguous": false,
              "ambiguity": [],
              "meta": {
                "score": 100,
                "threshold": 85,
                "alias": null,
                "ambiguity": {},
                "confidence": 100
              }
            }
          },
          "taskMap": {
            "trend": [
              {
                "task": "trend",
                "queryPhrase": [],
                "operator": null,
                "values": null,
                "matchScore": 0.5,
                "attributes": [
                  "Worldwide Gross",
                  "Genre",
                  "Release Year"
                ],
                "inferenceType": "implicit",
                "isAttrAmbiguous": false,
                "isValueAmbiguous": false,
                "meta": {
                  "value_ambiguity_type": null
                }
              }
            ]
          },
          "followUpQuery": false,
          "contextObj": null
        }
      },
      {
        "queryId": 69,
        "query": "gross across genres regarding content rating",
        "output": {
          "status": "SUCCESS",
          "debug": {
            "execution_durations": {
              "clean_query": 0.0048482418060302734,
              "extract_attributes": 0.48598599433898926,
              "extract_vis_type": 0.000026702880859375,
              "extract_tasks": 1.0205230712890625,
              "get_vis_list": 0.0005450248718261719,
              "total": 1.5119290351867676
            }
          },
          "query_raw": "gross across genres regarding content rating",
          "query": "gross across genres regarding content rating",
          "dataset": "https://raw.githubusercontent.com/nl4dv/nl4dv/master/examples/assets/data/movies-w-year.csv",
          "alias": "https://raw.githubusercontent.com/nl4dv/nl4dv/master/examples/assets/aliases/movies-w-year.json",
          "visList": [
            {
              "score": 6.4,
              "scoreObj": {
                "by_attributes": 2.9,
                "by_task": 0.5,
                "by_vis": 0
              },
              "confidenceObj": {
                "Worldwide Gross": 1,
                "Content Rating": 1,
                "Genre": 1
              },
              "attributes": [
                "Worldwide Gross",
                "Content Rating",
                "Genre"
              ],
              "queryPhrase": null,
              "visType": null,
              "tasks": [
                "derived_value"
              ],
              "inferenceType": "implicit",
              "vlSpec": {
                "$schema": "https://vega.github.io/schema/vega-lite/v4.json",
                "mark": {
                  "type": "bar",
                  "tooltip": true
                },
                "encoding": {
                  "y": {
                    "field": "Worldwide Gross",
                    "type": "quantitative",
                    "aggregate": "mean",
                    "axis": {
                      "format": "s"
                    }
                  },
                  "x": {
                    "field": "Content Rating",
                    "type": "nominal",
                    "aggregate": null
                  },
                  "color": {
                    "field": "Genre",
                    "type": "nominal",
                    "aggregate": null
                  }
                },
                "transform": [],
                "data": {
                  "url": "https://raw.githubusercontent.com/nl4dv/nl4dv/master/examples/assets/data/movies-w-year.csv",
                  "format": {
                    "type": "csv"
                  }
                }
              }
            },
            {
              "score": 6.4,
              "scoreObj": {
                "by_attributes": 2.9,
                "by_task": 0.5,
                "by_vis": 0
              },
              "confidenceObj": {
                "Worldwide Gross": 1,
                "Content Rating": 1,
                "Genre": 1
              },
              "attributes": [
                "Worldwide Gross",
                "Content Rating",
                "Genre"
              ],
              "queryPhrase": null,
              "visType": null,
              "tasks": [
                "derived_value"
              ],
              "inferenceType": "implicit",
              "vlSpec": {
                "$schema": "https://vega.github.io/schema/vega-lite/v4.json",
                "mark": {
                  "type": "bar",
                  "tooltip": true
                },
                "encoding": {
                  "y": {
                    "field": "Worldwide Gross",
                    "type": "quantitative",
                    "aggregate": "mean",
                    "axis": {
                      "format": "s"
                    }
                  },
                  "column": {
                    "field": "Content Rating",
                    "type": "nominal",
                    "aggregate": null
                  },
                  "x": {
                    "field": "Genre",
                    "type": "nominal",
                    "aggregate": null
                  },
                  "color": {
                    "field": "Content Rating",
                    "type": "nominal",
                    "aggregate": null
                  }
                },
                "transform": [],
                "data": {
                  "url": "https://raw.githubusercontent.com/nl4dv/nl4dv/master/examples/assets/data/movies-w-year.csv",
                  "format": {
                    "type": "csv"
                  }
                }
              }
            },
            {
              "score": 6.4,
              "scoreObj": {
                "by_attributes": 2.9,
                "by_task": 0.5,
                "by_vis": 0
              },
              "confidenceObj": {
                "Worldwide Gross": 1,
                "Content Rating": 1,
                "Genre": 1
              },
              "attributes": [
                "Worldwide Gross",
                "Content Rating",
                "Genre"
              ],
              "queryPhrase": null,
              "visType": null,
              "tasks": [
                "derived_value"
              ],
              "inferenceType": "implicit",
              "vlSpec": {
                "$schema": "https://vega.github.io/schema/vega-lite/v4.json",
                "mark": {
                  "type": "point",
                  "tooltip": true
                },
                "encoding": {
                  "size": {
                    "field": "Worldwide Gross",
                    "type": "quantitative",
                    "aggregate": "mean"
                  },
                  "x": {
                    "field": "Content Rating",
                    "type": "nominal",
                    "aggregate": null
                  },
                  "y": {
                    "field": "Genre",
                    "type": "nominal",
                    "aggregate": null
                  }
                },
                "transform": [],
                "data": {
                  "url": "https://raw.githubusercontent.com/nl4dv/nl4dv/master/examples/assets/data/movies-w-year.csv",
                  "format": {
                    "type": "csv"
                  }
                }
              }
            }
          ],
          "attributeMap": {
            "Content Rating": {
              "name": "Content Rating",
              "queryPhrase": [
                "content rating"
              ],
              "inferenceType": "explicit",
              "matchScore": 1,
              "metric": [
                "attribute_exact_match"
              ],
              "isLabel": false,
              "encode": true,
              "isAmbiguous": false,
              "ambiguity": [],
              "meta": {
                "score": 100,
                "threshold": 85,
                "alias": null,
                "ambiguity": {},
                "confidence": 100
              }
            },
            "Genre": {
              "name": "Genre",
              "queryPhrase": [
                "genres"
              ],
              "inferenceType": "explicit",
              "matchScore": 1,
              "metric": [
                "attribute_exact_match"
              ],
              "isLabel": false,
              "encode": true,
              "isAmbiguous": false,
              "ambiguity": [],
              "meta": {
                "score": 100,
                "threshold": 85,
                "alias": null,
                "ambiguity": {},
                "confidence": 100
              }
            },
            "Worldwide Gross": {
              "name": "Worldwide Gross",
              "queryPhrase": [
                "gross"
              ],
              "inferenceType": "explicit",
              "matchScore": 0.9,
              "metric": [
                "attribute_similarity_match"
              ],
              "isLabel": false,
              "encode": true,
              "isAmbiguous": false,
              "ambiguity": [],
              "meta": {
                "score": 100,
                "threshold": 85,
                "alias": null,
                "ambiguity": {},
                "confidence": 100
              }
            }
          },
          "taskMap": {
            "derived_value": [
              {
                "task": "derived_value",
                "queryPhrase": [],
                "operator": "AVG",
                "values": null,
                "matchScore": 0.5,
                "attributes": [
                  "Worldwide Gross"
                ],
                "inferenceType": "implicit",
                "isAttrAmbiguous": false,
                "isValueAmbiguous": false,
                "meta": {
                  "value_ambiguity_type": null
                }
              }
            ]
          },
          "followUpQuery": false,
          "contextObj": null
        }
      },
      {
        "queryId": 70,
        "query": "budget vs gross income across movie genres",
        "output": {
          "status": "SUCCESS",
          "debug": {
            "execution_durations": {
              "clean_query": 0.0043637752532958984,
              "extract_attributes": 0.34765195846557617,
              "extract_vis_type": 0.000030994415283203125,
              "extract_tasks": 1.0913701057434082,
              "get_vis_list": 0.0003409385681152344,
              "total": 1.4437577724456787
            }
          },
          "query_raw": "budget vs gross income across movie genres",
          "query": "budget vs gross income across movie genres",
          "dataset": "https://raw.githubusercontent.com/nl4dv/nl4dv/master/examples/assets/data/movies-w-year.csv",
          "alias": "https://raw.githubusercontent.com/nl4dv/nl4dv/master/examples/assets/aliases/movies-w-year.json",
          "visList": [
            {
              "score": 6.3,
              "scoreObj": {
                "by_attributes": 2.8,
                "by_task": 0.5,
                "by_vis": 0
              },
              "confidenceObj": {
                "Worldwide Gross": 1,
                "Production Budget": 1,
                "Genre": 1
              },
              "attributes": [
                "Worldwide Gross",
                "Production Budget",
                "Genre"
              ],
              "queryPhrase": null,
              "visType": null,
              "tasks": [
                "correlation"
              ],
              "inferenceType": "implicit",
              "vlSpec": {
                "$schema": "https://vega.github.io/schema/vega-lite/v4.json",
                "mark": {
                  "type": "point",
                  "tooltip": true
                },
                "encoding": {
                  "x": {
                    "field": "Worldwide Gross",
                    "type": "quantitative",
                    "aggregate": null,
                    "axis": {
                      "format": "s"
                    }
                  },
                  "y": {
                    "field": "Production Budget",
                    "type": "quantitative",
                    "aggregate": null,
                    "axis": {
                      "format": "s"
                    }
                  },
                  "color": {
                    "field": "Genre",
                    "type": "nominal",
                    "aggregate": null
                  },
                  "tooltip": {
                    "field": "Title"
                  }
                },
                "transform": [],
                "data": {
                  "url": "https://raw.githubusercontent.com/nl4dv/nl4dv/master/examples/assets/data/movies-w-year.csv",
                  "format": {
                    "type": "csv"
                  }
                }
              }
            },
            {
              "score": 6.3,
              "scoreObj": {
                "by_attributes": 2.8,
                "by_task": 0.5,
                "by_vis": 0
              },
              "confidenceObj": {
                "Worldwide Gross": 1,
                "Production Budget": 1,
                "Genre": 1
              },
              "attributes": [
                "Worldwide Gross",
                "Production Budget",
                "Genre"
              ],
              "queryPhrase": null,
              "visType": null,
              "tasks": [
                "correlation"
              ],
              "inferenceType": "implicit",
              "vlSpec": {
                "$schema": "https://vega.github.io/schema/vega-lite/v4.json",
                "mark": {
                  "type": "point",
                  "tooltip": true
                },
                "encoding": {
                  "x": {
                    "field": "Worldwide Gross",
                    "type": "quantitative",
                    "aggregate": null,
                    "axis": {
                      "format": "s"
                    }
                  },
                  "y": {
                    "field": "Production Budget",
                    "type": "quantitative",
                    "aggregate": null,
                    "axis": {
                      "format": "s"
                    }
                  },
                  "column": {
                    "field": "Genre",
                    "type": "nominal",
                    "aggregate": null
                  },
                  "color": {
                    "field": "Genre",
                    "type": "nominal",
                    "aggregate": null
                  },
                  "tooltip": {
                    "field": "Title"
                  }
                },
                "transform": [],
                "data": {
                  "url": "https://raw.githubusercontent.com/nl4dv/nl4dv/master/examples/assets/data/movies-w-year.csv",
                  "format": {
                    "type": "csv"
                  }
                }
              }
            }
          ],
          "attributeMap": {
            "Genre": {
              "name": "Genre",
              "queryPhrase": [
                "genres"
              ],
              "inferenceType": "explicit",
              "matchScore": 1,
              "metric": [
                "attribute_exact_match"
              ],
              "isLabel": false,
              "encode": true,
              "isAmbiguous": false,
              "ambiguity": [],
              "meta": {
                "score": 100,
                "threshold": 85,
                "alias": null,
                "ambiguity": {},
                "confidence": 100
              }
            },
            "Worldwide Gross": {
              "name": "Worldwide Gross",
              "queryPhrase": [
                "gross"
              ],
              "inferenceType": "explicit",
              "matchScore": 0.9,
              "metric": [
                "attribute_similarity_match"
              ],
              "isLabel": false,
              "encode": true,
              "isAmbiguous": false,
              "ambiguity": [],
              "meta": {
                "score": 100,
                "threshold": 85,
                "alias": null,
                "ambiguity": {},
                "confidence": 100
              }
            },
            "Production Budget": {
              "name": "Production Budget",
              "queryPhrase": [
                "budget"
              ],
              "inferenceType": "explicit",
              "matchScore": 0.9,
              "metric": [
                "attribute_similarity_match"
              ],
              "isLabel": false,
              "encode": true,
              "isAmbiguous": false,
              "ambiguity": [],
              "meta": {
                "score": 100,
                "threshold": 85,
                "alias": null,
                "ambiguity": {},
                "confidence": 100
              }
            }
          },
          "taskMap": {
            "correlation": [
              {
                "task": "correlation",
                "queryPhrase": [],
                "operator": null,
                "values": null,
                "matchScore": 0.5,
                "attributes": [
                  "Worldwide Gross",
                  "Production Budget"
                ],
                "inferenceType": "implicit",
                "isAttrAmbiguous": false,
                "isValueAmbiguous": false,
                "meta": {
                  "value_ambiguity_type": null
                }
              }
            ]
          },
          "followUpQuery": false,
          "contextObj": null
        }
      },
      {
        "queryId": 71,
        "query": "Scatterplot of Worldwide Gross by Production Budget with different colors by major genre",
        "output": {
          "status": "SUCCESS",
          "debug": {
            "execution_durations": {
              "clean_query": 0.008850336074829102,
              "extract_attributes": 0.6681399345397949,
              "extract_vis_type": 0.00003695487976074219,
              "extract_tasks": 1.1725592613220215,
              "get_vis_list": 0.00036025047302246094,
              "total": 1.8499467372894287
            }
          },
          "query_raw": "Scatterplot of Worldwide Gross by Production Budget with different colors by major genre",
          "query": "scatterplot of worldwide gross by production budget with different colors by major genre",
          "dataset": "https://raw.githubusercontent.com/nl4dv/nl4dv/master/examples/assets/data/movies-w-year.csv",
          "alias": "https://raw.githubusercontent.com/nl4dv/nl4dv/master/examples/assets/aliases/movies-w-year.json",
          "visList": [
            {
              "score": 7.5,
              "scoreObj": {
                "by_attributes": 3,
                "by_task": 0.5,
                "by_vis": 1
              },
              "confidenceObj": {
                "Worldwide Gross": 1,
                "Production Budget": 1,
                "Genre": 1
              },
              "attributes": [
                "Worldwide Gross",
                "Production Budget",
                "Genre"
              ],
              "queryPhrase": "scatterplot",
              "visType": "scatterplot",
              "tasks": [
                "correlation"
              ],
              "inferenceType": "explicit",
              "vlSpec": {
                "$schema": "https://vega.github.io/schema/vega-lite/v4.json",
                "mark": {
                  "type": "point",
                  "tooltip": true
                },
                "encoding": {
                  "x": {
                    "field": "Worldwide Gross",
                    "type": "quantitative",
                    "aggregate": null,
                    "axis": {
                      "format": "s"
                    }
                  },
                  "y": {
                    "field": "Production Budget",
                    "type": "quantitative",
                    "aggregate": null,
                    "axis": {
                      "format": "s"
                    }
                  },
                  "color": {
                    "field": "Genre",
                    "type": "nominal",
                    "aggregate": null
                  },
                  "tooltip": {
                    "field": "Title"
                  }
                },
                "transform": [],
                "data": {
                  "url": "https://raw.githubusercontent.com/nl4dv/nl4dv/master/examples/assets/data/movies-w-year.csv",
                  "format": {
                    "type": "csv"
                  }
                }
              }
            },
            {
              "score": 7.5,
              "scoreObj": {
                "by_attributes": 3,
                "by_task": 0.5,
                "by_vis": 1
              },
              "confidenceObj": {
                "Worldwide Gross": 1,
                "Production Budget": 1,
                "Genre": 1
              },
              "attributes": [
                "Worldwide Gross",
                "Production Budget",
                "Genre"
              ],
              "queryPhrase": "scatterplot",
              "visType": "scatterplot",
              "tasks": [
                "correlation"
              ],
              "inferenceType": "explicit",
              "vlSpec": {
                "$schema": "https://vega.github.io/schema/vega-lite/v4.json",
                "mark": {
                  "type": "point",
                  "tooltip": true
                },
                "encoding": {
                  "x": {
                    "field": "Worldwide Gross",
                    "type": "quantitative",
                    "aggregate": null,
                    "axis": {
                      "format": "s"
                    }
                  },
                  "y": {
                    "field": "Production Budget",
                    "type": "quantitative",
                    "aggregate": null,
                    "axis": {
                      "format": "s"
                    }
                  },
                  "column": {
                    "field": "Genre",
                    "type": "nominal",
                    "aggregate": null
                  },
                  "color": {
                    "field": "Genre",
                    "type": "nominal",
                    "aggregate": null
                  },
                  "tooltip": {
                    "field": "Title"
                  }
                },
                "transform": [],
                "data": {
                  "url": "https://raw.githubusercontent.com/nl4dv/nl4dv/master/examples/assets/data/movies-w-year.csv",
                  "format": {
                    "type": "csv"
                  }
                }
              }
            }
          ],
          "attributeMap": {
            "Worldwide Gross": {
              "name": "Worldwide Gross",
              "queryPhrase": [
                "worldwide gross"
              ],
              "inferenceType": "explicit",
              "matchScore": 1,
              "metric": [
                "attribute_exact_match"
              ],
              "isLabel": false,
              "encode": true,
              "isAmbiguous": false,
              "ambiguity": [],
              "meta": {
                "score": 100,
                "threshold": 85,
                "alias": null,
                "ambiguity": {},
                "confidence": 100
              }
            },
            "Production Budget": {
              "name": "Production Budget",
              "queryPhrase": [
                "production budget"
              ],
              "inferenceType": "explicit",
              "matchScore": 1,
              "metric": [
                "attribute_exact_match"
              ],
              "isLabel": false,
              "encode": true,
              "isAmbiguous": false,
              "ambiguity": [],
              "meta": {
                "score": 100,
                "threshold": 85,
                "alias": null,
                "ambiguity": {},
                "confidence": 100
              }
            },
            "Genre": {
              "name": "Genre",
              "queryPhrase": [
                "genre"
              ],
              "inferenceType": "explicit",
              "matchScore": 1,
              "metric": [
                "attribute_exact_match"
              ],
              "isLabel": false,
              "encode": true,
              "isAmbiguous": false,
              "ambiguity": [],
              "meta": {
                "score": 100,
                "threshold": 85,
                "alias": null,
                "ambiguity": {},
                "confidence": 100
              }
            }
          },
          "taskMap": {
            "correlation": [
              {
                "task": "correlation",
                "queryPhrase": [],
                "operator": null,
                "values": null,
                "matchScore": 0.5,
                "attributes": [
                  "Worldwide Gross",
                  "Production Budget"
                ],
                "inferenceType": "implicit",
                "isAttrAmbiguous": false,
                "isValueAmbiguous": false,
                "meta": {
                  "value_ambiguity_type": null
                }
              }
            ]
          },
          "followUpQuery": false,
          "contextObj": null
        }
      },
      {
        "queryId": 72,
        "query": "Line graph of average Production Budget across Release Year",
        "output": {
          "status": "SUCCESS",
          "debug": {
            "execution_durations": {
              "clean_query": 0.007838964462280273,
              "extract_attributes": 0.7150747776031494,
              "extract_vis_type": 0.000030994415283203125,
              "extract_tasks": 1.0648481845855713,
              "get_vis_list": 0.0002589225769042969,
              "total": 1.7880518436431885
            }
          },
          "query_raw": "Line graph of average Production Budget across Release Year",
          "query": "line graph of average production budget across release year",
          "dataset": "https://raw.githubusercontent.com/nl4dv/nl4dv/master/examples/assets/data/movies-w-year.csv",
          "alias": "https://raw.githubusercontent.com/nl4dv/nl4dv/master/examples/assets/aliases/movies-w-year.json",
          "visList": [
            {
              "score": 6,
              "scoreObj": {
                "by_attributes": 2,
                "by_task": 1,
                "by_vis": 1
              },
              "confidenceObj": {
                "Production Budget": 1,
                "Release Year": 1
              },
              "attributes": [
                "Production Budget",
                "Release Year"
              ],
              "queryPhrase": "line graph",
              "visType": "linechart",
              "tasks": [
                "derived_value"
              ],
              "inferenceType": "explicit",
              "vlSpec": {
                "$schema": "https://vega.github.io/schema/vega-lite/v4.json",
                "mark": {
                  "type": "line",
                  "tooltip": true
                },
                "encoding": {
                  "y": {
                    "field": "Production Budget",
                    "type": "quantitative",
                    "aggregate": "mean",
                    "axis": {
                      "format": "s"
                    }
                  },
                  "x": {
                    "field": "Release Year",
                    "type": "temporal",
                    "aggregate": null
                  }
                },
                "transform": [],
                "data": {
                  "url": "https://raw.githubusercontent.com/nl4dv/nl4dv/master/examples/assets/data/movies-w-year.csv",
                  "format": {
                    "type": "csv"
                  }
                }
              }
            }
          ],
          "attributeMap": {
            "Production Budget": {
              "name": "Production Budget",
              "queryPhrase": [
                "production budget"
              ],
              "inferenceType": "explicit",
              "matchScore": 1,
              "metric": [
                "attribute_exact_match"
              ],
              "isLabel": false,
              "encode": true,
              "isAmbiguous": false,
              "ambiguity": [],
              "meta": {
                "score": 100,
                "threshold": 85,
                "alias": null,
                "ambiguity": {},
                "confidence": 100
              }
            },
            "Release Year": {
              "name": "Release Year",
              "queryPhrase": [
                "release year"
              ],
              "inferenceType": "explicit",
              "matchScore": 1,
              "metric": [
                "attribute_exact_match"
              ],
              "isLabel": false,
              "encode": true,
              "isAmbiguous": false,
              "ambiguity": [],
              "meta": {
                "score": 100,
                "threshold": 85,
                "alias": null,
                "ambiguity": {},
                "confidence": 100
              }
            }
          },
          "taskMap": {
            "derived_value": [
              {
                "task": "derived_value",
                "queryPhrase": "average",
                "operator": "AVG",
                "values": [],
                "matchScore": 1,
                "attributes": [
                  "Production Budget"
                ],
                "inferenceType": "explicit",
                "isAttrAmbiguous": false,
                "isValueAmbiguous": false,
                "meta": {
                  "value_ambiguity_type": null
                }
              }
            ]
          },
          "followUpQuery": false,
          "contextObj": null
        }
      },
      {
        "queryId": 73,
        "query": "Line graph of total Worldwide Gross by Major Genre, across Release Year",
        "output": {
          "status": "SUCCESS",
          "debug": {
            "execution_durations": {
              "clean_query": 0.01111602783203125,
              "extract_attributes": 1.023392915725708,
              "extract_vis_type": 0.00004601478576660156,
              "extract_tasks": 1.1188099384307861,
              "get_vis_list": 0.0005891323089599609,
              "total": 2.153954029083252
            }
          },
          "query_raw": "Line graph of total Worldwide Gross by Major Genre, across Release Year",
          "query": "line graph of total worldwide gross by major genre , across release year",
          "dataset": "https://raw.githubusercontent.com/nl4dv/nl4dv/master/examples/assets/data/movies-w-year.csv",
          "alias": "https://raw.githubusercontent.com/nl4dv/nl4dv/master/examples/assets/aliases/movies-w-year.json",
          "visList": [
            {
              "score": 8,
              "scoreObj": {
                "by_attributes": 3,
                "by_task": 1,
                "by_vis": 1
              },
              "confidenceObj": {
                "Worldwide Gross": 1,
                "Genre": 1,
                "Release Year": 1
              },
              "attributes": [
                "Worldwide Gross",
                "Genre",
                "Release Year"
              ],
              "queryPhrase": "line graph",
              "visType": "linechart",
              "tasks": [
                "derived_value"
              ],
              "inferenceType": "explicit",
              "vlSpec": {
                "$schema": "https://vega.github.io/schema/vega-lite/v4.json",
                "mark": {
                  "type": "line",
                  "tooltip": true
                },
                "encoding": {
                  "y": {
                    "field": "Worldwide Gross",
                    "type": "quantitative",
                    "aggregate": "sum",
                    "axis": {
                      "format": "s"
                    }
                  },
                  "color": {
                    "field": "Genre",
                    "type": "nominal",
                    "aggregate": null
                  },
                  "x": {
                    "field": "Release Year",
                    "type": "temporal",
                    "aggregate": null
                  }
                },
                "transform": [],
                "data": {
                  "url": "https://raw.githubusercontent.com/nl4dv/nl4dv/master/examples/assets/data/movies-w-year.csv",
                  "format": {
                    "type": "csv"
                  }
                }
              }
            },
            {
              "score": 8,
              "scoreObj": {
                "by_attributes": 3,
                "by_task": 1,
                "by_vis": 1
              },
              "confidenceObj": {
                "Worldwide Gross": 1,
                "Genre": 1,
                "Release Year": 1
              },
              "attributes": [
                "Worldwide Gross",
                "Genre",
                "Release Year"
              ],
              "queryPhrase": "line graph",
              "visType": "linechart",
              "tasks": [
                "derived_value"
              ],
              "inferenceType": "explicit",
              "vlSpec": {
                "$schema": "https://vega.github.io/schema/vega-lite/v4.json",
                "mark": {
                  "type": "line",
                  "tooltip": true
                },
                "encoding": {
                  "y": {
                    "field": "Worldwide Gross",
                    "type": "quantitative",
                    "aggregate": "sum",
                    "axis": {
                      "format": "s"
                    }
                  },
                  "column": {
                    "field": "Genre",
                    "type": "nominal",
                    "aggregate": null
                  },
                  "x": {
                    "field": "Release Year",
                    "type": "temporal",
                    "aggregate": null
                  },
                  "color": {
                    "field": "Genre",
                    "type": "nominal",
                    "aggregate": null
                  }
                },
                "transform": [],
                "data": {
                  "url": "https://raw.githubusercontent.com/nl4dv/nl4dv/master/examples/assets/data/movies-w-year.csv",
                  "format": {
                    "type": "csv"
                  }
                }
              }
            }
          ],
          "attributeMap": {
            "Worldwide Gross": {
              "name": "Worldwide Gross",
              "queryPhrase": [
                "worldwide gross"
              ],
              "inferenceType": "explicit",
              "matchScore": 1,
              "metric": [
                "attribute_exact_match"
              ],
              "isLabel": false,
              "encode": true,
              "isAmbiguous": false,
              "ambiguity": [],
              "meta": {
                "score": 100,
                "threshold": 85,
                "alias": null,
                "ambiguity": {},
                "confidence": 100
              }
            },
            "Release Year": {
              "name": "Release Year",
              "queryPhrase": [
                "release year"
              ],
              "inferenceType": "explicit",
              "matchScore": 1,
              "metric": [
                "attribute_exact_match"
              ],
              "isLabel": false,
              "encode": true,
              "isAmbiguous": false,
              "ambiguity": [],
              "meta": {
                "score": 100,
                "threshold": 85,
                "alias": null,
                "ambiguity": {},
                "confidence": 100
              }
            },
            "Genre": {
              "name": "Genre",
              "queryPhrase": [
                "genre"
              ],
              "inferenceType": "explicit",
              "matchScore": 1,
              "metric": [
                "attribute_exact_match"
              ],
              "isLabel": false,
              "encode": true,
              "isAmbiguous": false,
              "ambiguity": [],
              "meta": {
                "score": 100,
                "threshold": 85,
                "alias": null,
                "ambiguity": {},
                "confidence": 100
              }
            }
          },
          "taskMap": {
            "derived_value": [
              {
                "task": "derived_value",
                "queryPhrase": "total",
                "operator": "SUM",
                "values": [],
                "matchScore": 1,
                "attributes": [
                  "Worldwide Gross"
                ],
                "inferenceType": "explicit",
                "isAttrAmbiguous": false,
                "isValueAmbiguous": false,
                "meta": {
                  "value_ambiguity_type": null
                }
              }
            ]
          },
          "followUpQuery": false,
          "contextObj": null
        }
      },
      {
        "queryId": 74,
        "query": "Scatterplot of Rotten Tomatoes Rating by IMDB Rating",
        "output": {
          "status": "SUCCESS",
          "debug": {
            "execution_durations": {
              "clean_query": 0.004699230194091797,
              "extract_attributes": 0.44469308853149414,
              "extract_vis_type": 0.000025987625122070312,
              "extract_tasks": 1.0587210655212402,
              "get_vis_list": 0.00020933151245117188,
              "total": 1.5083487033843994
            }
          },
          "query_raw": "Scatterplot of Rotten Tomatoes Rating by IMDB Rating",
          "query": "scatterplot of rotten tomatoes rating by imdb rating",
          "dataset": "https://raw.githubusercontent.com/nl4dv/nl4dv/master/examples/assets/data/movies-w-year.csv",
          "alias": "https://raw.githubusercontent.com/nl4dv/nl4dv/master/examples/assets/aliases/movies-w-year.json",
          "visList": [
            {
              "score": 5.5,
              "scoreObj": {
                "by_attributes": 2,
                "by_task": 0.5,
                "by_vis": 1
              },
              "confidenceObj": {
                "Rotten Tomatoes Rating": 1,
                "IMDB Rating": 1
              },
              "attributes": [
                "Rotten Tomatoes Rating",
                "IMDB Rating"
              ],
              "queryPhrase": "scatterplot",
              "visType": "scatterplot",
              "tasks": [
                "correlation"
              ],
              "inferenceType": "explicit",
              "vlSpec": {
                "$schema": "https://vega.github.io/schema/vega-lite/v4.json",
                "mark": {
                  "type": "point",
                  "tooltip": true
                },
                "encoding": {
                  "x": {
                    "field": "Rotten Tomatoes Rating",
                    "type": "quantitative",
                    "aggregate": null,
                    "axis": {
                      "format": "s"
                    }
                  },
                  "y": {
                    "field": "IMDB Rating",
                    "type": "quantitative",
                    "aggregate": null,
                    "axis": {
                      "format": "s"
                    }
                  },
                  "tooltip": {
                    "field": "Title"
                  }
                },
                "transform": [],
                "data": {
                  "url": "https://raw.githubusercontent.com/nl4dv/nl4dv/master/examples/assets/data/movies-w-year.csv",
                  "format": {
                    "type": "csv"
                  }
                }
              }
            }
          ],
          "attributeMap": {
            "Rotten Tomatoes Rating": {
              "name": "Rotten Tomatoes Rating",
              "queryPhrase": [
                "rotten tomatoes rating"
              ],
              "inferenceType": "explicit",
              "matchScore": 1,
              "metric": [
                "attribute_exact_match"
              ],
              "isLabel": false,
              "encode": true,
              "isAmbiguous": false,
              "ambiguity": [],
              "meta": {
                "score": 100,
                "threshold": 85,
                "alias": null,
                "ambiguity": {},
                "confidence": 100
              }
            },
            "IMDB Rating": {
              "name": "IMDB Rating",
              "queryPhrase": [
                "imdb rating"
              ],
              "inferenceType": "explicit",
              "matchScore": 1,
              "metric": [
                "attribute_exact_match"
              ],
              "isLabel": false,
              "encode": true,
              "isAmbiguous": false,
              "ambiguity": [],
              "meta": {
                "score": 100,
                "threshold": 85,
                "alias": null,
                "ambiguity": {},
                "confidence": 100
              }
            }
          },
          "taskMap": {
            "correlation": [
              {
                "task": "correlation",
                "queryPhrase": [],
                "operator": null,
                "values": null,
                "matchScore": 0.5,
                "attributes": [
                  "Rotten Tomatoes Rating",
                  "IMDB Rating"
                ],
                "inferenceType": "implicit",
                "isAttrAmbiguous": false,
                "isValueAmbiguous": false,
                "meta": {
                  "value_ambiguity_type": null
                }
              }
            ]
          },
          "followUpQuery": false,
          "contextObj": null
        }
      },
      {
        "queryId": 75,
        "query": "Bar chart of total worldwide gross by major genre, by content rating",
        "output": {
          "status": "SUCCESS",
          "debug": {
            "execution_durations": {
              "clean_query": 0.010077953338623047,
              "extract_attributes": 0.7957179546356201,
              "extract_vis_type": 0.00003719329833984375,
              "extract_tasks": 1.1411216259002686,
              "get_vis_list": 0.00047516822814941406,
              "total": 1.947429895401001
            }
          },
          "query_raw": "Bar chart of total worldwide gross by major genre, by content rating",
          "query": "bar chart of total worldwide gross by major genre , by content rating",
          "dataset": "https://raw.githubusercontent.com/nl4dv/nl4dv/master/examples/assets/data/movies-w-year.csv",
          "alias": "https://raw.githubusercontent.com/nl4dv/nl4dv/master/examples/assets/aliases/movies-w-year.json",
          "visList": [
            {
              "score": 8,
              "scoreObj": {
                "by_attributes": 3,
                "by_task": 1,
                "by_vis": 1
              },
              "confidenceObj": {
                "Worldwide Gross": 1,
                "Content Rating": 1,
                "Genre": 1
              },
              "attributes": [
                "Worldwide Gross",
                "Content Rating",
                "Genre"
              ],
              "queryPhrase": "bar chart",
              "visType": "barchart",
              "tasks": [
                "derived_value"
              ],
              "inferenceType": "explicit",
              "vlSpec": {
                "$schema": "https://vega.github.io/schema/vega-lite/v4.json",
                "mark": {
                  "type": "bar",
                  "tooltip": true
                },
                "encoding": {
                  "y": {
                    "field": "Worldwide Gross",
                    "type": "quantitative",
                    "aggregate": "sum",
                    "axis": {
                      "format": "s"
                    }
                  },
                  "x": {
                    "field": "Content Rating",
                    "type": "nominal",
                    "aggregate": null
                  },
                  "color": {
                    "field": "Genre",
                    "type": "nominal",
                    "aggregate": null
                  }
                },
                "transform": [],
                "data": {
                  "url": "https://raw.githubusercontent.com/nl4dv/nl4dv/master/examples/assets/data/movies-w-year.csv",
                  "format": {
                    "type": "csv"
                  }
                }
              }
            },
            {
              "score": 8,
              "scoreObj": {
                "by_attributes": 3,
                "by_task": 1,
                "by_vis": 1
              },
              "confidenceObj": {
                "Worldwide Gross": 1,
                "Content Rating": 1,
                "Genre": 1
              },
              "attributes": [
                "Worldwide Gross",
                "Content Rating",
                "Genre"
              ],
              "queryPhrase": "bar chart",
              "visType": "barchart",
              "tasks": [
                "derived_value"
              ],
              "inferenceType": "explicit",
              "vlSpec": {
                "$schema": "https://vega.github.io/schema/vega-lite/v4.json",
                "mark": {
                  "type": "bar",
                  "tooltip": true
                },
                "encoding": {
                  "y": {
                    "field": "Worldwide Gross",
                    "type": "quantitative",
                    "aggregate": "sum",
                    "axis": {
                      "format": "s"
                    }
                  },
                  "column": {
                    "field": "Content Rating",
                    "type": "nominal",
                    "aggregate": null
                  },
                  "x": {
                    "field": "Genre",
                    "type": "nominal",
                    "aggregate": null
                  },
                  "color": {
                    "field": "Content Rating",
                    "type": "nominal",
                    "aggregate": null
                  }
                },
                "transform": [],
                "data": {
                  "url": "https://raw.githubusercontent.com/nl4dv/nl4dv/master/examples/assets/data/movies-w-year.csv",
                  "format": {
                    "type": "csv"
                  }
                }
              }
            }
          ],
          "attributeMap": {
            "Worldwide Gross": {
              "name": "Worldwide Gross",
              "queryPhrase": [
                "worldwide gross"
              ],
              "inferenceType": "explicit",
              "matchScore": 1,
              "metric": [
                "attribute_exact_match"
              ],
              "isLabel": false,
              "encode": true,
              "isAmbiguous": false,
              "ambiguity": [],
              "meta": {
                "score": 100,
                "threshold": 85,
                "alias": null,
                "ambiguity": {},
                "confidence": 100
              }
            },
            "Content Rating": {
              "name": "Content Rating",
              "queryPhrase": [
                "content rating"
              ],
              "inferenceType": "explicit",
              "matchScore": 1,
              "metric": [
                "attribute_exact_match"
              ],
              "isLabel": false,
              "encode": true,
              "isAmbiguous": false,
              "ambiguity": [],
              "meta": {
                "score": 100,
                "threshold": 85,
                "alias": null,
                "ambiguity": {},
                "confidence": 100
              }
            },
            "Genre": {
              "name": "Genre",
              "queryPhrase": [
                "genre"
              ],
              "inferenceType": "explicit",
              "matchScore": 1,
              "metric": [
                "attribute_exact_match"
              ],
              "isLabel": false,
              "encode": true,
              "isAmbiguous": false,
              "ambiguity": [],
              "meta": {
                "score": 100,
                "threshold": 85,
                "alias": null,
                "ambiguity": {},
                "confidence": 100
              }
            }
          },
          "taskMap": {
            "derived_value": [
              {
                "task": "derived_value",
                "queryPhrase": "total",
                "operator": "SUM",
                "values": [],
                "matchScore": 1,
                "attributes": [
                  "Worldwide Gross"
                ],
                "inferenceType": "explicit",
                "isAttrAmbiguous": false,
                "isValueAmbiguous": false,
                "meta": {
                  "value_ambiguity_type": null
                }
              }
            ]
          },
          "followUpQuery": false,
          "contextObj": null
        }
      },
      {
        "queryId": 76,
        "query": "Count of movies by Creative Type",
        "output": {
          "status": "SUCCESS",
          "debug": {
            "execution_durations": {
              "clean_query": 0.0020029544830322266,
              "extract_attributes": 0.24100208282470703,
              "extract_vis_type": 0.000016927719116210938,
              "extract_tasks": 1.0442371368408203,
              "get_vis_list": 0.0001552104949951172,
              "total": 1.287414312362671
            }
          },
          "query_raw": "Count of movies by Creative Type",
          "query": "count of movies by creative type",
          "dataset": "https://raw.githubusercontent.com/nl4dv/nl4dv/master/examples/assets/data/movies-w-year.csv",
          "alias": "https://raw.githubusercontent.com/nl4dv/nl4dv/master/examples/assets/aliases/movies-w-year.json",
          "visList": [
            {
              "score": 2.5,
              "scoreObj": {
                "by_attributes": 1,
                "by_task": 0.5,
                "by_vis": 0
              },
              "confidenceObj": {
                "Creative Type": 1
              },
              "attributes": [
                "Creative Type"
              ],
              "queryPhrase": null,
              "visType": null,
              "tasks": [
                "distribution"
              ],
              "inferenceType": "implicit",
              "vlSpec": {
                "$schema": "https://vega.github.io/schema/vega-lite/v4.json",
                "mark": {
                  "type": "bar",
                  "tooltip": true
                },
                "encoding": {
                  "x": {
                    "field": "Creative Type",
                    "type": "nominal",
                    "aggregate": null
                  },
                  "y": {
                    "field": "Creative Type",
                    "type": "nominal",
                    "aggregate": "count"
                  }
                },
                "transform": [],
                "data": {
                  "url": "https://raw.githubusercontent.com/nl4dv/nl4dv/master/examples/assets/data/movies-w-year.csv",
                  "format": {
                    "type": "csv"
                  }
                }
              }
            }
          ],
          "attributeMap": {
            "Creative Type": {
              "name": "Creative Type",
              "queryPhrase": [
                "creative type"
              ],
              "inferenceType": "explicit",
              "matchScore": 1,
              "metric": [
                "attribute_exact_match"
              ],
              "isLabel": false,
              "encode": true,
              "isAmbiguous": false,
              "ambiguity": [],
              "meta": {
                "score": 100,
                "threshold": 85,
                "alias": null,
                "ambiguity": {},
                "confidence": 100
              }
            }
          },
          "taskMap": {
            "distribution": [
              {
                "task": "distribution",
                "queryPhrase": [],
                "operator": null,
                "values": null,
                "matchScore": 0.5,
                "attributes": [
                  "Creative Type"
                ],
                "inferenceType": "implicit",
                "isAttrAmbiguous": false,
                "isValueAmbiguous": false,
                "meta": {
                  "value_ambiguity_type": null
                }
              }
            ]
          },
          "followUpQuery": false,
          "contextObj": null
        }
      },
      {
        "queryId": 77,
        "query": "Bar chart of average worldwide gross by major genre",
        "output": {
          "status": "SUCCESS",
          "debug": {
            "execution_durations": {
              "clean_query": 0.00600886344909668,
              "extract_attributes": 0.49608516693115234,
              "extract_vis_type": 0.000023126602172851562,
              "extract_tasks": 1.0620977878570557,
              "get_vis_list": 0.0002989768981933594,
              "total": 1.564513921737671
            }
          },
          "query_raw": "Bar chart of average worldwide gross by major genre",
          "query": "bar chart of average worldwide gross by major genre",
          "dataset": "https://raw.githubusercontent.com/nl4dv/nl4dv/master/examples/assets/data/movies-w-year.csv",
          "alias": "https://raw.githubusercontent.com/nl4dv/nl4dv/master/examples/assets/aliases/movies-w-year.json",
          "visList": [
            {
              "score": 6,
              "scoreObj": {
                "by_attributes": 2,
                "by_task": 1,
                "by_vis": 1
              },
              "confidenceObj": {
                "Worldwide Gross": 1,
                "Genre": 1
              },
              "attributes": [
                "Worldwide Gross",
                "Genre"
              ],
              "queryPhrase": "bar chart",
              "visType": "barchart",
              "tasks": [
                "derived_value"
              ],
              "inferenceType": "explicit",
              "vlSpec": {
                "$schema": "https://vega.github.io/schema/vega-lite/v4.json",
                "mark": {
                  "type": "bar",
                  "tooltip": true
                },
                "encoding": {
                  "y": {
                    "field": "Worldwide Gross",
                    "type": "quantitative",
                    "aggregate": "mean",
                    "axis": {
                      "format": "s"
                    }
                  },
                  "x": {
                    "field": "Genre",
                    "type": "nominal",
                    "aggregate": null
                  }
                },
                "transform": [],
                "data": {
                  "url": "https://raw.githubusercontent.com/nl4dv/nl4dv/master/examples/assets/data/movies-w-year.csv",
                  "format": {
                    "type": "csv"
                  }
                }
              }
            }
          ],
          "attributeMap": {
            "Worldwide Gross": {
              "name": "Worldwide Gross",
              "queryPhrase": [
                "worldwide gross"
              ],
              "inferenceType": "explicit",
              "matchScore": 1,
              "metric": [
                "attribute_exact_match"
              ],
              "isLabel": false,
              "encode": true,
              "isAmbiguous": false,
              "ambiguity": [],
              "meta": {
                "score": 100,
                "threshold": 85,
                "alias": null,
                "ambiguity": {},
                "confidence": 100
              }
            },
            "Genre": {
              "name": "Genre",
              "queryPhrase": [
                "genre"
              ],
              "inferenceType": "explicit",
              "matchScore": 1,
              "metric": [
                "attribute_exact_match"
              ],
              "isLabel": false,
              "encode": true,
              "isAmbiguous": false,
              "ambiguity": [],
              "meta": {
                "score": 100,
                "threshold": 85,
                "alias": null,
                "ambiguity": {},
                "confidence": 100
              }
            }
          },
          "taskMap": {
            "derived_value": [
              {
                "task": "derived_value",
                "queryPhrase": "average",
                "operator": "AVG",
                "values": [],
                "matchScore": 1,
                "attributes": [
                  "Worldwide Gross"
                ],
                "inferenceType": "explicit",
                "isAttrAmbiguous": false,
                "isValueAmbiguous": false,
                "meta": {
                  "value_ambiguity_type": null
                }
              }
            ]
          },
          "followUpQuery": false,
          "contextObj": null
        }
      },
      {
        "queryId": 78,
        "query": "give me a bar chart of worldwide gross sum by major genres stacked by content ratings",
        "output": {
          "status": "SUCCESS",
          "debug": {
            "execution_durations": {
              "clean_query": 0.015417098999023438,
              "extract_attributes": 1.2164647579193115,
              "extract_vis_type": 0.00005817413330078125,
              "extract_tasks": 1.1771290302276611,
              "get_vis_list": 0.0004570484161376953,
              "total": 2.4095261096954346
            }
          },
          "query_raw": "give me a bar chart of worldwide gross sum by major genres stacked by content ratings",
          "query": "give me a bar chart of worldwide gross sum by major genres stacked by content ratings",
          "dataset": "https://raw.githubusercontent.com/nl4dv/nl4dv/master/examples/assets/data/movies-w-year.csv",
          "alias": "https://raw.githubusercontent.com/nl4dv/nl4dv/master/examples/assets/aliases/movies-w-year.json",
          "visList": [
            {
              "score": 8,
              "scoreObj": {
                "by_attributes": 3,
                "by_task": 1,
                "by_vis": 1
              },
              "confidenceObj": {
                "Worldwide Gross": 1,
                "Content Rating": 1,
                "Genre": 1
              },
              "attributes": [
                "Worldwide Gross",
                "Content Rating",
                "Genre"
              ],
              "queryPhrase": "bar chart",
              "visType": "barchart",
              "tasks": [
                "derived_value"
              ],
              "inferenceType": "explicit",
              "vlSpec": {
                "$schema": "https://vega.github.io/schema/vega-lite/v4.json",
                "mark": {
                  "type": "bar",
                  "tooltip": true
                },
                "encoding": {
                  "y": {
                    "field": "Worldwide Gross",
                    "type": "quantitative",
                    "aggregate": "sum",
                    "axis": {
                      "format": "s"
                    }
                  },
                  "x": {
                    "field": "Content Rating",
                    "type": "nominal",
                    "aggregate": null
                  },
                  "color": {
                    "field": "Genre",
                    "type": "nominal",
                    "aggregate": null
                  }
                },
                "transform": [],
                "data": {
                  "url": "https://raw.githubusercontent.com/nl4dv/nl4dv/master/examples/assets/data/movies-w-year.csv",
                  "format": {
                    "type": "csv"
                  }
                }
              }
            },
            {
              "score": 8,
              "scoreObj": {
                "by_attributes": 3,
                "by_task": 1,
                "by_vis": 1
              },
              "confidenceObj": {
                "Worldwide Gross": 1,
                "Content Rating": 1,
                "Genre": 1
              },
              "attributes": [
                "Worldwide Gross",
                "Content Rating",
                "Genre"
              ],
              "queryPhrase": "bar chart",
              "visType": "barchart",
              "tasks": [
                "derived_value"
              ],
              "inferenceType": "explicit",
              "vlSpec": {
                "$schema": "https://vega.github.io/schema/vega-lite/v4.json",
                "mark": {
                  "type": "bar",
                  "tooltip": true
                },
                "encoding": {
                  "y": {
                    "field": "Worldwide Gross",
                    "type": "quantitative",
                    "aggregate": "sum",
                    "axis": {
                      "format": "s"
                    }
                  },
                  "column": {
                    "field": "Content Rating",
                    "type": "nominal",
                    "aggregate": null
                  },
                  "x": {
                    "field": "Genre",
                    "type": "nominal",
                    "aggregate": null
                  },
                  "color": {
                    "field": "Content Rating",
                    "type": "nominal",
                    "aggregate": null
                  }
                },
                "transform": [],
                "data": {
                  "url": "https://raw.githubusercontent.com/nl4dv/nl4dv/master/examples/assets/data/movies-w-year.csv",
                  "format": {
                    "type": "csv"
                  }
                }
              }
            }
          ],
          "attributeMap": {
            "Worldwide Gross": {
              "name": "Worldwide Gross",
              "queryPhrase": [
                "worldwide gross"
              ],
              "inferenceType": "explicit",
              "matchScore": 1,
              "metric": [
                "attribute_exact_match"
              ],
              "isLabel": false,
              "encode": true,
              "isAmbiguous": false,
              "ambiguity": [],
              "meta": {
                "score": 100,
                "threshold": 85,
                "alias": null,
                "ambiguity": {},
                "confidence": 100
              }
            },
            "Content Rating": {
              "name": "Content Rating",
              "queryPhrase": [
                "content ratings"
              ],
              "inferenceType": "explicit",
              "matchScore": 1,
              "metric": [
                "attribute_exact_match"
              ],
              "isLabel": false,
              "encode": true,
              "isAmbiguous": false,
              "ambiguity": [],
              "meta": {
                "score": 100,
                "threshold": 85,
                "alias": null,
                "ambiguity": {},
                "confidence": 100
              }
            },
            "Genre": {
              "name": "Genre",
              "queryPhrase": [
                "genres"
              ],
              "inferenceType": "explicit",
              "matchScore": 1,
              "metric": [
                "attribute_exact_match"
              ],
              "isLabel": false,
              "encode": true,
              "isAmbiguous": false,
              "ambiguity": [],
              "meta": {
                "score": 100,
                "threshold": 85,
                "alias": null,
                "ambiguity": {},
                "confidence": 100
              }
            }
          },
          "taskMap": {
            "derived_value": [
              {
                "task": "derived_value",
                "queryPhrase": "sum",
                "operator": "SUM",
                "values": [],
                "matchScore": 1,
                "attributes": [
                  "Worldwide Gross"
                ],
                "inferenceType": "explicit",
                "isAttrAmbiguous": false,
                "isValueAmbiguous": false,
                "meta": {
                  "value_ambiguity_type": null
                }
              },
              {
                "task": "derived_value",
                "queryPhrase": "sum",
                "operator": "SUM",
                "values": [],
                "matchScore": 1,
                "attributes": [
                  "Genre"
                ],
                "inferenceType": "explicit",
                "isAttrAmbiguous": false,
                "isValueAmbiguous": true,
                "meta": {
                  "value_ambiguity_type": "datatype"
                }
              }
            ]
          },
          "followUpQuery": false,
          "contextObj": null
        }
      },
      {
        "queryId": 79,
        "query": "What was the average production budget of movies by year?",
        "output": {
          "status": "SUCCESS",
          "debug": {
            "execution_durations": {
              "clean_query": 0.0021479129791259766,
              "extract_attributes": 0.19141626358032227,
              "extract_vis_type": 0.00002002716064453125,
              "extract_tasks": 1.0734970569610596,
              "get_vis_list": 0.0003018379211425781,
              "total": 1.267383098602295
            }
          },
          "query_raw": "What was the average production budget of movies by year?",
          "query": "what was the average production budget of movies by year ?",
          "dataset": "https://raw.githubusercontent.com/nl4dv/nl4dv/master/examples/assets/data/movies-w-year.csv",
          "alias": "https://raw.githubusercontent.com/nl4dv/nl4dv/master/examples/assets/aliases/movies-w-year.json",
          "visList": [
            {
              "score": 4.9,
              "scoreObj": {
                "by_attributes": 1.9,
                "by_task": 1,
                "by_vis": 0
              },
              "confidenceObj": {
                "Production Budget": 1,
                "Release Year": 1
              },
              "attributes": [
                "Production Budget",
                "Release Year"
              ],
              "queryPhrase": null,
              "visType": null,
              "tasks": [
                "derived_value"
              ],
              "inferenceType": "implicit",
              "vlSpec": {
                "$schema": "https://vega.github.io/schema/vega-lite/v4.json",
                "mark": {
                  "type": "line",
                  "tooltip": true
                },
                "encoding": {
                  "y": {
                    "field": "Production Budget",
                    "type": "quantitative",
                    "aggregate": "mean",
                    "axis": {
                      "format": "s"
                    }
                  },
                  "x": {
                    "field": "Release Year",
                    "type": "temporal",
                    "aggregate": null
                  }
                },
                "transform": [],
                "data": {
                  "url": "https://raw.githubusercontent.com/nl4dv/nl4dv/master/examples/assets/data/movies-w-year.csv",
                  "format": {
                    "type": "csv"
                  }
                }
              }
            },
            {
              "score": 4.9,
              "scoreObj": {
                "by_attributes": 1.9,
                "by_task": 1,
                "by_vis": 0
              },
              "confidenceObj": {
                "Production Budget": 1,
                "Release Year": 1
              },
              "attributes": [
                "Production Budget",
                "Release Year"
              ],
              "queryPhrase": null,
              "visType": null,
              "tasks": [
                "derived_value"
              ],
              "inferenceType": "implicit",
              "vlSpec": {
                "$schema": "https://vega.github.io/schema/vega-lite/v4.json",
                "mark": {
                  "type": "tick",
                  "tooltip": true
                },
                "encoding": {
                  "y": {
                    "field": "Production Budget",
                    "type": "quantitative",
                    "aggregate": "mean",
                    "axis": {
                      "format": "s"
                    }
                  },
                  "x": {
                    "field": "Release Year",
                    "type": "temporal",
                    "aggregate": null
                  }
                },
                "transform": [],
                "data": {
                  "url": "https://raw.githubusercontent.com/nl4dv/nl4dv/master/examples/assets/data/movies-w-year.csv",
                  "format": {
                    "type": "csv"
                  }
                }
              }
            }
          ],
          "attributeMap": {
            "Production Budget": {
              "name": "Production Budget",
              "queryPhrase": [
                "production budget"
              ],
              "inferenceType": "explicit",
              "matchScore": 1,
              "metric": [
                "attribute_exact_match"
              ],
              "isLabel": false,
              "encode": true,
              "isAmbiguous": false,
              "ambiguity": [],
              "meta": {
                "score": 100,
                "threshold": 85,
                "alias": null,
                "ambiguity": {},
                "confidence": 100
              }
            },
            "Release Year": {
              "name": "Release Year",
              "queryPhrase": [
                "year"
              ],
              "inferenceType": "explicit",
              "matchScore": 0.9,
              "metric": [
                "attribute_similarity_match"
              ],
              "isLabel": false,
              "encode": true,
              "isAmbiguous": false,
              "ambiguity": [],
              "meta": {
                "score": 100,
                "threshold": 85,
                "alias": null,
                "ambiguity": {},
                "confidence": 100
              }
            }
          },
          "taskMap": {
            "derived_value": [
              {
                "task": "derived_value",
                "queryPhrase": "average",
                "operator": "AVG",
                "values": [],
                "matchScore": 1,
                "attributes": [
                  "Production Budget"
                ],
                "inferenceType": "explicit",
                "isAttrAmbiguous": false,
                "isValueAmbiguous": false,
                "meta": {
                  "value_ambiguity_type": null
                }
              }
            ]
          },
          "followUpQuery": false,
          "contextObj": null
        }
      },
      {
        "queryId": 80,
        "query": "Plot IMDB rating against Rotten Tomatoes rating.",
        "output": {
          "status": "SUCCESS",
          "debug": {
            "execution_durations": {
              "clean_query": 0.005197048187255859,
              "extract_attributes": 0.346682071685791,
              "extract_vis_type": 0.000028133392333984375,
              "extract_tasks": 1.0244457721710205,
              "get_vis_list": 0.0001819133758544922,
              "total": 1.3765349388122559
            }
          },
          "query_raw": "Plot IMDB rating against Rotten Tomatoes rating.",
          "query": "plot imdb rating against rotten tomatoes rating .",
          "dataset": "https://raw.githubusercontent.com/nl4dv/nl4dv/master/examples/assets/data/movies-w-year.csv",
          "alias": "https://raw.githubusercontent.com/nl4dv/nl4dv/master/examples/assets/aliases/movies-w-year.json",
          "visList": [
            {
              "score": 4.5,
              "scoreObj": {
                "by_attributes": 2,
                "by_task": 0.5,
                "by_vis": 0
              },
              "confidenceObj": {
                "Rotten Tomatoes Rating": 1,
                "IMDB Rating": 1
              },
              "attributes": [
                "Rotten Tomatoes Rating",
                "IMDB Rating"
              ],
              "queryPhrase": null,
              "visType": null,
              "tasks": [
                "correlation"
              ],
              "inferenceType": "implicit",
              "vlSpec": {
                "$schema": "https://vega.github.io/schema/vega-lite/v4.json",
                "mark": {
                  "type": "point",
                  "tooltip": true
                },
                "encoding": {
                  "x": {
                    "field": "Rotten Tomatoes Rating",
                    "type": "quantitative",
                    "aggregate": null,
                    "axis": {
                      "format": "s"
                    }
                  },
                  "y": {
                    "field": "IMDB Rating",
                    "type": "quantitative",
                    "aggregate": null,
                    "axis": {
                      "format": "s"
                    }
                  },
                  "tooltip": {
                    "field": "Title"
                  }
                },
                "transform": [],
                "data": {
                  "url": "https://raw.githubusercontent.com/nl4dv/nl4dv/master/examples/assets/data/movies-w-year.csv",
                  "format": {
                    "type": "csv"
                  }
                }
              }
            }
          ],
          "attributeMap": {
            "Rotten Tomatoes Rating": {
              "name": "Rotten Tomatoes Rating",
              "queryPhrase": [
                "rotten tomatoes rating"
              ],
              "inferenceType": "explicit",
              "matchScore": 1,
              "metric": [
                "attribute_exact_match"
              ],
              "isLabel": false,
              "encode": true,
              "isAmbiguous": false,
              "ambiguity": [],
              "meta": {
                "score": 100,
                "threshold": 85,
                "alias": null,
                "ambiguity": {},
                "confidence": 100
              }
            },
            "IMDB Rating": {
              "name": "IMDB Rating",
              "queryPhrase": [
                "imdb rating"
              ],
              "inferenceType": "explicit",
              "matchScore": 1,
              "metric": [
                "attribute_exact_match"
              ],
              "isLabel": false,
              "encode": true,
              "isAmbiguous": false,
              "ambiguity": [],
              "meta": {
                "score": 100,
                "threshold": 85,
                "alias": null,
                "ambiguity": {},
                "confidence": 100
              }
            }
          },
          "taskMap": {
            "correlation": [
              {
                "task": "correlation",
                "queryPhrase": [],
                "operator": null,
                "values": null,
                "matchScore": 0.5,
                "attributes": [
                  "Rotten Tomatoes Rating",
                  "IMDB Rating"
                ],
                "inferenceType": "implicit",
                "isAttrAmbiguous": false,
                "isValueAmbiguous": false,
                "meta": {
                  "value_ambiguity_type": null
                }
              }
            ]
          },
          "followUpQuery": false,
          "contextObj": null
        }
      },
      {
        "queryId": 81,
        "query": "I want to see trend of production budget by the release year",
        "output": {
          "status": "SUCCESS",
          "debug": {
            "execution_durations": {
              "clean_query": 0.006155967712402344,
              "extract_attributes": 0.5385839939117432,
              "extract_vis_type": 0.000035762786865234375,
              "extract_tasks": 1.0527899265289307,
              "get_vis_list": 0.0002601146697998047,
              "total": 1.5978257656097412
            }
          },
          "query_raw": "I want to see trend of production budget by the release year",
          "query": "i want to see trend of production budget by the release year",
          "dataset": "https://raw.githubusercontent.com/nl4dv/nl4dv/master/examples/assets/data/movies-w-year.csv",
          "alias": "https://raw.githubusercontent.com/nl4dv/nl4dv/master/examples/assets/aliases/movies-w-year.json",
          "visList": [
            {
              "score": 4,
              "scoreObj": {
                "by_attributes": 2,
                "by_task": 0,
                "by_vis": 0
              },
              "confidenceObj": {
                "Production Budget": 1,
                "Release Year": 1
              },
              "attributes": [
                "Production Budget",
                "Release Year"
              ],
              "queryPhrase": null,
              "visType": null,
              "tasks": [
                "trend"
              ],
              "inferenceType": "implicit",
              "vlSpec": {
                "$schema": "https://vega.github.io/schema/vega-lite/v4.json",
                "mark": {
                  "type": "line",
                  "tooltip": true
                },
                "encoding": {
                  "y": {
                    "field": "Production Budget",
                    "type": "quantitative",
                    "aggregate": "mean",
                    "axis": {
                      "format": "s"
                    }
                  },
                  "x": {
                    "field": "Release Year",
                    "type": "temporal",
                    "aggregate": null
                  }
                },
                "transform": [],
                "data": {
                  "url": "https://raw.githubusercontent.com/nl4dv/nl4dv/master/examples/assets/data/movies-w-year.csv",
                  "format": {
                    "type": "csv"
                  }
                }
              }
            }
          ],
          "attributeMap": {
            "Production Budget": {
              "name": "Production Budget",
              "queryPhrase": [
                "production budget"
              ],
              "inferenceType": "explicit",
              "matchScore": 1,
              "metric": [
                "attribute_exact_match"
              ],
              "isLabel": false,
              "encode": true,
              "isAmbiguous": false,
              "ambiguity": [],
              "meta": {
                "score": 100,
                "threshold": 85,
                "alias": null,
                "ambiguity": {},
                "confidence": 100
              }
            },
            "Release Year": {
              "name": "Release Year",
              "queryPhrase": [
                "release year"
              ],
              "inferenceType": "explicit",
              "matchScore": 1,
              "metric": [
                "attribute_exact_match"
              ],
              "isLabel": false,
              "encode": true,
              "isAmbiguous": false,
              "ambiguity": [],
              "meta": {
                "score": 100,
                "threshold": 85,
                "alias": null,
                "ambiguity": {},
                "confidence": 100
              }
            }
          },
          "taskMap": {
            "trend": [
              {
                "task": "trend",
                "queryPhrase": "trend",
                "operator": null,
                "values": [],
                "matchScore": 1,
                "attributes": [
                  "Production Budget"
                ],
                "inferenceType": "explicit",
                "isAttrAmbiguous": false,
                "isValueAmbiguous": true,
                "meta": {
                  "value_ambiguity_type": "datatype"
                }
              }
            ]
          },
          "followUpQuery": false,
          "contextObj": null
        }
      },
      {
        "queryId": 82,
        "query": "plot average worldwide growth over major genre",
        "output": {
          "status": "SUCCESS",
          "debug": {
            "execution_durations": {
              "clean_query": 0.004046201705932617,
              "extract_attributes": 0.3777179718017578,
              "extract_vis_type": 0.000030994415283203125,
              "extract_tasks": 1.0804429054260254,
              "get_vis_list": 0.00033211708068847656,
              "total": 1.4625701904296875
            }
          },
          "query_raw": "plot average worldwide growth over major genre",
          "query": "plot average worldwide growth over major genre",
          "dataset": "https://raw.githubusercontent.com/nl4dv/nl4dv/master/examples/assets/data/movies-w-year.csv",
          "alias": "https://raw.githubusercontent.com/nl4dv/nl4dv/master/examples/assets/aliases/movies-w-year.json",
          "visList": [
            {
              "score": 4.4,
              "scoreObj": {
                "by_attributes": 1.9,
                "by_task": 0.5,
                "by_vis": 0
              },
              "confidenceObj": {
                "Worldwide Gross": 1,
                "Genre": 1
              },
              "attributes": [
                "Worldwide Gross",
                "Genre"
              ],
              "queryPhrase": null,
              "visType": null,
              "tasks": [
                "derived_value"
              ],
              "inferenceType": "implicit",
              "vlSpec": {
                "$schema": "https://vega.github.io/schema/vega-lite/v4.json",
                "mark": {
                  "type": "bar",
                  "tooltip": true
                },
                "encoding": {
                  "y": {
                    "field": "Worldwide Gross",
                    "type": "quantitative",
                    "aggregate": "mean",
                    "axis": {
                      "format": "s"
                    }
                  },
                  "x": {
                    "field": "Genre",
                    "type": "nominal",
                    "aggregate": null
                  }
                },
                "transform": [],
                "data": {
                  "url": "https://raw.githubusercontent.com/nl4dv/nl4dv/master/examples/assets/data/movies-w-year.csv",
                  "format": {
                    "type": "csv"
                  }
                }
              }
            }
          ],
          "attributeMap": {
            "Genre": {
              "name": "Genre",
              "queryPhrase": [
                "genre"
              ],
              "inferenceType": "explicit",
              "matchScore": 1,
              "metric": [
                "attribute_exact_match"
              ],
              "isLabel": false,
              "encode": true,
              "isAmbiguous": false,
              "ambiguity": [],
              "meta": {
                "score": 100,
                "threshold": 85,
                "alias": null,
                "ambiguity": {},
                "confidence": 100
              }
            },
            "Worldwide Gross": {
              "name": "Worldwide Gross",
              "queryPhrase": [
                "worldwide"
              ],
              "inferenceType": "explicit",
              "matchScore": 0.9,
              "metric": [
                "attribute_similarity_match"
              ],
              "isLabel": false,
              "encode": true,
              "isAmbiguous": false,
              "ambiguity": [],
              "meta": {
                "score": 100,
                "threshold": 85,
                "alias": null,
                "ambiguity": {},
                "confidence": 100
              }
            }
          },
          "taskMap": {
            "derived_value": [
              {
                "task": "derived_value",
                "queryPhrase": [],
                "operator": "AVG",
                "values": null,
                "matchScore": 0.5,
                "attributes": [
                  "Worldwide Gross"
                ],
                "inferenceType": "implicit",
                "isAttrAmbiguous": false,
                "isValueAmbiguous": false,
                "meta": {
                  "value_ambiguity_type": null
                }
              }
            ]
          },
          "followUpQuery": false,
          "contextObj": null
        }
      },
      {
        "queryId": 83,
        "query": "Stack bar chart of SUM(worldwide gross) vs. movie genre based on content rating",
        "output": {
          "status": "SUCCESS",
          "debug": {
            "execution_durations": {
              "clean_query": 0.0159609317779541,
              "extract_attributes": 1.1857051849365234,
              "extract_vis_type": 0.00005316734313964844,
              "extract_tasks": 1.170104742050171,
              "get_vis_list": 0.0004849433898925781,
              "total": 2.3723089694976807
            }
          },
          "query_raw": "Stack bar chart of SUM(worldwide gross) vs. movie genre based on content rating",
          "query": "stack bar chart of sum ( worldwide gross ) vs. movie genre based on content rating",
          "dataset": "https://raw.githubusercontent.com/nl4dv/nl4dv/master/examples/assets/data/movies-w-year.csv",
          "alias": "https://raw.githubusercontent.com/nl4dv/nl4dv/master/examples/assets/aliases/movies-w-year.json",
          "visList": [
            {
              "score": 7,
              "scoreObj": {
                "by_attributes": 3,
                "by_task": 0,
                "by_vis": 1
              },
              "confidenceObj": {
                "Worldwide Gross": 1,
                "Content Rating": 1,
                "Genre": 1
              },
              "attributes": [
                "Worldwide Gross",
                "Content Rating",
                "Genre"
              ],
              "queryPhrase": "bar chart",
              "visType": "barchart",
              "tasks": [
                "derived_value"
              ],
              "inferenceType": "explicit",
              "vlSpec": {
                "$schema": "https://vega.github.io/schema/vega-lite/v4.json",
                "mark": {
                  "type": "bar",
                  "tooltip": true
                },
                "encoding": {
                  "y": {
                    "field": "Worldwide Gross",
                    "type": "quantitative",
                    "aggregate": "sum",
                    "axis": {
                      "format": "s"
                    }
                  },
                  "x": {
                    "field": "Content Rating",
                    "type": "nominal",
                    "aggregate": null
                  },
                  "color": {
                    "field": "Genre",
                    "type": "nominal",
                    "aggregate": null
                  }
                },
                "transform": [],
                "data": {
                  "url": "https://raw.githubusercontent.com/nl4dv/nl4dv/master/examples/assets/data/movies-w-year.csv",
                  "format": {
                    "type": "csv"
                  }
                }
              }
            },
            {
              "score": 7,
              "scoreObj": {
                "by_attributes": 3,
                "by_task": 0,
                "by_vis": 1
              },
              "confidenceObj": {
                "Worldwide Gross": 1,
                "Content Rating": 1,
                "Genre": 1
              },
              "attributes": [
                "Worldwide Gross",
                "Content Rating",
                "Genre"
              ],
              "queryPhrase": "bar chart",
              "visType": "barchart",
              "tasks": [
                "derived_value"
              ],
              "inferenceType": "explicit",
              "vlSpec": {
                "$schema": "https://vega.github.io/schema/vega-lite/v4.json",
                "mark": {
                  "type": "bar",
                  "tooltip": true
                },
                "encoding": {
                  "y": {
                    "field": "Worldwide Gross",
                    "type": "quantitative",
                    "aggregate": "mean",
                    "axis": {
                      "format": "s"
                    }
                  },
                  "column": {
                    "field": "Content Rating",
                    "type": "nominal",
                    "aggregate": null
                  },
                  "x": {
                    "field": "Genre",
                    "type": "nominal",
                    "aggregate": null
                  },
                  "color": {
                    "field": "Content Rating",
                    "type": "nominal",
                    "aggregate": null
                  }
                },
                "transform": [],
                "data": {
                  "url": "https://raw.githubusercontent.com/nl4dv/nl4dv/master/examples/assets/data/movies-w-year.csv",
                  "format": {
                    "type": "csv"
                  }
                }
              }
            }
          ],
          "attributeMap": {
            "Worldwide Gross": {
              "name": "Worldwide Gross",
              "queryPhrase": [
                "worldwide gross"
              ],
              "inferenceType": "explicit",
              "matchScore": 1,
              "metric": [
                "attribute_exact_match"
              ],
              "isLabel": false,
              "encode": true,
              "isAmbiguous": false,
              "ambiguity": [],
              "meta": {
                "score": 100,
                "threshold": 85,
                "alias": null,
                "ambiguity": {},
                "confidence": 100
              }
            },
            "Content Rating": {
              "name": "Content Rating",
              "queryPhrase": [
                "content rating"
              ],
              "inferenceType": "explicit",
              "matchScore": 1,
              "metric": [
                "attribute_exact_match"
              ],
              "isLabel": false,
              "encode": true,
              "isAmbiguous": false,
              "ambiguity": [],
              "meta": {
                "score": 100,
                "threshold": 85,
                "alias": null,
                "ambiguity": {},
                "confidence": 100
              }
            },
            "Genre": {
              "name": "Genre",
              "queryPhrase": [
                "genre"
              ],
              "inferenceType": "explicit",
              "matchScore": 1,
              "metric": [
                "attribute_exact_match"
              ],
              "isLabel": false,
              "encode": true,
              "isAmbiguous": false,
              "ambiguity": [],
              "meta": {
                "score": 100,
                "threshold": 85,
                "alias": null,
                "ambiguity": {},
                "confidence": 100
              }
            }
          },
          "taskMap": {
            "derived_value": [
              {
                "task": "derived_value",
                "queryPhrase": "sum",
                "operator": "SUM",
                "values": [],
                "matchScore": 1,
                "attributes": [
                  "Genre"
                ],
                "inferenceType": "explicit",
                "isAttrAmbiguous": false,
                "isValueAmbiguous": true,
                "meta": {
                  "value_ambiguity_type": "datatype"
                }
              }
            ]
          },
          "followUpQuery": false,
          "contextObj": null
        }
      },
      {
        "queryId": 84,
        "query": "counts of movies by creative type",
        "output": {
          "status": "SUCCESS",
          "debug": {
            "execution_durations": {
              "clean_query": 0.0016651153564453125,
              "extract_attributes": 0.11928796768188477,
              "extract_vis_type": 0.000023126602172851562,
              "extract_tasks": 1.0643088817596436,
              "get_vis_list": 0.00015211105346679688,
              "total": 1.1854372024536133
            }
          },
          "query_raw": "counts of movies by creative type",
          "query": "counts of movies by creative type",
          "dataset": "https://raw.githubusercontent.com/nl4dv/nl4dv/master/examples/assets/data/movies-w-year.csv",
          "alias": "https://raw.githubusercontent.com/nl4dv/nl4dv/master/examples/assets/aliases/movies-w-year.json",
          "visList": [
            {
              "score": 2.5,
              "scoreObj": {
                "by_attributes": 1,
                "by_task": 0.5,
                "by_vis": 0
              },
              "confidenceObj": {
                "Creative Type": 1
              },
              "attributes": [
                "Creative Type"
              ],
              "queryPhrase": null,
              "visType": null,
              "tasks": [
                "distribution"
              ],
              "inferenceType": "implicit",
              "vlSpec": {
                "$schema": "https://vega.github.io/schema/vega-lite/v4.json",
                "mark": {
                  "type": "bar",
                  "tooltip": true
                },
                "encoding": {
                  "x": {
                    "field": "Creative Type",
                    "type": "nominal",
                    "aggregate": null
                  },
                  "y": {
                    "field": "Creative Type",
                    "type": "nominal",
                    "aggregate": "count"
                  }
                },
                "transform": [],
                "data": {
                  "url": "https://raw.githubusercontent.com/nl4dv/nl4dv/master/examples/assets/data/movies-w-year.csv",
                  "format": {
                    "type": "csv"
                  }
                }
              }
            }
          ],
          "attributeMap": {
            "Creative Type": {
              "name": "Creative Type",
              "queryPhrase": [
                "creative type"
              ],
              "inferenceType": "explicit",
              "matchScore": 1,
              "metric": [
                "attribute_exact_match"
              ],
              "isLabel": false,
              "encode": true,
              "isAmbiguous": false,
              "ambiguity": [],
              "meta": {
                "score": 100,
                "threshold": 85,
                "alias": null,
                "ambiguity": {},
                "confidence": 100
              }
            }
          },
          "taskMap": {
            "distribution": [
              {
                "task": "distribution",
                "queryPhrase": [],
                "operator": null,
                "values": null,
                "matchScore": 0.5,
                "attributes": [
                  "Creative Type"
                ],
                "inferenceType": "implicit",
                "isAttrAmbiguous": false,
                "isValueAmbiguous": false,
                "meta": {
                  "value_ambiguity_type": null
                }
              }
            ]
          },
          "followUpQuery": false,
          "contextObj": null
        }
      },
      {
        "queryId": 85,
        "query": "Rating of movies in IMBD and Rotten Tomatoes",
        "output": {
          "status": "SUCCESS",
          "debug": {
            "execution_durations": {
              "clean_query": 0.0025899410247802734,
              "extract_attributes": 0.17076778411865234,
              "extract_vis_type": 0.00001811981201171875,
              "extract_tasks": 1.095890998840332,
              "get_vis_list": 0.00046706199645996094,
              "total": 1.2697339057922363
            }
          },
          "query_raw": "Rating of movies in IMBD and Rotten Tomatoes",
          "query": "rating of movies in imbd and rotten tomatoes",
          "dataset": "https://raw.githubusercontent.com/nl4dv/nl4dv/master/examples/assets/data/movies-w-year.csv",
          "alias": "https://raw.githubusercontent.com/nl4dv/nl4dv/master/examples/assets/aliases/movies-w-year.json",
          "visList": [
            {
              "score": 4.39,
              "scoreObj": {
                "by_attributes": 1.8,
                "by_task": 1,
                "by_vis": 0
              },
              "confidenceObj": {
                "Rotten Tomatoes Rating": 1,
                "IMDB Rating": 0.59
              },
              "attributes": [
                "Rotten Tomatoes Rating",
                "IMDB Rating"
              ],
              "queryPhrase": null,
              "visType": null,
              "tasks": [
                "derived_value",
                "correlation"
              ],
              "inferenceType": "implicit",
              "vlSpec": {
                "$schema": "https://vega.github.io/schema/vega-lite/v4.json",
                "mark": {
                  "type": "point",
                  "tooltip": true
                },
                "encoding": {
                  "x": {
                    "field": "Rotten Tomatoes Rating",
                    "type": "quantitative",
                    "aggregate": null,
                    "axis": {
                      "format": "s"
                    }
                  },
                  "y": {
                    "field": "IMDB Rating",
                    "type": "quantitative",
                    "aggregate": null,
                    "axis": {
                      "format": "s"
                    }
                  },
                  "tooltip": {
                    "field": "Title"
                  }
                },
                "transform": [],
                "data": {
                  "url": "https://raw.githubusercontent.com/nl4dv/nl4dv/master/examples/assets/data/movies-w-year.csv",
                  "format": {
                    "type": "csv"
                  }
                }
              }
            },
            {
              "score": 3.8,
              "scoreObj": {
                "by_attributes": 1.8,
                "by_task": 0.5,
                "by_vis": 0
              },
              "confidenceObj": {
                "Rotten Tomatoes Rating": 1,
                "Content Rating": 0.5
              },
              "attributes": [
                "Rotten Tomatoes Rating",
                "Content Rating"
              ],
              "queryPhrase": null,
              "visType": null,
              "tasks": [
                "derived_value",
                "correlation"
              ],
              "inferenceType": "implicit",
              "vlSpec": {
                "$schema": "https://vega.github.io/schema/vega-lite/v4.json",
                "mark": {
                  "type": "bar",
                  "tooltip": true
                },
                "encoding": {
                  "y": {
                    "field": "Rotten Tomatoes Rating",
                    "type": "quantitative",
                    "aggregate": "mean",
                    "axis": {
                      "format": "s"
                    }
                  },
                  "x": {
                    "field": "Content Rating",
                    "type": "nominal",
                    "aggregate": null
                  }
                },
                "transform": [],
                "data": {
                  "url": "https://raw.githubusercontent.com/nl4dv/nl4dv/master/examples/assets/data/movies-w-year.csv",
                  "format": {
                    "type": "csv"
                  }
                }
              }
            }
          ],
          "attributeMap": {
            "Content Rating": {
              "name": "Content Rating",
              "queryPhrase": [
                "rating"
              ],
              "inferenceType": "explicit",
              "matchScore": 0.9,
              "metric": [
                "attribute_similarity_match"
              ],
              "isLabel": false,
              "encode": true,
              "isAmbiguous": true,
              "ambiguity": [
                "IMDB Rating"
              ],
              "meta": {
                "score": 100,
                "threshold": 85,
                "alias": null,
                "ambiguity": {},
                "confidence": 50
              }
            },
            "Rotten Tomatoes Rating": {
              "name": "Rotten Tomatoes Rating",
              "queryPhrase": [
                "tomatoes"
              ],
              "inferenceType": "explicit",
              "matchScore": 0.9,
              "metric": [
                "attribute_similarity_match"
              ],
              "isLabel": false,
              "encode": true,
              "isAmbiguous": false,
              "ambiguity": [],
              "meta": {
                "score": 100,
                "threshold": 85,
                "alias": null,
                "ambiguity": {},
                "confidence": 100
              }
            },
            "IMDB Rating": {
              "name": "IMDB Rating",
              "queryPhrase": [
                "rating"
              ],
              "inferenceType": "explicit",
              "matchScore": 0.9,
              "metric": [
                "attribute_similarity_match"
              ],
              "isLabel": false,
              "encode": true,
              "isAmbiguous": true,
              "ambiguity": [
                "Content Rating"
              ],
              "meta": {
                "score": 100,
                "threshold": 85,
                "alias": null,
                "ambiguity": {},
                "confidence": 59
              }
            }
          },
          "taskMap": {
            "derived_value": [
              {
                "task": "derived_value",
                "queryPhrase": [],
                "operator": "AVG",
                "values": null,
                "matchScore": 0.5,
                "attributes": [
                  "Rotten Tomatoes Rating"
                ],
                "inferenceType": "implicit",
                "isAttrAmbiguous": false,
                "isValueAmbiguous": false,
                "meta": {
                  "value_ambiguity_type": null
                }
              }
            ],
            "correlation": [
              {
                "task": "correlation",
                "queryPhrase": [],
                "operator": null,
                "values": null,
                "matchScore": 0.5,
                "attributes": [
                  "Rotten Tomatoes Rating",
                  "IMDB Rating"
                ],
                "inferenceType": "implicit",
                "isAttrAmbiguous": true,
                "isValueAmbiguous": false,
                "meta": {
                  "value_ambiguity_type": null
                }
              }
            ]
          },
          "followUpQuery": false,
          "contextObj": null
        }
      },
      {
        "queryId": 86,
        "query": "how many films of each creative type",
        "output": {
          "status": "SUCCESS",
          "debug": {
            "execution_durations": {
              "clean_query": 0.0018732547760009766,
              "extract_attributes": 0.2511868476867676,
              "extract_vis_type": 0.000017881393432617188,
              "extract_tasks": 1.0342168807983398,
              "get_vis_list": 0.00013017654418945312,
              "total": 1.2874250411987305
            }
          },
          "query_raw": "how many films of each creative type",
          "query": "how many films of each creative type",
          "dataset": "https://raw.githubusercontent.com/nl4dv/nl4dv/master/examples/assets/data/movies-w-year.csv",
          "alias": "https://raw.githubusercontent.com/nl4dv/nl4dv/master/examples/assets/aliases/movies-w-year.json",
          "visList": [
            {
              "score": 2.5,
              "scoreObj": {
                "by_attributes": 1,
                "by_task": 0.5,
                "by_vis": 0
              },
              "confidenceObj": {
                "Creative Type": 1
              },
              "attributes": [
                "Creative Type"
              ],
              "queryPhrase": null,
              "visType": null,
              "tasks": [
                "distribution"
              ],
              "inferenceType": "implicit",
              "vlSpec": {
                "$schema": "https://vega.github.io/schema/vega-lite/v4.json",
                "mark": {
                  "type": "bar",
                  "tooltip": true
                },
                "encoding": {
                  "x": {
                    "field": "Creative Type",
                    "type": "nominal",
                    "aggregate": null
                  },
                  "y": {
                    "field": "Creative Type",
                    "type": "nominal",
                    "aggregate": "count"
                  }
                },
                "transform": [],
                "data": {
                  "url": "https://raw.githubusercontent.com/nl4dv/nl4dv/master/examples/assets/data/movies-w-year.csv",
                  "format": {
                    "type": "csv"
                  }
                }
              }
            }
          ],
          "attributeMap": {
            "Creative Type": {
              "name": "Creative Type",
              "queryPhrase": [
                "creative type"
              ],
              "inferenceType": "explicit",
              "matchScore": 1,
              "metric": [
                "attribute_exact_match"
              ],
              "isLabel": false,
              "encode": true,
              "isAmbiguous": false,
              "ambiguity": [],
              "meta": {
                "score": 100,
                "threshold": 85,
                "alias": null,
                "ambiguity": {},
                "confidence": 100
              }
            }
          },
          "taskMap": {
            "distribution": [
              {
                "task": "distribution",
                "queryPhrase": [],
                "operator": null,
                "values": null,
                "matchScore": 0.5,
                "attributes": [
                  "Creative Type"
                ],
                "inferenceType": "implicit",
                "isAttrAmbiguous": false,
                "isValueAmbiguous": false,
                "meta": {
                  "value_ambiguity_type": null
                }
              }
            ]
          },
          "followUpQuery": false,
          "contextObj": null
        }
      },
      {
        "queryId": 87,
        "query": "Relation between worldwide gross and production budget for each major genre",
        "output": {
          "status": "SUCCESS",
          "debug": {
            "execution_durations": {
              "clean_query": 0.005100727081298828,
              "extract_attributes": 0.4998660087585449,
              "extract_vis_type": 0.00003910064697265625,
              "extract_tasks": 1.081475019454956,
              "get_vis_list": 0.0003039836883544922,
              "total": 1.586784839630127
            }
          },
          "query_raw": "Relation between worldwide gross and production budget for each major genre",
          "query": "relation between worldwide gross and production budget for each major genre",
          "dataset": "https://raw.githubusercontent.com/nl4dv/nl4dv/master/examples/assets/data/movies-w-year.csv",
          "alias": "https://raw.githubusercontent.com/nl4dv/nl4dv/master/examples/assets/aliases/movies-w-year.json",
          "visList": [
            {
              "score": 6.5,
              "scoreObj": {
                "by_attributes": 3,
                "by_task": 0.5,
                "by_vis": 0
              },
              "confidenceObj": {
                "Worldwide Gross": 1,
                "Production Budget": 1,
                "Genre": 1
              },
              "attributes": [
                "Worldwide Gross",
                "Production Budget",
                "Genre"
              ],
              "queryPhrase": null,
              "visType": null,
              "tasks": [
                "correlation"
              ],
              "inferenceType": "implicit",
              "vlSpec": {
                "$schema": "https://vega.github.io/schema/vega-lite/v4.json",
                "mark": {
                  "type": "point",
                  "tooltip": true
                },
                "encoding": {
                  "x": {
                    "field": "Worldwide Gross",
                    "type": "quantitative",
                    "aggregate": null,
                    "axis": {
                      "format": "s"
                    }
                  },
                  "y": {
                    "field": "Production Budget",
                    "type": "quantitative",
                    "aggregate": null,
                    "axis": {
                      "format": "s"
                    }
                  },
                  "color": {
                    "field": "Genre",
                    "type": "nominal",
                    "aggregate": null
                  },
                  "tooltip": {
                    "field": "Title"
                  }
                },
                "transform": [],
                "data": {
                  "url": "https://raw.githubusercontent.com/nl4dv/nl4dv/master/examples/assets/data/movies-w-year.csv",
                  "format": {
                    "type": "csv"
                  }
                }
              }
            },
            {
              "score": 6.5,
              "scoreObj": {
                "by_attributes": 3,
                "by_task": 0.5,
                "by_vis": 0
              },
              "confidenceObj": {
                "Worldwide Gross": 1,
                "Production Budget": 1,
                "Genre": 1
              },
              "attributes": [
                "Worldwide Gross",
                "Production Budget",
                "Genre"
              ],
              "queryPhrase": null,
              "visType": null,
              "tasks": [
                "correlation"
              ],
              "inferenceType": "implicit",
              "vlSpec": {
                "$schema": "https://vega.github.io/schema/vega-lite/v4.json",
                "mark": {
                  "type": "point",
                  "tooltip": true
                },
                "encoding": {
                  "x": {
                    "field": "Worldwide Gross",
                    "type": "quantitative",
                    "aggregate": null,
                    "axis": {
                      "format": "s"
                    }
                  },
                  "y": {
                    "field": "Production Budget",
                    "type": "quantitative",
                    "aggregate": null,
                    "axis": {
                      "format": "s"
                    }
                  },
                  "column": {
                    "field": "Genre",
                    "type": "nominal",
                    "aggregate": null
                  },
                  "color": {
                    "field": "Genre",
                    "type": "nominal",
                    "aggregate": null
                  },
                  "tooltip": {
                    "field": "Title"
                  }
                },
                "transform": [],
                "data": {
                  "url": "https://raw.githubusercontent.com/nl4dv/nl4dv/master/examples/assets/data/movies-w-year.csv",
                  "format": {
                    "type": "csv"
                  }
                }
              }
            }
          ],
          "attributeMap": {
            "Worldwide Gross": {
              "name": "Worldwide Gross",
              "queryPhrase": [
                "worldwide gross"
              ],
              "inferenceType": "explicit",
              "matchScore": 1,
              "metric": [
                "attribute_exact_match"
              ],
              "isLabel": false,
              "encode": true,
              "isAmbiguous": false,
              "ambiguity": [],
              "meta": {
                "score": 100,
                "threshold": 85,
                "alias": null,
                "ambiguity": {},
                "confidence": 100
              }
            },
            "Production Budget": {
              "name": "Production Budget",
              "queryPhrase": [
                "production budget"
              ],
              "inferenceType": "explicit",
              "matchScore": 1,
              "metric": [
                "attribute_exact_match"
              ],
              "isLabel": false,
              "encode": true,
              "isAmbiguous": false,
              "ambiguity": [],
              "meta": {
                "score": 100,
                "threshold": 85,
                "alias": null,
                "ambiguity": {},
                "confidence": 100
              }
            },
            "Genre": {
              "name": "Genre",
              "queryPhrase": [
                "genre"
              ],
              "inferenceType": "explicit",
              "matchScore": 1,
              "metric": [
                "attribute_exact_match"
              ],
              "isLabel": false,
              "encode": true,
              "isAmbiguous": false,
              "ambiguity": [],
              "meta": {
                "score": 100,
                "threshold": 85,
                "alias": null,
                "ambiguity": {},
                "confidence": 100
              }
            }
          },
          "taskMap": {
            "correlation": [
              {
                "task": "correlation",
                "queryPhrase": [],
                "operator": null,
                "values": null,
                "matchScore": 0.5,
                "attributes": [
                  "Worldwide Gross",
                  "Production Budget"
                ],
                "inferenceType": "implicit",
                "isAttrAmbiguous": false,
                "isValueAmbiguous": false,
                "meta": {
                  "value_ambiguity_type": null
                }
              }
            ]
          },
          "followUpQuery": false,
          "contextObj": null
        }
      },
      {
        "queryId": 88,
        "query": "average production budget by year, 1995 to 2009",
        "output": {
          "status": "SUCCESS",
          "debug": {
            "execution_durations": {
              "clean_query": 0.0036852359771728516,
              "extract_attributes": 0.3297851085662842,
              "extract_vis_type": 0.000030994415283203125,
              "extract_tasks": 1.1006758213043213,
              "get_vis_list": 0.00022101402282714844,
              "total": 1.4343981742858887
            }
          },
          "query_raw": "average production budget by year, 1995 to 2009",
          "query": "average production budget by year , 1995 to 2009",
          "dataset": "https://raw.githubusercontent.com/nl4dv/nl4dv/master/examples/assets/data/movies-w-year.csv",
          "alias": "https://raw.githubusercontent.com/nl4dv/nl4dv/master/examples/assets/aliases/movies-w-year.json",
          "visList": [
            {
              "score": 3,
              "scoreObj": {
                "by_attributes": 1,
                "by_task": 1,
                "by_vis": 0
              },
              "confidenceObj": {
                "Production Budget": 1
              },
              "attributes": [
                "Production Budget"
              ],
              "queryPhrase": null,
              "visType": null,
              "tasks": [
                "derived_value"
              ],
              "inferenceType": "implicit",
              "vlSpec": {
                "$schema": "https://vega.github.io/schema/vega-lite/v4.json",
                "mark": {
                  "type": "tick",
                  "tooltip": true
                },
                "encoding": {
                  "x": {
                    "field": "Production Budget",
                    "type": "quantitative",
                    "aggregate": "mean",
                    "axis": {
                      "format": "s"
                    }
                  }
                },
                "transform": [],
                "data": {
                  "url": "https://raw.githubusercontent.com/nl4dv/nl4dv/master/examples/assets/data/movies-w-year.csv",
                  "format": {
                    "type": "csv"
                  }
                }
              }
            }
          ],
          "attributeMap": {
            "Production Budget": {
              "name": "Production Budget",
              "queryPhrase": [
                "production budget"
              ],
              "inferenceType": "explicit",
              "matchScore": 1,
              "metric": [
                "attribute_exact_match"
              ],
              "isLabel": false,
              "encode": true,
              "isAmbiguous": false,
              "ambiguity": [],
              "meta": {
                "score": 100,
                "threshold": 85,
                "alias": null,
                "ambiguity": {},
                "confidence": 100
              }
            }
          },
          "taskMap": {
            "derived_value": [
              {
                "task": "derived_value",
                "queryPhrase": "average",
                "operator": "AVG",
                "values": [],
                "matchScore": 1,
                "attributes": [
                  "Production Budget"
                ],
                "inferenceType": "explicit",
                "isAttrAmbiguous": false,
                "isValueAmbiguous": false,
                "meta": {
                  "value_ambiguity_type": null
                }
              }
            ]
          },
          "followUpQuery": false,
          "contextObj": null
        }
      },
      {
        "queryId": 89,
        "query": "give me the number of movies by running time",
        "output": {
          "status": "SUCCESS",
          "debug": {
            "execution_durations": {
              "clean_query": 0.0022950172424316406,
              "extract_attributes": 0.29893970489501953,
              "extract_vis_type": 0.00001811981201171875,
              "extract_tasks": 1.1111359596252441,
              "get_vis_list": 0.000247955322265625,
              "total": 1.4126367568969727
            }
          },
          "query_raw": "give me the number of movies by running time",
          "query": "give me the number of movies by running time",
          "dataset": "https://raw.githubusercontent.com/nl4dv/nl4dv/master/examples/assets/data/movies-w-year.csv",
          "alias": "https://raw.githubusercontent.com/nl4dv/nl4dv/master/examples/assets/aliases/movies-w-year.json",
          "visList": [
            {
              "score": 2.5,
              "scoreObj": {
                "by_attributes": 1,
                "by_task": 0.5,
                "by_vis": 0
              },
              "confidenceObj": {
                "Running Time": 1
              },
              "attributes": [
                "Running Time"
              ],
              "queryPhrase": null,
              "visType": null,
              "tasks": [
                "distribution"
              ],
              "inferenceType": "implicit",
              "vlSpec": {
                "$schema": "https://vega.github.io/schema/vega-lite/v4.json",
                "mark": {
                  "type": "bar",
                  "tooltip": true
                },
                "encoding": {
                  "x": {
                    "field": "Running Time",
                    "type": "quantitative",
                    "aggregate": null,
                    "bin": true,
                    "axis": {
                      "format": "s"
                    }
                  },
                  "y": {
                    "field": "Running Time",
                    "type": "quantitative",
                    "aggregate": "count",
                    "axis": {
                      "format": "s"
                    }
                  }
                },
                "transform": [],
                "data": {
                  "url": "https://raw.githubusercontent.com/nl4dv/nl4dv/master/examples/assets/data/movies-w-year.csv",
                  "format": {
                    "type": "csv"
                  }
                }
              }
            },
            {
              "score": 2.5,
              "scoreObj": {
                "by_attributes": 1,
                "by_task": 0.5,
                "by_vis": 0
              },
              "confidenceObj": {
                "Running Time": 1
              },
              "attributes": [
                "Running Time"
              ],
              "queryPhrase": null,
              "visType": null,
              "tasks": [
                "distribution"
              ],
              "inferenceType": "implicit",
              "vlSpec": {
                "$schema": "https://vega.github.io/schema/vega-lite/v4.json",
                "mark": {
                  "type": "tick",
                  "tooltip": true
                },
                "encoding": {
                  "x": {
                    "field": "Running Time",
                    "type": "quantitative",
                    "aggregate": null,
                    "axis": {
                      "format": "s"
                    }
                  },
                  "tooltip": {
                    "field": "Title"
                  }
                },
                "transform": [],
                "data": {
                  "url": "https://raw.githubusercontent.com/nl4dv/nl4dv/master/examples/assets/data/movies-w-year.csv",
                  "format": {
                    "type": "csv"
                  }
                }
              }
            },
            {
              "score": 2.5,
              "scoreObj": {
                "by_attributes": 1,
                "by_task": 0.5,
                "by_vis": 0
              },
              "confidenceObj": {
                "Running Time": 1
              },
              "attributes": [
                "Running Time"
              ],
              "queryPhrase": null,
              "visType": null,
              "tasks": [
                "distribution"
              ],
              "inferenceType": "implicit",
              "vlSpec": {
                "$schema": "https://vega.github.io/schema/vega-lite/v4.json",
                "mark": {
                  "type": "boxplot",
                  "tooltip": true
                },
                "encoding": {
                  "x": {
                    "field": "Running Time",
                    "type": "quantitative",
                    "aggregate": null,
                    "axis": {
                      "format": "s"
                    }
                  },
                  "tooltip": {
                    "field": "Title"
                  }
                },
                "transform": [],
                "data": {
                  "url": "https://raw.githubusercontent.com/nl4dv/nl4dv/master/examples/assets/data/movies-w-year.csv",
                  "format": {
                    "type": "csv"
                  }
                }
              }
            }
          ],
          "attributeMap": {
            "Running Time": {
              "name": "Running Time",
              "queryPhrase": [
                "running time"
              ],
              "inferenceType": "explicit",
              "matchScore": 1,
              "metric": [
                "attribute_exact_match"
              ],
              "isLabel": false,
              "encode": true,
              "isAmbiguous": false,
              "ambiguity": [],
              "meta": {
                "score": 100,
                "threshold": 85,
                "alias": null,
                "ambiguity": {},
                "confidence": 100
              }
            }
          },
          "taskMap": {
            "distribution": [
              {
                "task": "distribution",
                "queryPhrase": [],
                "operator": null,
                "values": null,
                "matchScore": 0.5,
                "attributes": [
                  "Running Time"
                ],
                "inferenceType": "implicit",
                "isAttrAmbiguous": false,
                "isValueAmbiguous": false,
                "meta": {
                  "value_ambiguity_type": null
                }
              }
            ]
          },
          "followUpQuery": false,
          "contextObj": null
        }
      },
      {
        "queryId": 90,
        "query": "show me average production budget over release year",
        "output": {
          "status": "SUCCESS",
          "debug": {
            "execution_durations": {
              "clean_query": 0.004698276519775391,
              "extract_attributes": 0.4096410274505615,
              "extract_vis_type": 0.000028848648071289062,
              "extract_tasks": 1.0178160667419434,
              "get_vis_list": 0.00036406517028808594,
              "total": 1.4325482845306396
            }
          },
          "query_raw": "show me average production budget over release year",
          "query": "show me average production budget over release year",
          "dataset": "https://raw.githubusercontent.com/nl4dv/nl4dv/master/examples/assets/data/movies-w-year.csv",
          "alias": "https://raw.githubusercontent.com/nl4dv/nl4dv/master/examples/assets/aliases/movies-w-year.json",
          "visList": [
            {
              "score": 5,
              "scoreObj": {
                "by_attributes": 2,
                "by_task": 1,
                "by_vis": 0
              },
              "confidenceObj": {
                "Production Budget": 1,
                "Release Year": 1
              },
              "attributes": [
                "Production Budget",
                "Release Year"
              ],
              "queryPhrase": null,
              "visType": null,
              "tasks": [
                "derived_value"
              ],
              "inferenceType": "implicit",
              "vlSpec": {
                "$schema": "https://vega.github.io/schema/vega-lite/v4.json",
                "mark": {
                  "type": "line",
                  "tooltip": true
                },
                "encoding": {
                  "y": {
                    "field": "Production Budget",
                    "type": "quantitative",
                    "aggregate": "mean",
                    "axis": {
                      "format": "s"
                    }
                  },
                  "x": {
                    "field": "Release Year",
                    "type": "temporal",
                    "aggregate": null
                  }
                },
                "transform": [],
                "data": {
                  "url": "https://raw.githubusercontent.com/nl4dv/nl4dv/master/examples/assets/data/movies-w-year.csv",
                  "format": {
                    "type": "csv"
                  }
                }
              }
            },
            {
              "score": 5,
              "scoreObj": {
                "by_attributes": 2,
                "by_task": 1,
                "by_vis": 0
              },
              "confidenceObj": {
                "Production Budget": 1,
                "Release Year": 1
              },
              "attributes": [
                "Production Budget",
                "Release Year"
              ],
              "queryPhrase": null,
              "visType": null,
              "tasks": [
                "derived_value"
              ],
              "inferenceType": "implicit",
              "vlSpec": {
                "$schema": "https://vega.github.io/schema/vega-lite/v4.json",
                "mark": {
                  "type": "tick",
                  "tooltip": true
                },
                "encoding": {
                  "y": {
                    "field": "Production Budget",
                    "type": "quantitative",
                    "aggregate": "mean",
                    "axis": {
                      "format": "s"
                    }
                  },
                  "x": {
                    "field": "Release Year",
                    "type": "temporal",
                    "aggregate": null
                  }
                },
                "transform": [],
                "data": {
                  "url": "https://raw.githubusercontent.com/nl4dv/nl4dv/master/examples/assets/data/movies-w-year.csv",
                  "format": {
                    "type": "csv"
                  }
                }
              }
            }
          ],
          "attributeMap": {
            "Production Budget": {
              "name": "Production Budget",
              "queryPhrase": [
                "production budget"
              ],
              "inferenceType": "explicit",
              "matchScore": 1,
              "metric": [
                "attribute_exact_match"
              ],
              "isLabel": false,
              "encode": true,
              "isAmbiguous": false,
              "ambiguity": [],
              "meta": {
                "score": 100,
                "threshold": 85,
                "alias": null,
                "ambiguity": {},
                "confidence": 100
              }
            },
            "Release Year": {
              "name": "Release Year",
              "queryPhrase": [
                "release year"
              ],
              "inferenceType": "explicit",
              "matchScore": 1,
              "metric": [
                "attribute_exact_match"
              ],
              "isLabel": false,
              "encode": true,
              "isAmbiguous": false,
              "ambiguity": [],
              "meta": {
                "score": 100,
                "threshold": 85,
                "alias": null,
                "ambiguity": {},
                "confidence": 100
              }
            }
          },
          "taskMap": {
            "derived_value": [
              {
                "task": "derived_value",
                "queryPhrase": "average",
                "operator": "AVG",
                "values": [],
                "matchScore": 1,
                "attributes": [
                  "Production Budget"
                ],
                "inferenceType": "explicit",
                "isAttrAmbiguous": false,
                "isValueAmbiguous": false,
                "meta": {
                  "value_ambiguity_type": null
                }
              }
            ]
          },
          "followUpQuery": false,
          "contextObj": null
        }
      },
      {
        "queryId": 91,
        "query": "plot average production budget over release year",
        "output": {
          "status": "SUCCESS",
          "debug": {
            "execution_durations": {
              "clean_query": 0.004256010055541992,
              "extract_attributes": 0.4103889465332031,
              "extract_vis_type": 0.000030040740966796875,
              "extract_tasks": 1.0482988357543945,
              "get_vis_list": 0.0002968311309814453,
              "total": 1.463270664215088
            }
          },
          "query_raw": "plot average production budget over release year",
          "query": "plot average production budget over release year",
          "dataset": "https://raw.githubusercontent.com/nl4dv/nl4dv/master/examples/assets/data/movies-w-year.csv",
          "alias": "https://raw.githubusercontent.com/nl4dv/nl4dv/master/examples/assets/aliases/movies-w-year.json",
          "visList": [
            {
              "score": 5,
              "scoreObj": {
                "by_attributes": 2,
                "by_task": 1,
                "by_vis": 0
              },
              "confidenceObj": {
                "Production Budget": 1,
                "Release Year": 1
              },
              "attributes": [
                "Production Budget",
                "Release Year"
              ],
              "queryPhrase": null,
              "visType": null,
              "tasks": [
                "derived_value"
              ],
              "inferenceType": "implicit",
              "vlSpec": {
                "$schema": "https://vega.github.io/schema/vega-lite/v4.json",
                "mark": {
                  "type": "line",
                  "tooltip": true
                },
                "encoding": {
                  "y": {
                    "field": "Production Budget",
                    "type": "quantitative",
                    "aggregate": "mean",
                    "axis": {
                      "format": "s"
                    }
                  },
                  "x": {
                    "field": "Release Year",
                    "type": "temporal",
                    "aggregate": null
                  }
                },
                "transform": [],
                "data": {
                  "url": "https://raw.githubusercontent.com/nl4dv/nl4dv/master/examples/assets/data/movies-w-year.csv",
                  "format": {
                    "type": "csv"
                  }
                }
              }
            },
            {
              "score": 5,
              "scoreObj": {
                "by_attributes": 2,
                "by_task": 1,
                "by_vis": 0
              },
              "confidenceObj": {
                "Production Budget": 1,
                "Release Year": 1
              },
              "attributes": [
                "Production Budget",
                "Release Year"
              ],
              "queryPhrase": null,
              "visType": null,
              "tasks": [
                "derived_value"
              ],
              "inferenceType": "implicit",
              "vlSpec": {
                "$schema": "https://vega.github.io/schema/vega-lite/v4.json",
                "mark": {
                  "type": "tick",
                  "tooltip": true
                },
                "encoding": {
                  "y": {
                    "field": "Production Budget",
                    "type": "quantitative",
                    "aggregate": "mean",
                    "axis": {
                      "format": "s"
                    }
                  },
                  "x": {
                    "field": "Release Year",
                    "type": "temporal",
                    "aggregate": null
                  }
                },
                "transform": [],
                "data": {
                  "url": "https://raw.githubusercontent.com/nl4dv/nl4dv/master/examples/assets/data/movies-w-year.csv",
                  "format": {
                    "type": "csv"
                  }
                }
              }
            }
          ],
          "attributeMap": {
            "Production Budget": {
              "name": "Production Budget",
              "queryPhrase": [
                "production budget"
              ],
              "inferenceType": "explicit",
              "matchScore": 1,
              "metric": [
                "attribute_exact_match"
              ],
              "isLabel": false,
              "encode": true,
              "isAmbiguous": false,
              "ambiguity": [],
              "meta": {
                "score": 100,
                "threshold": 85,
                "alias": null,
                "ambiguity": {},
                "confidence": 100
              }
            },
            "Release Year": {
              "name": "Release Year",
              "queryPhrase": [
                "release year"
              ],
              "inferenceType": "explicit",
              "matchScore": 1,
              "metric": [
                "attribute_exact_match"
              ],
              "isLabel": false,
              "encode": true,
              "isAmbiguous": false,
              "ambiguity": [],
              "meta": {
                "score": 100,
                "threshold": 85,
                "alias": null,
                "ambiguity": {},
                "confidence": 100
              }
            }
          },
          "taskMap": {
            "derived_value": [
              {
                "task": "derived_value",
                "queryPhrase": "average",
                "operator": "AVG",
                "values": [],
                "matchScore": 1,
                "attributes": [
                  "Production Budget"
                ],
                "inferenceType": "explicit",
                "isAttrAmbiguous": false,
                "isValueAmbiguous": false,
                "meta": {
                  "value_ambiguity_type": null
                }
              }
            ]
          },
          "followUpQuery": false,
          "contextObj": null
        }
      },
      {
        "queryId": 92,
        "query": "Show the total gross of movies by creative type as a piechart.",
        "output": {
          "status": "SUCCESS",
          "debug": {
            "execution_durations": {
              "clean_query": 0.003985166549682617,
              "extract_attributes": 0.3850686550140381,
              "extract_vis_type": 0.000028133392333984375,
              "extract_tasks": 1.1608479022979736,
              "get_vis_list": 0.00030803680419921875,
              "total": 1.5502378940582275
            }
          },
          "query_raw": "Show the total gross of movies by creative type as a piechart.",
          "query": "show the total gross of movies by creative type as a piechart .",
          "dataset": "https://raw.githubusercontent.com/nl4dv/nl4dv/master/examples/assets/data/movies-w-year.csv",
          "alias": "https://raw.githubusercontent.com/nl4dv/nl4dv/master/examples/assets/aliases/movies-w-year.json",
          "visList": [
            {
              "score": 5.9,
              "scoreObj": {
                "by_attributes": 1.9,
                "by_task": 1,
                "by_vis": 1
              },
              "confidenceObj": {
                "Worldwide Gross": 1,
                "Creative Type": 1
              },
              "attributes": [
                "Worldwide Gross",
                "Creative Type"
              ],
              "queryPhrase": "piechart",
              "visType": "piechart",
              "tasks": [
                "derived_value"
              ],
              "inferenceType": "explicit",
              "vlSpec": {
                "$schema": "https://vega.github.io/schema/vega-lite/v4.json",
                "mark": {
                  "type": "arc",
                  "tooltip": true
                },
                "encoding": {
                  "theta": {
                    "field": "Worldwide Gross",
                    "type": "quantitative",
                    "aggregate": "sum"
                  },
                  "color": {
                    "field": "Creative Type",
                    "type": "nominal",
                    "aggregate": null
                  }
                },
                "transform": [],
                "data": {
                  "url": "https://raw.githubusercontent.com/nl4dv/nl4dv/master/examples/assets/data/movies-w-year.csv",
                  "format": {
                    "type": "csv"
                  }
                }
              }
            }
          ],
          "attributeMap": {
            "Creative Type": {
              "name": "Creative Type",
              "queryPhrase": [
                "creative type"
              ],
              "inferenceType": "explicit",
              "matchScore": 1,
              "metric": [
                "attribute_exact_match"
              ],
              "isLabel": false,
              "encode": true,
              "isAmbiguous": false,
              "ambiguity": [],
              "meta": {
                "score": 100,
                "threshold": 85,
                "alias": null,
                "ambiguity": {},
                "confidence": 100
              }
            },
            "Worldwide Gross": {
              "name": "Worldwide Gross",
              "queryPhrase": [
                "gross"
              ],
              "inferenceType": "explicit",
              "matchScore": 0.9,
              "metric": [
                "attribute_similarity_match"
              ],
              "isLabel": false,
              "encode": true,
              "isAmbiguous": false,
              "ambiguity": [],
              "meta": {
                "score": 100,
                "threshold": 85,
                "alias": null,
                "ambiguity": {},
                "confidence": 100
              }
            }
          },
          "taskMap": {
            "derived_value": [
              {
                "task": "derived_value",
                "queryPhrase": "total",
                "operator": "SUM",
                "values": [],
                "matchScore": 1,
                "attributes": [
                  "Worldwide Gross"
                ],
                "inferenceType": "explicit",
                "isAttrAmbiguous": false,
                "isValueAmbiguous": false,
                "meta": {
                  "value_ambiguity_type": null
                }
              }
            ]
          },
          "followUpQuery": false,
          "contextObj": null
        }
      },
      {
        "queryId": 93,
        "query": "stacked bar of genre and worldwide gross colored by content rating",
        "output": {
          "status": "SUCCESS",
          "debug": {
            "execution_durations": {
              "clean_query": 0.0069141387939453125,
              "extract_attributes": 0.4899468421936035,
              "extract_vis_type": 0.00004315376281738281,
              "extract_tasks": 1.0971808433532715,
              "get_vis_list": 0.0004520416259765625,
              "total": 1.5945370197296143
            }
          },
          "query_raw": "stacked bar of genre and worldwide gross colored by content rating",
          "query": "stacked bar of genre and worldwide gross colored by content rating",
          "dataset": "https://raw.githubusercontent.com/nl4dv/nl4dv/master/examples/assets/data/movies-w-year.csv",
          "alias": "https://raw.githubusercontent.com/nl4dv/nl4dv/master/examples/assets/aliases/movies-w-year.json",
          "visList": [
            {
              "score": 6.5,
              "scoreObj": {
                "by_attributes": 3,
                "by_task": 0.5,
                "by_vis": 0
              },
              "confidenceObj": {
                "Worldwide Gross": 1,
                "Content Rating": 1,
                "Genre": 1
              },
              "attributes": [
                "Worldwide Gross",
                "Content Rating",
                "Genre"
              ],
              "queryPhrase": null,
              "visType": null,
              "tasks": [
                "derived_value"
              ],
              "inferenceType": "implicit",
              "vlSpec": {
                "$schema": "https://vega.github.io/schema/vega-lite/v4.json",
                "mark": {
                  "type": "bar",
                  "tooltip": true
                },
                "encoding": {
                  "y": {
                    "field": "Worldwide Gross",
                    "type": "quantitative",
                    "aggregate": "mean",
                    "axis": {
                      "format": "s"
                    }
                  },
                  "x": {
                    "field": "Content Rating",
                    "type": "nominal",
                    "aggregate": null
                  },
                  "color": {
                    "field": "Genre",
                    "type": "nominal",
                    "aggregate": null
                  }
                },
                "transform": [],
                "data": {
                  "url": "https://raw.githubusercontent.com/nl4dv/nl4dv/master/examples/assets/data/movies-w-year.csv",
                  "format": {
                    "type": "csv"
                  }
                }
              }
            },
            {
              "score": 6.5,
              "scoreObj": {
                "by_attributes": 3,
                "by_task": 0.5,
                "by_vis": 0
              },
              "confidenceObj": {
                "Worldwide Gross": 1,
                "Content Rating": 1,
                "Genre": 1
              },
              "attributes": [
                "Worldwide Gross",
                "Content Rating",
                "Genre"
              ],
              "queryPhrase": null,
              "visType": null,
              "tasks": [
                "derived_value"
              ],
              "inferenceType": "implicit",
              "vlSpec": {
                "$schema": "https://vega.github.io/schema/vega-lite/v4.json",
                "mark": {
                  "type": "bar",
                  "tooltip": true
                },
                "encoding": {
                  "y": {
                    "field": "Worldwide Gross",
                    "type": "quantitative",
                    "aggregate": "mean",
                    "axis": {
                      "format": "s"
                    }
                  },
                  "column": {
                    "field": "Content Rating",
                    "type": "nominal",
                    "aggregate": null
                  },
                  "x": {
                    "field": "Genre",
                    "type": "nominal",
                    "aggregate": null
                  },
                  "color": {
                    "field": "Content Rating",
                    "type": "nominal",
                    "aggregate": null
                  }
                },
                "transform": [],
                "data": {
                  "url": "https://raw.githubusercontent.com/nl4dv/nl4dv/master/examples/assets/data/movies-w-year.csv",
                  "format": {
                    "type": "csv"
                  }
                }
              }
            },
            {
              "score": 6.5,
              "scoreObj": {
                "by_attributes": 3,
                "by_task": 0.5,
                "by_vis": 0
              },
              "confidenceObj": {
                "Worldwide Gross": 1,
                "Content Rating": 1,
                "Genre": 1
              },
              "attributes": [
                "Worldwide Gross",
                "Content Rating",
                "Genre"
              ],
              "queryPhrase": null,
              "visType": null,
              "tasks": [
                "derived_value"
              ],
              "inferenceType": "implicit",
              "vlSpec": {
                "$schema": "https://vega.github.io/schema/vega-lite/v4.json",
                "mark": {
                  "type": "point",
                  "tooltip": true
                },
                "encoding": {
                  "size": {
                    "field": "Worldwide Gross",
                    "type": "quantitative",
                    "aggregate": "mean"
                  },
                  "x": {
                    "field": "Content Rating",
                    "type": "nominal",
                    "aggregate": null
                  },
                  "y": {
                    "field": "Genre",
                    "type": "nominal",
                    "aggregate": null
                  }
                },
                "transform": [],
                "data": {
                  "url": "https://raw.githubusercontent.com/nl4dv/nl4dv/master/examples/assets/data/movies-w-year.csv",
                  "format": {
                    "type": "csv"
                  }
                }
              }
            }
          ],
          "attributeMap": {
            "Worldwide Gross": {
              "name": "Worldwide Gross",
              "queryPhrase": [
                "worldwide gross"
              ],
              "inferenceType": "explicit",
              "matchScore": 1,
              "metric": [
                "attribute_exact_match"
              ],
              "isLabel": false,
              "encode": true,
              "isAmbiguous": false,
              "ambiguity": [],
              "meta": {
                "score": 100,
                "threshold": 85,
                "alias": null,
                "ambiguity": {},
                "confidence": 100
              }
            },
            "Content Rating": {
              "name": "Content Rating",
              "queryPhrase": [
                "content rating"
              ],
              "inferenceType": "explicit",
              "matchScore": 1,
              "metric": [
                "attribute_exact_match"
              ],
              "isLabel": false,
              "encode": true,
              "isAmbiguous": false,
              "ambiguity": [],
              "meta": {
                "score": 100,
                "threshold": 85,
                "alias": null,
                "ambiguity": {},
                "confidence": 100
              }
            },
            "Genre": {
              "name": "Genre",
              "queryPhrase": [
                "genre"
              ],
              "inferenceType": "explicit",
              "matchScore": 1,
              "metric": [
                "attribute_exact_match"
              ],
              "isLabel": false,
              "encode": true,
              "isAmbiguous": false,
              "ambiguity": [],
              "meta": {
                "score": 100,
                "threshold": 85,
                "alias": null,
                "ambiguity": {},
                "confidence": 100
              }
            }
          },
          "taskMap": {
            "derived_value": [
              {
                "task": "derived_value",
                "queryPhrase": [],
                "operator": "AVG",
                "values": null,
                "matchScore": 0.5,
                "attributes": [
                  "Worldwide Gross"
                ],
                "inferenceType": "implicit",
                "isAttrAmbiguous": false,
                "isValueAmbiguous": false,
                "meta": {
                  "value_ambiguity_type": null
                }
              }
            ]
          },
          "followUpQuery": false,
          "contextObj": null
        }
      },
      {
        "queryId": 94,
        "query": "give me line charts of worldwide gross over year by major genres",
        "output": {
          "status": "SUCCESS",
          "debug": {
            "execution_durations": {
              "clean_query": 0.007211208343505859,
              "extract_attributes": 0.6802568435668945,
              "extract_vis_type": 0.00004482269287109375,
              "extract_tasks": 1.1598751544952393,
              "get_vis_list": 0.0006442070007324219,
              "total": 1.8480322360992432
            }
          },
          "query_raw": "give me line charts of worldwide gross over year by major genres",
          "query": "give me line charts of worldwide gross over year by major genres",
          "dataset": "https://raw.githubusercontent.com/nl4dv/nl4dv/master/examples/assets/data/movies-w-year.csv",
          "alias": "https://raw.githubusercontent.com/nl4dv/nl4dv/master/examples/assets/aliases/movies-w-year.json",
          "visList": [
            {
              "score": 5.9,
              "scoreObj": {
                "by_attributes": 2.9,
                "by_task": 0,
                "by_vis": 0
              },
              "confidenceObj": {
                "Worldwide Gross": 1,
                "Genre": 1,
                "Release Year": 1
              },
              "attributes": [
                "Worldwide Gross",
                "Genre",
                "Release Year"
              ],
              "queryPhrase": null,
              "visType": null,
              "tasks": [
                "trend"
              ],
              "inferenceType": "implicit",
              "vlSpec": {
                "$schema": "https://vega.github.io/schema/vega-lite/v4.json",
                "mark": {
                  "type": "line",
                  "tooltip": true
                },
                "encoding": {
                  "y": {
                    "field": "Worldwide Gross",
                    "type": "quantitative",
                    "aggregate": "mean",
                    "axis": {
                      "format": "s"
                    }
                  },
                  "color": {
                    "field": "Genre",
                    "type": "nominal",
                    "aggregate": null
                  },
                  "x": {
                    "field": "Release Year",
                    "type": "temporal",
                    "aggregate": null
                  }
                },
                "transform": [],
                "data": {
                  "url": "https://raw.githubusercontent.com/nl4dv/nl4dv/master/examples/assets/data/movies-w-year.csv",
                  "format": {
                    "type": "csv"
                  }
                }
              }
            },
            {
              "score": 5.9,
              "scoreObj": {
                "by_attributes": 2.9,
                "by_task": 0,
                "by_vis": 0
              },
              "confidenceObj": {
                "Worldwide Gross": 1,
                "Genre": 1,
                "Release Year": 1
              },
              "attributes": [
                "Worldwide Gross",
                "Genre",
                "Release Year"
              ],
              "queryPhrase": null,
              "visType": null,
              "tasks": [
                "trend"
              ],
              "inferenceType": "implicit",
              "vlSpec": {
                "$schema": "https://vega.github.io/schema/vega-lite/v4.json",
                "mark": {
                  "type": "line",
                  "tooltip": true
                },
                "encoding": {
                  "y": {
                    "field": "Worldwide Gross",
                    "type": "quantitative",
                    "aggregate": "mean",
                    "axis": {
                      "format": "s"
                    }
                  },
                  "column": {
                    "field": "Genre",
                    "type": "nominal",
                    "aggregate": null
                  },
                  "x": {
                    "field": "Release Year",
                    "type": "temporal",
                    "aggregate": null
                  },
                  "color": {
                    "field": "Genre",
                    "type": "nominal",
                    "aggregate": null
                  }
                },
                "transform": [],
                "data": {
                  "url": "https://raw.githubusercontent.com/nl4dv/nl4dv/master/examples/assets/data/movies-w-year.csv",
                  "format": {
                    "type": "csv"
                  }
                }
              }
            },
            {
              "score": 5.9,
              "scoreObj": {
                "by_attributes": 2.9,
                "by_task": 0,
                "by_vis": 0
              },
              "confidenceObj": {
                "Worldwide Gross": 1,
                "Genre": 1,
                "Release Year": 1
              },
              "attributes": [
                "Worldwide Gross",
                "Genre",
                "Release Year"
              ],
              "queryPhrase": null,
              "visType": null,
              "tasks": [
                "trend"
              ],
              "inferenceType": "implicit",
              "vlSpec": {
                "$schema": "https://vega.github.io/schema/vega-lite/v4.json",
                "mark": {
                  "type": "bar",
                  "tooltip": true
                },
                "encoding": {
                  "y": {
                    "field": "Worldwide Gross",
                    "type": "quantitative",
                    "aggregate": "mean",
                    "axis": {
                      "format": "s"
                    }
                  },
                  "x": {
                    "field": "Genre",
                    "type": "nominal",
                    "aggregate": null
                  },
                  "column": {
                    "field": "Release Year",
                    "type": "temporal",
                    "aggregate": null
                  },
                  "color": {
                    "field": "Genre",
                    "type": "nominal",
                    "aggregate": null
                  }
                },
                "transform": [],
                "data": {
                  "url": "https://raw.githubusercontent.com/nl4dv/nl4dv/master/examples/assets/data/movies-w-year.csv",
                  "format": {
                    "type": "csv"
                  }
                }
              }
            },
            {
              "score": 5.9,
              "scoreObj": {
                "by_attributes": 2.9,
                "by_task": 0,
                "by_vis": 0
              },
              "confidenceObj": {
                "Worldwide Gross": 1,
                "Genre": 1,
                "Release Year": 1
              },
              "attributes": [
                "Worldwide Gross",
                "Genre",
                "Release Year"
              ],
              "queryPhrase": null,
              "visType": null,
              "tasks": [
                "trend"
              ],
              "inferenceType": "implicit",
              "vlSpec": {
                "$schema": "https://vega.github.io/schema/vega-lite/v4.json",
                "mark": {
                  "type": "tick",
                  "tooltip": true
                },
                "encoding": {
                  "y": {
                    "field": "Worldwide Gross",
                    "type": "quantitative",
                    "aggregate": null,
                    "axis": {
                      "format": "s"
                    }
                  },
                  "color": {
                    "field": "Genre",
                    "type": "nominal",
                    "aggregate": null
                  },
                  "x": {
                    "field": "Release Year",
                    "type": "temporal",
                    "aggregate": null
                  },
                  "tooltip": {
                    "field": "Title"
                  }
                },
                "transform": [],
                "data": {
                  "url": "https://raw.githubusercontent.com/nl4dv/nl4dv/master/examples/assets/data/movies-w-year.csv",
                  "format": {
                    "type": "csv"
                  }
                }
              }
            },
            {
              "score": 5.9,
              "scoreObj": {
                "by_attributes": 2.9,
                "by_task": 0,
                "by_vis": 0
              },
              "confidenceObj": {
                "Worldwide Gross": 1,
                "Genre": 1,
                "Release Year": 1
              },
              "attributes": [
                "Worldwide Gross",
                "Genre",
                "Release Year"
              ],
              "queryPhrase": null,
              "visType": null,
              "tasks": [
                "trend"
              ],
              "inferenceType": "implicit",
              "vlSpec": {
                "$schema": "https://vega.github.io/schema/vega-lite/v4.json",
                "mark": {
                  "type": "tick",
                  "tooltip": true
                },
                "encoding": {
                  "y": {
                    "field": "Worldwide Gross",
                    "type": "quantitative",
                    "aggregate": null,
                    "axis": {
                      "format": "s"
                    }
                  },
                  "column": {
                    "field": "Genre",
                    "type": "nominal",
                    "aggregate": null
                  },
                  "x": {
                    "field": "Release Year",
                    "type": "temporal",
                    "aggregate": null
                  },
                  "color": {
                    "field": "Genre",
                    "type": "nominal",
                    "aggregate": null
                  },
                  "tooltip": {
                    "field": "Title"
                  }
                },
                "transform": [],
                "data": {
                  "url": "https://raw.githubusercontent.com/nl4dv/nl4dv/master/examples/assets/data/movies-w-year.csv",
                  "format": {
                    "type": "csv"
                  }
                }
              }
            },
            {
              "score": 5.9,
              "scoreObj": {
                "by_attributes": 2.9,
                "by_task": 0,
                "by_vis": 0
              },
              "confidenceObj": {
                "Worldwide Gross": 1,
                "Genre": 1,
                "Release Year": 1
              },
              "attributes": [
                "Worldwide Gross",
                "Genre",
                "Release Year"
              ],
              "queryPhrase": null,
              "visType": null,
              "tasks": [
                "trend"
              ],
              "inferenceType": "implicit",
              "vlSpec": {
                "$schema": "https://vega.github.io/schema/vega-lite/v4.json",
                "mark": {
                  "type": "tick",
                  "tooltip": true
                },
                "encoding": {
                  "y": {
                    "field": "Worldwide Gross",
                    "type": "quantitative",
                    "aggregate": null,
                    "axis": {
                      "format": "s"
                    }
                  },
                  "x": {
                    "field": "Genre",
                    "type": "nominal",
                    "aggregate": null
                  },
                  "column": {
                    "field": "Release Year",
                    "type": "temporal",
                    "aggregate": null
                  },
                  "color": {
                    "field": "Genre",
                    "type": "nominal",
                    "aggregate": null
                  },
                  "tooltip": {
                    "field": "Title"
                  }
                },
                "transform": [],
                "data": {
                  "url": "https://raw.githubusercontent.com/nl4dv/nl4dv/master/examples/assets/data/movies-w-year.csv",
                  "format": {
                    "type": "csv"
                  }
                }
              }
            }
          ],
          "attributeMap": {
            "Worldwide Gross": {
              "name": "Worldwide Gross",
              "queryPhrase": [
                "worldwide gross"
              ],
              "inferenceType": "explicit",
              "matchScore": 1,
              "metric": [
                "attribute_exact_match"
              ],
              "isLabel": false,
              "encode": true,
              "isAmbiguous": false,
              "ambiguity": [],
              "meta": {
                "score": 100,
                "threshold": 85,
                "alias": null,
                "ambiguity": {},
                "confidence": 100
              }
            },
            "Genre": {
              "name": "Genre",
              "queryPhrase": [
                "genres"
              ],
              "inferenceType": "explicit",
              "matchScore": 1,
              "metric": [
                "attribute_exact_match"
              ],
              "isLabel": false,
              "encode": true,
              "isAmbiguous": false,
              "ambiguity": [],
              "meta": {
                "score": 100,
                "threshold": 85,
                "alias": null,
                "ambiguity": {},
                "confidence": 100
              }
            },
            "Release Year": {
              "name": "Release Year",
              "queryPhrase": [
                "year"
              ],
              "inferenceType": "explicit",
              "matchScore": 0.9,
              "metric": [
                "attribute_similarity_match"
              ],
              "isLabel": false,
              "encode": true,
              "isAmbiguous": false,
              "ambiguity": [],
              "meta": {
                "score": 100,
                "threshold": 85,
                "alias": null,
                "ambiguity": {},
                "confidence": 100
              }
            }
          },
          "taskMap": {
            "trend": [
              {
                "task": "trend",
                "queryPhrase": [],
                "operator": null,
                "values": null,
                "matchScore": 0.5,
                "attributes": [
                  "Worldwide Gross",
                  "Genre",
                  "Release Year"
                ],
                "inferenceType": "implicit",
                "isAttrAmbiguous": false,
                "isValueAmbiguous": false,
                "meta": {
                  "value_ambiguity_type": null
                }
              }
            ]
          },
          "followUpQuery": false,
          "contextObj": null
        }
      },
      {
        "queryId": 95,
        "query": "what's the production budget for movies in different years?",
        "output": {
          "status": "SUCCESS",
          "debug": {
            "execution_durations": {
              "clean_query": 0.002562999725341797,
              "extract_attributes": 0.18967103958129883,
              "extract_vis_type": 0.000020265579223632812,
              "extract_tasks": 1.0683636665344238,
              "get_vis_list": 0.0002391338348388672,
              "total": 1.260857105255127
            }
          },
          "query_raw": "what's the production budget for movies in different years?",
          "query": "what 's the production budget for movies in different years ?",
          "dataset": "https://raw.githubusercontent.com/nl4dv/nl4dv/master/examples/assets/data/movies-w-year.csv",
          "alias": "https://raw.githubusercontent.com/nl4dv/nl4dv/master/examples/assets/aliases/movies-w-year.json",
          "visList": [
            {
              "score": 3.9,
              "scoreObj": {
                "by_attributes": 1.9,
                "by_task": 0,
                "by_vis": 0
              },
              "confidenceObj": {
                "Production Budget": 1,
                "Release Year": 1
              },
              "attributes": [
                "Production Budget",
                "Release Year"
              ],
              "queryPhrase": null,
              "visType": null,
              "tasks": [
                "trend"
              ],
              "inferenceType": "implicit",
              "vlSpec": {
                "$schema": "https://vega.github.io/schema/vega-lite/v4.json",
                "mark": {
                  "type": "line",
                  "tooltip": true
                },
                "encoding": {
                  "y": {
                    "field": "Production Budget",
                    "type": "quantitative",
                    "aggregate": "mean",
                    "axis": {
                      "format": "s"
                    }
                  },
                  "x": {
                    "field": "Release Year",
                    "type": "temporal",
                    "aggregate": null
                  }
                },
                "transform": [],
                "data": {
                  "url": "https://raw.githubusercontent.com/nl4dv/nl4dv/master/examples/assets/data/movies-w-year.csv",
                  "format": {
                    "type": "csv"
                  }
                }
              }
            }
          ],
          "attributeMap": {
            "Production Budget": {
              "name": "Production Budget",
              "queryPhrase": [
                "production budget"
              ],
              "inferenceType": "explicit",
              "matchScore": 1,
              "metric": [
                "attribute_exact_match"
              ],
              "isLabel": false,
              "encode": true,
              "isAmbiguous": false,
              "ambiguity": [],
              "meta": {
                "score": 100,
                "threshold": 85,
                "alias": null,
                "ambiguity": {},
                "confidence": 100
              }
            },
            "Release Year": {
              "name": "Release Year",
              "queryPhrase": [
                "years"
              ],
              "inferenceType": "explicit",
              "matchScore": 0.9,
              "metric": [
                "attribute_similarity_match"
              ],
              "isLabel": false,
              "encode": true,
              "isAmbiguous": false,
              "ambiguity": [],
              "meta": {
                "score": 100,
                "threshold": 85,
                "alias": null,
                "ambiguity": {},
                "confidence": 100
              }
            }
          },
          "taskMap": {
            "trend": [
              {
                "task": "trend",
                "queryPhrase": [],
                "operator": null,
                "values": null,
                "matchScore": 0.5,
                "attributes": [
                  "Production Budget",
                  "Release Year"
                ],
                "inferenceType": "implicit",
                "isAttrAmbiguous": false,
                "isValueAmbiguous": false,
                "meta": {
                  "value_ambiguity_type": null
                }
              }
            ]
          },
          "followUpQuery": false,
          "contextObj": null
        }
      },
      {
        "queryId": 96,
        "query": "histogram of running time",
        "output": {
          "status": "SUCCESS",
          "debug": {
            "execution_durations": {
              "clean_query": 0.0014960765838623047,
              "extract_attributes": 0.1792757511138916,
              "extract_vis_type": 0.000014066696166992188,
              "extract_tasks": 1.0498182773590088,
              "get_vis_list": 0.00022411346435546875,
              "total": 1.2308282852172852
            }
          },
          "query_raw": "histogram of running time",
          "query": "histogram of running time",
          "dataset": "https://raw.githubusercontent.com/nl4dv/nl4dv/master/examples/assets/data/movies-w-year.csv",
          "alias": "https://raw.githubusercontent.com/nl4dv/nl4dv/master/examples/assets/aliases/movies-w-year.json",
          "visList": [
            {
              "score": 3.5,
              "scoreObj": {
                "by_attributes": 1,
                "by_task": 0.5,
                "by_vis": 1
              },
              "confidenceObj": {
                "Running Time": 1
              },
              "attributes": [
                "Running Time"
              ],
              "queryPhrase": "histogram",
              "visType": "histogram",
              "tasks": [
                "distribution"
              ],
              "inferenceType": "explicit",
              "vlSpec": {
                "$schema": "https://vega.github.io/schema/vega-lite/v4.json",
                "mark": {
                  "type": "bar",
                  "tooltip": true
                },
                "encoding": {
                  "x": {
                    "field": "Running Time",
                    "type": "quantitative",
                    "aggregate": null,
                    "bin": true,
                    "axis": {
                      "format": "s"
                    }
                  },
                  "y": {
                    "field": "Running Time",
                    "type": "quantitative",
                    "aggregate": "count",
                    "axis": {
                      "format": "s"
                    }
                  }
                },
                "transform": [],
                "data": {
                  "url": "https://raw.githubusercontent.com/nl4dv/nl4dv/master/examples/assets/data/movies-w-year.csv",
                  "format": {
                    "type": "csv"
                  }
                }
              }
            }
          ],
          "attributeMap": {
            "Running Time": {
              "name": "Running Time",
              "queryPhrase": [
                "running time"
              ],
              "inferenceType": "explicit",
              "matchScore": 1,
              "metric": [
                "attribute_exact_match"
              ],
              "isLabel": false,
              "encode": true,
              "isAmbiguous": false,
              "ambiguity": [],
              "meta": {
                "score": 100,
                "threshold": 85,
                "alias": null,
                "ambiguity": {},
                "confidence": 100
              }
            }
          },
          "taskMap": {
            "distribution": [
              {
                "task": "distribution",
                "queryPhrase": [],
                "operator": null,
                "values": null,
                "matchScore": 0.5,
                "attributes": [
                  "Running Time"
                ],
                "inferenceType": "implicit",
                "isAttrAmbiguous": false,
                "isValueAmbiguous": false,
                "meta": {
                  "value_ambiguity_type": null
                }
              }
            ]
          },
          "followUpQuery": false,
          "contextObj": null
        }
      }
    ],
    "superstore": [
      {
        "queryId": 97,
        "query": "draw a scatterplot of sales vs profit where sales is on the x-axis and points are colored by region",
        "output": {
          "status": "SUCCESS",
          "debug": {
            "execution_durations": {
              "clean_query": 0.012630939483642578,
              "extract_attributes": 12.455065965652466,
              "extract_vis_type": 0.00006413459777832031,
              "extract_tasks": 1.2050652503967285,
              "get_vis_list": 0.0003361701965332031,
              "total": 13.673162460327148
            }
          },
          "query_raw": "draw a scatterplot of sales vs profit where sales is on the x-axis and points are colored by region",
          "query": "draw a scatterplot of sales vs profit where sales is on the x-axis and points are colored by region",
          "dataset": "https://raw.githubusercontent.com/nl4dv/nl4dv/master/examples/assets/data/superstore.csv",
          "alias": "https://raw.githubusercontent.com/nl4dv/nl4dv/master/examples/assets/aliases/superstore.json",
          "visList": [
            {
              "score": 7.5,
              "scoreObj": {
                "by_attributes": 3,
                "by_task": 0.5,
                "by_vis": 1
              },
              "confidenceObj": {
                "Profit": 1,
                "Sales": 1,
                "Region": 1
              },
              "attributes": [
                "Profit",
                "Sales",
                "Region"
              ],
              "queryPhrase": "scatterplot",
              "visType": "scatterplot",
              "tasks": [
                "correlation"
              ],
              "inferenceType": "explicit",
              "vlSpec": {
                "$schema": "https://vega.github.io/schema/vega-lite/v4.json",
                "mark": {
                  "type": "point",
                  "tooltip": true
                },
                "encoding": {
                  "x": {
                    "field": "Profit",
                    "type": "quantitative",
                    "aggregate": null,
                    "axis": {
                      "format": "s"
                    }
                  },
                  "y": {
                    "field": "Sales",
                    "type": "quantitative",
                    "aggregate": null,
                    "axis": {
                      "format": "s"
                    }
                  },
                  "color": {
                    "field": "Region",
                    "type": "nominal",
                    "aggregate": null
                  },
                  "tooltip": {
                    "field": "nan"
                  }
                },
                "transform": [],
                "data": {
                  "url": "https://raw.githubusercontent.com/nl4dv/nl4dv/master/examples/assets/data/superstore.csv",
                  "format": {
                    "type": "csv"
                  }
                }
              }
            },
            {
              "score": 7.5,
              "scoreObj": {
                "by_attributes": 3,
                "by_task": 0.5,
                "by_vis": 1
              },
              "confidenceObj": {
                "Profit": 1,
                "Sales": 1,
                "Region": 1
              },
              "attributes": [
                "Profit",
                "Sales",
                "Region"
              ],
              "queryPhrase": "scatterplot",
              "visType": "scatterplot",
              "tasks": [
                "correlation"
              ],
              "inferenceType": "explicit",
              "vlSpec": {
                "$schema": "https://vega.github.io/schema/vega-lite/v4.json",
                "mark": {
                  "type": "point",
                  "tooltip": true
                },
                "encoding": {
                  "x": {
                    "field": "Profit",
                    "type": "quantitative",
                    "aggregate": null,
                    "axis": {
                      "format": "s"
                    }
                  },
                  "y": {
                    "field": "Sales",
                    "type": "quantitative",
                    "aggregate": null,
                    "axis": {
                      "format": "s"
                    }
                  },
                  "column": {
                    "field": "Region",
                    "type": "nominal",
                    "aggregate": null
                  },
                  "color": {
                    "field": "Region",
                    "type": "nominal",
                    "aggregate": null
                  },
                  "tooltip": {
                    "field": "nan"
                  }
                },
                "transform": [],
                "data": {
                  "url": "https://raw.githubusercontent.com/nl4dv/nl4dv/master/examples/assets/data/superstore.csv",
                  "format": {
                    "type": "csv"
                  }
                }
              }
            }
          ],
          "attributeMap": {
            "Profit": {
              "name": "Profit",
              "queryPhrase": [
                "profit"
              ],
              "inferenceType": "explicit",
              "matchScore": 1,
              "metric": [
                "attribute_exact_match"
              ],
              "isLabel": false,
              "encode": true,
              "isAmbiguous": false,
              "ambiguity": [],
              "meta": {
                "score": 100,
                "threshold": 85,
                "alias": null,
                "ambiguity": {},
                "confidence": 100
              }
            },
            "Region": {
              "name": "Region",
              "queryPhrase": [
                "region"
              ],
              "inferenceType": "explicit",
              "matchScore": 1,
              "metric": [
                "attribute_exact_match"
              ],
              "isLabel": false,
              "encode": true,
              "isAmbiguous": false,
              "ambiguity": [],
              "meta": {
                "score": 100,
                "threshold": 85,
                "alias": null,
                "ambiguity": {},
                "confidence": 100
              }
            },
            "Sales": {
              "name": "Sales",
              "queryPhrase": [
                "sales"
              ],
              "inferenceType": "explicit",
              "matchScore": 1,
              "metric": [
                "attribute_exact_match"
              ],
              "isLabel": false,
              "encode": true,
              "isAmbiguous": false,
              "ambiguity": [],
              "meta": {
                "score": 100,
                "threshold": 85,
                "alias": null,
                "ambiguity": {},
                "confidence": 100
              }
            }
          },
          "taskMap": {
            "correlation": [
              {
                "task": "correlation",
                "queryPhrase": [],
                "operator": null,
                "values": null,
                "matchScore": 0.5,
                "attributes": [
                  "Profit",
                  "Sales"
                ],
                "inferenceType": "implicit",
                "isAttrAmbiguous": false,
                "isValueAmbiguous": false,
                "meta": {
                  "value_ambiguity_type": null
                }
              }
            ]
          },
          "followUpQuery": false,
          "contextObj": null
        }
      },
      {
        "queryId": 98,
        "query": "draw a bar chart of count by sub-category",
        "output": {
          "status": "SUCCESS",
          "debug": {
            "execution_durations": {
              "clean_query": 0.004487752914428711,
              "extract_attributes": 4.7239391803741455,
              "extract_vis_type": 0.00002193450927734375,
              "extract_tasks": 1.0776007175445557,
              "get_vis_list": 0.00014710426330566406,
              "total": 5.806196689605713
            }
          },
          "query_raw": "draw a bar chart of count by sub-category",
          "query": "draw a bar chart of count by sub-category",
          "dataset": "https://raw.githubusercontent.com/nl4dv/nl4dv/master/examples/assets/data/superstore.csv",
          "alias": "https://raw.githubusercontent.com/nl4dv/nl4dv/master/examples/assets/aliases/superstore.json",
          "visList": [
            {
              "score": 3.5,
              "scoreObj": {
                "by_attributes": 1,
                "by_task": 0.5,
                "by_vis": 1
              },
              "confidenceObj": {
                "Category": 1
              },
              "attributes": [
                "Category"
              ],
              "queryPhrase": "bar chart",
              "visType": "barchart",
              "tasks": [
                "distribution"
              ],
              "inferenceType": "explicit",
              "vlSpec": {
                "$schema": "https://vega.github.io/schema/vega-lite/v4.json",
                "mark": {
                  "type": "bar",
                  "tooltip": true
                },
                "encoding": {
                  "x": {
                    "field": "Category",
                    "type": "nominal",
                    "aggregate": null
                  },
                  "y": {
                    "field": "Category",
                    "type": "nominal",
                    "aggregate": "count"
                  }
                },
                "transform": [],
                "data": {
                  "url": "https://raw.githubusercontent.com/nl4dv/nl4dv/master/examples/assets/data/superstore.csv",
                  "format": {
                    "type": "csv"
                  }
                }
              }
            }
          ],
          "attributeMap": {
            "Category": {
              "name": "Category",
              "queryPhrase": [
                "category"
              ],
              "inferenceType": "explicit",
              "matchScore": 1,
              "metric": [
                "attribute_exact_match"
              ],
              "isLabel": false,
              "encode": true,
              "isAmbiguous": false,
              "ambiguity": [],
              "meta": {
                "score": 100,
                "threshold": 85,
                "alias": null,
                "ambiguity": {},
                "confidence": 100
              }
            }
          },
          "taskMap": {
            "distribution": [
              {
                "task": "distribution",
                "queryPhrase": [],
                "operator": null,
                "values": null,
                "matchScore": 0.5,
                "attributes": [
                  "Category"
                ],
                "inferenceType": "implicit",
                "isAttrAmbiguous": false,
                "isValueAmbiguous": false,
                "meta": {
                  "value_ambiguity_type": null
                }
              }
            ]
          },
          "followUpQuery": false,
          "contextObj": null
        }
      },
      {
        "queryId": 99,
        "query": "by ship mode, draw a bar chart of average profit by split by segment",
        "output": {
          "status": "SUCCESS",
          "debug": {
            "execution_durations": {
              "clean_query": 0.009175777435302734,
              "extract_attributes": 10.660959005355835,
              "extract_vis_type": 0.0000400543212890625,
              "extract_tasks": 1.2577931880950928,
              "get_vis_list": 0.0004801750183105469,
              "total": 11.92844820022583
            }
          },
          "query_raw": "by ship mode, draw a bar chart of average profit by split by segment",
          "query": "by ship mode , draw a bar chart of average profit by split by segment",
          "dataset": "https://raw.githubusercontent.com/nl4dv/nl4dv/master/examples/assets/data/superstore.csv",
          "alias": "https://raw.githubusercontent.com/nl4dv/nl4dv/master/examples/assets/aliases/superstore.json",
          "visList": [
            {
              "score": 8,
              "scoreObj": {
                "by_attributes": 3,
                "by_task": 1,
                "by_vis": 1
              },
              "confidenceObj": {
                "Profit": 1,
                "Segment": 1,
                "Ship Mode": 1
              },
              "attributes": [
                "Profit",
                "Segment",
                "Ship Mode"
              ],
              "queryPhrase": "bar chart",
              "visType": "barchart",
              "tasks": [
                "derived_value"
              ],
              "inferenceType": "explicit",
              "vlSpec": {
                "$schema": "https://vega.github.io/schema/vega-lite/v4.json",
                "mark": {
                  "type": "bar",
                  "tooltip": true
                },
                "encoding": {
                  "y": {
                    "field": "Profit",
                    "type": "quantitative",
                    "aggregate": "mean",
                    "axis": {
                      "format": "s"
                    }
                  },
                  "x": {
                    "field": "Segment",
                    "type": "nominal",
                    "aggregate": null
                  },
                  "color": {
                    "field": "Ship Mode",
                    "type": "nominal",
                    "aggregate": null
                  }
                },
                "transform": [],
                "data": {
                  "url": "https://raw.githubusercontent.com/nl4dv/nl4dv/master/examples/assets/data/superstore.csv",
                  "format": {
                    "type": "csv"
                  }
                }
              }
            },
            {
              "score": 8,
              "scoreObj": {
                "by_attributes": 3,
                "by_task": 1,
                "by_vis": 1
              },
              "confidenceObj": {
                "Profit": 1,
                "Segment": 1,
                "Ship Mode": 1
              },
              "attributes": [
                "Profit",
                "Segment",
                "Ship Mode"
              ],
              "queryPhrase": "bar chart",
              "visType": "barchart",
              "tasks": [
                "derived_value"
              ],
              "inferenceType": "explicit",
              "vlSpec": {
                "$schema": "https://vega.github.io/schema/vega-lite/v4.json",
                "mark": {
                  "type": "bar",
                  "tooltip": true
                },
                "encoding": {
                  "y": {
                    "field": "Profit",
                    "type": "quantitative",
                    "aggregate": "mean",
                    "axis": {
                      "format": "s"
                    }
                  },
                  "column": {
                    "field": "Segment",
                    "type": "nominal",
                    "aggregate": null
                  },
                  "x": {
                    "field": "Ship Mode",
                    "type": "nominal",
                    "aggregate": null
                  },
                  "color": {
                    "field": "Segment",
                    "type": "nominal",
                    "aggregate": null
                  }
                },
                "transform": [],
                "data": {
                  "url": "https://raw.githubusercontent.com/nl4dv/nl4dv/master/examples/assets/data/superstore.csv",
                  "format": {
                    "type": "csv"
                  }
                }
              }
            }
          ],
          "attributeMap": {
            "Profit": {
              "name": "Profit",
              "queryPhrase": [
                "profit"
              ],
              "inferenceType": "explicit",
              "matchScore": 1,
              "metric": [
                "attribute_exact_match"
              ],
              "isLabel": false,
              "encode": true,
              "isAmbiguous": false,
              "ambiguity": [],
              "meta": {
                "score": 100,
                "threshold": 85,
                "alias": null,
                "ambiguity": {},
                "confidence": 100
              }
            },
            "Segment": {
              "name": "Segment",
              "queryPhrase": [
                "segment"
              ],
              "inferenceType": "explicit",
              "matchScore": 1,
              "metric": [
                "attribute_exact_match"
              ],
              "isLabel": false,
              "encode": true,
              "isAmbiguous": false,
              "ambiguity": [],
              "meta": {
                "score": 100,
                "threshold": 85,
                "alias": null,
                "ambiguity": {},
                "confidence": 100
              }
            },
            "Ship Mode": {
              "name": "Ship Mode",
              "queryPhrase": [
                "ship mode"
              ],
              "inferenceType": "explicit",
              "matchScore": 1,
              "metric": [
                "attribute_exact_match"
              ],
              "isLabel": false,
              "encode": true,
              "isAmbiguous": false,
              "ambiguity": [],
              "meta": {
                "score": 100,
                "threshold": 85,
                "alias": null,
                "ambiguity": {},
                "confidence": 100
              }
            }
          },
          "taskMap": {
            "derived_value": [
              {
                "task": "derived_value",
                "queryPhrase": "average",
                "operator": "AVG",
                "values": [],
                "matchScore": 1,
                "attributes": [
                  "Profit"
                ],
                "inferenceType": "explicit",
                "isAttrAmbiguous": false,
                "isValueAmbiguous": false,
                "meta": {
                  "value_ambiguity_type": null
                }
              }
            ]
          },
          "followUpQuery": false,
          "contextObj": null
        }
      },
      {
        "queryId": 100,
        "query": "make a stacked bar chart summing profit across region, where profit is colored by ship status",
        "output": {
          "status": "SUCCESS",
          "debug": {
            "execution_durations": {
              "clean_query": 0.015636920928955078,
              "extract_attributes": 15.906842231750488,
              "extract_vis_type": 0.00005793571472167969,
              "extract_tasks": 1.1900720596313477,
              "get_vis_list": 0.0004239082336425781,
              "total": 17.113033056259155
            }
          },
          "query_raw": "make a stacked bar chart summing profit across region, where profit is colored by ship status",
          "query": "make a stacked bar chart summing profit across region , where profit is colored by ship status",
          "dataset": "https://raw.githubusercontent.com/nl4dv/nl4dv/master/examples/assets/data/superstore.csv",
          "alias": "https://raw.githubusercontent.com/nl4dv/nl4dv/master/examples/assets/aliases/superstore.json",
          "visList": [
            {
              "score": 7.5,
              "scoreObj": {
                "by_attributes": 3,
                "by_task": 0.5,
                "by_vis": 1
              },
              "confidenceObj": {
                "Profit": 1,
                "Ship Status": 1,
                "Region": 1
              },
              "attributes": [
                "Profit",
                "Ship Status",
                "Region"
              ],
              "queryPhrase": "bar chart",
              "visType": "barchart",
              "tasks": [
                "derived_value"
              ],
              "inferenceType": "explicit",
              "vlSpec": {
                "$schema": "https://vega.github.io/schema/vega-lite/v4.json",
                "mark": {
                  "type": "bar",
                  "tooltip": true
                },
                "encoding": {
                  "y": {
                    "field": "Profit",
                    "type": "quantitative",
                    "aggregate": "mean",
                    "axis": {
                      "format": "s"
                    }
                  },
                  "x": {
                    "field": "Ship Status",
                    "type": "nominal",
                    "aggregate": null
                  },
                  "color": {
                    "field": "Region",
                    "type": "nominal",
                    "aggregate": null
                  }
                },
                "transform": [],
                "data": {
                  "url": "https://raw.githubusercontent.com/nl4dv/nl4dv/master/examples/assets/data/superstore.csv",
                  "format": {
                    "type": "csv"
                  }
                }
              }
            },
            {
              "score": 7.5,
              "scoreObj": {
                "by_attributes": 3,
                "by_task": 0.5,
                "by_vis": 1
              },
              "confidenceObj": {
                "Profit": 1,
                "Ship Status": 1,
                "Region": 1
              },
              "attributes": [
                "Profit",
                "Ship Status",
                "Region"
              ],
              "queryPhrase": "bar chart",
              "visType": "barchart",
              "tasks": [
                "derived_value"
              ],
              "inferenceType": "explicit",
              "vlSpec": {
                "$schema": "https://vega.github.io/schema/vega-lite/v4.json",
                "mark": {
                  "type": "bar",
                  "tooltip": true
                },
                "encoding": {
                  "y": {
                    "field": "Profit",
                    "type": "quantitative",
                    "aggregate": "mean",
                    "axis": {
                      "format": "s"
                    }
                  },
                  "column": {
                    "field": "Ship Status",
                    "type": "nominal",
                    "aggregate": null
                  },
                  "x": {
                    "field": "Region",
                    "type": "nominal",
                    "aggregate": null
                  },
                  "color": {
                    "field": "Ship Status",
                    "type": "nominal",
                    "aggregate": null
                  }
                },
                "transform": [],
                "data": {
                  "url": "https://raw.githubusercontent.com/nl4dv/nl4dv/master/examples/assets/data/superstore.csv",
                  "format": {
                    "type": "csv"
                  }
                }
              }
            }
          ],
          "attributeMap": {
            "Ship Status": {
              "name": "Ship Status",
              "queryPhrase": [
                "ship status"
              ],
              "inferenceType": "explicit",
              "matchScore": 1,
              "metric": [
                "attribute_exact_match"
              ],
              "isLabel": false,
              "encode": true,
              "isAmbiguous": false,
              "ambiguity": [],
              "meta": {
                "score": 100,
                "threshold": 85,
                "alias": null,
                "ambiguity": {},
                "confidence": 100
              }
            },
            "Profit": {
              "name": "Profit",
              "queryPhrase": [
                "profit"
              ],
              "inferenceType": "explicit",
              "matchScore": 1,
              "metric": [
                "attribute_exact_match"
              ],
              "isLabel": false,
              "encode": true,
              "isAmbiguous": false,
              "ambiguity": [],
              "meta": {
                "score": 100,
                "threshold": 85,
                "alias": null,
                "ambiguity": {},
                "confidence": 100
              }
            },
            "Region": {
              "name": "Region",
              "queryPhrase": [
                "region"
              ],
              "inferenceType": "explicit",
              "matchScore": 1,
              "metric": [
                "attribute_exact_match"
              ],
              "isLabel": false,
              "encode": true,
              "isAmbiguous": false,
              "ambiguity": [],
              "meta": {
                "score": 100,
                "threshold": 85,
                "alias": null,
                "ambiguity": {},
                "confidence": 100
              }
            }
          },
          "taskMap": {
            "derived_value": [
              {
                "task": "derived_value",
                "queryPhrase": [],
                "operator": "AVG",
                "values": null,
                "matchScore": 0.5,
                "attributes": [
                  "Profit"
                ],
                "inferenceType": "implicit",
                "isAttrAmbiguous": false,
                "isValueAmbiguous": false,
                "meta": {
                  "value_ambiguity_type": null
                }
              }
            ]
          },
          "followUpQuery": false,
          "contextObj": null
        }
      },
      {
        "queryId": 101,
        "query": "make a bar chart of avgerage profit by state, with state on x axis.",
        "output": {
          "status": "SUCCESS",
          "debug": {
            "execution_durations": {
              "clean_query": 0.008925914764404297,
              "extract_attributes": 10.016573190689087,
              "extract_vis_type": 0.00004100799560546875,
              "extract_tasks": 1.196063756942749,
              "get_vis_list": 0.00025391578674316406,
              "total": 11.221857786178589
            }
          },
          "query_raw": "make a bar chart of avgerage profit by state, with state on x axis.",
          "query": "make a bar chart of avgerage profit by state , with state on x axis .",
          "dataset": "https://raw.githubusercontent.com/nl4dv/nl4dv/master/examples/assets/data/superstore.csv",
          "alias": "https://raw.githubusercontent.com/nl4dv/nl4dv/master/examples/assets/aliases/superstore.json",
          "visList": [
            {
              "score": 5.5,
              "scoreObj": {
                "by_attributes": 2,
                "by_task": 0.5,
                "by_vis": 1
              },
              "confidenceObj": {
                "Profit": 1,
                "State": 1
              },
              "attributes": [
                "Profit",
                "State"
              ],
              "queryPhrase": "bar chart",
              "visType": "barchart",
              "tasks": [
                "derived_value"
              ],
              "inferenceType": "explicit",
              "vlSpec": {
                "$schema": "https://vega.github.io/schema/vega-lite/v4.json",
                "mark": {
                  "type": "bar",
                  "tooltip": true
                },
                "encoding": {
                  "y": {
                    "field": "Profit",
                    "type": "quantitative",
                    "aggregate": "mean",
                    "axis": {
                      "format": "s"
                    }
                  },
                  "x": {
                    "field": "State",
                    "type": "nominal",
                    "aggregate": null
                  }
                },
                "transform": [],
                "data": {
                  "url": "https://raw.githubusercontent.com/nl4dv/nl4dv/master/examples/assets/data/superstore.csv",
                  "format": {
                    "type": "csv"
                  }
                }
              }
            }
          ],
          "attributeMap": {
            "Profit": {
              "name": "Profit",
              "queryPhrase": [
                "profit"
              ],
              "inferenceType": "explicit",
              "matchScore": 1,
              "metric": [
                "attribute_exact_match"
              ],
              "isLabel": false,
              "encode": true,
              "isAmbiguous": false,
              "ambiguity": [],
              "meta": {
                "score": 100,
                "threshold": 85,
                "alias": null,
                "ambiguity": {},
                "confidence": 100
              }
            },
            "State": {
              "name": "State",
              "queryPhrase": [
                "state"
              ],
              "inferenceType": "explicit",
              "matchScore": 1,
              "metric": [
                "attribute_exact_match"
              ],
              "isLabel": false,
              "encode": true,
              "isAmbiguous": false,
              "ambiguity": [],
              "meta": {
                "score": 100,
                "threshold": 85,
                "alias": null,
                "ambiguity": {},
                "confidence": 100
              }
            }
          },
          "taskMap": {
            "derived_value": [
              {
                "task": "derived_value",
                "queryPhrase": [],
                "operator": "AVG",
                "values": null,
                "matchScore": 0.5,
                "attributes": [
                  "Profit"
                ],
                "inferenceType": "implicit",
                "isAttrAmbiguous": false,
                "isValueAmbiguous": false,
                "meta": {
                  "value_ambiguity_type": null
                }
              }
            ]
          },
          "followUpQuery": false,
          "contextObj": null
        }
      },
      {
        "queryId": 102,
        "query": "how much is the profit for sales for each",
        "output": {
          "status": "SUCCESS",
          "debug": {
            "execution_durations": {
              "clean_query": 0.0014789104461669922,
              "extract_attributes": 1.315845251083374,
              "extract_vis_type": 0.000015735626220703125,
              "extract_tasks": 1.0552752017974854,
              "get_vis_list": 0.0001609325408935547,
              "total": 2.3727760314941406
            }
          },
          "query_raw": "how much is the profit for sales for each",
          "query": "how much is the profit for sales for each",
          "dataset": "https://raw.githubusercontent.com/nl4dv/nl4dv/master/examples/assets/data/superstore.csv",
          "alias": "https://raw.githubusercontent.com/nl4dv/nl4dv/master/examples/assets/aliases/superstore.json",
          "visList": [
            {
              "score": 4.5,
              "scoreObj": {
                "by_attributes": 2,
                "by_task": 0.5,
                "by_vis": 0
              },
              "confidenceObj": {
                "Profit": 1,
                "Sales": 1
              },
              "attributes": [
                "Profit",
                "Sales"
              ],
              "queryPhrase": null,
              "visType": null,
              "tasks": [
                "correlation"
              ],
              "inferenceType": "implicit",
              "vlSpec": {
                "$schema": "https://vega.github.io/schema/vega-lite/v4.json",
                "mark": {
                  "type": "point",
                  "tooltip": true
                },
                "encoding": {
                  "x": {
                    "field": "Profit",
                    "type": "quantitative",
                    "aggregate": null,
                    "axis": {
                      "format": "s"
                    }
                  },
                  "y": {
                    "field": "Sales",
                    "type": "quantitative",
                    "aggregate": null,
                    "axis": {
                      "format": "s"
                    }
                  },
                  "tooltip": {
                    "field": "nan"
                  }
                },
                "transform": [],
                "data": {
                  "url": "https://raw.githubusercontent.com/nl4dv/nl4dv/master/examples/assets/data/superstore.csv",
                  "format": {
                    "type": "csv"
                  }
                }
              }
            }
          ],
          "attributeMap": {
            "Profit": {
              "name": "Profit",
              "queryPhrase": [
                "profit"
              ],
              "inferenceType": "explicit",
              "matchScore": 1,
              "metric": [
                "attribute_exact_match"
              ],
              "isLabel": false,
              "encode": true,
              "isAmbiguous": false,
              "ambiguity": [],
              "meta": {
                "score": 100,
                "threshold": 85,
                "alias": null,
                "ambiguity": {},
                "confidence": 100
              }
            },
            "Sales": {
              "name": "Sales",
              "queryPhrase": [
                "sales"
              ],
              "inferenceType": "explicit",
              "matchScore": 1,
              "metric": [
                "attribute_exact_match"
              ],
              "isLabel": false,
              "encode": true,
              "isAmbiguous": false,
              "ambiguity": [],
              "meta": {
                "score": 100,
                "threshold": 85,
                "alias": null,
                "ambiguity": {},
                "confidence": 100
              }
            }
          },
          "taskMap": {
            "correlation": [
              {
                "task": "correlation",
                "queryPhrase": [],
                "operator": null,
                "values": null,
                "matchScore": 0.5,
                "attributes": [
                  "Profit",
                  "Sales"
                ],
                "inferenceType": "implicit",
                "isAttrAmbiguous": false,
                "isValueAmbiguous": false,
                "meta": {
                  "value_ambiguity_type": null
                }
              }
            ]
          },
          "followUpQuery": false,
          "contextObj": null
        }
      },
      {
        "queryId": 103,
        "query": "What is the average profit of different segments on the ship modes of transport",
        "output": {
          "status": "SUCCESS",
          "debug": {
            "execution_durations": {
              "clean_query": 0.005528688430786133,
              "extract_attributes": 6.210833787918091,
              "extract_vis_type": 0.00003910064697265625,
              "extract_tasks": 1.0927319526672363,
              "get_vis_list": 0.0004527568817138672,
              "total": 7.3095862865448
            }
          },
          "query_raw": "What is the average profit of different segments on the ship modes of transport",
          "query": "what is the average profit of different segments on the ship modes of transport",
          "dataset": "https://raw.githubusercontent.com/nl4dv/nl4dv/master/examples/assets/data/superstore.csv",
          "alias": "https://raw.githubusercontent.com/nl4dv/nl4dv/master/examples/assets/aliases/superstore.json",
          "visList": [
            {
              "score": 7,
              "scoreObj": {
                "by_attributes": 3,
                "by_task": 1,
                "by_vis": 0
              },
              "confidenceObj": {
                "Profit": 1,
                "Segment": 1,
                "Ship Mode": 1
              },
              "attributes": [
                "Profit",
                "Segment",
                "Ship Mode"
              ],
              "queryPhrase": null,
              "visType": null,
              "tasks": [
                "derived_value"
              ],
              "inferenceType": "implicit",
              "vlSpec": {
                "$schema": "https://vega.github.io/schema/vega-lite/v4.json",
                "mark": {
                  "type": "bar",
                  "tooltip": true
                },
                "encoding": {
                  "y": {
                    "field": "Profit",
                    "type": "quantitative",
                    "aggregate": "mean",
                    "axis": {
                      "format": "s"
                    }
                  },
                  "x": {
                    "field": "Segment",
                    "type": "nominal",
                    "aggregate": null
                  },
                  "color": {
                    "field": "Ship Mode",
                    "type": "nominal",
                    "aggregate": null
                  }
                },
                "transform": [],
                "data": {
                  "url": "https://raw.githubusercontent.com/nl4dv/nl4dv/master/examples/assets/data/superstore.csv",
                  "format": {
                    "type": "csv"
                  }
                }
              }
            },
            {
              "score": 7,
              "scoreObj": {
                "by_attributes": 3,
                "by_task": 1,
                "by_vis": 0
              },
              "confidenceObj": {
                "Profit": 1,
                "Segment": 1,
                "Ship Mode": 1
              },
              "attributes": [
                "Profit",
                "Segment",
                "Ship Mode"
              ],
              "queryPhrase": null,
              "visType": null,
              "tasks": [
                "derived_value"
              ],
              "inferenceType": "implicit",
              "vlSpec": {
                "$schema": "https://vega.github.io/schema/vega-lite/v4.json",
                "mark": {
                  "type": "bar",
                  "tooltip": true
                },
                "encoding": {
                  "y": {
                    "field": "Profit",
                    "type": "quantitative",
                    "aggregate": "mean",
                    "axis": {
                      "format": "s"
                    }
                  },
                  "column": {
                    "field": "Segment",
                    "type": "nominal",
                    "aggregate": null
                  },
                  "x": {
                    "field": "Ship Mode",
                    "type": "nominal",
                    "aggregate": null
                  },
                  "color": {
                    "field": "Segment",
                    "type": "nominal",
                    "aggregate": null
                  }
                },
                "transform": [],
                "data": {
                  "url": "https://raw.githubusercontent.com/nl4dv/nl4dv/master/examples/assets/data/superstore.csv",
                  "format": {
                    "type": "csv"
                  }
                }
              }
            },
            {
              "score": 7,
              "scoreObj": {
                "by_attributes": 3,
                "by_task": 1,
                "by_vis": 0
              },
              "confidenceObj": {
                "Profit": 1,
                "Segment": 1,
                "Ship Mode": 1
              },
              "attributes": [
                "Profit",
                "Segment",
                "Ship Mode"
              ],
              "queryPhrase": null,
              "visType": null,
              "tasks": [
                "derived_value"
              ],
              "inferenceType": "implicit",
              "vlSpec": {
                "$schema": "https://vega.github.io/schema/vega-lite/v4.json",
                "mark": {
                  "type": "point",
                  "tooltip": true
                },
                "encoding": {
                  "size": {
                    "field": "Profit",
                    "type": "quantitative",
                    "aggregate": "mean"
                  },
                  "x": {
                    "field": "Segment",
                    "type": "nominal",
                    "aggregate": null
                  },
                  "y": {
                    "field": "Ship Mode",
                    "type": "nominal",
                    "aggregate": null
                  }
                },
                "transform": [],
                "data": {
                  "url": "https://raw.githubusercontent.com/nl4dv/nl4dv/master/examples/assets/data/superstore.csv",
                  "format": {
                    "type": "csv"
                  }
                }
              }
            }
          ],
          "attributeMap": {
            "Profit": {
              "name": "Profit",
              "queryPhrase": [
                "profit"
              ],
              "inferenceType": "explicit",
              "matchScore": 1,
              "metric": [
                "attribute_exact_match"
              ],
              "isLabel": false,
              "encode": true,
              "isAmbiguous": false,
              "ambiguity": [],
              "meta": {
                "score": 100,
                "threshold": 85,
                "alias": null,
                "ambiguity": {},
                "confidence": 100
              }
            },
            "Segment": {
              "name": "Segment",
              "queryPhrase": [
                "segments"
              ],
              "inferenceType": "explicit",
              "matchScore": 1,
              "metric": [
                "attribute_exact_match"
              ],
              "isLabel": false,
              "encode": true,
              "isAmbiguous": false,
              "ambiguity": [],
              "meta": {
                "score": 100,
                "threshold": 85,
                "alias": null,
                "ambiguity": {},
                "confidence": 100
              }
            },
            "Ship Mode": {
              "name": "Ship Mode",
              "queryPhrase": [
                "ship modes"
              ],
              "inferenceType": "explicit",
              "matchScore": 1,
              "metric": [
                "attribute_exact_match"
              ],
              "isLabel": false,
              "encode": true,
              "isAmbiguous": false,
              "ambiguity": [],
              "meta": {
                "score": 100,
                "threshold": 85,
                "alias": null,
                "ambiguity": {},
                "confidence": 100
              }
            }
          },
          "taskMap": {
            "derived_value": [
              {
                "task": "derived_value",
                "queryPhrase": "average",
                "operator": "AVG",
                "values": [],
                "matchScore": 1,
                "attributes": [
                  "Profit"
                ],
                "inferenceType": "explicit",
                "isAttrAmbiguous": false,
                "isValueAmbiguous": false,
                "meta": {
                  "value_ambiguity_type": null
                }
              }
            ]
          },
          "followUpQuery": false,
          "contextObj": null
        }
      },
      {
        "queryId": 104,
        "query": "What is the average profit of each country",
        "output": {
          "status": "SUCCESS",
          "debug": {
            "execution_durations": {
              "clean_query": 0.0016031265258789062,
              "extract_attributes": 1.2691457271575928,
              "extract_vis_type": 0.000014066696166992188,
              "extract_tasks": 1.0560407638549805,
              "get_vis_list": 0.0003609657287597656,
              "total": 2.327164649963379
            }
          },
          "query_raw": "What is the average profit of each country",
          "query": "what is the average profit of each country",
          "dataset": "https://raw.githubusercontent.com/nl4dv/nl4dv/master/examples/assets/data/superstore.csv",
          "alias": "https://raw.githubusercontent.com/nl4dv/nl4dv/master/examples/assets/aliases/superstore.json",
          "visList": [
            {
              "score": 5,
              "scoreObj": {
                "by_attributes": 2,
                "by_task": 1,
                "by_vis": 0
              },
              "confidenceObj": {
                "Profit": 1,
                "Country": 1
              },
              "attributes": [
                "Profit",
                "Country"
              ],
              "queryPhrase": null,
              "visType": null,
              "tasks": [
                "derived_value"
              ],
              "inferenceType": "implicit",
              "vlSpec": {
                "$schema": "https://vega.github.io/schema/vega-lite/v4.json",
                "mark": {
                  "type": "bar",
                  "tooltip": true
                },
                "encoding": {
                  "y": {
                    "field": "Profit",
                    "type": "quantitative",
                    "aggregate": "mean",
                    "axis": {
                      "format": "s"
                    }
                  },
                  "x": {
                    "field": "Country",
                    "type": "nominal",
                    "aggregate": null
                  }
                },
                "transform": [],
                "data": {
                  "url": "https://raw.githubusercontent.com/nl4dv/nl4dv/master/examples/assets/data/superstore.csv",
                  "format": {
                    "type": "csv"
                  }
                }
              }
            }
          ],
          "attributeMap": {
            "Country": {
              "name": "Country",
              "queryPhrase": [
                "country"
              ],
              "inferenceType": "explicit",
              "matchScore": 1,
              "metric": [
                "attribute_exact_match"
              ],
              "isLabel": false,
              "encode": true,
              "isAmbiguous": false,
              "ambiguity": [],
              "meta": {
                "score": 100,
                "threshold": 85,
                "alias": null,
                "ambiguity": {},
                "confidence": 100
              }
            },
            "Profit": {
              "name": "Profit",
              "queryPhrase": [
                "profit"
              ],
              "inferenceType": "explicit",
              "matchScore": 1,
              "metric": [
                "attribute_exact_match"
              ],
              "isLabel": false,
              "encode": true,
              "isAmbiguous": false,
              "ambiguity": [],
              "meta": {
                "score": 100,
                "threshold": 85,
                "alias": null,
                "ambiguity": {},
                "confidence": 100
              }
            }
          },
          "taskMap": {
            "derived_value": [
              {
                "task": "derived_value",
                "queryPhrase": "average",
                "operator": "AVG",
                "values": [],
                "matchScore": 1,
                "attributes": [
                  "Profit"
                ],
                "inferenceType": "explicit",
                "isAttrAmbiguous": false,
                "isValueAmbiguous": false,
                "meta": {
                  "value_ambiguity_type": null
                }
              }
            ]
          },
          "followUpQuery": false,
          "contextObj": null
        }
      },
      {
        "queryId": 105,
        "query": "summarize the total profit by region using by a stacked bar plot",
        "output": {
          "status": "SUCCESS",
          "debug": {
            "execution_durations": {
              "clean_query": 0.008358001708984375,
              "extract_attributes": 8.066926002502441,
              "extract_vis_type": 0.00005888938903808594,
              "extract_tasks": 1.1456079483032227,
              "get_vis_list": 0.00026607513427734375,
              "total": 9.221216917037964
            }
          },
          "query_raw": "summarize the total profit by region using by a stacked bar plot",
          "query": "summarize the total profit by region using by a stacked bar plot",
          "dataset": "https://raw.githubusercontent.com/nl4dv/nl4dv/master/examples/assets/data/superstore.csv",
          "alias": "https://raw.githubusercontent.com/nl4dv/nl4dv/master/examples/assets/aliases/superstore.json",
          "visList": [
            {
              "score": 5,
              "scoreObj": {
                "by_attributes": 2,
                "by_task": 1,
                "by_vis": 0
              },
              "confidenceObj": {
                "Profit": 1,
                "Region": 1
              },
              "attributes": [
                "Profit",
                "Region"
              ],
              "queryPhrase": null,
              "visType": null,
              "tasks": [
                "derived_value"
              ],
              "inferenceType": "implicit",
              "vlSpec": {
                "$schema": "https://vega.github.io/schema/vega-lite/v4.json",
                "mark": {
                  "type": "bar",
                  "tooltip": true
                },
                "encoding": {
                  "y": {
                    "field": "Profit",
                    "type": "quantitative",
                    "aggregate": "sum",
                    "axis": {
                      "format": "s"
                    }
                  },
                  "x": {
                    "field": "Region",
                    "type": "nominal",
                    "aggregate": null
                  }
                },
                "transform": [],
                "data": {
                  "url": "https://raw.githubusercontent.com/nl4dv/nl4dv/master/examples/assets/data/superstore.csv",
                  "format": {
                    "type": "csv"
                  }
                }
              }
            }
          ],
          "attributeMap": {
            "Profit": {
              "name": "Profit",
              "queryPhrase": [
                "profit"
              ],
              "inferenceType": "explicit",
              "matchScore": 1,
              "metric": [
                "attribute_exact_match"
              ],
              "isLabel": false,
              "encode": true,
              "isAmbiguous": false,
              "ambiguity": [],
              "meta": {
                "score": 100,
                "threshold": 85,
                "alias": null,
                "ambiguity": {},
                "confidence": 100
              }
            },
            "Region": {
              "name": "Region",
              "queryPhrase": [
                "region"
              ],
              "inferenceType": "explicit",
              "matchScore": 1,
              "metric": [
                "attribute_exact_match"
              ],
              "isLabel": false,
              "encode": true,
              "isAmbiguous": false,
              "ambiguity": [],
              "meta": {
                "score": 100,
                "threshold": 85,
                "alias": null,
                "ambiguity": {},
                "confidence": 100
              }
            }
          },
          "taskMap": {
            "derived_value": [
              {
                "task": "derived_value",
                "queryPhrase": "total",
                "operator": "SUM",
                "values": [],
                "matchScore": 1,
                "attributes": [
                  "Profit"
                ],
                "inferenceType": "explicit",
                "isAttrAmbiguous": false,
                "isValueAmbiguous": false,
                "meta": {
                  "value_ambiguity_type": null
                }
              }
            ]
          },
          "followUpQuery": false,
          "contextObj": null
        }
      },
      {
        "queryId": 106,
        "query": "Scatterplot profit vs sales with color indicating geographic region of the U.S.",
        "output": {
          "status": "SUCCESS",
          "debug": {
            "execution_durations": {
              "clean_query": 0.006381034851074219,
              "extract_attributes": 8.130510091781616,
              "extract_vis_type": 0.00003814697265625,
              "extract_tasks": 1.1945409774780273,
              "get_vis_list": 0.0003101825714111328,
              "total": 9.331780433654785
            }
          },
          "query_raw": "Scatterplot profit vs sales with color indicating geographic region of the U.S.",
          "query": "scatterplot profit vs sales with color indicating geographic region of the u.s .",
          "dataset": "https://raw.githubusercontent.com/nl4dv/nl4dv/master/examples/assets/data/superstore.csv",
          "alias": "https://raw.githubusercontent.com/nl4dv/nl4dv/master/examples/assets/aliases/superstore.json",
          "visList": [
            {
              "score": 7.5,
              "scoreObj": {
                "by_attributes": 3,
                "by_task": 0.5,
                "by_vis": 1
              },
              "confidenceObj": {
                "Profit": 1,
                "Sales": 1,
                "Region": 1
              },
              "attributes": [
                "Profit",
                "Sales",
                "Region"
              ],
              "queryPhrase": "scatterplot",
              "visType": "scatterplot",
              "tasks": [
                "correlation"
              ],
              "inferenceType": "explicit",
              "vlSpec": {
                "$schema": "https://vega.github.io/schema/vega-lite/v4.json",
                "mark": {
                  "type": "point",
                  "tooltip": true
                },
                "encoding": {
                  "x": {
                    "field": "Profit",
                    "type": "quantitative",
                    "aggregate": null,
                    "axis": {
                      "format": "s"
                    }
                  },
                  "y": {
                    "field": "Sales",
                    "type": "quantitative",
                    "aggregate": null,
                    "axis": {
                      "format": "s"
                    }
                  },
                  "color": {
                    "field": "Region",
                    "type": "nominal",
                    "aggregate": null
                  },
                  "tooltip": {
                    "field": "nan"
                  }
                },
                "transform": [],
                "data": {
                  "url": "https://raw.githubusercontent.com/nl4dv/nl4dv/master/examples/assets/data/superstore.csv",
                  "format": {
                    "type": "csv"
                  }
                }
              }
            },
            {
              "score": 7.5,
              "scoreObj": {
                "by_attributes": 3,
                "by_task": 0.5,
                "by_vis": 1
              },
              "confidenceObj": {
                "Profit": 1,
                "Sales": 1,
                "Region": 1
              },
              "attributes": [
                "Profit",
                "Sales",
                "Region"
              ],
              "queryPhrase": "scatterplot",
              "visType": "scatterplot",
              "tasks": [
                "correlation"
              ],
              "inferenceType": "explicit",
              "vlSpec": {
                "$schema": "https://vega.github.io/schema/vega-lite/v4.json",
                "mark": {
                  "type": "point",
                  "tooltip": true
                },
                "encoding": {
                  "x": {
                    "field": "Profit",
                    "type": "quantitative",
                    "aggregate": null,
                    "axis": {
                      "format": "s"
                    }
                  },
                  "y": {
                    "field": "Sales",
                    "type": "quantitative",
                    "aggregate": null,
                    "axis": {
                      "format": "s"
                    }
                  },
                  "column": {
                    "field": "Region",
                    "type": "nominal",
                    "aggregate": null
                  },
                  "color": {
                    "field": "Region",
                    "type": "nominal",
                    "aggregate": null
                  },
                  "tooltip": {
                    "field": "nan"
                  }
                },
                "transform": [],
                "data": {
                  "url": "https://raw.githubusercontent.com/nl4dv/nl4dv/master/examples/assets/data/superstore.csv",
                  "format": {
                    "type": "csv"
                  }
                }
              }
            }
          ],
          "attributeMap": {
            "Profit": {
              "name": "Profit",
              "queryPhrase": [
                "profit"
              ],
              "inferenceType": "explicit",
              "matchScore": 1,
              "metric": [
                "attribute_exact_match"
              ],
              "isLabel": false,
              "encode": true,
              "isAmbiguous": false,
              "ambiguity": [],
              "meta": {
                "score": 100,
                "threshold": 85,
                "alias": null,
                "ambiguity": {},
                "confidence": 100
              }
            },
            "Region": {
              "name": "Region",
              "queryPhrase": [
                "region"
              ],
              "inferenceType": "explicit",
              "matchScore": 1,
              "metric": [
                "attribute_exact_match"
              ],
              "isLabel": false,
              "encode": true,
              "isAmbiguous": false,
              "ambiguity": [],
              "meta": {
                "score": 100,
                "threshold": 85,
                "alias": null,
                "ambiguity": {},
                "confidence": 100
              }
            },
            "Sales": {
              "name": "Sales",
              "queryPhrase": [
                "sales"
              ],
              "inferenceType": "explicit",
              "matchScore": 1,
              "metric": [
                "attribute_exact_match"
              ],
              "isLabel": false,
              "encode": true,
              "isAmbiguous": false,
              "ambiguity": [],
              "meta": {
                "score": 100,
                "threshold": 85,
                "alias": null,
                "ambiguity": {},
                "confidence": 100
              }
            }
          },
          "taskMap": {
            "correlation": [
              {
                "task": "correlation",
                "queryPhrase": [],
                "operator": null,
                "values": null,
                "matchScore": 0.5,
                "attributes": [
                  "Profit",
                  "Sales"
                ],
                "inferenceType": "implicit",
                "isAttrAmbiguous": false,
                "isValueAmbiguous": false,
                "meta": {
                  "value_ambiguity_type": null
                }
              }
            ]
          },
          "followUpQuery": false,
          "contextObj": null
        }
      },
      {
        "queryId": 107,
        "query": "Scatterplot of sales vs. profit",
        "output": {
          "status": "SUCCESS",
          "debug": {
            "execution_durations": {
              "clean_query": 0.0019068717956542969,
              "extract_attributes": 2.0659360885620117,
              "extract_vis_type": 0.000017881393432617188,
              "extract_tasks": 1.064479112625122,
              "get_vis_list": 0.00017213821411132812,
              "total": 3.132512092590332
            }
          },
          "query_raw": "Scatterplot of sales vs. profit",
          "query": "scatterplot of sales vs. profit",
          "dataset": "https://raw.githubusercontent.com/nl4dv/nl4dv/master/examples/assets/data/superstore.csv",
          "alias": "https://raw.githubusercontent.com/nl4dv/nl4dv/master/examples/assets/aliases/superstore.json",
          "visList": [
            {
              "score": 5.5,
              "scoreObj": {
                "by_attributes": 2,
                "by_task": 0.5,
                "by_vis": 1
              },
              "confidenceObj": {
                "Profit": 1,
                "Sales": 1
              },
              "attributes": [
                "Profit",
                "Sales"
              ],
              "queryPhrase": "scatterplot",
              "visType": "scatterplot",
              "tasks": [
                "correlation"
              ],
              "inferenceType": "explicit",
              "vlSpec": {
                "$schema": "https://vega.github.io/schema/vega-lite/v4.json",
                "mark": {
                  "type": "point",
                  "tooltip": true
                },
                "encoding": {
                  "x": {
                    "field": "Profit",
                    "type": "quantitative",
                    "aggregate": null,
                    "axis": {
                      "format": "s"
                    }
                  },
                  "y": {
                    "field": "Sales",
                    "type": "quantitative",
                    "aggregate": null,
                    "axis": {
                      "format": "s"
                    }
                  },
                  "tooltip": {
                    "field": "nan"
                  }
                },
                "transform": [],
                "data": {
                  "url": "https://raw.githubusercontent.com/nl4dv/nl4dv/master/examples/assets/data/superstore.csv",
                  "format": {
                    "type": "csv"
                  }
                }
              }
            }
          ],
          "attributeMap": {
            "Profit": {
              "name": "Profit",
              "queryPhrase": [
                "profit"
              ],
              "inferenceType": "explicit",
              "matchScore": 1,
              "metric": [
                "attribute_exact_match"
              ],
              "isLabel": false,
              "encode": true,
              "isAmbiguous": false,
              "ambiguity": [],
              "meta": {
                "score": 100,
                "threshold": 85,
                "alias": null,
                "ambiguity": {},
                "confidence": 100
              }
            },
            "Sales": {
              "name": "Sales",
              "queryPhrase": [
                "sales"
              ],
              "inferenceType": "explicit",
              "matchScore": 1,
              "metric": [
                "attribute_exact_match"
              ],
              "isLabel": false,
              "encode": true,
              "isAmbiguous": false,
              "ambiguity": [],
              "meta": {
                "score": 100,
                "threshold": 85,
                "alias": null,
                "ambiguity": {},
                "confidence": 100
              }
            }
          },
          "taskMap": {
            "correlation": [
              {
                "task": "correlation",
                "queryPhrase": [],
                "operator": null,
                "values": null,
                "matchScore": 0.5,
                "attributes": [
                  "Profit",
                  "Sales"
                ],
                "inferenceType": "implicit",
                "isAttrAmbiguous": false,
                "isValueAmbiguous": false,
                "meta": {
                  "value_ambiguity_type": null
                }
              }
            ]
          },
          "followUpQuery": false,
          "contextObj": null
        }
      },
      {
        "queryId": 108,
        "query": "For each data element, draw a circle at (its sales, profit) with the proper color by the region",
        "output": {
          "status": "SUCCESS",
          "debug": {
            "execution_durations": {
              "clean_query": 0.00703883171081543,
              "extract_attributes": 8.222052097320557,
              "extract_vis_type": 0.0000457763671875,
              "extract_tasks": 1.2805700302124023,
              "get_vis_list": 0.00032901763916015625,
              "total": 9.510035753250122
            }
          },
          "query_raw": "For each data element, draw a circle at (its sales, profit) with the proper color by the region",
          "query": "for each data element , draw a circle at ( its sales , profit ) with the proper color by the region",
          "dataset": "https://raw.githubusercontent.com/nl4dv/nl4dv/master/examples/assets/data/superstore.csv",
          "alias": "https://raw.githubusercontent.com/nl4dv/nl4dv/master/examples/assets/aliases/superstore.json",
          "visList": [
            {
              "score": 6.5,
              "scoreObj": {
                "by_attributes": 3,
                "by_task": 0.5,
                "by_vis": 0
              },
              "confidenceObj": {
                "Profit": 1,
                "Sales": 1,
                "Region": 1
              },
              "attributes": [
                "Profit",
                "Sales",
                "Region"
              ],
              "queryPhrase": null,
              "visType": null,
              "tasks": [
                "correlation"
              ],
              "inferenceType": "implicit",
              "vlSpec": {
                "$schema": "https://vega.github.io/schema/vega-lite/v4.json",
                "mark": {
                  "type": "point",
                  "tooltip": true
                },
                "encoding": {
                  "x": {
                    "field": "Profit",
                    "type": "quantitative",
                    "aggregate": null,
                    "axis": {
                      "format": "s"
                    }
                  },
                  "y": {
                    "field": "Sales",
                    "type": "quantitative",
                    "aggregate": null,
                    "axis": {
                      "format": "s"
                    }
                  },
                  "color": {
                    "field": "Region",
                    "type": "nominal",
                    "aggregate": null
                  },
                  "tooltip": {
                    "field": "nan"
                  }
                },
                "transform": [],
                "data": {
                  "url": "https://raw.githubusercontent.com/nl4dv/nl4dv/master/examples/assets/data/superstore.csv",
                  "format": {
                    "type": "csv"
                  }
                }
              }
            },
            {
              "score": 6.5,
              "scoreObj": {
                "by_attributes": 3,
                "by_task": 0.5,
                "by_vis": 0
              },
              "confidenceObj": {
                "Profit": 1,
                "Sales": 1,
                "Region": 1
              },
              "attributes": [
                "Profit",
                "Sales",
                "Region"
              ],
              "queryPhrase": null,
              "visType": null,
              "tasks": [
                "correlation"
              ],
              "inferenceType": "implicit",
              "vlSpec": {
                "$schema": "https://vega.github.io/schema/vega-lite/v4.json",
                "mark": {
                  "type": "point",
                  "tooltip": true
                },
                "encoding": {
                  "x": {
                    "field": "Profit",
                    "type": "quantitative",
                    "aggregate": null,
                    "axis": {
                      "format": "s"
                    }
                  },
                  "y": {
                    "field": "Sales",
                    "type": "quantitative",
                    "aggregate": null,
                    "axis": {
                      "format": "s"
                    }
                  },
                  "column": {
                    "field": "Region",
                    "type": "nominal",
                    "aggregate": null
                  },
                  "color": {
                    "field": "Region",
                    "type": "nominal",
                    "aggregate": null
                  },
                  "tooltip": {
                    "field": "nan"
                  }
                },
                "transform": [],
                "data": {
                  "url": "https://raw.githubusercontent.com/nl4dv/nl4dv/master/examples/assets/data/superstore.csv",
                  "format": {
                    "type": "csv"
                  }
                }
              }
            }
          ],
          "attributeMap": {
            "Profit": {
              "name": "Profit",
              "queryPhrase": [
                "profit"
              ],
              "inferenceType": "explicit",
              "matchScore": 1,
              "metric": [
                "attribute_exact_match"
              ],
              "isLabel": false,
              "encode": true,
              "isAmbiguous": false,
              "ambiguity": [],
              "meta": {
                "score": 100,
                "threshold": 85,
                "alias": null,
                "ambiguity": {},
                "confidence": 100
              }
            },
            "Region": {
              "name": "Region",
              "queryPhrase": [
                "region"
              ],
              "inferenceType": "explicit",
              "matchScore": 1,
              "metric": [
                "attribute_exact_match"
              ],
              "isLabel": false,
              "encode": true,
              "isAmbiguous": false,
              "ambiguity": [],
              "meta": {
                "score": 100,
                "threshold": 85,
                "alias": null,
                "ambiguity": {},
                "confidence": 100
              }
            },
            "Sales": {
              "name": "Sales",
              "queryPhrase": [
                "sales"
              ],
              "inferenceType": "explicit",
              "matchScore": 1,
              "metric": [
                "attribute_exact_match"
              ],
              "isLabel": false,
              "encode": true,
              "isAmbiguous": false,
              "ambiguity": [],
              "meta": {
                "score": 100,
                "threshold": 85,
                "alias": null,
                "ambiguity": {},
                "confidence": 100
              }
            }
          },
          "taskMap": {
            "correlation": [
              {
                "task": "correlation",
                "queryPhrase": [],
                "operator": null,
                "values": null,
                "matchScore": 0.5,
                "attributes": [
                  "Profit",
                  "Sales"
                ],
                "inferenceType": "implicit",
                "isAttrAmbiguous": false,
                "isValueAmbiguous": false,
                "meta": {
                  "value_ambiguity_type": null
                }
              }
            ]
          },
          "followUpQuery": false,
          "contextObj": null
        }
      },
      {
        "queryId": 109,
        "query": "Bar Graph AVG(Profit) by State",
        "output": {
          "status": "SUCCESS",
          "debug": {
            "execution_durations": {
              "clean_query": 0.0034360885620117188,
              "extract_attributes": 3.2407360076904297,
              "extract_vis_type": 0.00001621246337890625,
              "extract_tasks": 1.0605781078338623,
              "get_vis_list": 0.00027871131896972656,
              "total": 4.305045127868652
            }
          },
          "query_raw": "Bar Graph AVG(Profit) by State",
          "query": "bar graph avg ( profit ) by state",
          "dataset": "https://raw.githubusercontent.com/nl4dv/nl4dv/master/examples/assets/data/superstore.csv",
          "alias": "https://raw.githubusercontent.com/nl4dv/nl4dv/master/examples/assets/aliases/superstore.json",
          "visList": [
            {
              "score": 5.5,
              "scoreObj": {
                "by_attributes": 2,
                "by_task": 0.5,
                "by_vis": 1
              },
              "confidenceObj": {
                "Profit": 1,
                "State": 1
              },
              "attributes": [
                "Profit",
                "State"
              ],
              "queryPhrase": "bar graph",
              "visType": "barchart",
              "tasks": [
                "derived_value"
              ],
              "inferenceType": "explicit",
              "vlSpec": {
                "$schema": "https://vega.github.io/schema/vega-lite/v4.json",
                "mark": {
                  "type": "bar",
                  "tooltip": true
                },
                "encoding": {
                  "y": {
                    "field": "Profit",
                    "type": "quantitative",
                    "aggregate": "mean",
                    "axis": {
                      "format": "s"
                    }
                  },
                  "x": {
                    "field": "State",
                    "type": "nominal",
                    "aggregate": null
                  }
                },
                "transform": [],
                "data": {
                  "url": "https://raw.githubusercontent.com/nl4dv/nl4dv/master/examples/assets/data/superstore.csv",
                  "format": {
                    "type": "csv"
                  }
                }
              }
            }
          ],
          "attributeMap": {
            "Profit": {
              "name": "Profit",
              "queryPhrase": [
                "profit"
              ],
              "inferenceType": "explicit",
              "matchScore": 1,
              "metric": [
                "attribute_exact_match"
              ],
              "isLabel": false,
              "encode": true,
              "isAmbiguous": false,
              "ambiguity": [],
              "meta": {
                "score": 100,
                "threshold": 85,
                "alias": null,
                "ambiguity": {},
                "confidence": 100
              }
            },
            "State": {
              "name": "State",
              "queryPhrase": [
                "state"
              ],
              "inferenceType": "explicit",
              "matchScore": 1,
              "metric": [
                "attribute_exact_match"
              ],
              "isLabel": false,
              "encode": true,
              "isAmbiguous": false,
              "ambiguity": [],
              "meta": {
                "score": 100,
                "threshold": 85,
                "alias": null,
                "ambiguity": {},
                "confidence": 100
              }
            }
          },
          "taskMap": {
            "derived_value": [
              {
                "task": "derived_value",
                "queryPhrase": [],
                "operator": "AVG",
                "values": null,
                "matchScore": 0.5,
                "attributes": [
                  "Profit"
                ],
                "inferenceType": "implicit",
                "isAttrAmbiguous": false,
                "isValueAmbiguous": false,
                "meta": {
                  "value_ambiguity_type": null
                }
              }
            ]
          },
          "followUpQuery": false,
          "contextObj": null
        }
      },
      {
        "queryId": 110,
        "query": "Scatterplot Region X=Sales Y=Profit ",
        "output": {
          "status": "SUCCESS",
          "debug": {
            "execution_durations": {
              "clean_query": 0.0029850006103515625,
              "extract_attributes": 3.2018508911132812,
              "extract_vis_type": 0.000023126602172851562,
              "extract_tasks": 1.0836210250854492,
              "get_vis_list": 0.00034689903259277344,
              "total": 4.288826942443848
            }
          },
          "query_raw": "Scatterplot Region X=Sales Y=Profit ",
          "query": "scatterplot region x=sales y=profit",
          "dataset": "https://raw.githubusercontent.com/nl4dv/nl4dv/master/examples/assets/data/superstore.csv",
          "alias": "https://raw.githubusercontent.com/nl4dv/nl4dv/master/examples/assets/aliases/superstore.json",
          "visList": [
            {
              "score": 7.5,
              "scoreObj": {
                "by_attributes": 3,
                "by_task": 0.5,
                "by_vis": 1
              },
              "confidenceObj": {
                "Profit": 1,
                "Sales": 1,
                "Region": 1
              },
              "attributes": [
                "Profit",
                "Sales",
                "Region"
              ],
              "queryPhrase": "scatterplot",
              "visType": "scatterplot",
              "tasks": [
                "correlation"
              ],
              "inferenceType": "explicit",
              "vlSpec": {
                "$schema": "https://vega.github.io/schema/vega-lite/v4.json",
                "mark": {
                  "type": "point",
                  "tooltip": true
                },
                "encoding": {
                  "x": {
                    "field": "Profit",
                    "type": "quantitative",
                    "aggregate": null,
                    "axis": {
                      "format": "s"
                    }
                  },
                  "y": {
                    "field": "Sales",
                    "type": "quantitative",
                    "aggregate": null,
                    "axis": {
                      "format": "s"
                    }
                  },
                  "color": {
                    "field": "Region",
                    "type": "nominal",
                    "aggregate": null
                  },
                  "tooltip": {
                    "field": "nan"
                  }
                },
                "transform": [],
                "data": {
                  "url": "https://raw.githubusercontent.com/nl4dv/nl4dv/master/examples/assets/data/superstore.csv",
                  "format": {
                    "type": "csv"
                  }
                }
              }
            },
            {
              "score": 7.5,
              "scoreObj": {
                "by_attributes": 3,
                "by_task": 0.5,
                "by_vis": 1
              },
              "confidenceObj": {
                "Profit": 1,
                "Sales": 1,
                "Region": 1
              },
              "attributes": [
                "Profit",
                "Sales",
                "Region"
              ],
              "queryPhrase": "scatterplot",
              "visType": "scatterplot",
              "tasks": [
                "correlation"
              ],
              "inferenceType": "explicit",
              "vlSpec": {
                "$schema": "https://vega.github.io/schema/vega-lite/v4.json",
                "mark": {
                  "type": "point",
                  "tooltip": true
                },
                "encoding": {
                  "x": {
                    "field": "Profit",
                    "type": "quantitative",
                    "aggregate": null,
                    "axis": {
                      "format": "s"
                    }
                  },
                  "y": {
                    "field": "Sales",
                    "type": "quantitative",
                    "aggregate": null,
                    "axis": {
                      "format": "s"
                    }
                  },
                  "column": {
                    "field": "Region",
                    "type": "nominal",
                    "aggregate": null
                  },
                  "color": {
                    "field": "Region",
                    "type": "nominal",
                    "aggregate": null
                  },
                  "tooltip": {
                    "field": "nan"
                  }
                },
                "transform": [],
                "data": {
                  "url": "https://raw.githubusercontent.com/nl4dv/nl4dv/master/examples/assets/data/superstore.csv",
                  "format": {
                    "type": "csv"
                  }
                }
              }
            }
          ],
          "attributeMap": {
            "Profit": {
              "name": "Profit",
              "queryPhrase": [
                "profit"
              ],
              "inferenceType": "explicit",
              "matchScore": 1,
              "metric": [
                "attribute_exact_match"
              ],
              "isLabel": false,
              "encode": true,
              "isAmbiguous": false,
              "ambiguity": [],
              "meta": {
                "score": 100,
                "threshold": 85,
                "alias": null,
                "ambiguity": {},
                "confidence": 100
              }
            },
            "Region": {
              "name": "Region",
              "queryPhrase": [
                "region"
              ],
              "inferenceType": "explicit",
              "matchScore": 1,
              "metric": [
                "attribute_exact_match"
              ],
              "isLabel": false,
              "encode": true,
              "isAmbiguous": false,
              "ambiguity": [],
              "meta": {
                "score": 100,
                "threshold": 85,
                "alias": null,
                "ambiguity": {},
                "confidence": 100
              }
            },
            "Sales": {
              "name": "Sales",
              "queryPhrase": [
                "sales"
              ],
              "inferenceType": "explicit",
              "matchScore": 1,
              "metric": [
                "attribute_exact_match"
              ],
              "isLabel": false,
              "encode": true,
              "isAmbiguous": false,
              "ambiguity": [],
              "meta": {
                "score": 100,
                "threshold": 85,
                "alias": null,
                "ambiguity": {},
                "confidence": 100
              }
            }
          },
          "taskMap": {
            "correlation": [
              {
                "task": "correlation",
                "queryPhrase": [],
                "operator": null,
                "values": null,
                "matchScore": 0.5,
                "attributes": [
                  "Profit",
                  "Sales"
                ],
                "inferenceType": "implicit",
                "isAttrAmbiguous": false,
                "isValueAmbiguous": false,
                "meta": {
                  "value_ambiguity_type": null
                }
              }
            ]
          },
          "followUpQuery": false,
          "contextObj": null
        }
      },
      {
        "queryId": 111,
        "query": "Stacked Barchart Ship Status X=Region Y=SUM(Profit)",
        "output": {
          "status": "SUCCESS",
          "debug": {
            "execution_durations": {
              "clean_query": 0.006577730178833008,
              "extract_attributes": 7.9602720737457275,
              "extract_vis_type": 0.00004220008850097656,
              "extract_tasks": 1.1583797931671143,
              "get_vis_list": 0.0004649162292480469,
              "total": 9.125736713409424
            }
          },
          "query_raw": "Stacked Barchart Ship Status X=Region Y=SUM(Profit)",
          "query": "stacked barchart ship status x=region y=sum ( profit )",
          "dataset": "https://raw.githubusercontent.com/nl4dv/nl4dv/master/examples/assets/data/superstore.csv",
          "alias": "https://raw.githubusercontent.com/nl4dv/nl4dv/master/examples/assets/aliases/superstore.json",
          "visList": [
            {
              "score": 8,
              "scoreObj": {
                "by_attributes": 3,
                "by_task": 1,
                "by_vis": 1
              },
              "confidenceObj": {
                "Profit": 1,
                "Ship Status": 1,
                "Region": 1
              },
              "attributes": [
                "Profit",
                "Ship Status",
                "Region"
              ],
              "queryPhrase": "barchart",
              "visType": "barchart",
              "tasks": [
                "derived_value"
              ],
              "inferenceType": "explicit",
              "vlSpec": {
                "$schema": "https://vega.github.io/schema/vega-lite/v4.json",
                "mark": {
                  "type": "bar",
                  "tooltip": true
                },
                "encoding": {
                  "y": {
                    "field": "Profit",
                    "type": "quantitative",
                    "aggregate": "sum",
                    "axis": {
                      "format": "s"
                    }
                  },
                  "x": {
                    "field": "Ship Status",
                    "type": "nominal",
                    "aggregate": null
                  },
                  "color": {
                    "field": "Region",
                    "type": "nominal",
                    "aggregate": null
                  }
                },
                "transform": [],
                "data": {
                  "url": "https://raw.githubusercontent.com/nl4dv/nl4dv/master/examples/assets/data/superstore.csv",
                  "format": {
                    "type": "csv"
                  }
                }
              }
            },
            {
              "score": 8,
              "scoreObj": {
                "by_attributes": 3,
                "by_task": 1,
                "by_vis": 1
              },
              "confidenceObj": {
                "Profit": 1,
                "Ship Status": 1,
                "Region": 1
              },
              "attributes": [
                "Profit",
                "Ship Status",
                "Region"
              ],
              "queryPhrase": "barchart",
              "visType": "barchart",
              "tasks": [
                "derived_value"
              ],
              "inferenceType": "explicit",
              "vlSpec": {
                "$schema": "https://vega.github.io/schema/vega-lite/v4.json",
                "mark": {
                  "type": "bar",
                  "tooltip": true
                },
                "encoding": {
                  "y": {
                    "field": "Profit",
                    "type": "quantitative",
                    "aggregate": "sum",
                    "axis": {
                      "format": "s"
                    }
                  },
                  "column": {
                    "field": "Ship Status",
                    "type": "nominal",
                    "aggregate": null
                  },
                  "x": {
                    "field": "Region",
                    "type": "nominal",
                    "aggregate": null
                  },
                  "color": {
                    "field": "Ship Status",
                    "type": "nominal",
                    "aggregate": null
                  }
                },
                "transform": [],
                "data": {
                  "url": "https://raw.githubusercontent.com/nl4dv/nl4dv/master/examples/assets/data/superstore.csv",
                  "format": {
                    "type": "csv"
                  }
                }
              }
            }
          ],
          "attributeMap": {
            "Ship Status": {
              "name": "Ship Status",
              "queryPhrase": [
                "ship status"
              ],
              "inferenceType": "explicit",
              "matchScore": 1,
              "metric": [
                "attribute_exact_match"
              ],
              "isLabel": false,
              "encode": true,
              "isAmbiguous": false,
              "ambiguity": [],
              "meta": {
                "score": 100,
                "threshold": 85,
                "alias": null,
                "ambiguity": {},
                "confidence": 100
              }
            },
            "Profit": {
              "name": "Profit",
              "queryPhrase": [
                "profit"
              ],
              "inferenceType": "explicit",
              "matchScore": 1,
              "metric": [
                "attribute_exact_match"
              ],
              "isLabel": false,
              "encode": true,
              "isAmbiguous": false,
              "ambiguity": [],
              "meta": {
                "score": 100,
                "threshold": 85,
                "alias": null,
                "ambiguity": {},
                "confidence": 100
              }
            },
            "Region": {
              "name": "Region",
              "queryPhrase": [
                "region"
              ],
              "inferenceType": "explicit",
              "matchScore": 1,
              "metric": [
                "attribute_exact_match"
              ],
              "isLabel": false,
              "encode": true,
              "isAmbiguous": false,
              "ambiguity": [],
              "meta": {
                "score": 100,
                "threshold": 85,
                "alias": null,
                "ambiguity": {},
                "confidence": 100
              }
            }
          },
          "taskMap": {
            "derived_value": [
              {
                "task": "derived_value",
                "queryPhrase": "sum",
                "operator": "SUM",
                "values": [],
                "matchScore": 1,
                "attributes": [
                  "Profit"
                ],
                "inferenceType": "explicit",
                "isAttrAmbiguous": false,
                "isValueAmbiguous": false,
                "meta": {
                  "value_ambiguity_type": null
                }
              }
            ]
          },
          "followUpQuery": false,
          "contextObj": null
        }
      },
      {
        "queryId": 112,
        "query": "Bar Chart Count by Sub-Category",
        "output": {
          "status": "SUCCESS",
          "debug": {
            "execution_durations": {
              "clean_query": 0.0030028820037841797,
              "extract_attributes": 3.1952879428863525,
              "extract_vis_type": 0.000015735626220703125,
              "extract_tasks": 1.0333881378173828,
              "get_vis_list": 0.0001659393310546875,
              "total": 4.231860637664795
            }
          },
          "query_raw": "Bar Chart Count by Sub-Category",
          "query": "bar chart count by sub-category",
          "dataset": "https://raw.githubusercontent.com/nl4dv/nl4dv/master/examples/assets/data/superstore.csv",
          "alias": "https://raw.githubusercontent.com/nl4dv/nl4dv/master/examples/assets/aliases/superstore.json",
          "visList": [
            {
              "score": 3.5,
              "scoreObj": {
                "by_attributes": 1,
                "by_task": 0.5,
                "by_vis": 1
              },
              "confidenceObj": {
                "Category": 1
              },
              "attributes": [
                "Category"
              ],
              "queryPhrase": "bar chart",
              "visType": "barchart",
              "tasks": [
                "distribution"
              ],
              "inferenceType": "explicit",
              "vlSpec": {
                "$schema": "https://vega.github.io/schema/vega-lite/v4.json",
                "mark": {
                  "type": "bar",
                  "tooltip": true
                },
                "encoding": {
                  "x": {
                    "field": "Category",
                    "type": "nominal",
                    "aggregate": null
                  },
                  "y": {
                    "field": "Category",
                    "type": "nominal",
                    "aggregate": "count"
                  }
                },
                "transform": [],
                "data": {
                  "url": "https://raw.githubusercontent.com/nl4dv/nl4dv/master/examples/assets/data/superstore.csv",
                  "format": {
                    "type": "csv"
                  }
                }
              }
            }
          ],
          "attributeMap": {
            "Category": {
              "name": "Category",
              "queryPhrase": [
                "category"
              ],
              "inferenceType": "explicit",
              "matchScore": 1,
              "metric": [
                "attribute_exact_match"
              ],
              "isLabel": false,
              "encode": true,
              "isAmbiguous": false,
              "ambiguity": [],
              "meta": {
                "score": 100,
                "threshold": 85,
                "alias": null,
                "ambiguity": {},
                "confidence": 100
              }
            }
          },
          "taskMap": {
            "distribution": [
              {
                "task": "distribution",
                "queryPhrase": [],
                "operator": null,
                "values": null,
                "matchScore": 0.5,
                "attributes": [
                  "Category"
                ],
                "inferenceType": "implicit",
                "isAttrAmbiguous": false,
                "isValueAmbiguous": false,
                "meta": {
                  "value_ambiguity_type": null
                }
              }
            ]
          },
          "followUpQuery": false,
          "contextObj": null
        }
      },
      {
        "queryId": 113,
        "query": "Create bar chart based on state and AVG(Profit)",
        "output": {
          "status": "SUCCESS",
          "debug": {
            "execution_durations": {
              "clean_query": 0.0063669681549072266,
              "extract_attributes": 6.074798107147217,
              "extract_vis_type": 0.000029087066650390625,
              "extract_tasks": 1.0588250160217285,
              "get_vis_list": 0.00026798248291015625,
              "total": 7.140287160873413
            }
          },
          "query_raw": "Create bar chart based on state and AVG(Profit)",
          "query": "create bar chart based on state and avg ( profit )",
          "dataset": "https://raw.githubusercontent.com/nl4dv/nl4dv/master/examples/assets/data/superstore.csv",
          "alias": "https://raw.githubusercontent.com/nl4dv/nl4dv/master/examples/assets/aliases/superstore.json",
          "visList": [
            {
              "score": 5.5,
              "scoreObj": {
                "by_attributes": 2,
                "by_task": 0.5,
                "by_vis": 1
              },
              "confidenceObj": {
                "Profit": 1,
                "State": 1
              },
              "attributes": [
                "Profit",
                "State"
              ],
              "queryPhrase": "bar chart",
              "visType": "barchart",
              "tasks": [
                "derived_value"
              ],
              "inferenceType": "explicit",
              "vlSpec": {
                "$schema": "https://vega.github.io/schema/vega-lite/v4.json",
                "mark": {
                  "type": "bar",
                  "tooltip": true
                },
                "encoding": {
                  "y": {
                    "field": "Profit",
                    "type": "quantitative",
                    "aggregate": "mean",
                    "axis": {
                      "format": "s"
                    }
                  },
                  "x": {
                    "field": "State",
                    "type": "nominal",
                    "aggregate": null
                  }
                },
                "transform": [],
                "data": {
                  "url": "https://raw.githubusercontent.com/nl4dv/nl4dv/master/examples/assets/data/superstore.csv",
                  "format": {
                    "type": "csv"
                  }
                }
              }
            }
          ],
          "attributeMap": {
            "Profit": {
              "name": "Profit",
              "queryPhrase": [
                "profit"
              ],
              "inferenceType": "explicit",
              "matchScore": 1,
              "metric": [
                "attribute_exact_match"
              ],
              "isLabel": false,
              "encode": true,
              "isAmbiguous": false,
              "ambiguity": [],
              "meta": {
                "score": 100,
                "threshold": 85,
                "alias": null,
                "ambiguity": {},
                "confidence": 100
              }
            },
            "State": {
              "name": "State",
              "queryPhrase": [
                "state"
              ],
              "inferenceType": "explicit",
              "matchScore": 1,
              "metric": [
                "attribute_exact_match"
              ],
              "isLabel": false,
              "encode": true,
              "isAmbiguous": false,
              "ambiguity": [],
              "meta": {
                "score": 100,
                "threshold": 85,
                "alias": null,
                "ambiguity": {},
                "confidence": 100
              }
            }
          },
          "taskMap": {
            "derived_value": [
              {
                "task": "derived_value",
                "queryPhrase": [],
                "operator": "AVG",
                "values": null,
                "matchScore": 0.5,
                "attributes": [
                  "Profit"
                ],
                "inferenceType": "implicit",
                "isAttrAmbiguous": false,
                "isValueAmbiguous": false,
                "meta": {
                  "value_ambiguity_type": null
                }
              }
            ]
          },
          "followUpQuery": false,
          "contextObj": null
        }
      },
      {
        "queryId": 114,
        "query": "show a line chart of semi sales by category",
        "output": {
          "status": "SUCCESS",
          "debug": {
            "execution_durations": {
              "clean_query": 0.00452423095703125,
              "extract_attributes": 4.555485963821411,
              "extract_vis_type": 0.000023126602172851562,
              "extract_tasks": 1.063866138458252,
              "get_vis_list": 0.0003018379211425781,
              "total": 5.62420129776001
            }
          },
          "query_raw": "show a line chart of semi sales by category",
          "query": "show a line chart of semi sales by category",
          "dataset": "https://raw.githubusercontent.com/nl4dv/nl4dv/master/examples/assets/data/superstore.csv",
          "alias": "https://raw.githubusercontent.com/nl4dv/nl4dv/master/examples/assets/aliases/superstore.json",
          "visList": [
            {
              "score": 5.5,
              "scoreObj": {
                "by_attributes": 2,
                "by_task": 0.5,
                "by_vis": 1
              },
              "confidenceObj": {
                "Sales": 1,
                "Category": 1
              },
              "attributes": [
                "Sales",
                "Category"
              ],
              "queryPhrase": "line chart",
              "visType": "linechart",
              "tasks": [
                "derived_value"
              ],
              "inferenceType": "explicit",
              "vlSpec": {
                "$schema": "https://vega.github.io/schema/vega-lite/v4.json",
                "mark": {
                  "type": "line",
                  "tooltip": true
                },
                "encoding": {
                  "y": {
                    "field": "Sales",
                    "type": "quantitative",
                    "aggregate": "mean",
                    "axis": {
                      "format": "s"
                    }
                  },
                  "x": {
                    "field": "Category",
                    "type": "nominal",
                    "aggregate": null
                  }
                },
                "transform": [],
                "data": {
                  "url": "https://raw.githubusercontent.com/nl4dv/nl4dv/master/examples/assets/data/superstore.csv",
                  "format": {
                    "type": "csv"
                  }
                }
              }
            }
          ],
          "attributeMap": {
            "Category": {
              "name": "Category",
              "queryPhrase": [
                "category"
              ],
              "inferenceType": "explicit",
              "matchScore": 1,
              "metric": [
                "attribute_exact_match"
              ],
              "isLabel": false,
              "encode": true,
              "isAmbiguous": false,
              "ambiguity": [],
              "meta": {
                "score": 100,
                "threshold": 85,
                "alias": null,
                "ambiguity": {},
                "confidence": 100
              }
            },
            "Sales": {
              "name": "Sales",
              "queryPhrase": [
                "sales"
              ],
              "inferenceType": "explicit",
              "matchScore": 1,
              "metric": [
                "attribute_exact_match"
              ],
              "isLabel": false,
              "encode": true,
              "isAmbiguous": false,
              "ambiguity": [],
              "meta": {
                "score": 100,
                "threshold": 85,
                "alias": null,
                "ambiguity": {},
                "confidence": 100
              }
            }
          },
          "taskMap": {
            "derived_value": [
              {
                "task": "derived_value",
                "queryPhrase": [],
                "operator": "AVG",
                "values": null,
                "matchScore": 0.5,
                "attributes": [
                  "Sales"
                ],
                "inferenceType": "implicit",
                "isAttrAmbiguous": false,
                "isValueAmbiguous": false,
                "meta": {
                  "value_ambiguity_type": null
                }
              }
            ]
          },
          "followUpQuery": false,
          "contextObj": null
        }
      },
      {
        "queryId": 115,
        "query": "Ship Mode Bar Chart AVG(Profit) by Segment)",
        "output": {
          "status": "SUCCESS",
          "debug": {
            "execution_durations": {
              "clean_query": 0.005686044692993164,
              "extract_attributes": 6.166064023971558,
              "extract_vis_type": 0.000026702880859375,
              "extract_tasks": 1.0699012279510498,
              "get_vis_list": 0.0004627704620361328,
              "total": 7.242140769958496
            }
          },
          "query_raw": "Ship Mode Bar Chart AVG(Profit) by Segment)",
          "query": "ship mode bar chart avg ( profit ) by segment )",
          "dataset": "https://raw.githubusercontent.com/nl4dv/nl4dv/master/examples/assets/data/superstore.csv",
          "alias": "https://raw.githubusercontent.com/nl4dv/nl4dv/master/examples/assets/aliases/superstore.json",
          "visList": [
            {
              "score": 7.5,
              "scoreObj": {
                "by_attributes": 3,
                "by_task": 0.5,
                "by_vis": 1
              },
              "confidenceObj": {
                "Profit": 1,
                "Segment": 1,
                "Ship Mode": 1
              },
              "attributes": [
                "Profit",
                "Segment",
                "Ship Mode"
              ],
              "queryPhrase": "bar chart",
              "visType": "barchart",
              "tasks": [
                "derived_value"
              ],
              "inferenceType": "explicit",
              "vlSpec": {
                "$schema": "https://vega.github.io/schema/vega-lite/v4.json",
                "mark": {
                  "type": "bar",
                  "tooltip": true
                },
                "encoding": {
                  "y": {
                    "field": "Profit",
                    "type": "quantitative",
                    "aggregate": "mean",
                    "axis": {
                      "format": "s"
                    }
                  },
                  "x": {
                    "field": "Segment",
                    "type": "nominal",
                    "aggregate": null
                  },
                  "color": {
                    "field": "Ship Mode",
                    "type": "nominal",
                    "aggregate": null
                  }
                },
                "transform": [],
                "data": {
                  "url": "https://raw.githubusercontent.com/nl4dv/nl4dv/master/examples/assets/data/superstore.csv",
                  "format": {
                    "type": "csv"
                  }
                }
              }
            },
            {
              "score": 7.5,
              "scoreObj": {
                "by_attributes": 3,
                "by_task": 0.5,
                "by_vis": 1
              },
              "confidenceObj": {
                "Profit": 1,
                "Segment": 1,
                "Ship Mode": 1
              },
              "attributes": [
                "Profit",
                "Segment",
                "Ship Mode"
              ],
              "queryPhrase": "bar chart",
              "visType": "barchart",
              "tasks": [
                "derived_value"
              ],
              "inferenceType": "explicit",
              "vlSpec": {
                "$schema": "https://vega.github.io/schema/vega-lite/v4.json",
                "mark": {
                  "type": "bar",
                  "tooltip": true
                },
                "encoding": {
                  "y": {
                    "field": "Profit",
                    "type": "quantitative",
                    "aggregate": "mean",
                    "axis": {
                      "format": "s"
                    }
                  },
                  "column": {
                    "field": "Segment",
                    "type": "nominal",
                    "aggregate": null
                  },
                  "x": {
                    "field": "Ship Mode",
                    "type": "nominal",
                    "aggregate": null
                  },
                  "color": {
                    "field": "Segment",
                    "type": "nominal",
                    "aggregate": null
                  }
                },
                "transform": [],
                "data": {
                  "url": "https://raw.githubusercontent.com/nl4dv/nl4dv/master/examples/assets/data/superstore.csv",
                  "format": {
                    "type": "csv"
                  }
                }
              }
            }
          ],
          "attributeMap": {
            "Profit": {
              "name": "Profit",
              "queryPhrase": [
                "profit"
              ],
              "inferenceType": "explicit",
              "matchScore": 1,
              "metric": [
                "attribute_exact_match"
              ],
              "isLabel": false,
              "encode": true,
              "isAmbiguous": false,
              "ambiguity": [],
              "meta": {
                "score": 100,
                "threshold": 85,
                "alias": null,
                "ambiguity": {},
                "confidence": 100
              }
            },
            "Segment": {
              "name": "Segment",
              "queryPhrase": [
                "segment"
              ],
              "inferenceType": "explicit",
              "matchScore": 1,
              "metric": [
                "attribute_exact_match"
              ],
              "isLabel": false,
              "encode": true,
              "isAmbiguous": false,
              "ambiguity": [],
              "meta": {
                "score": 100,
                "threshold": 85,
                "alias": null,
                "ambiguity": {},
                "confidence": 100
              }
            },
            "Ship Mode": {
              "name": "Ship Mode",
              "queryPhrase": [
                "ship mode"
              ],
              "inferenceType": "explicit",
              "matchScore": 1,
              "metric": [
                "attribute_exact_match"
              ],
              "isLabel": false,
              "encode": true,
              "isAmbiguous": false,
              "ambiguity": [],
              "meta": {
                "score": 100,
                "threshold": 85,
                "alias": null,
                "ambiguity": {},
                "confidence": 100
              }
            }
          },
          "taskMap": {
            "derived_value": [
              {
                "task": "derived_value",
                "queryPhrase": [],
                "operator": "AVG",
                "values": null,
                "matchScore": 0.5,
                "attributes": [
                  "Profit"
                ],
                "inferenceType": "implicit",
                "isAttrAmbiguous": false,
                "isValueAmbiguous": false,
                "meta": {
                  "value_ambiguity_type": null
                }
              }
            ]
          },
          "followUpQuery": false,
          "contextObj": null
        }
      },
      {
        "queryId": 116,
        "query": "Show a bar graph by region showing the various ship status",
        "output": {
          "status": "SUCCESS",
          "debug": {
            "execution_durations": {
              "clean_query": 0.008003950119018555,
              "extract_attributes": 8.040245056152344,
              "extract_vis_type": 0.00003314018249511719,
              "extract_tasks": 1.119339942932129,
              "get_vis_list": 0.00023484230041503906,
              "total": 9.167856931686401
            }
          },
          "query_raw": "Show a bar graph by region showing the various ship status",
          "query": "show a bar graph by region showing the various ship status",
          "dataset": "https://raw.githubusercontent.com/nl4dv/nl4dv/master/examples/assets/data/superstore.csv",
          "alias": "https://raw.githubusercontent.com/nl4dv/nl4dv/master/examples/assets/aliases/superstore.json",
          "visList": [
            {
              "score": 5.5,
              "scoreObj": {
                "by_attributes": 2,
                "by_task": 0.5,
                "by_vis": 1
              },
              "confidenceObj": {
                "Ship Status": 1,
                "Region": 1
              },
              "attributes": [
                "Ship Status",
                "Region"
              ],
              "queryPhrase": "bar graph",
              "visType": "barchart",
              "tasks": [
                "distribution"
              ],
              "inferenceType": "explicit",
              "vlSpec": {
                "$schema": "https://vega.github.io/schema/vega-lite/v4.json",
                "mark": {
                  "type": "bar",
                  "tooltip": true
                },
                "encoding": {
                  "x": {
                    "field": "Ship Status",
                    "type": "nominal",
                    "aggregate": null
                  },
                  "color": {
                    "field": "Region",
                    "type": "nominal",
                    "aggregate": null
                  },
                  "y": {
                    "field": "Ship Status",
                    "type": "nominal",
                    "aggregate": "count"
                  }
                },
                "transform": [],
                "data": {
                  "url": "https://raw.githubusercontent.com/nl4dv/nl4dv/master/examples/assets/data/superstore.csv",
                  "format": {
                    "type": "csv"
                  }
                }
              }
            }
          ],
          "attributeMap": {
            "Ship Status": {
              "name": "Ship Status",
              "queryPhrase": [
                "ship status"
              ],
              "inferenceType": "explicit",
              "matchScore": 1,
              "metric": [
                "attribute_exact_match"
              ],
              "isLabel": false,
              "encode": true,
              "isAmbiguous": false,
              "ambiguity": [],
              "meta": {
                "score": 100,
                "threshold": 85,
                "alias": null,
                "ambiguity": {},
                "confidence": 100
              }
            },
            "Region": {
              "name": "Region",
              "queryPhrase": [
                "region"
              ],
              "inferenceType": "explicit",
              "matchScore": 1,
              "metric": [
                "attribute_exact_match"
              ],
              "isLabel": false,
              "encode": true,
              "isAmbiguous": false,
              "ambiguity": [],
              "meta": {
                "score": 100,
                "threshold": 85,
                "alias": null,
                "ambiguity": {},
                "confidence": 100
              }
            }
          },
          "taskMap": {
            "distribution": [
              {
                "task": "distribution",
                "queryPhrase": [],
                "operator": null,
                "values": null,
                "matchScore": 0.5,
                "attributes": [
                  "Ship Status",
                  "Region"
                ],
                "inferenceType": "implicit",
                "isAttrAmbiguous": false,
                "isValueAmbiguous": false,
                "meta": {
                  "value_ambiguity_type": null
                }
              }
            ]
          },
          "followUpQuery": false,
          "contextObj": null
        }
      },
      {
        "queryId": 117,
        "query": "Show correlation between sales and profit",
        "output": {
          "status": "SUCCESS",
          "debug": {
            "execution_durations": {
              "clean_query": 0.0024423599243164062,
              "extract_attributes": 2.1066951751708984,
              "extract_vis_type": 0.000019073486328125,
              "extract_tasks": 1.0195319652557373,
              "get_vis_list": 0.00022983551025390625,
              "total": 3.128918409347534
            }
          },
          "query_raw": "Show correlation between sales and profit",
          "query": "show correlation between sales and profit",
          "dataset": "https://raw.githubusercontent.com/nl4dv/nl4dv/master/examples/assets/data/superstore.csv",
          "alias": "https://raw.githubusercontent.com/nl4dv/nl4dv/master/examples/assets/aliases/superstore.json",
          "visList": [
            {
              "score": 5,
              "scoreObj": {
                "by_attributes": 2,
                "by_task": 1,
                "by_vis": 0
              },
              "confidenceObj": {
                "Profit": 1,
                "Sales": 1
              },
              "attributes": [
                "Profit",
                "Sales"
              ],
              "queryPhrase": null,
              "visType": null,
              "tasks": [
                "correlation"
              ],
              "inferenceType": "implicit",
              "vlSpec": {
                "$schema": "https://vega.github.io/schema/vega-lite/v4.json",
                "mark": {
                  "type": "point",
                  "tooltip": true
                },
                "encoding": {
                  "x": {
                    "field": "Profit",
                    "type": "quantitative",
                    "aggregate": null,
                    "axis": {
                      "format": "s"
                    }
                  },
                  "y": {
                    "field": "Sales",
                    "type": "quantitative",
                    "aggregate": null,
                    "axis": {
                      "format": "s"
                    }
                  },
                  "tooltip": {
                    "field": "nan"
                  }
                },
                "transform": [],
                "data": {
                  "url": "https://raw.githubusercontent.com/nl4dv/nl4dv/master/examples/assets/data/superstore.csv",
                  "format": {
                    "type": "csv"
                  }
                }
              }
            }
          ],
          "attributeMap": {
            "Profit": {
              "name": "Profit",
              "queryPhrase": [
                "profit"
              ],
              "inferenceType": "explicit",
              "matchScore": 1,
              "metric": [
                "attribute_exact_match"
              ],
              "isLabel": false,
              "encode": true,
              "isAmbiguous": false,
              "ambiguity": [],
              "meta": {
                "score": 100,
                "threshold": 85,
                "alias": null,
                "ambiguity": {},
                "confidence": 100
              }
            },
            "Sales": {
              "name": "Sales",
              "queryPhrase": [
                "sales"
              ],
              "inferenceType": "explicit",
              "matchScore": 1,
              "metric": [
                "attribute_exact_match"
              ],
              "isLabel": false,
              "encode": true,
              "isAmbiguous": false,
              "ambiguity": [],
              "meta": {
                "score": 100,
                "threshold": 85,
                "alias": null,
                "ambiguity": {},
                "confidence": 100
              }
            }
          },
          "taskMap": {
            "correlation": [
              {
                "task": "correlation",
                "queryPhrase": "correlation",
                "operator": null,
                "values": [],
                "matchScore": 1,
                "attributes": [
                  "Profit",
                  "Sales"
                ],
                "inferenceType": "explicit",
                "isAttrAmbiguous": false,
                "isValueAmbiguous": false,
                "meta": {
                  "value_ambiguity_type": null
                }
              }
            ]
          },
          "followUpQuery": false,
          "contextObj": null
        }
      },
      {
        "queryId": 118,
        "query": "show profit vs sales as scatter plot', 'use a different color for each region",
        "output": {
          "status": "SUCCESS",
          "debug": {
            "execution_durations": {
              "clean_query": 0.010415792465209961,
              "extract_attributes": 9.937179327011108,
              "extract_vis_type": 0.00004482269287109375,
              "extract_tasks": 1.1805758476257324,
              "get_vis_list": 0.00033211708068847656,
              "total": 11.12854790687561
            }
          },
          "query_raw": "show profit vs sales as scatter plot', 'use a different color for each region",
          "query": "show profit vs sales as scatter plot ' , 'use a different color for each region",
          "dataset": "https://raw.githubusercontent.com/nl4dv/nl4dv/master/examples/assets/data/superstore.csv",
          "alias": "https://raw.githubusercontent.com/nl4dv/nl4dv/master/examples/assets/aliases/superstore.json",
          "visList": [
            {
              "score": 7.5,
              "scoreObj": {
                "by_attributes": 3,
                "by_task": 0.5,
                "by_vis": 1
              },
              "confidenceObj": {
                "Profit": 1,
                "Sales": 1,
                "Region": 1
              },
              "attributes": [
                "Profit",
                "Sales",
                "Region"
              ],
              "queryPhrase": "scatter plot",
              "visType": "scatterplot",
              "tasks": [
                "correlation"
              ],
              "inferenceType": "explicit",
              "vlSpec": {
                "$schema": "https://vega.github.io/schema/vega-lite/v4.json",
                "mark": {
                  "type": "point",
                  "tooltip": true
                },
                "encoding": {
                  "x": {
                    "field": "Profit",
                    "type": "quantitative",
                    "aggregate": null,
                    "axis": {
                      "format": "s"
                    }
                  },
                  "y": {
                    "field": "Sales",
                    "type": "quantitative",
                    "aggregate": null,
                    "axis": {
                      "format": "s"
                    }
                  },
                  "color": {
                    "field": "Region",
                    "type": "nominal",
                    "aggregate": null
                  },
                  "tooltip": {
                    "field": "nan"
                  }
                },
                "transform": [],
                "data": {
                  "url": "https://raw.githubusercontent.com/nl4dv/nl4dv/master/examples/assets/data/superstore.csv",
                  "format": {
                    "type": "csv"
                  }
                }
              }
            },
            {
              "score": 7.5,
              "scoreObj": {
                "by_attributes": 3,
                "by_task": 0.5,
                "by_vis": 1
              },
              "confidenceObj": {
                "Profit": 1,
                "Sales": 1,
                "Region": 1
              },
              "attributes": [
                "Profit",
                "Sales",
                "Region"
              ],
              "queryPhrase": "scatter plot",
              "visType": "scatterplot",
              "tasks": [
                "correlation"
              ],
              "inferenceType": "explicit",
              "vlSpec": {
                "$schema": "https://vega.github.io/schema/vega-lite/v4.json",
                "mark": {
                  "type": "point",
                  "tooltip": true
                },
                "encoding": {
                  "x": {
                    "field": "Profit",
                    "type": "quantitative",
                    "aggregate": null,
                    "axis": {
                      "format": "s"
                    }
                  },
                  "y": {
                    "field": "Sales",
                    "type": "quantitative",
                    "aggregate": null,
                    "axis": {
                      "format": "s"
                    }
                  },
                  "column": {
                    "field": "Region",
                    "type": "nominal",
                    "aggregate": null
                  },
                  "color": {
                    "field": "Region",
                    "type": "nominal",
                    "aggregate": null
                  },
                  "tooltip": {
                    "field": "nan"
                  }
                },
                "transform": [],
                "data": {
                  "url": "https://raw.githubusercontent.com/nl4dv/nl4dv/master/examples/assets/data/superstore.csv",
                  "format": {
                    "type": "csv"
                  }
                }
              }
            }
          ],
          "attributeMap": {
            "Profit": {
              "name": "Profit",
              "queryPhrase": [
                "profit"
              ],
              "inferenceType": "explicit",
              "matchScore": 1,
              "metric": [
                "attribute_exact_match"
              ],
              "isLabel": false,
              "encode": true,
              "isAmbiguous": false,
              "ambiguity": [],
              "meta": {
                "score": 100,
                "threshold": 85,
                "alias": null,
                "ambiguity": {},
                "confidence": 100
              }
            },
            "Region": {
              "name": "Region",
              "queryPhrase": [
                "region"
              ],
              "inferenceType": "explicit",
              "matchScore": 1,
              "metric": [
                "attribute_exact_match"
              ],
              "isLabel": false,
              "encode": true,
              "isAmbiguous": false,
              "ambiguity": [],
              "meta": {
                "score": 100,
                "threshold": 85,
                "alias": null,
                "ambiguity": {},
                "confidence": 100
              }
            },
            "Sales": {
              "name": "Sales",
              "queryPhrase": [
                "sales"
              ],
              "inferenceType": "explicit",
              "matchScore": 1,
              "metric": [
                "attribute_exact_match"
              ],
              "isLabel": false,
              "encode": true,
              "isAmbiguous": false,
              "ambiguity": [],
              "meta": {
                "score": 100,
                "threshold": 85,
                "alias": null,
                "ambiguity": {},
                "confidence": 100
              }
            }
          },
          "taskMap": {
            "correlation": [
              {
                "task": "correlation",
                "queryPhrase": [],
                "operator": null,
                "values": null,
                "matchScore": 0.5,
                "attributes": [
                  "Profit",
                  "Sales"
                ],
                "inferenceType": "implicit",
                "isAttrAmbiguous": false,
                "isValueAmbiguous": false,
                "meta": {
                  "value_ambiguity_type": null
                }
              }
            ]
          },
          "followUpQuery": false,
          "contextObj": null
        }
      },
      {
        "queryId": 119,
        "query": "show the average profit by state",
        "output": {
          "status": "SUCCESS",
          "debug": {
            "execution_durations": {
              "clean_query": 0.0020599365234375,
              "extract_attributes": 2.1005666255950928,
              "extract_vis_type": 0.0000209808349609375,
              "extract_tasks": 1.0493669509887695,
              "get_vis_list": 0.0002999305725097656,
              "total": 3.1523144245147705
            }
          },
          "query_raw": "show the average profit by state",
          "query": "show the average profit by state",
          "dataset": "https://raw.githubusercontent.com/nl4dv/nl4dv/master/examples/assets/data/superstore.csv",
          "alias": "https://raw.githubusercontent.com/nl4dv/nl4dv/master/examples/assets/aliases/superstore.json",
          "visList": [
            {
              "score": 5,
              "scoreObj": {
                "by_attributes": 2,
                "by_task": 1,
                "by_vis": 0
              },
              "confidenceObj": {
                "Profit": 1,
                "State": 1
              },
              "attributes": [
                "Profit",
                "State"
              ],
              "queryPhrase": null,
              "visType": null,
              "tasks": [
                "derived_value"
              ],
              "inferenceType": "implicit",
              "vlSpec": {
                "$schema": "https://vega.github.io/schema/vega-lite/v4.json",
                "mark": {
                  "type": "bar",
                  "tooltip": true
                },
                "encoding": {
                  "y": {
                    "field": "Profit",
                    "type": "quantitative",
                    "aggregate": "mean",
                    "axis": {
                      "format": "s"
                    }
                  },
                  "x": {
                    "field": "State",
                    "type": "nominal",
                    "aggregate": null
                  }
                },
                "transform": [],
                "data": {
                  "url": "https://raw.githubusercontent.com/nl4dv/nl4dv/master/examples/assets/data/superstore.csv",
                  "format": {
                    "type": "csv"
                  }
                }
              }
            }
          ],
          "attributeMap": {
            "Profit": {
              "name": "Profit",
              "queryPhrase": [
                "profit"
              ],
              "inferenceType": "explicit",
              "matchScore": 1,
              "metric": [
                "attribute_exact_match"
              ],
              "isLabel": false,
              "encode": true,
              "isAmbiguous": false,
              "ambiguity": [],
              "meta": {
                "score": 100,
                "threshold": 85,
                "alias": null,
                "ambiguity": {},
                "confidence": 100
              }
            },
            "State": {
              "name": "State",
              "queryPhrase": [
                "state"
              ],
              "inferenceType": "explicit",
              "matchScore": 1,
              "metric": [
                "attribute_exact_match"
              ],
              "isLabel": false,
              "encode": true,
              "isAmbiguous": false,
              "ambiguity": [],
              "meta": {
                "score": 100,
                "threshold": 85,
                "alias": null,
                "ambiguity": {},
                "confidence": 100
              }
            }
          },
          "taskMap": {
            "derived_value": [
              {
                "task": "derived_value",
                "queryPhrase": "average",
                "operator": "AVG",
                "values": [],
                "matchScore": 1,
                "attributes": [
                  "Profit"
                ],
                "inferenceType": "explicit",
                "isAttrAmbiguous": false,
                "isValueAmbiguous": false,
                "meta": {
                  "value_ambiguity_type": null
                }
              }
            ]
          },
          "followUpQuery": false,
          "contextObj": null
        }
      },
      {
        "queryId": 120,
        "query": "Can you create a graph showing sales and profit by region?",
        "output": {
          "status": "SUCCESS",
          "debug": {
            "execution_durations": {
              "clean_query": 0.0044400691986083984,
              "extract_attributes": 4.6334850788116455,
              "extract_vis_type": 0.000029802322387695312,
              "extract_tasks": 1.1210989952087402,
              "get_vis_list": 0.0003199577331542969,
              "total": 5.759373903274536
            }
          },
          "query_raw": "Can you create a graph showing sales and profit by region?",
          "query": "can you create a graph showing sales and profit by region ?",
          "dataset": "https://raw.githubusercontent.com/nl4dv/nl4dv/master/examples/assets/data/superstore.csv",
          "alias": "https://raw.githubusercontent.com/nl4dv/nl4dv/master/examples/assets/aliases/superstore.json",
          "visList": [
            {
              "score": 6.5,
              "scoreObj": {
                "by_attributes": 3,
                "by_task": 0.5,
                "by_vis": 0
              },
              "confidenceObj": {
                "Profit": 1,
                "Sales": 1,
                "Region": 1
              },
              "attributes": [
                "Profit",
                "Sales",
                "Region"
              ],
              "queryPhrase": null,
              "visType": null,
              "tasks": [
                "correlation"
              ],
              "inferenceType": "implicit",
              "vlSpec": {
                "$schema": "https://vega.github.io/schema/vega-lite/v4.json",
                "mark": {
                  "type": "point",
                  "tooltip": true
                },
                "encoding": {
                  "x": {
                    "field": "Profit",
                    "type": "quantitative",
                    "aggregate": null,
                    "axis": {
                      "format": "s"
                    }
                  },
                  "y": {
                    "field": "Sales",
                    "type": "quantitative",
                    "aggregate": null,
                    "axis": {
                      "format": "s"
                    }
                  },
                  "color": {
                    "field": "Region",
                    "type": "nominal",
                    "aggregate": null
                  },
                  "tooltip": {
                    "field": "nan"
                  }
                },
                "transform": [],
                "data": {
                  "url": "https://raw.githubusercontent.com/nl4dv/nl4dv/master/examples/assets/data/superstore.csv",
                  "format": {
                    "type": "csv"
                  }
                }
              }
            },
            {
              "score": 6.5,
              "scoreObj": {
                "by_attributes": 3,
                "by_task": 0.5,
                "by_vis": 0
              },
              "confidenceObj": {
                "Profit": 1,
                "Sales": 1,
                "Region": 1
              },
              "attributes": [
                "Profit",
                "Sales",
                "Region"
              ],
              "queryPhrase": null,
              "visType": null,
              "tasks": [
                "correlation"
              ],
              "inferenceType": "implicit",
              "vlSpec": {
                "$schema": "https://vega.github.io/schema/vega-lite/v4.json",
                "mark": {
                  "type": "point",
                  "tooltip": true
                },
                "encoding": {
                  "x": {
                    "field": "Profit",
                    "type": "quantitative",
                    "aggregate": null,
                    "axis": {
                      "format": "s"
                    }
                  },
                  "y": {
                    "field": "Sales",
                    "type": "quantitative",
                    "aggregate": null,
                    "axis": {
                      "format": "s"
                    }
                  },
                  "column": {
                    "field": "Region",
                    "type": "nominal",
                    "aggregate": null
                  },
                  "color": {
                    "field": "Region",
                    "type": "nominal",
                    "aggregate": null
                  },
                  "tooltip": {
                    "field": "nan"
                  }
                },
                "transform": [],
                "data": {
                  "url": "https://raw.githubusercontent.com/nl4dv/nl4dv/master/examples/assets/data/superstore.csv",
                  "format": {
                    "type": "csv"
                  }
                }
              }
            }
          ],
          "attributeMap": {
            "Profit": {
              "name": "Profit",
              "queryPhrase": [
                "profit"
              ],
              "inferenceType": "explicit",
              "matchScore": 1,
              "metric": [
                "attribute_exact_match"
              ],
              "isLabel": false,
              "encode": true,
              "isAmbiguous": false,
              "ambiguity": [],
              "meta": {
                "score": 100,
                "threshold": 85,
                "alias": null,
                "ambiguity": {},
                "confidence": 100
              }
            },
            "Region": {
              "name": "Region",
              "queryPhrase": [
                "region"
              ],
              "inferenceType": "explicit",
              "matchScore": 1,
              "metric": [
                "attribute_exact_match"
              ],
              "isLabel": false,
              "encode": true,
              "isAmbiguous": false,
              "ambiguity": [],
              "meta": {
                "score": 100,
                "threshold": 85,
                "alias": null,
                "ambiguity": {},
                "confidence": 100
              }
            },
            "Sales": {
              "name": "Sales",
              "queryPhrase": [
                "sales"
              ],
              "inferenceType": "explicit",
              "matchScore": 1,
              "metric": [
                "attribute_exact_match"
              ],
              "isLabel": false,
              "encode": true,
              "isAmbiguous": false,
              "ambiguity": [],
              "meta": {
                "score": 100,
                "threshold": 85,
                "alias": null,
                "ambiguity": {},
                "confidence": 100
              }
            }
          },
          "taskMap": {
            "correlation": [
              {
                "task": "correlation",
                "queryPhrase": [],
                "operator": null,
                "values": null,
                "matchScore": 0.5,
                "attributes": [
                  "Profit",
                  "Sales"
                ],
                "inferenceType": "implicit",
                "isAttrAmbiguous": false,
                "isValueAmbiguous": false,
                "meta": {
                  "value_ambiguity_type": null
                }
              }
            ]
          },
          "followUpQuery": false,
          "contextObj": null
        }
      },
      {
        "queryId": 121,
        "query": "Show me by region sales and profits for all products bought by Gary Hansen",
        "output": {
          "status": "SUCCESS",
          "debug": {
            "execution_durations": {
              "clean_query": 0.007528066635131836,
              "extract_attributes": 7.93222188949585,
              "extract_vis_type": 0.00004291534423828125,
              "extract_tasks": 1.1261839866638184,
              "get_vis_list": 0.00022721290588378906,
              "total": 9.066204071044922
            }
          },
          "query_raw": "Show me by region sales and profits for all products bought by Gary Hansen",
          "query": "show me by region sales and profits for all products bought by gary hansen",
          "dataset": "https://raw.githubusercontent.com/nl4dv/nl4dv/master/examples/assets/data/superstore.csv",
          "alias": "https://raw.githubusercontent.com/nl4dv/nl4dv/master/examples/assets/aliases/superstore.json",
          "visList": [
            {
              "score": 4.9,
              "scoreObj": {
                "by_attributes": 3.9,
                "by_task": 1,
                "by_vis": 0
              },
              "attributes": [
                "Profit",
                "Sales",
                "Region",
                "Product Name"
              ],
              "visType": "datatable",
              "queryPhrase": null,
              "tasks": [
                "filter"
              ],
              "inferenceType": "implicit",
              "vlSpec": {
                "$schema": "https://vega.github.io/schema/vega-lite/v4.json",
                "transform": [
                  {
                    "window": [
                      {
                        "op": "row_number",
                        "as": "row_number"
                      }
                    ]
                  }
                ],
                "hconcat": [
                  {
                    "width": 150,
                    "title": "Profit",
                    "mark": "text",
                    "transform": [
                      {
                        "filter": {
                          "field": "Customer Name",
                          "oneOf": [
                            "Gary Hansen"
                          ]
                        }
                      },
                      {
                        "filter": {
                          "field": "Customer Name",
                          "oneOf": [
                            "Gary Hansen"
                          ]
                        }
                      },
                      {
                        "filter": {
                          "field": "Customer Name",
                          "oneOf": [
                            "Gary Hansen"
                          ]
                        }
                      },
                      {
                        "filter": {
                          "field": "Customer Name",
                          "oneOf": [
                            "Gary Hansen"
                          ]
                        }
                      }
                    ],
                    "encoding": {
                      "text": {
                        "field": "Profit",
                        "type": "nominal"
                      },
                      "y": {
                        "field": "row_number",
                        "type": "ordinal",
                        "axis": null
                      }
                    }
                  },
                  {
                    "width": 150,
                    "title": "Sales",
                    "mark": "text",
                    "transform": [
                      {
                        "filter": {
                          "field": "Customer Name",
                          "oneOf": [
                            "Gary Hansen"
                          ]
                        }
                      },
                      {
                        "filter": {
                          "field": "Customer Name",
                          "oneOf": [
                            "Gary Hansen"
                          ]
                        }
                      },
                      {
                        "filter": {
                          "field": "Customer Name",
                          "oneOf": [
                            "Gary Hansen"
                          ]
                        }
                      }
                    ],
                    "encoding": {
                      "text": {
                        "field": "Sales",
                        "type": "nominal"
                      },
                      "y": {
                        "field": "row_number",
                        "type": "ordinal",
                        "axis": null
                      }
                    }
                  },
                  {
                    "width": 150,
                    "title": "Region",
                    "mark": "text",
                    "transform": [
                      {
                        "filter": {
                          "field": "Customer Name",
                          "oneOf": [
                            "Gary Hansen"
                          ]
                        }
                      },
                      {
                        "filter": {
                          "field": "Customer Name",
                          "oneOf": [
                            "Gary Hansen"
                          ]
                        }
                      }
                    ],
                    "encoding": {
                      "text": {
                        "field": "Region",
                        "type": "nominal"
                      },
                      "y": {
                        "field": "row_number",
                        "type": "ordinal",
                        "axis": null
                      }
                    }
                  },
                  {
                    "width": 150,
                    "title": "Product Name",
                    "mark": "text",
                    "transform": [
                      {
                        "filter": {
                          "field": "Customer Name",
                          "oneOf": [
                            "Gary Hansen"
                          ]
                        }
                      }
                    ],
                    "encoding": {
                      "text": {
                        "field": "Product Name",
                        "type": "nominal"
                      },
                      "y": {
                        "field": "row_number",
                        "type": "ordinal",
                        "axis": null
                      }
                    }
                  }
                ],
                "data": {
                  "url": "https://raw.githubusercontent.com/nl4dv/nl4dv/master/examples/assets/data/superstore.csv",
                  "format": {
                    "type": "csv"
                  }
                }
              }
            }
          ],
          "attributeMap": {
            "Profit": {
              "name": "Profit",
              "queryPhrase": [
                "profits"
              ],
              "inferenceType": "explicit",
              "matchScore": 1,
              "metric": [
                "attribute_exact_match"
              ],
              "isLabel": false,
              "encode": true,
              "isAmbiguous": false,
              "ambiguity": [],
              "meta": {
                "score": 100,
                "threshold": 85,
                "alias": null,
                "ambiguity": {},
                "confidence": 100
              }
            },
            "Region": {
              "name": "Region",
              "queryPhrase": [
                "region"
              ],
              "inferenceType": "explicit",
              "matchScore": 1,
              "metric": [
                "attribute_exact_match"
              ],
              "isLabel": false,
              "encode": true,
              "isAmbiguous": false,
              "ambiguity": [],
              "meta": {
                "score": 100,
                "threshold": 85,
                "alias": null,
                "ambiguity": {},
                "confidence": 100
              }
            },
            "Sales": {
              "name": "Sales",
              "queryPhrase": [
                "sales"
              ],
              "inferenceType": "explicit",
              "matchScore": 1,
              "metric": [
                "attribute_exact_match"
              ],
              "isLabel": false,
              "encode": true,
              "isAmbiguous": false,
              "ambiguity": [],
              "meta": {
                "score": 100,
                "threshold": 85,
                "alias": null,
                "ambiguity": {},
                "confidence": 100
              }
            },
            "Product Name": {
              "name": "Product Name",
              "queryPhrase": [
                "products"
              ],
              "inferenceType": "explicit",
              "matchScore": 0.9,
              "metric": [
                "attribute_similarity_match"
              ],
              "isLabel": false,
              "encode": true,
              "isAmbiguous": false,
              "ambiguity": [],
              "meta": {
                "score": 100,
                "threshold": 85,
                "alias": null,
                "ambiguity": {},
                "confidence": 100
              }
            },
            "Customer Name": {
              "name": "Customer Name",
              "queryPhrase": [
                "gary hansen"
              ],
              "inferenceType": "implicit",
              "matchScore": 0.5,
              "metric": [
                "attribute_domain_value_match"
              ],
              "isLabel": false,
              "isAmbiguous": false,
              "ambiguity": [],
              "encode": false,
              "meta": {
                "score": null,
                "threshold": null,
                "alias": null,
                "ambiguity": {
                  "gary hansen": [
                    "Gary Hansen"
                  ]
                },
                "confidence": 100
              }
            }
          },
          "taskMap": {
            "filter": [
              {
                "task": "filter",
                "queryPhrase": [
                  "gary hansen"
                ],
                "operator": "IN",
                "values": [
                  "Gary Hansen"
                ],
                "matchScore": 1,
                "attributes": [
                  "Customer Name"
                ],
                "inferenceType": "explicit",
                "isAttrAmbiguous": false,
                "isValueAmbiguous": false,
                "meta": {
                  "value_ambiguity_type": null
                }
              }
            ]
          },
          "followUpQuery": false,
          "contextObj": null
        }
      }
    ]
  }
}
